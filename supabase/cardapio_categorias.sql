SET client_encoding = 'UTF8';

-- ============================================================
-- PASSO 1: Criar categorias do cardápio
-- ============================================================

INSERT INTO public.categorias (nome, ordem) VALUES
  ('Combo', 0),
  ('Hambúrguer', 1),
  ('Diferenciados', 2),
  ('Salgados', 3),
  ('Pastéis Salgados', 4),
  ('Pastéis Doces', 5),
  ('Porções', 6),
  ('Adicionais', 7),
  ('Bebidas', 8)
ON CONFLICT DO NOTHING;
