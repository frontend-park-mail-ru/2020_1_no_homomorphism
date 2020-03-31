const KEY = 'sw';
const assets = [
    // '/static/img/avatar/default.png',
    // '/views/templates/base.njk',
    // '/views/templates/profileLink.njk',
    // '/views/templates/track.njk',
    // '/views/profile/profile.njk',
    // '/views/profile/profile_albums.njk',
    // '/views/profile/profile_artists.njk',
    // '/views/profile/profile_playlists.njk',
    '/',
    '/views/templates/base.njk',
    '/views/index.njk',
    // '../../',
    // '/login',
    // './profile/tracks',
    // './profile/playlists',
    // './profile/albums',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(KEY)
            .then((cache) => cache.addAll(assets)
                .then(() => console.log('Assets added to cache'))));
});

// self.addEventListener('fetch', (event) => {
//     console.log('FETCHED');
//     console.log(event);
//     event.respondWith(
//         caches
//             .match(event.request)
//             .then((cachedResponse) => {
//                 console.log(navigator.onLine);
//                 console.log(cachedResponse);
//                 if (!navigator.onLine && cachedResponse) {
//                     return cachedResponse;
//                 }
//                 return fetch(event.request)
//                     .then((response) => caches
//                         .open(KEY)
//                         .then((cache) => {
//                             if (event.request.method === 'GET') {
//                                 cache.put(event.request, response.clone());
//                             }
//                             return response;
//                         })
//                         .catch((err) => {
//                             console.error(err);
//                         }))
//                     .catch((err) => {
//                         console.error(err); // !!!
//                     });
//             }));
// });

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse && !navigator.onLine) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Check if we received a valid response
                if (
                    !response ||
                    response.status !== 200
                ) {
                    return response;
                }

                if (event.request.method !== 'GET') {
                    return response;
                }

                // const url = new URL(event.request.url);
                // if (/.jpg|.jpeg|.png$/.test(url.pathname)) {
                const responseToCache = response.clone();
                caches.open(KEY).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                // }

                return response;
            });
        }),
    );
});
