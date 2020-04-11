const {assets} = global.serviceWorkerOption;
const CACHE_NAME = 'No homo';


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(assets);
            })
            .catch((error) => {
                console.error(error);
                throw error;
            }),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName.indexOf(CACHE_NAME) === 0) {
                            return null;
                        }
                        return caches.delete(cacheName);
                    }),
                );
            }),
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') { // TODO добавить отлженную отправку форм
        return;
    }

    const resource = caches
        .match(request)
        .then((response) => {
            if (!navigator.onLine && response) {
                return response;
            }
            return fetch(request)
                .then((res) => {
                    if (!res || !res.ok) {
                        return res;
                    }
                    const responseCache = res.clone();
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => {
                            return cache.put(request, responseCache);
                        });
                    return res;
                })
                .catch(() => {
                    return null;
                });
        });

    event.respondWith(resource);
});


// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then((cache) => cache.addAll(assets)),
//     );
// });
//
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches
//             .match(event.request)
//             .then((cachedResponse) => {
//                 if (!navigator.onLine && cachedResponse) {
//                     return cachedResponse;
//                 }
//
//                 return fetch(event.request)
//                     .then((response) => caches
//                         .open(CACHE_NAME)
//                         .then((cache) => {
//                             if (event.request.method === 'GET') {
//                                 cache.put(event.request, response.clone());
//                             }
//                             return response;
//                         }));
//             }),
//     );
// });
