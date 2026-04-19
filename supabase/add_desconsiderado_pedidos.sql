-- Adicionar coluna desconsiderado na tabela pedidos
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS desconsiderado boolean DEFAULT false;
