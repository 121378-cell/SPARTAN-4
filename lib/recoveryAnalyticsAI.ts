/**
 * Recovery Analytics AI - Sistema experto en recuperación y regeneración
 * Análisis científico avanzado para optimización de recuperación
 */

import { scientificAI } from './scientificAI';
import type { UserData } from './types';

export interface RecoveryProfile {
  sleepData: {
    averageHours: number;
    efficiency: number; // percentage
    deepSleepPercentage: number;
    remSleepPercentage: number;
    wakeUpFeelingRested: boolean;
    sleepConsistency: number; // 0-100 score
  };
  physiologicalMarkers: {
    restingHeartRate: number;
    heartRateVariability: number; // RMSSD
    bodyTemperature: number;
    bloodPressure: { systolic: number; diastolic: number; };
    hydrationStatus: 'optimal' | 'adequate' | 'dehydrated';
  };
  biochemicalMarkers: {
    cortisol: number; // morning cortisol
    testosterone?: number;
    creatineKinase: number; // muscle damage marker
    lactateDehydrogenase: number;
    crp: number; // inflammation
  };
  subjective: {
    perceivedRecovery: number; // 1-10 scale
    energyLevel: number; // 1-10 scale
    motivation: number; // 1-10 scale
    mood: number; // 1-10 scale
    muscleSymptoms: 'none' | 'mild' | 'moderate' | 'severe';
  };
  lifestyle: {
    stressLevel: number; // 1-10 scale
    nutritionQuality: number; // 1-10 scale
    hydrationAdequacy: number; // 1-10 scale
    environmentalFactors: string[];
  };
}

export interface RecoveryRecommendation {
  id: string;
  category: 'sleep' | 'nutrition' | 'active-recovery' | 'passive-recovery' | 'lifestyle' | 'supplementation';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  title: string;
  recommendation: string;
  protocol: string;
  expectedBenefit: string;
  timeToEffect: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  monitoring: string[];
  contraindications?: string[];
}

export interface RecoveryProtocol {
  id: string;
  name: string;
  type: 'immediate' | 'daily' | 'weekly' | 'periodic';
  duration: string;
  interventions: RecoveryIntervention[];
  expectedOutcomes: string[];
  successMetrics: string[];
}

export interface RecoveryIntervention {
  name: string;
  timing: string;
  duration: string;
  intensity?: string;
  instructions: string[];
  scienceBased: string;
}

export interface RecoveryAnalysis {
  overallScore: number; // 0-100
  criticalAreas: string[];
  strengths: string[];
  recommendations: RecoveryRecommendation[];
  protocols: RecoveryProtocol[];
  readinessToTrain: 'optimal' | 'good' | 'caution' | 'rest';
  projectedRecoveryTime: string;
}

export class RecoveryAnalyticsAI {
  private recoveryScience: Map<string, any> = new Map();
  private interventionLibrary: Map<string, RecoveryIntervention> = new Map();

  constructor() {
    this.initializeRecoveryScience();
    this.buildInterventionLibrary();
  }

  private initializeRecoveryScience(): void {
    const scienceBase = [
      {
        topic: 'sleep_optimization',
        protocols: {
          sleep_hygiene: {
            bedtime_consistency: 'Same time ±30min daily',
            room_temperature: '18-20°C optimal',
            light_exposure: 'Darkness 1h before bed',
            screen_cutoff: '2h before sleep'
          },
          sleep_enhancement: {
            magnesium: '200-400mg before bed',
            melatonin: '0.5-3mg 30min before bed',
            glycine: '3g for improved sleep quality',
            chamomile: 'Tea or 400mg extract'
          }
        },
        evidence_level: 'A'
      },
      {
        topic: 'hrv_optimization',
        protocols: {
          hrv_training: {
            breathing_exercises: '4-7-8 technique daily',
            meditation: '10-20min mindfulness',
            cold_exposure: '2-3min cold shower',
            nature_exposure: '20min outdoors daily'
          }
        },
        evidence_level: 'B'
      },
      {
        topic: 'muscle_recovery',
        protocols: {
          protein_synthesis: {
            post_workout_protein: '20-40g within 2h',
            casein_bedtime: '20-30g slow protein',
            leucine_threshold: '2.5g per meal',
            total_daily: '1.6-2.2g/kg bodyweight'
          },
          inflammation_control: {
            omega3: '2-3g EPA/DHA daily',
            curcumin: '500mg with piperine',
            tart_cherry: '240ml juice or extract',
            timing: 'Post-workout and before bed'
          }
        },
        evidence_level: 'A'
      }
    ];

    scienceBase.forEach(science => {
      this.recoveryScience.set(science.topic, science);
    });
  }

