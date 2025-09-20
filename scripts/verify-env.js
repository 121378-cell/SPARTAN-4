#!/usr/bin/env node

// Script to verify frontend environment configuration
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifyEnv() {
  console.log('🔍 Verifying frontend environment configuration...');
  
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Creating default .env file...');
    
    const defaultEnv = `# Supabase Configuration
VITE_SUPABASE_URL=https://dbgksgnfpqndhvhnkhtx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZ2tzZ25mcHFuZGh2aG5raHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNDIwNjUsImV4cCI6MjA3MzYxODA2NX0.YicMzy6BB59xLmh1GUZSOMsWIzqewLQ-lARBkh_3GwE

# Gemini AI Configuration
# Obtén tu API key en: https://aistudio.google.com/apikey
VITE_GEMINI_API_KEY=AIzaSyBdguhscf6hVNxXzaj4nW132TJuGWXIpw8

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Development Configuration
NODE_ENV=development
`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Default .env file created successfully!');
    return true;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const requiredVars = [
    'VITE_API_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_GEMINI_API_KEY'
  ];
  
  let allPresent = true;
  for (const variable of requiredVars) {
    if (!envContent.includes(variable)) {
      console.log(`❌ Missing required environment variable: ${variable}`);
      allPresent = false;
    }
  }
  
  if (allPresent) {
    console.log('✅ All required environment variables are present');
    
    // Check API URL
    if (envContent.includes('VITE_API_URL=http://localhost:3001/api')) {
      console.log('✅ API URL is correctly configured for development');
    } else {
      console.log('⚠️  API URL may not be correctly configured');
      console.log('Expected: VITE_API_URL=http://localhost:3001/api');
    }
  }
  
  return allPresent;
}

verifyEnv();