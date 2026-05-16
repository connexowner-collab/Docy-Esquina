-- Pedido para consumo no local (sem cadastro de cliente)

-- 1. Tornar cliente_id opcional
ALTER TABLE public.pedidos ALTER COLUMN cliente_id DROP NOT NULL;

-- 2. Adicionar nome do cliente para pedidos locais
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS nome_local TEXT;

-- 3. Adicionar 'local' ao tipo_entrega
ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_tipo_entrega_check;
ALTER TABLE public.pedidos ADD CONSTRAINT pedidos_tipo_entrega_check
  CHECK (tipo_entrega IN ('entrega', 'retirada', 'local'));
