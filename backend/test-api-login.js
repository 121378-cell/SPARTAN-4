// Test script to test the actual API login endpoint
const request = require('supertest');
const app = require('./server');

async function testApiLogin() {
  try {
    console.log('Testing API login...');
    
    // Test data
    const credentials = {
      email: 'test2@example.com',
      password: 'password123'
    };
    
    // Make login request
    console.log('Making login request...');
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
    
    console.log('Login response:', {
      status: response.status,
      user: response.body.user,
      hasTokens: !!response.body.tokens
    });
    
    console.log('API login successful!');
  } catch (error) {
    console.error('Error during API login test:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  }
}

testApiLogin();