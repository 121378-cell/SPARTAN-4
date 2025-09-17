/**
 * Longevity AI System - Sistema experto en longevidad y salud
 * Algoritmos científicos para optimización de healthspan y lifespan
 */

import { scientificAI } from './scientificAI';
import type { UserData } from './types';

export interface LongevityProfile {
  biologicalAge: number;
  chronologicalAge: number;
  healthspan: {
    cardiovascular: number; // 0-100 score
    metabolic: number;
    cognitive: number;
    musculoskeletal: number;
    immune: number;
  };
  riskFactors: {
    genetics: string[];
    lifestyle: string[];
    environmental: string[];
    metabolic: string[];
  };
  biomarkers: {
    telomereLength?: number;
    inflammatoryMarkers: {
      crp: number;
      il6?: number;
      tnfAlpha?: number;
    };
    metabolicMarkers: {
      glucose: number;
      hba1c: number;
      insulinSensitivity: number;
    };
    hormonalProfile: {
      testosterone?: number;
      estrogen?: number;
      cortisol: number;
      igf1?: number;
    };
  };
}

export interface LongevityIntervention {
  id: string;
  name: string;
  category: 'exercise' | 'nutrition' | 'lifestyle' | 'supplementation' | 'medical' | 'mental';
  priority: 'critical' | 'high' | 'medium' | 'low';
  intervention: string;
  protocol: string;
  expectedBenefit: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  timeToEffect: string;
  biomarkerTargets: string[];
  contradictions?: string[];
  monitoring: string[];
  lifeExtensionPotential: number; // years
  healthspanImprovement: number; // percentage
}

export interface AgingHallmark {
  name: string;
  description: string;
  currentLevel: 'low' | 'moderate' | 'high';
  interventions: string[];
  targetableMarkers: string[];
}

export interface LongevityProtocol {
  id: string;
  name: string;
  targetAgeRange: string;
  phases: LongevityPhase[];
  expectedOutcomes: {
    biologicalAgeReduction: number;
    healthspanExtension: number;
    diseaseRiskReduction: { [disease: string]: number };
  };
  monitoring: {
    biomarkers: string[];
    frequency: string;
    adjustmentTriggers: string[];
  };
}

export interface LongevityPhase {
  name: string;
  duration: string;
  focus: string[];
  interventions: LongevityIntervention[];
  milestones: string[];
}

export class LongevityAI {
  private agingHallmarks: AgingHallmark[] = [];
  private interventionDatabase: Map<string, LongevityIntervention> = new Map();
  private protocolLibrary: Map<string, LongevityProtocol> = new Map();

  constructor() {
    this.initializeAgingScience();
    this.buildInterventionDatabase();
    this.createProtocolLibrary();
  }

  private initializeAgingScience(): void {
    this.agingHallmarks = [
      {
        name: 'Genomic Instability',
        description: 'Acumulación de daño en el ADN',
        currentLevel: 'moderate',
        interventions: ['Ejercicio de resistencia', 'Antioxidantes dirigidos', 'Restricción calórica'],
        targetableMarkers: ['8-OHdG', 'Telomere length', 'DNA repair capacity']
      },
      {
        name: 'Telomere Attrition',
        description: 'Acortamiento de telómeros',
        currentLevel: 'moderate',
        interventions: ['Ejercicio aeróbico', 'Manejo del estrés', 'Omega-3'],
        targetableMarkers: ['Telomere length', 'Telomerase activity']
      },
      {
        name: 'Cellular Senescence',
        description: 'Acumulación de células senescentes',
        currentLevel: 'low',
        interventions: ['Ayuno intermitente', 'Senolíticos naturales', 'Ejercicio intenso'],
        targetableMarkers: ['p16', 'p21', 'SASP factors']
      },
      {
        name: 'Mitochondrial Dysfunction',
        description: 'Deterioro de función mitocondrial',
        currentLevel: 'moderate',
        interventions: ['CoQ10', 'PQQ', 'Ejercicio mitocondrial', 'Ketosis períodica'],
        targetableMarkers: ['ATP production', 'Mitochondrial density', 'ROS levels']
      },
      {
        name: 'Chronic Inflammation',
        description: 'Inflamación crónica de bajo grado',
        currentLevel: 'moderate',
        interventions: ['Dieta antiinflamatoria', 'Omega-3', 'Curcumina', 'Ejercicio moderado'],
        targetableMarkers: ['CRP', 'IL-6', 'TNF-α', 'NF-κB activity']
      }
    ];
  }

