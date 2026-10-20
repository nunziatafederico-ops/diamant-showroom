/* Diamant Showroom — offline cache. The build stamps BUILD; a new build installs a fresh cache and drops the old one. */
const BUILD = '20261020-104622', CACHE = 'diamant-' + BUILD;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.png', 'icon-180.png', 'icon-512.png',
  'vendor/three.module.js', 'vendor/OrbitControls.js', 'vendor/RoomEnvironment.js', 'vendor/qrcode.js', 'fonts/fonts.css', 'fonts/f00.woff2', 'fonts/f01.woff2', 'fonts/f02.woff2', 'fonts/f03.woff2', 'fonts/f04.woff2', 'fonts/f05.woff2', 'fonts/f06.woff2', 'fonts/f07.woff2', 'fonts/f08.woff2', 'fonts/f09.woff2', 'fonts/f10.woff2', 'fonts/f11.woff2', 'fonts/f12.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (u.origin !== location.origin || e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate'){   // the page itself: fresh when online, cached when not
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })));
});
