const cacheName = 'piac-pwa-v2'; // Zmień wersję przy aktualizacji
const filesToCache = [
 './',
 './index.html',
 './style.css',
 './js/main.js',
 './site.webmanifest',
 './images/web-app-manifest-192x192.png'
];

self.addEventListener('install', (event) => {
 event.waitUntil(
  caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
 );
});

self.addEventListener('fetch', (event) => {
 event.respondWith(
  caches.match(event.request).then((response) => {
   return response || fetch(event.request).then((fetchResponse) => {
    return caches.open(cacheName).then((cache) => {
     // Dynamiczne cache'owanie plików GET
     if (event.request.method === 'GET') {
      cache.put(event.request, fetchResponse.clone());
     }
     return fetchResponse;
    });
   });
  }).catch(() => caches.match('./index.html')) // Fallback offline
 );
});