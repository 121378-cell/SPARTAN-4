#!/usr/bin/env node

// Script to ensure the development user exists in the database
const bcrypt = require('bcryptjs');
const { User } = require('../database/models');

async function ensureDevUser() {
  try {
    console.log('Ensuring development user exists...');
    
    // Fixed test credentials
    const name = 'Test User Dev';
    const email = 'testuser@example.com';
    const password = 'TestPass123!';
    
    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log('Development user already exists');
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
    
    console.log('Development user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', dbUser.id);
    
  } catch (error) {
    console.error('Error ensuring development user:', error);
  }
}

ensureDevUser();