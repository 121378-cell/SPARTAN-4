import { ChatMaestroPredictiveEngine } from '../chat-maestro-predictive-engine';
import { ChatContext } from '../chat-maestro-service';

describe('ChatMaestroPredictiveEngine', () => {
  let predictiveEngine: ChatMaestroPredictiveEngine;

  beforeEach(() => {
    predictiveEngine = ChatMaestroPredictiveEngine.getInstance();
  });

  describe('generateProgressionAdvice', () => {
    it('should generate advice when progression plans are stagnant', () => {
      const context = {
        progressionPlans: [
          {
            id: 'plan1',
            exercise: 'Bench Press',
            currentWeight: 100,
            targetWeight: 120,
            startDate: new Date(),
            lastUpdated: new Date(),
            status: 'active',
            adjustments: []
          }
        ]
      } as unknown as ChatContext;

      const advice = (predictiveEngine as any).generateProgressionAdvice(context);
      
      expect(advice).toHaveLength(1);
      expect(advice[0].type).toBe('progression_advice');
      expect(advice[0].title).toContain('Ajustes necesarios');
    });

    it('should not generate advice when progression plans are active', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 7); // 7 days ago
      
      const context = {
        progressionPlans: [
          {
            id: 'plan1',
            exercise: 'Bench Press',
            currentWeight: 100,
            targetWeight: 120,
            startDate: new Date(),
            lastUpdated: new Date(),
            status: 'active',
            adjustments: [
              {
                date: recentDate,
                weight: 95,
                notes: 'Initial adjustment'
              }
            ]
          }
        ]
      } as unknown as ChatContext;

      const advice = (predictiveEngine as any).generateProgressionAdvice(context);
      
      expect(advice).toHaveLength(0);
    });
  });
});