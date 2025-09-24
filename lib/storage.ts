// Sistema de persistencia de datos
import type { 
  UserData, 
  WorkoutPlan, 
  ProgressData, 
  Recipe, 
  BloodTestAnalysis, 
  OverloadData, 
  CorrectiveExercise,
  WorkoutSession,
  UserHabit,
  DailyNutrition,
  Meal,
  RecoveryMetric,
  RecoveryAnalysis,
  LoadProgressionMetric,
  ProgressionHistory,
  ProgressionPlan,
  NeurofeedbackProtocol,
  NeuralInterfaceDevice
} from './types';

// Claves para localStorage
const STORAGE_KEYS = {
  USER_DATA: 'spartan4_user_data',
  WORKOUT_PLANS: 'spartan4_workout_plans',
  PROGRESS_DATA: 'spartan4_progress_data',
  RECIPES: 'spartan4_recipes',
  BLOOD_ANALYSES: 'spartan4_blood_analyses',
  OVERLOAD_DATA: 'spartan4_overload_data',
  CORRECTIVE_EXERCISES: 'spartan4_corrective_exercises',
  WORKOUT_SESSIONS: 'spartan4_workout_sessions',
  USER_HABITS: 'spartan4_user_habits',
  SETTINGS: 'spartan4_settings',
  DAILY_NUTRITION: 'spartan4_daily_nutrition',
  MEAL_PREFERENCES: 'spartan4_meal_preferences',
  RECOVERY_METRICS: 'spartan4_recovery_metrics',
  RECOVERY_ANALYSES: 'spartan4_recovery_analyses',
  PROGRESSION_METRICS: 'spartan4_progression_metrics',
  PROGRESSION_HISTORY: 'spartan4_progression_history',
  PROGRESSION_PLANS: 'spartan4_progression_plans',
  NEUROFEEDBACK_PROTOCOLS: 'spartan4_neurofeedback_protocols',
  NEURAL_INTERFACE_DEVICES: 'spartan4_neural_interface_devices',
  ENVIRONMENTAL_DATA: 'spartan4_environmental_data',
  ENHANCED_WEARABLE_DATA: 'spartan4_enhanced_wearable_data',
  EXTERNAL_LIFE_VARIABLES: 'spartan4_external_life_variables'
} as const;

