SET client_encoding = 'UTF8';

-- ============================================================
-- PASSO 2: Criar itens do cardápio
-- Execute APÓS o passo 1
-- ============================================================

INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo da Casa (Costela)', '1 Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate + 1 Batata Frita Especial Pequena + 1 Lata Refri 220ml', 42.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo da Casa (Linguiça Fresca)', '1 Hambúrguer de Linguiça Fresca 150g, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate + 1 Batata Frita Especial Pequena + 1 Lata Refri 220ml', 40.00, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo da Casa (Frango)', '1 Hambúrguer de Frango 150g, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate + 1 Batata Frita Especial Pequena + 1 Lata Refri 220ml', 38.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo da Casa (Comum)', '1 Hambúrguer Industrializado, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate + 1 Batata Frita Especial Pequena + 1 Lata Refri 220ml', 36.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Completo (Costela) c/Salada', 'Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Queijo + 1 Batata Frita Simples Pequena + 1 Refri 200ml', 31.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Completo (Costela) s/Salada', 'Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Queijo + 1 Batata Frita Simples Pequena + 1 Refri 200ml', 30.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Completo (Comum) c/Salada', 'Hambúrguer de 56g, Maionese Caseira, Batata Palha, Queijo + 1 Batata Frita Simples Pequena + 1 Refri 200ml', 27.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Completo (Comum) s/Salada', 'Hambúrguer de 56g, Maionese Caseira, Batata Palha, Queijo + 1 Batata Frita Simples Pequena + 1 Refri 200ml', 26.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Simples (Costela) c/Salada', 'Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Queijo', 28.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Simples (Costela) s/Salada', 'Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Queijo', 27.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Simples (Comum) c/Salada', 'Hambúrguer de 56g, Maionese Caseira, Batata Palha, Queijo', 24.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Combo Kids Simples (Comum) s/Salada', 'Hambúrguer de 56g, Maionese Caseira, Batata Palha, Queijo', 23.50, true
FROM public.categorias WHERE nome = 'Combo';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Burguer (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha e Queijo', 25.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Salada (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate', 26.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon e Queijo', 29.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon Salada (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon, Queijo, Tomate e Alface', 30.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo e Queijo', 28.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg Salada (Comum)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo, Queijo, Alface e Tomate', 29.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Burguer (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha e Queijo', 30.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Salada (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate', 31.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon e Queijo', 33.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon Salada (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon, Queijo, Tomate e Alface', 34.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo e Queijo', 32.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg Salada (Artesanal)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo, Queijo, Alface e Tomate', 33.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Burguer (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha e Queijo', 28.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Salada (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate', 29.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon e Queijo', 30.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon Salada (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Bacon, Queijo, Tomate e Alface', 33.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo e Queijo', 31.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Egg Salada (Linguiça Fresca)', 'Hamb. da Coluna, Maionese Caseira, Batata Palha, Ovo, Queijo, Alface e Tomate', 32.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Frango', 'Hambúrguer de Frango 150g, Maionese Caseira, Batata Palha, Queijo', 29.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Frango Salada', 'Hambúrguer de Frango 150g, Maionese Caseira, Batata Palha, Alface, Tomate e Queijo', 30.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Frango Bacon Salada', 'Hambúrguer de Frango 150g, Bacon, Maionese Caseira, Batata Palha, Alface, Tomate e Queijo', 34.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Calabresa', 'Calabresa fatiada, Maionese Caseira, Batata Palha e Queijo', 28.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Calabresa Salada', 'Calabresa fatiada, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate', 29.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Calabresa Bacon Salada', 'Calabresa fatiada, Bacon, Maionese Caseira, Batata Palha, Queijo, Alface e Tomate', 33.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Lanche de Casa 1 (Comum)', '2 Hambúrguer de 90g, Bacon, Calabresa, Ovo, Maionese Caseira, Batata Palha, Alface, Tomate e Queijo', 44.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Lanche de Casa 2 (Caseiro)', '2 Hambúrguer Artesanal 150g, Bacon, Calabresa, Ovo, Maionese Caseira, Batata Palha, Alface, Tomate e Queijo', 48.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Lanche de Casa 3 (Frango)', '2 Hambúrguer de Frango 150g, Bacon, Calabresa, Ovo, Maionese Caseira, Batata Palha, Alface, Tomate e Queijo', 46.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Caseiro Onion Ring Salada', 'Hambúrguer Artesanal 150g, Maionese Caseira, Batata Palha, Cebola Empanada, Queijo, Alface e Tomate', 33.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheese Bacon Caseiro Onion Ring Salada', 'Hambúrguer Artesanal 150g, Bacon, Maionese Caseira, Batata Palha, Cebola Empanada, Queijo, Alface e Tomate', 35.50, true
FROM public.categorias WHERE nome = 'Hambúrguer';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Americano no pão de hambúrguer', 'Ovo, Queijo, Presunto, Maionese, Alface e Tomate', 23.50, true
FROM public.categorias WHERE nome = 'Diferenciados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Bauru no pão de hambúrguer', 'Presunto, Queijo, Tomate e Orégano', 22.50, true
FROM public.categorias WHERE nome = 'Diferenciados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cachorro Quente Simples', 'Salsicha, Maionese, Batata Palha, Tomate e Alface', 24.50, true
FROM public.categorias WHERE nome = 'Diferenciados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cachorro Quente Completo', 'Salsicha, Bacon, Maionese, Batata Palha, Queijo Ralado, Tomate, Alface e Purê', 26.50, true
FROM public.categorias WHERE nome = 'Diferenciados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Bolinho de Carne', NULL, 9.50, true
FROM public.categorias WHERE nome = 'Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Bolinho de Queijo', NULL, 9.50, true
FROM public.categorias WHERE nome = 'Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Bolinho de Presunto e Queijo', NULL, 9.50, true
FROM public.categorias WHERE nome = 'Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coxinha de Frango', NULL, 9.50, true
FROM public.categorias WHERE nome = 'Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coxinha de Frango c/ Catupiry', NULL, 9.50, true
FROM public.categorias WHERE nome = 'Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Carne', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Queijo', NULL, 14.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Pizza', NULL, 14.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Frango', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Carne c/ Ovo', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Carne c/ Queijo', NULL, 16.50, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Brócolis c/ Queijo', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Brócolis c/ Queijo e c/ Bacon', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Frango c/ Catupiry', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Frango c/ Cheddar', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Frango c/ Queijo', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Bacon c/ Queijo', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Calabresa', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Calabresa c/ Queijo', NULL, 16.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel 2 Queijos', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Palmito', NULL, 17.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Palmito c/ Queijo', NULL, 18.00, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Palmito c/ Queijo e c/ Bacon', NULL, 19.00, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Costela', NULL, 16.50, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Costela c/ Queijo', NULL, 15.90, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Costela c/ Queijo e c/ Bacon', NULL, 18.00, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Especial de Carne', 'Carne, ovo, bacon, azeitona, tomate, presunto e queijo', 26.50, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Especial de Frango', 'Frango, ovo, bacon, azeitona, tomate, presunto e queijo', 26.50, true
FROM public.categorias WHERE nome = 'Pastéis Salgados';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Banoffe', 'Banana, doce de leite e canela', 18.90, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Tentação Branca', 'Chocolate Branco', 16.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Explosão de Avelã', 'Chocolate de Avelã', 16.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Ninho dos Sonhos', 'Leite Ninho', 17.90, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Doce dos Sonhos', 'Doce de Leite', 17.90, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Dueto Branco', 'Chocolate Branco c/ Ninho', 18.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Romeu e Julieta', 'Queijo Branco c/ Goiabada', 19.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Doce dos Sonhos com Paçoca', 'Doce de leite c/ paçoca', 18.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pastel Ninho Colorido', 'Leite Ninho c/ M&M', 16.50, true
FROM public.categorias WHERE nome = 'Pastéis Doces';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Fritas Pequena 300g', NULL, 23.00, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Fritas Média 450g', NULL, 25.50, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Fritas Grande 650g', NULL, 29.00, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Fritas Média Especial 450g', 'Batata, Cheddar, Bacon e Muçarela (Maçaricada)', 33.50, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Fritas Grande Especial 650g', 'Batata, Cheddar, Bacon e Muçarela (Maçaricada)', 40.90, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Calabresa Média', 'Calabresa e Cebola na Chapa', 35.50, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Calabresa Grande', 'Calabresa e Cebola na Chapa', 42.00, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Onion Ring Média', 'Cebola Empanada', 30.50, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Porção Onion Ring Grande', 'Cebola Empanada', 34.50, true
FROM public.categorias WHERE nome = 'Porções';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Ovo', NULL, 3.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Bacon', NULL, 6.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Queijo', NULL, 5.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Catupiry', NULL, 5.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Catupiry (Original)', NULL, 6.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Cheddar', NULL, 5.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Hambúrguer Comum', NULL, 4.90, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Hambúrguer Artesanal', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Hambúrguer Linguiça', NULL, 7.00, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Hambúrguer Frango', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Pote de Maionese Grande', NULL, 6.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Purê', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Salsicha', NULL, 5.00, true
FROM public.categorias WHERE nome = 'Adicionais';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Zero (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Kuat (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Sprite (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Fanta Laranja (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Fanta Uva (lata 220ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (lata 350ml)', NULL, 6.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Guaraná Antártica (garrafa 200ml)', NULL, 4.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (garrafa 200ml)', NULL, 4.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Laranja (garrafa 250ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Limão (garrafa 250ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Laranja (garrafa 450ml)', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Uva (garrafa 450ml)', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'H2O Limoneto (garrafa 500ml)', NULL, 7.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Água sem Gás (garrafa 500ml)', NULL, 3.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Água com Gás (garrafa 500ml)', NULL, 4.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (garrafa 600ml)', NULL, 7.95, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Sprite (garrafa 600ml)', NULL, 7.95, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Guaraná Antártica (garrafa 1L)', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Água sem Gás (garrafa 1,5L)', NULL, 6.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Uva (garrafa 1,5L)', NULL, 8.95, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Del Valle Laranja (garrafa 1,5L)', NULL, 8.95, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'H2O Limoneto (garrafa 1,5L)', NULL, 9.95, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Água com Gás (garrafa 1,5L)', NULL, 7.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (garrafa 2L)', NULL, 13.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Sprite (garrafa 2L)', NULL, 11.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Dolly Sabores (garrafa 2L)', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Fanta Laranja (garrafa 2L)', NULL, 13.00, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Guaraná Antártica (garrafa 2L)', NULL, 10.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (retornável 1L)', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Guaraná Antártica (retornável 1L)', NULL, 7.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Original (retornável 2L)', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Coca Cola Zero (retornável 2L)', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Fanta Laranja (retornável 2L)', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Bebidas';
INSERT INTO public.itens_cardapio (categoria_id, nome, descricao, preco, ativo)
SELECT id, 'Fanta Uva (retornável 2L)', NULL, 8.50, true
FROM public.categorias WHERE nome = 'Bebidas';
