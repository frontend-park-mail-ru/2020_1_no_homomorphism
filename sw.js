const KEY = 'sw';
const assets = [ // TODO Подумать
    '/',
    '/views/templates/base.njk',
    '/views/index.njk',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(KEY)
            .then((cache) => cache.addAll(assets)
                .then(() => console.log('Assets added to cache'))));
});

self.addEventListener('fetch', (event) => {
    console.log('FETCHED');
    console.log(event);
    event.respondWith(
        caches
            .match(event.request)
            .then((cachedResponse) => {
                console.log(navigator.onLine);
                console.log(cachedResponse);
                if (!navigator.onLine && cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then((response) => {
                        if (response.status !== 200) {
                            return response;
                        }

                        if (event.request.method !== 'GET') {
                            return response;
                        }

                        caches
                            .open(KEY)
                            .then((cache) => {
                                if (event.request.method === 'GET') {
                                    cache.put(event.request, response.clone());
                                }
                                return response;
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        console.error(err); // !!!
                    });
            }));
});
