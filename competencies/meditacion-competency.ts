// Meditación Competency Module for Chat Maestro

import { CompetencyModule } from '../lib/chat-maestro-scalability-types';

export const MeditacionCompetency: CompetencyModule = {
  id: 'meditacion_v1',
  name: 'Meditación',
  version: '1.0.0',
  description: 'Mindfulness practices and relaxation techniques for athletes',
  domain: 'wellness',
  capabilities: [
    'mindfulness',
    'breathing_techniques',
    'relaxation',
    'stress_reduction',
    'focus_enhancement'
  ],
  dependencies: [],
  enabled: true,
  priority: 7,
  activationTriggers: [
    /\b(meditation|mindfulness|breath|relaxation|calm)\b/i,
    /\b(zen|inner peace|mental clarity|breathing exercise)\b/i,
    /\b(stress relief|anxiety reduction|mindful training)\b/i
  ],
  requiredPermissions: ['wellness_data_access', 'sleep_data_access'],
  metadata: {
    author: 'Wellness Team',
    createdAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-15'),
    compatibility: ['chat_maestro_4.x']
  }
};

export default MeditacionCompetency;