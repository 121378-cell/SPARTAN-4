// Definición del Modal de Historial y Progreso

import { SpartanModal } from '../lib/spartan-modal-types';
import { ProgressReportConfig } from './progress-types';

export const progressTrackingModal: SpartanModal = {
  id: 'progress-tracking',
  name: 'Historial y Progreso',
  version: '1.0.0',
  description: 'Visualización avanzada de métricas de progreso con análisis predictivo',
  category: 'analytics',
  capabilities: [
    'progress-visualizations',
    'predictive-analytics',
    'comparative-analysis',
    'chat-maestro-explanations',
    'calendar-integration'
  ],
  dependencies: ['chat-maestro', 'tactical-calendar', 'wearable-integration'],
  enabled: true,
  priority: 8,
  activationTriggers: [
    /progres(o|ar)/i,
    /hist(o|ó)ric(o|a)/i,
    /rendimient(o|os)/i,
    /métric(a|as)/i
  ],
  requiredPermissions: ['read:progress', 'read:workouts', 'read:body-composition'],
  supportedPlatforms: ['web', 'mobile', 'desktop'],
  metadata: {
    author: 'SPARTAN Team',
    createdAt: new Date(),
    lastUpdated: new Date(),
    compatibility: ['4.0.0'],
    integrationType: 'embedded'
  }
};