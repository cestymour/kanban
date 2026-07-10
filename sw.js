const CACHE = 'kanban-v1';
const ASSETS = [
  './index.html',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installation : cache tolérant aux erreurs (un échec n'annule pas tout)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] Impossible de cacher :', url, err)
          )
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// Activation : suppression des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch : cache-first, réseau en fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('./index.html'))
  );
});
