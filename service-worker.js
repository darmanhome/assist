// Service Worker ساده برای «توان‌گر، دستیار درمانگر»
// هدف اصلی: برآورده کردن شرط نصب‌پذیری PWA در کروم/اندروید (Add to Home Screen / Install app).
// این نسخه عمداً ساده است و در کارکرد آنلاین اپ (تماس با Supabase و ...) دخالتی نمی‌کند.

const CACHE_NAME = "tavaangar-shell-v1";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// فقط درخواست‌های ناوبری (باز کردن خود صفحه) را پوشش می‌دهیم؛
// درخواست‌های API (مثل Supabase) دست‌نخورده و همیشه از شبکه می‌روند.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
  }
});
