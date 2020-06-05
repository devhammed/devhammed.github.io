/* globals caches, self, fetch, Response, Headers */

'use strict'

console.log('WORKER: executing.')

var version = 'v1::'
var offlineFundamentals = [
  '',
  'index.js',
  'index.css',
  'assets/me.jpg',
  'assets/cv.pdf',
  'assets/favicon.ico'
]

/* The install event fires when the service worker is first installed.
   You can use this event to prepare the service worker to be able to serve
   files while visitors are offline.
*/
self.addEventListener('install', function (event) {
  console.log('WORKER: install event in progress.')

  event.waitUntil(
    caches
      .open(version + 'fundamentals')
      .then(function (cache) {
        return cache.addAll(offlineFundamentals)
      })
      .then(function () {
        console.log('WORKER: install completed')
      })
  )
})

self.addEventListener('fetch', function (event) {
  console.log('WORKER: fetch event in progress.')

  if (event.request.method !== 'GET') {
    console.log(
      'WORKER: fetch event ignored.',
      event.request.method,
      event.request.url
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var networked = fetch(event.request)
        .then(fetchedFromNetwork, unableToResolve)
        .catch(unableToResolve)
      console.log(
        'WORKER: fetch event',
        cached ? '(cached)' : '(network)',
        event.request.url
      )
      return cached || networked

      function fetchedFromNetwork (response) {
        var cacheCopy = response.clone()

        console.log('WORKER: fetch response from network.', event.request.url)

        caches
          .open(version + 'pages')
          .then(function add (cache) {
            return cache.put(event.request, cacheCopy)
          })
          .then(function () {
            console.log(
              'WORKER: fetch response stored in cache.',
              event.request.url
            )
          })

        return response
      }

      function unableToResolve () {
        console.log('WORKER: fetch request failed in both cache and network.')

        return new Response('<h1>Service Unavailable</h1>', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/html'
          })
        })
      }
    })
  )
})

self.addEventListener('activate', function (event) {
  console.log('WORKER: activate event in progress.')

  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return !key.startsWith(version)
            })
            .map(function (key) {
              return caches.delete(key)
            })
        )
      })
      .then(function () {
        console.log('WORKER: activate completed.')
      })
  )
})
