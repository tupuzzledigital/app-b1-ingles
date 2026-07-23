const APP_VERSION = 'v0.4.0';
const APP_CACHE = 'b1-app-' + APP_VERSION;

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/reset.css',
  '/assets/css/vars.css',
  '/assets/css/base.css',
  '/assets/js/app.js',
  '/assets/js/router.js',
  '/assets/js/logger.js',
  '/assets/js/csv-parser.js',
  '/assets/js/validator.js',
  '/assets/js/content-loader.js',
  '/assets/js/store.js',
  '/assets/js/ui-components.js',
  '/assets/js/exercise-engine.js',
  '/assets/js/views/home.js',
  '/assets/js/views/onboarding.js',
  '/assets/js/views/reading-list.js',
  '/assets/js/views/reading-exercise.js',
  '/assets/js/views/result.js',
  '/assets/vendor/papaparse.min.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-512-maskable.png',
  '/content/reading.csv',
  '/content/version.txt',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name.startsWith('b1-app-') && name !== APP_CACHE)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
