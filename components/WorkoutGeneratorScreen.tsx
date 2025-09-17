
import { useState } from "react";
import { generateMultiGoalWorkoutPlanApi } from "../lib/api";
import type { TrainingLevel, TrainingLocation, Equipment, InjuryHistory, TrainingDays, WorkoutPlan } from "../lib/types";
import GeneratorForm from "./GeneratorForm";
import PlanDisplay from "./PlanDisplay";
import { Button } from "./ui";

interface WorkoutGeneratorScreenProps {
    onPlanGenerated: (plan: WorkoutPlan) => void;
    onBack: () => void;
    setIsGenerating: (isGenerating: boolean) => void;
}

export default function WorkoutGeneratorScreen({ onPlanGenerated, onBack, setIsGenerating }: WorkoutGeneratorScreenProps) {
  // State for the form inputs
  const [level, setLevel] = useState<TrainingLevel>('intermediate');
  const [availableDays, setAvailableDays] = useState<TrainingDays>(3);
  const [trainingLocation, setTrainingLocation] = useState<TrainingLocation>('gym');
  const [equipment, setEquipment] = useState<Equipment>({
    dumbbells: true,
    barbell: true,
    kettlebells: false,
    resistanceBands: false,
    pullUpBar: true,
    bench: true,
    machine: true,
  });
  const [injuryHistory, setInjuryHistory] = useState<InjuryHistory>({
    hasInjuries: false,
    injuries: ''
  });
  const [previousProgress, setPreviousProgress] = useState<string>('');
  const [goals, setGoals] = useState<Record<string, boolean>>({
    strength: true,
    hypertrophy: true,
    definition: false,
    mobility: true,
    endurance: false
  });

  // State for the generated plan and loading status
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isGeneratingState, setIsGeneratingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsGeneratingState(true);
    setIsGenerating(true);
    setError(null);
    setGeneratedPlan(null);

    const activeGoals = Object.entries(goals)
      .filter(([_, selected]) => selected)
      .map(([goal]) => goal);
    
    if (activeGoals.length === 0) {
        setError("Please select at least one training goal.");
        setIsGeneratingState(false);
        setIsGenerating(false);
        return;
    }

    try {
      const planData = await generateMultiGoalWorkoutPlanApi({
        level,
        availableDays,
        trainingLocation,
        equipment,
        injuryHistory,
        previousProgress,
        goals: activeGoals
      });
      const newPlan = { ...planData, id: Date.now().toString() };
      setGeneratedPlan(newPlan);
    } catch (e) {
      console.error("Failed to generate workout plan:", e);
      
      // Mensajes de error más informativos
      if (e instanceof Error) {
        if (e.message.includes('API de Gemini no habilitada')) {
          setError(
            "\u26a0\ufe0f Gemini API no está habilitada. " +
            "Por favor sigue estos pasos:\n\n" +
            "1\ufe0f\u20e3 Ve a: https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview\n" +
            "2\ufe0f\u20e3 Haz clic en 'ENABLE'\n" +
            "3\ufe0f\u20e3 Espera 2-5 minutos\n" +
            "4\ufe0f\u20e3 Reinicia la aplicación\n\n" +
            "\ud83d\udcdd Consulta GEMINI_API_TROUBLESHOOTING.md para más ayuda"
          );
        } else if (e.message.includes('API Key inválida')) {
          setError(
            "\u26a0\ufe0f API Key inválida. " +
            "Por favor:\n\n" +
            "1\ufe0f\u20e3 Ve a: https://aistudio.google.com/apikey\n" +
            "2\ufe0f\u20e3 Crea una nueva API key\n" +
            "3\ufe0f\u20e3 Actualiza VITE_GEMINI_API_KEY en .env\n" +
            "4\ufe0f\u20e3 Reinicia la aplicación"
          );
        } else {
          setError(`Error al generar el plan: ${e.message}. Por favor inténtalo de nuevo.`);
        }
      } else {
        setError("Ocurrió un error inesperado. Por favor inténtalo de nuevo.");
      }
    } finally {
      setIsGeneratingState(false);
      setIsGenerating(false);
    }
  };

  const handleSavePlan = () => {
      if (generatedPlan) {
          onPlanGenerated(generatedPlan);
      }
  };

  const formProps = {
    level, setLevel,
    availableDays, setAvailableDays,
    trainingLocation, setTrainingLocation,
    equipment, setEquipment,
    injuryHistory, setInjuryHistory,
    previousProgress, setPreviousProgress,
    goals, setGoals,
    isGenerating: isGeneratingState,
    onGenerate: handleGeneratePlan
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Generador de Rutinas</h1>
                <p className="text-gray-600 text-lg">Crea tu plan de entrenamiento personalizado con IA</p>
            </div>
            <Button 
                variant="outline" 
                size="default" 
                onClick={onBack}
                className="h-12 px-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
                Volver al Dashboard
            </Button>
        </div>
        
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-8">
            <GeneratorForm {...formProps} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <PlanDisplay 
              plan={generatedPlan} 
              isGenerating={isGeneratingState}
              error={error}
            />
            {generatedPlan && !isGeneratingState && (
                <div className="flex justify-end">
                    <Button 
                        size="lg" 
                        variant="default" 
                        onClick={handleSavePlan}
                        className="h-14 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Guardar y Volver al Dashboard
                    </Button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

