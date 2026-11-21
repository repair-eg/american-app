const CACHE_NAME = 'american-group-pwa-v1';
const ROOT = new URL('./', self.registration.scope);
const APP_FILES = [
  'index.html',
  'about.html',
  'services.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'styles.css',
  'script.js',
  'manifest.json',
  'american-united-group-logo.jpg',
  'icons/app-192.png',
  'icons/app-512.png',
  'icons/apple-touch-icon.png',
  'assets/air-conditioner.jpg',
  'assets/dishwasher.jpg',
  'assets/oven.jpg',
  'assets/refrigerator.jpg',
  'assets/technicians.jpg',
  'assets/washing-machine.jpg',
  'assets/water-heater.jpg'
].map((path) => new URL(path, ROOT).href);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request)) || (await caches.match(new URL('index.html', ROOT).href));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh.ok) (await caches.open(CACHE_NAME)).put(request, fresh.clone());
      return fresh;
    } catch {
      return Response.error();
    }
  })());
});
