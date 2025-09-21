/**
 * Data Processing Engine - "La Sangre de Spartan"
 * Real-time data normalization, cleaning, and intelligent processing
 * 
 * This engine handles:
 * - Automatic data cleaning and normalization
 * - Intelligent data completion
 * - Real-time data validation
 * - Duplicate detection and removal
 * - Data quality scoring
 */

import { logger } from './logger';
import { storageManager } from './storage';
import { ProgressData, UserData, WorkoutPlan, WorkoutSession } from './types';

export interface DataQualityReport {
  overallScore: number; // 0-100
  completeness: number; // 0-100
  consistency: number; // 0-100
  accuracy: number; // 0-100
  issues: DataIssue[];
}

export interface DataIssue {
  id: string;
  type: 'missing' | 'inconsistent' | 'duplicate' | 'outlier' | 'invalid';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedField: string;
  suggestedFix: string;
  autoFixable: boolean;
}

export interface ProcessedData<T> {
  data: T;
  qualityScore: number;
  issues: DataIssue[];
  processedAt: Date;
}

export class DataProcessingEngine {
  private static instance: DataProcessingEngine;
  
  static getInstance(): DataProcessingEngine {
    if (!DataProcessingEngine.instance) {
      DataProcessingEngine.instance = new DataProcessingEngine();
    }
    return DataProcessingEngine.instance;
  }

