/**
 * Ejemplo de Integración de Wearables en SPARTAN 4
 * 
 * Este ejemplo demuestra cómo los datos de wearables se procesan
 * y se traducen en ajustes prácticos para el entrenamiento.
 */

import { wearableIntegrationService } from '../lib/wearable-integration-service';
import { chatMaestroService } from '../lib/chat-maestro-service';

// Ejemplo de datos de un dispositivo Oura Ring
const sampleOuraData = {
  source: 'oura' as const,
  sleep: { 
    duration: 450, 
    quality: 92, 
    deepSleep: 130, 
    remSleep: 110, 
    lightSleep: 210,
    wakeTimes: 2, 
    bedtime: '22:15', 
    wakeTime: '06:45',
    sleepEfficiency: 94,
    sleepLatency: 8
  },
  activity: { 
    steps: 7500, 
    calories: 2100, 
    activeMinutes: 60,
    vo2max: 48.5,
    trainingLoad: 45,
    lactateThreshold: 152,
    maxHeartRate: 180,
    zones: { zone1: 45, zone2: 15, zone3: 0, zone4: 0, zone5: 0 }
  },
  recovery: { 
    hrv: 72, 
    restingHeartRate: 46, 
    readiness: 88, 
    stress: 25,
    recoveryScore: 92,
    autonomicBalance: 1.4
  },
  vitals: {
    bloodPressure: {
      systolic: 112,
      diastolic: 72,
      pulse: 46,
      timestamp: new Date().toISOString()
    },
    glucose: {
      current: 88,
      average24h: 92,
      timeInRange: 95,
      variability: 12,
      timestamp: new Date().toISOString()
    },
    temperature: {
      body: 36.6,
      skin: 32.8,
      variance: 0.2
    },
    hydration: {
      level: 92,
      electrolytes: {
        sodium: 142,
        potassium: 4.5,
        magnesium: 2.3
      }
    },
    inflammation: {
      crp: 0.4,
      il6: 0.8,
      score: 94
    }
  },
  performance: {
    fitnessAge: 25,
    recoveryTime: 12,
    trainingReadiness: 92,
    metabolicEfficiency: 85,
    powerOutput: {
      ftp: 220,
      critical: 240,
      anaerobic: 320
    },
    cognitiveLoad: 28
  },
  lastSync: new Date().toISOString()
};

// Procesar datos de wearable
const userId = 'example-user-id';
const insights = wearableIntegrationService.processWearableData(userId, sampleOuraData);

console.log('=== ANÁLISIS DE DATOS DE WEARABLE ===');
console.log('Estado de Recuperación:', insights.recoveryStatus);
console.log('Preparación para Entrenar:', insights.trainingReadiness);
console.log('Número de Ajustes Recomendados:', insights.adjustments.length);
console.log('Número de Recomendaciones:', insights.recommendations.length);
console.log('Factores de Riesgo Identificados:', insights.riskFactors.length);

console.log('\n=== AJUSTES RECOMENDADOS ===');
insights.adjustments.forEach((adjustment, index) => {
  console.log(`${index + 1}. ${adjustment.type}: ${adjustment.value > 0 ? '+' : ''}${adjustment.value}% - ${adjustment.reason}`);
});

console.log('\n=== RECOMENDACIONES ===');
insights.recommendations.slice(0, 5).forEach((rec, index) => {
  console.log(`${index + 1}. ${rec}`);
});

console.log('\n=== FACTORES DE RIESGO ===');
if (insights.riskFactors.length === 0) {
  console.log('No se identificaron factores de riesgo significativos.');
} else {
  insights.riskFactors.forEach((risk, index) => {
    console.log(`${index + 1}. ${risk}`);
  });
}

// Ejemplo de cómo Chat Maestro podría usar estos insights
async function demonstrateChatMaestroIntegration() {
  // Construir contexto para Chat Maestro
  const context = await chatMaestroService.buildContext(userId, 'dashboard');
  
  // Agregar insights de wearable al contexto
  const contextWithWearable = {
    ...context,
    wearableInsights: insights
  };
  
  // Simular una pregunta del usuario
  const userInput = "¿Debería entrenar con alta intensidad hoy?";
  
  // Procesar la pregunta con contexto de wearable
  const response = await chatMaestroService.processUserInput(userInput, contextWithWearable);
  
  console.log('\n=== RESPUESTA DE CHAT MAESTRO ===');
  console.log(response.response);
  
  if (response.actionItems && response.actionItems.length > 0) {
    console.log('\nSugerencias:');
    response.actionItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
  }
}

// Ejecutar demostración
demonstrateChatMaestroIntegration().catch(console.error);

// Ejemplo de aplicación de ajustes a un plan de entrenamiento
function demonstrateWorkoutAdjustment() {
  // Plan de entrenamiento de ejemplo
  const sampleWorkoutPlan = {
    id: 'sample-plan',
    name: 'Entrenamiento de Piernas',
    description: 'Plan de entrenamiento de piernas de fuerza',
    focus: ['strength'],
    duration: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    difficulty: 'intermediate' as const,
    equipment: ['barbell', 'dumbbells'],
    days: [
      {
        day: 1,
        focus: 'Piernas',
        exercises: [
          {
            name: 'Sentadilla Frontal',
            sets: [
              { weight: 80, reps: 5, rpe: 7, tempo: '3010', rest: 180, notes: '' },
              { weight: 80, reps: 5, rpe: 7, tempo: '3010', rest: 180, notes: '' },
              { weight: 80, reps: 5, rpe: 7, tempo: '3010', rest: 180, notes: '' }
            ]
          },
          {
            name: 'Peso Muerto Rumano',
            sets: [
              { weight: 100, reps: 8, rpe: 7, tempo: '3010', rest: 150, notes: '' },
              { weight: 100, reps: 8, rpe: 7, tempo: '3010', rest: 150, notes: '' },
              { weight: 100, reps: 8, rpe: 7, tempo: '3010', rest: 150, notes: '' }
            ]
          }
        ]
      }
    ]
  };
  
  // Aplicar ajustes basados en insights de wearable
  const adjustedPlan = wearableIntegrationService.applyTrainingAdjustments(
    sampleWorkoutPlan, 
    insights.adjustments
  );
  
  console.log('\n=== PLAN DE ENTRENAMIENTO AJUSTADO ===');
  console.log('Nombre:', adjustedPlan.name);
  console.log('Duración ajustada:', adjustedPlan.duration, 'minutos');
  
  adjustedPlan.days.forEach((day: any) => {
    console.log(`\nDía ${day.day} - ${day.focus}:`);
    day.exercises.forEach((exercise: any) => {
      console.log(`  ${exercise.name}:`);
      exercise.sets.forEach((set: any, index: number) => {
        console.log(`    Serie ${index + 1}: ${set.weight}kg x ${set.reps} reps (descanso: ${set.rest}s)`);
      });
    });
  });
}

// Ejecutar demostración de ajuste de entrenamiento
demonstrateWorkoutAdjustment();