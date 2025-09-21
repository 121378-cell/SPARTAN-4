// Servicio del Modal de Historial y Progreso

import { ProgressTrackingEngine } from './progress-engine';
import {
  ProgressMetric,
  ProgressChartConfig,
  ProgressVisualization,
  BodyCompositionData,
  StrengthMetrics,
  EnduranceMetrics,
  AdherenceMetrics,
  RecoveryMetrics,
  TacticalCalendarIntegration,
  ProgressProjection,
  ComparativeAnalysis,
  ChatMaestroExplanation,
  ProgressAlert,
  ProgressReportConfig,
  ProgressReport
} from './progress-types';

// Definir interfaces locales
interface UserPreferences {
  equipmentAvailable: string[];
  preferredGripTypes: string[];
  injuryPrecautions: string[];
  motivationTriggers: string[];
  feedbackPreferences: {
    formCorrection: 'subtle' | 'direct' | 'encouraging';
    motivation: 'competitive' | 'supportive' | 'neutral';
    safety: 'conservative' | 'balanced' | 'aggressive';
  };
}

interface UserContext {
  currentEnergyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  nutritionStatus: 'poor' | 'fair' | 'good' | 'excellent';
  timeAvailable: number; // in minutes
  environment: 'gym' | 'home' | 'outdoor' | 'travel';
}

export class ProgressTrackingService {
  private engine: ProgressTrackingEngine;

  constructor(userPreferences: UserPreferences, userContext: UserContext) {
    this.engine = new ProgressTrackingEngine(userPreferences, userContext);
  }

  /**
   * Obtiene todas las métricas de progreso del usuario
   */
  public getProgressMetrics(): ProgressMetric[] {
    return this.engine.getProgressMetrics();
  }

  /**
   * Genera una visualización de progreso basada en la configuración proporcionada
   */
  public generateProgressVisualization(config: ProgressChartConfig): ProgressVisualization {
    return this.engine.generateProgressVisualization(config);
  }

  /**
   * Obtiene el historial de composición corporal
   */
  public getBodyCompositionHistory(): BodyCompositionData[] {
    return this.engine.getBodyCompositionHistory();
  }

  /**
   * Obtiene las métricas de fuerza
   */
  public getStrengthMetrics(): Record<string, StrengthMetrics> {
    return this.engine.getStrengthMetrics();
  }

  /**
   * Obtiene las métricas de resistencia
   */
  public getEnduranceMetrics(): EnduranceMetrics[] {
    return this.engine.getEnduranceMetrics();
  }

  /**
   * Obtiene las métricas de adherencia
   */
  public getAdherenceMetrics(): AdherenceMetrics[] {
    return this.engine.getAdherenceMetrics();
  }

  /**
   * Obtiene las métricas de recuperación
   */
  public getRecoveryMetrics(): RecoveryMetrics[] {
    return this.engine.getRecoveryMetrics();
  }

  /**
   * Obtiene la integración con el calendario táctico
   */
  public getCalendarIntegration(): TacticalCalendarIntegration | null {
    return this.engine.getCalendarIntegration();
  }

  /**
   * Genera proyecciones de progreso futuro
   */
  public generateProjections(): ProgressProjection[] {
    return this.engine.generateProjections();
  }

  /**
   * Genera análisis comparativos
   */
  public generateComparativeAnalysis(): ComparativeAnalysis[] {
    return this.engine.generateComparativeAnalysis();
  }

  /**
   * Genera una explicación de Chat Maestro para una métrica específica
   */
  public generateChatMaestroExplanation(metricId: string): ChatMaestroExplanation {
    return this.engine.generateChatMaestroExplanation(metricId);
  }

  /**
   * Verifica si hay alertas de progreso
   */
  public checkForAlerts(): ProgressAlert[] {
    return this.engine.checkForAlerts();
  }

  /**
   * Genera un informe de progreso completo
   */
  public generateProgressReport(config: ProgressReportConfig): ProgressReport {
    return this.engine.generateProgressReport(config);
  }

  /**
   * Marca una alerta como resuelta
   */
  public resolveAlert(alertId: string, notes?: string): void {
    this.engine.resolveAlert(alertId, notes);
  }

  /**
   * Actualiza las preferencias del usuario
   */
  public updateUserPreferences(preferences: UserPreferences): void {
    // En una implementación real, esto crearía una nueva instancia del motor
    // con las nuevas preferencias o actualizaría el motor existente
    console.log('User preferences updated:', preferences);
  }

  /**
   * Actualiza el contexto del usuario
   */
  public updateUserContext(context: UserContext): void {
    // En una implementación real, esto crearía una nueva instancia del motor
    // con el nuevo contexto o actualizaría el motor existente
    console.log('User context updated:', context);
  }
}