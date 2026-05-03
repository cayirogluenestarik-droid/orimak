// ── ORİMAK TAKİP — SERVICE WORKER v1.0 ──
// Tarayıcı kapalıyken bile push bildirimleri alır

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

// ── PUSH BİLDİRİMİ GELDİĞİNDE ──
self.addEventListener('push', function(e) {
  if (!e.data) return;

  let payload;
  try {
    payload = e.data.json();
  } catch (_) {
    payload = { title: 'Orimak Takip', body: e.data.text() };
  }

  const title   = payload.title || 'Orimak Takip';
  const options = {
    body:    payload.body  || '',
    icon:    payload.icon  || '/favicon.ico',
    badge:   payload.badge || '/favicon.ico',
    tag:     payload.tag   || 'orimak-notif',
    data:    payload.data  || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
    actions: payload.actions || []
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// ── BİLDİRİME TIKLANDIĞINDA ──
self.addEventListener('notificationclick', function(e) {
  e.notification.close();

  const url = (e.notification.data && e.notification.data.url) || '/';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
      // Zaten açık bir sekme var mı?
      for (var i = 0; i < clients.length; i++) {
        var c = clients[i];
        if (c.url.includes(self.location.origin)) {
          return c.focus();
        }
      }
      // Yoksa yeni sekme aç
      return self.clients.openWindow(url);
    })
  );
});
