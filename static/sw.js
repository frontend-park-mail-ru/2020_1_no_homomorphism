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

    // if (request.method !== 'GET') { // TODO добавить отлженную отправку форм
    //     return;
    // }

    const resource = caches
        .match(request)
        .then((response) => {
            if (response) {
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
