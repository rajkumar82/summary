// Minimal service worker for this static bucket site: makes the page installable and lets it
// open offline. Paths are relative (no leading /) since the site has no domain root of its own —
// it's served under a bucket path prefix on storage.googleapis.com.
// Bump CACHE when the shell files change in a way that must not be served stale.
const CACHE = 'summary-v1';
const SHELL = ['index.html', 'manifest.webmanifest', 'photo.jpg', 'favicon.png', 'apple-touch-icon.png',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'install.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) => {
      const refresh = fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      });
      return hit || refresh;
    }).catch(() => caches.match('index.html')),
  );
});
