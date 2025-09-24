"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = exports.trackEvent = exports.trackPageView = exports.initGA = exports.GA_TRACKING_ID = void 0;
// Analytics configuration
exports.GA_TRACKING_ID = typeof process !== 'undefined' && ((_a = process.env) === null || _a === void 0 ? void 0 : _a.VITE_GA_TRACKING_ID) || 'G-XXXXXXXXXX';
// Initialize Google Analytics
var initGA = function () {
    if (typeof window === 'undefined' || !exports.GA_TRACKING_ID || exports.GA_TRACKING_ID === 'G-XXXXXXXXXX') {
        return;
    }
    // Load gtag script
    var script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=".concat(exports.GA_TRACKING_ID);
    document.head.appendChild(script);
    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', exports.GA_TRACKING_ID, {
        page_title: 'SPARTAN 4 - AI Fitness Coach',
        page_location: window.location.href,
        app_name: 'SPARTAN 4',
        app_version: '1.0.0',
    });
};
exports.initGA = initGA;
// Track page views
var trackPageView = function (page_path, page_title) {
    if (typeof window === 'undefined' || !window.gtag)
        return;
    window.gtag('config', exports.GA_TRACKING_ID, {
        page_path: page_path,
        page_title: page_title || document.title,
    });
};
exports.trackPageView = trackPageView;
// Track custom events
var trackEvent = function (action, category, label, value) {
    if (typeof window === 'undefined' || !window.gtag)
        return;
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};
exports.trackEvent = trackEvent;
// Predefined tracking functions for SPARTAN 4
exports.analytics = {
    // Page tracking
    trackPageView: function (page_path, page_title) {
        return (0, exports.trackPageView)(page_path, page_title);
    },
    // Event tracking
    trackEvent: function (action, category, label, value) {
        return (0, exports.trackEvent)(action, category, label, value);
    },
    // User actions
    trackLogin: function () { return (0, exports.trackEvent)('login', 'user'); },
    trackSignup: function () { return (0, exports.trackEvent)('sign_up', 'user'); },
    trackLogout: function () { return (0, exports.trackEvent)('logout', 'user'); },
    // Workout tracking
    trackWorkoutGenerated: function (type) {
        return (0, exports.trackEvent)('workout_generated', 'workout', type);
    },
    trackWorkoutStarted: function (workoutId) {
        return (0, exports.trackEvent)('workout_started', 'workout', workoutId);
    },
    trackWorkoutCompleted: function (workoutId) {
        return (0, exports.trackEvent)('workout_completed', 'workout', workoutId);
    },
    // AI Features
    trackAIRecipeGenerated: function () {
        return (0, exports.trackEvent)('recipe_generated', 'ai_features');
    },
    trackBloodAnalysis: function () {
        return (0, exports.trackEvent)('blood_analysis', 'ai_features');
    },
    trackFormChecker: function (exercise) {
        return (0, exports.trackEvent)('form_checker', 'ai_features', exercise);
    },
    // PWA tracking
    trackPWAInstall: function () {
        return (0, exports.trackEvent)('pwa_install', 'engagement');
    },
    trackOfflineUsage: function () {
        return (0, exports.trackEvent)('offline_usage', 'engagement');
    },
    // Performance tracking
    trackPerformance: function (metric, value) {
        return (0, exports.trackEvent)('performance', 'technical', metric, value);
    },
    // Error tracking
    trackError: function (error, category) {
        if (category === void 0) { category = 'javascript'; }
        return (0, exports.trackEvent)('exception', category, error);
    },
};
exports.default = exports.analytics;
