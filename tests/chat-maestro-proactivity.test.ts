import { ChatMaestroProactivityEngine } from '../lib/chat-maestro-proactivity-engine';
import { UserDataSnapshot } from '../lib/chat-maestro-proactivity-types';

describe('ChatMaestroProactivityEngine', () => {
  let engine: ChatMaestroProactivityEngine;

  beforeEach(() => {
    engine = new ChatMaestroProactivityEngine();
  });

  describe('Poor Sleep Pattern Detection', () => {
    it('should detect poor sleep patterns', () => {
      const data: UserDataSnapshot = {
        sleepHours: [5, 4.5, 5.5, 4, 4.5],
        sleepQuality: [3, 4, 3, 2, 3],
        bedtimeConsistency: 4,
        workoutConsistency: 7,
        workoutIntensity: [7, 8, 7, 8, 7],
        formQuality: [6, 7, 6, 7, 6],
        painReports: [],
        nutritionAdherence: 6,
        hydrationLevel: [6, 7, 6, 7, 6],
        appUsageFrequency: [1, 1, 1, 1, 1],
        responseRateToCoaching: 7,
        manualCheckIns: 2,
        performanceMetrics: {
          'bench_press': [100, 102, 101, 100, 101]
        },
        energyLevels: [4, 3, 4, 3, 4],
        motivationLevels: [5, 4, 5, 4, 5],
        stressLevels: [7, 8, 7, 8, 7],
        timestamp: new Date()
      };

      const interventions = engine.evaluateTriggers(data);
      const sleepIntervention = interventions.find(i => i.triggerId === 'poor_sleep_pattern');
      
      expect(sleepIntervention).toBeDefined();
      expect(sleepIntervention?.priority).toBe('critical');
    });

    it('should not trigger for adequate sleep', () => {
      const data: UserDataSnapshot = {
        sleepHours: [7, 7.5, 8, 7.5, 8],
        sleepQuality: [8, 9, 8, 9, 8],
        bedtimeConsistency: 8,
        workoutConsistency: 8,
        workoutIntensity: [7, 8, 7, 8, 7],
        formQuality: [8, 9, 8, 9, 8],
        painReports: [],
        nutritionAdherence: 8,
        hydrationLevel: [8, 9, 8, 9, 8],
        appUsageFrequency: [1, 1, 1, 1, 1],
        responseRateToCoaching: 8,
        manualCheckIns: 3,
        performanceMetrics: {
          'bench_press': [100, 102, 105, 107, 110]
        },
        energyLevels: [7, 8, 7, 8, 7],
        motivationLevels: [7, 8, 7, 8, 7],
        stressLevels: [3, 2, 3, 2, 3],
        timestamp: new Date()
      };

      const interventions = engine.evaluateTriggers(data);
      const sleepIntervention = interventions.find(i => i.triggerId === 'poor_sleep_pattern');
      
      expect(sleepIntervention).toBeUndefined();
    });
  });

  describe('Performance Plateau Detection', () => {
    it('should detect performance plateaus', () => {
      const data: UserDataSnapshot = {
        sleepHours: [7, 7.5, 8, 7.5, 7],
        sleepQuality: [7, 8, 7, 8, 7],
        bedtimeConsistency: 7,
        workoutConsistency: 8,
        workoutIntensity: [7, 8, 7, 8, 7],
        formQuality: [7, 8, 7, 8, 7],
        painReports: [],
        nutritionAdherence: 7,
        hydrationLevel: [7, 8, 7, 8, 7],
        appUsageFrequency: [1, 1, 1, 1, 1],
        responseRateToCoaching: 7,
        manualCheckIns: 2,
        performanceMetrics: {
          'bench_press': [100, 100, 100, 100, 100]
        },
        energyLevels: [7, 7, 7, 7, 7],
        motivationLevels: [7, 7, 7, 7, 7],
        stressLevels: [5, 5, 5, 5, 5],
        timestamp: new Date()
      };

      const interventions = engine.evaluateTriggers(data);
      const plateauIntervention = interventions.find(i => i.triggerId === 'performance_plateau');
      
      expect(plateauIntervention).toBeDefined();
      expect(plateauIntervention?.priority).toBe('high');
    });
  });

  describe('Quiet Hours', () => {
    it('should respect quiet hours', () => {
      // Create engine with quiet hours set to current time
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      
      const engineWithQuietHours = new ChatMaestroProactivityEngine({
        quietHours: {
          start: timeString,
          end: timeString
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
      });

      const data: UserDataSnapshot = {
        sleepHours: [5, 4.5, 5.5],
        sleepQuality: [3, 4, 3],
        bedtimeConsistency: 4,
        workoutConsistency: 7,
        workoutIntensity: [7, 8, 7],
        formQuality: [6, 7, 6],
        painReports: [],
        nutritionAdherence: 6,
        hydrationLevel: [6, 7, 6],
        appUsageFrequency: [1, 1, 1],
        responseRateToCoaching: 7,
        manualCheckIns: 2,
        performanceMetrics: {},
        energyLevels: [4, 3, 4],
        motivationLevels: [5, 4, 5],
        stressLevels: [7, 8, 7],
        timestamp: new Date()
      };

      const interventions = engineWithQuietHours.evaluateTriggers(data);
      expect(interventions.length).toBe(0);
    });
  });
});