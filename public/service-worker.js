importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded`);
} else {
  console.log(`Boo! Workbox didn't load`);
}

// Cache text files but update in the background.
workbox.routing.registerRoute(
    /\.(?:css|html|json)$/, 
    new workbox.strategies.StaleWhileRevalidate({
	cacheName: 'text-cache',
    })
);

// Cache image files - maximum 20 images for a maximum age of 30 days.
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/, 
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ],
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