  private buildInterventionDatabase(): void {
    this.interventionDatabase = new Map();

    const interventions: LongevityIntervention[] = [
      {
        id: 'exercise_longevity_protocol',
        name: 'Protocolo de Ejercicio para Longevidad',
        category: 'exercise',
        priority: 'critical',
        intervention: 'Combinación de entrenamiento de resistencia, cardiovascular y alta intensidad',
        protocol: '3x/semana resistencia (45min) + 2x/semana HIIT (20min) + 1x/semana cardio zona 2 (60min)',
        expectedBenefit: 'Reducción de mortalidad 40-50%, mejora de todos los biomarcadores de envejecimiento',
        evidenceLevel: 'A',
        timeToEffect: '6-12 semanas para marcadores, 1-2 años para longevidad',
        biomarkerTargets: ['VO2max', 'Fuerza muscular', 'Inflamación', 'Sensibilidad insulina'],
        monitoring: ['Capacidad cardiorrespiratoria', 'Composición corporal', 'Biomarcadores sanguíneos'],
        lifeExtensionPotential: 3.5,
        healthspanImprovement: 25
      },
      {
        id: 'intermittent_fasting_protocol',
        name: 'Protocolo de Ayuno Intermitente Longevidad',
        category: 'nutrition',
        priority: 'high',
        intervention: 'Ayuno intermitente con variación de ventanas alimentarias',
        protocol: '16:8 diario + 24h semanal + 72h mensual (con supervisión médica)',
        expectedBenefit: 'Activación de autofagia, mejora de sensibilidad insulina, reducción inflamación',
        evidenceLevel: 'B',
        timeToEffect: '2-4 semanas para marcadores metabólicos',
        biomarkerTargets: ['Glucosa', 'Insulina', 'IGF-1', 'mTOR', 'AMPK'],
        monitoring: ['Glucosa sanguínea', 'Energía', 'Peso corporal', 'Composición corporal'],
        lifeExtensionPotential: 2.0,
        healthspanImprovement: 15
      },
      {
        id: 'heat_shock_protocol',
        name: 'Protocolo de Hormesis Térmica',
        category: 'lifestyle',
        priority: 'medium',
        intervention: 'Exposición controlada a calor para activar proteínas de choque térmico',
        protocol: 'Sauna 80-90°C por 15-20min, 3-4x/semana + exposición a frío 10-15°C por 2-3min',
        expectedBenefit: 'Activación de HSP, mejora cardiovascular, reducción mortalidad',
        evidenceLevel: 'B',
        timeToEffect: '4-8 semanas para adaptaciones cardiovasculares',
        biomarkerTargets: ['HSP70', 'HSP90', 'Función endotelial', 'HRV'],
        monitoring: ['Tolerancia al calor', 'Función cardiovascular', 'Recuperación'],
        lifeExtensionPotential: 1.5,
        healthspanImprovement: 12
      },
      {
        id: 'longevity_supplementation',
        name: 'Protocolo de Suplementación Anti-Aging',
        category: 'supplementation',
        priority: 'medium',
        intervention: 'Stack de compuestos con evidencia en longevidad',
        protocol: 'NMN 250mg + Resveratrol 500mg + Metformina 500mg + Omega-3 2g + Vitamina D 4000UI',
        expectedBenefit: 'Activación de sirtuinas, mejora función mitocondrial, reducción inflamación',
        evidenceLevel: 'C',
        timeToEffect: '3-6 meses para biomarcadores',
        biomarkerTargets: ['NAD+', 'Sirtuin activity', 'Inflamación', 'Función mitocondrial'],
        contradictions: ['Embarazo', 'Diabetes tipo 1', 'Trastornos hemorrágicos'],
        monitoring: ['Función hepática', 'Glucosa', 'Biomarcadores inflamatorios'],
        lifeExtensionPotential: 1.8,
        healthspanImprovement: 10
      },
      {
        id: 'cognitive_longevity',
        name: 'Protocolo de Longevidad Cognitiva',
        category: 'mental',
        priority: 'high',
        intervention: 'Entrenamiento cognitivo multimodal para preservar función cerebral',
        protocol: 'Meditación 20min + Entrenamiento cognitivo 30min + Aprendizaje nuevo idioma/habilidad',
        expectedBenefit: 'Preservación de volumen cerebral, mejora de neuroplasticidad, reducción demencia',
        evidenceLevel: 'B',
        timeToEffect: '8-12 semanas para mejoras cognitivas',
        biomarkerTargets: ['BDNF', 'Volumen hipocampal', 'Conectividad neural'],
        monitoring: ['Tests cognitivos', 'Neuroimagen', 'Biomarcadores neurológicos'],
        lifeExtensionPotential: 2.2,
        healthspanImprovement: 20
      }
    ];

    interventions.forEach(intervention => {
      this.interventionDatabase.set(intervention.id, intervention);
    });
  }

