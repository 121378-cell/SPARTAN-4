import { ProgressReportGenerator } from '../lib/progress-report-generator';
import type { UserData, WorkoutPlan, WorkoutSession } from '../lib/types';

// Mock the database functions
jest.mock('../lib/supabase', () => ({
  db: {
    getUser: jest.fn().mockResolvedValue({ 
      data: {
        id: 'test-user',
        name: 'Test User',
        age: 30,
        weight: 75,
        height: 180,
        fitnessLevel: 'intermediate',
        goals: ['strength']
      }, 
      error: null 
    }),
    getUserWorkoutPlans: jest.fn().mockResolvedValue({ data: [], error: null }),
    getUserProgress: jest.fn().mockResolvedValue({ data: [], error: null })
  }
}));

describe('ProgressReportGenerator', () => {
  let progressReportGenerator: ProgressReportGenerator;

  beforeEach(() => {
    progressReportGenerator = new ProgressReportGenerator();
  });

  describe('generateWeeklyReport', () => {
    it('should generate a complete weekly report', async () => {
      const report = await progressReportGenerator.generateWeeklyReport('test-user');

      expect(report).toBeDefined();
      expect(report.userId).toBe('test-user');
      expect(report.overallScore).toBeGreaterThanOrEqual(0);
      expect(report.overallScore).toBeLessThanOrEqual(100);
      expect(report.training).toBeDefined();
      expect(report.nutrition).toBeDefined();
      expect(report.health).toBeDefined();
      expect(report.performance).toBeDefined();
    });
    
    it('should throw error when user data is not found', async () => {
      // Mock to return null user data
      const db = require('../lib/supabase').db;
      (db.getUser as jest.Mock).mockResolvedValueOnce({ data: null, error: null });
      
      await expect(progressReportGenerator.generateWeeklyReport('non-existent-user'))
        .rejects
        .toThrow('User data not found');
    });
  });
});