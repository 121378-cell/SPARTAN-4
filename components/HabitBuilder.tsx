import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Circle, Zap, Target, Brain, Heart, Moon, Utensils } from 'lucide-react';
import { 
  HabitFormationEngine, 
  HabitFormationPlan, 
  MicroHabit, 
  HabitStack,
  HabitPsychologyProfile 
} from '@/lib/habitFormation';

interface HabitBuilderProps {
  userProfile: any;
  fitnessGoals: string[];
  onHabitPlanCreate?: (plan: HabitFormationPlan) => void;
}

export default function HabitBuilder({ userProfile, fitnessGoals, onHabitPlanCreate }: HabitBuilderProps) {
  const [habitEngine] = useState(new HabitFormationEngine());
  const [habitPlan, setHabitPlan] = useState<HabitFormationPlan | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<{ [category: string]: MicroHabit[] }>({});
  const [habitProgress, setHabitProgress] = useState<{ [habitId: string]: boolean }>({});
  const [psychologyProfile, setPsychologyProfile] = useState<HabitPsychologyProfile | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    initializePsychologyProfile();
  }, [userProfile]);

  useEffect(() => {
    if (psychologyProfile) {
      loadHabitCategories();
    }
  }, [psychologyProfile]);

  const initializePsychologyProfile = () => {
    // Crear perfil psicológico basado en datos del usuario
    const profile: HabitPsychologyProfile = {
      motivationalDrivers: {
        intrinsic: userProfile.motivationType === 'intrinsic' ? 8 : 5,
        extrinsic: userProfile.motivationType === 'extrinsic' ? 8 : 5,
        social: userProfile.socialMotivation || 6,
        achievement: userProfile.competitiveness || 7
      },
      behavioralTendencies: {
        consistency: userProfile.disciplineLevel === 'high' ? 8 : userProfile.disciplineLevel === 'moderate' ? 6 : 4,
        impulsiveness: 10 - (userProfile.disciplineLevel === 'high' ? 8 : 5),
        perfectionism: userProfile.perfectionism || 6,
        flexibility: userProfile.flexibility || 7
      },
      environmentalFactors: {
        timeAvailability: userProfile.timeAvailability || 'moderate',
        socialSupport: userProfile.socialSupport || 'moderate',
        stressLevel: userProfile.stressLevel || 'moderate'
      },
      preferredHabitStyle: userProfile.habitStyle || 'gradual'
    };

    setPsychologyProfile(profile);
  };

  const loadHabitCategories = () => {
    if (!psychologyProfile) return;

    const categories = ['fitness', 'nutrition', 'rest', 'mindset'] as const;
    const habits: { [category: string]: MicroHabit[] } = {};

    categories.forEach(category => {
      habits[category] = habitEngine.generateMicroHabits(category, psychologyProfile);
    });

    setSelectedHabits(habits);
  };

  const createHabitPlan = () => {
    if (!psychologyProfile) return;

    const plan = habitEngine.createHabitFormationPlan(
      psychologyProfile,
      fitnessGoals,
      { timeConstraints: userProfile.timeAvailability }
    );

    setHabitPlan(plan);
    onHabitPlanCreate?.(plan);

    // Inicializar progreso de hábitos
    const initialProgress: { [habitId: string]: boolean } = {};
    plan.targetHabits.forEach(stack => {
      stack.habits.forEach(habit => {
        initialProgress[habit.id] = false;
      });
    });
    setHabitProgress(initialProgress);
  };

  const toggleHabitCompletion = (habitId: string) => {
    const newProgress = { ...habitProgress };
    newProgress[habitId] = !newProgress[habitId];
    setHabitProgress(newProgress);

    // Generar insights y recomendaciones
    const result = habitEngine.trackHabitProgress(
      habitId,
      newProgress[habitId],
      { week: currentWeek, timeOfDay: new Date().getHours() }
    );

    console.log('Habit insights:', result.insights);
    console.log('Recommendations:', result.recommendations);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'nutrition':
        return <Utensils className="h-5 w-5 text-green-500" />;
      case 'rest':
        return <Moon className="h-5 w-5 text-blue-500" />;
      case 'mindset':
        return <Brain className="h-5 w-5 text-purple-500" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'effortless':
        return 'bg-green-100 text-green-800';
      case 'easy':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOverallProgress = () => {
    const totalHabits = Object.keys(habitProgress).length;
    const completedHabits = Object.values(habitProgress).filter(Boolean).length;
    return totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  };

  if (!psychologyProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">Analizando tu perfil psicológico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🧠 Constructor de Hábitos Inteligente
        </h1>
        <p className="text-gray-600">Construye hábitos sostenibles usando principios de psicología conductual</p>
      </div>

      {/* Psychology Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Tu Perfil Psicológico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {psychologyProfile.motivationalDrivers.intrinsic}
              </div>
              <p className="text-sm text-gray-600">Motivación Intrínseca</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {psychologyProfile.behavioralTendencies.consistency}
              </div>
              <p className="text-sm text-gray-600">Consistencia</p>
            </div>
            <div className="text-center">
              <Badge variant="outline">
                {psychologyProfile.environmentalFactors.timeAvailability}
              </Badge>
              <p className="text-sm text-gray-600">Disponibilidad</p>
            </div>
            <div className="text-center">
              <Badge variant="outline">
                {psychologyProfile.preferredHabitStyle}
              </Badge>
              <p className="text-sm text-gray-600">Estilo Preferido</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!habitPlan ? (
        <Tabs defaultValue="habits" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="habits">Explorar Hábitos</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrición</TabsTrigger>
            <TabsTrigger value="rest">Descanso</TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedHabits).map(([category, habits]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getCategoryIcon(category)}
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {habits.slice(0, 2).map(habit => (
                        <div key={habit.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{habit.name}</h4>
                            <Badge className={getDifficultyColor(habit.difficulty)}>
                              {habit.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                          <div className="text-xs space-y-1">
                            <div><strong>Trigger:</strong> {habit.triggerCue}</div>
                            <div><strong>Acción mínima:</strong> {habit.minimumAction}</div>
                            <div><strong>Celebración:</strong> {habit.celebrationRitual}</div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3 text-green-500" />
                              <span className="text-xs">Confianza científica: {habit.scienceEvidence.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={createHabitPlan} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Brain className="h-5 w-5 mr-2" />
                Crear Mi Plan Personalizado
              </Button>
            </div>
          </TabsContent>

          {(['fitness', 'nutrition', 'rest'] as const).map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4">
                {selectedHabits[category]?.map(habit => (
                  <Card key={habit.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <h3 className="font-semibold">{habit.name}</h3>
                        </div>
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{habit.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>🎯 Trigger:</strong> {habit.triggerCue}
                        </div>
                        <div>
                          <strong>⚡ Acción mínima:</strong> {habit.minimumAction}
                        </div>
                        <div>
                          <strong>🎉 Celebración:</strong> {habit.celebrationRitual}
                        </div>
                        <div>
                          <strong>⏱️ Tiempo:</strong> {habit.estimatedTime}s
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2">Evidencia Científica</h4>
                        <div className="text-xs space-y-1">
                          <div>Confianza: {habit.scienceEvidence.confidence}%</div>
                          <div>Mecanismo: {habit.scienceEvidence.mechanismOfAction}</div>
                          <div>Principios: {habit.psychologicalPrinciples.join(', ')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Progreso General - Semana {currentWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Progreso diario</span>
                    <span>{calculateOverallProgress().toFixed(0)}%</span>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-3" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Object.values(habitProgress).filter(Boolean).length}
                    </div>
                    <p className="text-sm text-gray-600">Completados hoy</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{habitPlan.duration}</div>
                    <p className="text-sm text-gray-600">Semanas del plan</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {habitPlan.targetHabits.length}
                    </div>
                    <p className="text-sm text-gray-600">Stacks de hábitos</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {habitPlan.behavioralInterventions.length}
                    </div>
                    <p className="text-sm text-gray-600">Intervenciones</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Habit Stacks */}
          <div className="space-y-4">
            {habitPlan.targetHabits.map(stack => (
              <Card key={stack.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{stack.name}</span>
                    <Badge variant="outline">
                      {stack.expectedAdherence}% adherencia esperada
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600">{stack.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stack.habits.map(habit => (
                      <div
                        key={habit.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          habitProgress[habit.id] ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className="p-0 h-auto"
                        >
                          {habitProgress[habit.id] ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <Circle className="h-6 w-6 text-gray-400" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="font-semibold">{habit.name}</div>
                          <div className="text-sm text-gray-600">{habit.triggerCue}</div>
                          <div className="text-xs text-green-600">
                            Acción mínima: {habit.minimumAction}
                          </div>
                        </div>
                        
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Behavioral Interventions */}
          <Card>
            <CardHeader>
              <CardTitle>Intervenciones Conductuales Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {habitPlan.behavioralInterventions.map(intervention => (
                  <div key={intervention.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{intervention.name}</h4>
                      <Badge variant={intervention.expectedImpact === 'high' ? 'default' : 'secondary'}>
                        Impacto {intervention.expectedImpact}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{intervention.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Principio:</strong> {intervention.psychologyPrinciple}
                      </div>
                      <div className="text-sm">
                        <strong>Implementación:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {intervention.implementation.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm">
                        <strong>Evidencia científica:</strong> {intervention.evidenceLevel}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Week Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek <= 1}
            >
              Semana Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentWeek(Math.min(habitPlan.duration, currentWeek + 1))}
              disabled={currentWeek >= habitPlan.duration}
            >
              Siguiente Semana
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}