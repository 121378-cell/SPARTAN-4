
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui";
import { Clock, Activity } from "lucide-react";
import type { WorkoutPlan } from '../lib/types';

interface WorkoutDetailScreenProps {
    workoutPlan: WorkoutPlan;
    onBack: () => void;
    onComplete: () => void;
    onCheckForm: (exerciseName: string) => void;
}

export default function WorkoutDetailScreen({ workoutPlan, onBack, onComplete, onCheckForm }: WorkoutDetailScreenProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{workoutPlan.name}</h1>
                        <p className="text-gray-600 text-lg">Detalles del plan de entrenamiento</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="default" 
                        onClick={onBack}
                        className="h-12 px-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                        Volver a Entrenamientos
                    </Button>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="pb-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-bold text-gray-900">Detalles del Entrenamiento</CardTitle>
                                <CardDescription className="text-gray-600 text-lg max-w-2xl">{workoutPlan.description}</CardDescription>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-800">
                                    {workoutPlan.duration ? `${workoutPlan.duration} minutos` : 'Duración variable'}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-6">
                            {workoutPlan.days.map((day, dayIndex) => (
                                <div key={dayIndex} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {day.day}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{day.focus}</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {day.exercises.map((exercise, index) => (
                                            <div key={index} className="bg-white/80 border border-gray-100 rounded-lg p-5 hover:bg-white hover:shadow-sm transition-all duration-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="space-y-1">
                                                        <h4 className="text-lg font-semibold text-gray-900">{exercise.name}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="font-medium">{exercise.sets} series × {exercise.reps ? `${exercise.reps} repeticiones` : 'Máximas repeticiones'}</span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>Descanso: {exercise.rest} segundos</span>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => onCheckForm(exercise.name)}
                                                        className="h-10 px-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 hover:border-green-300 transition-all duration-200"
                                                    >
                                                        <Activity className="h-4 w-4 mr-2" />
                                                        Ver Técnica
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 pt-8">
                        <Button 
                            variant="outline" 
                            size="default"
                            className="h-12 px-6 bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                        >
                            Editar Plan
                        </Button>
                        <Button 
                            variant="default" 
                            size="default" 
                            onClick={onComplete}
                            className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Marcar como Completado
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