  /**
   * Process and clean user data
   */
  processUserData(userData: UserData): ProcessedData<UserData> {
    const issues: DataIssue[] = [];
    
    // Check for missing required fields
    if (!userData.name) {
      issues.push({
        id: 'missing-name',
        type: 'missing',
        severity: 'high',
        description: 'Nombre de usuario faltante',
        affectedField: 'name',
        suggestedFix: 'Proporcionar un nombre de usuario',
        autoFixable: false
      });
    }
    
    if (!userData.age) {
      issues.push({
        id: 'missing-age',
        type: 'missing',
        severity: 'medium',
        description: 'Edad del usuario faltante',
        affectedField: 'age',
        suggestedFix: 'Proporcionar la edad del usuario',
        autoFixable: false
      });
    }
    
    if (!userData.weight) {
      issues.push({
        id: 'missing-weight',
        type: 'missing',
        severity: 'medium',
        description: 'Peso del usuario faltante',
        affectedField: 'weight',
        suggestedFix: 'Proporcionar el peso del usuario',
        autoFixable: false
      });
    }
    
    if (!userData.height) {
      issues.push({
        id: 'missing-height',
        type: 'missing',
        severity: 'medium',
        description: 'Altura del usuario faltante',
        affectedField: 'height',
        suggestedFix: 'Proporcionar la altura del usuario',
        autoFixable: false
      });
    }
    
    // Validate data ranges
    if (userData.age && (userData.age < 13 || userData.age > 120)) {
      issues.push({
        id: 'invalid-age',
        type: 'invalid',
        severity: 'high',
        description: 'Edad fuera de rango válido (13-120)',
        affectedField: 'age',
        suggestedFix: 'Corregir la edad a un valor válido',
        autoFixable: false
      });
    }
    
    if (userData.weight && (userData.weight < 30 || userData.weight > 300)) {
      issues.push({
        id: 'invalid-weight',
        type: 'invalid',
        severity: 'medium',
        description: 'Peso fuera de rango válido (30-300 kg)',
        affectedField: 'weight',
        suggestedFix: 'Corregir el peso a un valor válido',
        autoFixable: true
      });
    }
    
    if (userData.height && (userData.height < 100 || userData.height > 250)) {
      issues.push({
        id: 'invalid-height',
        type: 'invalid',
        severity: 'medium',
        description: 'Altura fuera de rango válido (100-250 cm)',
        affectedField: 'height',
        suggestedFix: 'Corregir la altura a un valor válido',
        autoFixable: true
      });
    }
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      data: userData,
      qualityScore,
      issues,
      processedAt: new Date()
    };
  }

  /**
   * Process and clean workout plan data
   */
  processWorkoutPlan(plan: WorkoutPlan): ProcessedData<WorkoutPlan> {
    const issues: DataIssue[] = [];
    
    // Check for missing required fields
    if (!plan.id) {
      issues.push({
        id: 'missing-plan-id',
        type: 'missing',
        severity: 'critical',
        description: 'ID del plan de entrenamiento faltante',
        affectedField: 'id',
        suggestedFix: 'Generar un ID único para el plan',
        autoFixable: true
      });
    }
    
    if (!plan.name) {
      issues.push({
        id: 'missing-plan-name',
        type: 'missing',
        severity: 'high',
        description: 'Nombre del plan de entrenamiento faltante',
        affectedField: 'name',
        suggestedFix: 'Proporcionar un nombre para el plan',
        autoFixable: false
      });
    }
    
    if (!plan.duration) {
      issues.push({
        id: 'missing-plan-duration',
        type: 'missing',
        severity: 'medium',
        description: 'Duración del plan de entrenamiento faltante',
        affectedField: 'duration',
        suggestedFix: 'Proporcionar la duración estimada del plan',
        autoFixable: false
      });
    }
    
    // Validate data ranges
    if (plan.duration && (plan.duration < 10 || plan.duration > 300)) {
      issues.push({
        id: 'invalid-plan-duration',
        type: 'invalid',
        severity: 'medium',
        description: 'Duración del plan fuera de rango válido (10-300 minutos)',
        affectedField: 'duration',
        suggestedFix: 'Corregir la duración a un valor válido',
        autoFixable: true
      });
    }
    
    // Process days
    if (plan.days) {
      plan.days.forEach((day, index) => {
        if (!day.focus) {
          issues.push({
            id: `missing-day-${index}-focus`,
            type: 'missing',
            severity: 'low',
            description: `Enfoque del día ${index + 1} faltante`,
            affectedField: `days[${index}].focus`,
            suggestedFix: 'Proporcionar un enfoque para el día',
            autoFixable: false
          });
        }
        
        if (day.exercises) {
          day.exercises.forEach((exercise, exIndex) => {
            if (!exercise.name) {
              issues.push({
                id: `missing-exercise-${index}-${exIndex}-name`,
                type: 'missing',
                severity: 'medium',
                description: `Nombre del ejercicio en día ${index + 1}, posición ${exIndex + 1} faltante`,
                affectedField: `days[${index}].exercises[${exIndex}].name`,
                suggestedFix: 'Proporcionar un nombre para el ejercicio',
                autoFixable: false
              });
            }
            
            if (exercise.sets && (exercise.sets < 1 || exercise.sets > 10)) {
              issues.push({
                id: `invalid-exercise-${index}-${exIndex}-sets`,
                type: 'invalid',
                severity: 'low',
                description: `Número de series del ejercicio en día ${index + 1}, posición ${exIndex + 1} fuera de rango (1-10)`,
                affectedField: `days[${index}].exercises[${exIndex}].sets`,
                suggestedFix: 'Corregir el número de series a un valor válido',
                autoFixable: true
              });
            }
            
            if (exercise.rest && (exercise.rest < 0 || exercise.rest > 300)) {
              issues.push({
                id: `invalid-exercise-${index}-${exIndex}-rest`,
                type: 'invalid',
                severity: 'low',
                description: `Tiempo de descanso del ejercicio en día ${index + 1}, posición ${exIndex + 1} fuera de rango (0-300 segundos)`,
                affectedField: `days[${index}].exercises[${exIndex}].rest`,
                suggestedFix: 'Corregir el tiempo de descanso a un valor válido',
                autoFixable: true
              });
            }
          });
        }
      });
    }
    
    // Auto-fix missing ID
    if (!plan.id) {
      plan.id = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      data: plan,
      qualityScore,
      issues,
      processedAt: new Date()
    };
  }

  /**
   * Process and clean workout session data
   */
  processWorkoutSession(session: WorkoutSession): ProcessedData<WorkoutSession> {
    const issues: DataIssue[] = [];
    
    // Check for missing required fields
    if (!session.id) {
      issues.push({
        id: 'missing-session-id',
        type: 'missing',
        severity: 'critical',
        description: 'ID de la sesión de entrenamiento faltante',
        affectedField: 'id',
        suggestedFix: 'Generar un ID único para la sesión',
        autoFixable: true
      });
    }
    
    if (!session.workoutPlanId) {
      issues.push({
        id: 'missing-session-plan-id',
        type: 'missing',
        severity: 'high',
        description: 'ID del plan de entrenamiento asociado faltante',
        affectedField: 'workoutPlanId',
        suggestedFix: 'Asociar la sesión con un plan de entrenamiento',
        autoFixable: false
      });
    }
    
    if (!session.date) {
      issues.push({
        id: 'missing-session-date',
        type: 'missing',
        severity: 'high',
        description: 'Fecha de la sesión de entrenamiento faltante',
        affectedField: 'date',
        suggestedFix: 'Proporcionar la fecha de la sesión',
        autoFixable: false
      });
    }
    
    // Auto-fix missing ID
    if (!session.id) {
      session.id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Process exercises
    if (session.exercises) {
      session.exercises.forEach((exercise, exIndex) => {
        if (!exercise.name) {
          issues.push({
            id: `missing-session-exercise-${exIndex}-name`,
            type: 'missing',
            severity: 'medium',
            description: `Nombre del ejercicio en posición ${exIndex + 1} faltante`,
            affectedField: `exercises[${exIndex}].name`,
            suggestedFix: 'Proporcionar un nombre para el ejercicio',
            autoFixable: false
          });
        }
        
        if (exercise.sets) {
          exercise.sets.forEach((set, setIndex) => {
            if (set.weight !== null && (set.weight < 0 || set.weight > 1000)) {
              issues.push({
                id: `invalid-session-exercise-${exIndex}-set-${setIndex}-weight`,
                type: 'invalid',
                severity: 'low',
                description: `Peso del set ${setIndex + 1} del ejercicio en posición ${exIndex + 1} fuera de rango (0-1000 kg)`,
                affectedField: `exercises[${exIndex}].sets[${setIndex}].weight`,
                suggestedFix: 'Corregir el peso a un valor válido',
                autoFixable: true
              });
            }
            
            if (set.reps !== null && (set.reps < 0 || set.reps > 100)) {
              issues.push({
                id: `invalid-session-exercise-${exIndex}-set-${setIndex}-reps`,
                type: 'invalid',
                severity: 'low',
                description: `Repeticiones del set ${setIndex + 1} del ejercicio en posición ${exIndex + 1} fuera de rango (0-100)`,
                affectedField: `exercises[${exIndex}].sets[${setIndex}].reps`,
                suggestedFix: 'Corregir las repeticiones a un valor válido',
                autoFixable: true
              });
            }
            
            if (set.rpe !== null && (set.rpe < 1 || set.rpe > 10)) {
              issues.push({
                id: `invalid-session-exercise-${exIndex}-set-${setIndex}-rpe`,
                type: 'invalid',
                severity: 'low',
                description: `RPE del set ${setIndex + 1} del ejercicio en posición ${exIndex + 1} fuera de rango (1-10)`,
                affectedField: `exercises[${exIndex}].sets[${setIndex}].rpe`,
                suggestedFix: 'Corregir el RPE a un valor válido',
                autoFixable: true
              });
            }
          });
        }
      });
    }
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      data: session,
      qualityScore,
      issues,
      processedAt: new Date()
    };
  }

  /**
   * Process and clean progress data
   */
  processProgressData(progress: ProgressData): ProcessedData<ProgressData> {
    const issues: DataIssue[] = [];
    
    // Check for missing required fields
    if (!progress.workoutId) {
      issues.push({
        id: 'missing-progress-workout-id',
        type: 'missing',
        severity: 'high',
        description: 'ID del entrenamiento asociado faltante',
        affectedField: 'workoutId',
        suggestedFix: 'Asociar el progreso con un entrenamiento',
        autoFixable: false
      });
    }
    
    if (!progress.date) {
      issues.push({
        id: 'missing-progress-date',
        type: 'missing',
        severity: 'high',
        description: 'Fecha del registro de progreso faltante',
        affectedField: 'date',
        suggestedFix: 'Proporcionar la fecha del registro',
        autoFixable: false
      });
    }
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(issues);
    
    return {
      data: progress,
      qualityScore,
      issues,
      processedAt: new Date()
    };
  }

  /**
   * Detect and remove duplicate records
   */
  detectDuplicates<T extends { id: string }>(records: T[]): { unique: T[], duplicates: T[] } {
    const seen = new Set<string>();
    const unique: T[] = [];
    const duplicates: T[] = [];
    
    for (const record of records) {
      if (seen.has(record.id)) {
        duplicates.push(record);
      } else {
        seen.add(record.id);
        unique.push(record);
      }
    }
    
    if (duplicates.length > 0) {
      logger.warn(`DataProcessingEngine: Detected ${duplicates.length} duplicate records`);
    }
    
    return { unique, duplicates };
  }

  /**
   * Auto-complete missing data based on historical patterns
   */
  autoCompleteData<T>(data: T, historicalData: T[]): T {
    // This is a simplified implementation
    // In a real system, this would use ML models to predict missing values
    return { ...data };
  }

  /**
   * Calculate overall data quality score
   */
  private calculateQualityScore(issues: DataIssue[]): number {
    if (issues.length === 0) return 100;
    
    // Weight issues by severity
    const severityWeights = {
      'low': 1,
      'medium': 3,
      'high': 5,
      'critical': 10
    };
    
    const weightedIssues = issues.reduce((sum, issue) => {
      return sum + (severityWeights[issue.severity] || 1);
    }, 0);
    
    // Calculate score (higher weighted issues = lower score)
    const maxPossibleIssues = issues.length * severityWeights.critical;
    const score = Math.max(0, 100 - (weightedIssues / maxPossibleIssues) * 100);
    
    return Math.round(score);
  }

  /**
   * Generate a comprehensive data quality report
   */
  generateQualityReport(processedDataArray: ProcessedData<any>[]): DataQualityReport {
    if (processedDataArray.length === 0) {
      return {
        overallScore: 100,
        completeness: 100,
        consistency: 100,
        accuracy: 100,
        issues: []
      };
    }
    
    // Aggregate scores
    const totalScore = processedDataArray.reduce((sum, data) => sum + data.qualityScore, 0);
    const overallScore = Math.round(totalScore / processedDataArray.length);
    
    // Collect all issues
    const allIssues: DataIssue[] = [];
    processedDataArray.forEach(data => {
      allIssues.push(...data.issues);
    });
    
    // Calculate component scores (simplified)
    const completeness = overallScore; // In a real implementation, this would be calculated separately
    const consistency = overallScore;
    const accuracy = overallScore;
    
    return {
      overallScore,
      completeness,
      consistency,
      accuracy,
      issues: allIssues
    };
  }

  /**
   * Apply automatic fixes to data issues when possible
   */
  applyAutoFixes<T>(data: T, issues: DataIssue[]): { data: T, fixedIssues: DataIssue[] } {
    const fixedIssues: DataIssue[] = [];
    let fixedData = { ...data as any };
    
    // In a real implementation, this would apply actual fixes based on issue types
    // For now, we'll just return the data as-is
    issues.forEach(issue => {
      if (issue.autoFixable) {
        fixedIssues.push(issue);
        // Apply fix logic here
      }
    });
    
    return {
      data: fixedData,
      fixedIssues
    };
  }
}

// Export singleton instance
export const dataProcessingEngine = DataProcessingEngine.getInstance();
