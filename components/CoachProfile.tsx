// CoachProfile - Componente para mostrar el perfil detallado de un coach
import { Coach } from "../lib/coaches";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";
import { Badge } from "./ui";
import { Button } from "./ui";
import { 
  Dumbbell, 
  Activity, 
  Apple, 
  Brain, 
  Heart, 
  Star, 
  Award, 
  Calendar, 
  Globe, 
  MessageSquare,
  Zap
} from "lucide-react";

interface CoachProfileProps {
  coach: Coach;
  onSelect?: (coach: Coach) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
}

export default function CoachProfile({ 
  coach, 
  onSelect, 
  isSelected = false,
  showSelectButton = true
}: CoachProfileProps) {
  // Función para obtener iconos según la especialidad
  const getSpecialtyIcon = () => {
    switch (coach.specialty) {
      case 'strength': return <Dumbbell className="w-5 h-5" />;
      case 'calisthenics': return <Activity className="w-5 h-5" />;
      case 'yoga': return <Heart className="w-5 h-5" />;
      case 'nutrition': return <Apple className="w-5 h-5" />;
      case 'psychology': return <Brain className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  // Función para obtener color según la personalidad
  const getPersonalityColor = () => {
    switch (coach.personality) {
      case 'motivational': return 'bg-red-100 text-red-800';
      case 'scientific': return 'bg-blue-100 text-blue-800';
      case 'mindful': return 'bg-green-100 text-green-800';
      case 'disciplinarian': return 'bg-purple-100 text-purple-800';
      case 'adaptive': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener habilidades según el tipo de coach
  const getCoachSkills = () => {
    switch (coach.specialty) {
      case 'strength':
        const strengthCoach = coach as import("../lib/coaches").StrengthCoach;
        return [
          { icon: <Dumbbell className="w-4 h-4" />, label: 'Áreas de Enfoque', value: strengthCoach.focusAreas.join(', ') },
          { icon: <Zap className="w-4 h-4" />, label: 'Métodos Preferidos', value: strengthCoach.preferredMethods.join(', ') },
          { icon: <Activity className="w-4 h-4" />, label: 'Equipamiento', value: strengthCoach.equipmentExpertise.join(', ') }
        ];
      case 'calisthenics':
        const calisthenicsCoach = coach as import("../lib/coaches").CalisthenicsCoach;
        return [
          { icon: <Activity className="w-4 h-4" />, label: 'Progresiones', value: calisthenicsCoach.skillProgressions.join(', ') },
          { icon: <Heart className="w-4 h-4" />, label: 'Enfoque Corporal', value: calisthenicsCoach.bodyweightFocus.join(', ') },
          { icon: <Zap className="w-4 h-4" />, label: 'Movilidad', value: calisthenicsCoach.mobilityEmphasis ? 'Énfasis en movilidad' : 'Enfoque en fuerza' }
        ];
      case 'yoga':
        const yogaCoach = coach as import("../lib/coaches").YogaCoach;
        return [
          { icon: <Heart className="w-4 h-4" />, label: 'Estilos de Yoga', value: yogaCoach.yogaStyles.join(', ') },
          { icon: <Brain className="w-4 h-4" />, label: 'Meditación', value: yogaCoach.meditationExpertise.join(', ') },
          { icon: <Activity className="w-4 h-4" />, label: 'Anatomía', value: yogaCoach.anatomyKnowledge.join(', ') }
        ];
      case 'nutrition':
        const nutritionCoach = coach as import("../lib/coaches").NutritionCoach;
        return [
          { icon: <Apple className="w-4 h-4" />, label: 'Enfoques Dietéticos', value: nutritionCoach.dietaryApproaches.join(', ') },
          { icon: <Award className="w-4 h-4" />, label: 'Certificación', value: nutritionCoach.certification },
          { icon: <Zap className="w-4 h-4" />, label: 'Enfoque de Macros', value: nutritionCoach.macroFocus.join(', ') }
        ];
      case 'psychology':
        const psychologyCoach = coach as import("../lib/coaches").PsychologyCoach;
        return [
          { icon: <Brain className="w-4 h-4" />, label: 'Enfoques Terapéuticos', value: psychologyCoach.therapeuticApproaches.join(', ') },
          { icon: <Heart className="w-4 h-4" />, label: 'Habilidades Mentales', value: psychologyCoach.mentalSkills.join(', ') },
          { icon: <Star className="w-4 h-4" />, label: 'Especialización', value: psychologyCoach.specialization.join(', ') }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${getPersonalityGradient(coach.personality)}`}></div>
      
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={coach.avatar} 
                alt={coach.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
              />
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full text-blue-500">
                {getSpecialtyIcon()}
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">{coach.name}</CardTitle>
              <p className="text-gray-600">{coach.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className={getPersonalityColor()}>
                  {getPersonalityDisplayName(coach.personality)}
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {getSpecialtyDisplayName(coach.specialty)} Especialista
                </Badge>
              </div>
            </div>
          </div>
          
          {showSelectButton && (
            <Button 
              onClick={() => onSelect && onSelect(coach)}
              className={isSelected ? "bg-green-500 hover:bg-green-600" : ""}
            >
              {isSelected ? (
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Seleccionado
                </span>
              ) : (
                "Seleccionar Coach"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Información del Coach */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Experiencia: {coach.experience}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Globe className="w-5 h-5" />
            <span>Idiomas: {coach.languages.map(lang => getLanguageName(lang)).join(', ')}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span>Estilo: {coach.communicationStyle}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Award className="w-5 h-5" />
            <span>Filosofía: {coach.trainingPhilosophy.substring(0, 50)}...</span>
          </div>
        </div>
        
        {/* Habilidades Específicas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Habilidades Especializadas</h3>
          <div className="space-y-3">
            {getCoachSkills().map((skill, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="mt-0.5 text-blue-500">
                  {skill.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{skill.label}</div>
                  <div className="text-sm text-gray-600">{skill.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Técnicas de Motivación */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Mis Técnicas de Motivación</h3>
          <div className="flex flex-wrap gap-2">
            {coach.motivationTechniques.map((technique, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {technique}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Cita Filosófica */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 mt-0.5">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="italic text-gray-800">"{coach.trainingPhilosophy}"</p>
              <p className="text-sm text-gray-600 mt-2">- {coach.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funciones auxiliares
const getPersonalityGradient = (personality: string): string => {
  switch (personality) {
    case 'motivational': return 'bg-gradient-to-r from-red-500 to-orange-500';
    case 'scientific': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    case 'mindful': return 'bg-gradient-to-r from-green-500 to-teal-500';
    case 'disciplinarian': return 'bg-gradient-to-r from-purple-500 to-indigo-500';
    case 'adaptive': return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
  }
};

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

const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'es': 'Español',
    'en': 'Inglés',
    'zh': 'Chino',
    'hi': 'Hindi',
    'fr': 'Francés',
    'de': 'Alemán'
  };
  return languages[code] || code;
};