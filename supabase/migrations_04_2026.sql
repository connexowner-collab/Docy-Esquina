-- Tornar endereco_id opcional (para retirada na loja)
ALTER TABLE public.pedidos ALTER COLUMN endereco_id DROP NOT NULL;

-- Adicionar campo pago nos pedidos
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS pago boolean DEFAULT false;
