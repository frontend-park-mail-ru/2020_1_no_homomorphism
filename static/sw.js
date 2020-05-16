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
            .open(CACHE_NAME)
            .then((cache) => {
                cache
                    .keys()
                    .then((elem) => {
                        return Promise.all(
                            elem.filter((cachedElem) => {
                                return !cachedElem.url.includes('/static');
                            }).map((cachedNotStatic) => {
                                return cache.delete(cachedNotStatic);
                            }),
                        );
                    });
            }),
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
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
                    if (!res.url.includes('/static')) {
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
