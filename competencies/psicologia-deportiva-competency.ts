// Psicología Deportiva Competency Module for Chat Maestro

import { CompetencyModule } from '../lib/chat-maestro-scalability-types';

export const PsicologiaDeportivaCompetency: CompetencyModule = {
  id: 'psicologia_deportiva_v1',
  name: 'Psicología Deportiva',
  version: '1.0.0',
  description: 'Mental performance enhancement techniques for athletes',
  domain: 'psychology',
  capabilities: [
    'mental_performance',
    'stress_management',
    'goal_setting',
    'competition_preparation',
    'confidence_building'
  ],
  dependencies: [],
  enabled: true,
  priority: 8,
  activationTriggers: [
    /\b(mind|mental|focus|concentration|stress|anxiety|confidence)\b/i,
    /\b(psychology|mental coach|sport psychology|competition|goal)\b/i,
    /\b(motivation|performance anxiety|mental block|visualization)\b/i
  ],
  requiredPermissions: ['psychological_data_access', 'performance_data_access'],
  metadata: {
    author: 'Psychology Team',
    createdAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-15'),
    compatibility: ['chat_maestro_4.x']
  }
};

export default PsicologiaDeportivaCompetency;