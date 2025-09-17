/**
 * Biomechanical Overload Detection AI System
 * Advanced analysis of training metrics to detect muscle and joint overload patterns
 */

import type { TrainingMetrics, ExercisePerformance } from './adaptiveTrainingSystem';

export interface WearableData {
  recovery: {
    hrv: number;
    recoveryScore: number;
  };
  sleep: {
    quality: number;
  };
}

export interface OverloadRisk {
  bodyPart: string;
  riskLevel: 'bajo' | 'moderado' | 'alto' | 'crítico';
  riskScore: number; // 0-100
  primaryCause: string;
  secondaryCauses: string[];
  adaptationStatus: 'adaptándose' | 'estancado' | 'sobrecargado' | 'en_recuperación';
  timeToInjury: number; // estimated days
  confidenceLevel: number; // 0-100
}

export interface CorrectiveProtocol {
  priority: 'inmediata' | 'alta' | 'media' | 'baja';
  type: 'movilidad' | 'estabilidad' | 'fuerza' | 'control_motor' | 'recuperación';
  targetStructure: string;
  exercises: CorrectiveExerciseAdvanced[];
  expectedTimeline: string;
  biomechanicalGoals: string[];
}

export interface CorrectiveExerciseAdvanced {
  name: string;
  category: 'activación' | 'movilización' | 'estabilización' | 'fortalecimiento' | 'integración';
  description: string;
  biomechanicalPurpose: string;
  targetTissues: string[];
  dosage: {
    sets: number;
    reps: number | string;
    hold?: number;
    rest: number;
    frequency: string;
  };
  equipment: string;
}

export interface LoadManagementStrategy {
  phase: 'descarga' | 'adaptación' | 'progresión' | 'mantenimiento';
  durationWeeks: number;
  loadReduction: number;
  recoveryEnhancement: string[];
  monitoringMarkers: string[];
}

export class BiomechanicalOverloadAI {
  /**
   * Main analysis function that integrates all data sources
   */
  public async analyzeOverloadRisk(
    trainingMetrics: TrainingMetrics[],
    wearableData: WearableData,
    exerciseHistory: ExercisePerformance[]
  ): Promise<{
    overloadRisks: OverloadRisk[];
    correctiveProtocols: CorrectiveProtocol[];
    loadManagement: LoadManagementStrategy;
  }> {
    console.log('🔬 Iniciando análisis biomecánico avanzado...');

    // Detect overload risks
    const overloadRisks = this.detectOverloadRisks(exerciseHistory, wearableData);
    
    // Generate corrective protocols
    const correctiveProtocols = this.generateCorrectiveProtocols(overloadRisks);
    
    // Create load management strategy
    const loadManagement = this.createLoadManagementStrategy(overloadRisks, trainingMetrics);

    return {
      overloadRisks,
      correctiveProtocols,
      loadManagement
    };
  }

  /**
   * Detect overload risks based on exercise data and wearable metrics
   */
  private detectOverloadRisks(
    exerciseHistory: ExercisePerformance[],
    wearableData: WearableData
  ): OverloadRisk[] {
    const risks: OverloadRisk[] = [];
    
    // Analyze each body region
    const bodyRegions = [
      { name: 'hombros', exercises: ['overhead press', 'bench press', 'lateral raise'] },
      { name: 'columna_lumbar', exercises: ['deadlift', 'squat', 'row'] },
      { name: 'caderas', exercises: ['squat', 'deadlift', 'lunge'] },
      { name: 'rodillas', exercises: ['squat', 'lunge', 'leg press'] }
    ];

    for (const region of bodyRegions) {
      const relevantExercises = exerciseHistory.filter(ex => 
        region.exercises.some(regEx => ex.exerciseName.toLowerCase().includes(regEx))
      );

      if (relevantExercises.length > 0) {
        const riskScore = this.calculateRegionalRiskScore(relevantExercises, wearableData);
        
        if (riskScore > 30) {
          const risk: OverloadRisk = {
            bodyPart: region.name,
            riskLevel: this.categorizeRiskLevel(riskScore),
            riskScore,
            primaryCause: this.identifyPrimaryCause(relevantExercises, wearableData),
            secondaryCauses: this.identifySecondaryCauses(relevantExercises),
            adaptationStatus: this.assessAdaptationStatus(wearableData),
            timeToInjury: this.estimateTimeToInjury(riskScore),
            confidenceLevel: 85
          };

          risks.push(risk);
        }
      }
    }

    return risks.sort((a, b) => b.riskScore - a.riskScore);
  }

