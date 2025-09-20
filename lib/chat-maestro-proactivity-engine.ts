// Proactivity engine for Chat Maestro

import {
  UserDataSnapshot,
  ProactiveTrigger,
  ProactiveIntervention,
  ProactivitySettings,
  ProactivityAnalytics,
  ProactivityPriority
} from './chat-maestro-proactivity-types';

export class ChatMaestroProactivityEngine {
  private triggers: ProactiveTrigger[] = [];
  private settings: ProactivitySettings;
  private analytics: ProactivityAnalytics;

  constructor(settings?: ProactivitySettings) {
    this.settings = settings || this.getDefaultSettings();
    this.analytics = this.initializeAnalytics();
    this.initializeTriggers();
  }

  private getDefaultSettings(): ProactivitySettings {
    return {
      quietHours: {
        start: '22:00',
        end: '07:00'
      },
      maxDailyInterventions: 3,
      cooldownPeriods: {},
      userPreferences: {
        preferredCommunicationStyle: 'supportive',
        notificationPreferences: {
          proactiveMessages: true,
          reminders: true,
          educational: true
        }
      }
    };
  }

  private initializeAnalytics(): ProactivityAnalytics {
    return {
      interventionsTriggered: 0,
      userResponseRate: 0,
      interventionSuccessRate: 0,
      lastInterventionDate: new Date(),
      categoryBreakdown: {}
    };
  }

  private initializeTriggers(): void {
    // Health & Safety Concerns - Critical Priority
    this.triggers.push({
      id: 'poor_sleep_pattern',
      category: 'health_safety',
      priority: 'critical',
      condition: (data: UserDataSnapshot) => {
        // 3+ consecutive nights of <6 hours sleep
        if (data.sleepHours.length < 3) return false;
        return data.sleepHours.slice(-3).every(hours => hours < 6);
      },
      confidence: 90,
      cooldownPeriod: 24 // 24 hours
    });

    this.triggers.push({
      id: 'injury_risk',
      category: 'health_safety',
      priority: 'critical',
      condition: (data: UserDataSnapshot) => {
        // Consistent pain reports with high intensity training
        if (data.painReports.length < 2) return false;
        const recentPain = data.painReports.slice(-2).length > 0;
        const highTrainingLoad = data.workoutIntensity.slice(-3).some(intensity => intensity > 8);
        return recentPain && highTrainingLoad;
      },
      confidence: 85,
      cooldownPeriod: 48 // 48 hours
    });

    // Performance Optimization - High Priority
    this.triggers.push({
      id: 'performance_plateau',
      category: 'performance',
      priority: 'high',
      condition: (data: UserDataSnapshot) => {
        // No progress in key metrics for 2 weeks
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        // Check if we have enough data
        if (Object.keys(data.performanceMetrics).length === 0) return false;
        
        // Check each metric for plateau
        for (const metric in data.performanceMetrics) {
          const values = data.performanceMetrics[metric];
          if (values.length >= 4) {
            const recent = values.slice(-2);
            const older = values.slice(-4, -2);
            const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
            
            // If less than 2% improvement, consider plateau
            if (Math.abs(recentAvg - olderAvg) / olderAvg < 0.02) {
              return true;
            }
          }
        }
        return false;
      },
      confidence: 80,
      cooldownPeriod: 168 // 1 week
    });

    this.triggers.push({
      id: 'recovery_window',
      category: 'performance',
      priority: 'high',
      condition: (data: UserDataSnapshot) => {
        // Good sleep + good nutrition + reduced stress = recovery window
        const recentSleepQuality = data.sleepQuality.slice(-3);
        const avgSleepQuality = recentSleepQuality.reduce((a, b) => a + b, 0) / recentSleepQuality.length;
        
        const recentHydration = data.hydrationLevel.slice(-3);
        const avgHydration = recentHydration.reduce((a, b) => a + b, 0) / recentHydration.length;
        
        const recentStress = data.stressLevels.slice(-3);
        const avgStress = recentStress.reduce((a, b) => a + b, 0) / recentStress.length;
        
        return avgSleepQuality > 7 && avgHydration > 7 && avgStress < 4;
      },
      confidence: 75,
      cooldownPeriod: 72 // 3 days
    });

    // Motivation & Habit Reinforcement - Medium Priority
    this.triggers.push({
      id: 'motivation_dip',
      category: 'motivation',
      priority: 'medium',
      condition: (data: UserDataSnapshot) => {
        // Decreased engagement with app features
        if (data.appUsageFrequency.length < 7) return false;
        const recentUsage = data.appUsageFrequency.slice(-3);
        const olderUsage = data.appUsageFrequency.slice(-7, -3);
        const recentAvg = recentUsage.reduce((a, b) => a + b, 0) / recentUsage.length;
        const olderAvg = olderUsage.reduce((a, b) => a + b, 0) / olderUsage.length;
        
        return recentAvg < olderAvg * 0.5; // 50% drop
      },
      confidence: 70,
      cooldownPeriod: 48 // 48 hours
    });

    this.triggers.push({
      id: 'habit_streak',
      category: 'habits',
      priority: 'medium',
      condition: (data: UserDataSnapshot) => {
        // Maintaining consistent workout streak
        return data.workoutConsistency > 8 && data.appUsageFrequency.slice(-7).every(freq => freq > 0);
      },
      confidence: 85,
      cooldownPeriod: 168 // 1 week
    });

    // Educational Moments - Low Priority
    this.triggers.push({
      id: 'technique_opportunity',
      category: 'education',
      priority: 'low',
      condition: (data: UserDataSnapshot) => {
        // Good form quality with moderate intensity = technique refinement opportunity
        if (data.formQuality.length < 3) return false;
        const recentForm = data.formQuality.slice(-3);
        const avgForm = recentForm.reduce((a, b) => a + b, 0) / recentForm.length;
        const recentIntensity = data.workoutIntensity.slice(-3);
        const avgIntensity = recentIntensity.reduce((a, b) => a + b, 0) / recentIntensity.length;
        
        return avgForm > 7 && avgIntensity > 5 && avgIntensity < 8;
      },
      confidence: 65,
      cooldownPeriod: 168 // 1 week
    });

    this.triggers.push({
      id: 'habit_breakage',
      category: 'habits',
      priority: 'medium',
      condition: (data: UserDataSnapshot) => {
        // Breaking a previously consistent habit
        if (data.workoutConsistency > 7 && data.appUsageFrequency.slice(-3).every(freq => freq === 0)) {
          return true;
        }
        return false;
      },
      confidence: 80,
      cooldownPeriod: 24 // 24 hours
    });
  }

