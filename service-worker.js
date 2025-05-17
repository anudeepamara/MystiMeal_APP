// Define a cache name for your PWA assets
const CACHE_NAME = 'mystimeal-cache-v1';

// List the core files of your application that you want to cache
// This should include your HTML, CSS, and JavaScript files, plus any essential assets like offline pages.
const urlsToCache = [
  '/', // Cache the root path (your index.html)
  '/index.html', // Explicitly cache index.html
  // Add your CSS file if it's separate, e.g., '/style.css'
  // Add your JavaScript file if it's separate, e.g., '/script.js'
  // For this single HTML file, we'll rely on caching the index.html itself
  // and the browser's cache for external resources like Tailwind and Font Awesome.
  // In a real PWA, you would list all your core assets here.
];

// Install event: Cache the core assets when the service worker is installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching core app assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Intercept network requests and serve from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If the requested resource is in the cache, return it
        if (response) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise, fetch the resource from the network
        console.log('Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
