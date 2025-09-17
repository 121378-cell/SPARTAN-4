/**
 * Load Testing for SPARTAN 4 - Heavy Usage Scenarios
 * Tests application performance under stress with concurrent AI operations
 * Simulates realistic user loads while respecting Gemini API rate limits
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import { performance } from 'perf_hooks';

interface LoadTestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  requestsPerSecond: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  errors: Array<{ type: string; count: number; examples: string[] }>;
}

interface LoadTestScenario {
  name: string;
  concurrentUsers: number;
  duration: number; // seconds
  requestPattern: 'constant' | 'burst' | 'ramp';
  operations: Array<{
    endpoint: string;
    weight: number; // percentage of requests
    delay?: number; // ms between requests for this operation
  }>;
}

class LoadTester {
  private metrics: LoadTestMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Infinity,
    requestsPerSecond: 0,
    memoryUsage: { initial: 0, peak: 0, final: 0 },
    errors: []
  };

  private responseTimes: number[] = [];
  private testStartTime: number = 0;

  // Gemini API rate limiting - 15 requests per minute
  private geminiRateLimit = {
    maxRequests: 15,
    windowMs: 60 * 1000,
    requests: [] as number[]
  };

  private canMakeGeminiRequest(): boolean {
    const now = Date.now();
    // Remove requests older than 1 minute
    this.geminiRateLimit.requests = this.geminiRateLimit.requests.filter(
      time => now - time < this.geminiRateLimit.windowMs
    );
    
    return this.geminiRateLimit.requests.length < this.geminiRateLimit.maxRequests;
  }

  private recordGeminiRequest(): void {
    this.geminiRateLimit.requests.push(Date.now());
  }

  async simulateAPICall(endpoint: string, complexity: 'light' | 'medium' | 'heavy' | 'quantum'): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
  }> {
    const startTime = performance.now();
    
    try {
      // Simulate different types of operations
      let delay = 0;
      let shouldRateLimit = false;

      switch (endpoint) {
        case '/auth/login':
          delay = 200 + Math.random() * 100; // 200-300ms
          break;
        case '/user/profile':
          delay = 150 + Math.random() * 50; // 150-200ms
          break;
        case '/workout-plans':
          delay = 300 + Math.random() * 200; // 300-500ms
          break;
        case '/ai/workout-generation':
          shouldRateLimit = true;
          if (!this.canMakeGeminiRequest()) {
            throw new Error('Rate limit exceeded');
          }
          delay = 2000 + Math.random() * 3000; // 2-5 seconds (Gemini AI)
          this.recordGeminiRequest();
          break;
        case '/ai/quantum-analysis':
          shouldRateLimit = true;
          if (!this.canMakeGeminiRequest()) {
            throw new Error('Rate limit exceeded');
          }
          delay = 3000 + Math.random() * 5000; // 3-8 seconds (Quantum AI)
          this.recordGeminiRequest();
          break;
        case '/biomolecular/analysis':
          delay = 800 + Math.random() * 400; // 800-1200ms (Local computation)
          break;
        case '/nutrition/plan':
          delay = 1000 + Math.random() * 500; // 1-1.5 seconds
          break;
        case '/wearables/sync':
          delay = 400 + Math.random() * 200; // 400-600ms
          break;
        default:
          delay = 100 + Math.random() * 50; // Generic API call
      }

      // Simulate network delay and processing
      await new Promise(resolve => setTimeout(resolve, delay));

      // Simulate occasional failures (5% failure rate)
      if (Math.random() < 0.05) {
        throw new Error('Simulated network error');
      }

      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, true);

      return { success: true, responseTime };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      this.recordResponse(responseTime, false);
      
      return { 
        success: false, 
        responseTime, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private recordResponse(responseTime: number, success: boolean): void {
    this.metrics.totalRequests++;
    this.responseTimes.push(responseTime);

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;
    }

    this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, responseTime);
    this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, responseTime);
  }

  async runLoadTest(scenario: LoadTestScenario): Promise<LoadTestMetrics> {
    console.log(`🚀 Starting load test: ${scenario.name}`);
    console.log(`👥 Concurrent users: ${scenario.concurrentUsers}`);
    console.log(`⏱️  Duration: ${scenario.duration}s`);

    this.testStartTime = performance.now();
    this.metrics.memoryUsage.initial = process.memoryUsage().heapUsed;

    const userPromises: Promise<void>[] = [];

    // Create concurrent user sessions
    for (let i = 0; i < scenario.concurrentUsers; i++) {
      userPromises.push(this.simulateUser(scenario, i));
    }

    // Wait for all users to complete
    await Promise.all(userPromises);

    // Calculate final metrics
    this.calculateFinalMetrics();
    this.metrics.memoryUsage.final = process.memoryUsage().heapUsed;

    return this.metrics;
  }

  private async simulateUser(scenario: LoadTestScenario, userId: number): Promise<void> {
    const userStartTime = performance.now();
    const endTime = userStartTime + (scenario.duration * 1000);

    while (performance.now() < endTime) {
      // Select operation based on weights
      const operation = this.selectOperation(scenario.operations);
      
      if (operation) {
        await this.simulateAPICall(operation.endpoint, 'medium');
        
        // Add delay between requests if specified
        if (operation.delay) {
          await new Promise(resolve => setTimeout(resolve, operation.delay));
        } else {
          // Default delay between user actions (1-3 seconds)
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        }
      }
    }
  }

  private selectOperation(operations: LoadTestScenario['operations']) {
    const random = Math.random() * 100;
    let currentWeight = 0;

    for (const operation of operations) {
      currentWeight += operation.weight;
      if (random <= currentWeight) {
        return operation;
      }
    }

    return operations[0]; // Fallback
  }

  private calculateFinalMetrics(): void {
    if (this.responseTimes.length > 0) {
      this.metrics.averageResponseTime = 
        this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length;
    }

    const testDuration = (performance.now() - this.testStartTime) / 1000; // Convert to seconds
    this.metrics.requestsPerSecond = this.metrics.totalRequests / testDuration;

    // Update peak memory usage
    this.metrics.memoryUsage.peak = Math.max(
      this.metrics.memoryUsage.initial,
      process.memoryUsage().heapUsed,
      this.metrics.memoryUsage.final
    );
  }

  async stressTestMemoryUsage(): Promise<{ memoryLeakDetected: boolean; memoryIncrease: number }> {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Run intensive operations
    for (let i = 0; i < 100; i++) {
      await this.simulateAPICall('/biomolecular/analysis', 'heavy');
      
      // Force garbage collection every 10 iterations
      if (i % 10 === 0 && global.gc) {
        global.gc();
      }
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    const memoryLeakDetected = memoryIncrease > (50 * 1024 * 1024); // 50MB threshold

    return { memoryLeakDetected, memoryIncrease };
  }

  reset(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
      requestsPerSecond: 0,
      memoryUsage: { initial: 0, peak: 0, final: 0 },
      errors: []
    };
    this.responseTimes = [];
    this.geminiRateLimit.requests = [];
  }
}

describe('SPARTAN 4 Load Testing Scenarios', () => {
  let loadTester: LoadTester;

  beforeAll(() => {
    loadTester = new LoadTester();
    console.log('🔥 Initializing Load Testing for SPARTAN 4');
  });

  afterAll(() => {
    console.log('✅ Load testing completed');
  });

  test('should handle normal user load (10 concurrent users)', async () => {
    const scenario: LoadTestScenario = {
      name: 'Normal User Load',
      concurrentUsers: 10,
      duration: 30, // 30 seconds
      requestPattern: 'constant',
      operations: [
        { endpoint: '/auth/login', weight: 10 },
        { endpoint: '/user/profile', weight: 20 },
        { endpoint: '/workout-plans', weight: 30 },
        { endpoint: '/biomolecular/analysis', weight: 25 },
        { endpoint: '/nutrition/plan', weight: 15 }
      ]
    };

    const metrics = await loadTester.runLoadTest(scenario);

    expect(metrics.totalRequests).toBeGreaterThan(50);
    expect(metrics.successfulRequests / metrics.totalRequests).toBeGreaterThan(0.9); // 90% success rate
    expect(metrics.averageResponseTime).toBeLessThan(2000); // Under 2 seconds average
    expect(metrics.requestsPerSecond).toBeGreaterThan(1);

    console.log(`📊 Normal Load Results:`);
    console.log(`   Requests: ${metrics.totalRequests} (${metrics.successfulRequests} successful)`);
    console.log(`   Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Requests/sec: ${metrics.requestsPerSecond.toFixed(2)}`);

    loadTester.reset();
  }, 45000);

  test('should handle AI-intensive workload with rate limiting', async () => {
    const scenario: LoadTestScenario = {
      name: 'AI-Intensive Workload',
      concurrentUsers: 5, // Fewer users due to Gemini rate limits
      duration: 20,
      requestPattern: 'constant',
      operations: [
        { endpoint: '/ai/workout-generation', weight: 40, delay: 4000 }, // Respect rate limits
        { endpoint: '/ai/quantum-analysis', weight: 30, delay: 4000 },
        { endpoint: '/biomolecular/analysis', weight: 20 },
        { endpoint: '/user/profile', weight: 10 }
      ]
    };

    const metrics = await loadTester.runLoadTest(scenario);

    expect(metrics.totalRequests).toBeGreaterThan(10);
    // Allow higher failure rate due to rate limiting
    expect(metrics.successfulRequests / metrics.totalRequests).toBeGreaterThan(0.7); // 70% success rate
    expect(metrics.averageResponseTime).toBeLessThan(8000); // AI requests are slower

    console.log(`🤖 AI Workload Results:`);
    console.log(`   Requests: ${metrics.totalRequests} (${metrics.successfulRequests} successful)`);
    console.log(`   Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Rate Limited Requests: ${metrics.failedRequests}`);

    loadTester.reset();
  }, 30000);

  test('should handle peak usage scenario (25 concurrent users)', async () => {
    const scenario: LoadTestScenario = {
      name: 'Peak Usage',
      concurrentUsers: 25,
      duration: 20,
      requestPattern: 'burst',
      operations: [
        { endpoint: '/auth/login', weight: 15 },
        { endpoint: '/user/profile', weight: 25 },
        { endpoint: '/workout-plans', weight: 20 },
        { endpoint: '/biomolecular/analysis', weight: 20 },
        { endpoint: '/nutrition/plan', weight: 15 },
        { endpoint: '/wearables/sync', weight: 5 }
      ]
    };

    const metrics = await loadTester.runLoadTest(scenario);

    expect(metrics.totalRequests).toBeGreaterThan(100);
    expect(metrics.successfulRequests / metrics.totalRequests).toBeGreaterThan(0.85); // 85% success rate
    expect(metrics.averageResponseTime).toBeLessThan(3000); // Under 3 seconds average
    expect(metrics.requestsPerSecond).toBeGreaterThan(3);

    console.log(`⚡ Peak Usage Results:`);
    console.log(`   Requests: ${metrics.totalRequests} (${metrics.successfulRequests} successful)`);
    console.log(`   Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Max Response Time: ${metrics.maxResponseTime.toFixed(2)}ms`);
    console.log(`   Requests/sec: ${metrics.requestsPerSecond.toFixed(2)}`);

    loadTester.reset();
  }, 35000);

  test('should detect memory leaks under stress', async () => {
    const memoryTest = await loadTester.stressTestMemoryUsage();

    expect(memoryTest.memoryLeakDetected).toBe(false);
    expect(memoryTest.memoryIncrease).toBeLessThan(100 * 1024 * 1024); // Less than 100MB increase

    console.log(`🧠 Memory Test Results:`);
    console.log(`   Memory Increase: ${(memoryTest.memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Memory Leak Detected: ${memoryTest.memoryLeakDetected ? 'YES ⚠️' : 'NO ✅'}`);
  }, 15000);

  test('should handle quantum AI burst requests', async () => {
    const scenario: LoadTestScenario = {
      name: 'Quantum AI Burst',
      concurrentUsers: 3, // Very limited due to rate constraints
      duration: 15,
      requestPattern: 'burst',
      operations: [
        { endpoint: '/ai/quantum-analysis', weight: 80, delay: 5000 }, // 5 second delays
        { endpoint: '/biomolecular/analysis', weight: 20 }
      ]
    };

    const metrics = await loadTester.runLoadTest(scenario);

    // Due to rate limiting, expect lower request counts but should handle gracefully
    expect(metrics.totalRequests).toBeGreaterThan(5);
    expect(metrics.averageResponseTime).toBeLessThan(10000); // Quantum AI is slower

    const successRate = metrics.successfulRequests / metrics.totalRequests;
    expect(successRate).toBeGreaterThan(0.5); // 50% minimum due to rate limiting

    console.log(`🌌 Quantum AI Burst Results:`);
    console.log(`   Requests: ${metrics.totalRequests} (${metrics.successfulRequests} successful)`);
    console.log(`   Success Rate: ${(successRate * 100).toFixed(1)}%`);
    console.log(`   Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);

    loadTester.reset();
  }, 25000);

  test('should validate biomolecular analysis performance under load', async () => {
    const scenario: LoadTestScenario = {
      name: 'Biomolecular Analysis Load',
      concurrentUsers: 15,
      duration: 20,
      requestPattern: 'constant',
      operations: [
        { endpoint: '/biomolecular/analysis', weight: 80 },
        { endpoint: '/user/profile', weight: 20 }
      ]
    };

    const metrics = await loadTester.runLoadTest(scenario);

    expect(metrics.totalRequests).toBeGreaterThan(80);
    expect(metrics.successfulRequests / metrics.totalRequests).toBeGreaterThan(0.9); // 90% success
    expect(metrics.averageResponseTime).toBeLessThan(1500); // Local computation should be fast

    console.log(`🧬 Biomolecular Load Results:`);
    console.log(`   Requests: ${metrics.totalRequests} (${metrics.successfulRequests} successful)`);
    console.log(`   Avg Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Requests/sec: ${metrics.requestsPerSecond.toFixed(2)}`);

    loadTester.reset();
  }, 30000);
});