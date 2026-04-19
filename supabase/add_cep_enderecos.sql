-- Adicionar coluna CEP na tabela enderecos
ALTER TABLE public.enderecos ADD COLUMN IF NOT EXISTS cep text;
