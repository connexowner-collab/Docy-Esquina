import csv
import re

def clean_phone(phone):
    return re.sub(r'\D', '', phone.strip())

def clean_text(text):
    return text.strip().replace("'", "''") if text else ''

def clean_optional(text):
    v = clean_text(text)
    return f"'{v}'" if v else 'NULL'

def clean_distancia(dist):
    if not dist or not dist.strip():
        return 'NULL'
    try:
        return str(float(dist.strip().replace(',', '.')))
    except Exception:
        return 'NULL'

rows = []
with open(r'C:\Users\Lucaspc\Downloads\Pasta1.csv', encoding='cp1252') as f:
    reader = csv.reader(f, delimiter=';')
    next(reader)  # pular cabeçalho
    for row in reader:
        if len(row) < 2:
            continue
        while len(row) < 8:
            row.append('')
        nome, telefone, logradouro, numero, complemento, bairro, referencia, distancia_km = row[:8]
        telefone_limpo = clean_phone(telefone)
        if not nome.strip() or not telefone_limpo:
            continue
        rows.append({
            'nome':          clean_text(nome),
            'telefone':      telefone_limpo,
            'logradouro':    clean_text(logradouro),
            'numero':        clean_text(numero),
            'complemento':   clean_optional(complemento),
            'bairro':        clean_text(bairro),
            'referencia':    clean_optional(referencia),
            'distancia_km':  clean_distancia(distancia_km),
        })

lines = []
lines.append('-- ============================================================')
lines.append('-- Importação em lote: clientes e endereços')
lines.append(f'-- Total: {len(rows)} registros')
lines.append('-- ============================================================')
lines.append('')

# ── 1. Clientes ──────────────────────────────────────────────
lines.append('-- PASSO 1: Inserir clientes (ignora telefone duplicado)')
lines.append('INSERT INTO public.clientes (nome, telefone) VALUES')
valores = [f"  ('{r['nome']}', '{r['telefone']}')" for r in rows]
lines.append(',\n'.join(valores))
lines.append('ON CONFLICT (telefone) DO NOTHING;')
lines.append('')

# ── 2. Endereços ─────────────────────────────────────────────
lines.append('-- PASSO 2: Inserir endereços vinculados ao cliente pelo telefone')
for r in rows:
    lines.append(
        f"INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)\n"
        f"SELECT id, '{r['logradouro']}', '{r['numero']}', {r['complemento']}, '{r['bairro']}', {r['referencia']}, {r['distancia_km']}\n"
        f"FROM public.clientes WHERE telefone = '{r['telefone']}';"
    )

output = '\n'.join(lines)
with open(r'C:\Users\Lucaspc\DoxyEsquina\supabase\importacao_clientes.sql', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"✓ Gerado: supabase/importacao_clientes.sql ({len(rows)} clientes)")
