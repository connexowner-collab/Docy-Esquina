-- ============================================================
-- Importação em lote: 519 clientes
-- Execute no SQL Editor do Supabase
-- ============================================================

-- PASSO 1: Inserir clientes (ignora telefone duplicado)
INSERT INTO public.clientes (nome, telefone) VALUES
  ('ADRIANA', '11944837381'),
  ('ADRIANA CHAGAS', '11995677413'),
  ('AGNALDO', '11997977895'),
  ('ALAN', '11958227922'),
  ('ALAN DIEGO', '11941072848'),
  ('ALEX', '11934965393'),
  ('ALEXANDRE', '11930815914'),
  ('ALEXANDRE (BATO)', '11945187333'),
  ('ALIRA', '11943115126'),
  ('ALTAMIRES', '11971680127'),
  ('AMANDA', '11932047842'),
  ('AMANDA', '11978738382'),
  ('AMILE', '11942674767'),
  ('ANA', '11963700763'),
  ('ANA', '11971629191'),
  ('ANA', '11910368166'),
  ('ANA LETICIA', '11979515307'),
  ('ANA LETICIA', '11959204376'),
  ('ANA PAULA', '11990169855'),
  ('ANA PAULA', '11996134380'),
  ('ANA ROSA', '11986217090'),
  ('ANDERSEN', '11912124407'),
  ('ANDERSON', '11972469624'),
  ('ANDRE', '11932100448'),
  ('ANDRE', '11942301999'),
  ('ANDRÉ', '11962556726'),
  ('ANDRE MOIZES', '11981487050'),
  ('ANDREIA', '11943033188'),
  ('ANDRESA', '11942217693'),
  ('ANDRESSA', '11949878004'),
  ('ANDRESSA LOBO', '11941225813'),
  ('ARICELI', '11967947053'),
  ('AURELICE MENEZES', '11961324384'),
  ('BEATRIZ BRITO', '11975772441'),
  ('BETH', '11997819337'),
  ('BRUNA', '11953931330'),
  ('CACAU', '11967893555'),
  ('CAIO', '11963818005'),
  ('CAIO STOLEMBERGUER', '11975025556'),
  ('CAIQUE', '11983327826'),
  ('CAMILA', '11982137973'),
  ('CAMILA ALEIXO', '11914504339'),
  ('CARLA', '11920338764'),
  ('CARLOS', '11946535293'),
  ('CARLOS', '11934890784'),
  ('CARLOS', '11999192103'),
  ('CARLOS', '11971843422'),
  ('CAROL', '11960407433'),
  ('CAROL', '11996660263'),
  ('CAROL', '11995574876'),
  ('CAROLINE', '11963558441'),
  ('CASSIANO', '11911619944'),
  ('CAUÃ', '11968220913'),
  ('CHARLES SANTIAGO', '11940004245'),
  ('CIDA', '11966557421'),
  ('CINTIA LINO', '11989796387'),
  ('CLAUDIA', '11973930454'),
  ('CLAUDIA SOUTO', '11951363142'),
  ('CLAUDINEIA', '11980208886'),
  ('CLAUDIO', '11940279838'),
  ('CLAUDIO', '11968623036'),
  ('CLEIDE', '11959845932'),
  ('CLEITIANE', '11961320453'),
  ('CRISTHIAN (PETER PARKER)', '11953532794'),
  ('CRISTIANE', '11997906160'),
  ('DAIANA', '11949949627'),
  ('DAIANA', '11969723300'),
  ('DAIANE', '11985759201'),
  ('DALTON', '11912260580'),
  ('DANI', '11932688630'),
  ('DANIEL', '11997233403'),
  ('DANIELLE', '11941903439'),
  ('DANILO (TITO)', '11957550167'),
  ('DAYANE', '11963857747'),
  ('DEBORA', '11937435895'),
  ('DEMETRIUS', '11987092385'),
  ('DENIS SIQUEIRA', '11942128323'),
  ('DIEGO', '11972611074'),
  ('DILMA', '11979671544'),
  ('DONA ANA', '11949253212'),
  ('DONA FATIMA', '11991391369'),
  ('DONA MARIA', '11942571993'),
  ('DOUGLAS', '11954543838'),
  ('DULCINEIA APARECIDA', '11988506974'),
  ('EDER', '11971294606'),
  ('EDIMILSON', '11957745067'),
  ('EDVALDO', '11972187314'),
  ('ELAINE', '11998188895'),
  ('ELAINE RIBEIRO', '11988331314'),
  ('ELIANE', '11981372533'),
  ('ELIDA', '11966290315'),
  ('ELIETE', '11972314094'),
  ('ELIZABETHI', '11954604037'),
  ('EMI NUNES', '11952920871'),
  ('EMILY', '11973078900'),
  ('ERIKA', '11958617057'),
  ('ERIKA MORAES', '11973239706'),
  ('ESTER STILITA', '11945599968'),
  ('EULINA', '11991602573'),
  ('EVERTON', '11973326049'),
  ('FABIANA', '11963928883'),
  ('FABIANA', '11986084780'),
  ('FABIANO', '11973357055'),
  ('FABINHO', '11982268463'),
  ('FABIO', '11963889679'),
  ('FABIO', '11995182604'),
  ('FABIO SILVA', '11940216722'),
  ('FELIPE', '11963806631'),
  ('FERNANDA', '11957127011'),
  ('FERNANDA', '11913512666'),
  ('FERNANDO', '11910135306'),
  ('FLAVIA', '11994206447'),
  ('FRAN', '11996784447'),
  ('FRANCISCO', '11971633885'),
  ('GABI ASSIS', '11940383160'),
  ('GABRIEL', '11910796135'),
  ('GABRIEL', '11964954725'),
  ('GABRIEL', '11971868122'),
  ('GABRIEL', '11966026017'),
  ('GABRIEL SANTOS', '11916677177'),
  ('GEIZA', '11943873255'),
  ('GILDÉIA', '11943997874'),
  ('GIOVANA', '11974792208'),
  ('GISELE', '11946095923'),
  ('GUILHERME', '11978295320'),
  ('GUILHERME', '11917366694'),
  ('GUSTAVO', '11950506588'),
  ('HELEN PACHECO', '11943236632'),
  ('HINGREDD', '11975704779'),
  ('IARA', '11979581470'),
  ('IGOR', '11995752984'),
  ('INGRID', '11943211336'),
  ('IRO', '11940160216'),
  ('ISABEL  TUPINA', '11970857654'),
  ('ISABEL CRISTINA', '11968405387'),
  ('IVA', '11998339489'),
  ('JAILSA', '11958174051'),
  ('JAIME SALTURATO', '11987640027'),
  ('JANAINA', '11970370082'),
  ('JANICE', '11995017572'),
  ('JAQUELINE', '11961230048'),
  ('JEFERSON', '11912328711'),
  ('JENNIFER SOUZA', '11959725296'),
  ('JESSICA', '11992399447'),
  ('JESSICA', '11959494418'),
  ('JESSICA', '11930838255'),
  ('JESSICA', '11977287088'),
  ('JHONATA', '11997847983'),
  ('JOHN WICK', '11998560954'),
  ('JONINHAS', '11964774399'),
  ('JORGITO', '11998355217'),
  ('JOSIANE', '11962096320'),
  ('JULIA', '11934688974'),
  ('JULIANA', '11969059217'),
  ('JULIANE', '11950590502'),
  ('KAREN', '11942384221'),
  ('KARLA', '11971176339'),
  ('KATIA', '11985875940'),
  ('KAUAN', '11932014387'),
  ('KELLY', '11961932807'),
  ('KELVIN', '11956937955'),
  ('LEANDRO', '11911551427'),
  ('LEANDRO CARDOSO', '11916104749'),
  ('LEH SILVA', '11997060937'),
  ('LENIR', '11943346304'),
  ('LETICIA', '11998734349'),
  ('LICIA', '11970972197'),
  ('LILIAN', '11940173430'),
  ('LIVIA HABU', '11981517912'),
  ('LUANA', '11998448172'),
  ('LUCAS', '11995281025'),
  ('LUCAS ALMEIDA', '11997152828'),
  ('LUCAS SILVESTRE', '11947071058'),
  ('LUCIANA', '11930951557'),
  ('LUCIANA', '11990264577'),
  ('LUCIANO', '11952281138'),
  ('LUCIENE', '11948435462'),
  ('LUCINARA', '11972000124'),
  ('LUDMARA', '11965020674'),
  ('LUDMARA', '11945531233'),
  ('LUIZ ALEAGI', '11997201978'),
  ('LUIZA', '11961811143'),
  ('MALCON', '11950236777'),
  ('MARCÃO', '11973692253'),
  ('MARCELLO', '11949030317'),
  ('MARCIA NUNES', '11991938975'),
  ('MARCIA', '11956526159'),
  ('MARCIA PRESTES', '11961505862'),
  ('MARCIO', '11968596767'),
  ('MARCIO', '11973485917'),
  ('MARCIO', '11931487627'),
  ('MARIA', '11964464538'),
  ('MARIA', '11957285586'),
  ('MARIA EDUARDA', '11939051732'),
  ('MARIA EDUARDA', '11995341197'),
  ('MARIANA', '11959348842'),
  ('MARINALVA', '11981030934'),
  ('MATHEUS', '11974453698'),
  ('MAYIRA', '11977151036'),
  ('MERI', '11979540380'),
  ('MICHELLE', '11963724066'),
  ('MICHELLE', '11958853879'),
  ('MICHELLE CANDIDO', '11964151814'),
  ('MICHELLY', '11954933803'),
  ('MILENE', '11993788174'),
  ('MONICA', '11995476096'),
  ('MONICA', '19983025620'),
  ('MONICA FERNANDES', '11977535736'),
  ('MURILO', '11910007950'),
  ('NARA CRISTINA', '11986311746'),
  ('NATACHA', '11971522865'),
  ('NATHALIA', '11957835513'),
  ('NEIVA', '11917430140'),
  ('NELMA', '11966782465'),
  ('NICOLAS', '11945191509'),
  ('NILSA', '11981564773'),
  ('NORMA', '11947006919'),
  ('ODAIR', '11977688148'),
  ('OTTO', '11974896119'),
  ('PALOMA', '11982233488'),
  ('PAULA', '11975505106'),
  ('PAULA BRITO', '11999453119'),
  ('PAULO', '11977903004'),
  ('PENHA', '11972893221'),
  ('PIZZARIA MINEIRA', '11974595192'),
  ('PRISCILA', '11995562556'),
  ('PRISCILA', '11977256002'),
  ('PRISCILA', '11942239944'),
  ('PRISCILA', '11973273911'),
  ('RAFAEL', '11937124019'),
  ('RAMILDO', '11976004382'),
  ('RAQQUEL', '11961917508'),
  ('RAQUEL', '11994122864'),
  ('RAYA', '11971673332'),
  ('RAYANE MELO', '11952958772'),
  ('REGINA', '11932087998'),
  ('REINALDO', '11971734189'),
  ('RENAN', '11960582639'),
  ('RENAN', '11956532277'),
  ('RENATA', '11999995791'),
  ('RENATA DELGADO', '11976326480'),
  ('RENATA SIQUEIRA', '11949054318'),
  ('RENATO', '11977871976'),
  ('RISIA', '11942891662'),
  ('RITA DENTINI', '11971551665'),
  ('ROBERTA', '11972821118'),
  ('ROBERTO', '11999988454'),
  ('ROBERTO', '11933539090'),
  ('RODNEY', '11955502267'),
  ('RODRIGO', '11994642832'),
  ('RODRIGO', '11941274693'),
  ('ROGERIO', '11932709290'),
  ('ROSANA', '11965359956'),
  ('ROSANY', '11975871432'),
  ('ROSE', '11973498821'),
  ('ROSE', '11945722541'),
  ('ROSELI', '11972804913'),
  ('RUBENS', '11933141906'),
  ('RYAN LUCA', '11990026589'),
  ('SABRINA COBAYAXI', '11934607227'),
  ('SAMUEL', '11947995433'),
  ('SANDRA', '11945529731'),
  ('SANDRO', '11934717272'),
  ('SANDRO', '11941587468'),
  ('SARA', '11975735881'),
  ('SARA', '11956061295'),
  ('SHEILA', '11930577352'),
  ('SIDNEY', '11949436322'),
  ('SILVIO', '11965356672'),
  ('SIMONE', '11954574074'),
  ('SIMONE TORTELLI', '11972241757'),
  ('SR. DIAS', '1147224555'),
  ('STEFANY', '11943192917'),
  ('THAINA', '11939423452'),
  ('THAINA', '11977910798'),
  ('THAINAN', '11966036291'),
  ('THIAGO', '11963549629'),
  ('THIAGO (CANSADO)', '11949411689'),
  ('THIAGO HENRIQUE', '11977715486'),
  ('TIDINHO', '11950848459'),
  ('VALENTINA', '11998589834'),
  ('VANESSA OLIVEIRA', '11971191595'),
  ('VICTORIA', '11932532400'),
  ('VINICIUS', '11997897124'),
  ('VINICIUS FONTANARI', '11930297254'),
  ('VITORIA SOARES', '11999610766'),
  ('VIVIANE', '11970365735'),
  ('VIVIANE', '11971880040'),
  ('WANESSA', '11994059369'),
  ('WESLEY', '11973567815'),
  ('WESLEY', '11978006726'),
  ('WILLIAN', '11975409572'),
  ('WILLIAN SANTOS', '11971759832'),
  ('WILLIANS', '11951477407'),
  ('WILSON', '11997621687'),
  ('DAYANE', '11973772414'),
  ('MARLI', '11969091275'),
  ('ANGELO', '11942329036'),
  ('DANUBIA', '11962928480'),
  ('CAMILA', '11960800348'),
  ('SABRINA', '11947239917'),
  ('ANGELA SENA', '11934353363'),
  ('ELBIA', '11998516826'),
  ('ALEXANDRE', '11913494168'),
  ('VITORIA', '11916014871'),
  ('NATHALIA', '11997137357'),
  ('GIULIA', '11963702756'),
  ('KELLY', '11969084881'),
  ('CLARA', '11996146239'),
  ('JESSICA', '11989804239'),
  ('FATIMA', '11989198907'),
  ('ANA PAULA', '11995278112'),
  ('KLEBER', '11914793242'),
  ('MANU', '11973629365'),
  ('CAROL', '11944827398'),
  ('RONALDO', '11995019498'),
  ('ADRIANA', '11972524831'),
  ('DONIZETI', '11975168187'),
  ('ELISANGELA', '11971980814'),
  ('FERNANDO DIAS', '11957814677'),
  ('MARIA', '11917822158'),
  ('WELLINGTON', '11979781084'),
  ('JOYCE', '11997322852'),
  ('SILVIA MARQUES', '11975511995'),
  ('PATRICIA', '11968478185'),
  ('ELENI', '11949437156'),
  ('DEBORA', '11970454166'),
  ('YASMIN', '11912876893'),
  ('ADRIANA', '11981042797'),
  ('LUIZA CASTRO', '11970987486'),
  ('ODETE', '11986921746'),
  ('ANDERSON NUNES', '11910819406'),
  ('JOÃO', '11974548149'),
  ('ROBSON', '11993511592'),
  ('JESSIKA', '11998312788'),
  ('ALEX', '11996160952'),
  ('LAVINYA', '11933285761'),
  ('CAMILA', '11940191949'),
  ('ANA CLAUDIA', '11933660227'),
  ('MARIA', '11959398355'),
  ('WILSON', '7488190696'),
  ('CECIAN', '13997100718'),
  ('ADRIANA SILVA', '11981953807'),
  ('MONICA', '11965241465'),
  ('CLAUDIO', '11984016289'),
  ('BRUNA', '11940236148'),
  ('NICOLAS', '11989978258'),
  ('JESSIKA', '11972091123'),
  ('ADERLI', '11968530046'),
  ('JAQUELINE', '11933789598'),
  ('GUMERCINDO', '11976468253'),
  ('MARIA', '11984532218'),
  ('IAGO', '11998541110'),
  ('GLAUCIANO', '11959919311'),
  ('TIAGO', '11942016866'),
  ('LEONARDO', '11930655129'),
  ('MARCELO', '11973311365'),
  ('JAIME', '11989089703'),
  ('CAIO VINICIUS', '11969013371'),
  ('MARCOS', '11972553607'),
  ('ELIANE', '11947878187'),
  ('NELSON', '11995198773'),
  ('EVELLYN', '11982243582'),
  ('MARCIA', '11991885623'),
  ('ANA CAROLINE', '11987913215'),
  ('ADEILSON', '11994910073'),
  ('ISAC', '11966363322'),
  ('GISELE', '11981283142'),
  ('SIMONE', '11951060907'),
  ('GABI SELITO', '11962934420'),
  ('NEIA', '11958767462'),
  ('MANU', '11952107183'),
  ('ANA MARIA', '11972693159'),
  ('CAMILA', '11968526876'),
  ('ROSE', '11983285907'),
  ('IZA BARBOSA', '11943579727'),
  ('CRISTIANE', '11986085602'),
  ('MARIA', '11975526415'),
  ('DANILO', '11950774188'),
  ('OSWALDO', '11999505622'),
  ('MURILO', '11964675320'),
  ('ALBERT', '11912818981'),
  ('JOAO VITOR', '11992633001'),
  ('DENISE', '11996154095'),
  ('JOTA', '11978011569'),
  ('LUCAS', '11988590343'),
  ('MARIA LUIZA', '11971095070'),
  ('SILMARA', '11999041057'),
  ('WALDIRENE', '11996078186'),
  ('DONATA', '11933594749'),
  ('HELENA COSTA', '11959164742'),
  ('JULIA', '11952878572'),
  ('DANILLA', '11997341120'),
  ('LEANDRO', '11911179048'),
  ('PEDRO', '11982340408'),
  ('EDI ANTUNES', '11959775446'),
  ('DANILO', '11995885952'),
  ('ELAINE RIBEIRO', '11941330429'),
  ('DILMA', '11977444512'),
  ('PRISCILA', '11998601988'),
  ('MURILO', '11973045002'),
  ('ELAINE AVELINO', '11951763081'),
  ('MATEUS', '11943536329'),
  ('VIVIAN', '11942133033'),
  ('MARGARETHALE', '11944786692'),
  ('JOSIANE', '11913319699'),
  ('GUILHERME', '11949055602'),
  ('DANIELE', '11963889678'),
  ('PAULO RAMOS', '11989796703'),
  ('WILLIAM', '11998308350'),
  ('LIU', '11953362842'),
  ('GUILHERME', '11970893459'),
  ('ISABELA', '11981203823'),
  ('ANGELA', '11975160525'),
  ('ADRIANA', '11953034558'),
  ('MARIA MACHADO', '11973513433'),
  ('ANA CAROLINA', '11994206910'),
  ('CLAUDIA', '11974155821'),
  ('RENATA', '1147226613'),
  ('ALEJANDRO', '14981204276'),
  ('STEPHANI', '11974160964'),
  ('WILLIAN', '11975409542'),
  ('ELIAS', '11969122444'),
  ('CAINA', '11974935454'),
  ('VERONICA', '11944160597'),
  ('WANESSA', '11994059369'),
  ('JOAO PEDRO', '11997277283'),
  ('LEANDRO CARDOSO', '11956830871'),
  ('DEBORA', '11934487554'),
  ('THAIS', '11992040415'),
  ('VICTOR', '11948986274'),
  ('ELAINE RIBEIRO', '11949773048'),
  ('JULIANA', '11932414229'),
  ('ADRIANA', '11958501163'),
  ('FABIANA', '11995314786'),
  ('MARCELO', '11982788454'),
  ('CAMILA PARREIRA', '11971618179'),
  ('GLAUCIA', '11980787262'),
  ('MATIAS', '11983248112'),
  ('GUSTAVO HENRIQUE', '11932687441'),
  ('PAULA', '11965161213'),
  ('MEIRE', '11992458242'),
  ('ARIANE', '11941323173'),
  ('WAGNER ROBERTO', '11934668918'),
  ('GABI SOARES', '11930027841'),
  ('YASMIN CAMARGO', '11971082269'),
  ('RODRIGO', '11963960097'),
  ('PAULO', '11910007168'),
  ('DENISE', '11978342097'),
  ('CLARICE', '11948998247'),
  ('FERNANDA ROSA', '11950885938'),
  ('ADRIANE JESUS', '11953458952'),
  ('CAROLINE', '11965101323'),
  ('JERFESSON', '11995949949'),
  ('MARCOS', '11963874993'),
  ('JOELMA', '11971593767'),
  ('SILVANA', '8796646265'),
  ('ELITA', '11966074652'),
  ('FRAN CASTRO', '11985988056'),
  ('LUCAS', '11986934766'),
  ('GUSTAVO', '11915886302'),
  ('JANAINA', '11910108985'),
  ('CEIA MARA', '11964636998'),
  ('ISAQUE', '11916537658'),
  ('MASSAO', '11971206916'),
  ('JACKSON MORAES', '11971496288'),
  ('ALINE', '11930824210'),
  ('NEIA', '11995428369'),
  ('RAMILDO', '11959309143'),
  ('MARCEL', '11970753088'),
  ('VIVIANE PERUSSI', '11951648313'),
  ('LUCIANA', '11989030848'),
  ('ALEXANDRE', '11972200307'),
  ('ROSANA', '11966316755'),
  ('MAYARA', '11976402116'),
  ('DENISE', '11912060736'),
  ('GABRIEL', '21971066830'),
  ('ELIANE CORREA', '21998284653'),
  ('JESSICA', '11975450201'),
  ('JESSICA', '11972309044'),
  ('ANDREWS', '11948226208'),
  ('ALISSON', '11974572756'),
  ('ANA', '11997015920'),
  ('VINICIUS', '11974285538'),
  ('AMARILDO', '11946180836'),
  ('CAMILLY', '4789248468'),
  ('JOANA TOSATTI', '11981352901'),
  ('RENATO', '11972254866'),
  ('PORTARIA', '11947953156'),
  ('MARIA', '11933448369'),
  ('REGINA', '11975175740'),
  ('CARLA', '11943222099'),
  ('BIANCA', '11954366151'),
  ('LEONARDO', '11945398730'),
  ('ANNY', '11995493945'),
  ('FABIO', '11947492519'),
  ('ANDREA', '11961916034'),
  ('LU MATOS', '11953835714'),
  ('BIANCA', '11998927509'),
  ('ROSEMEIRE', '11974480510'),
  ('MARIA TEODORO', '11970595379'),
  ('NATALY', '11991390799'),
  ('ELAINE', '11993661925'),
  ('MARCELO AUGUSTO', '11932178026'),
  ('KARINA', '11968582667'),
  ('ELIZANGELA', '11988834927'),
  ('MARCOS GOMES', '11972730529'),
  ('LÉO', '11989624424'),
  ('MAGNO', '11972146874'),
  ('CAMILA', '11985245590'),
  ('KAYARA', '11910520159'),
  ('EDI MOREIRA', '11973515771'),
  ('LUIZ', '11952778423'),
  ('KLEBER', '11963377957'),
  ('WALKER', '11974434834'),
  ('LUAN REZENDE', '11957770164'),
  ('YASMIN', '11976247629'),
  ('TATIANA', '11951421794'),
  ('LEANDRO', '11952887009')
