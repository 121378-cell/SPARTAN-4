// Monitoreo de límites de planes gratuitos para SPARTAN 4
export interface FreeTierLimits {
  vercel: {
    bandwidth: number; // 100GB/month
    functions: number; // 100GB-Hrs/month
    deployments: number; // Unlimited
  };
  supabase: {
    storage: number; // 500MB
    requests: number; // 50,000/month
    users: number; // 50,000 MAU
  };
  gemini: {
    requests: number; // 1,500/day
    dailyLimit: number;
    monthlyLimit: number;
  };
  analytics: {
    pageViews: number; // 2,500/month (Vercel Analytics)
    events: number; // Unlimited (GA4)
  };
}

export const FREE_TIER_LIMITS: FreeTierLimits = {
  vercel: {
    bandwidth: 100 * 1024 * 1024 * 1024, // 100GB
    functions: 100 * 1024 * 1024 * 1024, // 100GB-Hrs
    deployments: Infinity,
  },
  supabase: {
    storage: 500 * 1024 * 1024, // 500MB
    requests: 50000,
    users: 50000,
  },
  gemini: {
    requests: 1500, // per day
    dailyLimit: 1500,
    monthlyLimit: 45000, // 1500 * 30
  },
  analytics: {
    pageViews: 2500, // Vercel Analytics limit
    events: Infinity, // GA4 unlimited
  },
};

export class FreeTierMonitor {
  private static instance: FreeTierMonitor;
  private usage: Record<string, number> = {};
  private alertThresholds = {
    warning: 0.8,   // 80%
    critical: 0.9,  // 90%
    danger: 0.95,   // 95%
  };

  static getInstance(): FreeTierMonitor {
    if (!FreeTierMonitor.instance) {
      FreeTierMonitor.instance = new FreeTierMonitor();
    }
    return FreeTierMonitor.instance;
  }

  private constructor() {
    this.loadUsageFromStorage();
    this.setupPeriodicChecks();
  }

  // Track resource usage
  trackUsage(service: string, resource: string, amount: number = 1) {
    const key = `${service}_${resource}`;
    this.usage[key] = (this.usage[key] || 0) + amount;
    
    // Save to localStorage
    this.saveUsageToStorage();
    
    // Check limits
    this.checkLimits(service, resource);
  }

  // Check if we're approaching limits
  checkLimits(service: string, resource: string) {
    const key = `${service}_${resource}`;
    const currentUsage = this.usage[key] || 0;
    const limit = this.getLimit(service, resource);
    
    if (limit === Infinity) return;
    
    const percentage = currentUsage / limit;
    
    if (percentage >= this.alertThresholds.danger) {
      this.sendAlert('danger', service, resource, percentage);
      this.enableEmergencyMode(service, resource);
    } else if (percentage >= this.alertThresholds.critical) {
      this.sendAlert('critical', service, resource, percentage);
      this.enableConservationMode(service, resource);
    } else if (percentage >= this.alertThresholds.warning) {
      this.sendAlert('warning', service, resource, percentage);
    }
  }

  private getLimit(service: string, resource: string): number {
    const limits = FREE_TIER_LIMITS as any;
    return limits[service]?.[resource] || Infinity;
  }

