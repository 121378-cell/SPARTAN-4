import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  Calendar, 
  Clock, 
  Activity, 
  Dumbbell, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Play,
  Square,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import type { WorkoutPlan, Exercise, WorkoutSession } from '../lib/types';
import { storageManager } from '../lib/storage';
import { habitTrackingService } from '../lib/habit-tracking';

interface ExerciseLog {
  exerciseId: string;
  name: string;
  sets: {
    setNumber: number;
    weight: number | null;
    reps: number | null;
    rpe: number | null;
    tempo: string;
    rest: number;
    notes: string;
  }[];
}

interface WorkoutSessionTemplateProps {
  workoutPlan: WorkoutPlan;
  selectedDate: Date;
  onBack: () => void;
  onComplete: (completedData: any) => void;
}

// Define exercise categories and their colors
const CATEGORY_COLORS: Record<string, string> = {
  'fuerza': 'bg-red-100 text-red-800 border-red-200',
  'hipertrofia': 'bg-blue-100 text-blue-800 border-blue-200',
  'definicion': 'bg-green-100 text-green-800 border-green-200',
  'movilidad': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'cardio': 'bg-purple-100 text-purple-800 border-purple-200',
  'descanso': 'bg-gray-100 text-gray-800 border-gray-200',
  'default': 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'fuerza': <Dumbbell className="h-4 w-4" />,
  'hipertrofia': <Zap className="h-4 w-4" />,
  'definicion': <TrendingUp className="h-4 w-4" />,
  'movilidad': <RotateCcw className="h-4 w-4" />,
  'cardio': <Activity className="h-4 w-4" />,
  'descanso': <Clock className="h-4 w-4" />,
  'default': <Activity className="h-4 w-4" />
};

