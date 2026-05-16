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

// Alerta de novo pedido — 3 bipes rápidos urgentes (dashboard)
export function playNewOrderAlert() {
  beep(880, 0.00, 0.10, 0.45, 'square')
  beep(880, 0.18, 0.10, 0.45, 'square')
  beep(880, 0.36, 0.18, 0.45, 'square')
}

// Som de status aceito — dois tons ascendentes positivos (PWA cliente)
export function playSoundAceito() {
  beep(523, 0.00, 0.12) // C5
  beep(659, 0.18, 0.20) // E5
}

// Som de em entrega — três tons progressivos (PWA cliente)
export function playSoundEmEntrega() {
  beep(440, 0.00, 0.10) // A4
  beep(554, 0.16, 0.10) // C#5
  beep(659, 0.32, 0.22) // E5
}

// Som de entregue — acorde final festivo (PWA cliente)
export function playSoundEntregue() {
  beep(523, 0.00, 0.10) // C5
  beep(659, 0.14, 0.10) // E5
  beep(784, 0.28, 0.30) // G5
}

// Som de recusado — dois tons descendentes (PWA cliente)
export function playSoundRecusado() {
  beep(440, 0.00, 0.20) // A4
  beep(349, 0.28, 0.30) // F4
}

export function playSoundPorStatus(status: string) {
  switch (status) {
    case 'em_preparo': playSoundAceito(); break
    case 'em_entrega': playSoundEmEntrega(); break
    case 'entregue':   playSoundEntregue(); break
    case 'recusado':   playSoundRecusado(); break
  }
}

// Vibração (mobile) — vibra se disponível
export function vibrar(pattern: number | number[] = [200, 100, 200]) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(pattern)
  } catch {}
}

// Solicitar permissão de notificação do navegador
export async function pedirPermissaoNotificacao(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

// Mostrar notificação do navegador (funciona mesmo com aba em background)
export function mostrarNotificacaoBrowser(titulo: string, opcoes?: { body?: string; icon?: string; tag?: string }) {
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
