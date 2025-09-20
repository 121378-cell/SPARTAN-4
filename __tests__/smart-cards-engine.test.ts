import { AdvancedSmartCardsEngine } from '../modals/smart-cards-engine';
import { 
  SmartCardConfiguration, 
  Exercise, 
  ExerciseSet, 
  TimerSettings, 
  UserPreferences, 
  UserContext 
} from '../modals/smart-cards-types';

describe('AdvancedSmartCardsEngine', () => {
  let engine: AdvancedSmartCardsEngine;
  let userPreferences: UserPreferences;
  let userContext: UserContext;

  beforeEach(() => {
    userPreferences = {
      equipmentAvailable: ['barbell', 'dumbbells', 'bench'],
      preferredGripTypes: ['pronated', 'supinated'],
      injuryPrecautions: [],
      motivationTriggers: ['progress', 'competition'],
      feedbackPreferences: {
        formCorrection: 'direct',
        motivation: 'competitive',
        safety: 'balanced'
      }
    };

    userContext = {
      currentEnergyLevel: 8,
      stressLevel: 3,
      sleepQuality: 7,
      nutritionStatus: 'good',
      timeAvailable: 60,
      environment: 'gym'
    };

    engine = new AdvancedSmartCardsEngine(userPreferences, userContext);
  });

  describe('generateSmartCard', () => {
    it('should generate a smart card for a valid exercise', () => {
      const sets: ExerciseSet[] = [
        {
          setId: 'set_1',
          setNumber: 1,
          targetReps: 8,
          targetLoad: 60,
          targetRPE: 7,
          restPeriod: 90
        }
      ];

      const configuration: SmartCardConfiguration = {
        userId: 'user_123',
        sessionId: 'session_456',
        exerciseId: 'barbell_back_squat',
        customization: {
          displayMode: 'detailed',
          timerVisibility: true,
          videoAutoplay: true,
          audioCues: true,
          hapticFeedback: true
        },
        integrationSettings: {
          wearableSync: true,
          chatMaestroSync: true,
          calendarSync: true,
          socialSharing: false
        }
      };

      const smartCard = engine.generateSmartCard('barbell_back_squat', sets, configuration);
      
      expect(smartCard).not.toBeNull();
      expect(smartCard?.exercise.id).toBe('barbell_back_squat');
      expect(smartCard?.sets).toEqual(sets);
      expect(smartCard?.instructions.length).toBeGreaterThan(0);
      expect(smartCard?.formCues.length).toBeGreaterThan(0);
      expect(smartCard?.commonMistakes.length).toBeGreaterThan(0);
      expect(smartCard?.safetyTips.length).toBeGreaterThan(0);
      expect(smartCard?.recommendedVariations.length).toBeGreaterThan(0);
      expect(smartCard?.progressHistory.length).toBeGreaterThan(0);
      expect(smartCard?.currentRecommendations.length).toBeGreaterThanOrEqual(0);
    });

    it('should return null for an invalid exercise', () => {
      const sets: ExerciseSet[] = [
        {
          setId: 'set_1',
          setNumber: 1,
          targetReps: 8,
          targetLoad: 60,
          targetRPE: 7,
          restPeriod: 90
        }
      ];

      const configuration: SmartCardConfiguration = {
        userId: 'user_123',
        sessionId: 'session_456',
        exerciseId: 'invalid_exercise',
        customization: {
          displayMode: 'detailed',
          timerVisibility: true,
          videoAutoplay: true,
          audioCues: true,
          hapticFeedback: true
        },
        integrationSettings: {
          wearableSync: true,
          chatMaestroSync: true,
          calendarSync: true,
          socialSharing: false
        }
      };

      const smartCard = engine.generateSmartCard('invalid_exercise', sets, configuration);
      
      expect(smartCard).toBeNull();
    });
  });

  describe('initializeTimer', () => {
    it('should initialize timer with correct settings', () => {
      const settings: TimerSettings = {
        workTime: 60,
        restTime: 90,
        preparationTime: 10,
        warningTime: 5,
        autoTransition: true,
        vibrationEnabled: true,
        soundEnabled: true
      };

      const timerState = engine.initializeTimer(settings);
      
      expect(timerState.currentPhase).toBe('preparation');
      expect(timerState.timeRemaining).toBe(10);
      expect(timerState.isRunning).toBe(false);
      expect(timerState.currentSetIndex).toBe(0);
      expect(timerState.totalSets).toBe(0);
    });
  });

  describe('updateTimerState', () => {
    it('should update timer state correctly for "next" action', () => {
      const settings: TimerSettings = {
        workTime: 60,
        restTime: 90,
        preparationTime: 10,
        warningTime: 5,
        autoTransition: true,
        vibrationEnabled: true,
        soundEnabled: true
      };

      // Start with preparation phase
      let timerState = engine.initializeTimer(settings);
      
      // Move to work phase
      timerState = engine.updateTimerState(timerState, settings, 'next');
      expect(timerState.currentPhase).toBe('work');
      expect(timerState.timeRemaining).toBe(60);
      
      // Move to rest phase
      timerState = engine.updateTimerState(timerState, settings, 'next');
      expect(timerState.currentPhase).toBe('rest');
      expect(timerState.timeRemaining).toBe(90);
      
      // Move back to work phase for next set
      timerState = engine.updateTimerState(timerState, settings, 'next');
      expect(timerState.currentPhase).toBe('work');
      expect(timerState.timeRemaining).toBe(60);
      expect(timerState.currentSetIndex).toBe(1);
    });

    it('should update timer state correctly for "previous" action', () => {
      const settings: TimerSettings = {
        workTime: 60,
        restTime: 90,
        preparationTime: 10,
        warningTime: 5,
        autoTransition: true,
        vibrationEnabled: true,
        soundEnabled: true
      };

      // Start with preparation phase
      let timerState = engine.initializeTimer(settings);
      
      // Move to work phase
      timerState = engine.updateTimerState(timerState, settings, 'next');
      expect(timerState.currentPhase).toBe('work');
      
      // Move to rest phase
      timerState = engine.updateTimerState(timerState, settings, 'next');
      expect(timerState.currentPhase).toBe('rest');
      
      // Move back to work phase
      timerState = engine.updateTimerState(timerState, settings, 'previous');
      expect(timerState.currentPhase).toBe('work');
    });
  });

  describe('processBiometricData', () => {
    it('should generate safety warning for elevated heart rate', () => {
      const biometricData = {
        heartRate: 190,
        timestamp: new Date()
      };

      const feedback = engine.processBiometricData(biometricData);
      
      expect(feedback.length).toBe(1);
      expect(feedback[0].type).toBe('safety_warning');
      expect(feedback[0].priority).toBe('high');
    });

    it('should generate performance insight for low HRV', () => {
      const biometricData = {
        heartRateVariability: 15,
        timestamp: new Date()
      };

      const feedback = engine.processBiometricData(biometricData);
      
      expect(feedback.length).toBe(1);
      expect(feedback[0].type).toBe('performance_insight');
      expect(feedback[0].priority).toBe('medium');
    });
  });

  describe('calculateProgressMetrics', () => {
    it('should calculate progress metrics for an exercise', () => {
      const metrics = engine.calculateProgressMetrics('barbell_back_squat');
      
      expect(metrics).toBeDefined();
      expect(metrics.strength).toBeDefined();
      expect(metrics.endurance).toBeDefined();
      expect(metrics.technique).toBeDefined();
      expect(metrics.recovery).toBeDefined();
      
      // Check that trends are properly set
      expect(['improving', 'declining', 'stable', 'plateau']).toContain(metrics.strength.trend);
      expect(['improving', 'declining', 'stable', 'plateau']).toContain(metrics.endurance.trend);
      expect(['improving', 'declining', 'stable', 'plateau']).toContain(metrics.technique.trend);
      expect(['improving', 'declining', 'stable', 'plateau']).toContain(metrics.recovery.trend);
    });
  });
});