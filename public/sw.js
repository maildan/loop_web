/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */

/**
 * CloudFlare CDN 최적화를 위한 서비스 워커
 * 캐시 전략 및 성능 최적화
 */

const CACHE_NAME = 'loop-dashboard-v1';
const STATIC_CACHE_NAME = 'loop-static-v1';
const RUNTIME_CACHE_NAME = 'loop-runtime-v1';

// 캐시할 정적 파일들
const STATIC_ASSETS = [
  '/',
  '/static/js/',
  '/static/css/',
  '/static/media/',
  '/manifest.json'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME && 
                cacheName !== RUNTIME_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          }).filter(Boolean)
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch 이벤트 - CloudFlare와 협력하는 캐시 전략
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // CloudFlare CDN에서 이미 캐시된 파일은 Service Worker에서 처리하지 않음
  if (isCloudFlareCached(request)) {
    return;
  }
  
  // 정적 파일 처리
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }
  
  // API 요청 처리
  if (isApiRequest(request)) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE_NAME));
    return;
  }
  
  // HTML 문서 처리
  if (isHtmlRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE_NAME));
    return;
  }
});

// CloudFlare에서 캐시되는 파일인지 확인
function isCloudFlareCached(request) {
  const url = new URL(request.url);
  
  // CloudFlare가 자동으로 캐시하는 파일 확장자들
  const cfCachedExtensions = [
    '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', 
    '.svg', '.woff', '.woff2', '.ttf', '.eot', '.webp'
  ];
  
  return cfCachedExtensions.some(ext => url.pathname.endsWith(ext));
}

// 정적 파일 확인
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/static/') || 
         url.pathname.includes('/assets/');
}

// API 요청 확인
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// HTML 문서 확인
function isHtmlRequest(request) {
  return request.destination === 'document';
}

// CloudFlare Optimizer에 캐시 상태 알림
function notifyCloudFlareOptimizer(type, url) {
  try {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: type,
          url: url,
          timestamp: Date.now()
        });
      });
    });
  } catch (error) {
    console.warn('[SW] Failed to notify CloudFlare Optimizer:', error);
  }
}

// Cache First 전략
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Cache hit:', request.url);
    // CloudFlare Optimizer에 캐시 히트 전달
    notifyCloudFlareOptimizer('CACHE_HIT', request.url);
    return cachedResponse;
  }
  
  console.log('[SW] Cache miss, fetching:', request.url);
  // CloudFlare Optimizer에 캐시 미스 전달
  notifyCloudFlareOptimizer('CACHE_MISS', request.url);
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First 전략
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate 전략
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // 백그라운드에서 네트워크 요청
  const networkPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  
  // 캐시된 응답이 있으면 즉시 반환
  if (cachedResponse) {
    console.log('[SW] Serving from cache, updating in background:', request.url);
    return cachedResponse;
  }
  
  // 캐시된 응답이 없으면 네트워크 응답 대기
  console.log('[SW] No cache, waiting for network:', request.url);
  return networkPromise;
}

// CloudFlare 캐시 무효화 메시지 처리
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PURGE_CACHE') {
    console.log('[SW] Purging all caches...');
    
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
