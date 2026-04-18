import { readFileSync, writeFileSync } from 'fs'

// Tabela CP850 → Unicode (code points)
const CP850 = [
  // 0x00-0x7F: igual ASCII
  ...Array.from({length:128},(_,i)=>i),
  // 0x80-0xFF: mapeamento CP850
  0xC7,0xFC,0xE9,0xE2,0xE4,0xE0,0xE5,0xE7, // 80-87  Ç ü é â ä à å ç
  0xEA,0xEB,0xE8,0xEF,0xEE,0xEC,0xC4,0xC5, // 88-8F  ê ë è ï î ì Ä Å
  0xC9,0xE6,0xC6,0xF4,0xF6,0xF2,0xFB,0xF9, // 90-97  É æ Æ ô ö ò û ù
  0xFF,0xD6,0xDC,0xF8,0xA3,0xD8,0xD7,0x192,// 98-9F  ÿ Ö Ü ø £ Ø × ƒ
  0xE1,0xED,0xF3,0xFA,0xF1,0xD1,0xAA,0xBA, // A0-A7  á í ó ú ñ Ñ ª º
  0xBF,0xAE,0xAC,0xBD,0xBC,0xA1,0xAB,0xBB, // A8-AF  ¿ ® ¬ ½ ¼ ¡ « »
  0x2591,0x2592,0x2593,0x2502,0x2524,       // B0-B4  ░▒▓│┤
  0xC1,0xC2,0xC0,0xA9,                      // B5-B8  Á Â À ©
  0x2563,0x2551,0x2557,0x255D,0xA2,0xA5,0x2510, // B9-BF ╣║╗╝¢¥┐
  0x2514,0x2534,0x252C,0x251C,0x2500,0x253C,// C0-C5  └┴┬├─┼
  0xE3,0xC3,                                // C6-C7  ã Ã ← CHAVE!
  0x255A,0x2554,0x2569,0x2566,0x2560,0x2550,0x256C,0xA4, // C8-CF ╚╔╩╦╠═╬¤
  0xF0,0xD0,0xCA,0xCB,0xC8,0x131,0xCD,0xCE,// D0-D7  ð Ð Ê Ë È ı Í Î
  0xCF,0x2518,0x250C,0x2588,0x2584,0xA6,0xCC,0x2580, // D8-DF Ï┘┌█▄¦Ì▀
  0xD3,0xDF,0xD4,0xD2,0xF5,0xD5,0xB5,0xFE, // E0-E7  Ó ß Ô Ò õ Õ µ þ
  0xDE,0xDA,0xDB,0xD9,0xFD,0xDD,0xAF,0xB4, // E8-EF  Þ Ú Û Ù ý Ý ¯ ´
  0xAD,0xB1,0x2017,0xBE,0xB6,0xA7,0xF7,0xB8,// F0-F7 ­ ± ‗ ¾ ¶ § ÷ ¸
  0xB0,0xA8,0xB7,0xB9,0xB3,0xB2,0x25A0,0xA0,// F8-FF ° ¨ · ¹ ³ ² ■
]

function decodeCp850(buf) {
  return Array.from(buf).map(b => String.fromCodePoint(CP850[b])).join('')
}

function cleanPhone(p) { return p.replace(/\D/g, '') }
function esc(s) { return s.trim().replace(/'/g, "''") }
function opt(s) { const v = esc(s); return v ? `'${v}'` : 'NULL' }
function dist(s) { const v = parseFloat(s.trim().replace(',', '.')); return isNaN(v) ? 'NULL' : v }

const buf = readFileSync('C:/Users/Lucaspc/Downloads/Pasta1.csv')
const raw = decodeCp850(buf)
const lines = raw.split('\n').slice(1)

const rows = []
for (const line of lines) {
  const trimmed = line.trim()
  if (!trimmed) continue
  const cols = trimmed.split(';')
  while (cols.length < 8) cols.push('')
  const [nome, telefone, logradouro, numero, complemento, bairro, referencia, distancia_km] = cols
  const tel = cleanPhone(telefone)
  if (!nome.trim() || !tel) continue
  rows.push({ nome: esc(nome), telefone: tel, logradouro: esc(logradouro), numero: esc(numero), complemento: opt(complemento), bairro: esc(bairro), referencia: opt(referencia), distancia_km: dist(distancia_km) })
}

const out = []
out.push('-- ============================================================')
out.push(`-- Importação em lote: ${rows.length} clientes`)
out.push('-- Execute no SQL Editor do Supabase')
out.push('-- ============================================================')
out.push('')
out.push('-- PASSO 1: Inserir clientes (ignora telefone duplicado)')
out.push('INSERT INTO public.clientes (nome, telefone) VALUES')
out.push(rows.map(r => `  ('${r.nome}', '${r.telefone}')`).join(',\n'))
out.push('ON CONFLICT (telefone) DO NOTHING;')
out.push('')
out.push('-- PASSO 2: Inserir endereços vinculados ao cliente pelo telefone')
for (const r of rows) {
  out.push(`INSERT INTO public.enderecos (cliente_id, logradouro, numero, complemento, bairro, referencia, distancia_km)`)
  out.push(`SELECT id, '${r.logradouro}', '${r.numero}', ${r.complemento}, '${r.bairro}', ${r.referencia}, ${r.distancia_km}`)
  out.push(`FROM public.clientes WHERE telefone = '${r.telefone}';`)
}

writeFileSync('C:/Users/Lucaspc/DoxyEsquina/supabase/importacao_clientes.sql', out.join('\n'), 'utf-8')
console.log(`✓ Gerado: importacao_clientes.sql (${rows.length} clientes)`)

// Verificação: mostrar alguns nomes com acentuação
const amostra = rows.filter(r => /[ÃÇÕÁÉÍÓÚ]/i.test(r.nome) || /[ÃÇÕÁÉÍÓÚ]/i.test(r.logradouro)).slice(0, 5)
amostra.forEach(r => console.log(`  ${r.nome} | ${r.logradouro}`))
