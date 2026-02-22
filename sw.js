const cacheName = 'piac-pwa-v1';
const filesToCache = [
 '/',
 '/index.html',
 '/style.css',
 '/js/main.js',
 '/images/favicon-96x96.png'
];

// Instalacja i buforowanie plików statycznych
self.addEventListener('install', (event) => {
 event.waitUntil(
  caches.open(cacheName).then((cache) => {
   return cache.addAll(filesToCache);
  })
 );
});

// Obsługa zapytań i buforowanie dynamiczne
self.addEventListener('fetch', (event) => {
 event.respondWith(
  caches.match(event.request).then((response) => {
   // Zwróć z cache lub pobierz z sieci
   return response || fetch(event.request).then((fetchResponse) => {
    // Buforuj tylko udane zapytania GET
    if (event.request.method === 'GET') {
     return caches.open(cacheName).then((cache) => {
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
     });
    }
    return fetchResponse;
   });
  }).catch(() => {
   // Fallback dla braku połączenia przy nawigacji
   if (event.request.mode === 'navigate') {
    return caches.match('/index.html');
   }
  })
 );
});

// Aktywacja i czyszczenie starego cache
self.addEventListener('activate', (event) => {
 const cacheWhitelist = [cacheName];
 event.waitUntil(
  caches.keys().then((cacheNames) => {
   return Promise.all(
    cacheNames.map((cache) => {
     if (!cacheWhitelist.includes(cache)) {
      return caches.delete(cache);
     }
    })
   );
  })
 );
});