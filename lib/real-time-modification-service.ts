import { storageManager } from './storage';
import { loadProgressionService } from './load-progression-service';
import type { 
  WorkoutPlan, 
  Exercise, 
  DayPlan, 
  ProgressionAdjustment 
} from './types';

export class RealTimeModificationService {
  private static instance: RealTimeModificationService;
  
  static getInstance(): RealTimeModificationService {
    if (!RealTimeModificationService.instance) {
      RealTimeModificationService.instance = new RealTimeModificationService();
    }
    return RealTimeModificationService.instance;
  }
  
  /**
   * Detects modification requests from user input
   */
  detectModificationRequest(input: string): {
    type: 'exercise_change' | 'load_reduction' | 'load_increase' | 'intensity_change' | 'volume_change' | 'none';
    exerciseName?: string;
    value?: number;
    details?: string;
  } {
    const lowerInput = input.toLowerCase();
    
    // Detect exercise change requests
    if (lowerInput.includes('cambiar') && lowerInput.includes('ejercicio')) {
      // Extract exercise name if possible
      const exerciseMatch = lowerInput.match(/(?:cambiar|reemplazar).*?ejercicio.*?(?:por|con)\s+([a-záéíóúüñ\s]+)/);
      return {
        type: 'exercise_change',
        exerciseName: exerciseMatch ? exerciseMatch[1].trim() : undefined,
        details: 'User requested to change an exercise'
      };
    }
    
    // Detect load reduction requests
    if (lowerInput.includes('reducir') && (lowerInput.includes('carga') || lowerInput.includes('peso'))) {
      const valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'load_reduction',
        value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% reduction
        details: 'User requested to reduce load'
      };
    }
    