  /**
   * Calculate risk score for a specific body region
   */
  private calculateRegionalRiskScore(
    exercises: ExercisePerformance[],
    wearableData: WearableData
  ): number {
    let riskScore = 0;

    // High RPE factor (excessive intensity)
    const avgRPE = exercises.reduce((sum, ex) => sum + ex.rpe, 0) / exercises.length;
    if (avgRPE > 8.5) riskScore += 25;
    else if (avgRPE > 7.5) riskScore += 15;

    // Low RIR factor (insufficient reserve)
    const avgRIR = exercises.reduce((sum, ex) => sum + ex.rir, 0) / exercises.length;
    if (avgRIR < 1) riskScore += 25;
    else if (avgRIR < 2) riskScore += 15;

    // Form quality deterioration
    const avgForm = exercises.reduce((sum, ex) => sum + ex.formQuality, 0) / exercises.length;
    if (avgForm < 6) riskScore += 20;
    else if (avgForm < 7) riskScore += 10;

    // Volume progression too rapid
    const volumeIncrease = this.calculateVolumeIncrease(exercises);
    if (volumeIncrease > 20) riskScore += 20;
    else if (volumeIncrease > 10) riskScore += 10;

    // Recovery deficits
    const recoveryScore = wearableData.recovery.recoveryScore;
    if (recoveryScore < 60) riskScore += 20;
    else if (recoveryScore < 70) riskScore += 10;

    // HRV decline
    if (wearableData.recovery.hrv < 45) riskScore += 15;
    else if (wearableData.recovery.hrv < 55) riskScore += 8;

    // Sleep quality impact
    if (wearableData.sleep.quality < 70) riskScore += 15;
    else if (wearableData.sleep.quality < 80) riskScore += 8;

    return Math.min(100, riskScore);
  }

  private calculateVolumeIncrease(exercises: ExercisePerformance[]): number {
    if (exercises.length < 2) return 0;
    
    const firstHalf = exercises.slice(0, Math.floor(exercises.length / 2));
    const secondHalf = exercises.slice(Math.floor(exercises.length / 2));
    
    const firstVolume = firstHalf.reduce((sum, ex) => sum + (ex.actualWeight * ex.completedSets), 0);
    const secondVolume = secondHalf.reduce((sum, ex) => sum + (ex.actualWeight * ex.completedSets), 0);
    
    return ((secondVolume - firstVolume) / firstVolume) * 100;
  }

  private categorizeRiskLevel(score: number): 'bajo' | 'moderado' | 'alto' | 'crítico' {
    if (score >= 80) return 'crítico';
    if (score >= 60) return 'alto';
    if (score >= 40) return 'moderado';
    return 'bajo';
  }

  private identifyPrimaryCause(exercises: ExercisePerformance[], wearableData: WearableData): string {
    const avgRPE = exercises.reduce((sum, ex) => sum + ex.rpe, 0) / exercises.length;
    const avgRIR = exercises.reduce((sum, ex) => sum + ex.rir, 0) / exercises.length;
    const avgForm = exercises.reduce((sum, ex) => sum + ex.formQuality, 0) / exercises.length;
    
    if (avgRPE > 8.5 && avgRIR < 1) return 'Intensidad excesiva y fatiga acumulada';
    if (avgForm < 6) return 'Deterioro de la técnica por sobrecarga';
    if (wearableData.recovery.recoveryScore < 60) return 'Déficit de recuperación sistémica';
    if (this.calculateVolumeIncrease(exercises) > 20) return 'Progresión de volumen demasiado rápida';
    
    return 'Sobrecarga multifactorial';
  }

  private identifySecondaryCauses(exercises: ExercisePerformance[]): string[] {
    const causes: string[] = [];
    
    const inconsistentPerformance = exercises.some((ex, i) => 
      i > 0 && Math.abs(ex.rpe - exercises[i-1].rpe) > 2
    );
    
    if (inconsistentPerformance) causes.push('Variabilidad excesiva en el rendimiento');
    
    const frequentDeload = exercises.filter(ex => ex.actualWeight < ex.plannedWeight).length;
    if (frequentDeload > exercises.length * 0.3) {
      causes.push('Necesidad frecuente de reducir cargas');
    }
    
    return causes;
  }

