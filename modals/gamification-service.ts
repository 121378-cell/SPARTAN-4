// Servicio del Modal de Gamificación y Retos

import { GamificationModal } from './gamification-modal';
import { GamificationConfig } from './gamification-types';

// Definir interfaces locales ya que no están disponibles en ../lib/types
interface UserContext {
  currentEnergyLevel: number; // 1-10
  stressLevel: number; // 1-10
  sleepQuality: number; // 1-10
  nutritionStatus: 'poor' | 'fair' | 'good' | 'excellent';
  timeAvailable: number; // in minutes
  environment: 'gym' | 'home' | 'outdoor' | 'travel';
}

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

export class GamificationService {
  private modal: GamificationModal | null = null;
  private isInitialized: boolean = false;

  // Inicializar el servicio de gamificación
  public async initialize(
    userPreferences: UserPreferences,
    userContext: UserContext,
    config: GamificationConfig
  ): Promise<void> {
    try {
      this.modal = new GamificationModal(userPreferences, userContext, config);
      this.isInitialized = true;
      console.log('Servicio de Gamificación inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el servicio de gamificación:', error);
      throw error;
    }
  }

  // Verificar si el servicio está inicializado
  public isServiceInitialized(): boolean {
    return this.isInitialized && this.modal !== null;
  }

  // Mostrar el modal de gamificación
  public showGamificationModal(): void {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.show();
  }

  // Ocultar el modal de gamificación
  public hideGamificationModal(): void {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.hide();
  }

  // Obtener datos para la vista del modal
  public getModalViewData(): any {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.getViewData();
  }

  // Actualizar preferencias del usuario
  public async updateUserPreferences(preferences: any): Promise<void> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.updateUserPreferences(preferences);
  }

  // Actualizar contexto del usuario
  public async updateUserContext(context: any): Promise<void> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.updateUserContext(context);
  }

  // Crear un nuevo desafío
  public async createChallenge(challengeData: any): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.createChallenge(challengeData);
  }

  // Actualizar progreso de un desafío
  public async updateChallengeProgress(challengeId: string, progress: number): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.updateChallengeProgress(challengeId, progress);
  }

  // Desbloquear un logro
  public async unlockAchievement(achievementId: string): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.unlockAchievement(achievementId);
  }

  // Unirse a un desafío grupal
  public async joinGroupChallenge(groupId: string): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.joinGroupChallenge(groupId);
  }

  // Actualizar progreso de un desafío grupal
  public async updateGroupChallengeProgress(groupId: string, progress: number): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.updateGroupChallengeProgress(groupId, progress);
  }

  // Marcar notificación como leída
  public async markNotificationAsRead(notificationId: string): Promise<void> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.markNotificationAsRead(notificationId);
  }

  // Obtener configuración
  public async getConfig(): Promise<any> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    return this.modal.getConfig();
  }

  // Actualizar configuración
  public async updateConfig(config: any): Promise<void> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    this.modal.updateConfig(config);
  }

  // Sincronizar con el plan táctico
  public async syncWithTacticalPlan(tacticalPlan: any): Promise<void> {
    if (!this.isInitialized || !this.modal) {
      throw new Error('El servicio de gamificación no está inicializado');
    }
    
    // Esta función sincronizaría los desafíos con el plan táctico
    // En una implementación real, crearía desafíos basados en los objetivos del plan
    console.log('Sincronizando gamificación con plan táctico:', tacticalPlan);
    
    // Ejemplo de cómo se podrían crear desafíos basados en el plan táctico
    // const challenges = this.generateChallengesFromTacticalPlan(tacticalPlan);
    // for (const challenge of challenges) {
    //   await this.createChallenge(challenge);
    // }
  }

  // Generar desafíos basados en el plan táctico
  private generateChallengesFromTacticalPlan(tacticalPlan: any): any[] {
    // Esta función generaría desafíos personalizados basados en el plan táctico
    // Por ahora, retornamos un array vacío
    return [];
  }

  // Integración con Chat Maestro
  public async explainWithChatMaestro(topic: string): Promise<string> {
    // Esta función se integraría con Chat Maestro para explicar aspectos de la gamificación
    // Por ahora, retornamos una explicación de ejemplo
    const explanations: Record<string, string> = {
      'challenge-progress': 'Estás haciendo un gran trabajo con tus desafíos. Mantén el ritmo y verás grandes mejoras.',
      'achievement-unlock': 'Has desbloqueado un nuevo logro. Esto muestra tu progreso y dedicación.',
      'leaderboard-position': 'Tu posición en el ranking refleja tu constancia. Sigue así para mejorarla.',
      'streak-maintenance': 'Mantener una racha demuestra disciplina. ¡Sigue sumando días!'
    };
    
    return explanations[topic] || 'La gamificación es una herramienta poderosa para mantener la motivación alta en tu entrenamiento.';
  }
}