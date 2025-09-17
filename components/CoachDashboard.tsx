// CoachDashboard - Dashboard para interactuar con el coach IA seleccionado
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";
import { Button } from "./ui";
import { 
  Coach, 
  StrengthCoach, 
  CalisthenicsCoach, 
  YogaCoach, 
  NutritionCoach, 
  PsychologyCoach 
} from "../lib/coaches";
import { MessageSquare, Dumbbell, Activity, Apple, Brain, Heart, Star, Zap } from "lucide-react";

interface CoachDashboardProps {
  coach: Coach;
  onNewWorkout?: () => void;
  onNewMealPlan?: () => void;
  onMentalSession?: () => void;
  onProgressReview?: () => void;
}

export default function CoachDashboard({ 
  coach, 
  onNewWorkout, 
  onNewMealPlan, 
  onMentalSession,
  onProgressReview 
}: CoachDashboardProps) {
  const [motivationalQuote, setMotivationalQuote] = useState<string>("");
  const [coachStats, setCoachStats] = useState({
    sessions: 12,
    completions: 95,
    streak: 7
  });

  // Efecto para obtener una cita motivacional según el coach
  useEffect(() => {
    const quotes = getMotivationalQuotes(coach);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);
  }, [coach]);

  // Función para obtener citas motivacionales según el tipo de coach
  const getMotivationalQuotes = (coach: Coach): string[] => {
    switch (coach.specialty) {
      case 'strength':
        return [
          "La fuerza no se mide solo en kilos, sino en determinación.",
          "Cada repetición es un paso más cerca de tu mejor versión.",
          "El dolor es temporal, pero la fuerza es eterna.",
          "Levanta más que solo pesas. Levanta tu espíritu.",
          "La grandeza se forja en el hierro y el sudor."
        ];
      case 'calisthenics':
        return [
          "Tu cuerpo es tu gimnasio. Úsalo sabiamente.",
          "La maestría del movimiento precede a la fuerza.",
          "Controla tu cuerpo, controla tu vida.",
          "Cada movimiento es una danza de fuerza y gracia.",
          "La libertad del movimiento es la libertad del espíritu."
        ];
      case 'yoga':
        return [
          "La paz comienza con una respiración consciente.",
          "Tu práctica revela quién eres cuando nadie te observa.",
          "Encuentra tu centro en medio del caos.",
          "La flexibilidad del cuerpo refleja la flexibilidad de la mente.",
          "En la quietud, descubres tu verdadera fuerza."
        ];
      case 'nutrition':
        return [
          "Alimenta tu cuerpo, nutre tu alma.",
          "La comida es medicina cuando se elige con sabiduría.",
          "Cada bocado es una oportunidad para la salud.",
          "La nutrición es el cimiento de la transformación.",
          "Come conscientemente, vive plenamente."
        ];
      case 'psychology':
        return [
          "Tu mente es el campo de batalla donde se gana la grandeza.",
          "Los pensamientos son semillas. Planta sabiamente.",
          "La consistencia es la moneda de la confianza en uno mismo.",
          "Cada desafío es una oportunidad disfrazada.",
          "La victoria interna precede a la externa."
        ];
      default:
        return [
          "La excelencia es un hábito, no un acto.",
          "Cada día es una nueva oportunidad para mejorar.",
          "Tu potencial es ilimitado. Despiértalo.",
          "La disciplina es el puente entre metas y logros.",
          "Confía en el proceso. Confía en ti."
        ];
    }
  };

  // Función para obtener iconos según la especialidad
  const getSpecialtyIcon = () => {
    switch (coach.specialty) {
      case 'strength': return <Dumbbell className="w-6 h-6" />;
      case 'calisthenics': return <Activity className="w-6 h-6" />;
      case 'yoga': return <Heart className="w-6 h-6" />;
      case 'nutrition': return <Apple className="w-6 h-6" />;
      case 'psychology': return <Brain className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  // Función para obtener color según la personalidad
  const getPersonalityColor = () => {
    switch (coach.personality) {
      case 'motivational': return 'from-red-500 to-orange-500';
      case 'scientific': return 'from-blue-500 to-cyan-500';
      case 'mindful': return 'from-green-500 to-teal-500';
      case 'disciplinarian': return 'from-purple-500 to-indigo-500';
      case 'adaptive': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  // Función para obtener acciones específicas según la especialidad
  const getSpecialtyActions = () => {
    switch (coach.specialty) {
      case 'strength':
        return [
          { icon: <Dumbbell className="w-5 h-5" />, label: "Nuevo Entrenamiento", action: onNewWorkout },
          { icon: <Zap className="w-5 h-5" />, label: "Plan de Fuerza", action: onNewWorkout },
          { icon: <Activity className="w-5 h-5" />, label: "Progreso", action: onProgressReview }
        ];
      case 'calisthenics':
        return [
          { icon: <Activity className="w-5 h-5" />, label: "Nuevo Flujo", action: onNewWorkout },
          { icon: <Zap className="w-5 h-5" />, label: "Desafío de Habilidades", action: onNewWorkout },
          { icon: <Heart className="w-5 h-5" />, label: "Movilidad", action: onNewWorkout }
        ];
      case 'yoga':
        return [
          { icon: <Heart className="w-5 h-5" />, label: "Nueva Secuencia", action: onNewWorkout },
          { icon: <Brain className="w-5 h-5" />, label: "Meditación", action: onMentalSession },
          { icon: <Activity className="w-5 h-5" />, label: "Respiración", action: onNewWorkout }
        ];
      case 'nutrition':
        return [
          { icon: <Apple className="w-5 h-5" />, label: "Plan de Comidas", action: onNewMealPlan },
          { icon: <Zap className="w-5 h-5" />, label: "Recetas", action: onNewMealPlan },
          { icon: <Activity className="w-5 h-5" />, label: "Análisis Nutricional", action: onProgressReview }
        ];
      case 'psychology':
        return [
          { icon: <Brain className="w-5 h-5" />, label: "Sesión Mental", action: onMentalSession },
          { icon: <Heart className="w-5 h-5" />, label: "Mindfulness", action: onMentalSession },
          { icon: <Star className="w-5 h-5" />, label: "Objetivos", action: onProgressReview }
        ];
      default:
        return [
          { icon: <Zap className="w-5 h-5" />, label: "Entrenamiento", action: onNewWorkout },
          { icon: <Apple className="w-5 h-5" />, label: "Nutrición", action: onNewMealPlan },
          { icon: <Brain className="w-5 h-5" />, label: "Mental", action: onMentalSession }
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Coach */}
      <Card className={`bg-gradient-to-r ${getPersonalityColor()} text-white border-0`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="bg-white/20 p-2 rounded-full">
              <div className="bg-white p-2 rounded-full">
                {getSpecialtyIcon()}
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">Hola, soy {coach.name}</h1>
              <p className="text-white/90 mt-1">{coach.description}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {getSpecialtyDisplayName(coach.specialty)} Especialista
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {getPersonalityDisplayName(coach.personality)} Style
                </span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{coachStats.streak}</div>
              <div className="text-sm text-white/80">Días seguidos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cita Motivacional */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-500 p-2 rounded-full text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg italic text-gray-800">"{motivationalQuote}"</p>
              <p className="text-amber-600 font-medium mt-2">- {coach.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            🚀 Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getSpecialtyActions().map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-2 hover:border-blue-300"
              >
                <div className="text-blue-500">
                  {action.icon}
                </div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas del Coach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{coachStats.sessions}</div>
                <div className="text-sm text-gray-600">Sesiones conmigo</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{coachStats.completions}%</div>
                <div className="text-sm text-gray-600">Tasa de finalización</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{coachStats.streak}</div>
                <div className="text-sm text-gray-600">Racha actual</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filosofía del Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            📚 Mi Filosofía de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-gray-700">{coach.trainingPhilosophy}</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">Mi Enfoque:</h4>
              <ul className="mt-2 space-y-1">
                {coach.motivationTechniques.map((technique, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{technique}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Funciones auxiliares para mostrar nombres
const getSpecialtyDisplayName = (specialty: string): string => {
  const names: Record<string, string> = {
    'strength': 'Fuerza',
    'calisthenics': 'Calistenia',
    'yoga': 'Yoga',
    'nutrition': 'Nutrición',
    'psychology': 'Psicología'
  };
  return names[specialty] || specialty;
};

const getPersonalityDisplayName = (personality: string): string => {
  const names: Record<string, string> = {
    'motivational': 'Motivacional',
    'scientific': 'Científico',
    'mindful': 'Consciente',
    'disciplinarian': 'Disciplinario',
    'adaptive': 'Adaptativo'
  };
  return names[personality] || personality;
};