  private isWithinQuietHours(): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = this.settings.quietHours.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle overnight quiet hours
    if (startMinutes > endMinutes) {
      return currentTime >= startMinutes || currentTime <= endMinutes;
    }
    
    return currentTime >= startMinutes && currentTime <= endMinutes;
  }

  private isOnCooldown(trigger: ProactiveTrigger): boolean {
    if (!trigger.lastTriggered) return false;
    
    const now = new Date();
    const hoursSinceLastTrigger = (now.getTime() - trigger.lastTriggered.getTime()) / (1000 * 60 * 60);
    
    const cooldown = this.settings.cooldownPeriods[trigger.id] || trigger.cooldownPeriod;
    return hoursSinceLastTrigger < cooldown;
  }

  private sortTriggersByPriority(triggers: ProactiveTrigger[]): ProactiveTrigger[] {
    const priorityOrder: ProactivityPriority[] = ['critical', 'high', 'medium', 'low'];
    return [...triggers].sort((a, b) => {
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
  }

  public evaluateTriggers(data: UserDataSnapshot): ProactiveIntervention[] {
    // Check if we should be proactive right now
    if (this.isWithinQuietHours()) {
      return []; // Don't intervene during quiet hours
    }

    // Evaluate all triggers
    const triggered: ProactiveTrigger[] = [];
    
    for (const trigger of this.triggers) {
      if (!this.isOnCooldown(trigger) && trigger.condition(data)) {
        triggered.push(trigger);
      }
    }

    // Sort by priority
    const sortedTriggers = this.sortTriggersByPriority(triggered);
    
    // Generate interventions
    const interventions: ProactiveIntervention[] = [];
    for (const trigger of sortedTriggers) {
      const intervention = this.generateIntervention(trigger, data);
      if (intervention) {
        interventions.push(intervention);
        // Update trigger last triggered time
        trigger.lastTriggered = new Date();
      }
    }

    return interventions;
  }

  private generateIntervention(trigger: ProactiveTrigger, data: UserDataSnapshot): ProactiveIntervention | null {
    let message = '';
    let suggestedAction = '';
    
    switch (trigger.id) {
      case 'poor_sleep_pattern':
        message = "I noticed your sleep has been shorter lately. Let's adjust today's training to focus on technique and lighter loads to support recovery.";
        suggestedAction = "Consider reducing training volume by 30% and focusing on mobility work";
        break;
        
      case 'injury_risk':
        message = "I'm seeing some potential injury risk signals. It might be time to reduce intensity and focus on recovery.";
        suggestedAction = "Take a deload day or reduce training intensity by 40%";
        break;
        
      case 'performance_plateau':
        message = "I see you've plateaued on your recent performance metrics. How about we try a different progression strategy this week?";
        suggestedAction = "Consider changing exercise variations or adjusting training variables";
        break;
        
      case 'recovery_window':
        message = "Your recovery indicators look great! This is an excellent time to push a bit harder in your next sessions.";
        suggestedAction = "Consider increasing training volume or intensity by 10-15%";
        break;
        
      case 'motivation_dip':
        message = "I haven't heard from you in a few days. How are you feeling about your training? I have some fresh ideas we could try!";
        suggestedAction = "Try a new workout style or set a mini-goal for this week";
        break;
        
      case 'habit_streak':
        message = "Amazing work maintaining your consistency! Your dedication is really paying off.";
        suggestedAction = "Consider setting a new challenge to build on this momentum";
        break;
        
      case 'technique_opportunity':
        message = "Your form quality is excellent right now. This is a perfect time to focus on refining technique details.";
        suggestedAction = "Dedicate extra time to slow-motion practice or video analysis";
        break;
        
      case 'habit_breakage':
        message = "I noticed you've missed a few sessions. Life happens! How can we get back on track together?";
        suggestedAction = "Start with a shorter, easier session to rebuild momentum";
        break;
        
      default:
        message = "I have some insights that might help with your training.";
        break;
    }
    
    return {
      triggerId: trigger.id,
      priority: trigger.priority,
      confidence: trigger.confidence,
      message,
      suggestedAction,
      category: trigger.category
    };
  }

  public updateSettings(newSettings: Partial<ProactivitySettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getAnalytics(): ProactivityAnalytics {
    return { ...this.analytics };
  }
}