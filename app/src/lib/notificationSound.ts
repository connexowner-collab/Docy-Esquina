// ─── Gerenciador de áudio ─────────────────────────────────────────────────────
// iOS/Android bloqueiam áudio até o usuário tocar na tela.
// Chame `desbloquearAudio()` dentro de um handler de click/touch.

let desbloqueado = false
const audioCache: Record<string, HTMLAudioElement> = {}

function criarAudio(src: string): HTMLAudioElement {
  if (audioCache[src]) return audioCache[src]
  const el = new Audio(src)
  el.preload = 'auto'
  audioCache[src] = el
  return el
}

// Chame isso em qualquer interação do usuário para desbloquear áudio no iOS/Android
export function desbloquearAudio() {
  if (desbloqueado) return
  // Desbloqueia Web Audio Context com um buffer de silêncio de 1 frame
  try {
    const tmpCtx = new AudioContext()
    const buf = tmpCtx.createBuffer(1, 1, 22050)
    const src = tmpCtx.createBufferSource()
    src.buffer = buf
    src.connect(tmpCtx.destination)
    src.start(0)
    src.onended = () => { tmpCtx.close(); desbloqueado = true }
  } catch {}
  // Pré-carrega os arquivos de áudio enquanto há gesto ativo
  Object.values(SONS).forEach(src => criarAudio(src))
}

export function audioDesbloqueado() { return desbloqueado }

// ─── Mapa de arquivos de áudio ────────────────────────────────────────────────
// Coloque os arquivos MP3 em public/sounds/
const SONS = {
  'novo-pedido':      '/sounds/novo-pedido.mp3',
  'pedido-aceito':    '/sounds/pedido-aceito.mp3',
  'saiu-entrega':     '/sounds/saiu-entrega.mp3',
  'pedido-entregue':  '/sounds/pedido-entregue.mp3',
  'pedido-recusado':  '/sounds/pedido-recusado.mp3',
} as const

type SomKey = keyof typeof SONS

function tocar(chave: SomKey) {
  try {
    const audio = criarAudio(SONS[chave])
    audio.currentTime = 0
    audio.play().catch(() => {
      // Fallback: Web Speech API se áudio falhar
      falarFallback(chave)
    })
  } catch {
    falarFallback(chave)
  }
}

// ─── Fallback: Web Speech API (quando não há arquivo ou falha) ────────────────
const TEXTOS_FALLBACK: Record<SomKey, string> = {
  'novo-pedido':     'Novo pedido recebido!',
  'pedido-aceito':   'Seu pedido foi aceito e está sendo preparado!',
  'saiu-entrega':    'Seu pedido saiu para entrega!',
  'pedido-entregue': 'Pedido entregue. Bom apetite!',
  'pedido-recusado': 'Infelizmente seu pedido foi recusado.',
}

function falarFallback(chave: SomKey) {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(TEXTOS_FALLBACK[chave])
  u.lang = 'pt-BR'
  u.rate = 0.92
  u.pitch = 1.05
  u.volume = 1.0
  const trySpeak = () => {
    const voices = speechSynthesis.getVoices()
    const ptVoz = voices.find(v => v.lang === 'pt-BR') ?? voices.find(v => v.lang.startsWith('pt'))
    if (ptVoz) u.voice = ptVoz
    speechSynthesis.speak(u)
  }
  if (speechSynthesis.getVoices().length > 0) trySpeak()
  else speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true })
}

// ─── Exports públicos ─────────────────────────────────────────────────────────
export function playNewOrderAlert() {
  tocar('novo-pedido')
}

export function playSoundPorStatus(status: string) {
  switch (status) {
    case 'em_preparo': tocar('pedido-aceito'); break
    case 'em_entrega': tocar('saiu-entrega'); break
    case 'entregue':   tocar('pedido-entregue'); break
    case 'recusado':   tocar('pedido-recusado'); break
  }
}

export function vibrar(pattern: number | number[] = [200, 100, 200]) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {}
}

export async function pedirPermissaoNotificacao(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

export function mostrarNotificacaoBrowser(titulo: string, opcoes?: { body?: string; tag?: string }) {
  try {
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    new Notification(titulo, {
      icon: '/LOGO.png',
      badge: '/LOGO.png',
      tag: opcoes?.tag ?? 'docy-notif',
      body: opcoes?.body,
    })
  } catch {}
}
