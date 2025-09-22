/**
 * Personalized Dashboard - Tablero Personalizado
 * Demonstrates integration of Extreme Personalization Engine with UI components
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { Button } from './ui';
import { 
  Calendar, 
  Clock, 
  Heart, 
  User, 
  Settings, 
  Plus, 
  Utensils, 
  Zap, 
  Droplets, 
  StretchHorizontal, 
  LogOut, 
  Brain, 
  Microscope, 
  TrendingUp, 
  BarChart3, 
  Bell, 
  ChevronRight, 
  Dumbbell, 
  Target, 
  Award, 
  Activity 
} from 'lucide-react';
import { ExtremePersonalizationEngine } from '../lib/extreme-personalization-engine';
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';

interface PersonalizedDashboardProps {
  userData: UserData;
  workoutPlans: WorkoutPlan[];
  progressData: ProgressData[];
  onGenerateWorkout: () => void;
  isGeneratingWorkout: boolean;
  onSelectWorkout: (plan: WorkoutPlan) => void;
  onProfileClick: () => void;
  onNavigateToRecipes: () => void;
  onNavigateToCircadian: () => void;
  onNavigateToWearable: () => void;
  onNavigateToBloodTestAnalyzer: () => void;
  onNavigateToOverloadDetection: () => void;
  onNavigateToSpartanXXII?: () => void;
  onNavigateToScientificAI?: () => void;
  onNavigateToAdvancedAI?: () => void;
  onNavigateToAdvancedWorkout?: () => void;
  onNavigateToAdaptiveTraining?: () => void;
  onNavigateToTechniqueAnalysis?: () => void;
  onNavigateToAdaptiveNutrition?: () => void;
  onNavigateToProgress?: () => void;
  onNavigateToProgressComparison?: () => void;
  onNavigateToWorkoutFlow?: () => void;
  onNavigateToPredictiveAnalytics?: () => void;
  onNavigateToNutrition?: () => void;
  onNavigateToChatMaestro?: () => void;
  onNavigateToSpartanDashboard?: () => void;
  onLogout: () => void;
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  userData,
  workoutPlans,
  progressData,
  onGenerateWorkout,
  isGeneratingWorkout,
  onSelectWorkout,
  onProfileClick,
  onNavigateToRecipes,
  onNavigateToCircadian,
  onNavigateToWearable,
  onNavigateToBloodTestAnalyzer,
  onNavigateToOverloadDetection,
  onNavigateToSpartanXXII,
  onNavigateToScientificAI,
  onNavigateToAdvancedAI,
  onNavigateToAdvancedWorkout,
  onNavigateToAdaptiveTraining,
  onNavigateToTechniqueAnalysis,
  onNavigateToAdaptiveNutrition,
  onNavigateToProgress,
  onNavigateToProgressComparison,
  onNavigateToWorkoutFlow,
  onNavigateToPredictiveAnalytics,
  onNavigateToNutrition,
  onNavigateToChatMaestro,
  onNavigateToSpartanDashboard,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'progress'>('dashboard');
  const [personalizationEngine] = useState(() => ExtremePersonalizationEngine.getInstance());
  const [uiAdaptations, setUiAdaptations] = useState<any[]>([]);
  const [personalizedEvents, setPersonalizedEvents] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  // Initialize personalization
  useEffect(() => {
    const initializePersonalization = async () => {
      // Create or update user profile
      const userProfile = await personalizationEngine.createOrUpdateProfile(
        userData.name || 'default-user',
        {
          theme: 'dark', // This would be dynamic based on user preferences
          colorScheme: '#6366f1', // This would be dynamic
          layout: 'comfortable', // This would be dynamic
          terminologyStyle: 'motivational', // This would be dynamic
        }
      );
      
      setProfile(userProfile);
      
      // Generate personalization context
      const context = await personalizationEngine.generatePersonalizationContext(
        userData.name || 'default-user',
        'dashboard'
      );
      
      // Generate UI adaptations
      const adaptations = await personalizationEngine.generateUIAdaptations(context);
      setUiAdaptations(adaptations);
      
      // Generate personalized calendar
      const events = await personalizationEngine.generatePersonalizedCalendar(context);
      setPersonalizedEvents(events);
    };
    
    initializePersonalization();
  }, [userData, personalizationEngine]);

  // Apply UI adaptations
  useEffect(() => {
    uiAdaptations.forEach(adaptation => {
      // In a real implementation, we would apply the adaptations to the UI
      // For this demo, we'll just log them
      console.log('Applying UI adaptation:', adaptation);
    });
  }, [uiAdaptations]);

  // Calculate weekly progress
  const weeklyProgress = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyData = progressData.filter(p => 
      new Date(p.date) >= oneWeekAgo && new Date(p.date) <= now
    );
    
    return weeklyData.length;
  }, [progressData]);
  
  // Calculate consistency (percentage of days with workouts in the last week)
  const consistency = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const daysInWeek = 7;
    const workoutDays = new Set(progressData
      .filter(p => new Date(p.date) >= oneWeekAgo && new Date(p.date) <= now)
      .map(p => new Date(p.date).toDateString())
    ).size;
    
    return Math.round((workoutDays / daysInWeek) * 100);
  }, [progressData]);
  
  // Motivational quotes based on personalization
  const motivationalQuotes = useMemo(() => {
    // These would be personalized based on user profile
    const baseQuotes = [
      "La disciplina es el puente entre metas y logros.",
      "Cada entrenamiento te acerca a tu mejor versión.",
      "La fuerza no viene de lo físico, viene de la voluntad indomable.",
      "El dolor que sientes hoy es la fuerza que sentirás mañana.",
      "No cuentes los días, haz que los días cuenten."
    ];
    
    // Adapt quotes based on user profile if available
    if (profile?.terminologyStyle === 'technical') {
      baseQuotes.push("La optimización del rendimiento requiere consistencia y análisis de datos.");
      baseQuotes.push("Los principios científicos del entrenamiento garantizan progresos sostenibles.");
    } else if (profile?.terminologyStyle === 'casual') {
      baseQuotes.push("¡Vas genial! Sigue así y verás resultados increíbles.");
      baseQuotes.push("Cada día es una nueva oportunidad para ser mejor que ayer.");
    }
    
    return baseQuotes;
  }, [profile]);
  
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % motivationalQuotes.length);
    }, 10000); // Change quote every 10 seconds
    
    return () => clearInterval(interval);
  }, [motivationalQuotes.length]);

  // Quick stats
  const quickStats = useMemo(() => ({
    totalWorkouts: progressData.length,
    thisWeek: weeklyProgress
  }), [progressData.length, weeklyProgress]);

  // Personalized next workout
  const nextWorkout = useMemo(() => {
    if (personalizedEvents.length > 0) {
      const workoutEvents = personalizedEvents.filter(event => event.type === 'workout');
      if (workoutEvents.length > 0) {
        return workoutEvents[0];
      }
    }
    return null;
  }, [personalizedEvents]);

  // Personalized recommendations
  const recommendations = useMemo(() => {
    // In a real implementation, these would come from the personalization engine
    return [
      {
        id: '1',
        title: 'Optimiza tu recuperación',
        description: 'Basado en tu historial, te recomiendo añadir 20 minutos de estiramientos después de entrenar.',
        priority: 'medium',
        icon: <Droplets className="h-5 w-5" />
      },
      {
        id: '2',
        title: 'Ajusta tu nutrición',
        description: 'Para alcanzar tus objetivos de fuerza, considera aumentar tu ingesta de proteínas en 15g diarios.',
        priority: 'high',
        icon: <Utensils className="h-5 w-5" />
      }
    ];
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center">
            <Brain className="mr-2 h-6 w-6 text-indigo-400" />
            SPARTAN 4
          </h1>
          <p className="text-sm text-gray-400 mt-1">Entrenamiento Personalizado</p>
        </div>
        
        <nav className="flex-1 py-4">
          <button 
            className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          
          <button 
            className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
              activeTab === 'workouts' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('workouts')}
          >
            <Dumbbell className="mr-3 h-5 w-5" />
            Entrenamientos
          </button>
          
          <button 
            className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
              activeTab === 'progress' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            <TrendingUp className="mr-3 h-5 w-5" />
            Progreso
          </button>
          
          <div className="border-t border-gray-700 mt-4 pt-4">
            <button 
              className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={onNavigateToRecipes}
            >
              <Utensils className="mr-3 h-5 w-5" />
              Nutrición
            </button>
            
            <button 
              className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={onNavigateToCircadian}
            >
              <Clock className="mr-3 h-5 w-5" />
              Circadiano
            </button>
            
            <button 
              className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={onNavigateToWearable}
            >
              <Heart className="mr-3 h-5 w-5" />
              Wearables
            </button>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors"
            onClick={onProfileClick}
          >
            <User className="mr-3 h-5 w-5" />
            Perfil
          </button>
          
          <button 
            className="flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Hola, {userData.name}</h2>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button 
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={onProfileClick}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6 rounded-xl mb-6">
            <div className="flex items-center mb-3">
              <Award className="h-5 w-5 mr-2 text-yellow-400" />
              <p className="text-sm font-medium">Tu mantra diario</p>
            </div>
            <p className="text-lg font-medium italic">"{motivationalQuotes[currentQuote]}"</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Esta semana</p>
                  <p className="text-2xl font-bold text-white">{weeklyProgress}</p>
                  <p className="text-xs text-gray-500 mt-1">sesiones</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Consistencia</p>
                  <p className="text-2xl font-bold text-white">{consistency}%</p>
                  <p className="text-xs text-gray-500 mt-1">objetivo</p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{quickStats.totalWorkouts}</p>
                  <p className="text-xs text-gray-500 mt-1">entrenamientos</p>
                </div>
                <Dumbbell className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Próximo</p>
                  <p className="text-lg font-bold text-white">
                    {nextWorkout ? 
                      new Date(nextWorkout.startTime).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {nextWorkout ? nextWorkout.title : 'Sin programar'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Recomendaciones Personalizadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map(rec => (
                <div 
                  key={rec.id} 
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-indigo-900 rounded-lg mr-3">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tu Agenda Personalizada</h3>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {personalizedEvents.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {personalizedEvents.slice(0, 5).map(event => (
                    <li key={event.id} className="p-4 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3" 
                            style={{ backgroundColor: event.visualStyle.color }}
                          />
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-400">
                              {new Date(event.startTime).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {event.personalizedDescription}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                  <p>No hay eventos programados</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;