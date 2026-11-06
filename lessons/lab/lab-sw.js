/* Playground helper: makes the JavaScript file arrive as slowly as it would over a phone
   network. It only touches lab-heavy.js; everything else loads normally. The playground
   page tells it how long the download should take. Localhost downloads are instant, so
   without this the "defer" page would look the same as the "script in the head" page. */
let delay = 0;
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('message', e => {
  delay = Number(e.data?.delay) || 0;
  e.ports[0]?.postMessage('ready'); // "I'm awake", so no shop has to wait for the helper to start
});
self.addEventListener('fetch', e => {
  if (!delay || !e.request.url.includes('lab-heavy.js')) return;
  const wait = delay;
  e.respondWith(new Promise(r => setTimeout(r, wait)).then(() => fetch(e.request)));
});
