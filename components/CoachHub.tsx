// CoachHub - Componente principal para el sistema de coaches IA
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui";
import { Button } from "./ui";
import { 
  Coach,
  CoachSpecialty,
  CoachPersonality
} from "../lib/coaches";
import { useCoachSelection } from "../lib/useCoachSelection";
import CoachSelector from "./CoachSelector";
import CoachDashboard from "./CoachDashboard";
import CoachGallery from "./CoachGallery";
import CoachProfile from "./CoachProfile";

export default function CoachHub() {
  const {
    selectedCoach,
    preferences,
    recommendation,
    filteredCoaches,
    isLoading,
    updatePreferences,
    selectCoach,
    clearSelection
  } = useCoachSelection();
  
  const [activeView, setActiveView] = useState<'selector' | 'gallery' | 'dashboard'>(
    selectedCoach ? 'dashboard' : 'selector'
  );

  // Función para manejar la selección de coach
  const handleCoachSelect = (coach: Coach) => {
    selectCoach(coach);
    setActiveView('dashboard');
  };

  // Función para volver a la selección
  const handleBackToSelection = () => {
    clearSelection();
    setActiveView('selector');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎯 Centro de Coaches IA</h1>
          <p className="text-gray-600 mt-1">
            {selectedCoach 
              ? `Trabajando con ${selectedCoach.name}` 
              : 'Elige el coach perfecto para tu viaje fitness'}
          </p>
        </div>
        
        {selectedCoach && (
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('selector')}
            >
              Cambiar Coach
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setActiveView('gallery')}
            >
              Ver Todos
            </Button>
          </div>
        )}
      </div>

      {/* Vista Principal */}
      {!selectedCoach ? (
        // Vista de Selección
        <div className="space-y-6">
          {activeView === 'selector' && (
            <CoachSelector 
              onCoachSelect={handleCoachSelect}
            />
          )}
          
          {activeView === 'gallery' && (
            <CoachGallery 
              onCoachSelect={handleCoachSelect}
              selectedCoach={selectedCoach}
            />
          )}
        </div>
      ) : (
        // Vista de Dashboard del Coach
        activeView === 'dashboard' ? (
          <CoachDashboard 
            coach={selectedCoach}
            onNewWorkout={() => console.log('Nuevo entrenamiento')}
            onNewMealPlan={() => console.log('Nuevo plan de comidas')}
            onMentalSession={() => console.log('Sesión mental')}
            onProgressReview={() => console.log('Revisión de progreso')}
          />
        ) : (
          // Vista de Galería con coach seleccionado
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  🎯 Tu Coach Seleccionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CoachProfile 
                  coach={selectedCoach}
                  isSelected={true}
                  showSelectButton={false}
                />
                <div className="mt-4 flex space-x-3">
                  <Button onClick={() => setActiveView('dashboard')}>
                    Ir al Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleBackToSelection}>
                    Cambiar Coach
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <CoachGallery 
              onCoachSelect={handleCoachSelect}
              selectedCoach={selectedCoach}
            />
          </div>
        )
      )}

      {/* Sección de Recomendación (si no hay coach seleccionado) */}
      {!selectedCoach && recommendation && activeView === 'selector' && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-800">
              🤖 Recomendación Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <img 
                  src={recommendation.coach.avatar} 
                  alt={recommendation.coach.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{recommendation.coach.name}</h3>
                  <p className="text-blue-600 font-medium">
                    {getSpecialtyDisplayName(recommendation.coach.specialty)} Especialista
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-amber-400">
                      {'★'.repeat(Math.floor(recommendation.compatibilityScore / 20))}
                      {'☆'.repeat(5 - Math.floor(recommendation.compatibilityScore / 20))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {recommendation.compatibilityScore}% compatibilidad
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleCoachSelect(recommendation.coach)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Probar este Coach
                </Button>
              </div>
              
              <p className="mt-3 text-gray-700">{recommendation.coach.description}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendation.reasons.map((reason, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
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