const {assets} = global.serviceWorkerOption;
const CACHE_NAME = 'No homo';

const DEBUG = true;

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

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    const resource = caches
        .match(request)
        .then((response) => {
            if (response) {
                if (DEBUG) {
                    console.log(`${requestUrl.href} cache`);
                }

                return response;
            }

            return fetch(request)
                .then((res) => {
                    if (!res || !res.ok) {
                        return res;
                    }

                    if (DEBUG) {
                        console.log(`[SW] URL ${requestUrl.href} fetched`);
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
                    // User is landing on our page.
                    if (event.request.mode === 'navigate') {
                        return caches.match('./');
                    }
                    return null;
                });
        });

    event.respondWith(resource);
});
