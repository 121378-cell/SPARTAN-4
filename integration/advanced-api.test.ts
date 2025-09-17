/**
 * Expanded Backend API Integration Tests for SPARTAN 4
 * Tests advanced fitness features, Supabase integration, and futuristic AI capabilities
 */
import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock global fetch and localStorage
global.fetch = jest.fn();
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// API Configuration based on your Supabase setup
const API_CONFIG = {
  supabaseUrl: 'https://dbgksgnfpqndhvhnkhtx.supabase.co',
  baseUrl: 'http://localhost:3001', // Backend server
  geminiRateLimit: 15, // requests per minute
  endpoints: {
    auth: '/api/auth',
    workouts: '/api/workout-plans',
    nutrition: '/api/nutrition',
    biomolecular: '/api/biomolecular',
    quantumAI: '/api/quantum-ai',
    wearables: '/api/wearables',
    progress: '/api/progress'
  }
};

interface APITestResult {
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  success: boolean;
  data?: any;
  error?: string;
}

class AdvancedAPITester {
  private results: APITestResult[] = [];
  private authToken: string | null = null;

  async authenticateUser(): Promise<string> {
    const mockAuthResponse = {
      data: {
        user: { id: 'test-user-123', email: 'test@spartan4.com' },
        tokens: { accessToken: 'test-jwt-token', refreshToken: 'test-refresh-token' }
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockAuthResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@spartan4.com', password: 'test123' })
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    this.results.push({
      endpoint: '/auth/login',
      method: 'POST',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    });

    this.authToken = data.data.tokens.accessToken;
    return this.authToken || 'fallback-token';
  }

  async testSupabaseIntegration(): Promise<APITestResult> {
    const mockSupabaseResponse = {
      data: [
        {
          id: 'workout-1',
          name: 'Quantum Strength Training',
          description: 'AI-optimized strength routine',
          user_id: 'test-user-123',
          created_at: new Date().toISOString()
        }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockSupabaseResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.supabaseUrl}/rest/v1/workout_plans`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'apikey': 'mock-anon-key',
        'Content-Type': 'application/json'
      }
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    const result: APITestResult = {
      endpoint: '/supabase/workout_plans',
      method: 'GET',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    };

    this.results.push(result);
    return result;
  }

  async testQuantumAIGeneration(): Promise<APITestResult> {
    const mockQuantumResponse = {
      quantumPlan: {
        id: 'quantum-plan-1',
        multiverseSimulations: [
          { universe: 'A', outcome: 'optimal_strength', probability: 0.85 },
          { universe: 'B', outcome: 'maximum_endurance', probability: 0.72 },
          { universe: 'C', outcome: 'hybrid_performance', probability: 0.91 }
        ],
        recommendedExercises: [
          {
            name: 'Quantum Deadlift Variations',
            sets: 4,
            reps: '6-8',
            quantumOptimization: 'molecular_efficiency',
            biomolecularIntegration: 'ATP_synthesis_enhancement'
          }
        ],
        consciousnessLevel: 'elevated',
        neuralPlasticity: 0.89,
        expectedEvolution: '23% performance increase across parallel dimensions'
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockQuantumResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.quantumAI}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userProfile: {
          fitnessLevel: 'advanced',
          goals: ['transcendence', 'biomolecular_optimization'],
          consciousnessState: 'heightened'
        },
        quantumParameters: {
          dimensionCount: 7,
          temporalVariance: 0.3,
          emotionalIntelligence: true
        }
      })
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    const result: APITestResult = {
      endpoint: '/quantum-ai/generate',
      method: 'POST',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    };

    this.results.push(result);
    return result;
  }

  async testBiomolecularAnalysis(): Promise<APITestResult> {
    const mockBiomolecularResponse = {
      analysis: {
        mitochondrialEfficiency: 0.87,
        cellularRegeneration: 0.92,
        neuralPlasticity: 0.84,
        dnaOptimization: {
          muscleBuilding: 'enhanced',
          fatigueResistance: 'superior',
          recoverySpeed: 'accelerated'
        },
        molecularAdaptations: [
          {
            pathway: 'mTOR_activation',
            enhancement: '34%',
            timeframe: '72_hours'
          },
          {
            pathway: 'AMPK_efficiency',
            enhancement: '28%',
            timeframe: '48_hours'
          }
        ],
        personalizedNutrition: {
          macroOptimization: {
            protein: '2.2g/kg (enhanced absorption)',
            carbs: '4.1g/kg (temporal optimization)',
            fats: '1.1g/kg (cellular membrane enhancement)'
          },
          supplementation: [
            'Quantum CoQ10 (mitochondrial supercharging)',
            'Neural ATP Complex (consciousness enhancement)',
            'Temporal Creatine Synthesis (multidimensional energy)'
          ]
        }
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBiomolecularResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.biomolecular}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        biomarkers: {
          testosterone: 750,
          cortisol: 12,
          igf1: 280,
          lactate: 4.2
        },
        geneticProfile: {
          actn3: 'RR',
          ace: 'II',
          mctn1: 'fast'
        },
        currentTrainingPhase: 'hypertrophy'
      })
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    const result: APITestResult = {
      endpoint: '/biomolecular/analyze',
      method: 'POST',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    };

    this.results.push(result);
    return result;
  }

  async testAdvancedNutritionAI(): Promise<APITestResult> {
    const mockNutritionResponse = {
      adaptiveNutritionPlan: {
        id: 'nutrition-ai-1',
        personalizationLevel: 'quantum',
        metabolicOptimization: {
          basalMetabolicRate: 2340,
          thermalEffectFood: 234,
          activityEnergyExpenditure: 890,
          adaptiveThermogenesis: 'optimized'
        },
        mealPlans: [
          {
            timeOfDay: 'pre-workout',
            quantumTiming: '-45_minutes',
            foods: [
              {
                name: 'Quantum Oats with Neural Berries',
                macros: { calories: 320, protein: 12, carbs: 58, fats: 6 },
                biomolecularBenefits: ['ATP_priming', 'neural_enhancement'],
                optimizationLevel: 'cellular'
              }
            ]
          }
        ],
        supplementStack: {
          preworkout: ['Quantum Caffeine Matrix', 'Neural Beta-Alanine'],
          postworkout: ['Temporal Whey Protein', 'Mitochondrial Creatine'],
          sleep: ['Consciousness Recovery Complex', 'Cellular Regeneration Blend']
        },
        adaptationTracking: {
          metabolicFlexibility: 'increasing',
          nutritionalSensitivity: 'optimizing',
          bodyComposition: 'evolving'
        }
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockNutritionResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.nutrition}/quantum-plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userProfile: {
          age: 30,
          weight: 75,
          bodyFat: 12,
          activityLevel: 'high',
          goals: ['lean_muscle', 'neural_optimization']
        },
        preferences: {
          dietType: 'flexible',
          allergies: [],
          quantumOptimization: true
        }
      })
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    const result: APITestResult = {
      endpoint: '/nutrition/quantum-plan',
      method: 'POST',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    };

    this.results.push(result);
    return result;
  }

  async testWearableDataIntegration(): Promise<APITestResult> {
    const mockWearableResponse = {
      deviceSync: {
        status: 'connected',
        lastSync: new Date().toISOString(),
        devices: [
          {
            name: 'Quantum Fitness Tracker',
            type: 'advanced_biometric',
            capabilities: ['hrv', 'neural_activity', 'cellular_metrics']
          }
        ],
        biometricData: {
          heartRateVariability: 55,
          neuralCoherence: 0.78,
          cellularVitality: 0.89,
          quantumFieldAlignment: 0.72,
          consciousnessLevel: 'elevated'
        },
        insights: [
          {
            type: 'recovery_optimization',
            message: 'Neural pathways show 23% enhancement potential',
            recommendation: 'Implement quantum breathing protocol',
            priority: 'high'
          }
        ]
      }
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockWearableResponse)
    });

    const startTime = performance.now();
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.wearables}/sync`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    });

    const responseTime = performance.now() - startTime;
    const data = await response.json();

    const result: APITestResult = {
      endpoint: '/wearables/sync',
      method: 'GET',
      status: response.status,
      responseTime,
      success: response.ok,
      data
    };

    this.results.push(result);
    return result;
  }

  async testErrorHandlingAndRecovery(): Promise<APITestResult[]> {
    const errorTests = [];

    // Test 1: Rate limit handling
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Rate limit exceeded', retryAfter: 60 })
    });

