-- ============================================================
-- Limpar pedidos de teste
-- Execute no SQL Editor do Supabase
-- ATENÇÃO: apaga TODOS os pedidos e itens permanentemente
-- ============================================================

-- 1. Apaga os itens (CASCADE já faz isso, mas por segurança)
DELETE FROM public.itens_pedido;

-- 2. Apaga todos os pedidos
DELETE FROM public.pedidos;

-- 3. Reseta o contador numero_seq para começar em #1 novamente
ALTER TABLE public.pedidos ALTER COLUMN numero_seq RESTART WITH 1;