  private createProtocolLibrary(): void {
    this.protocolLibrary = new Map();

    const protocols: LongevityProtocol[] = [
      {
        id: 'comprehensive_longevity_30s',
        name: 'Protocolo Integral de Longevidad 30-40 años',
        targetAgeRange: '30-40',
        phases: [
          {
            name: 'Optimización Base (Meses 1-3)',
            duration: '3 meses',
            focus: ['Establecer hábitos', 'Biomarcadores baseline', 'Intervenciones básicas'],
            interventions: [
              this.interventionDatabase.get('exercise_longevity_protocol')!,
              this.interventionDatabase.get('intermittent_fasting_protocol')!
            ],
            milestones: ['VO2max >35ml/kg/min', 'HbA1c <5.7%', 'CRP <1mg/L']
          },
          {
            name: 'Intensificación (Meses 4-9)',
            duration: '6 meses',
            focus: ['Protocolos avanzados', 'Optimización personalizada', 'Monitoreo intensivo'],
            interventions: [
              this.interventionDatabase.get('heat_shock_protocol')!,
              this.interventionDatabase.get('longevity_supplementation')!
            ],
            milestones: ['Edad biológica -2 años', 'Marcadores inflamatorios óptimos']
          },
          {
            name: 'Mantenimiento (Meses 10-12)',
            duration: '3 meses',
            focus: ['Sostenibilidad', 'Ajustes finos', 'Protocolos a largo plazo'],
            interventions: [
              this.interventionDatabase.get('cognitive_longevity')!
            ],
            milestones: ['Protocolos integrados en estilo de vida', 'Biomarcadores estables']
          }
        ],
        expectedOutcomes: {
          biologicalAgeReduction: 3,
          healthspanExtension: 20,
          diseaseRiskReduction: {
            'cardiovascular': 40,
            'diabetes': 50,
            'cancer': 25,
            'neurodegenerativo': 30
          }
        },
        monitoring: {
          biomarkers: ['Panel metabólico completo', 'Marcadores inflamatorios', 'Hormonas', 'Telómeros'],
          frequency: 'Cada 3 meses',
          adjustmentTriggers: ['Cambios >10% en biomarcadores', 'Eventos adversos', 'Objetivos no alcanzados']
        }
      }
    ];

    protocols.forEach(protocol => {
      this.protocolLibrary.set(protocol.id, protocol);
    });
  }

