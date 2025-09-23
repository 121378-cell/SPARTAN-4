// Performance monitoring utilities
import React from 'react';

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export interface NavigationMetrics {
  loadTime: number;
  domContentLoaded: number;
  domComplete: number;
  networkLatency: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private navigationMetrics: NavigationMetrics | null = null;
  private observers: PerformanceObserver[] = [];

  constructor(private reportCallback?: (metrics: PerformanceMetrics) => void) {
    this.initializeObservers();
    this.measureNavigation();
  }

  private initializeObservers() {
    // Web Vitals support
    if ('PerformanceObserver' in window) {
      // First Contentful Paint (FCP)
      this.observePaintMetrics();
      
      // Largest Contentful Paint (LCP)
      this.observeLCP();
      
      // First Input Delay (FID)
      this.observeFID();
      
      // Cumulative Layout Shift (CLS)
      this.observeCLS();
    }
  }

  private observePaintMetrics() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetrics();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Paint metrics not supported:', error);
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetrics();
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP metrics not supported:', error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
          this.reportMetrics();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID metrics not supported:', error);
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics.cls = clsValue;
            this.reportMetrics();
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS metrics not supported:', error);
    }
  }

  private measureNavigation() {
    if ('performance' in window && 'timing' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing;
          this.navigationMetrics = {
            loadTime: timing.loadEventEnd - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            domComplete: timing.domComplete - timing.navigationStart,
            networkLatency: timing.responseEnd - timing.fetchStart,
          };
          
          this.metrics.ttfb = timing.responseStart - timing.navigationStart;
          this.reportMetrics();
        }, 0);
      });
    }
  }

  private reportMetrics() {
    if (this.reportCallback) {
      this.reportCallback({ ...this.metrics });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getNavigationMetrics(): NavigationMetrics | null {
    return this.navigationMetrics;
  }

  public startResourceTiming() {
    if ('performance' in window) {
      performance.mark('resource-start');
    }
  }

  public endResourceTiming(label: string) {
    if ('performance' in window) {
      performance.mark('resource-end');
      performance.measure(label, 'resource-start', 'resource-end');
    }
  }

  public measureUserTiming(name: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.then(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
    }
  }

  public dispose() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor((metrics) => {
  // In production, send these metrics to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Metrics:', metrics);
  }
  
  // Example: Send to analytics service
  // analytics.track('performance', metrics);
});

// Utility functions for measuring React components
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  return React.memo((props: P) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`${name} render time: ${endTime - startTime}ms`);
      };
    });
    
    return React.createElement(WrappedComponent, props);
  });
}

export default PerformanceMonitor;