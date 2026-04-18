-- ============================================================
-- Limpar pedidos de HOJE (fuso Brasília)
-- Execute no SQL Editor do Supabase
-- ATENÇÃO: apaga permanentemente os pedidos do dia atual
-- ============================================================

-- 1. Apaga os itens dos pedidos de hoje
DELETE FROM public.itens_pedido
WHERE pedido_id IN (
  SELECT id FROM public.pedidos
  WHERE created_at::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date
);

-- 2. Apaga os pedidos de hoje
DELETE FROM public.pedidos
WHERE created_at::date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::date;

-- 3. Reseta o numero_seq para continuar do último pedido restante
SELECT setval(
  pg_get_serial_sequence('public.pedidos', 'numero_seq'),
  COALESCE((SELECT MAX(numero_seq) FROM public.pedidos), 0)
);