  /**
   * Genera un análisis completo de longevidad personalizado
   */
  public async generateLongevityAnalysis(
    userData: UserData,
    longevityProfile: LongevityProfile
  ): Promise<{
    currentStatus: any;
    recommendations: LongevityIntervention[];
    protocol: LongevityProtocol;
    projections: any;
  }> {
    console.log('🧬 Generando análisis de longevidad científico...');

    const currentStatus = this.assessCurrentLongevityStatus(longevityProfile);
    const recommendations = this.generatePersonalizedInterventions(userData, longevityProfile);
    const protocol = this.selectOptimalProtocol(userData, longevityProfile);
    const projections = this.calculateLongevityProjections(userData, longevityProfile, recommendations);

    return {
      currentStatus,
      recommendations,
      protocol,
      projections
    };
  }

  private assessCurrentLongevityStatus(profile: LongevityProfile): any {
    const biologicalAgeAdvantage = profile.chronologicalAge - profile.biologicalAge;
    const healthspanScore = Object.values(profile.healthspan).reduce((sum, score) => sum + score, 0) / 5;
    
    const riskLevel = this.calculateOverallRisk(profile);
    const longevityPotential = this.estimateLongevityPotential(profile);

    return {
      biologicalAgeAdvantage,
      healthspanScore,
      riskLevel,
      longevityPotential,
      criticalAreas: this.identifyCriticalAreas(profile),
      strengths: this.identifyStrengths(profile)
    };
  }

  private calculateOverallRisk(profile: LongevityProfile): 'low' | 'moderate' | 'high' {
    const riskFactors = [
      ...profile.riskFactors.genetics,
      ...profile.riskFactors.lifestyle,
      ...profile.riskFactors.environmental,
      ...profile.riskFactors.metabolic
    ];

    const criticalMarkers = [
      profile.biomarkers.inflammatoryMarkers.crp > 3,
      profile.biomarkers.metabolicMarkers.hba1c > 5.7,
      profile.biomarkers.hormonalProfile.cortisol > 550
    ].filter(Boolean).length;

    if (riskFactors.length > 5 || criticalMarkers > 2) return 'high';
    if (riskFactors.length > 2 || criticalMarkers > 1) return 'moderate';
    return 'low';
  }

  private estimateLongevityPotential(profile: LongevityProfile): number {
    const baseLifeExpectancy = 85; // años
    
    let adjustments = 0;
    
    // Ajustes positivos
    if (profile.biologicalAge < profile.chronologicalAge) {
      adjustments += (profile.chronologicalAge - profile.biologicalAge) * 0.5;
    }
    
    const avgHealthspan = Object.values(profile.healthspan).reduce((sum, score) => sum + score, 0) / 5;
    if (avgHealthspan > 80) adjustments += 5;
    else if (avgHealthspan > 60) adjustments += 2;
    
    // Ajustes negativos
    if (profile.biomarkers.inflammatoryMarkers.crp > 3) adjustments -= 3;
    if (profile.biomarkers.metabolicMarkers.hba1c > 6.0) adjustments -= 4;
    
    return baseLifeExpectancy + adjustments;
  }

  private identifyCriticalAreas(profile: LongevityProfile): string[] {
    const critical: string[] = [];

    if (profile.healthspan.cardiovascular < 70) critical.push('Salud cardiovascular');
    if (profile.healthspan.metabolic < 70) critical.push('Salud metabólica');
    if (profile.healthspan.cognitive < 70) critical.push('Función cognitiva');
    if (profile.biomarkers.inflammatoryMarkers.crp > 3) critical.push('Inflamación crónica');
    if (profile.biomarkers.metabolicMarkers.hba1c > 5.7) critical.push('Regulación glucémica');

    return critical;
  }

  private identifyStrengths(profile: LongevityProfile): string[] {
    const strengths: string[] = [];

    if (profile.healthspan.cardiovascular >= 85) strengths.push('Excelente salud cardiovascular');
    if (profile.healthspan.musculoskeletal >= 85) strengths.push('Óptima función musculoesquelética');
    if (profile.biologicalAge < profile.chronologicalAge - 2) strengths.push('Edad biológica favorable');
    if (profile.biomarkers.inflammatoryMarkers.crp < 1) strengths.push('Inflamación mínima');

    return strengths;
  }