ON CONFLICT (telefone) DO NOTHING;

-- PASSO 2: Inserir endereços vinculados ao cliente pelo telefone
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JEAN DORNAUF', '69', NULL, 'VILA NOVA SOCORRO', NULL, 10.2
FROM public.clientes WHERE telefone = '11944837381';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '175', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995677413';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '2086', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997977895';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '119', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11958227922';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA VEREADOR BENEDITO DE OLIVEIRA', '405', '60', 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11941072848';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DOUTOR MIGUEL VIEIRA FERREIRA', '266', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11934965393';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PROFESSOR GUMERCINDO COELHO', '290', NULL, 'VILA CECILIA', NULL, 2.8
FROM public.clientes WHERE telefone = '11930815914';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '99', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11945187333';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '122', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943115126';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '100', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971680127';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA JAPÃO', '3981', 'NA FRENTE DA ANTIGA PADARIA ESPERANÇA', 'VILA MUNICIPAL', NULL, 3
FROM public.clientes WHERE telefone = '11932047842';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '86', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11978738382';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '168', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11942674767';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '97', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963700763';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '275', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971629191';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '30', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11910368166';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '19', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11979515307';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '42', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959204376';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GIOVANE BELTRAMO', '119', 'ATRAS DA COMAL ARROZ', 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11990169855';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '133', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11996134380';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE MARQUES', '320', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11986217090';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '94', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11912124407';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '165', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972469624';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '27', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11932100448';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONAO RAIMUNDO ANTAO DA SILVA', '230', NULL, 'JARDIM PLANALTO', NULL, 1.8
FROM public.clientes WHERE telefone = '11942301999';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '43', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11962556726';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '104', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981487050';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '164', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943033188';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMÇÃO', '30', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11942217693';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '101', 'VIDA BELA 1, BLOCO 14 APTO 21', 'VILA BELA FLOR', NULL, 1.4
FROM public.clientes WHERE telefone = '11949878004';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '163', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11941225813';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '38', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11967947053';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '19', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11961324384';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '136', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975772441';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '101', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11997819337';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA N. SENHORA AUXILIADORA DE GUADALUPE', '91', NULL, 'VILA LAVINIA', NULL, 4.5
FROM public.clientes WHERE telefone = '11953931330';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '264', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11967893555';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '22', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963818005';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '211', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975025556';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '90', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11983327826';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '287', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11982137973';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '164', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11914504339';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '108', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11920338764';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '260', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11946535293';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA UGUAÇU', '55', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11934890784';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '30', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11999192103';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '241', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971843422';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2 - BLOCO 19 APTO 13', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11960407433';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '285', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11996660263';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA LINDENBERG', '302', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11995574876';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA LINDENBERG', '302', NULL, 'JARDIM AEROPORTO 3', NULL, 2.8
FROM public.clientes WHERE telefone = '11963558441';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '435', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11911619944';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITO APARECIDA LAPIDO', '667', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11968220913';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCISCO MARTINEZ CASANOVA', '374', NULL, 'JARDIM SANTA TEREZA', NULL, 2.5
FROM public.clientes WHERE telefone = '11940004245';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '50', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966557421';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITO APARECIDA LAPIDO', '150', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11989796387';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '39', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973930454';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA APARECIDA LAPIDO', '333', NULL, 'VILA NOVA CINTRA', NULL, 0.9
FROM public.clientes WHERE telefone = '11951363142';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '260', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11980208886';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE ANTONIO ROSA', '425', NULL, 'MOGI MODERNO', NULL, 7.7
FROM public.clientes WHERE telefone = '11940279838';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '111', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11968623036';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '443', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959845932';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '117', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11961320453';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '140', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11953532794';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '206', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997906160';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 16 APTO 34', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11949949627';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SEIS', '457', NULL, 'JARDIM CAMBUCI', NULL, 1.5
FROM public.clientes WHERE telefone = '11969723300';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA TENENTE GALDINO PINHEIRO FRANCO', '164', NULL, 'BRAS CUBAS', NULL, 6.5
FROM public.clientes WHERE telefone = '11985759201';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE ANTONIO ROSA', '425', NULL, 'MOGI MODERNO', NULL, 7.7
FROM public.clientes WHERE telefone = '11912260580';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA EFIGÊNIA', '398', 'PORTÃO BRANCO', 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11932688630';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '150', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997233403';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSÉ BENEDICTO MEDEIROS AGUIAR', '338', NULL, 'VILA PAULISTA', NULL, 1.3
FROM public.clientes WHERE telefone = '11941903439';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1715', 'PORTAL BOSQUE - BLOCO SALAMANDRA A - APTO 43', 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11957550167';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '55', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963857747';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '436', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11937435895';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '248', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11987092385';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2 - BLOCO 24 APTO 03', 'VILA BELA FLOR', NULL, 1.4
FROM public.clientes WHERE telefone = '11942128323';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11972611074';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA CONCEIÇÃO', '705', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11979671544';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '90', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11949253212';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '133', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11991391369';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GIUSEPPE MUFFO', '65', NULL, 'VILA JUNDIAI', NULL, 1.5
FROM public.clientes WHERE telefone = '11942571993';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '2', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11954543838';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA PAULISTA', '24', NULL, 'VILA CECILIA', NULL, 2
FROM public.clientes WHERE telefone = '11988506974';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '191', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971294606';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA RENATO GRANADEIRO GUIMARAES', '259', NULL, 'MOGILAR', NULL, 8.3
FROM public.clientes WHERE telefone = '11957745067';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA NAIR', '10', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11972187314';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '160', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998188895';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DELFIM MOREIRA', '17', NULL, 'VILA CIDINHA', NULL, 4.7
FROM public.clientes WHERE telefone = '11988331314';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '104', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981372533';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 29 APTO 33', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11966290315';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '76', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972314094';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GENERAL LONGO', '98', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11954604037';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '213', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11952920871';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JURACI', '571', 'BAR DO SANDRO', 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11973078900';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '240', NULL, 'JARDIM MODELO', NULL, 1.5
FROM public.clientes WHERE telefone = '11958617057';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '219', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973239706';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1444', NULL, 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11945599968';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '46', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11991602573';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOAO MIRANDA MELO', '493', NULL, 'MOGI MODERNO', NULL, 7.7
FROM public.clientes WHERE telefone = '11973326049';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '315', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963928883';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '179', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11986084780';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA TINGASSU', '173', NULL, 'JARDIM LAYR', NULL, 3.3
FROM public.clientes WHERE telefone = '11973357055';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '153', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11982268463';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '214', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963889679';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GRAMADO', '1', 'BLOCO 2 AP 13', 'CONJ. DO BOSQUE', NULL, 1.5
FROM public.clientes WHERE telefone = '11995182604';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ÉRICO VERÍSSIMO', '216', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11940216722';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '162', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963806631';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '173', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11957127011';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11913512666';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA JULIO SIMOES', '403', NULL, 'BRAS CUBAS', NULL, 6.5
FROM public.clientes WHERE telefone = '11910135306';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO EDUARDO DO VALLE PEREIRA', '452', NULL, 'JARDIM CAMBUCI', NULL, 1.5
FROM public.clientes WHERE telefone = '11994206447';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '38', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11996784447';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DR. MIGUEL VIEIRA FERREIRA', '266', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11971633885';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YOSHIMI KUBOTA', '437', NULL, 'JARDIM ESPERANÇA', NULL, 2.9
FROM public.clientes WHERE telefone = '11940383160';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '52', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11910796135';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '134', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11964954725';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '108', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971868122';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '149', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966026017';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '191', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11916677177';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '88', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943873255';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '77', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943997874';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA COSTA LISBOA', '108', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11974792208';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1444', 'MONTALCINO - BLOCO 07 APTA 506', 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11946095923';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '116', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11978295320';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITO PINHAL', '143', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11917366694';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '170', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11950506588';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA THULLER', '697', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11943236632';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '125', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975704779';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CONSTELATION', '585', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11979581470';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '137', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995752984';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA EDITH INACIA DA SILVA', '444', NULL, 'VILA PAULISTA', NULL, 1.9
FROM public.clientes WHERE telefone = '11943211336';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '219', NULL, 'VILA NOVA CINTRA', NULL, 1.1
FROM public.clientes WHERE telefone = '11940160216';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '104', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970857654';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GIOVANNI BELTRANO', '68', NULL, 'VILA CINTRA', NULL, 1
FROM public.clientes WHERE telefone = '11968405387';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '312', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998339489';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '116', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11958174051';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA CECILIA', '181', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11987640027';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '43', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970370082';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANA ALEXANDRINA BARBOSA', '291', NULL, 'JARDIM SANTA TEREZA', NULL, 2.5
FROM public.clientes WHERE telefone = '11995017572';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '44', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11961230048';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ADRIANO PEREIRA', '1231', 'CASA 2', 'JUNDIAPEBA', NULL, 4.3
FROM public.clientes WHERE telefone = '11912328711';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA RAIMUNDO BALBINO DE FREITAS', '165', NULL, 'VILA POMAR', NULL, 4.5
FROM public.clientes WHERE telefone = '11959725296';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA KAORO HIRAMATSU', '2071', 'CONDOMINIO YPE -  APTO 11 TORRE 8', 'BRAS CUBAS.', NULL, 6.5
FROM public.clientes WHERE telefone = '11992399447';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '188', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959494418';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '277', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11930838255';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA OSCAR LOPES DE CAMPOS', '25', NULL, 'JARDIM CAMILA', NULL, 8.5
FROM public.clientes WHERE telefone = '11977287088';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '208', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997847983';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '61', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998560954';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '97', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11964774399';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '136', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998355217';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '161', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11962096320';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '175', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11934688974';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA APARECIDA LAPIDO', '418', NULL, 'VILA NOVA CINTRA', NULL, 0.85
FROM public.clientes WHERE telefone = '11969059217';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '277', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11950590502';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '21', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11942384221';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '312', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971176339';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA AMAZONAS', '2147', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11985875940';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '160', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11932014387';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO BENEDITO S. FERRAZ', '90', NULL, 'JARDIM ESPERANÇA', NULL, 3
FROM public.clientes WHERE telefone = '11961932807';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '30', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11956937955';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MAZAKATA TAKIZAWA', '55', NULL, 'BRAS CUBAS.', NULL, 6.5
FROM public.clientes WHERE telefone = '11911551427';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA RIACHO', '57', NULL, 'CONJ. DO BOSQUE', NULL, 1.1
FROM public.clientes WHERE telefone = '11916104749';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '22', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997060937';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '124', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943346304';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '155', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998734349';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '9', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970972197';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANTONIO GONÇALVES DOS SANTOS', '40', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11940173430';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '186', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981517912';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YGUAÇU', '78', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11998448172';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '191', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995281025';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '90', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997152828';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '21', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11947071058';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JURACI', '650', NULL, 'VILA CINTRA', NULL, 1.4
FROM public.clientes WHERE telefone = '11930951557';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '41', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11990264577';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MANOEL PORCELLI', '79', NULL, 'ALTO IPIRANGA', NULL, 5.5
FROM public.clientes WHERE telefone = '11952281138';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '117', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11948435462';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '130', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972000124';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'TRAVESSA FREDERICO LUCAREFSKI', '133', NULL, 'JARDIM MODELO', NULL, 1.5
FROM public.clientes WHERE telefone = '11965020674';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GRAMADO', '1', 'CONDOMINIO YPE - AP 43 BLOCO 6', 'CONJ. DO BOSQUE', NULL, 1.5
FROM public.clientes WHERE telefone = '11945531233';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CEL. SOUZA FRANCO', '1010', NULL, 'CENTRO', NULL, 7
FROM public.clientes WHERE telefone = '11997201978';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ICARO', '111', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11961811143';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MARIO YOSHIDA', '36', NULL, 'VILA NOVA CINTRA', NULL, 1.8
FROM public.clientes WHERE telefone = '11950236777';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '8', 'FERRO VELHO DE ESQUINA', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973692253';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', '24', 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11949030317';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '268', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11991938975';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '90', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11956526159';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '107', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11961505862';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11968596767';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '141', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973485917';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SILVESTRE', '83', NULL, 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11931487627';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '259', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11964464538';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '173', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11957285586';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '176', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11939051732';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA ALEXANDRINA DE PAULA', '401', NULL, 'VILA NOVA CINTRA', NULL, 1.3
FROM public.clientes WHERE telefone = '11995341197';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '265', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959348842';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '237', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981030934';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '216', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11974453698';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ADRIANO FRANCISCO SALGADO', '47', NULL, 'VILA SUD MENUCI', NULL, 7.1
FROM public.clientes WHERE telefone = '11977151036';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '210', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11979540380';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO EDUARDO DO VALLE PEREIRA', '38', NULL, 'JARDIM CAMBUCI', NULL, 1.5
FROM public.clientes WHERE telefone = '11963724066';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '311', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11958853879';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '215', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11964151814';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 15 APTO 04', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11954933803';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '22', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11993788174';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '61', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995476096';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '918', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '19983025620';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '968', NULL, 'JARDIM MODELO', NULL, 1.5
FROM public.clientes WHERE telefone = '11977535736';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '436', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11910007950';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA AMAZONAS', '2136', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11986311746';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '150', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971522865';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '1011', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11957835513';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '52', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11917430140';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '178', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966782465';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '186', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11945191509';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '22', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981564773';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '11', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11947006919';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '250', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977688148';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1444', 'MONTACINO - BLOCO  08 APTO 408', 'CONJ. DO BOSQUE', NULL, 1.1
FROM public.clientes WHERE telefone = '11974896119';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '386', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11982233488';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '211', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975505106';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '136', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11999453119';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '82', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977903004';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '153', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972893221';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CINAMOMO', '24', NULL, 'JARDIM PLANALTO', NULL, 3
FROM public.clientes WHERE telefone = '11974595192';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '109', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995562556';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '194', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977256002';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 24 APTO 3', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11942239944';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '79', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973273911';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CONSTELATION', '585', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11937124019';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '19', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11976004382';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11961917508';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '151', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994122864';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '99', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971673332';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '27', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11952958772';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GLAUCIANO LOPES', '23', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11932087998';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AV. FLORÊNCIODE PAIVA', '85', NULL, 'JARDIM MODELO', NULL, 1.5
FROM public.clientes WHERE telefone = '11971734189';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ONOFRICO DERENCIO', '701', 'CONDOMINIO BRISA MAR - APTO 08', 'VILA BRASILEIRA', NULL, 4.5
FROM public.clientes WHERE telefone = '11960582639';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PROFESSOR GUMERCINDO COELHO', '356', NULL, 'VILA CECILIA', NULL, 2.8
FROM public.clientes WHERE telefone = '11956532277';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DIOGO DOMINGUES Y DOMINGUES', '69', NULL, 'VILA MOGILAR', NULL, 7.9
FROM public.clientes WHERE telefone = '11999995791';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '218', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11976326480';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1715', 'CASA 3', 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11949054318';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '149', 'ADEGA', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977871976';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA TINGASSU', '68', NULL, 'JARDIM LAYR', NULL, 3.6
FROM public.clientes WHERE telefone = '11942891662';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11971551665';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '247', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972821118';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '265', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11999988454';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '90', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11933539090';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA APARECIDA LAPIDO', '667', NULL, 'VILA NOVA CINTRA', NULL, 0.6
FROM public.clientes WHERE telefone = '11955502267';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '117', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994642832';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO BENEDITO S. FERRAZ', '90', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11941274693';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '275', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11932709290';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '256', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11965359956';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCISCO VAZ COELHO', '1383', NULL, 'VILA LAVINIA', NULL, 3.2
FROM public.clientes WHERE telefone = '11975871432';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '954', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11973498821';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOÃO BATISTA MONTEIRO', '210', NULL, 'VILA MELCHIZEDEC', NULL, 5
FROM public.clientes WHERE telefone = '11945722541';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '275', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972804913';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '127', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11933141906';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SILVESTRE', '145', NULL, 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11990026589';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA IRINEU PEDROSO DE MORAIS', '127', NULL, 'VILA BRASILEIRA', NULL, 3.6
FROM public.clientes WHERE telefone = '11934607227';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '148', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11947995433';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '1192', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11945529731';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '267', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11934717272';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JURACI', '571', NULL, 'VILA CINTRA', NULL, 1.3
FROM public.clientes WHERE telefone = '11941587468';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '143', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975735881';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '211', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11956061295';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SÃO JOSÉ', '160', NULL, 'VILA EUGENIA', NULL, 2
FROM public.clientes WHERE telefone = '11930577352';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '168', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11949436322';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '150', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11965356672';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '82', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11954574074';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO PAULO DE CARLO', '171', NULL, 'VILA SÃO SEBASTIAO', NULL, 4.8
FROM public.clientes WHERE telefone = '11972241757';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA ANASTACIA', '49', NULL, 'JARDIM UNIVERSO', NULL, 2.9
FROM public.clientes WHERE telefone = '1147224555';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PROFª GUMERCINHO COELHO', '356', NULL, 'VILA CECILIA', NULL, 2.8
FROM public.clientes WHERE telefone = '11943192917';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA JOSE DE SOUZA BRANCO', '431', 'A', 'JUNDIAPEBA', NULL, 4.3
FROM public.clientes WHERE telefone = '11939423452';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '19', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977910798';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GENERAL LONGO', '98', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11966036291';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVEDINA DOUTOR ROBERTO', '348', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11963549629';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ICARO', '256', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11949411689';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '244', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11977715486';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '158', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11950848459';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA PREFEITO FRANCISCO RIBEIRO NOGUEIRA', '5470', NULL, 'MOGI MODERNO', NULL, 7.7
FROM public.clientes WHERE telefone = '11998589834';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '4', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971191595';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '21', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11932532400';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '76', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997897124';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11930297254';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DOUTOR BENEDITO DA CUNHA MELLO', '58', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11999610766';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ODILON AFFONSO', '206', 'CONDOMINIO - TOTAL BRÁS CUBAS - TORRE 2 APART 01', 'VILA NOVA CINTRA', NULL, 1.6
FROM public.clientes WHERE telefone = '11970365735';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '144', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971880040';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '111', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994059369';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '289', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11973567815';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '38', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11978006726';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '264', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975409572';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GLAUCIANO LOPES', '43', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11971759832';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '163', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11951477407';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '38', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997621687';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CAPITÃO AMADO', '26', NULL, 'VILA JUNDIAI', NULL, 1.8
FROM public.clientes WHERE telefone = '11973772414';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '18', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11969091275';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDROSO', '55', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11942329036';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MARIO YOSHIDA', '618', 'RUA DA ACADEMIA OXY - TERCEIRA CASA DEPOIS DO TERRENO', 'VILA NOVA CINTRA', NULL, 0.9
FROM public.clientes WHERE telefone = '11962928480';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JULIO ANTONIO DE ANDRADE', '130', NULL, 'VILA JUNDIAI', NULL, 1.8
FROM public.clientes WHERE telefone = '11960800348';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '11', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11947239917';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITO CARVALHO FILHO', '171', NULL, 'JARDIM AEROPORTO 3', NULL, 2.2
FROM public.clientes WHERE telefone = '11934353363';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA APOLO ONZE', '239', 'PROXIMO AO CANTO DA VIOLA', 'JARDIM APOLO', NULL, 2
FROM public.clientes WHERE telefone = '11998516826';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ARISTIDES GERMANO MONTAGNINI', '34', NULL, 'CONJ. HAB. ANTONIO BOVOLENTA', NULL, 8.5
FROM public.clientes WHERE telefone = '11913494168';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA PREFEITO MAURILIO DE SOUZA LEITE FILHO', '777', 'APOEMA 1 - BLOCO G APARTAMENTO 204', 'VILA CAPUTERA', NULL, 8.5
FROM public.clientes WHERE telefone = '11916014871';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '52', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997137357';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DEP. ANTONIO SILVIO CUNHA BUENO', '264', NULL, 'VILA CECILIA', NULL, 2.8
FROM public.clientes WHERE telefone = '11963702756';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA WALTER BELDA', '108', NULL, 'VILA JUNDIAI', NULL, 1.8
FROM public.clientes WHERE telefone = '11969084881';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA APARECIDA LAPIDO', '521', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11996146239';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '264', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989804239';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '78', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989198907';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '189', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995278112';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '24', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11914793242';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', NULL, 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11973629365';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YOSHIMI KUBOTA', '210', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11944827398';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA APARECIDA LAPIDO', '521', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11995019498';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '241', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972524831';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ARATIMBO', '329', NULL, 'JARDIM LAYR', NULL, 3.6
FROM public.clientes WHERE telefone = '11975168187';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', 'CONDOMINIO JAPAO - APTO 43', 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11971980814';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MANOEL PORCELLI', '360', 'LAFAIETE - BLOCO E (ESMERALDA) APTO 13', 'ALTO IPIRANGA', NULL, 5.3
FROM public.clientes WHERE telefone = '11957814677';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO PAULO DE CARLO', '908', 'CONDOMINIO DOLCE VITTA - APTO 32A', 'VILA SÃO SEBASTIAO', NULL, 4.8
FROM public.clientes WHERE telefone = '11917822158';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MARIO YOSHIDA', '1015', NULL, 'VILA NOVA CINTRA', NULL, 0.6
FROM public.clientes WHERE telefone = '11979781084';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GRAMADO', '1', 'BLOCO 2 AP 13', 'CONJ. DO BOSQUE', NULL, 1.5
FROM public.clientes WHERE telefone = '11997322852';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', 'CONDOMINIO JAPAO - APTO 12', 'JARDIM ESPERANÇA', NULL, 2.7
FROM public.clientes WHERE telefone = '11975511995';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA PREFEITO MAURILIO DE SOUZA LEITE FILHO', '777', 'APOEMA 1 - BLOCO O APTO 402', 'VILA CAPUTERA', NULL, 8.5
FROM public.clientes WHERE telefone = '11968478185';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '168', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11949437156';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '264', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970454166';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '267', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11912876893';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ARISTIDES GERMANO MONTAGNINI', '46', NULL, 'CONJ. HAB. ANTONIO BOVOLENTA', NULL, 8.5
FROM public.clientes WHERE telefone = '11981042797';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ARATIMBO', '329', NULL, 'JARDIM LAYR', NULL, 3.4
FROM public.clientes WHERE telefone = '11970987486';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '30', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11986921746';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DOS PINHEIROS', '75', NULL, 'CONJ. SANTO ANGELO', NULL, 7
FROM public.clientes WHERE telefone = '11910819406';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA RITA', '182', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11974548149';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '331', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11993511592';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOAO GOUVEIA', '189', NULL, 'JARDIM MODELO', NULL, 1.3
FROM public.clientes WHERE telefone = '11998312788';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '155', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11996160952';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MARIO YOSHIDA', '317', NULL, 'VILA NOVA CINTRA', NULL, 1
FROM public.clientes WHERE telefone = '11933285761';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '85', 'CONDOMINIO AMARAIS 2 BLOCO B1 - APTO 31', 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11940191949';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DR. DEODATO WERTHEIMER', '789', NULL, 'BRAS CUBAS', NULL, 6.5
FROM public.clientes WHERE telefone = '11933660227';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '52', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959398355';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO PAULO DE CARLO', '908', 'CONDOMINIO DOLCE VITA - APTO 32A', 'VILA SÃO SEBASTIAO', NULL, 5
FROM public.clientes WHERE telefone = '7488190696';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '440', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '13997100718';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '285', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981953807';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '186', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11965241465';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '140', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11984016289';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '101', 'VIDA BELA 1, BLOCO 18 APTO 03', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11940236148';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '186', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989978258';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '80', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972091123';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEXANDRINA DE PAULA', '401', NULL, 'VILA NOVA CINTRA', NULL, 1.3
FROM public.clientes WHERE telefone = '11968530046';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA KAORO HIRAMATSU', '2071', 'CONDOMINIO YPE - AP 43 BLOCO 6', 'BRAS CUBAS.', NULL, 6.5
FROM public.clientes WHERE telefone = '11933789598';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SUIÇA', '75', NULL, 'JARDIM SANTOS DUMONT 1', NULL, 5.4
FROM public.clientes WHERE telefone = '11976468253';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MARIO YOSHIDA', '971', NULL, 'VILA NOVA CINTRA', NULL, 0.5
FROM public.clientes WHERE telefone = '11984532218';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '112', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11998541110';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '43', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959919311';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '168', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11942016866';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DR. EDUARDO HENRIQUE TASSINARI', '159', NULL, 'VILA MUNICIPAL', NULL, 3
FROM public.clientes WHERE telefone = '11930655129';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA BRASIL', '1396', NULL, 'VILA MOGI MODERNO', NULL, 7.8
FROM public.clientes WHERE telefone = '11973311365';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '15', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989089703';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MANOEL FERNANDES', '2363', 'CONDOMINIO PRIME - CASA 04', 'JUNDIAPEBA', NULL, 3.4
FROM public.clientes WHERE telefone = '11969013371';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '22', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972553607';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA TIETE', '51', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11947878187';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '89', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995198773';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GERALDO GOMES LOUREIRO', '50', 'CASA 02', 'VILA BRASILEIRA', NULL, 4.1
FROM public.clientes WHERE telefone = '11982243582';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 30 APTO 02', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11991885623';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '265', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11987913215';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '117', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994910073';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '218', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966363322';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO DE CARLO', '908', 'DOLCE VITTA - BLOCO C - APTO 13', 'VILA SÃO SEBASTIAO', NULL, 4.1
FROM public.clientes WHERE telefone = '11981283142';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GRAMADO', '1', 'BOSQUE 1 - AP 11 BLOCO 9', 'CONJ. DO BOSQUE', NULL, 1.5
FROM public.clientes WHERE telefone = '11951060907';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MANUEL DE OLIVEIRA', '30', 'HOSPITAL VAGALUME', 'VILA MOGILAR', NULL, 11
FROM public.clientes WHERE telefone = '11962934420';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '271', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11958767462';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '25', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11952107183';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ESQUILO', '271', NULL, 'VILA JUNDIAI', NULL, 2.1
FROM public.clientes WHERE telefone = '11972693159';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '50', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11968526876';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 8 APTO 21', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11983285907';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '267', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943579727';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO RAMOS JULIO', '245', 'SPAZIO MATISSE, BLOCO 4 APTO 102', 'VILA SANTANA', NULL, 4.9
FROM public.clientes WHERE telefone = '11986085602';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '33', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975526415';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2, BLOCO 09 APTO 02', 'VILA BELA FLOR', NULL, 2
FROM public.clientes WHERE telefone = '11950774188';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '150', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11999505622';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO BENEDITO S. FERRAZ', '90', NULL, 'JARDIM ESPERANÇA', NULL, 3
FROM public.clientes WHERE telefone = '11964675320';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YOSHIMI KUBOTA', '111', NULL, 'JARDIM ESPERANÇA', NULL, 3
FROM public.clientes WHERE telefone = '11912818981';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA VEREADOR BENEDITO DE OLIVEIRA FLORES', '300', 'B', 'JARDIM ESPERANÇA', NULL, 2.7
FROM public.clientes WHERE telefone = '11992633001';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA VEREADOR BENEDITO DE OLIVEIRA FLORES', '472', 'B', 'JARDIM ESPERANÇA', NULL, 2.7
FROM public.clientes WHERE telefone = '11996154095';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '25', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11978011569';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '21', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11988590343';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCISCO MARTINS', '360', 'APT 74 - COND TOM JOBIM', 'SOCORRO', NULL, 8.8
FROM public.clientes WHERE telefone = '11971095070';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '202', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11999041057';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE MARQUES', '380', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11996078186';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '149', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11933594749';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '370', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959164742';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SARMENTO AIRES', '131', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11952878572';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '271', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997341120';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'ESTRADA MAZAKATA TAKIZAWA', '55', 'CONDOMINIO MANACA - AP 22 TORRE 14', 'BRAS CUBAS.', NULL, 6.5
FROM public.clientes WHERE telefone = '11911179048';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '271', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11982340408';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '102', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959775446';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA OCEANIA', '796', NULL, 'JARDIM AEROPORTO 1', NULL, 5.5
FROM public.clientes WHERE telefone = '11995885952';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'DOUTOR ROBERTO NOBUO SATO', '1212', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11941330429';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA CONCEIÇÃO', '705', 'sobrado azul em frente a praça', 'VILA CINTRA', NULL, 1.3
FROM public.clientes WHERE telefone = '11977444512';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOAO REGUEIRO LUIZ', '239', NULL, 'VILA CELESTE', NULL, 5
FROM public.clientes WHERE telefone = '11998601988';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DR EDUARDO HENRIQUE TASSINARI', '157', 'ADEGA DO DRI', 'VILA MUNICIPAL', NULL, 2.9
FROM public.clientes WHERE telefone = '11973045002';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '110', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11951763081';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '210', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11943536329';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SÃO FRANCISCO', '121', 'VIDA BELA 2 - BLOCO 16 APTO 12', 'VILA BELA FLOR', NULL, 1.4
FROM public.clientes WHERE telefone = '11942133033';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CAPITÃO JOAQUIM ANTONIO BATALHA', '484', NULL, 'VILA LAVINIA', NULL, 4.5
FROM public.clientes WHERE telefone = '11944786692';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '161', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11913319699';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA SOFIA', '317', 'GALPAO VERMELHO DE ESQUINA', 'VILA SAGRADO CORAÇÃO DE MARIA', NULL, 2.5
FROM public.clientes WHERE telefone = '11949055602';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '214', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963889678';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOJO SAKAI', '962', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11989796703';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ONOFRICO DERENCIO', '701', 'CONDOMINIO BRISA MAR - APTO 15', 'VILA BRASILEIRA', NULL, 4.5
FROM public.clientes WHERE telefone = '11998308350';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '122', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11953362842';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YOSHIMI KUBOTA', '111', NULL, 'JARDIM ESPERANÇA', NULL, 3
FROM public.clientes WHERE telefone = '11970893459';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE MARQUES', '380', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11981203823';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA ULISSES BORGES DE SIQUEIRA', '489', NULL, 'JARDIM UNIVERSO', NULL, 3.5
FROM public.clientes WHERE telefone = '11975160525';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA EDITH INÁCIA DA SILVA', '400', 'CASA B', 'VILA PAULISTA', NULL, 1.5
FROM public.clientes WHERE telefone = '11953034558';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ESQUILO', '150', NULL, 'VILA JUNDIAI', NULL, 2.1
FROM public.clientes WHERE telefone = '11973513433';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '210', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994206910';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '226', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11974155821';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SANTA RITA', '112', NULL, 'JARDIM CECILIA', NULL, 3.1
FROM public.clientes WHERE telefone = '1147226613';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '249', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '14981204276';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GLAUCIANO LOPES', '44', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11974160964';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA AMAZONA', '2137', 'CASA 1', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975409542';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOAO NEGRAO', '69', 'EM FRENTE A LOJA DE CARROS SENNA VEICULOS', 'JARDIM AEROPORTO 3', NULL, 2.3
FROM public.clientes WHERE telefone = '11969122444';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCELINO RODRIGUES', '230', NULL, 'VILA SÃO SEBASTIAO', NULL, 4.6
FROM public.clientes WHERE telefone = '11974935454';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '52', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11944160597';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '111', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11994059369';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '88', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11997277283';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DO RIACHO', '57', NULL, 'CONJ. DO BOSQUE', NULL, 1.1
FROM public.clientes WHERE telefone = '11956830871';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '436', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11934487554';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '38', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11992040415';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '119', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11948986274';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '244', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11949773048';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCELINO RODRIGUES', '230', NULL, 'VILA SÃO SEBASTIAO', NULL, 4.6
FROM public.clientes WHERE telefone = '11932414229';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '140', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11958501163';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '279', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995314786';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FELIPE CAMARÃO', '76', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11982788454';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ONOFRICO DERENCIO', '701', 'CONDOMINIO BRISA MAR - APTO 08', 'VILA BRASILEIRA', NULL, 4.5
FROM public.clientes WHERE telefone = '11971618179';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '256', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11980787262';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '210', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11983248112';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '176', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11932687441';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ONOFRICO DERENCIO', '180', NULL, 'VILA BRASILEIRA', NULL, 4.5
FROM public.clientes WHERE telefone = '11965161213';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FELIPE CAMARÃO', '76', NULL, 'JARDIM UNIVERSO', NULL, 3.2
FROM public.clientes WHERE telefone = '11992458242';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'TRAVESSA FREDERICO LUCAREFSKI', '40', NULL, 'JARDIM MODELO', NULL, 1.5
FROM public.clientes WHERE telefone = '11941323173';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '133', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11934668918';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA HENRIQUE EROLES', '1443', 'CONDOMINIO ALBATROZ - APTO 31', 'ALTO IPIRANGA', NULL, 4.9
FROM public.clientes WHERE telefone = '11930027841';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BERNARDINO RODRIGUES CARDOSO', '95', NULL, 'JARDIM CAMILA', NULL, 9
FROM public.clientes WHERE telefone = '11971082269';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA JAPÃO', '4587', 'CONDOMINIO BELLA VISTA - CASA 42', 'JARDIM LAYR', NULL, 3.6
FROM public.clientes WHERE telefone = '11963960097';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MIGUEL PRECIOSO', '114', NULL, 'JARDIM RODEIO', NULL, 10.6
FROM public.clientes WHERE telefone = '11910007168';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALPHEU GUILHEMAT', '377', NULL, 'VILA SÃO SEBASTIAO', NULL, 4.6
FROM public.clientes WHERE telefone = '11978342097';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '42', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11948998247';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA KAORO HIRAMATSU', '2051', 'CONDOMINIO ITAPETY - AP 03 BLOCO 04', 'BRAS CUBAS.', NULL, 6.5
FROM public.clientes WHERE telefone = '11950885938';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA MANOEL MARTINS FRANCO', '105', NULL, 'VILA POMAR', NULL, 4.8
FROM public.clientes WHERE telefone = '11953458952';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVANIDA AMAZONAS', '2167', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11965101323';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1444', 'MONTALCINO - BLOCO 03 APTA 508', 'CONJ. DO BOSQUE', NULL, 2
FROM public.clientes WHERE telefone = '11995949949';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA SHOZO SAKAI', '1444', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963874993';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '156', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971593767';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PAULO LEITE DE SIQUEIRA', '407', NULL, 'VILA NOVA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '8796646265';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '26', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966074652';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA YOSHIMI KUBOTA', '445', NULL, 'JARDIM ESPERANÇA', NULL, 3.8
FROM public.clientes WHERE telefone = '11985988056';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO PAULO DE CARLO', '908', 'CONDOMINIO - DOLCE VITA - BLOCO C APTO 153', 'VILA SÃO SEBASTIAO', NULL, 4.8
FROM public.clientes WHERE telefone = '11986934766';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '170', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11915886302';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '255', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11910108985';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA SENDAY', '437', NULL, 'JARDIM NAUTICO', NULL, 9
FROM public.clientes WHERE telefone = '11964636998';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '52', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11916537658';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '255', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11971206916';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DOUTOR EDUARDO HENRIQUE TASSINARI', '101', NULL, 'VILA MUNICIPAL', NULL, 3.5
FROM public.clientes WHERE telefone = '11971496288';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '254', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11930824210';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BRIGADEIRO NEWTON BRAGA', '380', 'SANTA ANTONIETA 1 - BLOCO E APTO 32', 'JARDIM AEROPORTO 3', NULL, 2.8
FROM public.clientes WHERE telefone = '11995428369';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '19', 'A', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11959309143';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '104', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970753088';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '127', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11951648313';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '268', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989030848';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ALEIJADINHO ANTONIO F. DA C. L.', '108', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972200307';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '256', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11966316755';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '40', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11976402116';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOAO NEGRAO', '6', 'CASA 5', 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11912060736';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA GILBERTO GAGLIARD', '225', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '21971066830';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCISCO AFONSO DE MELO', '565', 'CONDOMINIO VITTA - TORRE 2 APTO 181', 'PARQUE SANTANA', NULL, 6.3
FROM public.clientes WHERE telefone = '21998284653';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '114', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11975450201';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '133', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972309044';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'DOUTOR MIGUEL VIEIRA FERREIRA', '586', NULL, 'JARDIM AEROPORTO 3', NULL, 4
FROM public.clientes WHERE telefone = '11948226208';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JOSE MARQUES', '380', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11974572756';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA EXPEDICIONARIO FCO.  A. DE OLIVEIRA', '356', 'CONDOMINIO JAPAO - APTO 23', 'JARDIM ESPERANÇA', NULL, 2.7
FROM public.clientes WHERE telefone = '11997015920';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '215', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11974285538';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '198', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11946180836';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '219', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '4789248468';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CACILDA BECKER', '48', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11981352901';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA GARIBALDI', '98', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11972254866';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JERONIMO MARIANO', '152', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11947953156';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '100', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11933448369';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA BENEDITA PEREIRA FRANCO', '635', 'CASA DE ESQUINA', 'JUNDIAPEBA', NULL, 4.3
FROM public.clientes WHERE telefone = '11975175740';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA TINGASSU', '173', NULL, 'JARDIM LAYR', NULL, 3.4
FROM public.clientes WHERE telefone = '11943222099';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '77', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11954366151';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PEDRO PAULO DE CARLO', '908', 'CONDOMINIO DOLCE VITA - APTO 4B', 'VILA SÃO SEBASTIAO', NULL, 4.8
FROM public.clientes WHERE telefone = '11945398730';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '440', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11995493945';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA MANOEL LINO DA SILVA', '95', NULL, 'JARDIM AEOPORTO 2', NULL, 4.7
FROM public.clientes WHERE telefone = '11947492519';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA HELOISA SANTANA PINTO', '155', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11961916034';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '119', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11953835714';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA DOUTOR RENATO GRANADEIRO GUIMARAES', '73', NULL, 'VILA MOGILAR', NULL, 7.9
FROM public.clientes WHERE telefone = '11998927509';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ARAGUAIA', '73', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11974480510';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '200', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11970595379';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA FRANCISCO RIBEIRO NOGUEIRA', '5450', 'NOVA MOGI 2 - APTO 3 TORRE C', 'JARDIM NATHALIE', NULL, 9.2
FROM public.clientes WHERE telefone = '11991390799';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '264', 'APTO 01', 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11993661925';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'TRAVESSIA TURQUIA', '77', NULL, 'JARDIM SANTOS DUMONT 3', NULL, 6
FROM public.clientes WHERE telefone = '11932178026';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ANITA COSTA LEITE', '507', NULL, 'VILA MOGI MODERNO', NULL, 7.7
FROM public.clientes WHERE telefone = '11968582667';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '151', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11988834927';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'AVENIDA LAURINDA CARDOSO DE MELO FREIRE', '283', 'EDIFICIO MONT REY - APTO 33', 'VILA OLIVEIRA', NULL, 8.5
FROM public.clientes WHERE telefone = '11972730529';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '239', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11989624424';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA FRANCISCO VAZ COELHO', '873', NULL, 'VILA LAVINIA', NULL, 4.5
FROM public.clientes WHERE telefone = '11972146874';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO MOREIRA DOS SANTOS', '42', NULL, 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11985245590';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '239', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11910520159';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA JERONIMO MARIANO', '152', 'CONDOMINIO VILA CERES - BLOCO 8 APTO 401', 'VILA CINTRA', NULL, 2
FROM public.clientes WHERE telefone = '11973515771';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '213', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11952778423';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA CARMELINO JORDANO', '24', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11963377957';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '173', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11974434834';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA PROFETA JONAS', '630', NULL, 'VILA POMAR', NULL, 4.5
FROM public.clientes WHERE telefone = '11957770164';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA AUGUSTO DE C. R. DOS ANJOS', '267', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11976247629';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ERICO VERISSIMO', '136', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11951421794';
INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)
SELECT id, 'RUA ITAMAR ASSUMPÇÃO', '199', NULL, 'MIRAGE', NULL, 2
FROM public.clientes WHERE telefone = '11952887009';