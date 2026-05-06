const CACHE = 'docy-v1'

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', e => {
  // Apenas estratégia network-first simples
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then(cached => cached || new Response('', { status: 408 }))
    )
  )
})
