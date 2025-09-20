// Recovery Modal for Spartan

import { SpartanModal } from '../lib/spartan-modal-types';

export const RecoveryModal: SpartanModal = {
  id: 'recovery_v1',
  name: 'Recovery Modal',
  version: '1.0.0',
  description: 'Recovery and sleep optimization modal for Spartan',
  category: 'recovery',
  capabilities: [
    'sleep_tracking',
    'recovery_planning',
    'stress_management',
    'fatigue_analysis',
    'recovery_recommendations'
  ],
  dependencies: [],
  enabled: true,
  priority: 7,
  activationTriggers: [
    /\b(recovery|sleep|rest|fatigue|stress|relaxation)\b/i,
    /\b(rest days|recovery plan|sleep quality|stress levels)\b/i,
    /\b(recovery session|sleep tracking|rest period)\b/i
  ],
  requiredPermissions: ['recovery_data_access', 'sleep_data_access', 'wellness_data_access'],
  supportedPlatforms: ['web', 'mobile', 'wearable'],
  metadata: {
    author: 'Recovery Team',
    createdAt: new Date('2024-01-20'),
    lastUpdated: new Date('2024-01-20'),
    compatibility: ['spartan_4.x'],
    integrationType: 'embedded'
  }
};

export default RecoveryModal;