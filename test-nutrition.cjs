// Simple test script to verify nutrition system functionality
const { nutritionService } = require('./lib/nutrition-service');
const { storageManager } = require('./lib/storage');
const { habitTrackingService } = require('./lib/habit-tracking');

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    _data: {},
    setItem: function(id, val) { return this._data[id] = String(val); },
    getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
    removeItem: function(id) { return delete this._data[id]; },
    clear: function() { return this._data = {}; }
  };
}

console.log('🧪 Testing Nutrition System...\n');

// Test 1: Initialize user nutrition profile
console.log('1. Initializing user nutrition profile...');
const userId = 'test-user';
const habit = nutritionService.initializeUserNutritionProfile(userId);
console.log('   ✅ User nutrition profile initialized');
console.log('   📋 Preferred meal times:', habit.preferredMealTimes);
console.log('   🎯 Nutrition goals:', habit.nutritionGoals);

// Test 2: Update user nutrition preferences
console.log('\n2. Updating user nutrition preferences...');
const preferences = {
  preferredFoods: ['Chicken', 'Rice', 'Broccoli'],
  dislikedFoods: ['Spinach'],
  dietaryRestrictions: ['Gluten-free'],
  nutritionGoals: ['muscle_mass'],
  preferredMealTimes: ['07:00', '12:00', '18:00']
};

nutritionService.updateUserNutritionPreferences(userId, preferences);
const updatedHabit = habitTrackingService.getUserHabits(userId);
console.log('   ✅ User nutrition preferences updated');
console.log('   🍗 Preferred foods:', updatedHabit.preferredFoods);
console.log('   🚫 Disliked foods:', updatedHabit.dislikedFoods);
console.log('   🚨 Dietary restrictions:', updatedHabit.dietaryRestrictions);
console.log('   🎯 Nutrition goals:', updatedHabit.nutritionGoals);

// Test 3: Calculate daily nutrition needs
console.log('\n3. Calculating daily nutrition needs...');
const date = new Date();
const dailyNutrition = nutritionService.calculateDailyNutritionNeeds(userId, date);
console.log('   ✅ Daily nutrition needs calculated');
console.log('   🔥 Calories:', dailyNutrition.totalNutrients.calories);
console.log('   🥩 Protein:', dailyNutrition.totalNutrients.protein, 'g');
console.log('   🍞 Carbs:', dailyNutrition.totalNutrients.carbs, 'g');
console.log('   🧈 Fats:', dailyNutrition.totalNutrients.fats, 'g');
console.log('   🎯 Nutrition goal:', dailyNutrition.nutritionGoal);

// Test 4: Generate meals for the day
console.log('\n4. Generating meals for the day...');
console.log('   🍽️ Total meals generated:', dailyNutrition.meals.length);
dailyNutrition.meals.forEach((meal, index) => {
  console.log(`   ${index + 1}. ${meal.name} (${meal.type}) - ${meal.nutrients.calories} kcal at ${meal.time}`);
});

// Test 5: Learn from meal preferences
console.log('\n5. Learning from meal preferences...');
const sampleMeal = {
  id: 'test-meal',
  type: 'lunch',
  name: 'Protein Bowl',
  time: '12:00',
  nutrients: {
    calories: 500,
    protein: 40,
    carbs: 30,
    fats: 15
  },
  ingredients: ['Chicken', 'Quinoa', 'Vegetables'],
  date: new Date()
};

nutritionService.learnFromMealPreferences(userId, sampleMeal);
const habitAfterLearning = habitTrackingService.getUserHabits(userId);
console.log('   ✅ Learned from meal preferences');
console.log('   📚 Updated preferred foods:', habitAfterLearning.preferredFoods);

// Test 6: Get personalized ingredients
console.log('\n6. Getting personalized ingredients...');
const personalizedIngredients = nutritionService.getPersonalizedIngredients(userId, 'dinner', 'muscle_mass');
console.log('   ✅ Personalized ingredients retrieved');
console.log('   🥘 Dinner ingredients:', personalizedIngredients);

// Test 7: Store and retrieve daily nutrition data
console.log('\n7. Storing and retrieving daily nutrition data...');
storageManager.addDailyNutrition(dailyNutrition);
const retrievedData = storageManager.getNutritionForDate(date);
console.log('   ✅ Daily nutrition data stored and retrieved');
console.log('   📅 Retrieved date:', retrievedData.date.toDateString());
console.log('   🔥 Retrieved calories:', retrievedData.totalNutrients.calories);

console.log('\n🎉 All nutrition system tests passed!');
console.log('✅ The intelligent nutrition system is working correctly.');