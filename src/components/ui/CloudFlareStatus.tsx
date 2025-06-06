import React, { useState, useEffect } from 'react';
import CloudFlareOptimizer, { PerformanceMetrics, CacheStats } from '../../utils/cloudflareOptimizer';

interface CloudFlareStatusProps {
  className?: string;
}

export function CloudFlareStatus({ className = '' }: CloudFlareStatusProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cfOptimizer = new CloudFlareOptimizer({
      cdnEnabled: process.env.REACT_APP_CDN_ENABLED === 'true',
      debug: process.env.NODE_ENV === 'development'
    });

    // 성능 메트릭 수집
    const updateMetrics = () => {
      const performanceMetrics = cfOptimizer.getPerformanceMetrics();
      const report = cfOptimizer.generateReport();
      
      setMetrics(performanceMetrics);
      setCacheStats(report.cache);
    };

    // 초기 메트릭 수집
    setTimeout(updateMetrics, 2000);

    // 주기적 업데이트 (30초마다)
    const interval = setInterval(updateMetrics, 30000);

    return () => {
      clearInterval(interval);
      cfOptimizer.destroy();
    };
  }, []);

  // 개발 모드에서만 표시
  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-xs"
        title="CloudFlare 상태 보기"
      >
        CF
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 text-xs max-w-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">CloudFlare Status</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {metrics && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Load Time:</span>
            <span className="font-mono text-green-600 dark:text-green-400">
              {metrics.loadTime.toFixed(0)}ms
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Requests:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">
              {metrics.requests}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Bandwidth:</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">
              {(metrics.bandwidth / 1024).toFixed(1)}KB/s
            </span>
          </div>
        </div>
      )}

      {cacheStats && cacheStats.total > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Cache Hit Rate:</span>
            <span className="font-mono text-green-600 dark:text-green-400">
              {cacheStats.hitRate.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 dark:text-gray-300 text-xs">CDN Active</span>
        </div>
      </div>
    </div>
  );
}
