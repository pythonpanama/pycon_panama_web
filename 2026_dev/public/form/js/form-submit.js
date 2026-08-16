(function(){
    function getConfig(){
        return window.SUPABASE_CONFIG || null;
    }

    async function submitToSupabase(table, payload){
        const cfg = getConfig();
        const secureEndpoint = cfg && cfg.secureEndpoint;
        // If secureEndpoint configured, try server-side proxy first
        if (secureEndpoint){
            try{
                const r = await fetch(secureEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ table, payload })
                });
                const text = await r.text();
                if(!r.ok) throw new Error('Server error: ' + r.status + ' ' + text);
                try{ return JSON.parse(text); }catch(e){ return text; }
            }catch(err){
                console.warn('Secure endpoint failed, falling back to client-side if configured', err);
            }
        }

        // Fallback to direct client-side POST using anonKey (requires RLS allowing inserts)
        if(cfg && cfg.url && cfg.anonKey){
            const url = cfg.url.replace(/\/$/,'') + '/rest/v1/' + table;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': cfg.anonKey,
                    'Authorization': 'Bearer ' + cfg.anonKey,
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
            });
            if(!res.ok){
                const text = await res.text();
                throw new Error('Error al enviar: ' + res.status + ' ' + text);
            }
            return res.json();
        }

        throw new Error('No hay un endpoint seguro ni credenciales de cliente configuradas');
    }

    function serializeForm(form){
        const data = {};
        const fm = new FormData(form);
        for(const [k,v] of fm.entries()){
            // Normalize checkbox values and booleans
            try{
                const el = form.elements[k];
                if(el && el.type === 'checkbox'){
                    data[k] = (v === '1' || v === 'on');
                    continue;
                }
            }catch(e){}
            if(typeof v === 'string'){
                data[k] = v;
            }
        }
        // Remove fields not in the DB schema
        if(data.page) delete data.page;
        return data;
    }

    function attach(formId){
        const form = document.getElementById(formId);
        if(!form) return;
        const message = form.querySelector('#form-message');
        form.addEventListener('submit', async (ev) =>{
            ev.preventDefault();
            message.textContent = 'Enviando...';
            const table = form.dataset.table;
            const payload = serializeForm(form);
            try{
                await submitToSupabase(table, payload);
                message.textContent = 'Enviado correctamente. Gracias.';
                form.reset();
            }catch(e){
                console.error(e);
                message.textContent = 'Error enviando formulario. Ver consola.';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () =>{
        attach('speaker-form');
        attach('registro-form');
    });
})();