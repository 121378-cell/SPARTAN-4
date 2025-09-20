// Training Modal for Spartan

import { SpartanModal } from '../lib/spartan-modal-types';

export const TrainingModal: SpartanModal = {
  id: 'training_v1',
  name: 'Training Modal',
  version: '1.0.0',
  description: 'Workout planning and execution modal for Spartan',
  category: 'training',
  capabilities: [
    'workout_planning',
    'exercise_demonstration',
    'form_correction',
    'progressive_overload',
    'workout_tracking'
  ],
  dependencies: [],
  enabled: true,
  priority: 9,
  activationTriggers: [
    /\b(workout|exercise|training|routine|plan)\b/i,
    /\b(lift|squats|deadlifts|bench press|pull-ups)\b/i,
    /\b(workout plan|training session|exercise routine)\b/i
  ],
  requiredPermissions: ['workout_data_access', 'progress_data_access'],
  supportedPlatforms: ['web', 'mobile', 'desktop'],
  metadata: {
    author: 'Training Team',
    createdAt: new Date('2024-01-20'),
    lastUpdated: new Date('2024-01-20'),
    compatibility: ['spartan_4.x'],
    integrationType: 'embedded'
  }
};

export default TrainingModal;