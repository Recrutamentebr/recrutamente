-- Adicionar coluna slug na tabela jobs
ALTER TABLE public.jobs ADD COLUMN slug TEXT;

-- Criar índice único para o slug
CREATE UNIQUE INDEX idx_jobs_slug ON public.jobs(slug);

-- Gerar slugs para vagas existentes baseado no título
UPDATE public.jobs 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRANSLATE(title, 'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ', 'aaaaaeeeeiiiioooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'),
      '[^a-zA-Z0-9\s-]', '', 'g'
    ),
    '\s+', '-', 'g'
  )
) || '-' || SUBSTRING(id::text, 1, 8)
WHERE slug IS NULL;

-- Tornar coluna NOT NULL após preencher
ALTER TABLE public.jobs ALTER COLUMN slug SET NOT NULL;