// Tipos para configuración
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  notifications: {
    workoutReminders: boolean;
    nutritionTips: boolean;
    progressUpdates: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

// Clase para manejar el almacenamiento
export class StorageManager {
  private static instance: StorageManager;
  
  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }
  
  // Métodos genéricos para localStorage
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      // Custom reviver to convert date strings back to Date objects
      const reviver = (key: string, value: any) => {
        // Check if the value looks like an ISO date string
        if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
          const date = new Date(value);
          // Check if it's a valid date
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
        return value;
      };
      
      return JSON.parse(item, reviver);
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return defaultValue;
    }
  }
  
  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }
  
  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key ${key}:`, error);
    }
  }
  
  // Métodos específicos para cada tipo de dato
  
  // UserData
  getUserData(): UserData | null {
    return this.getItem(STORAGE_KEYS.USER_DATA, null);
  }
  
  setUserData(userData: UserData): void {
    this.setItem(STORAGE_KEYS.USER_DATA, userData);
  }
  
  clearUserData(): void {
    this.removeItem(STORAGE_KEYS.USER_DATA);
  }
  
  // WorkoutPlans
  getWorkoutPlans(): WorkoutPlan[] {
    return this.getItem(STORAGE_KEYS.WORKOUT_PLANS, []);
  }
  
  setWorkoutPlans(plans: WorkoutPlan[]): void {
    this.setItem(STORAGE_KEYS.WORKOUT_PLANS, plans);
  }
  
  addWorkoutPlan(plan: WorkoutPlan): void {
    const plans = this.getWorkoutPlans();
    plans.unshift(plan); // Añadir al principio
    this.setWorkoutPlans(plans);
  }
  
  updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>): void {
    const plans = this.getWorkoutPlans();
    const index = plans.findIndex(plan => plan.id === id);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates, updatedAt: new Date() };
      this.setWorkoutPlans(plans);
    }
  }
  
  deleteWorkoutPlan(id: string): void {
    const plans = this.getWorkoutPlans().filter(plan => plan.id !== id);
    this.setWorkoutPlans(plans);
  }
  
  // ProgressData
  getProgressData(): ProgressData[] {
    return this.getItem(STORAGE_KEYS.PROGRESS_DATA, []);
  }
  
  setProgressData(progress: ProgressData[]): void {
    this.setItem(STORAGE_KEYS.PROGRESS_DATA, progress);
  }
  
  addProgressData(progress: ProgressData): void {
    const data = this.getProgressData();
    data.unshift(progress);
    this.setProgressData(data);
  }
  
  // Recipes
  getRecipes(): Recipe[] {
    return this.getItem(STORAGE_KEYS.RECIPES, []);
  }
  
  setRecipes(recipes: Recipe[]): void {
    this.setItem(STORAGE_KEYS.RECIPES, recipes);
  }
  
  addRecipe(recipe: Recipe): void {
    const recipes = this.getRecipes();
    recipes.unshift(recipe);
    this.setRecipes(recipes);
  }
  
  // BloodTestAnalyses
  getBloodAnalyses(): BloodTestAnalysis[] {
    return this.getItem(STORAGE_KEYS.BLOOD_ANALYSES, []);
  }
  
  setBloodAnalyses(analyses: BloodTestAnalysis[]): void {
    this.setItem(STORAGE_KEYS.BLOOD_ANALYSES, analyses);
  }
  
  addBloodAnalysis(analysis: BloodTestAnalysis): void {
    const analyses = this.getBloodAnalyses();
    analyses.unshift(analysis);
    this.setBloodAnalyses(analyses);
  }
  
  // OverloadData
  getOverloadData(): OverloadData[] {
    return this.getItem(STORAGE_KEYS.OVERLOAD_DATA, []);
  }
  
  setOverloadData(data: OverloadData[]): void {
    this.setItem(STORAGE_KEYS.OVERLOAD_DATA, data);
  }
  
  addOverloadData(data: OverloadData): void {
    const existing = this.getOverloadData();
    existing.push(data);
    this.setOverloadData(existing);
  }
  
  // CorrectiveExercises
  getCorrectiveExercises(): CorrectiveExercise[] {
    return this.getItem(STORAGE_KEYS.CORRECTIVE_EXERCISES, []);
  }
  
  setCorrectiveExercises(exercises: CorrectiveExercise[]): void {
    this.setItem(STORAGE_KEYS.CORRECTIVE_EXERCISES, exercises);
  }
  
  addCorrectiveExercise(exercise: CorrectiveExercise): void {
    const exercises = this.getCorrectiveExercises();
    exercises.push(exercise);
    this.setCorrectiveExercises(exercises);
  }
  
  // Workout Sessions
  getWorkoutSessions(): WorkoutSession[] {
    return this.getItem(STORAGE_KEYS.WORKOUT_SESSIONS, []);
  }
  
  setWorkoutSessions(sessions: WorkoutSession[]): void {
    this.setItem(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
  }
  
  addWorkoutSession(session: WorkoutSession): void {
    const sessions = this.getWorkoutSessions();
    sessions.unshift(session);
    this.setWorkoutSessions(sessions);
  }
  
  // User Habits
  getUserHabits(): UserHabit[] {
    return this.getItem(STORAGE_KEYS.USER_HABITS, []);
  }
  
  setUserHabits(habits: UserHabit[]): void {
    this.setItem(STORAGE_KEYS.USER_HABITS, habits);
  }
  
  addUserHabit(habit: UserHabit): void {
    const habits = this.getUserHabits();
    habits.push(habit);
    this.setUserHabits(habits);
  }
  
  // Daily Nutrition
  getDailyNutrition(): DailyNutrition[] {
    return this.getItem(STORAGE_KEYS.DAILY_NUTRITION, []);
  }
  
  setDailyNutrition(nutrition: DailyNutrition[]): void {
    this.setItem(STORAGE_KEYS.DAILY_NUTRITION, nutrition);
  }
  
  addDailyNutrition(nutrition: DailyNutrition): void {
    const dailyNutrition = this.getDailyNutrition();
    dailyNutrition.unshift(nutrition);
    this.setDailyNutrition(dailyNutrition);
  }
  
  // Get nutrition for a specific date
  getNutritionForDate(date: Date): DailyNutrition | undefined {
    const dailyNutrition = this.getDailyNutrition();
    const dateStr = date.toISOString().split('T')[0];
    return dailyNutrition.find(n => {
      // Handle both Date objects and date strings
      const nutritionDateStr = n.date instanceof Date 
        ? n.date.toISOString().split('T')[0] 
        : new Date(n.date).toISOString().split('T')[0];
      return nutritionDateStr === dateStr;
    });
  }
  
  // Settings
  getSettings(): AppSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, {
      theme: 'system',
      language: 'es',
      notifications: {
        workoutReminders: true,
        nutritionTips: true,
        progressUpdates: true
      },
      privacy: {
        dataSharing: false,
        analytics: true
      }
    });
  }
  
  // Meal Preferences
  getMealPreferences(userId: string): Record<string, { count: number; ingredients: string[]; times: string[] }> {
    return this.getItem(`meal_preferences_${userId}`, {});
  }
  
  setMealPreferences(userId: string, preferences: Record<string, { count: number; ingredients: string[]; times: string[] }>): void {
    this.setItem(`meal_preferences_${userId}`, preferences);
  }
  
  setSettings(settings: AppSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }
  
  updateSettings(updates: Partial<AppSettings>): void {
    const current = this.getSettings();
    this.setSettings({ ...current, ...updates });
  }
  
  // Métodos de utilidad
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }
  
  exportData(): string {
    const data = {
      userData: this.getUserData(),
      workoutPlans: this.getWorkoutPlans(),
      progressData: this.getProgressData(),
      recipes: this.getRecipes(),
      bloodAnalyses: this.getBloodAnalyses(),
      overloadData: this.getOverloadData(),
      correctiveExercises: this.getCorrectiveExercises(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userData) this.setUserData(data.userData);
      if (data.workoutPlans) this.setWorkoutPlans(data.workoutPlans);
      if (data.progressData) this.setProgressData(data.progressData);
      if (data.recipes) this.setRecipes(data.recipes);
      if (data.bloodAnalyses) this.setBloodAnalyses(data.bloodAnalyses);
      if (data.overloadData) this.setOverloadData(data.overloadData);
      if (data.correctiveExercises) this.setCorrectiveExercises(data.correctiveExercises);
      if (data.settings) this.setSettings(data.settings);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
  
  // Métodos de sincronización (para futuras implementaciones con backend)
  async syncWithBackend(): Promise<boolean> {
    // TODO: Implementar sincronización con backend
    console.log('Sync with backend not implemented yet');
    return false;
  }
  
  async backupToCloud(): Promise<boolean> {
    // TODO: Implementar backup a la nube
    console.log('Cloud backup not implemented yet');
    return false;
  }

  // Recovery Metrics
  getRecoveryMetrics(): RecoveryMetric[] {
    return this.getItem(STORAGE_KEYS.RECOVERY_METRICS, []);
  }
  
  setRecoveryMetrics(metrics: RecoveryMetric[]): void {
    this.setItem(STORAGE_KEYS.RECOVERY_METRICS, metrics);
  }
  
  addRecoveryMetric(metric: RecoveryMetric): void {
    const metrics = this.getRecoveryMetrics();
    metrics.unshift(metric);
    this.setRecoveryMetrics(metrics);
  }
  
  // Get recovery metrics for a specific date
  getRecoveryMetricsForDate(date: Date): RecoveryMetric | undefined {
    const metrics = this.getRecoveryMetrics();
    const dateStr = date.toISOString().split('T')[0];
    return metrics.find(m => {
      // Handle both Date objects and date strings
      const metricDateStr = m.date instanceof Date 
        ? m.date.toISOString().split('T')[0] 
        : new Date(m.date).toISOString().split('T')[0];
      return metricDateStr === dateStr;
    });
  }
  
  // Recovery Analyses
  getRecoveryAnalyses(): RecoveryAnalysis[] {
    return this.getItem(STORAGE_KEYS.RECOVERY_ANALYSES, []);
  }
  
  setRecoveryAnalyses(analyses: RecoveryAnalysis[]): void {
    this.setItem(STORAGE_KEYS.RECOVERY_ANALYSES, analyses);
  }
  
  addRecoveryAnalysis(analysis: RecoveryAnalysis): void {
    const analyses = this.getRecoveryAnalyses();
    analyses.unshift(analysis);
    this.setRecoveryAnalyses(analyses);
  }
  
  // Get recovery analysis for a specific date
  getRecoveryAnalysisForDate(date: Date): RecoveryAnalysis | undefined {
    const analyses = this.getRecoveryAnalyses();
    const dateStr = date.toISOString().split('T')[0];
    return analyses.find(a => {
      // Handle both Date objects and date strings
      const analysisDateStr = a.date instanceof Date 
        ? a.date.toISOString().split('T')[0] 
        : new Date(a.date).toISOString().split('T')[0];
      return analysisDateStr === dateStr;
    });
  }
  
  // Load Progression Metrics
  getProgressionMetrics(): LoadProgressionMetric[] {
    return this.getItem(STORAGE_KEYS.PROGRESSION_METRICS, []);
  }
  
  setProgressionMetrics(metrics: LoadProgressionMetric[]): void {
    this.setItem(STORAGE_KEYS.PROGRESSION_METRICS, metrics);
  }
  
  addProgressionMetric(metric: LoadProgressionMetric): void {
    const metrics = this.getProgressionMetrics();
    metrics.unshift(metric);
    this.setProgressionMetrics(metrics);
  }
  
  // Load Progression History
  getProgressionHistory(): ProgressionHistory[] {
    return this.getItem(STORAGE_KEYS.PROGRESSION_HISTORY, []);
  }
  
  setProgressionHistory(history: ProgressionHistory[]): void {
    this.setItem(STORAGE_KEYS.PROGRESSION_HISTORY, history);
  }
  
  addProgressionHistory(history: ProgressionHistory): void {
    const historyItems = this.getProgressionHistory();
    historyItems.unshift(history);
    this.setProgressionHistory(historyItems);
  }
  
  // Load Progression Plans
  getProgressionPlans(): ProgressionPlan[] {
    return this.getItem(STORAGE_KEYS.PROGRESSION_PLANS, []);
  }
  
  setProgressionPlans(plans: ProgressionPlan[]): void {
    this.setItem(STORAGE_KEYS.PROGRESSION_PLANS, plans);
  }
  
  addProgressionPlan(plan: ProgressionPlan): void {
    const plans = this.getProgressionPlans();
    plans.unshift(plan);
    this.setProgressionPlans(plans);
  }
  
  // Neurofeedback Protocols
  getNeurofeedbackProtocols(): NeurofeedbackProtocol[] {
    return this.getItem(STORAGE_KEYS.NEUROFEEDBACK_PROTOCOLS, []);
  }
  
  setNeurofeedbackProtocols(protocols: NeurofeedbackProtocol[]): void {
    this.setItem(STORAGE_KEYS.NEUROFEEDBACK_PROTOCOLS, protocols);
  }
  
  addNeurofeedbackProtocol(protocol: NeurofeedbackProtocol): void {
    const protocols = this.getNeurofeedbackProtocols();
    protocols.unshift(protocol);
    this.setNeurofeedbackProtocols(protocols);
  }
  
  // Neural Interface Devices
  getNeuralInterfaceDevices(): NeuralInterfaceDevice[] {
    return this.getItem(STORAGE_KEYS.NEURAL_INTERFACE_DEVICES, []);
  }
  
  setNeuralInterfaceDevices(devices: NeuralInterfaceDevice[]): void {
    this.setItem(STORAGE_KEYS.NEURAL_INTERFACE_DEVICES, devices);
  }
  
  addNeuralInterfaceDevice(device: NeuralInterfaceDevice): void {
    const devices = this.getNeuralInterfaceDevices();
    devices.unshift(device);
    this.setNeuralInterfaceDevices(devices);
  }
  
  // Environmental Data
  getEnvironmentalData(): any {
    return this.getItem(STORAGE_KEYS.ENVIRONMENTAL_DATA, null);
  }
  
  setEnvironmentalData(data: any): void {
    this.setItem(STORAGE_KEYS.ENVIRONMENTAL_DATA, data);
  }
  
  // Enhanced Wearable Data
  getEnhancedWearableData(): any {
    return this.getItem(STORAGE_KEYS.ENHANCED_WEARABLE_DATA, null);
  }

  setEnhancedWearableData(data: any): void {
    this.setItem(STORAGE_KEYS.ENHANCED_WEARABLE_DATA, data);
  }
  
  // External Life Variables
  getExternalLifeVariables(): any {
    return this.getItem(STORAGE_KEYS.EXTERNAL_LIFE_VARIABLES, null);
  }

  setExternalLifeVariables(data: any): void {
    this.setItem(STORAGE_KEYS.EXTERNAL_LIFE_VARIABLES, data);
  }
}

// Exportar instancia singleton
export const storageManager = StorageManager.getInstance();

// Hook personalizado para usar el storage en React
export function useStorage() {
  return storageManager;
}
