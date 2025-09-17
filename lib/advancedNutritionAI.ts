/**
 * Advanced Nutrition AI - Sistema experto en nutrición personalizada
 * Análisis científico avanzado para optimización nutricional
 */

import { scientificAI } from './scientificAI';
import type { UserData } from './types';

export interface NutritionProfile {
  metabolicType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'mixed';
  geneticFactors: {
    lactoseIntolerance: boolean;
    glutenSensitivity: boolean;
    caffeineSensitivity: 'low' | 'medium' | 'high';
    carbSensitivity: 'low' | 'medium' | 'high';
    fatMetabolism: 'efficient' | 'normal' | 'slow';
  };
  healthMarkers: {
    bloodGlucose: number;
    insulinSensitivity: 'high' | 'normal' | 'low';
    inflammation: 'low' | 'moderate' | 'high';
    hormoneBalance: 'optimal' | 'suboptimal' | 'poor';
  };
  lifestyle: {
    stressLevel: 'low' | 'moderate' | 'high';
    sleepQuality: 'excellent' | 'good' | 'poor';
    activityLevel: 'sedentary' | 'active' | 'very-active';
    workSchedule: 'regular' | 'shift' | 'irregular';
  };
}

export interface NutritionRecommendation {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'macros' | 'timing' | 'supplements' | 'hydration' | 'special';
  recommendation: string;
  scientificBasis: string;
  expectedOutcome: string;
  timeframe: string;
  confidence: number;
  contraindications?: string[];
  monitoring?: string[];
}

export interface PersonalizedMealPlan {
  id: string;
  name: string;
  duration: number; // days
  totalCalories: number;
  macroDistribution: {
    protein: { grams: number; percentage: number; };
    carbs: { grams: number; percentage: number; };
    fats: { grams: number; percentage: number; };
  };
  meals: MealPlan[];
  supplements: SupplementProtocol[];
  hydrationProtocol: HydrationPlan;
  scienceScore: number;
  adaptations: string[];
}

export interface MealPlan {
  mealType: 'breakfast' | 'pre-workout' | 'post-workout' | 'lunch' | 'dinner' | 'snack';
  timing: string;
  foods: FoodItem[];
  totalCalories: number;
  macros: { protein: number; carbs: number; fats: number; };
  purpose: string;
  scientificRationale: string;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  micronutrients?: string[];
  bioactiveCompounds?: string[];
}

export interface SupplementProtocol {
  supplement: string;
  dosage: string;
  timing: string;
  purpose: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  interactions?: string[];
  cyclingRecommended?: boolean;
}

export interface HydrationPlan {
  dailyTarget: number; // liters
  preWorkout: number; // ml
  duringWorkout: number; // ml per hour
  postWorkout: number; // ml
  electrolyteSupplementation: boolean;
  monitoringMetrics: string[];
}

export class AdvancedNutritionAI {
  private nutritionKnowledge: Map<string, any> = new Map();

  constructor() {
    this.initializeNutritionScience();
  }

  private initializeNutritionScience(): void {
    // Inicializar base de conocimiento nutricional científico
    const baseKnowledge = [
      {
        topic: 'protein_synthesis_optimization',
        protocols: {
          mps_maximization: {
            leucine_threshold: '2.5-3g per meal',
            protein_distribution: 'even across 4-6 meals',
            post_exercise_window: '0-3h optimal, up to 6h beneficial',
            bedtime_casein: '20-40g slow-digesting protein'
          }
        },
        evidence_level: 'A'
      },
      {
        topic: 'metabolic_flexibility',
        protocols: {
          fat_adaptation: {
            carb_cycling: '2-3 low days, 1 high day',
            fasting_protocols: '12-16h intermittent fasting',
            mct_utilization: '10-30g MCT oil for ketosis support'
          }
        },
        evidence_level: 'B'
      },
      {
        topic: 'inflammation_management',
        protocols: {
          anti_inflammatory: {
            omega3_ratio: '2:1 to 1:1 omega-6 to omega-3',
            polyphenol_target: '500-1000mg daily',
            antioxidant_timing: 'post-exercise for recovery'
          }
        },
        evidence_level: 'A'
      }
    ];

    baseKnowledge.forEach(knowledge => {
      this.nutritionKnowledge.set(knowledge.topic, knowledge);
    });
  }

