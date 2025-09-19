import { SpartanCoachService } from '../lib/spartan-coach-service';
import { ChatContext } from '../lib/chat-maestro-service';
import { RecoveryAnalysis, ProgressionPlan } from '../lib/types';

describe('Spartan Coach Service', () => {
  let spartanCoach: SpartanCoachService;

  beforeEach(() => {
    spartanCoach = new SpartanCoachService();
  });

  describe('generateCoachingMessage', () => {
    it('should generate a coaching message with adaptive style by default', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };

      const response = spartanCoach.generateCoachingMessage(context);
      
      expect(response.response).toBeDefined();
      expect(typeof response.response).toBe('string');
      expect(response.response.length).toBeGreaterThan(0);
    });

    it('should adapt communication style based on recovery status', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: [],
        recoveryStatus: {
          date: new Date(),
          recoveryScore: 30,
          fatigueLevel: 'high',
          recommendations: [],
          predictedFatigueDays: [],
          suggestedWorkoutIntensity: 'rest'
        }
      };

      const response = spartanCoach.generateCoachingMessage(context);
      
      expect(response.response).toContain('recuperación');
      expect(response.response).toContain('cuidar');
    });

    it('should provide technical feedback with motivational elements', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'workoutDetail',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };

      const performanceData = {
        formIssues: ['postura', 'control']
      };

      const response = spartanCoach.provideTechnicalFeedback('Sentadilla', performanceData, context);
      
      expect(response.response).toBeDefined();
      expect(response.response).toContain('Sentadilla');
      expect(response.response).toContain('mejorar');
    });
  });

  describe('interpretWearableData', () => {
    it('should interpret wearable data and provide recommendations', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [],
        progressionPlans: []
      };

      const wearableData = {
        hrv: 65,
        sleep: {
          duration: 7.5,
          efficiency: 85
        },
        steps: 8500,
        calories: 2500
      };

      const response = spartanCoach.interpretWearableData(wearableData, context);
      
      expect(response.response).toBeDefined();
      expect(typeof response.response).toBe('string');
      expect(response.response.length).toBeGreaterThan(0);
      expect(response.actionItems).toBeDefined();
      expect(Array.isArray(response.actionItems)).toBe(true);
    });
  });

  describe('balanceCommunicationElements', () => {
    it('should balance scientific, motivational, and clarity content', () => {
      const context: ChatContext = {
        userId: 'test-user',
        currentScreen: 'dashboard',
        userData: {
          name: 'Test User',
          age: 30,
          weight: 75,
          height: 180,
          fitnessLevel: 'intermediate',
          goals: ['strength']
        },
        userHabits: [],
        recentWorkouts: [
          { 
            id: '1', 
            workoutPlanId: 'plan1',
            date: new Date(), 
            startTime: new Date(),
            endTime: new Date(),
            duration: 60,
            exercises: [],
            notes: ''
          },
          { 
            id: '2', 
            workoutPlanId: 'plan1',
            date: new Date(), 
            startTime: new Date(),
            endTime: new Date(),
            duration: 45,
            exercises: [],
            notes: ''
          }
        ],
        progressionPlans: [
          { 
            exerciseName: 'Sentadilla', 
            currentWeight: 100,
            recommendedWeight: 105,
            nextPhase: 'accumulation',
            adjustments: [],
            notes: []
          }
        ]
      };

      const balance = spartanCoach.balanceCommunicationElements(context);
      
      expect(balance.scientificContent).toBeDefined();
      expect(balance.motivationalContent).toBeDefined();
      expect(balance.clarityContent).toBeDefined();
      
      expect(typeof balance.scientificContent).toBe('string');
      expect(typeof balance.motivationalContent).toBe('string');
      expect(typeof balance.clarityContent).toBe('string');
    });
  });
});