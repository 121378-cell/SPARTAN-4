import { ChatMaestroService } from '../lib/chat-maestro-service';
import { ChatContext, ChatResponse } from '../lib/chat-maestro-service';
import { WorkoutPlan, UserData, UserHabit } from '../lib/types';

// Mock services
jest.mock('../lib/storage', () => ({
  storageManager: {
    getUserData: () => ({
      name: "Test User",
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: "intermediate",
      goals: ["Mejorar fuerza", "Aumentar masa muscular"]
    }),
    getUserHabits: () => [],
    getWorkoutSessions: () => [],
    getProgressionPlans: () => []
  }
}));

jest.mock('../lib/habit-tracking', () => ({
  habitTrackingService: {
    getUserHabits: () => null,
    getRecommendedTrainingDays: () => [1, 3, 5]
  }
}));

jest.mock('../lib/recovery-service', () => ({
  recoveryService: {
    getRecoveryAnalysis: () => null,
    getRecentRecoveryAnalyses: () => []
  }
}));

jest.mock('../lib/load-progression-service', () => ({
  loadProgressionService: {
    applyProgressionAdjustments: (workout: any) => workout
  }
}));

jest.mock('../lib/nutrition-service', () => ({
  nutritionService: {
    getNutritionRecommendations: () => ({
      date: new Date(),
      totalNutrients: {
        calories: 2500,
        protein: 150,
        carbs: 300,
        fats: 80
      },
      meals: []
    })
  }
}));

jest.mock('../lib/predictive-analytics', () => ({
  predictiveAnalyticsEngine: {}
}));

jest.mock('../lib/progress-report-generator', () => ({
  progressReportGenerator: {}
}));

jest.mock('../lib/conversationalCoach', () => ({
  ConversationalCoach: jest.fn().mockImplementation(() => ({
    analyzeUserPsychology: () => ({}),
    generateCoachingMessage: () => ({
      content: "Mensaje de coaching",
      actionItems: []
    })
  })),
  UserPsychologyProfile: jest.fn()
}));

jest.mock('../lib/spartan-coach-service', () => ({
  SpartanCoachService: jest.fn().mockImplementation(() => ({
    generateCoachingMessage: () => ({
      response: "Mensaje del Spartan Coach",
      actionItems: [],
      recommendations: []
    }),
    interpretWearableData: () => ({
      response: "Interpretación de datos wearables",
      actionItems: [],
      recommendations: []
    })
  }))
}));

jest.mock('../lib/wearable-integration-service', () => ({
  wearableIntegrationService: {
    processWearableData: () => ({
      recoveryStatus: 'good',
      trainingReadiness: 'ready',
      adjustments: [],
      recommendations: [],
      riskFactors: []
    })
  }
}));

describe('ChatMaestroService - Plan Explanation', () => {
  let chatMaestroService: ChatMaestroService;
  
  beforeEach(() => {
    chatMaestroService = ChatMaestroService.getInstance();
  });
  
  const mockWorkoutPlan: WorkoutPlan = {
    id: 'test-plan-1',
    name: 'Plan de Fuerza Intermedio',
    description: 'Plan de entrenamiento para nivel intermedio enfocado en fuerza',
    focus: ['full_body'],
    days: [
      {
        day: 1,
        focus: 'Piernas y espalda',
        exercises: [
          {
            name: 'Sentadilla',
            sets: 4,
            reps: '8-10',
            rest: 90,
            equipment: 'Barra'
          },
          {
            name: 'Peso muerto',
            sets: 3,
            reps: '6-8',
            rest: 120,
            equipment: 'Barra'
          }
        ]
      },
      {
        day: 2,
        focus: 'Pecho y hombros',
        exercises: [
          {
            name: 'Press de banca',
            sets: 4,
            reps: '8-10',
            rest: 90,
            equipment: 'Barra'
          },
          {
            name: 'Press militar',
            sets: 3,
            reps: '8-10',
            rest: 90,
            equipment: 'Mancuernas'
          }
        ]
      }
    ],
    duration: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    difficulty: 'intermediate',
    equipment: ['Barra', 'Mancuernas', 'Banco'],
    estimatedCalories: 400
  };
  
  const mockUserData: UserData = {
    name: "Usuario de Prueba",
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: "intermediate",
    goals: ["Mejorar fuerza", "Aumentar masa muscular"]
  };
  
  const mockContext: ChatContext = {
    userId: 'test-user-1',
    currentScreen: 'workoutDetail',
    activeWorkout: mockWorkoutPlan,
    userData: mockUserData,
    userHabits: [],
    recentWorkouts: [],
    progressionPlans: [],
    nutritionData: {
      date: new Date(),
      totalNutrients: {
        calories: 2500,
        protein: 150,
        carbs: 300,
        fats: 80
      },
      meals: []
    }
  };
  
  it('should provide detailed plan explanation when user asks for it', async () => {
    const input = 'Explícame la lógica de este plan';
    const intent = 'workout_inquiry';
    
    const response: ChatResponse = await (chatMaestroService as any).generateResponse(input, intent, mockContext);
    
    expect(response.response).toContain('PLAN DETALLADO');
    expect(response.response).toContain('OBJETIVOS DEL PLAN');
    expect(response.response).toContain('FASES DEL PLAN');
    expect(response.response).toContain('LÓGICA DE PROGRESIÓN');
    expect(response.response).toContain('CONSEJO MOTIVACIONAL');
  });
  
  it('should adapt explanation to beginner level', async () => {
    const beginnerContext: ChatContext = {
      ...mockContext,
      userData: {
        ...mockUserData,
        fitnessLevel: 'beginner'
      }
    };
    
    const input = '¿Cuál es la lógica de progresión de este plan?';
    const intent = 'workout_inquiry';
    
    const response: ChatResponse = await (chatMaestroService as any).generateResponse(input, intent, beginnerContext);
    
    expect(response.response).toContain('Progresión Lineal');
    expect(response.response).toContain('Enfoque en técnica y consistencia');
  });
  
  it('should adapt explanation to advanced level', async () => {
    const advancedContext: ChatContext = {
      ...mockContext,
      userData: {
        ...mockUserData,
        fitnessLevel: 'advanced'
      }
    };
    
    const input = 'Detalla las fases de este plan';
    const intent = 'workout_inquiry';
    
    const response: ChatResponse = await (chatMaestroService as any).generateResponse(input, intent, advancedContext);
    
    expect(response.response).toContain('Periodización avanzada');
    expect(response.response).toContain('Modelado de Frecuencia');
  });
});