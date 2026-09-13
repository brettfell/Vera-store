const CACHE_NAME = 'pretend-store-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/1.png',
  './images/2.png',
  './images/3.png',
  './images/4.png',
  './images/5.png',
  './images/6.png',
  './images/7.png',
  './images/8.png',
  './images/9.png',
  './images/10.png',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`Asset skipped during precache: ${url}`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
