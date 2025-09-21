// Definición del Modal de Gamificación y Retos

import { GamificationEngine } from './gamification-engine';
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

export class GamificationModal {
  private engine: GamificationEngine;
  private isVisible: boolean = false;

  constructor(userPreferences: UserPreferences, userContext: UserContext, config: GamificationConfig) {
    this.engine = new GamificationEngine(userPreferences, userContext, config);
  }

  // Mostrar el modal
  public show(): void {
    this.isVisible = true;
    this.render();
  }

  // Ocultar el modal
  public hide(): void {
    this.isVisible = false;
    this.destroy();
  }

  // Renderizar el contenido del modal
  private render(): void {
    if (!this.isVisible) return;

    // En una implementación real, esto crearía la interfaz de usuario
    // Por ahora, solo registramos en consola que el modal se mostraría
    console.log('Mostrando Modal de Gamificación y Retos');
    console.log('Perfil de usuario:', this.engine.getUserProfile());
    console.log('Desafíos activos:', this.engine.getActiveChallenges());
    console.log('Logros desbloqueados:', this.engine.getUnlockedAchievements());
  }

  // Destruir el modal
  private destroy(): void {
    // En una implementación real, esto limpiaría la interfaz de usuario
    console.log('Ocultando Modal de Gamificación y Retos');
  }

  // Obtener datos para la interfaz de usuario
  public getViewData() {
    return {
      profile: this.engine.getUserProfile(),
      activeChallenges: this.engine.getActiveChallenges(),
      availableChallenges: this.engine.getAvailableChallenges(),
      completedChallenges: this.engine.getCompletedChallenges(),
      unlockedAchievements: this.engine.getUnlockedAchievements(),
      lockedAchievements: this.engine.getLockedAchievements(),
      activeLeaderboards: this.engine.getActiveLeaderboards(),
      activeEvents: this.engine.getActiveEvents(),
      activeGroupChallenges: this.engine.getActiveGroupChallenges(),
      unreadNotifications: this.engine.getUnreadNotifications(),
      analytics: this.engine.getGamificationAnalytics()
    };
  }

  // Actualizar preferencias del usuario
  public updateUserPreferences(preferences: any): void {
    this.engine.updateUserPreferences(preferences);
  }

  // Actualizar contexto del usuario
  public updateUserContext(context: any): void {
    this.engine.updateUserContext(context);
  }

  // Crear un nuevo desafío
  public createChallenge(challengeData: any) {
    return this.engine.createChallenge(challengeData);
  }

  // Actualizar progreso de un desafío
  public updateChallengeProgress(challengeId: string, progress: number) {
    return this.engine.updateChallengeProgress(challengeId, progress);
  }

  // Desbloquear un logro
  public unlockAchievement(achievementId: string) {
    return this.engine.unlockAchievement(achievementId);
  }

  // Unirse a un desafío grupal
  public joinGroupChallenge(groupId: string) {
    return this.engine.joinGroupChallenge(groupId);
  }

  // Actualizar progreso de un desafío grupal
  public updateGroupChallengeProgress(groupId: string, progress: number) {
    return this.engine.updateGroupChallengeProgress(groupId, progress);
  }

  // Marcar notificación como leída
  public markNotificationAsRead(notificationId: string): void {
    this.engine.markNotificationAsRead(notificationId);
  }

  // Obtener configuración
  public getConfig() {
    return this.engine.getConfig();
  }

  // Actualizar configuración
  public updateConfig(config: any): void {
    this.engine.updateConfig(config);
  }
}