    // Detect load increase requests
    if (lowerInput.includes('aumentar') && (lowerInput.includes('carga') || lowerInput.includes('peso'))) {
      const valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'load_increase',
        value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
        details: 'User requested to increase load'
      };
    }
    
    // Detect intensity change requests
    if (lowerInput.includes('intensidad')) {
      if (lowerInput.includes('aumentar') || lowerInput.includes('más') || lowerInput.includes('subir')) {
        const valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
        return {
          type: 'intensity_change',
          value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
          details: 'User requested to increase intensity'
        };
      } else if (lowerInput.includes('reducir') || lowerInput.includes('bajar') || lowerInput.includes('menos')) {
        const valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
        return {
          type: 'intensity_change',
          value: valueMatch ? -parseFloat(valueMatch[1]) : -10, // Default 10% reduction
          details: 'User requested to reduce intensity'
        };
      }
    }
    
    // Detect volume change requests
    if (lowerInput.includes('volumen')) {
      if (lowerInput.includes('aumentar') || lowerInput.includes('más') || lowerInput.includes('subir')) {
        const valueMatch = lowerInput.match(/(?:aumentar|subir|mas|más)\s+(\d+)(?:%|kg|kilos|libras)?/);
        return {
          type: 'volume_change',
          value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% increase
          details: 'User requested to increase volume'
        };
      } else if (lowerInput.includes('reducir') || lowerInput.includes('bajar') || lowerInput.includes('menos')) {
        const valueMatch = lowerInput.match(/(?:reducir|bajar|menos)\s+(\d+)(?:%|kg|kilos|libras)?/);
        return {
          type: 'volume_change',
          value: valueMatch ? -parseFloat(valueMatch[1]) : -15, // Default 15% reduction
          details: 'User requested to reduce volume'
        };
      }
    }
    
    // More flexible detection for intensity and volume changes
    // Detect intensity increase requests
    if ((lowerInput.includes('más') || lowerInput.includes('mas') || lowerInput.includes('aumentar') || lowerInput.includes('subir')) && 
        lowerInput.includes('intensidad')) {
      const valueMatch = lowerInput.match(/(?:más|mas|aumentar|subir).*?intensidad.*?(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'intensity_change',
        value: valueMatch ? parseFloat(valueMatch[1]) : 5, // Default 5% increase
        details: 'User requested to increase intensity'
      };
    }
    
    // Detect intensity decrease requests
    if ((lowerInput.includes('menos') || lowerInput.includes('reducir') || lowerInput.includes('bajar')) && 
        lowerInput.includes('intensidad')) {
      const valueMatch = lowerInput.match(/(?:menos|reducir|bajar).*?intensidad.*?(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'intensity_change',
        value: valueMatch ? -parseFloat(valueMatch[1]) : -10, // Default 10% reduction
        details: 'User requested to reduce intensity'
      };
    }
    
    // Detect volume increase requests
    if ((lowerInput.includes('más') || lowerInput.includes('mas') || lowerInput.includes('aumentar') || lowerInput.includes('subir')) && 
        lowerInput.includes('volumen')) {
      const valueMatch = lowerInput.match(/(?:más|mas|aumentar|subir).*?volumen.*?(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'volume_change',
        value: valueMatch ? parseFloat(valueMatch[1]) : 10, // Default 10% increase
        details: 'User requested to increase volume'
      };
    }
    
    // Detect volume decrease requests
    if ((lowerInput.includes('menos') || lowerInput.includes('reducir') || lowerInput.includes('bajar')) && 
        lowerInput.includes('volumen')) {
      const valueMatch = lowerInput.match(/(?:menos|reducir|bajar).*?volumen.*?(\d+)(?:%|kg|kilos|libras)?/);
      return {
        type: 'volume_change',
        value: valueMatch ? -parseFloat(valueMatch[1]) : -15, // Default 15% reduction
        details: 'User requested to reduce volume'
      };
    }
    
    return { type: 'none' };
  }
  
  /**
   * Modifies a workout plan in real-time while maintaining global coherence
   */
  modifyWorkoutPlan(
    workoutPlan: WorkoutPlan,
    modificationRequest: {
      type: string;
      exerciseName?: string;
      value?: number;
      details?: string;
    },
    context?: any
  ): {
    modifiedPlan: WorkoutPlan;
    adjustments: ProgressionAdjustment[];
    impactAnalysis: {
      affectedExercises: string[];
      ecosystemImpact: string[];
      coherenceMaintained: boolean;
    };
  } {
    // Clone the workout plan to avoid mutating the original
    const modifiedPlan: WorkoutPlan = JSON.parse(JSON.stringify(workoutPlan));
    const adjustments: ProgressionAdjustment[] = [];
    const affectedExercises: string[] = [];
    const ecosystemImpact: string[] = [];
    
    // Apply modifications based on request type
    switch (modificationRequest.type) {
      case 'exercise_change':
        this.applyExerciseChange(modifiedPlan, modificationRequest, affectedExercises, adjustments);
        break;
        
      case 'load_reduction':
        this.applyLoadChange(modifiedPlan, -Math.abs(modificationRequest.value || 10), affectedExercises, adjustments);
        break;
        
      case 'load_increase':
        this.applyLoadChange(modifiedPlan, Math.abs(modificationRequest.value || 5), affectedExercises, adjustments);
        break;
        
      case 'intensity_change':
        this.applyIntensityChange(modifiedPlan, modificationRequest.value || 5, affectedExercises, adjustments);
        break;
        
      case 'volume_change':
        this.applyVolumeChange(modifiedPlan, modificationRequest.value || 10, affectedExercises, adjustments);
        break;
        
      default:
        // No modification needed
        break;
    }
    
    // Analyze ecosystem impact
    this.analyzeEcosystemImpact(modifiedPlan, modificationRequest, ecosystemImpact);
    
    // Ensure global coherence
    const coherenceMaintained = this.ensureGlobalCoherence(modifiedPlan, workoutPlan);
    
    // Update timestamps
    modifiedPlan.updatedAt = new Date();
    
    return {
      modifiedPlan,
      adjustments,
      impactAnalysis: {
        affectedExercises,
        ecosystemImpact,
        coherenceMaintained
      }
    };
  }
  
  /**
   * Applies exercise change modification
   */
  private applyExerciseChange(
    plan: WorkoutPlan,
    request: any,
    affectedExercises: string[],
    adjustments: ProgressionAdjustment[]
  ): void {
    // For now, we'll modify the first exercise as an example
    // In a real implementation, we would identify the specific exercise to change
    if (plan.days.length > 0 && plan.days[0].exercises.length > 0) {
      const firstExercise = plan.days[0].exercises[0];
      const originalName = firstExercise.name;
      
      // Change the exercise name (in a real implementation, we would replace with a suitable alternative)
      firstExercise.name = request.exerciseName || `Variación de ${originalName}`;
      firstExercise.notes = `Modificado en tiempo real: ${request.details || 'Cambio de ejercicio solicitado'}`;
      
      affectedExercises.push(originalName);
      
      adjustments.push({
        exerciseName: originalName,
        adjustmentType: 'volume',
        value: 0, // No numerical change in this case
        reason: `Ejercicio cambiado a ${firstExercise.name}`,
        confidence: 0.9,
        applied: true
      });
    }
  }
  
  /**
   * Applies load change modification
   */
  private applyLoadChange(
    plan: WorkoutPlan,
    percentageChange: number,
    affectedExercises: string[],
    adjustments: ProgressionAdjustment[]
  ): void {
    plan.days.forEach(day => {
      day.exercises.forEach(exercise => {
        // For workout plans, we work with the sets as a number
        // We'll interpret this as a multiplier for load adjustments
        if (exercise.sets) {
          // We can't directly modify sets since it's a number in workout plans
          // Instead, we'll add a note about the adjustment
          affectedExercises.push(exercise.name);
          
          adjustments.push({
            exerciseName: exercise.name,
            adjustmentType: 'weight',
            value: percentageChange,
            reason: percentageChange > 0 
              ? `Aumento de carga solicitado (${percentageChange}%)` 
              : `Reducción de carga solicitada (${Math.abs(percentageChange)}%)`,
            confidence: 0.95,
            applied: true
          });
          
          // Add a note to indicate the change
          if (exercise.notes) {
            exercise.notes += ` | Carga ajustada en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}%`;
          } else {
            exercise.notes = `Carga ajustada en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}%`;
          }
        }
      });
    });
  }
  
  /**
   * Applies intensity change modification
   */
  private applyIntensityChange(
    plan: WorkoutPlan,
    percentageChange: number,
    affectedExercises: string[],
    adjustments: ProgressionAdjustment[]
  ): void {
    // Intensity can be modified by changing weight or reps
    plan.days.forEach(day => {
      day.exercises.forEach(exercise => {
        // For workout plans, we work with the sets as a number
        // We'll interpret this as a multiplier for intensity adjustments
        if (exercise.sets) {
          affectedExercises.push(exercise.name);
          
          adjustments.push({
            exerciseName: exercise.name,
            adjustmentType: 'intensity',
            value: percentageChange,
            reason: percentageChange > 0 
              ? `Aumento de intensidad solicitado (${percentageChange}%)` 
              : `Reducción de intensidad solicitada (${Math.abs(percentageChange)}%)`,
            confidence: 0.9,
            applied: true
          });
          
          // Add a note to indicate the change
          if (exercise.notes) {
            exercise.notes += ` | Intensidad ajustada en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}%`;
          } else {
            exercise.notes = `Intensidad ajustada en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}%`;
          }
        }
      });
    });
  }
  
  /**
   * Applies volume change modification
   */
  private applyVolumeChange(
    plan: WorkoutPlan,
    percentageChange: number,
    affectedExercises: string[],
    adjustments: ProgressionAdjustment[]
  ): void {
    // Volume can be modified by changing sets (number of sets)
    plan.days.forEach(day => {
      day.exercises.forEach(exercise => {
        if (exercise.sets) {
          // Modify the number of sets
          const currentSets = exercise.sets;
          const newSets = Math.max(1, Math.round(currentSets * (1 + percentageChange / 100)));
          
          // Update the sets count
          exercise.sets = newSets;
          
          affectedExercises.push(exercise.name);
          
          adjustments.push({
            exerciseName: exercise.name,
            adjustmentType: 'volume',
            value: percentageChange,
            reason: percentageChange > 0 
              ? `Aumento de volumen solicitado (${percentageChange}%)` 
              : `Reducción de volumen solicitada (${Math.abs(percentageChange)}%)`,
            confidence: 0.85,
            applied: true
          });
          
          // Add a note to indicate the change
          if (exercise.notes) {
            exercise.notes += ` | Volumen ajustado en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}% (${currentSets} → ${newSets} sets)`;
          } else {
            exercise.notes = `Volumen ajustado en tiempo real: ${percentageChange > 0 ? '+' : ''}${percentageChange}% (${currentSets} → ${newSets} sets)`;
          }
        }
      });
    });
  }
  
  /**
   * Analyzes the impact of modifications on the broader ecosystem
   */
  private analyzeEcosystemImpact(
    modifiedPlan: WorkoutPlan,
    modificationRequest: any,
    ecosystemImpact: string[]
  ): void {
    // Analyze impact on progression
    ecosystemImpact.push('Los ajustes de progresión se actualizarán automáticamente basados en las modificaciones.');
    
    // Analyze impact on recovery
    if (['load_increase', 'intensity_change', 'volume_change'].includes(modificationRequest.type) && 
        (modificationRequest.value || 0) > 0) {
      ecosystemImpact.push('El aumento de carga/intensidad/volumen puede requerir más tiempo de recuperación.');
    } else if (['load_reduction', 'intensity_change', 'volume_change'].includes(modificationRequest.type) && 
               (modificationRequest.value || 0) < 0) {
      ecosystemImpact.push('La reducción de carga/intensidad/volumen puede facilitar la recuperación.');
    }
    
    // Analyze impact on nutrition
    if (['load_increase', 'intensity_change', 'volume_change'].includes(modificationRequest.type) && 
        (modificationRequest.value || 0) > 0) {
      ecosystemImpact.push('El aumento de volumen/intensidad puede requerir un mayor aporte calórico.');
    }
    
    // Analyze impact on wearable data interpretation
    ecosystemImpact.push('Las métricas de wearables se reevaluarán en base a las nuevas exigencias.');
  }
  
  /**
   * Ensures global coherence of the modified plan
   */
  private ensureGlobalCoherence(
    modifiedPlan: WorkoutPlan,
    originalPlan: WorkoutPlan
  ): boolean {
    // Check that the plan still has a logical structure
    if (!modifiedPlan.days || modifiedPlan.days.length === 0) {
      return false;
    }
    
    // Check that each day has exercises
    for (const day of modifiedPlan.days) {
      if (!day.exercises || day.exercises.length === 0) {
        return false;
      }
    }
    
    // Check that the plan focus is still coherent
    if (!modifiedPlan.focus || modifiedPlan.focus.length === 0) {
      modifiedPlan.focus = originalPlan.focus;
    }
    
    // Check that equipment requirements are still reasonable
    if (!modifiedPlan.equipment || modifiedPlan.equipment.length === 0) {
      modifiedPlan.equipment = originalPlan.equipment;
    }
    
    // Check that duration is still reasonable
    if (!modifiedPlan.duration || modifiedPlan.duration <= 0) {
      modifiedPlan.duration = originalPlan.duration;
    }
    
    return true;
  }
  
  /**
   * Saves the modified plan and updates related systems
   */
  saveModifiedPlan(
    userId: string,
    originalPlanId: string,
    modifiedPlan: WorkoutPlan,
    adjustments: ProgressionAdjustment[]
  ): void {
    // Save the modified plan
    storageManager.updateWorkoutPlan(originalPlanId, modifiedPlan);
    
    // Save progression adjustments
    adjustments.forEach(adjustment => {
      storageManager.addProgressionPlan({
        exerciseName: adjustment.exerciseName,
        currentWeight: 0, // Would be determined from actual data
        recommendedWeight: 0, // Would be determined from actual data
        nextPhase: 'accumulation', // Would be determined from actual data
        adjustments: [adjustment],
        notes: [`Ajuste en tiempo real aplicado: ${adjustment.reason}`]
      });
    });
    
    // Update any related analytics or tracking
    console.log(`Plan ${originalPlanId} modified for user ${userId}`);
  }
}

export const realTimeModificationService = RealTimeModificationService.getInstance();