/**
 * Demo script for the AI-Powered Personalization Engine
 * This script demonstrates how to use the personalization engine
 * to generate adaptive recommendations, perform injury prevention analysis,
 * and generate dynamic difficulty adjustments.
 */

// Import the AI Personalization Engine
import { aiPersonalizationEngine } from '../lib/ai-personalization-engine.ts';

// Mock user ID for demonstration
const USER_ID = 'demo-user-123';

async function runDemo() {
  console.log('🚀 Starting AI-Powered Personalization Engine Demo');
  console.log('===============================================\n');

  try {
    // Initialize the personalization engine
    console.log('🔧 Initializing personalization engine...');
    await aiPersonalizationEngine.initialize(USER_ID);
    console.log('✅ Personalization engine initialized\n');

    // Generate adaptive workout recommendations
    console.log('📊 Generating adaptive workout recommendations...');
    const recommendations = await aiPersonalizationEngine.generateAdaptiveRecommendations();
    console.log(`✅ Generated ${recommendations.length} recommendations:`);
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec.title} (${rec.type}) - Confidence: ${rec.confidence}%`);
      console.log(`     ${rec.description}\n`);
    });

    // Perform injury prevention analysis
    console.log('🛡️  Performing injury prevention analysis...');
    const injuryRisk = await aiPersonalizationEngine.performInjuryPreventionAnalysis();
    console.log(`✅ Injury risk assessment completed:`);
    console.log(`  Risk Level: ${injuryRisk.riskLevel}`);
    console.log(`  Confidence: ${injuryRisk.confidence}%`);
    console.log(`  Risk Factors: ${injuryRisk.riskFactors.join(', ')}`);
    console.log(`  Preventive Measures:`);
    injuryRisk.preventiveMeasures.forEach((measure, index) => {
      console.log(`    ${index + 1}. ${measure}`);
    });
    console.log();

    // Generate dynamic difficulty adjustments
    console.log('⚙️  Generating dynamic difficulty adjustments...');
    const adjustments = await aiPersonalizationEngine.generateDynamicAdjustments();
    console.log(`✅ Generated ${adjustments.length} dynamic adjustments:`);
    adjustments.forEach((adj, index) => {
      console.log(`  ${index + 1}. ${adj.exerciseId}: Adjust ${adj.parameter} from ${adj.currentValue} to ${adj.newValue}`);
      console.log(`     Reason: ${adj.reason} (Confidence: ${adj.confidence}%, Urgency: ${adj.urgency})\n`);
    });

    // Get all personalized recommendations
    console.log('🎯 Getting all personalized recommendations...');
    const allRecommendations = await aiPersonalizationEngine.getPersonalizedRecommendations();
    console.log(`✅ Retrieved ${allRecommendations.length} total recommendations\n`);

    console.log('🎉 Demo completed successfully!');
    console.log('The AI-Powered Personalization Engine is ready to provide intelligent, adaptive fitness recommendations.');

  } catch (error) {
    console.error('❌ Error during demo execution:', error);
  }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}

export { runDemo };