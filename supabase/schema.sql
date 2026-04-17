-- ============================================================
-- DOCY ESQUINA — Schema completo
-- Execute no SQL Editor do Supabase (Project Settings > SQL Editor)
-- ============================================================

-- 1. CLIENTES
create table if not exists public.clientes (
  id          bigserial primary key,
  nome        text not null,
  telefone    text not null unique,
  created_at  timestamptz not null default now()
);

-- 2. ENDEREÇOS (vinculados a clientes)
create table if not exists public.enderecos (
  id           bigserial primary key,
  cliente_id   bigint not null references public.clientes(id) on delete cascade,
  logradouro   text not null,
  numero       text not null,
  complemento  text,
  bairro       text not null,
  referencia   text,
  lat          double precision,
  lng          double precision,
  created_at   timestamptz not null default now()
);

-- 3. CATEGORIAS DO CARDÁPIO
create table if not exists public.categorias (
  id         bigserial primary key,
  nome       text not null,
  ordem      integer not null default 0,
  created_at timestamptz not null default now()
);

-- 4. ITENS DO CARDÁPIO
create table if not exists public.itens_cardapio (
  id           bigserial primary key,
  categoria_id bigint not null references public.categorias(id) on delete restrict,
  nome         text not null,
  descricao    text,
  preco        numeric(10,2) not null,
  ativo        boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 5. PEDIDOS
create table if not exists public.pedidos (
  id           bigserial primary key,
  numero_seq   bigint not null generated always as identity (start with 1 increment by 1),
  cliente_id   bigint not null references public.clientes(id) on delete restrict,
  endereco_id  bigint not null references public.enderecos(id) on delete restrict,
  distancia_km numeric(6,2) not null default 0,
  taxa_entrega numeric(10,2) not null default 0,
  taxa_manual  numeric(10,2),
  subtotal     numeric(10,2) not null,
  total        numeric(10,2) not null,
  pagamento    text not null check (pagamento in ('dinheiro','pix','debito','credito')),
  troco        numeric(10,2),
  observacoes  text,
  created_at   timestamptz not null default now()
);

-- 6. ITENS DO PEDIDO (snapshot no momento da venda)
create table if not exists public.itens_pedido (
  id                bigserial primary key,
  pedido_id         bigint not null references public.pedidos(id) on delete cascade,
  item_cardapio_id  bigint references public.itens_cardapio(id) on delete set null,
  nome_snapshot     text not null,
  preco_snapshot    numeric(10,2) not null,
  quantidade        integer not null default 1,
  subtotal          numeric(10,2) not null,
  created_at        timestamptz not null default now()
);

-- 7. CONFIGURAÇÕES DO ESTABELECIMENTO (uma única linha, id = 1)
create table if not exists public.configuracoes (
  id                    integer primary key default 1 check (id = 1),
  nome_estabelecimento  text not null default 'Docy Esquina',
  telefone              text not null default '',
  endereco_origem       text not null default '',
  lat_origem            double precision,
  lng_origem            double precision,
  taxa_minima           numeric(10,2) not null default 5.00,
  km_base               numeric(6,2) not null default 2.00,
  valor_por_km          numeric(10,2) not null default 2.00,
  km_maximo             numeric(6,2) not null default 15.00
);

-- Garante que sempre há exatamente uma linha de configuração
insert into public.configuracoes (id) values (1)
on conflict (id) do nothing;

-- ============================================================
-- ÍNDICES (performance)
-- ============================================================
create index if not exists idx_enderecos_cliente_id      on public.enderecos(cliente_id);
create index if not exists idx_itens_cardapio_categoria  on public.itens_cardapio(categoria_id);
create index if not exists idx_pedidos_cliente_id        on public.pedidos(cliente_id);
create index if not exists idx_pedidos_created_at        on public.pedidos(created_at desc);
create index if not exists idx_itens_pedido_pedido_id    on public.itens_pedido(pedido_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Permite acesso apenas a usuários autenticados
-- ============================================================
alter table public.clientes        enable row level security;
alter table public.enderecos       enable row level security;
alter table public.categorias      enable row level security;
alter table public.itens_cardapio  enable row level security;
alter table public.pedidos         enable row level security;
alter table public.itens_pedido    enable row level security;
alter table public.configuracoes   enable row level security;

-- Políticas: usuário autenticado pode fazer tudo
create policy "auth_all" on public.clientes        for all to authenticated using (true) with check (true);
create policy "auth_all" on public.enderecos       for all to authenticated using (true) with check (true);
create policy "auth_all" on public.categorias      for all to authenticated using (true) with check (true);
create policy "auth_all" on public.itens_cardapio  for all to authenticated using (true) with check (true);
create policy "auth_all" on public.pedidos         for all to authenticated using (true) with check (true);
create policy "auth_all" on public.itens_pedido    for all to authenticated using (true) with check (true);
create policy "auth_all" on public.configuracoes   for all to authenticated using (true) with check (true);
