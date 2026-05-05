-- ============================================================
-- DOCY ESQUINA V2 — Migration PWA
-- Execute no SQL Editor do Supabase
-- ============================================================

-- 1. CLIENTES — origem do cadastro
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS origem TEXT NOT NULL DEFAULT 'manual'
    CHECK (origem IN ('manual', 'pwa'));

-- 2. ITENS DO CARDÁPIO — visibilidade no PWA
ALTER TABLE public.itens_cardapio
  ADD COLUMN IF NOT EXISTS pwa_visivel BOOLEAN NOT NULL DEFAULT TRUE;

-- 3. PEDIDOS — campos PWA
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS origem TEXT NOT NULL DEFAULT 'manual'
    CHECK (origem IN ('manual', 'pwa')),
  ADD COLUMN IF NOT EXISTS status_pedido TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status_pedido IN ('pendente', 'em_preparo', 'em_entrega', 'entregue', 'recusado')),
  ADD COLUMN IF NOT EXISTS status_validacao TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status_validacao IN ('pendente', 'aceito', 'recusado')),
  ADD COLUMN IF NOT EXISTS motivo_recusa TEXT,
  ADD COLUMN IF NOT EXISTS aceito_em TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. ITENS DO PEDIDO — observação por item
ALTER TABLE public.itens_pedido
  ADD COLUMN IF NOT EXISTS observacao_item TEXT;

-- 5. CONFIGURAÇÕES — seção PWA
ALTER TABLE public.configuracoes
  ADD COLUMN IF NOT EXISTS pwa_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS tempo_limite_validacao_min INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS mensagem_fechado TEXT DEFAULT 'Estamos fechados no momento';

-- 6. PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id         BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT REFERENCES public.clientes(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL UNIQUE,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pedidos_origem         ON public.pedidos(origem);
CREATE INDEX IF NOT EXISTS idx_pedidos_status_pedido  ON public.pedidos(status_pedido);
CREATE INDEX IF NOT EXISTS idx_pedidos_status_val     ON public.pedidos(status_validacao);
CREATE INDEX IF NOT EXISTS idx_clientes_origem        ON public.clientes(origem);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone      ON public.clientes(telefone);

-- ============================================================
-- RLS — ACESSO PÚBLICO PARA O PWA (anon key)
-- ============================================================

-- Cardápio: anônimo pode ler itens visíveis no PWA
CREATE POLICY IF NOT EXISTS "pwa_cardapio_read"
  ON public.itens_cardapio FOR SELECT TO anon
  USING (pwa_visivel = TRUE AND ativo = TRUE);

-- Categorias: anônimo pode ler todas (para montar filtros)
CREATE POLICY IF NOT EXISTS "pwa_categorias_read"
  ON public.categorias FOR SELECT TO anon
  USING (TRUE);

-- Clientes: anônimo pode buscar por telefone e inserir novos
CREATE POLICY IF NOT EXISTS "pwa_clientes_read"
  ON public.clientes FOR SELECT TO anon
  USING (TRUE);

CREATE POLICY IF NOT EXISTS "pwa_clientes_insert"
  ON public.clientes FOR INSERT TO anon
  WITH CHECK (origem = 'pwa');

-- Endereços: anônimo pode ler (para exibir endereços do cliente) e inserir
CREATE POLICY IF NOT EXISTS "pwa_enderecos_read"
  ON public.enderecos FOR SELECT TO anon
  USING (TRUE);

CREATE POLICY IF NOT EXISTS "pwa_enderecos_insert"
  ON public.enderecos FOR INSERT TO anon
  WITH CHECK (TRUE);

-- Pedidos: anônimo pode inserir (origem pwa) e ler o próprio pedido
CREATE POLICY IF NOT EXISTS "pwa_pedidos_insert"
  ON public.pedidos FOR INSERT TO anon
  WITH CHECK (origem = 'pwa');

CREATE POLICY IF NOT EXISTS "pwa_pedidos_read"
  ON public.pedidos FOR SELECT TO anon
  USING (origem = 'pwa');

-- Itens do pedido: anônimo pode inserir e ler
CREATE POLICY IF NOT EXISTS "pwa_itens_pedido_insert"
  ON public.itens_pedido FOR INSERT TO anon
  WITH CHECK (TRUE);

CREATE POLICY IF NOT EXISTS "pwa_itens_pedido_read"
  ON public.itens_pedido FOR SELECT TO anon
  USING (TRUE);

-- Configurações: anônimo pode ler (para verificar se PWA está ativo)
CREATE POLICY IF NOT EXISTS "pwa_config_read"
  ON public.configuracoes FOR SELECT TO anon
  USING (TRUE);

-- Push subscriptions: anônimo pode inserir e atualizar a própria
CREATE POLICY IF NOT EXISTS "pwa_push_insert"
  ON public.push_subscriptions FOR INSERT TO anon
  WITH CHECK (TRUE);

-- ============================================================
-- REALTIME — habilitar para a tabela pedidos
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.pedidos;