  private buildInterventionLibrary(): void {
    const interventions: RecoveryIntervention[] = [
      {
        name: 'Protocolo de Sueño Optimizado',
        timing: 'Nocturno',
        duration: '7-9 horas',
        instructions: [
          'Mantener temperatura de 18-20°C',
          'Oscuridad completa (cortinas blackout)',
          'Silencio o ruido blanco suave',
          'Dispositivos electrónicos fuera del dormitorio',
          'Rutina pre-sueño de 30-60 minutos'
        ],
        scienceBased: 'Optimización circadiana basada en cronobiología (Walker, 2024)'
      },
      {
        name: 'Respiración 4-7-8 para HRV',
        timing: 'Antes de dormir',
        duration: '5-10 minutos',
        instructions: [
          'Inhalar por 4 segundos por la nariz',
          'Retener el aire por 7 segundos',
          'Exhalar por 8 segundos por la boca',
          'Repetir 4-8 ciclos',
          'Practicar en posición cómoda'
        ],
        scienceBased: 'Activación del sistema parasimpático para mejora de HRV (Russo et al., 2024)'
      },
      {
        name: 'Exposición al Frío Controlada',
        timing: 'Mañana o post-entrenamiento',
        duration: '2-5 minutos',
        intensity: '10-15°C',
        instructions: [
          'Ducha fría gradual (empezar templada)',
          'Respiración controlada durante exposición',
          'Enfoque en relajación mental',
          'Incrementar duración gradualmente',
          'Finalizar con calentamiento natural'
        ],
        scienceBased: 'Activación de hormesis y mejora de recuperación (Shevchuk, 2024)'
      },
      {
        name: 'Protocolo de Hidratación Activa',
        timing: 'Durante todo el día',
        duration: 'Continuo',
        instructions: [
          'Agua al despertar (500ml)',
          'Pre-entreno: 500ml 2h antes',
          'Durante entreno: 150-250ml cada 15-20min',
          'Post-entreno: 150% del peso perdido',
          'Electrolitos si sudoración >1L'
        ],
        scienceBased: 'Optimización de volumen plasmático y función celular (Ganio et al., 2024)'
      },
      {
        name: 'Masaje de Recuperación',
        timing: 'Post-entrenamiento o antes de dormir',
        duration: '15-30 minutos',
        intensity: 'Moderada',
        instructions: [
          'Foam rolling de grandes grupos musculares',
          'Masaje suave con aceites esenciales',
          'Énfasis en áreas de mayor tensión',
          'Movimientos lentos y controlados',
          'Combinar con respiración profunda'
        ],
        scienceBased: 'Mejora del flujo sanguíneo y reducción de tensión muscular (Pearcey et al., 2024)'
      }
    ];

    interventions.forEach(intervention => {
      this.interventionLibrary.set(intervention.name, intervention);
    });
  }

  /**
   * Analiza el estado de recuperación y genera recomendaciones
   */
  public async analyzeRecoveryStatus(
    userData: UserData,
    recoveryProfile: RecoveryProfile
  ): Promise<RecoveryAnalysis> {
    console.log('🔄 Analizando estado de recuperación...');

    const overallScore = this.calculateRecoveryScore(recoveryProfile);
    const criticalAreas = this.identifyCriticalAreas(recoveryProfile);
    const strengths = this.identifyRecoveryStrengths(recoveryProfile);
    const recommendations = this.generateRecoveryRecommendations(userData, recoveryProfile);
    const protocols = this.createRecoveryProtocols(recoveryProfile, criticalAreas);
    const readinessToTrain = this.assessTrainingReadiness(recoveryProfile);
    const projectedRecoveryTime = this.estimateRecoveryTime(recoveryProfile);

    return {
      overallScore,
      criticalAreas,
      strengths,
      recommendations,
      protocols,
      readinessToTrain,
      projectedRecoveryTime
    };
  }

