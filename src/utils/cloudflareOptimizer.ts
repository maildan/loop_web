/**
 * CloudFlare CDN 최적화 클래스
 * React 앱과 CloudFlare CDN의 통합을 관리
 */

interface CloudFlareConfig {
  cdnEnabled: boolean;
  staticUrl?: string;
  apiUrl?: string;
  zoneId?: string;
  debug?: boolean;
}

interface PerformanceMetrics {
  loadTime: number;
  cacheHitRate: number;
  bandwidth: number;
  requests: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  total: number;
  hitRate: number;
}

class CloudFlareOptimizer {
  private config: CloudFlareConfig;
  private performanceObserver: PerformanceObserver | null = null;
  private cacheStats: CacheStats = {
    hits: 0,
    misses: 0,
    total: 0,
    hitRate: 0
  };

  constructor(config: CloudFlareConfig) {
    this.config = {
      debug: false,
      ...config
    };
    
    this.log('CloudFlare Optimizer initialized', this.config);
    this.initializeOptimizations();
  }

  /**
   * 최적화 기능들을 초기화
   */
  private initializeOptimizations(): void {
    this.setupResourceHints();
    this.setupPerformanceMonitoring();
    this.setupCacheMonitoring();
  }

  /**
   * 리소스 힌트 설정 (preconnect, prefetch 등)
   */
  private setupResourceHints(): void {
    const head = document.head;
    
    // CloudFlare 도메인들에 대한 preconnect
    const cfDomains = [
      'https://cdnjs.cloudflare.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    cfDomains.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        head.appendChild(link);
      }
    });

    // 정적 자원에 대한 dns-prefetch
    if (this.config.staticUrl) {
      const dnsPrefetch = document.createElement('link');
      dnsPrefetch.rel = 'dns-prefetch';
      dnsPrefetch.href = this.config.staticUrl;
      head.appendChild(dnsPrefetch);
    }
  }

  /**
   * 성능 모니터링 설정
   */
  private setupPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.handlePerformanceEntry(entry);
        });
      });

      // 다양한 성능 메트릭을 모니터링
      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
      } catch (error) {
        this.log('Performance observer setup failed:', error);
      }
    }
  }

  /**
   * 캐시 모니터링 설정
   */
  private setupCacheMonitoring(): void {
    // Service Worker 메시지 리스너
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_HIT') {
          this.cacheStats.hits++;
          this.cacheStats.total++;
          this.updateCacheHitRate();
          this.log('Cache hit:', event.data.url);
        } else if (event.data && event.data.type === 'CACHE_MISS') {
          this.cacheStats.misses++;
          this.cacheStats.total++;
          this.updateCacheHitRate();
          this.log('Cache miss:', event.data.url);
        }
      });
    }
  }

  /**
   * 이미지 최적화
   */
  private optimizeImages(): void {
    // 지연 로딩 지원 확인
    if ('loading' in HTMLImageElement.prototype) {
      this.log('Native lazy loading supported');
    }

    // WebP 지원 확인
    this.checkWebPSupport().then(supported => {
      if (supported) {
        this.log('WebP format supported');
        document.documentElement.classList.add('webp-supported');
      }
    });
  }

  /**
   * WebP 지원 여부 확인
   */
  private checkWebPSupport(): Promise<boolean> {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = () => resolve(webP.height === 2);
      webP.onerror = () => resolve(false);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * 성능 엔트리 처리
   */
  private handlePerformanceEntry(entry: PerformanceEntry): void {
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      this.log('Navigation timing:', {
        domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
        loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
        firstByte: navEntry.responseStart - navEntry.requestStart
      });
    }

    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      
      // CloudFlare 헤더 확인
      if (this.isCloudFlareResource(resourceEntry.name)) {
        this.log('CloudFlare resource loaded:', {
          name: resourceEntry.name,
          duration: resourceEntry.duration,
          transferSize: resourceEntry.transferSize || 0
        });
      }
    }
  }

  /**
   * CloudFlare를 통해 제공되는 리소스인지 확인
   */
  private isCloudFlareResource(url: string): boolean {
    return url.includes('cloudflare') || 
           url.includes('cdnjs') ||
           (this.config.staticUrl ? url.includes(this.config.staticUrl) : false);
  }

  /**
   * 캐시 히트율 업데이트
   */
  private updateCacheHitRate(): void {
    if (this.cacheStats.total > 0) {
      this.cacheStats.hitRate = (this.cacheStats.hits / this.cacheStats.total) * 100;
      this.log('Cache hit rate:', `${this.cacheStats.hitRate.toFixed(2)}%`);
    }
  }

  /**
   * CloudFlare 캐시 퍼지
   */
  public async purgeCache(): Promise<boolean> {
    try {
      // Service Worker에 캐시 퍼지 메시지 전송
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const messageChannel = new MessageChannel();
        
        return new Promise((resolve) => {
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data.success);
          };
          
          navigator.serviceWorker.controller?.postMessage(
            { type: 'PURGE_CACHE' },
            [messageChannel.port2]
          );
        });
      }
      
      return false;
    } catch (error) {
      this.log('Cache purge failed:', error);
      return false;
    }
  }

  /**
   * 성능 메트릭 가져오기
   */
  public getPerformanceMetrics(): PerformanceMetrics | null {
    if (!('performance' in window)) {
      return null;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) {
      return null;
    }

    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      cacheHitRate: this.cacheStats.hitRate,
      bandwidth: this.calculateBandwidth(),
      requests: performance.getEntriesByType('resource').length
    };
  }

  /**
   * 대역폭 계산
   */
  private calculateBandwidth(): number {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalSize = resources.reduce((sum, resource) => {
      return sum + (resource.transferSize || 0);
    }, 0);
    
    const totalTime = resources.reduce((sum, resource) => {
      return sum + resource.duration;
    }, 0);

    return totalTime > 0 ? (totalSize / totalTime) * 1000 : 0; // bytes per second
  }

  /**
   * 디버그 로그
   */
  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(`[CloudFlare] ${message}`, data || '');
    }
  }

  /**
   * 최적화 상태 보고서 생성
   */
  public generateReport(): {
    config: CloudFlareConfig;
    performance: PerformanceMetrics | null;
    cache: CacheStats;
    features: {
      serviceWorker: boolean;
      webp: boolean;
      lazyLoading: boolean;
    };
  } {
    return {
      config: this.config,
      performance: this.getPerformanceMetrics(),
      cache: this.cacheStats,
      features: {
        serviceWorker: 'serviceWorker' in navigator,
        webp: document.documentElement.classList.contains('webp-supported'),
        lazyLoading: 'loading' in HTMLImageElement.prototype
      }
    };
  }

  /**
   * 리소스 정리
   */
  public destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

export default CloudFlareOptimizer;
export type { CloudFlareConfig, PerformanceMetrics, CacheStats };
