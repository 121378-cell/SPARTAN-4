/**
 * Advanced Workout Generator Screen - Interfaz para generación avanzada de rutinas
 */

import React, { useState, memo, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from './ui';
import { ArrowLeft, Plus, Minus, Target, Calendar, MapPin, Dumbbell, AlertTriangle, TrendingUp } from 'lucide-react';
import { advancedWorkoutGenerator, type UserProfile, type TrainingGoal, type PersonalizedWorkoutPlan } from '../lib/advancedWorkoutGenerator';
import type { UserData } from '../lib/types';

interface AdvancedWorkoutGeneratorScreenProps {
  userData: UserData;
  onBack: () => void;
  onPlanGenerated: (plan: any) => void;
}

const AdvancedWorkoutGeneratorScreen = memo(function AdvancedWorkoutGeneratorScreen({
  userData,
  onBack,
  onPlanGenerated
}: AdvancedWorkoutGeneratorScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Estados para el perfil del usuario
  const [goals, setGoals] = useState<TrainingGoal[]>([]);
  const [availability, setAvailability] = useState({
    daysPerWeek: 3,
    timePerSession: 60,
    preferredTimes: [] as string[],
    restDays: [] as string[]
  });
  const [equipment, setEquipment] = useState([
    { name: 'Mancuernas', type: 'strength' as const, available: false },
    { name: 'Barra y Discos', type: 'strength' as const, available: false },
    { name: 'Banco', type: 'strength' as const, available: false },
    { name: 'Kettlebells', type: 'strength' as const, available: false },
    { name: 'Bandas Elásticas', type: 'functional' as const, available: false },
    { name: 'Bicicleta/Cardio', type: 'cardio' as const, available: false }
  ]);
  const [injuries, setInjuries] = useState([
    { bodyPart: '', type: '', severity: 'mild' as const, isActive: false, restrictions: [] as string[] }
  ]);
  const [biometrics, setBiometrics] = useState({
    bodyFatPercentage: undefined as number | undefined,
    muscleMass: undefined as number | undefined,
    vo2Max: undefined as number | undefined,
    restingHeartRate: undefined as number | undefined
  });
  const [location, setLocation] = useState<'home' | 'gym' | 'outdoor' | 'mixed'>('gym');

  const steps = [
    { number: 1, title: 'Objetivos de Entrenamiento', icon: Target },
    { number: 2, title: 'Disponibilidad', icon: Calendar },
    { number: 3, title: 'Equipamiento y Ubicación', icon: MapPin },
    { number: 4, title: 'Historial de Lesiones', icon: AlertTriangle },
    { number: 5, title: 'Datos Biométricos', icon: TrendingUp },
    { number: 6, title: 'Generar Plan', icon: Dumbbell }
  ];

  const goalTypes = [
    { type: 'strength', label: 'Fuerza', description: 'Maximizar fuerza muscular y levantamientos' },
    { type: 'hypertrophy', label: 'Hipertrofia', description: 'Aumento de masa muscular' },
    { type: 'endurance', label: 'Resistencia', description: 'Mejorar capacidad cardiovascular' },
    { type: 'power', label: 'Potencia', description: 'Explosividad y velocidad' },
    { type: 'flexibility', label: 'Flexibilidad', description: 'Rango de movimiento articular' },
    { type: 'mobility', label: 'Movilidad', description: 'Movimiento funcional y calidad' },
    { type: 'fat-loss', label: 'Definición', description: 'Pérdida de grasa corporal' }
  ];

  const addGoal = useCallback((goalType: string) => {
    const newGoal: TrainingGoal = {
      type: goalType as any,
      priority: 3,
      timeline: 12,
      specificTargets: []
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const updateGoal = useCallback((index: number, field: keyof TrainingGoal, value: any) => {
    setGoals(prev => prev.map((goal, i) => 
      i === index ? { ...goal, [field]: value } : goal
    ));
  }, []);

  const removeGoal = useCallback((index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addInjury = useCallback(() => {
    setInjuries(prev => [...prev, {
      bodyPart: '',
      type: '',
      severity: 'mild',
      isActive: false,
      restrictions: []
    }]);
  }, []);

  const updateEquipment = useCallback((index: number, available: boolean) => {
    setEquipment(prev => prev.map((item, i) => 
      i === index ? { ...item, available } : item
    ));
  }, []);

  const generateWorkout = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const userProfile: UserProfile = {
        ...userData,
        biometrics,
        injuryHistory: {
          currentInjuries: injuries.filter(i => i.isActive && i.bodyPart),
          pastInjuries: injuries.filter(i => !i.isActive && i.bodyPart),
          limitations: [],
          painAreas: []
        },
        progressHistory: {
          previousWorkouts: [],
          strengthProgression: []
        },
        availability,
        trainingEnvironment: {
          location,
          availableEquipment: equipment,
          spaceConstraints: []
        }
      };

      const plan = await advancedWorkoutGenerator.generatePersonalizedWorkout(userProfile, goals);
      onPlanGenerated(plan);
      
    } catch (error) {
      console.error('Error generando rutina:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [userData, goals, availability, equipment, injuries, biometrics, location, onPlanGenerated]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Define tus Objetivos de Entrenamiento</h3>
              <p className="text-gray-600">Selecciona y prioriza tus metas fitness principales</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalTypes.map((goalType) => (
                <Card 
                  key={goalType.type}
                  className="cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => addGoal(goalType.type)}
                >
                  <CardContent className="p-4">
                    <h4 className="font-semibold">{goalType.label}</h4>
                    <p className="text-sm text-gray-600">{goalType.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {goals.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Objetivos Seleccionados</h4>
                {goals.map((goal, index) => (
                  <Card key={index} className="mb-3">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium">{goalTypes.find(g => g.type === goal.type)?.label}</h5>
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="text-sm text-gray-600">Prioridad (1-5)</label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={goal.priority}
                                onChange={(e) => updateGoal(index, 'priority', parseInt(e.target.value))}
                                className="w-full"
                              />
                              <span className="text-sm">{goal.priority}</span>
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Timeline (semanas)</label>
                              <input
                                type="number"
                                min="4"
                                max="52"
                                value={goal.timeline}
                                onChange={(e) => updateGoal(index, 'timeline', parseInt(e.target.value))}
                                className="w-full p-2 border rounded"
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGoal(index)}
                          className="text-red-500"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Tu Disponibilidad</h3>
              <p className="text-gray-600">Cuéntanos sobre tu horario de entrenamiento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frecuencia Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Días por semana</label>
                      <input
                        type="range"
                        min="2"
                        max="7"
                        value={availability.daysPerWeek}
                        onChange={(e) => setAvailability(prev => ({
                          ...prev,
                          daysPerWeek: parseInt(e.target.value)
                        }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{availability.daysPerWeek} días</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tiempo por sesión (minutos)</label>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        step="15"
                        value={availability.timePerSession}
                        onChange={(e) => setAvailability(prev => ({
                          ...prev,
                          timePerSession: parseInt(e.target.value)
                        }))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{availability.timePerSession} minutos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horarios Preferidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['Mañana (6-10 AM)', 'Mediodía (11 AM-2 PM)', 'Tarde (3-7 PM)', 'Noche (8-10 PM)'].map((time) => (
                      <label key={time} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const timeValue = time.split(' ')[0].toLowerCase();
                            setAvailability(prev => ({
                              ...prev,
                              preferredTimes: e.target.checked 
                                ? [...prev.preferredTimes, timeValue]
                                : prev.preferredTimes.filter(t => t !== timeValue)
                            }));
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{time}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Equipamiento y Ubicación</h3>
              <p className="text-gray-600">Selecciona tu lugar de entrenamiento y equipamiento disponible</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lugar de Entrenamiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'gym', label: 'Gimnasio' },
                    { value: 'home', label: 'Casa' },
                    { value: 'outdoor', label: 'Exterior' },
                    { value: 'mixed', label: 'Mixto' }
                  ].map((loc) => (
                    <label key={loc.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="location"
                        value={loc.value}
                        checked={location === loc.value}
                        onChange={(e) => setLocation(e.target.value as any)}
                        className="rounded"
                      />
                      <span>{loc.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Equipamiento Disponible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {equipment.map((item, index) => (
                    <label key={index} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={(e) => updateEquipment(index, e.target.checked)}
                        className="rounded"
                      />
                      <span className="flex-1">{item.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Historial de Lesiones</h3>
              <p className="text-gray-600">Información crucial para un entrenamiento seguro</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lesiones y Limitaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {injuries.map((injury, index) => (
                  <div key={index} className="border-b pb-4 mb-4 last:border-b-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Zona del Cuerpo</label>
                        <input
                          type="text"
                          placeholder="ej: Rodilla derecha"
                          value={injury.bodyPart}
                          onChange={(e) => {
                            const newInjuries = [...injuries];
                            newInjuries[index].bodyPart = e.target.value;
                            setInjuries(newInjuries);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Lesión</label>
                        <input
                          type="text"
                          placeholder="ej: Tendinitis"
                          value={injury.type}
                          onChange={(e) => {
                            const newInjuries = [...injuries];
                            newInjuries[index].type = e.target.value;
                            setInjuries(newInjuries);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={injury.isActive}
                            onChange={(e) => {
                              const newInjuries = [...injuries];
                              newInjuries[index].isActive = e.target.checked;
                              setInjuries(newInjuries);
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">Lesión activa</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addInjury} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Lesión
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Datos Biométricos</h3>
              <p className="text-gray-600">Información opcional para mayor personalización</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Grasa Corporal (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="5"
                      max="50"
                      value={biometrics.bodyFatPercentage || ''}
                      onChange={(e) => setBiometrics(prev => ({
                        ...prev,
                        bodyFatPercentage: parseFloat(e.target.value) || undefined
                      }))}
                      className="w-full p-2 border rounded"
                      placeholder="Opcional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Masa Muscular (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="100"
                      value={biometrics.muscleMass || ''}
                      onChange={(e) => setBiometrics(prev => ({
                        ...prev,
                        muscleMass: parseFloat(e.target.value) || undefined
                      }))}
                      className="w-full p-2 border rounded"
                      placeholder="Opcional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">VO2 Máximo (ml/kg/min)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="80"
                      value={biometrics.vo2Max || ''}
                      onChange={(e) => setBiometrics(prev => ({
                        ...prev,
                        vo2Max: parseFloat(e.target.value) || undefined
                      }))}
                      className="w-full p-2 border rounded"
                      placeholder="Opcional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Frecuencia Cardíaca en Reposo</label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      value={biometrics.restingHeartRate || ''}
                      onChange={(e) => setBiometrics(prev => ({
                        ...prev,
                        restingHeartRate: parseInt(e.target.value) || undefined
                      }))}
                      className="w-full p-2 border rounded"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Resumen del Plan</h3>
              <p className="text-gray-600">Revisa tu configuración antes de generar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos ({goals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {goals.map((goal, index) => (
                    <div key={index} className="flex justify-between text-sm mb-2">
                      <span>{goalTypes.find(g => g.type === goal.type)?.label}</span>
                      <span>Prioridad: {goal.priority}/5</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disponibilidad</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>{availability.daysPerWeek} días por semana</p>
                  <p>{availability.timePerSession} minutos por sesión</p>
                  <p>Ubicación: {location}</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={generateWorkout}
                disabled={isGenerating || goals.length === 0}
                size="lg"
                className="w-full md:w-auto"
              >
                {isGenerating ? 'Generando Plan Personalizado...' : 'Generar Mi Plan de Entrenamiento'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generador Avanzado de Rutinas
              </h1>
              <p className="text-sm text-gray-600">Paso {currentStep} de {steps.length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Progress Indicator */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-blue-600 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 text-center max-w-20">{step.title}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          {currentStep < steps.length && (
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === 1 && goals.length === 0}
            >
              Siguiente
            </Button>
          )}
        </div>
      </main>
    </div>
  );
});

export default AdvancedWorkoutGeneratorScreen;