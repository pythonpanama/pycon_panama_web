(function(){
    function getConfig(){
        return window.SUPABASE_CONFIG || null;
    }

    async function submitToSupabase(table, payload){
        const cfg = getConfig();
        if(!cfg || !cfg.url || !cfg.anonKey){
            throw new Error('Falta configuración de Supabase. Crea /form/config.js con las credenciales.');
        }
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

    function serializeForm(form){
        const data = {};
        const fm = new FormData(form);
        for(const [k,v] of fm.entries()){
            // Normalize checkbox values
            if(typeof v === 'string'){
                data[k] = v;
            }
        }
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