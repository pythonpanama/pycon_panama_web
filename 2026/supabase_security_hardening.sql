-- ====================================================================
-- Protección de datos personales: PyCon Panamá 2026 (#113)
-- Ejecutar una sola vez en el SQL Editor de Supabase, como administrador.
-- Esta transacción no borra ni modifica filas existentes.
-- ====================================================================

BEGIN;

-- El sitio público solo crea registros. RLS limita las filas y los
-- privilegios de tabla impiden SELECT, UPDATE y DELETE aun si quedó una
-- política de lectura heredada. PUBLIC se revoca explícitamente porque
-- anon y authenticated pueden heredar sus permisos.
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.registrations FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.registrations FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.speakers FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.speakers FROM anon, authenticated;

-- Se conserva únicamente la inserción que requieren registro.html y
-- speaker.html. Las políticas RLS de INSERT ya se gestionan en
-- supabase_schema_updated.sql; no se eliminan ni alteran datos aquí.
GRANT INSERT ON TABLE public.registrations TO anon, authenticated;
GRANT INSERT ON TABLE public.speakers TO anon, authenticated;

COMMIT;

-- Verificación posterior (consultar con la clave anónima, nunca como admin):
-- GET /rest/v1/registrations?select=*&limit=1  -> sin filas ni datos.
-- GET /rest/v1/speakers?select=*&limit=1       -> sin filas ni datos.
-- Enviar un formulario válido debe seguir devolviendo éxito sin retornar la fila.
