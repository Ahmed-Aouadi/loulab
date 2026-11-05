// عامل الخدمة: يخزّن الواجهة كلّها لتعمل دون اتصال. غيّر VERSION عند أي تحديث.
const VERSION = 'burum-v2.1.1', CORE = ['./', 'index.html', 'css/app.css', 'manifest.webmanifest', 'brand/BRAND_MARK.svg', 'brand/BRAND_LOCKUP.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch.png',
  'js/main.js', 'js/store.js', 'js/audio.js', 'js/art.js', 'js/activities.js', 'js/ui.js', 'js/player.js', 'js/studio.js', 'js/explore.js', 'js/views.js',
  'js/content/util.js', 'js/content/index.js', 'js/content/arabic.js', 'js/content/math.js', 'js/content/science.js', 'js/content/english.js', 'js/content/authored.js', 'js/content/more.js', 'js/content/rest.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r).then(hit => { const net = fetch(r).then(res => { if (res.ok) caches.open(VERSION).then(c => c.put(r, res.clone())); return res; }).catch(() => hit || (r.mode === 'navigate' ? caches.match('index.html') : undefined)); return hit || net; }));
});
