"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceMonitor = exports.PerformanceMonitor = void 0;
exports.withPerformanceTracking = withPerformanceTracking;
// Performance monitoring utilities
var react_1 = require("react");
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor(reportCallback) {
        this.reportCallback = reportCallback;
        this.metrics = {};
        this.navigationMetrics = null;
        this.observers = [];
        this.initializeObservers();
        this.measureNavigation();
    }
    PerformanceMonitor.prototype.initializeObservers = function () {
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
    };
    PerformanceMonitor.prototype.observePaintMetrics = function () {
        var _this = this;
        try {
            var observer = new PerformanceObserver(function (list) {
                for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    if (entry.name === 'first-contentful-paint') {
                        _this.metrics.fcp = entry.startTime;
                        _this.reportMetrics();
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
            this.observers.push(observer);
        }
        catch (error) {
            console.warn('Paint metrics not supported:', error);
        }
    };
    PerformanceMonitor.prototype.observeLCP = function () {
        var _this = this;
        try {
            var observer = new PerformanceObserver(function (list) {
                var entries = list.getEntries();
                var lastEntry = entries[entries.length - 1];
                _this.metrics.lcp = lastEntry.startTime;
                _this.reportMetrics();
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.push(observer);
        }
        catch (error) {
            console.warn('LCP metrics not supported:', error);
        }
    };
    PerformanceMonitor.prototype.observeFID = function () {
        var _this = this;
        try {
            var observer = new PerformanceObserver(function (list) {
                for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    _this.metrics.fid = entry.processingStart - entry.startTime;
                    _this.reportMetrics();
                }
            });
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.push(observer);
        }
        catch (error) {
            console.warn('FID metrics not supported:', error);
        }
    };
    PerformanceMonitor.prototype.observeCLS = function () {
        var _this = this;
        try {
            var clsValue_1 = 0;
            var observer = new PerformanceObserver(function (list) {
                for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    if (!entry.hadRecentInput) {
                        clsValue_1 += entry.value;
                        _this.metrics.cls = clsValue_1;
                        _this.reportMetrics();
                    }
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.push(observer);
        }
        catch (error) {
            console.warn('CLS metrics not supported:', error);
        }
    };
    PerformanceMonitor.prototype.measureNavigation = function () {
        var _this = this;
        if ('performance' in window && 'timing' in performance) {
            window.addEventListener('load', function () {
                setTimeout(function () {
                    var timing = performance.timing;
                    _this.navigationMetrics = {
                        loadTime: timing.loadEventEnd - timing.navigationStart,
                        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                        domComplete: timing.domComplete - timing.navigationStart,
                        networkLatency: timing.responseEnd - timing.fetchStart,
                    };
                    _this.metrics.ttfb = timing.responseStart - timing.navigationStart;
                    _this.reportMetrics();
                }, 0);
            });
        }
    };
    PerformanceMonitor.prototype.reportMetrics = function () {
        if (this.reportCallback) {
            this.reportCallback(__assign({}, this.metrics));
        }
    };
    PerformanceMonitor.prototype.getMetrics = function () {
        return __assign({}, this.metrics);
    };
    PerformanceMonitor.prototype.getNavigationMetrics = function () {
        return this.navigationMetrics;
    };
    PerformanceMonitor.prototype.startResourceTiming = function () {
        if ('performance' in window) {
            performance.mark('resource-start');
        }
    };
    PerformanceMonitor.prototype.endResourceTiming = function (label) {
        if ('performance' in window) {
            performance.mark('resource-end');
            performance.measure(label, 'resource-start', 'resource-end');
        }
    };
    PerformanceMonitor.prototype.measureUserTiming = function (name, fn) {
        var start = performance.now();
        var result = fn();
        if (result instanceof Promise) {
            return result.then(function () {
                var end = performance.now();
                console.log("".concat(name, " took ").concat(end - start, " milliseconds"));
            });
        }
        else {
            var end = performance.now();
            console.log("".concat(name, " took ").concat(end - start, " milliseconds"));
        }
    };
    PerformanceMonitor.prototype.dispose = function () {
        this.observers.forEach(function (observer) { return observer.disconnect(); });
        this.observers = [];
    };
    return PerformanceMonitor;
}());
exports.PerformanceMonitor = PerformanceMonitor;
// Export singleton instance
exports.performanceMonitor = new PerformanceMonitor(function (metrics) {
    // In production, send these metrics to your analytics service
    if (process.env.NODE_ENV === 'development') {
        console.log('Performance Metrics:', metrics);
    }
    // Example: Send to analytics service
    // analytics.track('performance', metrics);
});
// Utility functions for measuring React components
function withPerformanceTracking(WrappedComponent, componentName) {
    var name = componentName || WrappedComponent.displayName || WrappedComponent.name;
    return react_1.default.memo(function (props) {
        react_1.default.useEffect(function () {
            var startTime = performance.now();
            return function () {
                var endTime = performance.now();
                console.log("".concat(name, " render time: ").concat(endTime - startTime, "ms"));
            };
        });
        return react_1.default.createElement(WrappedComponent, props);
    });
}
exports.default = PerformanceMonitor;