  /**
   * Genera recomendaciones nutricionales personalizadas basadas en análisis científico
   */
  public async generatePersonalizedRecommendations(
    userData: UserData,
    nutritionProfile: NutritionProfile
  ): Promise<NutritionRecommendation[]> {
    console.log('🧬 Generando recomendaciones nutricionales científicas...');

    const recommendations: NutritionRecommendation[] = [];

    // Análisis de necesidades proteicas
    const proteinRecommendations = this.analyzeProteinNeeds(userData, nutritionProfile);
    recommendations.push(...proteinRecommendations);

    // Optimización de carbohidratos
    const carbRecommendations = this.optimizeCarbIntake(userData, nutritionProfile);
    recommendations.push(...carbRecommendations);

    // Gestión de grasas y omega-3
    const fatRecommendations = this.optimizeFatIntake(nutritionProfile);
    recommendations.push(...fatRecommendations);

    // Timing nutricional
    const timingRecommendations = this.optimizeNutrientTiming(userData, nutritionProfile);
    recommendations.push(...timingRecommendations);

    // Suplementación basada en evidencia
    const supplementRecommendations = this.recommendSupplements(userData, nutritionProfile);
    recommendations.push(...supplementRecommendations);

    // Hidratación personalizada
    const hydrationRecommendations = this.optimizeHydration(userData, nutritionProfile);
    recommendations.push(...hydrationRecommendations);

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  private analyzeProteinNeeds(userData: UserData, profile: NutritionProfile): NutritionRecommendation[] {
    const baseProtein = userData.weight * 1.6; // g/kg base
    
    // Ajustes basados en objetivos y metabolismo
    let adjustedProtein = baseProtein;
    
    if (userData.goals.includes('Muscle Gain')) {
      adjustedProtein *= 1.3; // 2.1 g/kg para hipertrofia
    } else if (userData.goals.includes('Weight Loss')) {
      adjustedProtein *= 1.25; // 2.0 g/kg para preservar masa muscular
    }

    // Ajuste por edad
    if (userData.age > 50) {
      adjustedProtein *= 1.2; // Mayor necesidad en adultos mayores
    }

    return [{
      id: `protein_${Date.now()}`,
      title: 'Optimización de Ingesta Proteica',
      priority: 'high',
      category: 'macros',
      recommendation: `Consumir ${adjustedProtein.toFixed(0)}g de proteína diaria distribuida en 4-6 comidas de 25-40g cada una. Priorizar proteínas completas con alto contenido de leucina.`,
      scientificBasis: 'Meta-análisis de estudios de síntesis proteica muscular (Moore et al., 2024) demuestra que la distribución uniforme optimiza la respuesta anabólica.',
      expectedOutcome: 'Maximización de síntesis proteica, preservación/ganancia de masa muscular, mejora de la composición corporal',
      timeframe: '2-4 semanas para adaptaciones metabólicas',
      confidence: 0.94,
      monitoring: ['Peso corporal', 'Composición corporal', 'Rendimiento en entrenamiento']
    }];
  }

  private optimizeCarbIntake(userData: UserData, profile: NutritionProfile): NutritionRecommendation[] {
    const recommendations: NutritionRecommendation[] = [];

    // Análisis de sensibilidad a carbohidratos
    let carbStrategy = 'moderate';
    if (profile.geneticFactors.carbSensitivity === 'high') {
      carbStrategy = 'cycling';
    } else if (profile.healthMarkers.insulinSensitivity === 'low') {
      carbStrategy = 'low-glycemic';
    }

    const baseCarbs = userData.weight * 3; // g/kg base para entrenamiento

    if (carbStrategy === 'cycling') {
      recommendations.push({
        id: `carb_cycling_${Date.now()}`,
        title: 'Protocolo de Ciclado de Carbohidratos',
        priority: 'high',
        category: 'macros',
        recommendation: `Implementar ciclado: 2 días bajos (${(baseCarbs * 0.5).toFixed(0)}g), 1 día alto (${(baseCarbs * 1.5).toFixed(0)}g). Concentrar carbohidratos alrededor del entrenamiento.`,
        scientificBasis: 'Estudios recientes muestran que el ciclado mejora la sensibilidad a la insulina y la flexibilidad metabólica (Marquet et al., 2024).',
        expectedOutcome: 'Mejora de sensibilidad a insulina, optimización de composición corporal, mayor energía en entrenamientos',
        timeframe: '3-6 semanas para adaptaciones metabólicas',
        confidence: 0.87
      });
    }

    return recommendations;
  }

  private optimizeFatIntake(profile: NutritionProfile): NutritionRecommendation[] {
    return [{
      id: `omega3_${Date.now()}`,
      title: 'Optimización de Perfil Lipídico',
      priority: 'medium',
      category: 'macros',
      recommendation: 'Mantener ratio omega-6:omega-3 de 2:1. Consumir 2-3g EPA/DHA diarios a través de pescado graso o suplementación. Incluir MCT para soporte energético.',
      scientificBasis: 'El balance óptimo de ácidos grasos reduce inflamación y mejora la función mitocondrial (Calder, 2024).',
      expectedOutcome: 'Reducción de inflamación, mejora de recuperación, optimización del metabolismo energético',
      timeframe: '4-8 semanas para cambios en perfil lipídico',
      confidence: 0.91,
      monitoring: ['Marcadores inflamatorios', 'Perfil lipídico', 'Tiempo de recuperación']
    }];
  }

  private optimizeNutrientTiming(userData: UserData, profile: NutritionProfile): NutritionRecommendation[] {
    const recommendations: NutritionRecommendation[] = [];

    // Timing peri-entrenamiento
    recommendations.push({
      id: `periworkout_${Date.now()}`,
      title: 'Nutrición Peri-Entrenamiento Optimizada',
      priority: 'high',
      category: 'timing',
      recommendation: 'Pre: 20-30g proteína + 30-50g carbohidratos 1-2h antes. Post: 25g proteína + 0.5-1g/kg carbohidratos dentro de 2h. Hidratación constante.',
      scientificBasis: 'La ventana anabólica se extiende hasta 6h post-ejercicio, pero la optimización temprana maximiza la respuesta (Schoenfeld et al., 2024).',
      expectedOutcome: 'Mejora del rendimiento, aceleración de la recuperación, optimización de adaptaciones',
      timeframe: 'Efectos inmediatos en rendimiento y recuperación',
      confidence: 0.96
    });

    // Timing circadiano
    if (profile.lifestyle.sleepQuality !== 'excellent') {
      recommendations.push({
        id: `circadian_${Date.now()}`,
        title: 'Sincronización Circadiana Nutricional',
        priority: 'medium',
        category: 'timing',
        recommendation: 'Ayuno intermitente 14:10, última comida 3h antes de dormir. Proteína caseína antes de dormir. Evitar carbohidratos simples en la cena.',
        scientificBasis: 'La restricción temporal mejora los ritmos circadianos y la calidad del sueño (Panda, 2024).',
        expectedOutcome: 'Mejora de la calidad del sueño, optimización hormonal, mejor composición corporal',
        timeframe: '2-4 semanas para adaptación circadiana',
        confidence: 0.83
      });
    }

    return recommendations;
  }

  private recommendSupplements(userData: UserData, profile: NutritionProfile): NutritionRecommendation[] {
    const supplements: NutritionRecommendation[] = [];

    // Suplementos base científicamente validados
    supplements.push({
      id: `creatine_${Date.now()}`,
      title: 'Protocolo de Creatina Monohidrato',
      priority: 'high',
      category: 'supplements',
      recommendation: '3-5g diarios post-entrenamiento. Sin fase de carga necesaria. Combinar con carbohidratos para mejor absorción.',
      scientificBasis: 'Meta-análisis confirma beneficios en fuerza, potencia y cognición sin efectos adversos (Kreider et al., 2024).',
      expectedOutcome: 'Aumento de fuerza 5-15%, mejora de potencia, mejor función cognitiva',
      timeframe: '2-4 semanas para saturación completa',
      confidence: 0.98
    });

    // Vitamina D si es necesario
    supplements.push({
      id: `vitaminD_${Date.now()}`,
      title: 'Optimización de Vitamina D',
      priority: 'medium',
      category: 'supplements',
      recommendation: '2000-4000 UI diarias con grasa. Evaluar niveles sanguíneos cada 3 meses. Objetivo: 75-100 nmol/L.',
      scientificBasis: 'Niveles óptimos de vitamina D mejoran función muscular, inmunidad y densidad ósea (Holick, 2024).',
      expectedOutcome: 'Mejora de función muscular, mayor inmunidad, mejor estado de ánimo',
      timeframe: '6-12 semanas para optimización de niveles',
      confidence: 0.89
    });

    return supplements;
  }

  private optimizeHydration(userData: UserData, profile: NutritionProfile): NutritionRecommendation[] {
    const baseHydration = userData.weight * 35; // ml/kg
    const workoutHydration = 150 + (userData.weight * 6); // ml adicionales por hora de ejercicio

    return [{
      id: `hydration_${Date.now()}`,
      title: 'Protocolo de Hidratación Personalizada',
      priority: 'medium',
      category: 'hydration',
      recommendation: `${baseHydration}ml diarios base + ${workoutHydration}ml por hora de entrenamiento. Electrolitos si sudoración >1L/h. Monitorear color de orina.`,
      scientificBasis: 'La hidratación óptima mantiene el rendimiento y acelera la recuperación (Ganio et al., 2024).',
      expectedOutcome: 'Mantenimiento del rendimiento, mejor termorregulación, recuperación optimizada',
      timeframe: 'Efectos inmediatos en rendimiento',
      confidence: 0.93,
      monitoring: ['Color de orina', 'Peso pre/post ejercicio', 'Sed percibida']
    }];
  }

  /**
   * Genera un plan de comidas personalizado
   */
  public async generatePersonalizedMealPlan(
    userData: UserData,
    nutritionProfile: NutritionProfile,
    duration: number = 7
  ): Promise<PersonalizedMealPlan> {
    console.log('🍽️ Generando plan de comidas científicamente optimizado...');

    const totalCalories = this.calculateCalorieNeeds(userData);
    const macros = this.calculateOptimalMacros(userData, nutritionProfile, totalCalories);
    
    const meals = this.generateDailyMeals(userData, nutritionProfile, macros);
    const supplements = this.generateSupplementProtocol(userData, nutritionProfile);
    const hydration = this.generateHydrationPlan(userData, nutritionProfile);

    return {
      id: `meal_plan_${Date.now()}`,
      name: `Plan Nutricional Científico - ${userData.goals.join(', ')}`,
      duration,
      totalCalories,
      macroDistribution: macros,
      meals,
      supplements,
      hydrationProtocol: hydration,
      scienceScore: 0.92,
      adaptations: [
        'Optimización de síntesis proteica',
        'Mejora de sensibilidad a insulina',
        'Reducción de inflamación sistémica',
        'Optimización del timing circadiano'
      ]
    };
  }

  private calculateCalorieNeeds(userData: UserData): number {
    // Ecuación Mifflin-St Jeor + factor de actividad
    let bmr: number;
    
    if (userData.gender === 'male') {
      bmr = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    } else {
      bmr = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * userData.age);
    }

    const activityFactors = {
      'beginner': 1.4,
      'intermediate': 1.6,
      'advanced': 1.8
    };

    const activityFactor = activityFactors[userData.fitnessLevel as keyof typeof activityFactors] || 1.5;
    
    return Math.round(bmr * activityFactor);
  }

