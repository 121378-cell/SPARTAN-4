// Advanced Plan Design Modal for Spartan

import { SpartanModal } from '../lib/spartan-modal-types';
import { AdvancedPlanDesignService } from './plan-design-service';

export const PlanDesignModal: SpartanModal = {
  id: 'plan_design_v1',
  name: 'Advanced Plan Design Modal',
  version: '1.0.0',
  description: 'Dynamic, flexible plan generation with tactical calendar and smart card integration',
  category: 'planning',
  capabilities: [
    'plan_generation',
    'periodization',
    'calendar_integration',
    'smart_card_sync',
    'chat_maestro_sync'
  ],
  dependencies: [],
  enabled: true,
  priority: 9,
  activationTriggers: [
    /\b(plan|program|schedule|routine)\b/i,
    /\b(create|design|generate|build).*\b(plan|program)\b/i,
    /\b(workout plan|training program|fitness schedule)\b/i,
    /\b(objective|goal|duration|level)\b/i
  ],
  requiredPermissions: ['plan_data_access', 'calendar_access', 'chat_maestro_sync'],
  supportedPlatforms: ['web', 'mobile', 'desktop'],
  metadata: {
    author: 'Planning Team',
    createdAt: new Date('2024-01-25'),
    lastUpdated: new Date('2024-01-25'),
    compatibility: ['spartan_4.x'],
    integrationType: 'embedded'
  }
};

// Export the service for use in the application
export const planDesignService = new AdvancedPlanDesignService();

export default PlanDesignModal;