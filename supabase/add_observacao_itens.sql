-- Adicionar coluna observacao em itens_pedido
ALTER TABLE public.itens_pedido
  ADD COLUMN IF NOT EXISTS observacao text;
