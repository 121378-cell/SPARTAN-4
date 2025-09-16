// Advanced monitoring and error tracking for SPARTAN 4
import { analytics, trackEvent } from './analytics';

// Error boundary integration
export class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errorQueue: Array<{
    error: Error;
    errorInfo: any;
    timestamp: number;
    userId?: string;
  }> = [];

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      });
    });

    // Service Worker errors
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('error', (event) => {
        this.logError(new Error('Service Worker Error'), {
          type: 'service_worker_error',
          event,
        });
      });
    }
  }

  logError(error: Error, errorInfo: any, userId?: string) {
    const errorData = {
      error,
      errorInfo,
      timestamp: Date.now(),
      userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error.stack,
    };

    // Add to queue
    this.errorQueue.push(errorData);

    // Track in analytics
    analytics.trackError(error.message, 'application');

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // Send to monitoring service (when configured)
    this.sendToMonitoringService(errorData);
  }

  private async sendToMonitoringService(errorData: any) {
    try {
      // This would integrate with services like Sentry, LogRocket, etc.
      // For now, we'll store locally and could send to your backend
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      });

      if (response.ok) {
        // Remove from queue if successfully sent
        this.errorQueue = this.errorQueue.filter(
          (item) => item.timestamp !== errorData.timestamp
        );
      }
    } catch (err) {
      // Silently fail - don't create error loops
      console.warn('Failed to send error to monitoring service:', err);
    }
  }

  getErrorQueue() {
    return this.errorQueue;
  }

  clearErrorQueue() {
    this.errorQueue = [];
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private constructor() {
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('navigation_timing', entry.duration);
          analytics.trackPerformance('navigation_duration', entry.duration);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          if (resource.name.includes('chunk') || resource.name.includes('bundle')) {
            this.recordMetric('bundle_load_time', resource.duration);
            analytics.trackPerformance('bundle_load_duration', resource.duration);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor Core Web Vitals
      const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const metric = entry as any;
          switch (metric.entryType) {
            case 'largest-contentful-paint':
              this.recordMetric('LCP', metric.startTime);
              analytics.trackPerformance('lcp', metric.startTime);
              break;
            case 'first-input':
              this.recordMetric('FID', metric.processingStart - metric.startTime);
              analytics.trackPerformance('fid', metric.processingStart - metric.startTime);
              break;
            case 'layout-shift':
              if (!metric.hadRecentInput) {
                this.recordMetric('CLS', metric.value);
                analytics.trackPerformance('cls', metric.value);
              }
              break;
          }
        }
      });
      vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    
    // Log slow operations
    if (value > 3000) { // More than 3 seconds
      analytics.trackError(`Slow operation: ${name} took ${value}ms`, 'performance');
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }
}

// Usage monitoring
export class UsageMonitor {
  private static instance: UsageMonitor;
  private sessionStart: number;
  private interactions: number = 0;

  static getInstance(): UsageMonitor {
    if (!UsageMonitor.instance) {
      UsageMonitor.instance = new UsageMonitor();
    }
    return UsageMonitor.instance;
  }

  private constructor() {
    this.sessionStart = Date.now();
    this.setupInteractionTracking();
  }

  private setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', () => {
      this.interactions++;
    });

    // Track session duration
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.sessionStart;
      analytics.trackPerformance('session_duration', sessionDuration);
      analytics.trackEvent('session_end', 'engagement', 'duration', sessionDuration);
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        analytics.trackEvent('page_hidden', 'engagement');
      } else {
        analytics.trackEvent('page_visible', 'engagement');
      }
    });
  }

  trackFeatureUsage(feature: string) {
    analytics.trackEvent('feature_used', 'engagement', feature);
  }

  getSessionInfo() {
    return {
      duration: Date.now() - this.sessionStart,
      interactions: this.interactions,
      startTime: this.sessionStart,
    };
  }
}

// Initialize monitoring
export const errorMonitor = ErrorMonitor.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
export const usageMonitor = UsageMonitor.getInstance();

// Export for easy integration
export default {
  errorMonitor,
  performanceMonitor,
  usageMonitor,
};