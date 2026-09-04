-- ====================================================================
-- Script SQL para Actualizar las Tablas en Supabase (PyCon Panamá 2026)
-- Copia y ejecuta este script en el SQL Editor de tu panel de Supabase
--
-- IMPORTANTE: ejecútalo ANTES de desplegar el frontend que envía columnas
-- nuevas. Si el frontend manda una columna que la tabla no tiene, PostgREST
-- responde 400 y el registro falla para todo el mundo.
-- ====================================================================

-- 1. Asegurar columnas dedicadas en la tabla 'public.registrations'
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS dias TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS expectativas TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS accessibility TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS consent_photos BOOLEAN DEFAULT FALSE;

-- Aceptación del Código de Conducta: no basta el booleano, hay que saber qué
-- versión del texto aceptó cada persona y cuándo (ver COC_VERSION en
-- 2026/js/supabase-config.js).
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS consent_coc BOOLEAN DEFAULT FALSE;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS consent_coc_version TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS consent_coc_at TIMESTAMPTZ;

-- Habilitar RLS e Inserción pública en 'public.registrations'
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercion publica registrations" ON public.registrations;
CREATE POLICY "Permitir insercion publica registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


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

-- Aceptación del Código de Conducta: no basta el booleano, hay que saber qué
-- versión del texto aceptó cada persona y cuándo (ver COC_VERSION en
-- 2026/js/supabase-config.js).
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS consent_coc BOOLEAN DEFAULT FALSE;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS consent_coc_version TEXT;
ALTER TABLE public.speakers ADD COLUMN IF NOT EXISTS consent_coc_at TIMESTAMPTZ;

-- Habilitar RLS e Inserción pública en 'public.speakers'
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir insercion publica speakers" ON public.speakers;
CREATE POLICY "Permitir insercion publica speakers"
ON public.speakers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
