-- Campos detalhados do endereço de origem (estabelecimento)
ALTER TABLE public.configuracoes
  ADD COLUMN IF NOT EXISTS cep_origem text DEFAULT '',
  ADD COLUMN IF NOT EXISTS numero_origem text DEFAULT '',
  ADD COLUMN IF NOT EXISTS bairro_origem text DEFAULT '',
  ADD COLUMN IF NOT EXISTS cidade_origem text DEFAULT '',
  ADD COLUMN IF NOT EXISTS uf_origem text DEFAULT '';
