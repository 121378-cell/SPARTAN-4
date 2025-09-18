// Test script to directly test registration functionality
const bcrypt = require('bcryptjs');
const { User } = require('./database/models');

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    // Test data
    const name = 'Test User';
    const email = 'test2@example.com';
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
    
    // Create user
    console.log('Creating user...');
    const dbUser = await User.create({
      username: name,
      email,
      password: hashedPassword,
    });
    
    console.log('User created successfully:', dbUser.toJSON());
  } catch (error) {
    console.error('Error during registration test:', error);
  }
}

testRegistration();