import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui";
import { Clock, Activity, CheckCircle, Target, Zap, Award, Play, Pause, RotateCcw } from "lucide-react";
import type { WorkoutPlan } from '../lib/types';

interface WorkoutDetailScreenProps {
    workoutPlan: WorkoutPlan;
    onBack: () => void;
    onComplete: () => void;
    onCheckForm: (exerciseName: string) => void;
}

// Exercise timer component for interactive workout experience
const ExerciseTimer = ({ restTime }: { restTime: number }) => {
    const [timeLeft, setTimeLeft] = useState(restTime);
    const [isRunning, setIsRunning] = useState(false);
    
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Play sound or show notification when timer completes
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);
    
    const startTimer = () => {
        setIsRunning(true);
    };
    
    const pauseTimer = () => {
        setIsRunning(false);
    };
    
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(restTime);
    };
    
    return (
        <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-700">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="flex gap-1">
                {!isRunning ? (
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={startTimer}
                    >
                        <Play className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={pauseTimer}
                    >
                        <Pause className="h-4 w-4" />
                    </Button>
                )}
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={resetTimer}
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// Motivational progress tracker
const ProgressTracker = ({ currentDay, totalDays }: { currentDay: number; totalDays: number }) => {
    const progress = (currentDay / totalDays) * 100;
    
    return (
        <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Día {currentDay} de {totalDays}</span>
                <span>{Math.round(progress)}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

// Motivational quote component
const MotivationalQuote = () => {
    const quotes = [
        "El dolor que sientes hoy es la fuerza que sentirás mañana.",
        "No cuentes los días, haz que los días cuenten.",
        "La disciplina es el puente entre metas y logros.",
        "Cada entrenamiento te acerca a tu mejor versión.",
        "La fuerza no viene de lo físico, viene de la voluntad indomable."
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 mb-6">
            <CardContent className="p-4">
                <div className="flex items-start">
                    <Award className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm italic text-gray-700">"{randomQuote}"</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default function WorkoutDetailScreen({ workoutPlan, onBack, onComplete, onCheckForm }: WorkoutDetailScreenProps) {
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
    
    const toggleExerciseCompletion = (exerciseId: string) => {
        setCompletedExercises(prev => {
            const newSet = new Set(prev);
            if (newSet.has(exerciseId)) {
                newSet.delete(exerciseId);
            } else {
                newSet.add(exerciseId);
            }
            return newSet;
        });
    };
    
    const completedCount = completedExercises.size;
    const totalCount = workoutPlan.days.reduce((sum, day) => sum + day.exercises.length, 0);
    const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{workoutPlan.name}</h1>
                        <p className="text-gray-600">Detalles del plan de entrenamiento</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="default" 
                        onClick={onBack}
                        className="h-10 px-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Volver
                    </Button>
                </div>

                {/* Progress tracker */}
                <ProgressTracker currentDay={1} totalDays={workoutPlan.days.length} />
                
                {/* Motivational quote */}
                <MotivationalQuote />
                
                {/* Completion stats */}
                <Card className="bg-white border-0 shadow-sm mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Progreso del entrenamiento</p>
                                <p className="text-xl font-bold text-gray-900">{completionPercentage}%</p>
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                <span className="text-sm text-gray-600">{completedCount} de {totalCount} ejercicios</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                    <CardHeader className="pb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="space-y-2">
                                <CardTitle className="text-xl font-bold text-gray-900">Detalles del Entrenamiento</CardTitle>
                                <CardDescription className="text-gray-600">{workoutPlan.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-800">
                                    {workoutPlan.duration ? `${workoutPlan.duration} min` : 'Variable'}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-6">
                            {workoutPlan.days.map((day, dayIndex) => (
                                <div key={dayIndex} className="border border-gray-200 rounded-xl p-5 bg-white">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {day.day}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{day.focus}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {day.exercises.map((exercise, index) => {
                                            const exerciseId = `${dayIndex}-${index}`;
                                            const isCompleted = completedExercises.has(exerciseId);
                                            
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={`border rounded-lg p-4 transition-all duration-200 ${
                                                        isCompleted 
                                                            ? 'bg-green-50 border-green-200' 
                                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-2 flex-1">
                                                            <div className="flex items-start">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`h-5 w-5 mr-2 mt-0.5 p-0 ${
                                                                        isCompleted 
                                                                            ? 'text-green-600 hover:text-green-700' 
                                                                            : 'text-gray-400 hover:text-gray-600'
                                                                    }`}
                                                                    onClick={() => toggleExerciseCompletion(exerciseId)}
                                                                >
                                                                    {isCompleted ? (
                                                                        <CheckCircle className="h-5 w-5" />
                                                                    ) : (
                                                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                                                    )}
                                                                </Button>
                                                                <div>
                                                                    <h4 className="text-base font-semibold text-gray-900">{exercise.name}</h4>
                                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                                                                        <span className="font-medium">{exercise.sets} series × {exercise.reps ? `${exercise.reps} reps` : 'Máximas reps'}</span>
                                                                        <span className="text-gray-400">•</span>
                                                                        <span>Descanso: {exercise.rest} seg</span>
                                                                        {exercise.equipment && (
                                                                            <>
                                                                                <span className="text-gray-400">•</span>
                                                                                <span>{exercise.equipment}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Timer for rest periods */}
                                                            <div className="mt-3 pl-7">
                                                                <ExerciseTimer restTime={exercise.rest} />
                                                            </div>
                                                        </div>
                                                        
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => onCheckForm(exercise.name)}
                                                            className="h-9 px-3 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <Activity className="h-4 w-4 mr-1" />
                                                            Técnica
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                        <Button 
                            variant="outline" 
                            size="default"
                            className="h-10 px-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Editar Plan
                        </Button>
                        <Button 
                            variant="default" 
                            size="default" 
                            onClick={onComplete}
                            className="h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium"
                        >
                            <Target className="h-4 w-4 mr-2" />
                            Completar Entrenamiento
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}