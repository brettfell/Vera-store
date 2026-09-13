const CACHE_NAME = 'pretend-store-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/1.png',
  './images/2.png',
  './images/3.png',
  './images/4.png',
  './images/5.png',
  './images/icon-192.png',
  './images/icon-512.png'
];

// Cache core assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use cache.addAll with individual catch so missing images don't break installation
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn(`Asset skipped during precache: ${url}`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// Clean up previous cache versions
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

// Cache-first offline delivery
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
