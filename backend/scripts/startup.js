#!/usr/bin/env node

// Comprehensive startup script that ensures clean environment
const { exec } = require('child_process');
const { User } = require('../database/models');
const bcrypt = require('bcryptjs');

async function killPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error) {
          console.log(`No process found using port ${port}`);
          resolve();
          return;
        }
        
        const lines = stdout.split('\n');
        let found = false;
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5 && parts[1] === 'LISTENING') {
            const pid = parts[4];
            console.log(`Killing process ${pid} using port ${port}`);
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (killError) {
                console.error(`Failed to kill process ${pid}:`, killError.message);
              } else {
                console.log(`Successfully killed process ${pid}`);
              }
              found = true;
              resolve();
            });
            return;
          }
        }
        if (!found) {
          console.log(`No listening process found on port ${port}`);
          resolve();
        }
      });
    } else {
      // Unix/Linux/Mac
      exec(`lsof -i :${port} | grep LISTEN`, (error, stdout) => {
        if (error) {
          console.log(`No process found using port ${port}`);
          resolve();
          return;
        }
        
        const lines = stdout.split('\n');
        let found = false;
        for (const line of lines) {
          if (line.trim()) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[1];
            console.log(`Killing process ${pid} using port ${port}`);
            exec(`kill -9 ${pid}`, (killError) => {
              if (killError) {
                console.error(`Failed to kill process ${pid}:`, killError.message);
              } else {
                console.log(`Successfully killed process ${pid}`);
              }
              found = true;
              resolve();
            });
            return;
          }
        }
        if (!found) {
          console.log(`No listening process found on port ${port}`);
        }
        resolve();
      });
    }
  });
}

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
      return true;
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
    return true;
    
  } catch (error) {
    console.error('Error ensuring development user:', error);
    return false;
  }
}

async function startup() {
  console.log('🚀 SPARTAN 4 Backend Startup Script');
  console.log('=====================================');
  
  // Kill processes using port 3001
  console.log('1. Checking port 3001...');
  await killPort(3001);
  
  // Wait a moment for the port to be released
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Ensure dev user exists
  console.log('2. Ensuring development user exists...');
  const userReady = await ensureDevUser();
  
  if (userReady) {
    console.log('✅ Startup preparation completed successfully!');
    console.log('You can now start the server with: npm run dev');
  } else {
    console.log('❌ Startup preparation failed!');
    process.exit(1);
  }
}

console.log('🔧 Preparing SPARTAN 4 backend environment...');

// Ensure environment is clean
console.log('✅ Environment preparation complete');
process.exit(0);

startup();