  private calculateRecoveryScore(profile: RecoveryProfile): number {
    const weights = {
      sleep: 0.30,
      physiological: 0.25,
      biochemical: 0.20,
      subjective: 0.15,
      lifestyle: 0.10
    };

    const sleepScore = this.calculateSleepScore(profile.sleepData);
    const physioScore = this.calculatePhysiologicalScore(profile.physiologicalMarkers);
    const biochemScore = this.calculateBiochemicalScore(profile.biochemicalMarkers);
    const subjectiveScore = this.calculateSubjectiveScore(profile.subjective);
    const lifestyleScore = this.calculateLifestyleScore(profile.lifestyle);

    const totalScore = (
      sleepScore * weights.sleep +
      physioScore * weights.physiological +
      biochemScore * weights.biochemical +
      subjectiveScore * weights.subjective +
      lifestyleScore * weights.lifestyle
    );

    return Math.round(totalScore);
  }

  private calculateSleepScore(sleepData: RecoveryProfile['sleepData']): number {
    let score = 0;

    // Duración del sueño (0-25 puntos)
    if (sleepData.averageHours >= 7 && sleepData.averageHours <= 9) {
      score += 25;
    } else if (sleepData.averageHours >= 6 && sleepData.averageHours < 7) {
      score += 15;
    } else if (sleepData.averageHours >= 5 && sleepData.averageHours < 6) {
      score += 5;
    }

    // Eficiencia del sueño (0-25 puntos)
    score += (sleepData.efficiency / 100) * 25;

    // Sueño profundo (0-20 puntos)
    if (sleepData.deepSleepPercentage >= 15) {
      score += 20;
    } else if (sleepData.deepSleepPercentage >= 10) {
      score += 15;
    } else {
      score += 5;
    }

    // Consistencia (0-15 puntos)
    score += (sleepData.sleepConsistency / 100) * 15;

    // Sensación de descanso (0-15 puntos)
    score += sleepData.wakeUpFeelingRested ? 15 : 0;

    return Math.min(score, 100);
  }

  private calculatePhysiologicalScore(markers: RecoveryProfile['physiologicalMarkers']): number {
    let score = 50; // Base score

    // HRV (mayor es mejor)
    if (markers.heartRateVariability >= 50) {
      score += 20;
    } else if (markers.heartRateVariability >= 30) {
      score += 10;
    } else if (markers.heartRateVariability < 20) {
      score -= 15;
    }

    // RHR (lower is generally better for recovery)
    if (markers.restingHeartRate <= 60) {
      score += 15;
    } else if (markers.restingHeartRate >= 80) {
      score -= 10;
    }

    // Hidratación
    switch (markers.hydrationStatus) {
      case 'optimal':
        score += 15;
        break;
      case 'adequate':
        score += 5;
        break;
      case 'dehydrated':
        score -= 20;
        break;
    }

    return Math.max(0, Math.min(score, 100));
  }

  private calculateBiochemicalScore(markers: RecoveryProfile['biochemicalMarkers']): number {
    let score = 50; // Base score

    // Cortisol (should be in normal range)
    if (markers.cortisol >= 250 && markers.cortisol <= 700) {
      score += 20;
    } else {
      score -= 15;
    }

    // CK (lower is better - indicates less muscle damage)
    if (markers.creatineKinase < 200) {
      score += 15;
    } else if (markers.creatineKinase > 500) {
      score -= 20;
    }

    // CRP (lower is better - less inflammation)
    if (markers.crp < 1) {
      score += 15;
    } else if (markers.crp > 3) {
      score -= 20;
    }

    return Math.max(0, Math.min(score, 100));
  }

  private calculateSubjectiveScore(subjective: RecoveryProfile['subjective']): number {
    const avgScore = (
      subjective.perceivedRecovery +
      subjective.energyLevel +
      subjective.motivation +
      subjective.mood
    ) / 4;

    let score = (avgScore / 10) * 80; // Base on average subjective scores

    // Adjust for muscle symptoms
    switch (subjective.muscleSymptoms) {
      case 'none':
        score += 20;
        break;
      case 'mild':
        score += 10;
        break;
      case 'moderate':
        score -= 10;
        break;
      case 'severe':
        score -= 30;
        break;
    }

    return Math.max(0, Math.min(score, 100));
  }

  private calculateLifestyleScore(lifestyle: RecoveryProfile['lifestyle']): number {
    const stressScore = (10 - lifestyle.stressLevel) * 10; // Invert stress (lower is better)
    const nutritionScore = lifestyle.nutritionQuality * 10;
    const hydrationScore = lifestyle.hydrationAdequacy * 10;

    const avgScore = (stressScore + nutritionScore + hydrationScore) / 3;

    // Adjust for environmental factors
    const negativeFactors = lifestyle.environmentalFactors.filter(factor =>
      factor.includes('pollution') || factor.includes('noise') || factor.includes('stress')
    ).length;

    return Math.max(0, avgScore - (negativeFactors * 5));
  }

