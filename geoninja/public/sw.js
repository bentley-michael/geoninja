// Geography Ninja — Service Worker
// Handles: offline cache, push notifications for streak reminders

const CACHE = "geoninja-v2";
const PRECACHE = ["/", "/index.html", "/manifest.json"];

// ── Install: pre-cache shell ──────────────────────────────────────────────────
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── Activate: drop old caches ─────────────────────────────────────────────────
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API, cache-first for assets ─────────────────────
self.addEventListener("fetch", e => {
  if (e.request.url.includes("/api/")) return; // never cache API calls
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── Push: streak reminder notification ───────────────────────────────────────
self.addEventListener("push", e => {
  const data = e.data?.json() || {};
  const title = data.title || "🥷 Geography Ninja";
  const body  = data.body  || "Your daily challenge is waiting. Don't break your streak!";

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      tag: "streak-reminder",
      renotify: true,
      data: { url: "/" },
      actions: [
        { action: "play", title: "Play now →" },
        { action: "dismiss", title: "Later" },
      ],
    })
  );
});

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "dismiss") return;
  e.waitUntil(
    clients.matchAll({ type: "window" }).then(wins => {
      const open = wins.find(w => w.url.includes(self.location.origin));
      return open ? open.focus() : clients.openWindow("/");
    })
  );
});
