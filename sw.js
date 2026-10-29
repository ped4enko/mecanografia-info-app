// Offline-first service worker. Bump VERSION on every release so clients pick up new files.
const VERSION = 'v1.0.4';
const CACHE = `mecanografia-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './about.html',
  './offline.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/texts.js',
  './js/keyboard.js',
  './js/i18n.js',
  './icons/favicon.ico',
  './icons/icon-96.png',
  './icons/icon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('mecanografia-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;

  // Pages: network first so updates show quickly, cache as fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => (await caches.match(request, { ignoreSearch: true }))
          || (await caches.match('./index.html'))
          || caches.match('./offline.html'))
    );
    return;
  }

  // Static assets: cache first, then network (and remember the response).
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
      }
      return res;
    }))
  );
});
