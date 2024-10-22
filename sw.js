'use strict';

console.log('WORKER: executing.');

const version = 'v6.0.0';

const offlineFundamentals = [
    '',
    'blog',
    'assets/css/style.css',
    'assets/images/me.jpg',
    'assets/docs/resume.pdf',
    'favicon.ico',
];

self.addEventListener('install', function (event) {
  console.log('WORKER: install event in progress.');

  event.waitUntil(
    caches
      .open(version + 'fundamentals')
      .then(function (cache) {
        return cache.addAll(offlineFundamentals);
      })
      .then(function () {
        console.log('WORKER: install completed');
      })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('WORKER: fetch event in progress.');

  if (
      event.request.method !== 'GET'
      || event.request.url.includes('lovemeetstech2024')
      || event.request.url.includes('googleapis.com')
  ) {
    console.log(
      'WORKER: fetch event ignored.',
      event.request.method,
      event.request.url,
    );

    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      console.log(
        'WORKER: fetch event',
        cached ? '(cached)' : '(network)',
        event.request.url
      );

      var networked = fetch(event.request)
        .then(function (response) {
          var cacheCopy = response.clone();

          console.log(
            'WORKER: fetch response from network.',
            event.request.url
          );

          if (event.request.url.indexOf('chrome-extension') === 0) {
            return response;
          }

          caches
            .open(version + 'pages')
            .then(function (cache) {
              return cache.put(event.request, cacheCopy);
            })
            .then(function () {
              console.log(
                'WORKER: fetch response stored in cache.',
                event.request.url
              );
            });

          return response;
        })
        .catch(function () {
          console.log(
            'WORKER: fetch request failed in both cache and network.'
          );

          return new Response('<h1>Service Unavailable</h1>', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html',
            }),
          });
        });

      return cached || networked;
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version);
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        console.log('WORKER: activate completed.');
      })
  );
});
