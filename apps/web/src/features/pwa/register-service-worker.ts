/**
 * Registers `public/sw.js`, which exists solely to make the app installable.
 *
 * Production only. A service worker in `yarn dev` would sit between Vite and
 * the browser for no benefit — this one caches nothing, so it could only ever
 * confuse a hot reload. To try the install prompt locally, build and preview:
 *
 *   yarn build:web
 *   yarn workspace @monthly/web preview
 *
 * `vite preview` serves the production build, so `MODE` is "production" there
 * and this runs. localhost counts as a secure origin, so Chrome will offer the
 * install prompt exactly as it would on the live site.
 */
export const registerServiceWorker = () => {
  if (import.meta.env.MODE !== "production") return;
  if (!("serviceWorker" in navigator)) return;

  // After `load`, so registration never competes with the first render for
  // bandwidth. There is nothing to wait for — installability is not needed
  // until someone reaches the welcome page's install card.
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      // Not worth reporting or retrying: the only consequence is that Chrome
      // does not offer a one-tap install, and the manual instructions on the
      // welcome page still work.
      console.warn("Service worker registration failed", error);
    });
  });
};
