import { GoogleGenAI, Type } from "@google/genai";
import type { TrainingLevel, TrainingLocation, Equipment, InjuryHistory, TrainingDays, WorkoutPlan, BloodTestAnalysis, MacroGoals, Recipe, OverloadData, CorrectiveExercise, BodyPart } from "./types";

// Configuración unificada de API
const API_CONFIG = {
    model: "gemini-2.5-flash",
    timeout: 30000,
    retries: 3,
    retryDelay: 1000
};

// Función para obtener la API key de forma unificada
const getApiKey = (): string => {
    // Prioridad: 1. Variables de entorno Vite (solo en cliente), 2. Variables de entorno regulares, 3. Fallback
    if (typeof window !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
        return (import.meta as any).env.VITE_GEMINI_API_KEY;
    }
    
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
    }
    
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
        return process.env.API_KEY;
    }
    
    throw new Error("No se encontró una clave de API válida. Asegúrate de configurar VITE_GEMINI_API_KEY, GEMINI_API_KEY o API_KEY en el archivo .env");
};

// Cliente AI singleton con manejo de errores mejorado
let aiClient: GoogleGenAI | null = null;
let aiClientPromise: Promise<GoogleGenAI> | null = null;

const getAiClient = async (): Promise<GoogleGenAI> => {
    if (aiClient) {
        return aiClient;
    }
    
    if (aiClientPromise) {
        return aiClientPromise;
    }
    
    aiClientPromise = (async () => {
        try {
            const apiKey = getApiKey();
            const client = new GoogleGenAI({ apiKey });
            
            // Test de conexión con mejor manejo de errores
            await client.models.list();
            
            aiClient = client;
            return client;
        } catch (error: any) {
            console.error("Error inicializando cliente AI:", error);
            aiClientPromise = null;
            
            // Manejo específico de errores comunes
            if (error.message && error.message.includes('PERMISSION_DENIED')) {
                throw new Error(
                    `API de Gemini no habilitada. ` +
                    `1) Ve a: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview ` +
                    `2) Habilita la API ` +
                    `3) Espera 2-5 minutos ` +
                    `4) Reinicia la aplicación`
                );
            }
            
            if (error.message && error.message.includes('API_KEY_INVALID')) {
                throw new Error(
                    `API Key inválida. ` +
                    `1) Ve a: https://aistudio.google.com/apikey ` +
                    `2) Crea una nueva API key ` +
                    `3) Actualiza el archivo .env`
                );
            }
            
            throw new Error(`Error de conexión con la API: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    })();
    
    return aiClientPromise;
};


interface GenerationParams {
    level: TrainingLevel;
    availableDays: TrainingDays;
    trainingLocation: TrainingLocation;
    equipment: Equipment;
    injuryHistory: InjuryHistory;
    previousProgress: string;
    goals: string[];
}

// Omit id because it will be generated client-side
export const generateMultiGoalWorkoutPlanApi = async (params: GenerationParams): Promise<Omit<WorkoutPlan, 'id'>> => {
    const ai = await getAiClient();

    const availableEquipment = Object.entries(params.equipment)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ') || 'ninguno';

    const injuryInfo = params.injuryHistory.hasInjuries 
        ? `El usuario tiene las siguientes lesiones a considerar: ${params.injuryHistory.injuries}. Por favor, proporciona alternativas seguras y modificaciones.`
        : 'El usuario no ha reportado lesiones.';

    const prompt = `
        Eres un entrenador personal y preparador físico certificado de clase mundial. Tu tarea es crear un plan de entrenamiento de varios días, altamente personalizado y flexible, basado en el perfil detallado del usuario.

        Perfil del Usuario:
        - Nivel de Condición Física: ${params.level} (adapta ejercicios si el usuario tiene experiencia mixta)
        - Días de Entrenamiento por Semana: ${params.availableDays} (crea plan flexible que permita ajustes semanales)
        - Lugar Principal de Entrenamiento: ${params.trainingLocation} (incluye alternativas para otros lugares cuando sea posible)
        - Equipamiento Disponible: ${availableEquipment}
        - Objetivos Principales de Fitness: ${params.goals.join(', ')} (combina múltiples objetivos de forma inteligente)
        - Historial de Lesiones: ${injuryInfo}
        - Progreso/Historial Previo: ${params.previousProgress || 'No se proporcionó progreso previo.'}

        Instrucciones Especiales para Máxima Flexibilidad:
        1.  Crea un plan que se adapte a las necesidades cambiantes del usuario.
        2.  Si tiene múltiples objetivos, alterna el enfoque entre días (ej: fuerza + hipertrofia + movilidad).
        3.  Incluye SIEMPRE ejercicios alternativos en las notas para diferentes niveles y equipamiento.
        4.  Para cada ejercicio, menciona cómo progresar o regresar la dificultad.
        5.  Si el lugar es "gimnasio", incluye alternativas para casa en las notas.
        6.  Si es "casa", sugiere cómo hacer los ejercicios más desafiantes.
        7.  El plan debe ser ADAPTABLE - no rígido.
        8.  Incluye variaciones para semanas de mayor o menor disponibilidad.
        9.  Cada día debe tener un enfoque claro pero flexible.
        10. Proporciona rangos de repeticiones amplios (ej: "8-15" en lugar de "8-12") para mayor flexibilidad.
        11. Devuelve la respuesta como un único objeto JSON que se adhiera estrictamente al esquema proporcionado. No incluyas ningún formato markdown.
    `;

    const exerciseSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            sets: { type: Type.INTEGER },
            reps: { type: Type.STRING, description: 'Rango de repeticiones, ej., "8-12" o "AMRAP"' },
            rest: { type: Type.INTEGER, description: 'Tiempo de descanso en segundos entre series' },
            equipment: { type: Type.STRING },
            notes: { type: Type.STRING, description: 'Notas opcionales sobre técnica, seguridad o alternativas.' },
        },
        required: ['name', 'sets', 'reps', 'rest', 'equipment']
    };

    const dayPlanSchema = {
        type: Type.OBJECT,
        properties: {
            day: { type: Type.INTEGER },
            focus: { type: Type.STRING, description: 'ej., "Día de Empuje", "Fuerza de Cuerpo Completo"' },
            exercises: {
                type: Type.ARRAY,
                items: exerciseSchema
            }
        },
        required: ['day', 'focus', 'exercises']
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Un nombre creativo y motivador para el plan de entrenamiento." },
            description: { type: Type.STRING, description: "Una breve y alentadora descripción del plan." },
            focus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Los objetivos principales de este plan." },
            days: {
                type: Type.ARRAY,
                items: dayPlanSchema
            },
            duration: { type: Type.INTEGER, description: "Duración estimada del plan en minutos." },
            difficulty: { type: Type.STRING, enum: ["beginner", "intermediate", "advanced"], description: "Nivel de dificultad del plan." },
            equipment: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de equipamiento necesario." },
            estimatedCalories: { type: Type.INTEGER, description: "Calorías estimadas quemadas por sesión." }
        },
        required: ['name', 'description', 'focus', 'days', 'duration', 'difficulty', 'equipment']
    };

    const response = await ai.models.generateContent({
        model: API_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const workoutData = JSON.parse(response.text || '{}');
    
    // Añadir campos adicionales que no vienen de la API
    const now = new Date();
    return {
        ...workoutData,
        createdAt: now,
        updatedAt: now,
        estimatedCalories: workoutData.estimatedCalories || Math.floor(workoutData.duration * 8) // Estimación básica
    };
};

export const analyzeBloodTestApi = async (biomarkers: Record<string, string>): Promise<BloodTestAnalysis> => {
    const ai = await getAiClient();

    const prompt = `
        Eres un experto científico deportivo y médico funcional especializado en optimizar el rendimiento humano.
        Analiza los siguientes resultados de análisis de sangre para un individuo activo. Proporciona un resumen conciso, un desglose detallado de cada marcador y recomendaciones prácticas relacionadas con el fitness, la nutrición y el estilo de vida.

        Datos de Biomarcadores del Usuario:
        ${JSON.stringify(biomarkers, null, 2)}

        Instrucciones:
        1.  **Resumen:** Proporciona una visión general breve y fácil de entender de los resultados, destacando los hallazgos clave.
        2.  **Desglose de Biomarcadores:** Para cada marcador proporcionado por el usuario:
            -   Indica el nombre del marcador, el valor del usuario y la unidad estándar.
            -   Proporciona un rango óptimo generalmente aceptado para individuos activos.
            -   Asigna un estado: "Óptimo", "Límite", "Alto" o "Bajo".
            -   Escribe una breve interpretación de lo que este marcador indica para la salud y el rendimiento atlético.
        3.  **Recomendaciones:** Basado en los resultados, proporciona consejos específicos y prácticos clasificados en:
            -   **Nutrición:** Alimentos específicos para incorporar o reducir.
            -   **Suplementos:** Suplementos potenciales que podrían ayudar (p. ej., "Considera suplementar con Vitamina D...").
            -   **Estilo de Vida y Entrenamiento:** Sugerencias sobre sueño, manejo del estrés o posibles modificaciones en el entrenamiento.
        4.  **Descargo de Responsabilidad:** Incluye un descargo de responsabilidad claro que indique que este análisis es para fines informativos y no sustituye el consejo médico profesional.
        5.  Devuelve la respuesta como un único objeto JSON que se adhiera estrictamente al esquema proporcionado. No incluyas ningún formato markdown.
    `;

    const analyzedMarkerSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            value: { type: Type.STRING },
            unit: { type: Type.STRING },
            optimalRange: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Óptimo", "Límite", "Alto", "Bajo"] },
            interpretation: { type: Type.STRING }
        },
        required: ["name", "value", "unit", "optimalRange", "status", "interpretation"]
    };

    const recommendationsSchema = {
        type: Type.OBJECT,
        properties: {
            nutrition: { type: Type.ARRAY, items: { type: Type.STRING } },
            supplements: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyle: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recomendaciones de Estilo de Vida y Entrenamiento" }
        },
        required: ["nutrition", "supplements", "lifestyle"]
    };

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
            analyzedMarkers: { type: Type.ARRAY, items: analyzedMarkerSchema },
            recommendations: recommendationsSchema
        },
        required: ["summary", "disclaimer", "analyzedMarkers", "recommendations"]
    };

    const response = await ai.models.generateContent({
        model: API_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const analysisData = JSON.parse(response.text || '{}');
    return analysisData;
};

interface RecipeGenerationParams {
    macroGoals: MacroGoals;
    dietaryPreferences: string[];
    allergies: string[];
}

// Omit id because it will be generated client-side
export const generateRecipesApi = async (params: RecipeGenerationParams): Promise<Omit<Recipe, 'id'>[]> => {
    const ai = await getAiClient();

    const preferences = params.dietaryPreferences.length > 0 ? `Preferencias dietéticas: ${params.dietaryPreferences.join(', ')}.` : '';
    const allergiesInfo = params.allergies.length > 0 ? `El usuario es alérgico a: ${params.allergies.join(', ')}. Evita estrictamente estos ingredientes.` : '';

    const prompt = `
        Eres un experto nutricionista deportivo. Tu tarea es generar 2-3 recetas deliciosas, saludables y fáciles de hacer basadas en los objetivos de macros y restricciones dietéticas del usuario.

        Perfil del Usuario:
        - Objetivo de Calorías: ${params.macroGoals.calories} kcal
        - Objetivo de Proteínas: ${params.macroGoals.protein} g
        - Objetivo de Carbohidratos: ${params.macroGoals.carbs} g
        - Objetivo de Grasas: ${params.macroGoals.fats} g
        - ${preferences}
        - ${allergiesInfo}

        Instrucciones:
        1.  Genera 2 o 3 recetas distintas (p. ej., desayuno, almuerzo, cena).
        2.  Para cada receta, proporciona un nombre, descripción, tipo de comida, tiempos de preparación y cocción, una lista de ingredientes con cantidades, instrucciones paso a paso y macros totales.
        3.  Los macros para cada receta deben ser estimados y contribuir razonablemente a los objetivos diarios del usuario.
        4.  Para cada ingrediente, proporciona su nombre, cantidad, macros estimados (calorías, proteínas, carbohidratos, grasas), una categoría (p. ej., proteína, carbohidrato, vegetal, grasa, otros), y una lista de posibles sustitutos.
        5.  Asegúrate de que las instrucciones sean claras y concisas.
        6.  Devuelve la respuesta como un único array JSON de objetos de receta que se adhiera estrictamente al esquema proporcionado. No incluyas ningún formato markdown.
    `;

    const macroSchema = {
        type: Type.OBJECT,
        properties: {
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
        },
        required: ['calories', 'protein', 'carbs', 'fats']
    };

    const ingredientSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            amount: { type: Type.STRING },
            macros: macroSchema,
            category: { type: Type.STRING },
            substitutes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['name', 'amount', 'macros', 'category', 'substitutes']
    };

    const recipeSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            mealType: { type: Type.STRING, enum: ['desayuno', 'almuerzo', 'cena', 'snack'] },
            prepTime: { type: Type.INTEGER },
            cookTime: { type: Type.INTEGER },
            ingredients: { type: Type.ARRAY, items: ingredientSchema },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalMacros: macroSchema,
        },
        required: ['name', 'description', 'mealType', 'prepTime', 'cookTime', 'ingredients', 'instructions', 'totalMacros']
    };

    const responseSchema = {
        type: Type.ARRAY,
        items: recipeSchema
    };

    const response = await ai.models.generateContent({
        model: API_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const recipeData = JSON.parse(response.text || '[]');
    return recipeData;
};


interface OverloadDetectionParams {
    painAreas: BodyPart[];
    activityLevel: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta';
    recentWorkouts: string[];
}

interface OverloadDetectionResponse {
    overloadData: OverloadData[];
    correctiveExercises: CorrectiveExercise[];
}

export const detectOverloadApi = async (params: OverloadDetectionParams): Promise<OverloadDetectionResponse> => {
    const ai = await getAiClient();

    const prompt = `
        Eres un experto fisioterapeuta deportivo y kinesiólogo. Tu tarea es analizar las molestias musculares/articulares reportadas por un usuario y su perfil de actividad para detectar posibles áreas de sobrecarga y recomendar ejercicios correctivos.

        Perfil del Usuario:
        - Áreas de Molestia/Tensión: ${params.painAreas.join(', ')}
        - Nivel de Actividad: ${params.activityLevel}
        - Entrenamientos Recientes (si se proporcionan): ${params.recentWorkouts.join(', ') || 'No proporcionado'}

        Instrucciones:
        1.  Analiza la entrada del usuario para identificar patrones de sobrecarga muscular, tendinosa o articular.
        2.  Para cada área de molestia reportada, genera un objeto 'OverloadData'.
            -   Estima la 'severidad' en una escala de 1 a 10.
            -   Determina la 'frecuencia' probable ('ocasional', 'frecuente', 'constante').
            -   Clasifica el 'tipo' de sobrecarga ('muscular', 'articular', 'tendinosa').
        3.  Basado en las sobrecargas detectadas, recomienda un conjunto de 3-5 objetos 'CorrectiveExercise' apropiados.
            -   Para cada ejercicio, proporciona un nombre, una descripción clara, duración/repeticiones, equipamiento requerido ('ninguno', 'banda', 'pelota', 'rodillo'), y la(s) principal(es) parte(s) del cuerpo a la(s) que se dirige.
            -   Los ejercicios deben centrarse en la movilidad, la activación o la liberación de tensión en las áreas afectadas y sus cadenas cinéticas relacionadas. Por ejemplo, si el usuario reporta dolor de rodilla, podrías recomendar ejercicios de activación de glúteos y movilidad de cadera.
        4.  Devuelve la respuesta como un único objeto JSON que contiene dos claves: 'overloadData' (un array) y 'correctiveExercises' (un array), adhiriéndose estrictamente al esquema proporcionado. No incluyas ningún formato markdown.
    `;
    
    const overloadDataSchema = {
        type: Type.OBJECT,
        properties: {
            bodyPart: { type: Type.STRING },
            severity: { type: Type.INTEGER },
            lastIncident: { type: Type.STRING, description: "Opcional: ej., 'hace 2 días'" },
            frequency: { type: Type.STRING, enum: ['ocasional', 'frecuente', 'constante'] },
            type: { type: Type.STRING, enum: ['muscular', 'articular', 'tendinosa'] },
        },
        required: ['bodyPart', 'severity', 'frequency', 'type']
    };

    const correctiveExerciseSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            duration: { type: Type.STRING, description: "ej., '3 series x 10 reps' o '2 minutos'" },
            equipment: { type: Type.STRING, enum: ['ninguno', 'banda', 'pelota', 'rodillo'] },
            videoUrl: { type: Type.STRING },
            targetArea: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['name', 'description', 'duration', 'equipment', 'targetArea']
    };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            overloadData: { type: Type.ARRAY, items: overloadDataSchema },
            correctiveExercises: { type: Type.ARRAY, items: correctiveExerciseSchema },
        },
        required: ['overloadData', 'correctiveExercises']
    };
    
    const response = await ai.models.generateContent({
        model: API_CONFIG.model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const overloadResponseData = JSON.parse(response.text || '{}');
    return overloadResponseData;
};