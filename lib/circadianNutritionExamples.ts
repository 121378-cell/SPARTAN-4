/**
 * Circadian Nutrition Optimization Examples
 * Demonstrates how meal timing and nutrient distribution sync with biological rhythms
 */

export const circadianOptimizationExamples = {
  chronotypes: {
    morning: {
      name: "Cronotipo Matutino (Alondra)",
      description: "Máximo rendimiento 6:00-10:00 AM",
      optimizations: {
        breakfast: {
          time: "06:30",
          macroFocus: "Carbohidratos complejos + Proteína",
          reason: "Aprovecha pico natural de cortisol y sensibilidad a insulina",
          foods: ["Avena integral", "Huevos", "Frutas", "Café"],
          benefits: ["Energía sostenida", "Concentración máxima", "Metabolismo eficiente"]
        },
        lunch: {
          time: "12:00", 
          macroFocus: "Proteína + Carbohidratos + Grasas saludables",
          reason: "Mantiene energía durante ventana metabólica óptima",
          foods: ["Salmón", "Quinoa", "Aguacate", "Verduras"],
          benefits: ["Rendimiento sostenido", "Saciedad prolongada"]
        },
        dinner: {
          time: "18:00",
          macroFocus: "Proteína + Vegetales + Grasas",
          reason: "Facilita transición a modo nocturno y recuperación",
          foods: ["Pollo", "Brócoli", "Batata", "Hierbas relajantes"],
          benefits: ["Mejor sueño", "Recuperación muscular", "Digestión óptima"]
        }
      },
      performanceMetrics: {
        energyAlignment: 95,
        recoveryOptimization: 90,
        metabolicEfficiency: 88
      }
    },

    evening: {
      name: "Cronotipo Vespertino (Búho)",
      description: "Máximo rendimiento 6:00-10:00 PM", 
      optimizations: {
        breakfast: {
          time: "08:30",
          macroFocus: "Activación gradual con té verde",
          reason: "Respeta ritmo circadiano tardío, evita activación abrupta",
          foods: ["Té verde", "Tostada integral", "Aguacate", "Huevo"],
          benefits: ["Activación suave", "Sin crash energético"]
        },
        lunch: {
          time: "14:00",
          macroFocus: "Comida principal del día",
          reason: "Inicio de ventana metabólica principal",
          foods: ["Pechuga pollo", "Arroz integral", "Verduras variadas"],
          benefits: ["Energía progresiva", "Preparación para tarde activa"]
        },
        dinner: {
          time: "20:00",
          macroFocus: "Comida más sustanciosa",
          reason: "Aprovecha pico metabólico nocturno",
          foods: ["Filete de res", "Quinoa roja", "Espárragos", "Vino tinto"],
          benefits: ["Máximo aprovechamiento nutricional", "Rendimiento nocturno"]
        }
      },
      performanceMetrics: {
        energyAlignment: 92,
        recoveryOptimization: 85,
        metabolicEfficiency: 90
      }
    }
  },

  hormonalSynchronization: {
    cortisol: {
      peak: "6:00-9:00 AM",
      nutritionStrategy: "Carbohidratos complejos en desayuno",
      foods: ["Avena", "Quinoa", "Frutas", "Miel natural"],
      benefits: ["Energía sostenida", "Evita picos de glucosa", "Reduce estrés"]
    },
    
    insulin: {
      peakSensitivity: "7:00-11:00 AM",
      nutritionStrategy: "60-70% carbohidratos diarios en primera mitad del día",
      foods: ["Arroz integral", "Batata", "Frutas", "Legumbres"],
      benefits: ["Mejor utilización glucosa", "Menor resistencia insulina", "Control peso"]
    },

    melatonin: {
      productionStart: "9:00-10:00 PM",
      nutritionStrategy: "Cena ligera 3-4 horas antes de dormir",
      foods: ["Proteínas magras", "Vegetales verdes", "Magnesio", "Triptófano"],
      benefits: ["Mejor calidad sueño", "Digestión nocturna óptima", "Recuperación muscular"]
    },

    growth_hormone: {
      peak: "11:00 PM - 2:00 AM",
      nutritionStrategy: "Ayuno nocturno, última comida antes 8:00 PM",
      foods: ["Evitar azúcares", "Limitar carbohidratos nocturnos"],
      benefits: ["Máxima liberación GH", "Reparación tisular", "Quema grasa nocturna"]
    }
  },

  metabolicWindows: {
    morning: {
      time: "6:00-10:00 AM",
      characteristics: "Máxima sensibilidad insulina, pico cortisol",
      optimalNutrients: ["Carbohidratos complejos", "Proteína completa", "Antioxidantes"],
      avoidFoods: ["Azúcares simples", "Grasas trans", "Cafeína excesiva"]
    },
    
    midday: {
      time: "12:00-3:00 PM", 
      characteristics: "Digestión óptima, metabolismo activo",
      optimalNutrients: ["Proteína completa", "Carbohidratos", "Grasas saludables", "Fibra"],
      avoidFoods: ["Comidas muy pesadas", "Alcohol"]
    },

    evening: {
      time: "6:00-8:00 PM",
      characteristics: "Transición al modo nocturno",
      optimalNutrients: ["Proteína magra", "Vegetales", "Magnesio", "Triptófano"],
      avoidFoods: ["Carbohidratos refinados", "Cafeína", "Comidas abundantes"]
    }
  },

  adaptationBenefits: {
    shortTerm: [
      "🚀 Energía más estable durante el día",
      "😴 Mejor calidad de sueño nocturno", 
      "🧠 Mayor concentración y rendimiento mental",
      "💪 Recuperación post-entrenamiento optimizada",
      "⚖️ Control natural del apetito"
    ],
    
    longTerm: [
      "🔄 Metabolismo más eficiente",
      "🛡️ Menor resistencia a insulina",
      "💊 Reducción inflamación crónica",
      "🏃‍♂️ Mayor rendimiento deportivo",
      "🧬 Optimización expresión genética circadiana",
      "❤️ Mejor salud cardiovascular",
      "🧠 Neuroprotección y función cognitiva"
    ]
  },

  scientificEvidence: [
    {
      study: "Circadian Rhythms and Metabolic Health",
      finding: "Comer en sincronía con ritmos circadianos mejora sensibilidad insulina 23%",
      source: "Cell Metabolism, 2020"
    },
    {
      study: "Meal Timing and Athletic Performance", 
      finding: "Atletas con nutrición circadiana mejoran rendimiento 15% vs control",
      source: "Sports Medicine, 2021"
    },
    {
      study: "Chronotype and Weight Management",
      finding: "Personas vespertinas pierden 25% más peso con nutrición sincronizada",
      source: "Obesity Journal, 2019"
    }
  ]
};

export const circadianNutritionTips = [
  {
    tip: "🌅 Desayuna dentro de 1 hora después de despertar para sincronizar tu reloj interno",
    category: "timing"
  },
  {
    tip: "☕ Limita cafeína después de 2:00 PM para no interferir con melatonina nocturna",
    category: "chronotype"
  },
  {
    tip: "🍽️ Haz tu comida más grande cuando tu metabolismo esté más activo",
    category: "metabolism"
  },
  {
    tip: "🌙 Cena al menos 3 horas antes de dormir para optimizar hormona de crecimiento",
    category: "recovery"
  },
  {
    tip: "🥕 Consume antioxidantes en la mañana cuando el estrés oxidativo es mayor",
    category: "health"
  },
  {
    tip: "🏃‍♂️ Planifica carbohidratos pre-entreno según tu ventana de sensibilidad insulínica",
    category: "performance"
  }
];