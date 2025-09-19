import { DoubtResolutionEngine } from './lib/doubt-resolution-engine.js';

// Create a simple test
console.log('Testing Doubt Resolution Engine...');

const doubtResolutionEngine = new DoubtResolutionEngine();

const mockContext = {
  userId: 'test-user',
  currentScreen: 'dashboard',
  userData: {
    name: 'Test User',
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate',
    goals: ['Mejorar fuerza', 'Aumentar masa muscular']
  },
  userHabits: [],
  recentWorkouts: [],
  progressionPlans: [],
};

// Test 1: Ambiguous question
console.log('\n--- Test 1: Ambiguous Question ---');
const ambiguousResponse = doubtResolutionEngine.resolveAmbiguousQuestion('Tengo una duda', mockContext);
console.log('Response:', ambiguousResponse.response);
console.log('Action Items:', ambiguousResponse.actionItems);

// Test 2: Technical question about exercise
console.log('\n--- Test 2: Technical Question (Exercise) ---');
const exerciseResponse = doubtResolutionEngine.resolveTechnicalQuestion('¿Cómo hago una sentadilla?', mockContext);
console.log('Response contains "SENTADILLA":', exerciseResponse.response.includes('SENTADILLA'));
console.log('Response contains "TÉCNICA CORRECTA":', exerciseResponse.response.includes('TÉCNICA CORRECTA'));
console.log('Action Items:', exerciseResponse.actionItems);

// Test 3: Technical question about nutrition
console.log('\n--- Test 3: Technical Question (Nutrition) ---');
const nutritionResponse = doubtResolutionEngine.resolveTechnicalQuestion('¿Cuántas proteínas tiene el pollo?', mockContext);
console.log('Response length:', nutritionResponse.response.length);
console.log('Action Items:', nutritionResponse.actionItems);

// Test 4: Motivational question
console.log('\n--- Test 4: Motivational Question ---');
const motivationalResponse = doubtResolutionEngine.resolveMotivationalQuestion('No tengo ganas de entrenar', mockContext);
console.log('Response length:', motivationalResponse.response.length);
console.log('Action Items:', motivationalResponse.actionItems);

console.log('\n--- Testing Complete ---');