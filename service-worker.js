const CACHE_NAME = 'camisetazo-cache-v16';

// Solo cachear assets estáticos (JS, CSS, imágenes, fuentes).
// NUNCA cachear HTML — los documentos HTML llevan headers de seguridad
// (CSP, Cache-Control, etc.) que deben venir siempre frescos del servidor.
const ASSETS_TO_CACHE = [
  './css/styles.css',
  './css/variables.css',
  './css/reset.css',
  './css/ux-feedback.css',
  './js/theme.js?v=4',
  './js/components.js?v=4',
  './js/ux-feedback.js',
  './js/analytics.js',
  './manifest.json',
  './assets/logo/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url =>
            cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminando caché obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Escuchar mensajes del cliente (skipWaiting para auto-actualización) ────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (event.request.method !== 'GET') return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;
  if (url.includes('.map')) return;

  // ── Regla 1: HTML → SIEMPRE red con cache: 'no-store' ─────────────────
  const isHtml = url.endsWith('.html') ||
    url.endsWith('/') ||
    event.request.mode === 'navigate' ||
    event.request.headers.get('Accept')?.includes('text/html');

  if (isHtml) {
    event.respondWith(
      fetch(new Request(event.request, {
        cache: 'no-store',
        redirect: 'follow'
      })).catch(() => {
        return new Response('<h1>Sin conexión</h1>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })
    );
    return;
  }

  // ── Regla 2: Dominios externos — pasar directamente a la red ───────────
  const PASS_THROUGH_DOMAINS = [
    'firebaseio.com',
    'firebasedatabase.app',
    'firebase.googleapis.com',
    'identitytoolkit.googleapis.com',
    'securetoken.google.com',
    'apis.google.com',
    'accounts.google.com',
    'googleapis.com',
    'gstatic.com',
    'google-analytics.com',
    'analytics.google.com',
    'googletagmanager.com',
    'stats.g.doubleclick.net',
    'plausible.io',
    'contentsquare.net',
    'api.web3forms.com',
    'www.paypal.com',
    'analytics.vercel.com',
  ];

  const isPassThrough = PASS_THROUGH_DOMAINS.some(domain => url.includes(domain));

  if (isPassThrough) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('', { status: 503 });
      })
    );
    return;
  }

  // ── Regla 3a: JS propios → Network First (siempre fresco, caché de respaldo) ──
  // Esto garantiza que el código actualizado llega a todos los usuarios
  // automáticamente, sin necesidad de limpiar caché manualmente.
  const isOwnJs = url.includes('/js/') && url.includes(self.location.origin);

  if (isOwnJs) {
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
          // Sin red: servir desde caché como fallback
          return caches.match(event.request);
        })
    );
    return;
  }

  // ── Regla 3b: CSS, imágenes, fuentes → Cache First ─────────────────────
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const url = event.request.url;
            const isAsset = url.includes('/css/') ||
              url.includes('/assets/') ||
              url.match(/\.(woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)(\?|$)/);

            if (isAsset) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        });
    })
  );
});
