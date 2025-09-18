// Test script to test JWT token generation
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'spartan4-development-secret-key-change-in-production-2024';

function testTokenGeneration() {
  try {
    console.log('Testing JWT token generation...');
    
    const userId = 'test-user-id';
    
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Access token:', accessToken);
    console.log('Refresh token:', refreshToken);
    
    // Test verification
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    console.log('Token generation successful!');
  } catch (error) {
    console.error('Error during token generation test:', error);
  }
}

testTokenGeneration();