  private assessAdaptationStatus(wearableData: WearableData): 'adaptándose' | 'estancado' | 'sobrecargado' | 'en_recuperación' {
    const recoveryScore = wearableData.recovery.recoveryScore;
    const hrv = wearableData.recovery.hrv;
    
    if (recoveryScore < 60 && hrv < 45) return 'sobrecargado';
    if (recoveryScore > 85 && hrv > 65) return 'adaptándose';
    if (recoveryScore >= 70 && recoveryScore <= 85) return 'en_recuperación';
    return 'estancado';
  }

  private estimateTimeToInjury(riskScore: number): number {
    if (riskScore >= 90) return 7;
    if (riskScore >= 80) return 14;
    if (riskScore >= 70) return 21;
    if (riskScore >= 60) return 35;
    return 56;
  }

  /**
   * Generate corrective protocols for detected risks
   */
  private generateCorrectiveProtocols(risks: OverloadRisk[]): CorrectiveProtocol[] {
    return risks.map(risk => this.createProtocolForRisk(risk));
  }

  private createProtocolForRisk(risk: OverloadRisk): CorrectiveProtocol {
    const exercises = this.getCorrectiveExercises(risk.bodyPart, risk.riskLevel);
    
    return {
      priority: risk.riskLevel === 'crítico' ? 'inmediata' : 
               risk.riskLevel === 'alto' ? 'alta' : 
               risk.riskLevel === 'moderado' ? 'media' : 'baja',
      type: this.determineProtocolType(risk),
      targetStructure: risk.bodyPart,
      exercises,
      expectedTimeline: this.getExpectedTimeline(risk.riskLevel),
      biomechanicalGoals: this.getBiomechanicalGoals(risk.bodyPart)
    };
  }

  private getCorrectiveExercises(bodyPart: string, riskLevel: string): CorrectiveExerciseAdvanced[] {
    const exerciseDatabase: { [key: string]: CorrectiveExerciseAdvanced[] } = {
      'hombros': [
        {
          name: "Movilización capsular posterior",
          category: "movilización",
          description: "Estiramiento suave de la cápsula posterior del hombro",
          biomechanicalPurpose: "Restaurar flexibilidad capsular y reducir tensión",
          targetTissues: ["cápsula articular", "deltoides posterior"],
          dosage: { sets: 3, reps: "30 seg", hold: 30, rest: 30, frequency: "2x/día" },
          equipment: "toalla o banda"
        },
        {
          name: "Fortalecimiento del manguito rotador",
          category: "fortalecimiento",
          description: "Ejercicios de rotación externa con resistencia",
          biomechanicalPurpose: "Restaurar equilibrio muscular y estabilidad dinámica",
          targetTissues: ["infraespinoso", "redondo menor", "supraespinoso"],
          dosage: { sets: 3, reps: "15", rest: 60, frequency: "día alternos" },
          equipment: "banda elástica"
        }
      ],
      'columna_lumbar': [
        {
          name: "Activación del core profundo",
          category: "activación",
          description: "Respiración diafragmática con activación del transverso",
          biomechanicalPurpose: "Restaurar estabilidad segmentaria lumbar",
          targetTissues: ["transverso del abdomen", "multífidos", "diafragma"],
          dosage: { sets: 3, reps: "10", hold: 10, rest: 45, frequency: "diario" },
          equipment: "ninguno"
        },
        {
          name: "Movilización de caderas",
          category: "movilización",
          description: "Flexión y extensión controlada de caderas",
          biomechanicalPurpose: "Reducir compensación lumbar por rigidez de cadera",
          targetTissues: ["flexores de cadera", "glúteos", "isquiotibiales"],
          dosage: { sets: 2, reps: "15", rest: 30, frequency: "2x/día" },
          equipment: "ninguno"
        }
      ],
      'caderas': [
        {
          name: "Activación del glúteo medio",
          category: "activación",
          description: "Abducción lateral con resistencia",
          biomechanicalPurpose: "Mejorar estabilidad pélvica y control de cadera",
          targetTissues: ["glúteo medio", "glúteo menor"],
          dosage: { sets: 3, reps: "15", rest: 45, frequency: "día alternos" },
          equipment: "banda elástica"
        }
      ],
      'rodillas': [
        {
          name: "Fortalecimiento del glúteo mayor",
          category: "fortalecimiento",
          description: "Puentes de glúteo con progresión",
          biomechanicalPurpose: "Prevenir valgo de rodilla y mejorar control de cadera",
          targetTissues: ["glúteo mayor", "isquiotibiales"],
          dosage: { sets: 3, reps: "15", rest: 45, frequency: "día alternos" },
          equipment: "ninguno"
        },
        {
          name: "Estiramiento del cuádriceps",
          category: "movilización",
          description: "Estiramiento en posición de pie con soporte",
          biomechanicalPurpose: "Reducir tensión anterior y mejorar flexibilidad",
          targetTissues: ["recto femoral", "vasto lateral"],
          dosage: { sets: 3, reps: "30 seg", hold: 30, rest: 30, frequency: "2x/día" },
          equipment: "ninguno"
        }
      ]
    };

    return exerciseDatabase[bodyPart] || [];
  }

