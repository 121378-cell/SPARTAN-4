// Script to create a development user for testing
const bcrypt = require('bcryptjs');
const { User } = require('./database/models');

const JWT_SECRET = 'spartan4-development-secret-key-change-in-production-2024';

async function createDevUser() {
  try {
    console.log('Creating development user...');
    
    // Fixed test credentials
    const name = 'Test User Dev';
    const email = 'testuser@example.com';
    const password = 'TestPass123!';
    
    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log('User already exists, deleting...');
      await User.destroy({ where: { email } });
      console.log('Existing user deleted');
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
    
    console.log('Development user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', dbUser.id);
    
  } catch (error) {
    console.error('Error creating development user:', error);
  }
}

createDevUser();