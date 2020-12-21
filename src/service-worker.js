// These JavaScript module imports need to be bundled:
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {StaleWhileRevalidate} from 'workbox-strategies';

// Use the imported Workbox libraries to implement caching,
// routing, and other logic:
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /.*marcoparrone\.github\.io/,
  new StaleWhileRevalidate({
    cacheName: 'marcoparronegh',
  })
);

registerRoute(
  /.*(?:googleapis)\.com/,
  new StaleWhileRevalidate({
    cacheName: 'googleapis',
  })
);

registerRoute(
  /.*(?:gstatic)\.com/,
  new StaleWhileRevalidate({
    cacheName: 'gstatic',
  })
);