  private determineProtocolType(risk: OverloadRisk): 'movilidad' | 'estabilidad' | 'fuerza' | 'control_motor' | 'recuperación' {
    if (risk.primaryCause.includes('técnica') || risk.primaryCause.includes('forma')) return 'control_motor';
    if (risk.primaryCause.includes('recuperación') || risk.primaryCause.includes('fatiga')) return 'recuperación';
    if (risk.primaryCause.includes('intensidad')) return 'estabilidad';
    return 'movilidad';
  }

  private getExpectedTimeline(riskLevel: string): string {
    switch (riskLevel) {
      case 'crítico': return '2-4 semanas para mejora inicial';
      case 'alto': return '3-6 semanas para resolución';
      case 'moderado': return '4-8 semanas para normalización';
      default: return '2-4 semanas para prevención';
    }
  }

  private getBiomechanicalGoals(bodyPart: string): string[] {
    const goals: { [key: string]: string[] } = {
      'hombros': [
        "Restaurar rango de movimiento completo",
        "Mejorar estabilidad escapular",
        "Equilibrar fuerza rotacional"
      ],
      'columna_lumbar': [
        "Optimizar activación del core",
        "Mejorar movilidad de caderas",
        "Reducir compensaciones posturales"
      ],
      'caderas': [
        "Restaurar movilidad en todos los planos",
        "Fortalecer estabilizadores pélvicos",
        "Mejorar control neuromuscular"
      ],
      'rodillas': [
        "Optimizar alineación durante movimientos",
        "Fortalecer cadena posterior",
        "Mejorar control excéntrico"
      ]
    };

    return goals[bodyPart] || ["Optimizar función biomecánica"];
  }

  /**
   * Create load management strategy
   */
  private createLoadManagementStrategy(
    risks: OverloadRisk[],
    trainingMetrics: TrainingMetrics[]
  ): LoadManagementStrategy {
    const maxRisk = Math.max(...risks.map(r => r.riskScore), 0);
    
    let phase: 'descarga' | 'adaptación' | 'progresión' | 'mantenimiento';
    let loadReduction = 0;
    
    if (maxRisk > 80) {
      phase = 'descarga';
      loadReduction = 40;
    } else if (maxRisk > 60) {
      phase = 'adaptación';
      loadReduction = 20;
    } else if (maxRisk > 40) {
      phase = 'mantenimiento';
      loadReduction = 10;
    } else {
      phase = 'progresión';
      loadReduction = 0;
    }

    return {
      phase,
      durationWeeks: this.calculatePhaseDuration(maxRisk),
      loadReduction,
      recoveryEnhancement: this.getRecoveryStrategies(risks),
      monitoringMarkers: this.getMonitoringMarkers()
    };
  }

  private calculatePhaseDuration(maxRisk: number): number {
    if (maxRisk > 80) return 4;
    if (maxRisk > 60) return 6;
    if (maxRisk > 40) return 8;
    return 4;
  }

  private getRecoveryStrategies(risks: OverloadRisk[]): string[] {
    const strategies = [
      "Optimización del sueño (7-9 horas)",
      "Técnicas de manejo del estrés",
      "Nutrición antiinflamatoria",
      "Hidratación adecuada"
    ];

    const highRiskCount = risks.filter(r => r.riskLevel === 'alto' || r.riskLevel === 'crítico').length;
    if (highRiskCount > 0) {
      strategies.push("Terapia de frío/calor", "Masaje terapéutico", "Liberación miofascial");
    }

    return strategies;
  }

  private getMonitoringMarkers(): string[] {
    return [
      "Niveles de dolor (escala 1-10)",
      "Calidad del sueño",
      "Variabilidad de la frecuencia cardíaca",
      "Puntuación RPE en ejercicios",
      "Rango de movimiento articular",
      "Fuerza muscular funcional"
    ];
  }
}