// Simple test to verify the Spartan Nervous System is working
console.log('Testing Spartan Nervous System...');

// Import the nervous system
import { spartanNervousSystem } from './lib/spartan-nervous-system.js';

// Test event emission and handling
console.log('Testing event emission...');

// Subscribe to events
spartanNervousSystem.subscribe('data_updated', (event) => {
  console.log('Received data_updated event:', event);
});

spartanNervousSystem.subscribe('user_action', (event) => {
  console.log('Received user_action event:', event);
});

// Emit test events
spartanNervousSystem.emitEvent({
  type: 'data_updated',
  timestamp: new Date(),
  userId: 'test-user-123',
  payload: {
    testData: 'This is a test data update'
  },
  sourceModule: 'TestScript',
  priority: 'medium'
});

spartanNervousSystem.emitEvent({
  type: 'user_action',
  timestamp: new Date(),
  userId: 'test-user-123',
  payload: {
    actionType: 'test_action',
    details: 'This is a test user action'
  },
  sourceModule: 'TestScript',
  priority: 'high'
});

console.log('Testing alert system...');
// Test alerts
const alerts = spartanNervousSystem.getAlerts();
console.log('Current alerts:', alerts.length);

console.log('Testing recommendations...');
// Test recommendations
const recommendations = spartanNervousSystem.getRecommendations();
console.log('Current recommendations:', recommendations.length);

console.log('Testing proactive actions...');
// Test proactive actions
const proactiveActions = spartanNervousSystem.getProactiveActions();
console.log('Current proactive actions:', proactiveActions.length);

console.log('Spartan Nervous System test completed successfully!');