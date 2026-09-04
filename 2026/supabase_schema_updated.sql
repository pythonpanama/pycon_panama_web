-- ====================================================================
-- Script SQL para Actualizar las Tablas en Supabase (PyCon Panamá 2026)
-- Copia y ejecuta este script en el SQL Editor de tu panel de Supabase
-- ====================================================================

-- 1. Asegurar columnas dedicadas en la tabla 'public.registrations'
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS dias TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS expectativas TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS accessibility TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS consent_photos BOOLEAN DEFAULT FALSE;

-- Habilitar RLS e Inserción pública en 'public.registrations'
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercion publica registrations" ON public.registrations;
CREATE POLICY "Permitir insercion publica registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Seguridad: estos registros contienen datos personales. El navegador solo
-- puede insertar; nunca debe poder leer, actualizar o borrar filas existentes.
-- REVOKE FROM PUBLIC cubre privilegios heredados por anon/authenticated.
REVOKE ALL PRIVILEGES ON TABLE public.registrations FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.registrations FROM anon, authenticated;
GRANT INSERT ON TABLE public.registrations TO anon, authenticated;


-- 2. Asegurar columnas dedicadas en la tabla 'public.speakers'
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS affiliation TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS nivel TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS modalidad TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Español';
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS links TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS consent_publication BOOLEAN DEFAULT FALSE;

-- Habilitar RLS e Inserción pública en 'public.speakers'
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercion publica speakers" ON public.speakers;
CREATE POLICY "Permitir insercion publica speakers"
ON public.speakers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Misma protección para postulaciones: solo inserción pública, sin lectura.
REVOKE ALL PRIVILEGES ON TABLE public.speakers FROM PUBLIC;
REVOKE ALL PRIVILEGES ON TABLE public.speakers FROM anon, authenticated;
GRANT INSERT ON TABLE public.speakers TO anon, authenticated;
