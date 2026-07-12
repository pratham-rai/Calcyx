/* ============================================================
   CALCYX — Progressive Web App Service Worker
   ============================================================ */

const CACHE_VERSION = 'calcyx-v2';
const CACHE_SHELL = `shell-${CACHE_VERSION}`;
const CACHE_CALCS = `calcs-${CACHE_VERSION}`;
const CACHE_DYNAMIC = `dynamic-${CACHE_VERSION}`;

// Precache list for core app shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/src/main.js',
  '/src/router.js',
  '/src/calculators/registry.js',
  '/src/calculators/base.js',
  '/src/styles/index.css',
  '/src/styles/components.css',
  '/src/styles/calculator.css',
  '/src/utils/storage.js',
  '/src/utils/format.js',
  '/src/utils/share.js',
  '/src/components/header.js',
  '/src/components/search.js',
  '/src/components/categoryTiles.js',
  '/src/components/calculatorCard.js',
  '/src/components/favorites.js',
  '/src/components/installPrompt.js',
  '/src/pages/home.js',
  '/src/pages/category.js',
  '/src/pages/calculatorPage.js'
];

// install event — Precache core shell files
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => {
      console.log('[SW] Precaching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// activate event — Clear old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_SHELL && key !== CACHE_CALCS && key !== CACHE_DYNAMIC) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// fetch event — 3-Tier caching strategy
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // 1. Navigation requests (SPA page navigation) -> always serve index.html from cache
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html')
        .then((cachedResponse) => cachedResponse || fetch(e.request))
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // 2. Calculator modules (lazy-loaded JS files) -> cache-first, then network
  if (url.pathname.includes('/src/calculators/')) {
    e.respondWith(
      caches.open(CACHE_CALCS).then((cache) => {
        return cache.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          return fetch(e.request).then((networkResponse) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 3. App Shell Static Assets & Fonts -> Cache First
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(e.request)
        .then((networkResponse) => {
          // Cache fonts, icons, logo or other runtime assets dynamically
          if (
            url.origin === self.location.origin ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')
          ) {
            return caches.open(CACHE_DYNAMIC).then((cache) => {
              cache.put(e.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (e.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
