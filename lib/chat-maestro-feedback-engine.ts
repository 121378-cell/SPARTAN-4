// Feedback engine for Chat Maestro

import {
  WorkoutData,
  ProgressData,
  UserData,
  FeedbackContext,
  FeedbackRule,
  FeedbackItem,
  FeedbackSettings
} from './chat-maestro-feedback-types';

export class ChatMaestroFeedbackEngine {
  private rules: FeedbackRule[] = [];
  private settings: FeedbackSettings;

  constructor(settings?: FeedbackSettings) {
    this.settings = settings || this.getDefaultSettings();
    this.initializeRules();
  }

  private getDefaultSettings(): FeedbackSettings {
    return {
      enableTechnicalFeedback: true,
      enableProgressFeedback: true,
      enableMotivationalFeedback: true,
      maxFeedbackPerDay: 5,
      preferredTiming: 'post_session',
      tonePreferences: {
        technical: 'balanced',
        motivational: 'enthusiastic',
        progress: 'celebratory'
      }
    };
  }

  private initializeRules(): void {
    // Technical Feedback Rules
    this.rules.push({
      id: 'poor_form_detection',
      category: 'technical',
      condition: (context: FeedbackContext) => {
        // Check if recent workouts have form notes indicating issues
        return context.recentWorkouts.some(workout => 
          workout.formNotes && workout.formNotes.some(note => 
            note.toLowerCase().includes('poor') || 
            note.toLowerCase().includes('incorrect') || 
            note.toLowerCase().includes('fix')
          )
        );
      },
      priority: 'high',
      generateMessage: (context: FeedbackContext) => {
        const workoutWithIssues = context.recentWorkouts.find(workout => 
          workout.formNotes && workout.formNotes.some(note => 
            note.toLowerCase().includes('poor') || 
            note.toLowerCase().includes('incorrect') || 
            note.toLowerCase().includes('fix')
          )
        );
        
        if (workoutWithIssues) {
          const formNote = workoutWithIssues.formNotes?.find(note => 
            note.toLowerCase().includes('poor') || 
            note.toLowerCase().includes('incorrect') || 
            note.toLowerCase().includes('fix')
          );
          
          return `I noticed some form issues in your ${workoutWithIssues.exercise} session: "${formNote}". Let's focus on correcting this to prevent injury and maximize effectiveness.`;
        }
        
        return "I've identified a technical aspect of your training that could use some attention.";
      },
      generateAction: (context: FeedbackContext) => {
        return "Review the exercise tutorial and focus on the movement pattern during your next session.";
      }
    });

    this.rules.push({
      id: 'inconsistent_rpe',
      category: 'technical',
      condition: (context: FeedbackContext) => {
        // Check for inconsistent RPE reporting
        const recentWorkouts = context.recentWorkouts.filter(w => w.rpe && w.rpe.length > 0);
        if (recentWorkouts.length < 3) return false;
        
        const rpeVariations = recentWorkouts.flatMap(w => w.rpe || []);
        if (rpeVariations.length < 5) return false;
        
        const avgRpe = rpeVariations.reduce((a, b) => a + b, 0) / rpeVariations.length;
        const variance = rpeVariations.map(rpe => Math.pow(rpe - avgRpe, 2))
          .reduce((a, b) => a + b, 0) / rpeVariations.length;
        
        // High variance indicates inconsistency
        return variance > 2.0;
      },
      priority: 'medium',
      generateMessage: (context: FeedbackContext) => {
        return "I've noticed some inconsistency in your RPE reporting. More accurate self-assessment will help optimize your programming.";
      },
      generateAction: (context: FeedbackContext) => {
        return "Practice the RPE scale before your next workout - remember that RPE 7 should feel like you could do 2-3 more reps.";
      }
    });

    // Progress Feedback Rules
    this.rules.push({
      id: 'significant_improvement',
      category: 'progress',
      condition: (context: FeedbackContext) => {
        // Check for 10%+ improvement in any metric over the last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return context.progressData.some(metric => {
          if (metric.values.length < 2) return false;
          
          const recentValue = metric.values[metric.values.length - 1];
          const olderValues = metric.values.filter((_, index) => 
            metric.dates[index] < oneMonthAgo
          );
          
          if (olderValues.length === 0) return false;
          
          const avgOlderValue = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
          const improvement = ((recentValue - avgOlderValue) / avgOlderValue) * 100;
          
          return improvement >= 10;
        });
      },
      priority: 'high',
      generateMessage: (context: FeedbackContext) => {
        const improvedMetric = context.progressData.find(metric => {
          if (metric.values.length < 2) return false;
          
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          
          const recentValue = metric.values[metric.values.length - 1];
          const olderValues = metric.values.filter((_, index) => 
            metric.dates[index] < oneMonthAgo
          );
          
          if (olderValues.length === 0) return false;
          
          const avgOlderValue = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
          const improvement = ((recentValue - avgOlderValue) / avgOlderValue) * 100;
          
          return improvement >= 10;
        });
        
        if (improvedMetric) {
          const recentValue = improvedMetric.values[improvedMetric.values.length - 1];
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          
          const olderValues = improvedMetric.values.filter((_, index) => 
            improvedMetric.dates[index] < oneMonthAgo
          );
          
          const avgOlderValue = olderValues.reduce((a, b) => a + b, 0) / olderValues.length;
          const improvement = ((recentValue - avgOlderValue) / avgOlderValue) * 100;
          
          return `Outstanding progress! Your ${improvedMetric.metric} has improved by ${improvement.toFixed(1)}% over the past month. That dedication is really paying off!`;
        }
        
        return "You've made some excellent progress recently - keep up the great work!";
      },
      generateAction: (context: FeedbackContext) => {
        return "Consider setting a new goal to build on this momentum.";
      }
    });

    this.rules.push({
      id: 'consistency_streak',
      category: 'progress',
      condition: (context: FeedbackContext) => {
        // Check for 7+ consecutive days of workout adherence
        if (context.recentWorkouts.length < 7) return false;
        
        // Simple check - if we have 7+ recent workouts, assume consistency
        // In a real implementation, we'd check actual dates
        return true;
      },
      priority: 'high',
      generateMessage: (context: FeedbackContext) => {
        return "Amazing consistency! Seven consecutive days of training shows incredible dedication. You're building unstoppable habits!";
      },
      generateAction: (context: FeedbackContext) => {
        return "Keep this momentum going - consistency is the foundation of all progress.";
      }
    });

    // Motivational Feedback Rules
    this.rules.push({
      id: 'low_motivation',
      category: 'motivational',
      condition: (context: FeedbackContext) => {
        // Check if user's motivation is low
        return context.userData.psychologicalState.motivation < 4;
      },
      priority: 'high',
      generateMessage: (context: FeedbackContext) => {
        const goals = context.userData.goals.join(', ');
        return `I sense you might be feeling a bit low on motivation right now. Remember, you started this journey to achieve ${goals}. Every single session gets you closer to who you want to become.`;
      },
      generateAction: (context: FeedbackContext) => {
        return "Try a shorter, easier workout today - sometimes momentum is more important than intensity.";
      }
    });

    this.rules.push({
      id: 'high_stress',
      category: 'motivational',
      condition: (context: FeedbackContext) => {
        // Check if user's stress is high
        return context.userData.psychologicalState.stress > 7;
      },
      priority: 'medium',
      generateMessage: (context: FeedbackContext) => {
        return "I notice you're dealing with high stress levels. Remember that training is as much about mental resilience as physical strength. Use your workouts as a healthy outlet.";
      },
      generateAction: (context: FeedbackContext) => {
        return "Consider focusing on mindfulness during your warm-up today - take deep breaths and set an intention for your session.";
      }
    });

    this.rules.push({
      id: 'confidence_boost',
      category: 'motivational',
      condition: (context: FeedbackContext) => {
        // Check if user's confidence is improving
        const recentFeedback = context.recentFeedbackHistory.slice(-5);
        const positiveFeedbackCount = recentFeedback.filter(f => 
          f.category === 'progress' || f.category === 'motivational'
        ).length;
        
        return positiveFeedbackCount >= 3;
      },
      priority: 'medium',
      generateMessage: (context: FeedbackContext) => {
        return "Your confidence is growing, and it shows in your training! That mental strength will carry over into every aspect of your life.";
      },
      generateAction: (context: FeedbackContext) => {
        return "Channel this confidence into tackling a new challenge this week.";
      }
    });
  }

  public generateFeedback(context: FeedbackContext): FeedbackItem[] {
    const feedbackItems: FeedbackItem[] = [];
    
    // Filter rules based on settings
    const activeRules = this.rules.filter(rule => {
      if (rule.category === 'technical' && !this.settings.enableTechnicalFeedback) return false;
      if (rule.category === 'progress' && !this.settings.enableProgressFeedback) return false;
      if (rule.category === 'motivational' && !this.settings.enableMotivationalFeedback) return false;
      return true;
    });
    
    // Evaluate all active rules
    for (const rule of activeRules) {
      if (rule.condition(context)) {
        const feedbackItem: FeedbackItem = {
          id: `${rule.id}_${Date.now()}`,
          category: rule.category,
          message: rule.generateMessage(context),
          action: rule.generateAction ? rule.generateAction(context) : undefined,
          priority: rule.priority,
          timestamp: new Date(),
          dataReferences: [] // In a real implementation, we'd reference specific data points
        };
        
        feedbackItems.push(feedbackItem);
      }
    }
    
    // Sort by priority
    return this.sortFeedbackByPriority(feedbackItems);
  }

  private sortFeedbackByPriority(feedback: FeedbackItem[]): FeedbackItem[] {
    const priorityOrder = ['high', 'medium', 'low'];
    return [...feedback].sort((a, b) => {
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
  }

  public updateSettings(newSettings: Partial<FeedbackSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): FeedbackSettings {
    return { ...this.settings };
  }
}