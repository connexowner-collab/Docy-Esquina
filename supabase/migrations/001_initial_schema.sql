-- Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Endereços
CREATE TABLE enderecos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    logradouro VARCHAR(300) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    referencia VARCHAR(200),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION
);

-- Categorias do cardápio
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    ordem INTEGER DEFAULT 0
);

-- Itens do cardápio
CREATE TABLE itens_cardapio (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

-- Sequência de pedidos
CREATE SEQUENCE pedidos_numero_seq START 1;

-- Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    numero_seq INTEGER NOT NULL DEFAULT nextval('pedidos_numero_seq'),
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    endereco_id INTEGER NOT NULL REFERENCES enderecos(id),
    distancia_km NUMERIC(10,2) DEFAULT 0,
    taxa_entrega NUMERIC(10,2) DEFAULT 0,
    taxa_manual NUMERIC(10,2),
    subtotal NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    pagamento VARCHAR(20) NOT NULL CHECK (pagamento IN ('dinheiro','credito','debito','pix')),
    troco NUMERIC(10,2),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido (snapshot de preço)
CREATE TABLE itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    item_cardapio_id INTEGER NOT NULL REFERENCES itens_cardapio(id),
    nome_snapshot VARCHAR(200) NOT NULL,
    preco_snapshot NUMERIC(10,2) NOT NULL,
    quantidade INTEGER NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- Configurações do estabelecimento (registro único)
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    nome_estabelecimento VARCHAR(200) NOT NULL DEFAULT 'Docy Esquina',
    telefone VARCHAR(20),
    endereco_origem TEXT,
    lat_origem DOUBLE PRECISION,
    lng_origem DOUBLE PRECISION,
    taxa_minima NUMERIC(10,2) DEFAULT 5.00,
    km_base NUMERIC(10,2) DEFAULT 2.00,
    valor_por_km NUMERIC(10,2) DEFAULT 2.00,
    km_maximo NUMERIC(10,2) DEFAULT 15.00
);

-- Seed configuração inicial
INSERT INTO configuracoes (nome_estabelecimento, taxa_minima, km_base, valor_por_km, km_maximo)
VALUES ('Docy Esquina', 5.00, 2.00, 2.00, 15.00);

-- Indexes
CREATE INDEX idx_clientes_telefone ON clientes(telefone);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);

-- RLS (Row Level Security) — habilitar após configurar autenticação
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Policies: acesso apenas para usuários autenticados
CREATE POLICY "Autenticados podem tudo" ON clientes FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON pedidos FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON enderecos FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON itens_cardapio FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON itens_pedido FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON categorias FOR ALL TO authenticated USING (true);
CREATE POLICY "Autenticados podem tudo" ON configuracoes FOR ALL TO authenticated USING (true);
