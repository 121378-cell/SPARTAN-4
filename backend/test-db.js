const { User } = require('./database/models');
const bcrypt = require('bcryptjs');

async function testUserCreation() {
  try {
    console.log('Testing user creation...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Password hashed:', hashedPassword);
    
    // Create user
    const user = await User.create({
      username: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    });
    
    console.log('User created successfully:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

testUserCreation();