  private identifyCriticalAreas(profile: RecoveryProfile): string[] {
    const critical: string[] = [];

    if (profile.sleepData.averageHours < 6) {
      critical.push('Duración insuficiente del sueño');
    }

    if (profile.sleepData.efficiency < 80) {
      critical.push('Eficiencia del sueño subóptima');
    }

    if (profile.physiologicalMarkers.heartRateVariability < 20) {
      critical.push('HRV muy baja - estrés elevado');
    }

    if (profile.biochemicalMarkers.creatineKinase > 500) {
      critical.push('Elevado daño muscular');
    }

    if (profile.biochemicalMarkers.crp > 3) {
      critical.push('Inflamación sistémica elevada');
    }

    if (profile.subjective.perceivedRecovery <= 4) {
      critical.push('Percepción de recuperación muy baja');
    }

    if (profile.lifestyle.stressLevel >= 8) {
      critical.push('Nivel de estrés crítico');
    }

    return critical;
  }

  private identifyRecoveryStrengths(profile: RecoveryProfile): string[] {
    const strengths: string[] = [];

    if (profile.sleepData.averageHours >= 7.5 && profile.sleepData.efficiency >= 90) {
      strengths.push('Excelente calidad del sueño');
    }

    if (profile.physiologicalMarkers.heartRateVariability >= 50) {
      strengths.push('HRV óptima - buen balance autonómico');
    }

    if (profile.biochemicalMarkers.crp < 1) {
      strengths.push('Inflamación mínima');
    }

    if (profile.subjective.perceivedRecovery >= 8) {
      strengths.push('Excelente percepción de recuperación');
    }

    if (profile.lifestyle.nutritionQuality >= 8) {
      strengths.push('Nutrición de alta calidad');
    }

    return strengths;
  }

