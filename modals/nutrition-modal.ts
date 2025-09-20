// Nutrition Modal for Spartan

import { SpartanModal } from '../lib/spartan-modal-types';

export const NutritionModal: SpartanModal = {
  id: 'nutrition_v1',
  name: 'Nutrition Modal',
  version: '1.0.0',
  description: 'Nutrition planning and tracking modal for Spartan',
  category: 'nutrition',
  capabilities: [
    'meal_planning',
    'macro_tracking',
    'supplement_advice',
    'nutrition_analysis',
    'dietary_recommendations'
  ],
  dependencies: [],
  enabled: true,
  priority: 8,
  activationTriggers: [
    /\b(nutrition|diet|macros|calories|protein|carbs|fats)\b/i,
    /\b(meal|food|eating|supplements|diet plan)\b/i,
    /\b(nutrition plan|meal prep|dietary intake)\b/i
  ],
  requiredPermissions: ['nutrition_data_access', 'health_data_access'],
  supportedPlatforms: ['web', 'mobile'],
  metadata: {
    author: 'Nutrition Team',
    createdAt: new Date('2024-01-20'),
    lastUpdated: new Date('2024-01-20'),
    compatibility: ['spartan_4.x'],
    integrationType: 'embedded'
  }
};

export default NutritionModal;