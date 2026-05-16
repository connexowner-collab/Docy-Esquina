// ─── Web Audio API (beeps de apoio) ──────────────────────────────────────────
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx || ctx.state === 'closed') ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function beep(freq: number, startOffset: number, dur: number, vol = 0.35, type: OscillatorType = 'sine') {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, c.currentTime + startOffset)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + startOffset + dur)
    osc.start(c.currentTime + startOffset)
    osc.stop(c.currentTime + startOffset + dur)
  } catch {}
}

// ─── Web Speech API (voz em português) ───────────────────────────────────────
function falar(texto: string, delayMs = 0) {
  if (typeof speechSynthesis === 'undefined') return

  const speak = () => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(texto)
    u.lang = 'pt-BR'
    u.rate = 0.92   // levemente mais lento — mais claro
    u.pitch = 1.05
    u.volume = 1.0

    // Tenta usar voz PT-BR; se não achar usa a padrão
    const voices = speechSynthesis.getVoices()
    const ptVoz = voices.find(v => v.lang === 'pt-BR')
      ?? voices.find(v => v.lang.startsWith('pt'))
    if (ptVoz) u.voice = ptVoz

    speechSynthesis.speak(u)
  }

  if (delayMs > 0) {
    setTimeout(speak, delayMs)
  } else if (speechSynthesis.getVoices().length > 0) {
    speak()
  } else {
    // Vozes carregam de forma assíncrona em alguns browsers
    speechSynthesis.addEventListener('voiceschanged', speak, { once: true })
  }
}

// ─── Alertas dashboard (novo pedido) ─────────────────────────────────────────
export function playNewOrderAlert() {
  // 3 bipes urgentes + voz
  beep(880, 0.00, 0.10, 0.45, 'square')
  beep(880, 0.18, 0.10, 0.45, 'square')
  beep(880, 0.36, 0.18, 0.45, 'square')
  falar('Novo pedido recebido!', 700)
}

// ─── Sons por status (PWA cliente) ───────────────────────────────────────────
export function playSoundPorStatus(status: string) {
  switch (status) {
    case 'em_preparo':
      beep(523, 0.00, 0.12) // C5
      beep(659, 0.18, 0.20) // E5
      falar('Seu pedido foi aceito e está sendo preparado!', 500)
      break

    case 'em_entrega':
      beep(440, 0.00, 0.10) // A4
      beep(554, 0.16, 0.10) // C#5
      beep(659, 0.32, 0.22) // E5
      falar('Seu pedido saiu para entrega!', 600)
      break

    case 'entregue':
      beep(523, 0.00, 0.10) // C5
      beep(659, 0.14, 0.10) // E5
      beep(784, 0.28, 0.30) // G5
      falar('Pedido entregue. Bom apetite!', 500)
      break

    case 'recusado':
      beep(440, 0.00, 0.20) // A4
      beep(349, 0.28, 0.30) // F4 (descendente)
      falar('Infelizmente seu pedido foi recusado.', 600)
      break
  }
}

// ─── Utilitários ─────────────────────────────────────────────────────────────
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
