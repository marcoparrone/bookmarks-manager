importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// Cache site resources but update in the background.
workbox.routing.registerRoute(
  /.marcoparrone\.github\.io/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'mparrone',
  })
);

// Cache google resources but update in the background.
workbox.routing.registerRoute(
  /.*(?:googleapis)\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'googleapis',
  })
);
workbox.routing.registerRoute(
  /.*(?:gstatic)\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'gstatic',
  })
);