  private sendAlert(level: string, service: string, resource: string, percentage: number) {
    const message = `🚨 ${level.toUpperCase()}: ${service} ${resource} at ${(percentage * 100).toFixed(1)}% of free tier limit`;
    
    // Log to console
    console.warn(message);
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'free_tier_alert', {
        event_category: 'resource_usage',
        event_label: `${service}_${resource}`,
        value: Math.round(percentage * 100),
        custom_parameter_level: level,
      });
    }
    
    // Could also send to external monitoring service
    this.notifyDevelopers(level, service, resource, percentage);
  }

  private enableConservationMode(service: string, resource: string) {
    // Implement conservation strategies
    switch (service) {
      case 'gemini':
        this.enableAIRateLimiting();
        break;
      case 'vercel':
        this.enableBandwidthOptimization();
        break;
      case 'supabase':
        this.enableDataOptimization();
        break;
    }
  }

  private enableEmergencyMode(service: string, resource: string) {
    // More aggressive conservation
    switch (service) {
      case 'gemini':
        this.pauseAIFeatures();
        break;
      case 'vercel':
        this.enableMaxCompression();
        break;
      case 'supabase':
        this.enableReadOnlyMode();
        break;
    }
  }

  // Conservation strategies
  private enableAIRateLimiting() {
    // Reduce AI requests per user
    localStorage.setItem('ai_rate_limit', 'true');
    localStorage.setItem('ai_max_requests_per_day', '2'); // Reduce from 3 to 2
  }

  private pauseAIFeatures() {
    // Temporarily disable AI features
    localStorage.setItem('ai_features_disabled', 'true');
  }

  private enableBandwidthOptimization() {
    // Enable maximum compression
    localStorage.setItem('max_compression', 'true');
  }

  private enableMaxCompression() {
    // Further optimize assets
    localStorage.setItem('emergency_compression', 'true');
  }

  private enableDataOptimization() {
    // Optimize database queries
    localStorage.setItem('db_optimization', 'true');
  }

  private enableReadOnlyMode() {
    // Disable non-essential writes
    localStorage.setItem('read_only_mode', 'true');
  }

  private notifyDevelopers(level: string, service: string, resource: string, percentage: number) {
    // In a real app, this would send notifications to developers
    // Could integrate with Discord webhook, Slack, email, etc.
    const notification = {
      timestamp: new Date().toISOString(),
      level,
      service,
      resource,
      percentage: percentage * 100,
      message: `Free tier limit approaching for ${service} ${resource}`,
    };
    
    // Store notifications for dashboard
    const notifications = JSON.parse(localStorage.getItem('tier_notifications') || '[]');
    notifications.push(notification);
    localStorage.setItem('tier_notifications', JSON.stringify(notifications.slice(-50))); // Keep last 50
  }

  // Get current usage status
  getUsageStatus() {
    const status: Record<string, any> = {};
    
    Object.keys(FREE_TIER_LIMITS).forEach(service => {
      status[service] = {};
      Object.keys(FREE_TIER_LIMITS[service as keyof FreeTierLimits]).forEach(resource => {
        const key = `${service}_${resource}`;
        const currentUsage = this.usage[key] || 0;
        const limit = this.getLimit(service, resource);
        const percentage = limit === Infinity ? 0 : (currentUsage / limit) * 100;
        
        status[service][resource] = {
          current: currentUsage,
          limit,
          percentage: Math.round(percentage * 100) / 100,
          remaining: limit === Infinity ? Infinity : limit - currentUsage,
        };
      });
    });
    
    return status;
  }

  // Reset monthly counters
  resetMonthlyCounters() {
    const monthlyCounters = [
      'vercel_bandwidth',
      'vercel_functions',
      'supabase_requests',
      'gemini_monthlyLimit',
      'analytics_pageViews',
    ];
    
    monthlyCounters.forEach(counter => {
      this.usage[counter] = 0;
    });
    
    this.saveUsageToStorage();
  }

  // Reset daily counters
  resetDailyCounters() {
    const dailyCounters = [
      'gemini_requests',
    ];
    
    dailyCounters.forEach(counter => {
      this.usage[counter] = 0;
    });
    
    this.saveUsageToStorage();
  }

  private setupPeriodicChecks() {
    // Check every hour
    setInterval(() => {
      this.performHealthCheck();
    }, 60 * 60 * 1000);
    
    // Reset daily counters at midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      this.resetDailyCounters();
      // Set up daily reset
      setInterval(() => {
        this.resetDailyCounters();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  private performHealthCheck() {
    // Check all services
    Object.keys(FREE_TIER_LIMITS).forEach(service => {
      Object.keys(FREE_TIER_LIMITS[service as keyof FreeTierLimits]).forEach(resource => {
        this.checkLimits(service, resource);
      });
    });
  }

  private loadUsageFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('free_tier_usage');
      if (stored) {
        this.usage = JSON.parse(stored);
      }
    }
  }

  private saveUsageToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('free_tier_usage', JSON.stringify(this.usage));
    }
  }

  // API for components to check status
  canUseAI(): boolean {
    const aiDisabled = localStorage.getItem('ai_features_disabled') === 'true';
    const dailyUsage = this.usage['gemini_requests'] || 0;
    const dailyLimit = parseInt(localStorage.getItem('ai_max_requests_per_day') || '3');
    
    return !aiDisabled && dailyUsage < dailyLimit;
  }

  getRemainingAIRequests(): number {
    const dailyUsage = this.usage['gemini_requests'] || 0;
    const dailyLimit = parseInt(localStorage.getItem('ai_max_requests_per_day') || '3');
    
    return Math.max(0, dailyLimit - dailyUsage);
  }

  // Dashboard data
  getDashboardData() {
    return {
      usage: this.getUsageStatus(),
      notifications: JSON.parse(localStorage.getItem('tier_notifications') || '[]'),
      conservationMode: {
        aiRateLimit: localStorage.getItem('ai_rate_limit') === 'true',
        aiDisabled: localStorage.getItem('ai_features_disabled') === 'true',
        maxCompression: localStorage.getItem('max_compression') === 'true',
        readOnlyMode: localStorage.getItem('read_only_mode') === 'true',
      },
    };
  }
}

// Export singleton instance
export const freeTierMonitor = FreeTierMonitor.getInstance();

// Helper functions for easy usage tracking
export const trackGeminiRequest = () => freeTierMonitor.trackUsage('gemini', 'requests');
export const trackVercelBandwidth = (bytes: number) => freeTierMonitor.trackUsage('vercel', 'bandwidth', bytes);
export const trackSupabaseRequest = () => freeTierMonitor.trackUsage('supabase', 'requests');
export const trackPageView = () => freeTierMonitor.trackUsage('analytics', 'pageViews');

export default freeTierMonitor;