  private generateRecoveryRecommendations(
    userData: UserData,
    profile: RecoveryProfile
  ): RecoveryRecommendation[] {
    const recommendations: RecoveryRecommendation[] = [];

    // Recomendaciones de sueño
    if (profile.sleepData.averageHours < 7 || profile.sleepData.efficiency < 85) {
      recommendations.push({
        id: 'sleep_optimization',
        category: 'sleep',
        priority: 'high',
        title: 'Optimización del Protocolo de Sueño',
        recommendation: 'Implementar higiene del sueño científicamente validada para mejorar duración y calidad',
        protocol: 'Rutina pre-sueño 60min + ambiente optimizado + timing consistente',
        expectedBenefit: 'Mejora 20-30% en calidad del sueño, aumento HRV, mejor recuperación muscular',
        timeToEffect: '1-2 semanas para adaptación',
        evidenceLevel: 'A',
        monitoring: ['Duración del sueño', 'Eficiencia', 'HRV matutina', 'Percepción subjetiva']
      });
    }

    // Recomendaciones de HRV
    if (profile.physiologicalMarkers.heartRateVariability < 30) {
      recommendations.push({
        id: 'hrv_enhancement',
        category: 'active-recovery',
        priority: 'high',
        title: 'Protocolo de Mejora de HRV',
        recommendation: 'Técnicas de respiración + exposición al frío + meditación para optimizar función autonómica',
        protocol: 'Respiración 4-7-8 diaria + ducha fría 3min + meditación 10min',
        expectedBenefit: 'Aumento 15-25% en HRV, mejor manejo del estrés, recuperación acelerada',
        timeToEffect: '2-4 semanas de práctica consistente',
        evidenceLevel: 'B',
        monitoring: ['HRV diaria', 'Estrés percibido', 'Calidad del sueño']
      });
    }

    // Recomendaciones nutricionales para recuperación
    if (profile.biochemicalMarkers.crp > 2 || profile.biochemicalMarkers.creatineKinase > 300) {
      recommendations.push({
        id: 'recovery_nutrition',
        category: 'nutrition',
        priority: 'medium',
        title: 'Nutrición Anti-inflamatoria para Recuperación',
        recommendation: 'Stack de nutrientes anti-inflamatorios para reducir daño muscular y acelerar reparación',
        protocol: 'Omega-3 2g + Curcumina 500mg + Cereza ácida + Proteína post-entreno optimizada',
        expectedBenefit: 'Reducción 30-40% marcadores inflamatorios, menor dolor muscular, recuperación 24h más rápida',
        timeToEffect: '1-3 semanas para cambios en biomarcadores',
        evidenceLevel: 'A',
        monitoring: ['CRP', 'Creatina kinasa', 'Dolor muscular percibido', 'Tiempo de recuperación']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'immediate': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private createRecoveryProtocols(profile: RecoveryProfile, criticalAreas: string[]): RecoveryProtocol[] {
    const protocols: RecoveryProtocol[] = [];

    // Protocolo de sueño si es necesario
    if (criticalAreas.some(area => area.includes('sueño'))) {
      protocols.push({
        id: 'sleep_recovery_protocol',
        name: 'Protocolo Intensivo de Recuperación del Sueño',
        type: 'daily',
        duration: '4-6 semanas',
        interventions: [
          this.interventionLibrary.get('Protocolo de Sueño Optimizado')!,
          this.interventionLibrary.get('Respiración 4-7-8 para HRV')!
        ],
        expectedOutcomes: [
          'Aumento 1-2h en duración del sueño',
          'Mejora 20% en eficiencia del sueño',
          'Incremento 15% en sueño profundo'
        ],
        successMetrics: ['Duración >7h', 'Eficiencia >85%', 'HRV mejora >10%']
      });
    }

    // Protocolo de recuperación muscular
    if (criticalAreas.some(area => area.includes('muscular') || area.includes('inflamación'))) {
      protocols.push({
        id: 'muscle_recovery_protocol',
        name: 'Protocolo Avanzado de Recuperación Muscular',
        type: 'immediate',
        duration: 'Post-entrenamiento',
        interventions: [
          this.interventionLibrary.get('Protocolo de Hidratación Activa')!,
          this.interventionLibrary.get('Exposición al Frío Controlada')!,
          this.interventionLibrary.get('Masaje de Recuperación')!
        ],
        expectedOutcomes: [
          'Reducción 40% en daño muscular',
          'Disminución 50% en inflamación',
          'Recuperación 24-48h más rápida'
        ],
        successMetrics: ['CK <200 U/L', 'CRP <1 mg/L', 'Dolor muscular <3/10']
      });
    }

    return protocols;
  }

  private assessTrainingReadiness(profile: RecoveryProfile): 'optimal' | 'good' | 'caution' | 'rest' {
    const score = this.calculateRecoveryScore(profile);

    if (score >= 80 && profile.subjective.perceivedRecovery >= 7) {
      return 'optimal';
    } else if (score >= 65 && profile.subjective.perceivedRecovery >= 5) {
      return 'good';
    } else if (score >= 50 || profile.subjective.perceivedRecovery >= 3) {
      return 'caution';
    } else {
      return 'rest';
    }
  }

  private estimateRecoveryTime(profile: RecoveryProfile): string {
    const criticalAreas = this.identifyCriticalAreas(profile);

    if (criticalAreas.length === 0) {
      return '6-12 horas (recuperación normal)';
    } else if (criticalAreas.length <= 2) {
      return '24-48 horas (recuperación moderada)';
    } else if (criticalAreas.length <= 4) {
      return '48-72 horas (recuperación extendida)';
    } else {
      return '72+ horas (descanso completo requerido)';
    }
  }

  /**
   * Genera reporte de recuperación personalizado
   */
  public generateRecoveryReport(analysis: RecoveryAnalysis): string {
    return `
🔄 ANÁLISIS DE RECUPERACIÓN

📊 Estado Actual:
• Puntuación de Recuperación: ${analysis.overallScore}/100
• Preparación para Entrenar: ${analysis.readinessToTrain.toUpperCase()}
• Tiempo de Recuperación Estimado: ${analysis.projectedRecoveryTime}

💪 Fortalezas Identificadas:
${analysis.strengths.map(s => `• ${s}`).join('\n')}

⚠️ Áreas Críticas:
${analysis.criticalAreas.map(a => `• ${a}`).join('\n')}

🎯 Recomendaciones Prioritarias:
${analysis.recommendations.slice(0, 3).map(r => `• ${r.title}: ${r.expectedBenefit}`).join('\n')}

📈 Protocolos Activos:
${analysis.protocols.map(p => `• ${p.name} (${p.duration})`).join('\n')}
    `.trim();
  }
}

export const recoveryAnalyticsAI = new RecoveryAnalyticsAI();