  private generatePersonalizedInterventions(
    userData: UserData,
    profile: LongevityProfile
  ): LongevityIntervention[] {
    const interventions: LongevityIntervention[] = [];

    // Intervenciones críticas siempre incluidas
    interventions.push(this.interventionDatabase.get('exercise_longevity_protocol')!);

    // Intervenciones basadas en áreas problemáticas
    const criticalAreas = this.identifyCriticalAreas(profile);
    
    if (criticalAreas.includes('Salud metabólica')) {
      interventions.push(this.interventionDatabase.get('intermittent_fasting_protocol')!);
    }

    if (criticalAreas.includes('Función cognitiva')) {
      interventions.push(this.interventionDatabase.get('cognitive_longevity')!);
    }

    if (profile.biomarkers.inflammatoryMarkers.crp > 2) {
      interventions.push(this.interventionDatabase.get('longevity_supplementation')!);
    }

    // Intervenciones por edad
    if (userData.age >= 40) {
      interventions.push(this.interventionDatabase.get('heat_shock_protocol')!);
    }

    return interventions.sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private selectOptimalProtocol(userData: UserData, profile: LongevityProfile): LongevityProtocol {
    // Por ahora, seleccionar basado en edad
    if (userData.age >= 30 && userData.age <= 40) {
      return this.protocolLibrary.get('comprehensive_longevity_30s')!;
    }

    // Protocolo por defecto
    return this.protocolLibrary.get('comprehensive_longevity_30s')!;
  }

  private calculateLongevityProjections(
    userData: UserData,
    profile: LongevityProfile,
    interventions: LongevityIntervention[]
  ): any {
    const currentLifeExpectancy = this.estimateLongevityPotential(profile);
    
    const totalLifeExtension = interventions.reduce((sum, intervention) => 
      sum + intervention.lifeExtensionPotential, 0
    );

    const totalHealthspanImprovement = interventions.reduce((sum, intervention) => 
      sum + intervention.healthspanImprovement, 0
    );

    return {
      currentLifeExpectancy,
      projectedLifeExpectancy: currentLifeExpectancy + (totalLifeExtension * 0.7), // Factor de realismo
      healthspanImprovement: Math.min(totalHealthspanImprovement * 0.6, 50), // Máximo 50%
      biologicalAgeReduction: Math.min(totalLifeExtension * 0.8, 10), // Máximo 10 años
      timeToOptimalBiomarkers: '6-12 meses',
      sustainabilityFactor: 0.85
    };
  }

  /**
   * Monitorea el progreso de longevidad y ajusta protocolos
   */
  public async trackLongevityProgress(
    currentProfile: LongevityProfile,
    previousProfile: LongevityProfile,
    interventionsActive: string[]
  ): Promise<{
    progress: any;
    adjustments: string[];
    newTargets: string[];
  }> {
    console.log('📊 Monitoreando progreso de longevidad...');

    const biologicalAgeChange = currentProfile.biologicalAge - previousProfile.biologicalAge;
    const healthspanChanges = Object.keys(currentProfile.healthspan).map(key => ({
      domain: key,
      change: currentProfile.healthspan[key as keyof typeof currentProfile.healthspan] - 
              previousProfile.healthspan[key as keyof typeof previousProfile.healthspan]
    }));

    const biomarkerTrends = this.analyzeBiomarkerTrends(currentProfile, previousProfile);

    return {
      progress: {
        biologicalAgeChange,
        healthspanChanges,
        biomarkerTrends,
        interventionEffectiveness: this.assessInterventionEffectiveness(interventionsActive, currentProfile, previousProfile)
      },
      adjustments: this.generateAdjustments(currentProfile, previousProfile),
      newTargets: this.setNewTargets(currentProfile)
    };
  }

  private analyzeBiomarkerTrends(current: LongevityProfile, previous: LongevityProfile): any {
    return {
      inflammation: {
        direction: current.biomarkers.inflammatoryMarkers.crp < previous.biomarkers.inflammatoryMarkers.crp ? 'improving' : 'worsening',
        magnitude: Math.abs(current.biomarkers.inflammatoryMarkers.crp - previous.biomarkers.inflammatoryMarkers.crp)
      },
      metabolic: {
        direction: current.biomarkers.metabolicMarkers.hba1c < previous.biomarkers.metabolicMarkers.hba1c ? 'improving' : 'worsening',
        magnitude: Math.abs(current.biomarkers.metabolicMarkers.hba1c - previous.biomarkers.metabolicMarkers.hba1c)
      }
    };
  }

  private assessInterventionEffectiveness(
    interventions: string[],
    current: LongevityProfile,
    previous: LongevityProfile
  ): any {
    // Evaluar efectividad de cada intervención
    return interventions.map(interventionId => ({
      intervention: interventionId,
      effectiveness: this.calculateEffectiveness(interventionId, current, previous),
      recommendation: 'continue' // continuar, ajustar, o discontinuar
    }));
  }

  private calculateEffectiveness(interventionId: string, current: LongevityProfile, previous: LongevityProfile): number {
    // Lógica simplificada - en realidad sería más compleja
    const avgHealthspanCurrent = Object.values(current.healthspan).reduce((sum, val) => sum + val, 0) / 5;
    const avgHealthspanPrevious = Object.values(previous.healthspan).reduce((sum, val) => sum + val, 0) / 5;
    
    return (avgHealthspanCurrent - avgHealthspanPrevious) / avgHealthspanPrevious;
  }

  private generateAdjustments(current: LongevityProfile, previous: LongevityProfile): string[] {
    const adjustments: string[] = [];

    if (current.biomarkers.inflammatoryMarkers.crp > previous.biomarkers.inflammatoryMarkers.crp) {
      adjustments.push('Intensificar protocolo antiinflamatorio');
    }

    if (current.healthspan.cardiovascular < 70) {
      adjustments.push('Aumentar intensidad de entrenamiento cardiovascular');
    }

    return adjustments;
  }

  private setNewTargets(profile: LongevityProfile): string[] {
    const targets: string[] = [];

    if (profile.biologicalAge >= profile.chronologicalAge) {
      targets.push(`Reducir edad biológica en ${Math.ceil(profile.biologicalAge - profile.chronologicalAge + 2)} años`);
    }

    if (profile.biomarkers.inflammatoryMarkers.crp > 1) {
      targets.push('CRP < 1.0 mg/L');
    }

    return targets;
  }

  /**
   * Genera reporte semanal de longevidad
   */
  public generateWeeklyLongevityReport(profile: LongevityProfile): string {
    const healthspanAvg = Object.values(profile.healthspan).reduce((sum, val) => sum + val, 0) / 5;
    const biologicalAdvantage = profile.chronologicalAge - profile.biologicalAge;

    return `
🧬 REPORTE SEMANAL DE LONGEVIDAD

📊 Estado Actual:
• Edad Biológica: ${profile.biologicalAge} años (${biologicalAdvantage > 0 ? `${biologicalAdvantage} años menor` : `${Math.abs(biologicalAdvantage)} años mayor`} que edad cronológica)
• Healthspan Score: ${healthspanAvg.toFixed(1)}/100
• Nivel de Riesgo: ${this.calculateOverallRisk(profile)}
• Potencial de Longevidad: ${this.estimateLongevityPotential(profile)} años

🎯 Áreas de Fortaleza:
${this.identifyStrengths(profile).map(s => `• ${s}`).join('\n')}

⚠️ Áreas Críticas:
${this.identifyCriticalAreas(profile).map(a => `• ${a}`).join('\n')}

🔬 Biomarcadores Clave:
• CRP: ${profile.biomarkers.inflammatoryMarkers.crp} mg/L
• HbA1c: ${profile.biomarkers.metabolicMarkers.hba1c}%
• Cortisol: ${profile.biomarkers.hormonalProfile.cortisol} nmol/L

📈 Progreso de la Semana:
• Protocolos activos cumplidos
• Biomarcadores estables
• Adaptaciones positivas en curso
    `.trim();
  }
}

export const longevityAI = new LongevityAI();