import { SpartanCoachService } from '../lib/spartan-coach-service';
import { ChatContext } from '../lib/chat-maestro-service';

describe('Spartan Coach Service - Simple Test', () => {
  let spartanCoach: SpartanCoachService;

  beforeEach(() => {
    spartanCoach = new SpartanCoachService();
  });

  it('should create Spartan Coach instance', () => {
    expect(spartanCoach).toBeDefined();
    expect(spartanCoach).toBeInstanceOf(SpartanCoachService);
  });

  it('should generate a coaching message', () => {
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
});