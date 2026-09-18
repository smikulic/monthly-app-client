/**
 * Monthly's service worker, and it does exactly one thing: make the app
 * installable.
 *
 * Chrome will not offer "Install app", and will not fire the
 * `beforeinstallprompt` event the welcome page listens for, unless a service
 * worker with a fetch handler is controlling the page. That is the entire
 * reason this file exists.
 *
 * ## It caches nothing, on purpose
 *
 * The handler below responds to nothing, so every request — pages, scripts,
 * the GraphQL API, Sentry, Mixpanel — reaches the network exactly as it did
 * before this file was added. Nothing it serves can go stale, because it does
 * not serve anything.
 *
 * That is a deliberate choice over the usual offline-caching worker. Two
 * reasons:
 *
 * - A caching worker is sticky in a way ordinary bugs are not. Get it wrong
 *   and it keeps serving an old build long after the deploy that fixed it,
 *   to people who have no idea why and no obvious way out.
 * - Every figure in this product lives on the server. An offline shell would
 *   render the navigation, the month picker and no money at all, which is
 *   less honest than the browser's own offline page.
 *
 * If offline support or faster repeat loads are ever wanted, that is a
 * considered change to make on its own merits — not a side effect of wanting
 * an install button.
 *
 * ## If this ever needs removing
 *
 * Replace the body of this file with `self.registration.unregister()` and
 * deploy. Every client removes itself on its next visit.
 */

self.addEventListener("install", () => {
  // Nothing to precache. Activating immediately is safe precisely because
  // this worker owns no cache and answers no request, so there is no previous
  // build to strand and no stale response to inherit.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Housekeeping for anyone who ran an earlier, caching version of this
      // file. Without it their old caches would sit there indefinitely, since
      // nothing else would ever clean them up.
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("monthly-"))
          .map((name) => caches.delete(name)),
      );

      await self.clients.claim();
    })(),
  );
});

/**
 * Required for installability, and intentionally empty.
 *
 * Calling `event.respondWith()` is what would put this worker in the request
 * path. It is never called, so the browser handles every request itself.
 */
self.addEventListener("fetch", () => {});