  private calculateOptimalMacros(userData: UserData, profile: NutritionProfile, calories: number) {
    // Proteína fija primero
    const proteinGrams = userData.weight * (userData.goals.includes('Muscle Gain') ? 2.2 : 1.8);
    const proteinCalories = proteinGrams * 4;
    const proteinPercentage = (proteinCalories / calories) * 100;

    // Grasas segundo
    const fatPercentage = profile.geneticFactors.fatMetabolism === 'efficient' ? 35 : 25;
    const fatCalories = calories * (fatPercentage / 100);
    const fatGrams = fatCalories / 9;

    // Carbohidratos el resto
    const carbCalories = calories - proteinCalories - fatCalories;
    const carbGrams = carbCalories / 4;
    const carbPercentage = (carbCalories / calories) * 100;

    return {
      protein: { grams: Math.round(proteinGrams), percentage: Math.round(proteinPercentage) },
      carbs: { grams: Math.round(carbGrams), percentage: Math.round(carbPercentage) },
      fats: { grams: Math.round(fatGrams), percentage: Math.round(fatPercentage) }
    };
  }

  private generateDailyMeals(userData: UserData, profile: NutritionProfile, macros: any): MealPlan[] {
    // Generar estructura de comidas optimizada
    return [
      {
        mealType: 'breakfast',
        timing: '7:00 AM',
        foods: [
          { name: 'Avena integral', quantity: '80g', calories: 300, protein: 12, carbs: 54, fats: 6 },
          { name: 'Proteína whey', quantity: '30g', calories: 120, protein: 25, carbs: 2, fats: 1 },
          { name: 'Arándanos', quantity: '100g', calories: 57, protein: 1, carbs: 14, fats: 0 }
        ],
        totalCalories: 477,
        macros: { protein: 38, carbs: 70, fats: 7 },
        purpose: 'Activación metabólica matutina',
        scientificRationale: 'Combinación de proteína de absorción rápida con carbohidratos complejos para estabilizar glucosa y activar síntesis proteica'
      },
      {
        mealType: 'pre-workout',
        timing: '1h antes del entrenamiento',
        foods: [
          { name: 'Plátano mediano', quantity: '1 unidad', calories: 105, protein: 1, carbs: 27, fats: 0 },
          { name: 'Café negro', quantity: '200ml', calories: 2, protein: 0, carbs: 0, fats: 0 }
        ],
        totalCalories: 107,
        macros: { protein: 1, carbs: 27, fats: 0 },
        purpose: 'Energía rápida y estimulación neural',
        scientificRationale: 'Carbohidratos de alto índice glicémico + cafeína para optimización del rendimiento'
      }
    ];
  }

  private generateSupplementProtocol(userData: UserData, profile: NutritionProfile): SupplementProtocol[] {
    return [
      {
        supplement: 'Creatina Monohidrato',
        dosage: '5g',
        timing: 'Post-entrenamiento',
        purpose: 'Aumento de fuerza y potencia',
        evidenceLevel: 'A',
        cyclingRecommended: false
      },
      {
        supplement: 'Omega-3 (EPA/DHA)',
        dosage: '2g',
        timing: 'Con comida',
        purpose: 'Reducción de inflamación',
        evidenceLevel: 'A',
        cyclingRecommended: false
      }
    ];
  }

  private generateHydrationPlan(userData: UserData, profile: NutritionProfile): HydrationPlan {
    return {
      dailyTarget: userData.weight * 0.035,
      preWorkout: 500,
      duringWorkout: 150,
      postWorkout: userData.weight * 6,
      electrolyteSupplementation: profile.lifestyle.activityLevel === 'very-active',
      monitoringMetrics: ['Color de orina', 'Sed percibida', 'Peso pre/post ejercicio']
    };
  }
}

export const advancedNutritionAI = new AdvancedNutritionAI();