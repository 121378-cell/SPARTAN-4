// Google Analytics 4 integration for SPARTAN 4
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | Record<string, any>,
      config?: Record<string, any>
    ) => void;
    dataLayer: Record<string, any>[];
  }
}

// Analytics configuration
export const GA_TRACKING_ID = (import.meta as any).env?.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: 'SPARTAN 4 - AI Fitness Coach',
    page_location: window.location.href,
    app_name: 'SPARTAN 4',
    app_version: '1.0.0',
  });
};

// Track page views
export const trackPageView = (page_path: string, page_title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path,
    page_title: page_title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined tracking functions for SPARTAN 4
export const analytics = {
  // User actions
  trackLogin: () => trackEvent('login', 'user'),
  trackSignup: () => trackEvent('sign_up', 'user'),
  trackLogout: () => trackEvent('logout', 'user'),

  // Workout tracking
  trackWorkoutGenerated: (type: string) => 
    trackEvent('workout_generated', 'workout', type),
  trackWorkoutStarted: (workoutId: string) => 
    trackEvent('workout_started', 'workout', workoutId),
  trackWorkoutCompleted: (workoutId: string) => 
    trackEvent('workout_completed', 'workout', workoutId),

  // AI Features
  trackAIRecipeGenerated: () => 
    trackEvent('recipe_generated', 'ai_features'),
  trackBloodAnalysis: () => 
    trackEvent('blood_analysis', 'ai_features'),
  trackFormChecker: (exercise: string) => 
    trackEvent('form_checker', 'ai_features', exercise),

  // PWA tracking
  trackPWAInstall: () => 
    trackEvent('pwa_install', 'engagement'),
  trackOfflineUsage: () => 
    trackEvent('offline_usage', 'engagement'),

  // Performance tracking
  trackPerformance: (metric: string, value: number) => 
    trackEvent('performance', 'technical', metric, value),

  // Error tracking
  trackError: (error: string, category: string = 'javascript') => 
    trackEvent('exception', category, error),
};

export default analytics;