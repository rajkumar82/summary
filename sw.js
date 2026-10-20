// Minimal service worker for this static bucket site: makes the page installable and lets it
// open offline. Paths are relative (no leading /) since the site has no domain root of its own —
// it's served under a bucket path prefix on storage.googleapis.com.
// Bump CACHE when the shell files change in a way that must not be served stale.
const CACHE = 'summary-v12';
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
  // Pages and code: network first, so a new deploy shows up on the very next open. The saved copy is only the offline fallback.
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match('index.html'))),
  );
});
