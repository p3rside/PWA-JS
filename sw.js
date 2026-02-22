const cacheName = 'piac-pwa-v1';
const filesToCache = [
 '/',
 '/index.html',
 '/rosliny.html', 
 '/style.css',
 '/js/main.js',
 '/images/favicon-96x96.png',
 '/images/web-app-manifest-192x192.png',
 '/images/web-app-manifest-512x512.png',
 '/images/apple-touch-icon.png'
];


self.addEventListener('install', (event) => {
 event.waitUntil(
  caches.open(cacheName).then((cache) => {
   return cache.addAll(filesToCache);
  })
 );
});


self.addEventListener('fetch', (event) => {
 event.respondWith(
  caches.match(event.request).then((response) => {
   
   return response || fetch(event.request).then((fetchResponse) => {
    return caches.open(cacheName).then((cache) => {
     // Dynamiczne dodawanie nowych plików do cache
     cache.put(event.request, fetchResponse.clone());
     return fetchResponse;
    });
   });
  }).catch(() => {
  
   if (event.request.mode === 'navigate') {
    return caches.match('/index.html');
   }
  })
 );
});


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