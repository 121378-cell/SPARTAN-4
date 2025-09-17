// Componente CoachSelector para SPARTAN 4
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { Button } from "./ui";
import { 
  Coach, 
  CoachPreferences, 
  CoachSelectionResult, 
  CoachSpecialty, 
  CoachPersonality,
  selectBestCoach,
  PREDEFINED_COACHES,
  getCoachesBySpecialty
} from "../lib/coaches";
import { TrainingLevel } from "../lib/types";
import { useFormValidation } from "../lib/validation";

interface CoachSelectorProps {
  onCoachSelect: (coach: Coach) => void;
  currentCoach?: Coach;
}

export default function CoachSelector({ onCoachSelect, currentCoach }: CoachSelectorProps) {
  const [preferences, setPreferences] = useState<CoachPreferences>({
    specialty: 'strength',
    personality: 'motivational',
    language: 'es',
    experienceLevel: 'beginner',
    goals: [],
    communicationStyle: 'encouraging'
  });
  
  const [selectionResult, setSelectionResult] = useState<CoachSelectionResult | null>(null);
  const [showAllCoaches, setShowAllCoaches] = useState(false);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(currentCoach || null);
  
  const { validateField, clearErrors, errors } = useFormValidation();

  // Efecto para filtrar coaches cuando cambia la especialidad
  useEffect(() => {
    const coaches = getCoachesBySpecialty(preferences.specialty);
    setFilteredCoaches(coaches);
    
    // Si hay un coach seleccionado que no coincide con la especialidad, limpiar selección
    if (selectedCoach && selectedCoach.specialty !== preferences.specialty) {
      setSelectedCoach(null);
    }
  }, [preferences.specialty, selectedCoach]);

  // Efecto para calcular recomendación cuando cambian las preferencias
  useEffect(() => {
    if (preferences.specialty && preferences.personality) {
      const result = selectBestCoach(preferences);
      setSelectionResult(result);
    }
  }, [preferences]);

  const handlePreferenceChange = (field: keyof CoachPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectCoach = (coach: Coach) => {
    setSelectedCoach(coach);
    onCoachSelect(coach);
  };

  const handleConfirmSelection = () => {
    if (selectedCoach) {
      onCoachSelect(selectedCoach);
    }
  };

  const specialtyOptions: { value: CoachSpecialty; label: string; icon: string }[] = [
    { value: 'strength', label: 'Fuerza', icon: '💪' },
    { value: 'calisthenics', label: 'Calistenia', icon: '🤸' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { value: 'psychology', label: 'Psicología', icon: '🧠' }
  ];

  const personalityOptions: { value: CoachPersonality; label: string; description: string }[] = [
    { 
      value: 'motivational', 
      label: 'Motivacional', 
      description: 'Energético y entusiasta, con enfoque en superación personal' 
    },
    { 
      value: 'scientific', 
      label: 'Científico', 
      description: 'Basado en datos y evidencia, con explicaciones técnicas' 
    },
    { 
      value: 'mindful', 
      label: 'Consciente', 
      description: 'Enfocado en conexión mente-cuerpo y bienestar integral' 
    },
    { 
      value: 'disciplinarian', 
      label: 'Disciplinario', 
      description: 'Estructurado y consistente, con enfoque en sistemas' 
    },
    { 
      value: 'adaptive', 
      label: 'Adaptativo', 
      description: 'Flexible y personalizable según tus necesidades' 
    }
  ];

  const experienceOptions: { value: TrainingLevel; label: string }[] = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  const communicationOptions = [
    { value: 'direct', label: 'Directo y claro' },
    { value: 'encouraging', label: 'Alentador y positivo' },
    { value: 'technical', label: 'Técnico y detallado' },
    { value: 'conversational', label: 'Conversacional y amigable' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Elige tu Coach IA Perfecto
          </CardTitle>
          <CardDescription className="text-gray-600">
            Selecciona las características que más valoras en un entrenador para encontrar tu compañero ideal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de Especialidad */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">🎯 Especialidad</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {specialtyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('specialty', option.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
                    preferences.specialty === option.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-medium text-center">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Personalidad */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">🌟 Personalidad del Coach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personalityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('personality', option.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    preferences.personality === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Nivel de Experiencia */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">📊 Tu Nivel de Experiencia</h3>
            <div className="flex flex-wrap gap-3">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('experienceLevel', option.value)}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                    preferences.experienceLevel === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Estilo de Comunicación */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">💬 Estilo de Comunicación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {communicationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('communicationStyle', option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    preferences.communicationStyle === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultado de Recomendación */}
      {selectionResult && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-amber-800">
              🤖 Recomendación de Coach IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <img 
                  src={selectionResult.coach.avatar} 
                  alt={selectionResult.coach.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-200"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{selectionResult.coach.name}</h3>
                  <p className="text-amber-600 font-medium">
                    {getSpecialtyDisplayName(selectionResult.coach.specialty)} Especialista
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-amber-400">
                      {'★'.repeat(Math.floor(selectionResult.compatibilityScore / 20))}
                      {'☆'.repeat(5 - Math.floor(selectionResult.compatibilityScore / 20))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {selectionResult.compatibilityScore}% compatibilidad
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{selectionResult.coach.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {selectionResult.reasons.map((reason, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
              
              <Button 
                onClick={() => handleSelectCoach(selectionResult.coach)}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white"
              >
                {selectedCoach?.id === selectionResult.coach.id ? '✓ Seleccionado' : 'Elegir este Coach'}
              </Button>
            </div>
            
            {selectionResult.recommendedAlternatives.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2"> coaches alternativos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectionResult.recommendedAlternatives.map((coach) => (
                    <div 
                      key={coach.id} 
                      className="bg-white rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <img 
                          src={coach.avatar} 
                          alt={coach.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-800">{coach.name}</div>
                          <div className="text-xs text-gray-500">
                            {getSpecialtyDisplayName(coach.specialty)}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full mt-2 text-xs"
                        onClick={() => handleSelectCoach(coach)}
                      >
                        {selectedCoach?.id === coach.id ? '✓ Seleccionado' : 'Elegir'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Todos los Coaches de la Especialidad Seleccionada */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                🏫 Todos los Coaches de {getSpecialtyDisplayName(preferences.specialty)}
              </CardTitle>
              <CardDescription>
                Explora todos los coaches disponibles en esta especialidad
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAllCoaches(!showAllCoaches)}
            >
              {showAllCoaches ? 'Ocultar' : 'Ver Todos'}
            </Button>
          </div>
        </CardHeader>
        {showAllCoaches && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCoaches.map((coach) => (
                <Card 
                  key={coach.id} 
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCoach?.id === coach.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleSelectCoach(coach)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={coach.avatar} 
                        alt={coach.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate">{coach.name}</h3>
                        <p className="text-sm text-gray-600 truncate">
                          {getSpecialtyDisplayName(coach.specialty)} Especialista
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getPersonalityDisplayName(coach.personality)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {coach.description}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      variant={selectedCoach?.id === coach.id ? "default" : "outline"}
                    >
                      {selectedCoach?.id === coach.id ? '✓ Seleccionado' : 'Seleccionar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Botón de Confirmación */}
      {selectedCoach && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
          <Button 
            size="lg"
            className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleConfirmSelection}
          >
            💪 Comenzar con {selectedCoach.name}
          </Button>
        </div>
      )}
    </div>
  );
}

// Funciones auxiliares para mostrar nombres
const getSpecialtyDisplayName = (specialty: CoachSpecialty): string => {
  const names: Record<CoachSpecialty, string> = {
    'strength': 'Fuerza',
    'calisthenics': 'Calistenia',
    'yoga': 'Yoga',
    'nutrition': 'Nutrición',
    'psychology': 'Psicología'
  };
  return names[specialty];
};

const getPersonalityDisplayName = (personality: CoachPersonality): string => {
  const names: Record<CoachPersonality, string> = {
    'motivational': 'Motivacional',
    'scientific': 'Científico',
    'mindful': 'Consciente',
    'disciplinarian': 'Disciplinario',
    'adaptive': 'Adaptativo'
  };
  return names[personality];
};