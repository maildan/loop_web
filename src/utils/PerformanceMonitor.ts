import React from 'react';

// Type definitions for Performance API entries to avoid using 'any'
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// 성능 측정 유틸리티
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 성능 측정 시작
  startMeasure(name: string): void {
    this.metrics.set(name, performance.now());
  }

  // 성능 측정 종료 및 결과 반환
  endMeasure(name: string): number {
    const startTime = this.metrics.get(name);
    if (!startTime) {
      console.warn(`No start time found for measure: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(name);
    
    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
    }

    return duration;
  }

  // Web Vitals 측정
  measureWebVitals(): void {
    if (typeof window === 'undefined') return;

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const firstInputEntry = entry as PerformanceEntry & { processingStart: DOMHighResTimeStamp };
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as LayoutShift).hadRecentInput) {
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // 메모리 사용량 측정
  measureMemoryUsage(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as Performance & { memory: { jsHeapSizeLimit: number; totalJSHeapSize: number; usedJSHeapSize: number; } }).memory;
  }
}

// React Hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.measureWebVitals();
    
    // 5초마다 메모리 사용량 체크
    const interval = setInterval(() => {
      monitor.measureMemoryUsage();
    }, 5000);

    return () => clearInterval(interval);
  }, [monitor]);

  return {
    startMeasure: monitor.startMeasure.bind(monitor),
    endMeasure: monitor.endMeasure.bind(monitor),
  };
}

export default PerformanceMonitor;
