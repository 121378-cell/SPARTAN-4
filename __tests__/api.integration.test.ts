import request from 'supertest';
import { app } from '../backend/server';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.GEMINI_API_KEY = 'test-api-key';

describe('API Integration Tests', () => {
  let server: any;
  let authToken: string;

  beforeAll(async () => {
    // Start the server for testing
    server = app.listen(0); // Use random port for testing
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
  });

  beforeEach(() => {
    // Reset auth token for each test
    authToken = '';
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: 'Test123!',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        email: `login-test-${Date.now()}@example.com`,
        password: 'Test123!',
        name: 'Login Test User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Then login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');
      expect(loginResponse.body).toHaveProperty('user');
      authToken = loginResponse.body.token;
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate JWT token', async () => {
      // First register and login to get a token
      const userData = {
        email: `validate-test-${Date.now()}@example.com`,
        password: 'Test123!',
        name: 'Validate Test User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      const token = loginResponse.body.token;

      // Test token validation
      const response = await request(app)
        .get('/api/auth/validate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('user');
    });
  });

  describe('Workout Endpoints', () => {
    beforeEach(async () => {
      // Get auth token for protected routes
      const userData = {
        email: `workout-test-${Date.now()}@example.com`,
        password: 'Test123!',
        name: 'Workout Test User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      authToken = loginResponse.body.token;
    });

    it('should generate a workout plan', async () => {
      const workoutRequest = {
        fitnessLevel: 'intermediate',
        goals: ['Muscle Gain', 'Strength'],
        duration: 45,
        equipment: ['Dumbbells', 'Barbell']
      };

      const response = await request(app)
        .post('/api/workouts/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workoutRequest)
        .expect(200);

      expect(response.body).toHaveProperty('workout');
      expect(response.body.workout).toHaveProperty('exercises');
      expect(Array.isArray(response.body.workout.exercises)).toBe(true);
    });

    it('should save a workout plan', async () => {
      const workoutPlan = {
        name: 'Test Workout',
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: 10,
            description: 'Basic push-up exercise'
          }
        ],
        duration: 30
      };

      const response = await request(app)
        .post('/api/workouts/save')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workoutPlan)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', workoutPlan.name);
    });

    it('should get user workout plans', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('workouts');
      expect(Array.isArray(response.body.workouts)).toBe(true);
    });
  });

  describe('Health Check', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/workouts')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on login attempts', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(6).fill(0).map(() => 
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const responses = await Promise.all(requests);
      
      // At least one should be rate limited (429)
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});