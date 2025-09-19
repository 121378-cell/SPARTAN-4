// Test script to verify environment-based database configuration
const { syncDatabase } = require('./database/models');

console.log('Environment Configuration Test:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set (defaults to development)');
console.log('FORCE_DB_SYNC:', process.env.FORCE_DB_SYNC || 'not set (defaults to false)');

// This would normally be called from server.js during initialization
console.log('Testing database sync configuration...');
syncDatabase().then(success => {
  console.log('Database sync result:', success ? 'Success' : 'Failed');
}).catch(error => {
  console.error('Database sync error:', error);
});