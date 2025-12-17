const CACHE_NAME = 'camisetazo-cache-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles/styles.css',
  './scripts/scripts.js',
  './scripts/cart-persistence.js',
  './scripts/schema-org.js',
  './scripts/performance-optimizations.js',
  './manifest.json',
  './assets/logos/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url =>
            cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  
  if (event.request.method !== 'GET') return;

  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return;
  }

  
  if (url.includes('.map')) {
    return;
  }

  
  if (
    url.includes('analytics.vercel.com') ||
    url.includes('www.googletagmanager.com') ||
    url.includes('google-analytics.com') ||
    url.includes('analytics.google.com') ||
    url.includes('plausible.io') ||
    url.includes('contentsquare.net') ||
    url.includes('api.web3forms.com') ||
    url.includes('gstatic.com') ||
    url.includes('firebaseio.com') ||
    url.includes('firebasedatabase.app') ||
    url.includes('googleapis.com')
  ) {
    event.respondWith(fetch(event.request).catch(() => {
      
      return new Response('', { status: 503 });
    }));
    return;
  }

  
  const requestUrl = new URL(url);
  const isSameOrigin = requestUrl.origin === location.origin;

  if (!isSameOrigin) {
    
    event.respondWith(fetch(event.request).catch(() => {
      return new Response('', { status: 503 });
    }));
    return;
  }

  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
