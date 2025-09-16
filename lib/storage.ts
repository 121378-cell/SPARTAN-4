// Sistema de persistencia de datos
import type { UserData, WorkoutPlan, ProgressData, Recipe, BloodTestAnalysis, OverloadData, CorrectiveExercise } from './types';

// Claves para localStorage
const STORAGE_KEYS = {
  USER_DATA: 'spartan4_user_data',
  WORKOUT_PLANS: 'spartan4_workout_plans',
  PROGRESS_DATA: 'spartan4_progress_data',
  RECIPES: 'spartan4_recipes',
  BLOOD_ANALYSES: 'spartan4_blood_analyses',
  OVERLOAD_DATA: 'spartan4_overload_data',
  CORRECTIVE_EXERCISES: 'spartan4_corrective_exercises',
  SETTINGS: 'spartan4_settings'
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
      return item ? JSON.parse(item) : defaultValue;
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
}

// Exportar instancia singleton
export const storageManager = StorageManager.getInstance();

// Hook personalizado para usar el storage en React
export function useStorage() {
  return storageManager;
}