export default function WorkoutSessionTemplate({ 
  workoutPlan, 
  selectedDate, 
  onBack, 
  onComplete 
}: WorkoutSessionTemplateProps) {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [autoDetectedStart, setAutoDetectedStart] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoStartRef = useRef<boolean>(false);

  // Initialize exercise logs
  useEffect(() => {
    const initialLogs: ExerciseLog[] = workoutPlan.days.flatMap(day => 
      day.exercises.map((exercise, index) => ({
        exerciseId: `${day.day}-${index}`,
        name: exercise.name,
        sets: Array.from({ length: exercise.sets }, (_, i) => ({
          setNumber: i + 1,
          weight: null,
          reps: null,
          rpe: null,
          tempo: exercise.notes || '',
          rest: exercise.rest,
          notes: ''
        }))
      }))
    );
    setExerciseLogs(initialLogs);
    
    // Auto-start session when component mounts
    if (!sessionStarted && !autoStartRef.current) {
      autoStartRef.current = true;
      setAutoDetectedStart(true);
      startSession();
    }
  }, [workoutPlan]);

  // Timer effect
  useEffect(() => {
    if (sessionStarted && !endTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionStarted, endTime]);

  // Start workout session
  const startSession = () => {
    const now = new Date();
    setStartTime(now);
    setSessionStarted(true);
    setElapsedTime(0);
  };

  // End workout session
  const endSession = () => {
    const now = new Date();
    setEndTime(now);
    setSessionStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseLog['sets'][0],
    value: any
  ) => {
    setExerciseLogs(prev => {
      const newLogs = [...prev];
      if (newLogs[exerciseIndex]) {
        const newSets = [...newLogs[exerciseIndex].sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        newLogs[exerciseIndex] = { ...newLogs[exerciseIndex], sets: newSets };
      }
      return newLogs;
    });
  };

  const handleSaveSession = () => {
    setIsSaving(true);
    
    // End session if still active
    if (sessionStarted) {
      endSession();
    }
    
    // Calculate duration in minutes
    const duration = startTime && endTime ? 
      Math.round((endTime.getTime() - startTime.getTime()) / 60000) : 
      Math.round(elapsedTime / 60);
    
    // Prepare session data
    const sessionData: WorkoutSession = {
      id: `session_${workoutPlan.id}_${selectedDate.getTime()}`,
      workoutPlanId: workoutPlan.id,
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      exercises: exerciseLogs,
      notes: sessionNotes
    };
    
    // Save to workout sessions
    habitTrackingService.recordWorkoutSession(sessionData);
    
    // Also save to progress data for backward compatibility
    storageManager.addProgressData({
      workoutId: workoutPlan.id,
      date: selectedDate,
      notes: sessionNotes
    });
    
    setTimeout(() => {
      setIsSaving(false);
      onComplete(sessionData);
    }, 1000);
  };

  const handleExerciseSubstitution = (exerciseName: string) => {
    // In a real implementation, this would call the AI to suggest alternatives
    alert(`Sustitución inteligente para: ${exerciseName}\n\nLa IA sugeriría variantes equivalentes basadas en tu objetivo y equipamiento disponible.`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (focus: string) => {
    const normalizedFocus = focus.toLowerCase();
    return CATEGORY_COLORS[normalizedFocus] || CATEGORY_COLORS['default'];
  };

  const getCategoryIcon = (focus: string) => {
    const normalizedFocus = focus.toLowerCase();
    return CATEGORY_ICONS[normalizedFocus] || CATEGORY_ICONS['default'];
  };

  const isExerciseCompleted = (exercise: ExerciseLog) => {
    return exercise.sets.every(set => 
      set.weight !== null && set.reps !== null
    );
  };

  if (exerciseLogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando sesión de entrenamiento...</p>
        </div>
      </div>
    );
  }

  const activeExercise = exerciseLogs[activeExerciseIndex];
  const currentDay = workoutPlan.days.find(day => 
    day.exercises.some(ex => ex.name === activeExercise.name)
  );
  const completedExercises = exerciseLogs.filter(isExerciseCompleted).length;
  const totalExercises = exerciseLogs.length;
  const progressPercentage = Math.round((completedExercises / totalExercises) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {workoutPlan.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(selectedDate)}</span>
              {currentDay && (
                <>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(currentDay.focus)}`}>
                    {getCategoryIcon(currentDay.focus)}
                    {currentDay.focus}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!sessionStarted ? (
              <Button 
                variant="default" 
                size="default" 
                onClick={startSession}
                className="h-10 px-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Entreno
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="default" 
                onClick={endSession}
                className="h-10 px-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
              >
                <Square className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            )}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="font-mono text-sm font-medium text-gray-900">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="default" 
              onClick={onBack}
              className="h-10 px-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>

        {/* Session Info and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                {autoDetectedStart ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                {autoDetectedStart ? "Sesión Iniciada Automáticamente" : "Sesión Iniciada Manualmente"}
              </CardTitle>
              <CardDescription>
                {autoDetectedStart 
                  ? "El sistema detectó automáticamente el inicio de tu entrenamiento"
                  : "Iniciaste manualmente tu sesión de entrenamiento"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Progreso del Entrenamiento</span>
                    <span>{completedExercises} de {totalExercises} ejercicios</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas de la Sesión
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="¿Cómo te sentiste durante el entrenamiento? ¿Alguna dificultad o logro especial?"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Información del Entreno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duración estimada:</span>
                  <span className="text-sm font-medium">{workoutPlan.duration} minutos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Días por semana:</span>
                  <span className="text-sm font-medium">{workoutPlan.days.length} días</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nivel de dificultad:</span>
                  <span className="text-sm font-medium capitalize">{workoutPlan.difficulty}</span>
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Enfoque principal:</h4>
                  <div className="flex flex-wrap gap-1">
                    {workoutPlan.focus.map((focus, index) => {
                      const normalizedFocus = focus.toLowerCase();
                      return (
                        <span 
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(normalizedFocus)}`}
                        >
                          {getCategoryIcon(normalizedFocus)}
                          <span className="ml-1">{focus}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Ejercicios</CardTitle>
              <CardDescription className="text-gray-600">
                {exerciseLogs.length} ejercicios programados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {exerciseLogs.map((log, index) => {
                const day = workoutPlan.days.find(d => 
                  d.exercises.some(ex => ex.name === log.name)
                );
                const isCompleted = isExerciseCompleted(log);
                
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      activeExerciseIndex === index 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-sm' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveExerciseIndex(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">{log.name}</h3>
                        {day && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(day.focus)}`}>
                            {getCategoryIcon(day.focus)}
                            <span className="ml-1">{day.focus}</span>
                          </span>
                        )}
                      </div>
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300"></div>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {log.sets.length} series
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Exercise Detail */}
          <div className="lg:col-span-2 space-y-6">
            {activeExercise && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {activeExercise.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Registra tus datos en tiempo real
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleExerciseSubstitution(activeExercise.name)}
                      className="h-9 px-3 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 text-orange-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:border-orange-300 transition-all duration-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Sustituir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeExercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Serie {set.setNumber}</h4>
                          <span className="text-sm text-gray-500">
                            Descanso: {set.rest} segundos
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Peso (kg)
                            </label>
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => handleSetChange(
                                activeExerciseIndex, 
                                setIndex, 
                                'weight', 
                                e.target.value ? parseFloat(e.target.value) : null
                              )}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              placeholder="0"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Repeticiones
                            </label>
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => handleSetChange(
                                activeExerciseIndex, 
                                setIndex, 
                                'reps', 
                                e.target.value ? parseInt(e.target.value) : null
                              )}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              placeholder="0"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              RPE
                            </label>
                            <select
                              value={set.rpe || ''}
                              onChange={(e) => handleSetChange(
                                activeExerciseIndex, 
                                setIndex, 
                                'rpe', 
                                e.target.value ? parseInt(e.target.value) : null
                              )}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            >
                              <option value="">Seleccionar</option>
                              {[6, 7, 8, 9, 10].map(rpe => (
                                <option key={rpe} value={rpe}>{rpe}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Tempo
                            </label>
                            <input
                              type="text"
                              value={set.tempo}
                              onChange={(e) => handleSetChange(
                                activeExerciseIndex, 
                                setIndex, 
                                'tempo', 
                                e.target.value
                              )}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              placeholder="Ej: 3-1-2"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Notas
                          </label>
                          <textarea
                            value={set.notes}
                            onChange={(e) => handleSetChange(
                              activeExerciseIndex, 
                              setIndex, 
                              'notes', 
                              e.target.value
                            )}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            placeholder="Sensaciones, dificultad, etc."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation and Save */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setActiveExerciseIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeExerciseIndex === 0}
                  className="h-10 px-4 bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setActiveExerciseIndex(prev => Math.min(exerciseLogs.length - 1, prev + 1))}
                  disabled={activeExerciseIndex === exerciseLogs.length - 1}
                  className="h-10 px-4 bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <Button
                variant="default"
                size="default"
                onClick={handleSaveSession}
                disabled={isSaving}
                className="h-12 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Completar Sesión
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}