// Fait fonctionner l'appli sans réseau (iPad, navigateur) : tout est mis en cache à la première ouverture.
const CACHE = "dragonne-club-v2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./logo.jpg",
  "./emblem.png",
  "./gto.png",
  "./gto.jpg",
  "./bdc/gto.jpg",
  "./bdc/vdb.jpg",
  "./fonts/atkinson-hyperlegible-latin-400-normal.woff2",
  "./fonts/atkinson-hyperlegible-latin-700-normal.woff2",
  "./fonts/bricolage-grotesque-latin-600-normal.woff2",
  "./fonts/bricolage-grotesque-latin-800-normal.woff2",
  "./merch/gto-backpack.jpg",
  "./merch/gto-bali.jpg",
  "./merch/gto-banto.jpg",
  "./merch/gto-barla.jpg",
  "./merch/gto-barli.jpg",
  "./merch/gto-bemic.jpg",
  "./merch/gto-blive.jpg",
  "./merch/gto-borgo.jpg",
  "./merch/gto-brizza.jpg",
  "./merch/gto-brizzo.jpg",
  "./merch/gto-dalci.jpg",
  "./merch/gto-dalcito.jpg",
  "./merch/gto-danca.jpg",
  "./merch/gto-danco.jpg",
  "./merch/gto-diolo.jpg",
  "./merch/gto-dolvano.jpg",
  "./merch/gto-dolve.jpg",
  "./merch/gto-dolvole.jpg",
  "./merch/gto-dovo.jpg",
  "./merch/gto-fianta.jpg",
  "./merch/gto-fianto.jpg",
  "./merch/gto-fievola.jpg",
  "./merch/gto-fievolo.jpg",
  "./merch/gto-gaggio.jpg",
  "./merch/gto-garcisio.jpg",
  "./merch/gto-giambolo.jpg",
  "./merch/gto-martio.jpg",
  "./merch/gto-odolon.jpg",
  "./merch/gto-passo.jpg",
  "./merch/gto-valas.jpg",
  "./merch/gto-vianetta.jpg",
  "./merch/gto-vianetto.jpg",
  "./merch/gto-viatto.jpg",
  "./merch/gto-wister.jpg",
  "./merch/vdb-backpack.jpg",
  "./merch/vdb-bali.jpg",
  "./merch/vdb-banto.jpg",
  "./merch/vdb-barla.jpg",
  "./merch/vdb-barli.jpg",
  "./merch/vdb-bemic.jpg",
  "./merch/vdb-blive.jpg",
  "./merch/vdb-borgo.jpg",
  "./merch/vdb-brizza.jpg",
  "./merch/vdb-brizzo.jpg",
  "./merch/vdb-dalci.jpg",
  "./merch/vdb-dalcito.jpg",
  "./merch/vdb-danca.jpg",
  "./merch/vdb-danco.jpg",
  "./merch/vdb-diolo.jpg",
  "./merch/vdb-dolvano.jpg",
  "./merch/vdb-dolve.jpg",
  "./merch/vdb-dolvole.jpg",
  "./merch/vdb-dovo.jpg",
  "./merch/vdb-fianta.jpg",
  "./merch/vdb-fianto.jpg",
  "./merch/vdb-fievola.jpg",
  "./merch/vdb-fievolo.jpg",
  "./merch/vdb-gaggio.jpg",
  "./merch/vdb-garcisio.jpg",
  "./merch/vdb-giambolo.jpg",
  "./merch/vdb-martio.jpg",
  "./merch/vdb-odolon.jpg",
  "./merch/vdb-passo.jpg",
  "./merch/vdb-valas.jpg",
  "./merch/vdb-vianetta.jpg",
  "./merch/vdb-vianetto.jpg",
  "./merch/vdb-viatto.jpg",
  "./merch/vdb-wister.jpg"
  ];

self.addEventListener("install", e => {
  // Chaque fichier est mis en cache séparément : un fichier manquant ne bloque pas l'installation.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  // Réseau d'abord (pour recevoir les mises à jour), avec un délai court : au stand sans réseau, le cache répond vite.
  const fromCache = () => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html"));
  const net = fetch(e.request).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
    return res;
  });
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("lent")), 4000));
  e.respondWith(Promise.race([net, timeout]).catch(() => fromCache().then(r => r || net)));
});
