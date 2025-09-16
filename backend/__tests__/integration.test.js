// Backend API integration tests
const request = require('supertest');
const app = require('../server');

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('services');
    });
  });

  describe('Authentication', () => {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };

    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
      
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
    });

    it('should fail to register with invalid email', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email'
      };
      
      await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should login with valid credentials', async () => {
      // First register a user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: `login${Date.now()}@example.com`
        });
      
      // Then login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: registerResponse.body.user.email,
          password: testUser.password
        })
        .expect(200);
      
      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body).toHaveProperty('tokens');
    });
  });
});