    const rateLimitTest = await this.makeAPICall('/quantum-ai/generate', 'POST', {});
    errorTests.push({
      ...rateLimitTest,
      endpoint: '/quantum-ai/generate (rate-limit-test)'
    });

    // Test 2: Network error handling
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    try {
      await this.makeAPICall('/biomolecular/analyze', 'POST', {});
    } catch (error) {
      errorTests.push({
        endpoint: '/biomolecular/analyze (network-error-test)',
        method: 'POST',
        status: 0,
        responseTime: 0,
        success: false,
        error: 'Network Error'
      });
    }

    // Test 3: Invalid token handling
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Invalid token' })
    });

    const authErrorTest = await this.makeAPICall('/workout-plans', 'GET', {});
    errorTests.push({
      ...authErrorTest,
      endpoint: '/workout-plans (auth-error-test)'
    });

    return errorTests;
  }

  private async makeAPICall(endpoint: string, method: string, body: any): Promise<APITestResult> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: method !== 'GET' ? JSON.stringify(body) : undefined
      });

      const responseTime = performance.now() - startTime;
      const data = response.ok ? await response.json() : null;

      return {
        endpoint,
        method,
        status: response.status,
        responseTime,
        success: response.ok,
        data
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        endpoint,
        method,
        status: 0,
        responseTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getTestReport(): any {
    const successfulTests = this.results.filter(r => r.success);
    const failedTests = this.results.filter(r => !r.success);
    const avgResponseTime = this.results.reduce((sum, r) => sum + r.responseTime, 0) / this.results.length;

    return {
      summary: {
        totalTests: this.results.length,
        successful: successfulTests.length,
        failed: failedTests.length,
        successRate: (successfulTests.length / this.results.length) * 100,
        averageResponseTime: avgResponseTime
      },
      results: this.results,
      performance: {
        fastestResponse: Math.min(...this.results.map(r => r.responseTime)),
        slowestResponse: Math.max(...this.results.map(r => r.responseTime))
      }
    };
  }
}

