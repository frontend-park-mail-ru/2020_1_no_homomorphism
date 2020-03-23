const KEY = 'sw';
const assets = [
    '/static/img/avatar/default.png',
    '/',
    // './profile/tracks',
    // './profile/playlists',
    // './profile/albums',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(KEY)
            .then((cache) => cache.addAll(assets)
                .then(() => console.log('Assets added to cache'))));
    // .catch((err) => console.log('Error while fetching assets', err))));
    // .then(() => self.skipWaiting()));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((cachedResponse) => {
                if (!navigator.onLine && cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then((response) => caches
                        .open(KEY)
                        .then((cache) => {
                            if (event.request.method === 'GET') {
                                cache.put(event.request, response.clone());
                            }
                            return response;
                        })
                        .catch((err) => {
                            console.error(err);
                        }))
                    .catch((err) => {
                        console.error(err);
                    });
            }));
});
