-- Tabela para taxas fixas de entrega por bairro
CREATE TABLE IF NOT EXISTS public.taxas_bairro (
  id serial PRIMARY KEY,
  bairro text NOT NULL UNIQUE,
  taxa decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Permissões RLS (anon/service_role)
ALTER TABLE public.taxas_bairro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all" ON public.taxas_bairro FOR ALL USING (true) WITH CHECK (true);
