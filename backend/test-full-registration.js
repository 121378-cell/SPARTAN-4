// Test script to test full registration functionality
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./database/models');

const JWT_SECRET = 'spartan4-development-secret-key-change-in-production-2024';

async function testFullRegistration() {
  try {
    console.log('Testing full registration...');
    
    // Test data with unique username
    const name = 'Test User ' + Date.now(); // Add timestamp to make it unique
    const email = 'test' + Date.now() + '@example.com'; // Add timestamp to make it unique
    const password = 'password123';
    
    // Check if user exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ where: { email } });
    console.log('Existing user:', existingUser);
    
    if (existingUser) {
      console.log('User already exists');
      return;
    }
    
    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');
    
    // Create user in database
    console.log('Creating user in database...');
    const dbUser = await User.create({
      username: name,
      email,
      password: hashedPassword,
    });
    console.log('Database user created:', dbUser.toJSON());
    
    // Create user object
    console.log('Creating user object...');
    const user = {
      id: dbUser.id.toString(),
      name: dbUser.username,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
      lastLogin: null
    };
    console.log('User object created:', user);
    
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
    console.log('Tokens generated:', tokens);
    
    // Create response object
    console.log('Creating response object...');
    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      tokens
    };
    console.log('Response object created:', response);
    
    console.log('Full registration test successful!');
  } catch (error) {
    console.error('Error during full registration test:', error);
  }
}

testFullRegistration();