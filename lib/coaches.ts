// Sistema de Entrenadores IA Especializados para SPARTAN 4
import { TrainingLevel, TrainingDays, TrainingLocation, Equipment, InjuryHistory } from "./types";

// Tipos de entrenadores especializados
export type CoachSpecialty = 
  | 'strength'      // Fuerza
  | 'calisthenics'  // Calistenia
  | 'yoga'          // Yoga
  | 'nutrition'     // Nutrición
  | 'psychology'    // Psicología
  | 'spartan';      // Spartan (entrenador principal)

// Personalidades de los entrenadores
export type CoachPersonality = 
  | 'motivational'  // Motivacional - Enfocado en energía y entusiasmo
  | 'scientific'    // Científico - Enfocado en datos y evidencia
  | 'mindful'       // Consciente - Enfocado en mindfulness y conexión mente-cuerpo
  | 'disciplinarian' // Disciplinario - Enfocado en estructura y consistencia
  | 'adaptive'      // Adaptativo - Enfocado en flexibilidad y personalización
  | 'spartan';      // Spartan - Disciplinado pero empático, motivador pero técnico

// Interface base para todos los entrenadores
export interface BaseCoach {
  id: string;
  name: string;
  specialty: CoachSpecialty;
  personality: CoachPersonality;
  description: string;
  avatar: string;
  languages: string[];
  experience: string;
  trainingPhilosophy: string;
  communicationStyle: string;
  motivationTechniques: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface específica para entrenadores de fuerza
export interface StrengthCoach extends BaseCoach {
  specialty: 'strength';
  focusAreas: string[]; // ej. 'powerlifting', 'bodybuilding', 'functional strength'
  preferredMethods: string[]; // ej. 'progressive overload', 'periodization'
  equipmentExpertise: string[]; // ej. 'barbells', 'dumbbells', 'machines'
}

// Interface específica para entrenadores de calistenia
export interface CalisthenicsCoach extends BaseCoach {
  specialty: 'calisthenics';
  skillProgressions: string[]; // ej. 'beginner moves', 'intermediate flows', 'advanced skills'
  bodyweightFocus: string[]; // ej. 'upper body', 'lower body', 'core', 'full body'
  mobilityEmphasis: boolean;
}

// Interface específica para entrenadores de yoga
export interface YogaCoach extends BaseCoach {
  specialty: 'yoga';
  yogaStyles: string[]; // ej. 'hatha', 'vinyasa', 'ashtanga', 'yin'
  meditationExpertise: string[]; // ej. 'mindfulness', 'transcendental', 'movement'
  anatomyKnowledge: string[]; // ej. 'biomechanics', 'fascia', 'breathwork'
  spiritualApproach: boolean;
}

// Interface específica para entrenadores de nutrición
export interface NutritionCoach extends BaseCoach {
  specialty: 'nutrition';
  dietaryApproaches: string[]; // ej. 'keto', 'plant-based', 'mediterranean', 'intermittent fasting'
  certification: string; // ej. 'RD', 'NASM-CNC', 'ISSA-Nutritionist'
  macroFocus: string[]; // ej. 'flexible dieting', 'clean eating', 'IIFYM'
  supplementKnowledge: boolean;
}

// Interface específica para entrenadores de psicología
export interface PsychologyCoach extends BaseCoach {
  specialty: 'psychology';
  therapeuticApproaches: string[]; // ej. 'CBT', 'positive psychology', 'mindfulness-based'
  mentalSkills: string[]; // ej. 'goal setting', 'stress management', 'confidence building'
  specialization: string[]; // ej. 'sports performance', 'habit formation', 'overcoming plateaus'
  crisisIntervention: boolean;
}

// Interface específica para el entrenador Spartan
export interface SpartanCoach extends BaseCoach {
  specialty: 'spartan';
  coreValues: string[]; // ej. 'discipline', 'excellence', 'resilience'
  adaptabilityPrinciples: string[]; // ej. 'context-aware', 'user-centric', 'data-driven'
  feedbackApproach: string; // ej. 'constructive', 'scientific', 'motivational'
  teachingMethodology: string[]; // ej. 'practical demonstration', 'scientific explanation', 'progressive guidance'
}

// Tipo unión para todos los entrenadores
export type Coach = 
  | StrengthCoach 
  | CalisthenicsCoach 
  | YogaCoach 
  | NutritionCoach 
  | PsychologyCoach
  | SpartanCoach;

// Preferencias del usuario para selección de coach
export interface CoachPreferences {
  specialty: CoachSpecialty;
  personality: CoachPersonality;
  language: string;
  experienceLevel: TrainingLevel;
  goals: string[];
  communicationStyle: 'direct' | 'encouraging' | 'technical' | 'conversational';
}

// Resultado de la selección de coach
export interface CoachSelectionResult {
  coach: Coach;
  compatibilityScore: number; // 0-100
  reasons: string[];
  recommendedAlternatives: Coach[];
}

// Datos de los entrenadores predefinidos
export const PREDEFINED_COACHES: Coach[] = [
  // Coach de Fuerza - Motivacional
  {
    id: 'coach-strength-1',
    name: 'Atlas "The Titan" Rodriguez',
    specialty: 'strength',
    personality: 'motivational',
    description: 'Campeón de powerlifting con 15 años de experiencia. Especializado en desarrollar fuerza extrema con motivación intensa.',
    avatar: '/coaches/atlas-rodriguez.jpg',
    languages: ['es', 'en'],
    experience: '15 años como atleta de fuerza y coach profesional',
    trainingPhilosophy: 'La fuerza no solo transforma el cuerpo, sino también la mente. Cada repetición es un paso hacia la grandeza.',
    communicationStyle: 'Energético y directo, con metáforas poderosas',
    motivationTechniques: [
      'Visualización de metas extremas',
      'Competencia con uno mismo',
      'Celebración de pequeñas victorias',
      'Uso de lenguaje de poder'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    focusAreas: ['powerlifting', 'strongman', 'functional strength'],
    preferredMethods: ['progressive overload', 'max effort method', 'dynamic effort method'],
    equipmentExpertise: ['barbells', 'dumbbells', 'strongman implements', 'power racks']
  } as StrengthCoach,
  
  // Coach de Calistenia - Científico
  {
    id: 'coach-calisthenics-1',
    name: 'Dr. Elena "The Biomechanist" Chen',
    specialty: 'calisthenics',
    personality: 'scientific',
    description: 'Doctora en Biomecánica con enfoque en movimiento humano eficiente. Especializada en progresiones sistemáticas de calistenia.',
    avatar: '/coaches/elena-chen.jpg',
    languages: ['es', 'en', 'zh'],
    experience: '12 años en investigación del movimiento y entrenamiento con peso corporal',
    trainingPhilosophy: 'Cada movimiento tiene una mecánica óptima. La progresión debe respetar las leyes del cuerpo humano.',
    communicationStyle: 'Técnico y explicativo, con analogías científicas',
    motivationTechniques: [
      'Explicación de beneficios biomecánicos',
      'Seguimiento de métricas de movimiento',
      'Comparación con principios científicos',
      'Uso de análisis de movimiento'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    skillProgressions: ['beginner moves', 'intermediate flows', 'advanced skills', 'freestyle combinations'],
    bodyweightFocus: ['upper body', 'lower body', 'core', 'full body integration'],
    mobilityEmphasis: true
  } as CalisthenicsCoach,
  
  // Coach de Yoga - Consciente
  {
    id: 'coach-yoga-1',
    name: 'Ananda "The Mindful" Patel',
    specialty: 'yoga',
    personality: 'mindful',
    description: 'Maestra de yoga con formación en meditación budista. Integra práctica física con desarrollo espiritual y conexión mente-cuerpo.',
    avatar: '/coaches/ananda-patel.jpg',
    languages: ['es', 'en', 'hi'],
    experience: '18 años practicando y enseñando yoga y meditación',
    trainingPhilosophy: 'El yoga une cuerpo, mente y espíritu. Cada postura es una oportunidad para la autoconciencia.',
    communicationStyle: 'Suave y reflexivo, con énfasis en la respiración y presencia',
    motivationTechniques: [
      'Enseñanza de mindfulness',
      'Conexión con intenciones personales',
      'Uso de metáforas espirituales',
      'Enfoque en el proceso, no solo en el resultado'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    yogaStyles: ['hatha', 'vinyasa', 'yin', 'restorative'],
    meditationExpertise: ['mindfulness', 'loving-kindness', 'body scan', 'breath awareness'],
    anatomyKnowledge: ['biomechanics', 'fascia', 'energy channels', 'breathwork'],
    spiritualApproach: true
  } as YogaCoach,
  
  // Coach de Nutrición - Adaptativo
  {
    id: 'coach-nutrition-1',
    name: 'Marcus "The Flexible" Johnson',
    specialty: 'nutrition',
    personality: 'adaptive',
    description: 'Nutricionista certificado especializado en enfoques flexibles y sostenibles para la salud y el rendimiento.',
    avatar: '/coaches/marcus-johnson.jpg',
    languages: ['es', 'en'],
    experience: '10 años en nutrición deportiva y bienestar integral',
    trainingPhilosophy: 'La nutrición no es restricción, sino educación. Cada elección alimenticia puede ser consciente y poderosa.',
    communicationStyle: 'Práctico y personalizable, con enfoque en soluciones reales',
    motivationTechniques: [
      'Enseñanza de hábitos sostenibles',
      'Enfoque en progresión gradual',
      'Celebración de elecciones conscientes',
      'Uso de principios de flexibilidad'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    dietaryApproaches: ['flexible dieting', 'plant-based', 'mediterranean', 'intermittent fasting'],
    certification: 'ISSA-Nutritionist, Precision Nutrition Level 1',
    macroFocus: ['flexible dieting', 'micronutrient density', 'timing strategies'],
    supplementKnowledge: true
  } as NutritionCoach,
  
  // Coach de Psicología - Disciplinario
  {
    id: 'coach-psychology-1',
    name: 'Dr. Sofia "The Strategist" Martinez',
    specialty: 'psychology',
    personality: 'disciplinarian',
    description: 'Psicóloga especializada en psicología del deporte y formación de hábitos. Enfocada en estructura y consistencia para resultados duraderos.',
    avatar: '/coaches/sofia-martinez.jpg',
    languages: ['es', 'en'],
    experience: '14 años en psicología del deporte y desarrollo de hábitos',
    trainingPhilosophy: 'La grandeza se construye con disciplina diaria. La consistencia supera al talento cuando el talento no trabaja duro.',
    communicationStyle: 'Estructurado y directo, con planes claros y expectativas definidas',
    motivationTechniques: [
      'Establecimiento de sistemas y rutinas',
      'Seguimiento estricto de progreso',
      'Uso de consecuencias y recompensas',
      'Enfoque en responsabilidad personal'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    therapeuticApproaches: ['CBT', 'habit formation', 'goal setting theory', 'performance psychology'],
    mentalSkills: ['goal setting', 'stress management', 'confidence building', 'focus training'],
    specialization: ['sports performance', 'habit formation', 'overcoming plateaus', 'mental toughness'],
    crisisIntervention: true
  } as PsychologyCoach,
  
  // Coach Spartan - Principal
  {
    id: 'coach-spartan-1',
    name: 'Spartan "The Mentor"',
    specialty: 'spartan',
    personality: 'spartan',
    description: 'El entrenador principal de SPARTAN 4. Disciplinado pero empático, motivador pero técnico. Se adapta a cada situación del usuario para acompañar, enseñar y corregir.',
    avatar: '/coaches/spartan-mentor.jpg',
    languages: ['es', 'en'],
    experience: 'La encarnación del espíritu spartano, con conocimiento ilimitado en todas las disciplinas del fitness.',
    trainingPhilosophy: 'La disciplina construye campeones. La empatía guía el camino. La ciencia asegura los resultados. La motivación impulsa la grandeza.',
    communicationStyle: 'Equilibrado entre firmeza y comprensión, adaptando el tono según la situación del usuario. Combina ciencia, motivación y claridad en cada interacción.',
    motivationTechniques: [
      'Adaptación contextual de la intensidad del mensaje',
      'Equilibrio entre exigencia y apoyo emocional',
      'Uso de datos científicos con lenguaje motivacional',
      'Enfoque en el crecimiento personal y superación'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    coreValues: ['discipline', 'excellence', 'resilience', 'growth', 'integrity'],
    adaptabilityPrinciples: ['context-aware', 'user-centric', 'data-driven', 'emotionally-intelligent'],
    feedbackApproach: 'constructive',
    teachingMethodology: ['practical demonstration', 'scientific explanation', 'progressive guidance', 'real-time correction']
  } as SpartanCoach
];

// Función para obtener todos los coaches de una especialidad
export const getCoachesBySpecialty = (specialty: CoachSpecialty): Coach[] => {
  return PREDEFINED_COACHES.filter(coach => coach.specialty === specialty);
};

// Función para obtener un coach por ID
export const getCoachById = (id: string): Coach | undefined => {
  return PREDEFINED_COACHES.find(coach => coach.id === id);
};

// Función para calcular compatibilidad entre usuario y coach
export const calculateCoachCompatibility = (
  userPreferences: CoachPreferences,
  coach: Coach
): number => {
  let score = 0;
  
  // Coincidencia de especialidad (+30 puntos)
  if (coach.specialty === userPreferences.specialty) {
    score += 30;
  }
  
  // Coincidencia de personalidad (+25 puntos)
  if (coach.personality === userPreferences.personality) {
    score += 25;
  }
  
  // Idioma compatible (+20 puntos)
  if (coach.languages.includes(userPreferences.language)) {
    score += 20;
  }
  
  // Experiencia alineada (+15 puntos)
  if (userPreferences.experienceLevel === 'advanced' && coach.experience.includes('años')) {
    score += 15;
  }
  
  // Estilo de comunicación (+10 puntos)
  // Esta lógica se puede expandir según las preferencias específicas
  
  // Asegurar que el puntaje esté entre 0 y 100
  return Math.min(score, 100);
};

// Función para seleccionar el mejor coach para un usuario
export const selectBestCoach = (userPreferences: CoachPreferences): CoachSelectionResult => {
  const compatibilityScores = PREDEFINED_COACHES.map(coach => ({
    coach,
    score: calculateCoachCompatibility(userPreferences, coach)
  }));
  
  // Ordenar por puntuación de compatibilidad (descendente)
  compatibilityScores.sort((a, b) => b.score - a.score);
  
  const bestMatch = compatibilityScores[0];
  const alternatives = compatibilityScores.slice(1, 4).map(item => item.coach);
  
  return {
    coach: bestMatch.coach,
    compatibilityScore: bestMatch.score,
    reasons: getCompatibilityReasons(userPreferences, bestMatch.coach),
    recommendedAlternatives: alternatives
  };
};

// Función para obtener razones de compatibilidad
const getCompatibilityReasons = (preferences: CoachPreferences, coach: Coach): string[] => {
  const reasons: string[] = [];
  
  if (coach.specialty === preferences.specialty) {
    reasons.push(`Especialidad alineada: ${getSpecialtyName(coach.specialty)}`);
  }
  
  if (coach.personality === preferences.personality) {
    reasons.push(`Personalidad compatible: ${getPersonalityName(coach.personality)}`);
  }
  
  if (coach.languages.includes(preferences.language)) {
    reasons.push(`Idioma disponible: ${preferences.language.toUpperCase()}`);
  }
  
  if (preferences.experienceLevel === 'advanced' && coach.experience.includes('años')) {
    reasons.push('Experiencia avanzada del coach');
  }
  
  return reasons;
};

// Función auxiliar para obtener nombres de especialidades
const getSpecialtyName = (specialty: CoachSpecialty): string => {
  const names: Record<CoachSpecialty, string> = {
    'strength': 'Fuerza',
    'calisthenics': 'Calistenia',
    'yoga': 'Yoga',
    'nutrition': 'Nutrición',
    'psychology': 'Psicología',
    'spartan': 'Spartan'
  };
  return names[specialty];
};

// Función auxiliar para obtener nombres de personalidades
const getPersonalityName = (personality: CoachPersonality): string => {
  const names: Record<CoachPersonality, string> = {
    'motivational': 'Motivacional',
    'scientific': 'Científico',
    'mindful': 'Consciente',
    'disciplinarian': 'Disciplinario',
    'adaptive': 'Adaptativo',
    'spartan': 'Spartan'
  };
  return names[personality];
};