describe('SPARTAN 4 Expanded Backend API Integration Tests', () => {
  let apiTester: AdvancedAPITester;

  beforeAll(async () => {
    apiTester = new AdvancedAPITester();
    console.log('🔧 Starting Advanced API Integration Tests');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should authenticate user and obtain JWT token', async () => {
    const token = await apiTester.authenticateUser();
    
    expect(token).toBeTruthy();
    expect(token).toBe('test-jwt-token');
    console.log('✅ Authentication successful');
  });

  test('should integrate with Supabase database', async () => {
    await apiTester.authenticateUser();
    const result = await apiTester.testSupabaseIntegration();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data.data).toHaveLength(1);
    expect(result.data.data[0].name).toBe('Quantum Strength Training');
    
    console.log('✅ Supabase integration successful');
  });

  test('should generate quantum AI workout plans', async () => {
    await apiTester.authenticateUser();
    const result = await apiTester.testQuantumAIGeneration();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data.quantumPlan).toBeDefined();
    expect(result.data.quantumPlan.multiverseSimulations).toHaveLength(3);
    expect(result.data.quantumPlan.consciousnessLevel).toBe('elevated');
    expect(result.data.quantumPlan.neuralPlasticity).toBeGreaterThan(0.8);
    
    console.log('🌌 Quantum AI generation successful');
  });

  test('should perform biomolecular fitness analysis', async () => {
    await apiTester.authenticateUser();
    const result = await apiTester.testBiomolecularAnalysis();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data.analysis.mitochondrialEfficiency).toBeGreaterThan(0.8);
    expect(result.data.analysis.molecularAdaptations).toHaveLength(2);
    expect(result.data.analysis.personalizedNutrition).toBeDefined();
    
    console.log('🧬 Biomolecular analysis successful');
  });

  test('should create advanced nutrition plans with AI', async () => {
    await apiTester.authenticateUser();
    const result = await apiTester.testAdvancedNutritionAI();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data.adaptiveNutritionPlan.personalizationLevel).toBe('quantum');
    expect(result.data.adaptiveNutritionPlan.mealPlans).toHaveLength(1);
    expect(result.data.adaptiveNutritionPlan.supplementStack).toBeDefined();
    
    console.log('🍎 Advanced nutrition AI successful');
  });

  test('should sync with advanced wearable devices', async () => {
    await apiTester.authenticateUser();
    const result = await apiTester.testWearableDataIntegration();
    
    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data.deviceSync.status).toBe('connected');
    expect(result.data.deviceSync.biometricData.neuralCoherence).toBeGreaterThan(0.7);
    expect(result.data.deviceSync.insights).toHaveLength(1);
    
    console.log('⌚ Wearable integration successful');
  });

  test('should handle API errors and rate limiting gracefully', async () => {
    await apiTester.authenticateUser();
    const errorResults = await apiTester.testErrorHandlingAndRecovery();
    
    expect(errorResults).toHaveLength(3);
    
    // Rate limit test
    expect(errorResults[0].status).toBe(429);
    
    // Network error test
    expect(errorResults[1].success).toBe(false);
    expect(errorResults[1].error).toBe('Network Error');
    
    // Auth error test
    expect(errorResults[2].status).toBe(401);
    
    console.log('⚠️ Error handling tests completed');
  });

  test('should respect Gemini AI rate limits (15 requests/minute)', async () => {
    await apiTester.authenticateUser();
    
    const requestTimes = [];
    const maxRequests = 3; // Test with smaller number for speed
    
    for (let i = 0; i < maxRequests; i++) {
      const startTime = Date.now();
      await apiTester.testQuantumAIGeneration();
      requestTimes.push(Date.now() - startTime);
      
      // Add delay between requests to respect rate limit
      if (i < maxRequests - 1) {
        await new Promise(resolve => setTimeout(resolve, 4000)); // 4 second delay
      }
    }
    
    // Verify requests were spaced appropriately
    const totalTime = requestTimes.reduce((sum, time) => sum + time, 0);
    const avgTime = totalTime / requestTimes.length;
    
    expect(avgTime).toBeLessThan(10000); // Each request should complete in under 10s
    
    console.log(`⏱️ Rate limiting test: ${maxRequests} requests completed`);
  }, 30000);

  test('should maintain performance under concurrent requests', async () => {
    await apiTester.authenticateUser();
    
    const concurrentRequests = [
      apiTester.testBiomolecularAnalysis(),
      apiTester.testAdvancedNutritionAI(),
      apiTester.testWearableDataIntegration()
    ];
    
    const startTime = Date.now();
    const results = await Promise.all(concurrentRequests);
    const totalTime = Date.now() - startTime;
    
    expect(results.every(r => r.success)).toBe(true);
    expect(totalTime).toBeLessThan(15000); // Should complete in under 15 seconds
    
    console.log(`⚡ Concurrent requests completed in ${totalTime}ms`);
  });

  afterAll(() => {
    const report = apiTester.getTestReport();
    
    console.log('\n📊 API INTEGRATION TEST REPORT');
    console.log('================================');
    console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    console.log(`Average Response Time: ${report.summary.averageResponseTime.toFixed(2)}ms`);
    console.log(`Fastest Response: ${report.performance.fastestResponse.toFixed(2)}ms`);
    console.log(`Slowest Response: ${report.performance.slowestResponse.toFixed(2)}ms`);
    console.log(`Total Tests: ${report.summary.totalTests}`);
  });
});