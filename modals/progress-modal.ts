// Progress Tracking Modal for Spartan

import { SpartanModal } from '../lib/spartan-modal-types';

export const ProgressModal: SpartanModal = {
  id: 'progress_v1',
  name: 'Progress Tracking Modal',
  version: '1.0.0',
  description: 'Progress visualization and analysis modal for Spartan',
  category: 'progress',
  capabilities: [
    'progress_visualization',
    'trend_analysis',
    'goal_tracking',
    'performance_benchmarking',
    'achievement_recognition'
  ],
  dependencies: [],
  enabled: true,
  priority: 8,
  activationTriggers: [
    /\b(progress|stats|metrics|performance|achievements)\b/i,
    /\b(trends|improvements|gains|results)\b/i,
    /\b(progress report|performance dashboard|achievement tracking)\b/i
  ],
  requiredPermissions: ['progress_data_access', 'performance_data_access'],
  supportedPlatforms: ['web', 'mobile', 'desktop'],
  metadata: {
    author: 'Analytics Team',
    createdAt: new Date('2024-01-20'),
    lastUpdated: new Date('2024-01-20'),
    compatibility: ['spartan_4.x'],
    integrationType: 'embedded'
  }
};

export default ProgressModal;