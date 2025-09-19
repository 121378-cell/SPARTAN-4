// Test script to verify login functionality
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./database/models');

const JWT_SECRET = 'spartan4-development-secret-key-change-in-production-2024';

async function testLogin() {
  try {
    console.log('Testing login...');
    
    // Test credentials
    const email = 'testuser@example.com';
    const password = 'TestPass123!';
    
    // Get user from database
    console.log('Getting user from database...');
    const dbUser = await User.findOne({ where: { email } });
    
    if (!dbUser) {
      console.log('User not found');
      return;
    }
    
    console.log('User found:', dbUser.email);
    
    // Check password
    console.log('Checking password...');
    const validPassword = await bcrypt.compare(password, dbUser.password);
    
    if (!validPassword) {
      console.log('Invalid password');
      return;
    }
    
    console.log('Password valid!');
    
    // Update last login
    await dbUser.update({ lastLogin: new Date() });
    console.log('Last login updated');
    
    // Generate tokens
    console.log('Generating tokens...');
    const userId = dbUser.id.toString();
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
    
    const tokens = { accessToken, refreshToken, expiresIn: 900 };
    console.log('Tokens generated successfully!');
    
    console.log('Login test successful!');
    console.log('Access Token:', accessToken);
    
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testLogin();