/**
 * LocalMarket Progressive Web App (PWA) Service Worker
 * Version: 1.0.0
 * Architecture: Stale-While-Revalidate / Cache-First for static assets,
 * Network-First for HTML navigation & API with offline fallback.
 */

const CACHE_VERSION = 'localmarket-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Core App Shell Assets
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/css/styles.css',
    '/js/dashboard.js',
    '/js/pwa.js',
    '/styles.css',
    '/dashboard.js',
    '/manifest.json',
    '/offline.html',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/icon-maskable-192.png',
    '/icons/icon-maskable-512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon.png',
    '/icons/icon.svg'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando versión:', CACHE_VERSION);
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[Service Worker] Precargando App Shell en caché estática');
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[Service Worker] Advertencia en precaché:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate Event: Clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activando nueva versión...');
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
                        console.log('[Service Worker] Eliminando caché obsoleta:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event Strategy
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Ignorar esquemas no soportados (ej. chrome-extension://, ws://)
    if (!request.url.startsWith('http')) return;

    // 1. Solicitudes de Navegación (HTML Pages): Network-First -> Cache -> Offline Fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    console.log('[Service Worker] Modo Offline detectado en navegación:', request.url);
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;

                    // Fallback a dashboard.html si existe o a offline.html
                    const fallbackHtml = await caches.match('/offline.html');
                    return fallbackHtml || new Response('LocalMarket está en modo offline.');
                })
        );
        return;
    }

    // 2. Solicitudes a la API (/api/)
    if (url.pathname.startsWith('/api/')) {
        // Solo aplicar fallback en peticiones GET
        if (request.method === 'GET') {
            event.respondWith(
                fetch(request)
                    .then((apiResponse) => {
                        if (apiResponse && apiResponse.status === 200) {
                            const resClone = apiResponse.clone();
                            caches.open(RUNTIME_CACHE).then((cache) => {
                                cache.put(request, resClone);
                            });
                        }
                        return apiResponse;
                    })
                    .catch(async () => {
                        const cachedApi = await caches.match(request);
                        if (cachedApi) return cachedApi;
                        return new Response(JSON.stringify({
                            success: false,
                            offline: true,
                            message: 'Operación fuera de línea (sin conexión).'
                        }), {
                            headers: { 'Content-Type': 'application/json' }
                        });
                    })
            );
        } else {
            // Peticiones de mutación (POST, PUT, DELETE) van directo a la red
            return;
        }
        return;
    }

    // 3. Recursos Estáticos y CDN (CSS, JS, Fonts, Imágenes): Cache-First con Network Fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                // Actualización en segundo plano (Stale-While-Revalidate)
                fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, networkResponse);
                        });
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            return fetch(request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    // Caches de terceros (CDNs como Tailwind, FontAwesome, Google Fonts)
                    if (networkResponse && (url.origin.includes('cdnjs') || url.origin.includes('fonts.googleapis') || url.origin.includes('cdn.tailwindcss') || url.origin.includes('unsplash'))) {
                        const clone = networkResponse.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
                    }
                    return networkResponse;
                }
                const responseClone = networkResponse.clone();
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });
                return networkResponse;
            }).catch(() => {
                // Si falla una imagen, retornar fallback si aplica
                if (request.destination === 'image') {
                    return caches.match('/icons/icon-192.png');
                }
            });
        })
    );
});

// Manejo de mensajes desde los clientes (e.g. forzar actualización)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
