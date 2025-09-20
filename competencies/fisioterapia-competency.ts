// Fisioterapia Competency Module for Chat Maestro

import { CompetencyModule } from '../lib/chat-maestro-scalability-types';

export const FisioterapiaCompetency: CompetencyModule = {
  id: 'fisioterapia_v1',
  name: 'Fisioterapia',
  version: '1.0.0',
  description: 'Injury prevention and rehabilitation protocols for athletes',
  domain: 'health',
  capabilities: [
    'injury_prevention',
    'movement_analysis',
    'pain_management',
    'rehabilitation_planning',
    'biomechanical_assessment'
  ],
  dependencies: [],
  enabled: true,
  priority: 9,
  activationTriggers: [
    /\b(injury|pain|rehabilitat|movement|biomechanics)\b/i,
    /\b(fisio|physical therapy|recovery|knee|shoulder|back)\b/i,
    /\b(form correction|technique adjustment|pain relief)\b/i
  ],
  requiredPermissions: ['health_data_access', 'movement_data_access'],
  metadata: {
    author: 'Medical Team',
    createdAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-15'),
    compatibility: ['chat_maestro_4.x']
  }
};

export default FisioterapiaCompetency;