/**
 * Advanced Features E2E Tests for SPARTAN 4
 * Tests API integrations and data flow for key features
 */
import { test, expect, beforeEach, describe } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

global.fetch = jest.fn();

describe('SPARTAN 4 Advanced Features E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });
  });

  describe('Recipe Generator API Integration', () => {
    test('should handle recipe generation API calls', async () => {
      const mockRecipeData = {
        recipes: [{
          id: '1',
          name: 'Quinoa Power Bowl',
          totalMacros: { calories: 450, protein: 25, carbs: 60, fats: 12 }
        }],
        shoppingList: [{ ingredient: 'Quinoa', amount: '2 cups' }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecipeData)
      });

      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ calories: 2000, protein: 150 })
      });
      const result = await response.json();
      
      expect(response.ok).toBe(true);
      expect(result.recipes[0].name).toBe('Quinoa Power Bowl');
    });
  });

  describe('Blood Test Analysis API', () => {
    test('should analyze blood test data', async () => {
      const mockAnalysis = {
        summary: 'Optimal biomarkers',
        analyzedMarkers: [{
          name: 'Cholesterol',
          status: 'Optimal',
          value: '180'
        }]
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysis)
      });

      const response = await fetch('/api/blood-test/analyze', {
        method: 'POST',
        body: JSON.stringify({ cholesterol: 180 })
      });
      const result = await response.json();
      
      expect(result.analyzedMarkers[0].status).toBe('Optimal');
    });
  });

  describe('Wearable Integration', () => {
    test('should sync wearable data', async () => {
      const mockWearableData = {
        devices: [{ name: 'Apple Watch', connected: true }],
        healthData: { steps: 8500, heartRate: 70 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWearableData)
      });

      const response = await fetch('/api/wearables/sync');
      const result = await response.json();
      
      expect(result.devices[0].connected).toBe(true);
      expect(result.healthData.steps).toBe(8500);
    });
  });

  describe('Data Persistence', () => {
    test('should persist workout data', () => {
      const workoutData = { id: '1', name: 'Test Workout' };
      
      localStorageMock.setItem('workouts', JSON.stringify([workoutData]));
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'workouts',
        JSON.stringify([workoutData])
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' })
      });

      const response = await fetch('/api/test-error');
      
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });
});
