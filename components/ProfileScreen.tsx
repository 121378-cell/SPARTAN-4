import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Input, Label } from "./ui";
import { Check } from "lucide-react";
import type { UserData } from '../lib/types';
import { storageManager } from '../lib/storage';

interface ProfileScreenProps {
    userData: UserData;
    setUserData: (data: UserData) => void;
    onBack: () => void;
}

export default function ProfileScreen({ userData, setUserData, onBack }: ProfileScreenProps) {
    const handleGoalToggle = (goal: string) => {
        const newGoals = userData.goals.includes(goal)
            ? userData.goals.filter(g => g !== goal)
            : [...userData.goals, goal];
        const newUserData = { ...userData, goals: newGoals };
        setUserData(newUserData);
        storageManager.setUserData(newUserData);
    };

    const handleUserDataChange = (field: keyof UserData, value: any) => {
        const newUserData = { ...userData, [field]: value };
        setUserData(newUserData);
        storageManager.setUserData(newUserData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Configuración del Perfil</h1>
                        <p className="text-gray-600 text-lg">Actualiza tu información personal y objetivos de fitness</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="default" 
                        onClick={onBack}
                        className="h-12 px-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
                    >
                        Volver al Dashboard
                    </Button>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="pb-8">
                        <CardTitle className="text-2xl font-bold text-gray-900">Información Personal</CardTitle>
                        <CardDescription className="text-gray-600 text-lg">Actualiza tu perfil de fitness</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nombre</Label>
                                <Input
                                    id="name"
                                    value={userData.name}
                                    onChange={(e) => handleUserDataChange('name', e.target.value)}
                                    className="h-12 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Edad</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={userData.age}
                                    onChange={(e) => handleUserDataChange('age', parseInt(e.target.value) || 0)}
                                    className="h-12 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="weight" className="text-sm font-semibold text-gray-700">Peso (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    value={userData.weight}
                                    onChange={(e) => handleUserDataChange('weight', parseInt(e.target.value) || 0)}
                                    className="h-12 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="height" className="text-sm font-semibold text-gray-700">Altura (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={userData.height}
                                    onChange={(e) => handleUserDataChange('height', parseInt(e.target.value) || 0)}
                                    className="h-12 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700">Nivel de Fitness</Label>
                            <p className="text-xs text-gray-500">Selecciona tu nivel general. Puedes tener experiencia mixta en diferentes áreas.</p>
                            <div className="flex gap-4">
                                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                                    <Button
                                        key={level}
                                        variant={userData.fitnessLevel === level ? 'default' : 'outline'}
                                        size="default"
                                        onClick={() => handleUserDataChange('fitnessLevel', level)}
                                        className={`h-12 px-6 font-semibold rounded-lg transition-all duration-200 ${
                                            userData.fitnessLevel === level 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                                : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
                                        }`}
                                    >
                                        {level === 'beginner' ? 'Principiante' : level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700">Objetivos de Fitness</Label>
                            <p className="text-xs text-gray-500">Selecciona TODOS los objetivos que te interesan. Puedes combinar múltiples objetivos.</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { en: 'Weight Loss', es: 'Pérdida de Peso', icon: '🔥', desc: 'Reducir grasa corporal' },
                                    { en: 'Muscle Gain', es: 'Ganancia Muscular', icon: '💪', desc: 'Aumentar masa muscular' },
                                    { en: 'Endurance', es: 'Resistencia', icon: '🏃', desc: 'Mejorar capacidad cardiovascular' },
                                    { en: 'Flexibility', es: 'Flexibilidad', icon: '🤸', desc: 'Aumentar rango de movimiento' },
                                    { en: 'Strength', es: 'Fuerza', icon: '🏋️', desc: 'Aumentar fuerza máxima' },
                                    { en: 'Wellness', es: 'Bienestar General', icon: '✨', desc: 'Salud y bienestar integral' }
                                ].map(goal => (
                                    <div key={goal.en} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                        userData.goals.includes(goal.en)
                                            ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300 shadow-md'
                                            : 'bg-white/70 border-gray-200 hover:bg-white hover:shadow-sm'
                                    }`} onClick={() => handleGoalToggle(goal.en)}>
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">{goal.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant={userData.goals.includes(goal.en) ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleGoalToggle(goal.en);
                                                        }}
                                                        className={`w-6 h-6 rounded-full p-0 font-medium transition-all duration-200 ${
                                                            userData.goals.includes(goal.en)
                                                                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md'
                                                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {userData.goals.includes(goal.en) ? '✓' : ''}
                                                    </Button>
                                                    <span className="font-semibold text-gray-800">{goal.es}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{goal.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-8">
                        <Button 
                            variant="default" 
                            size="default" 
                            onClick={onBack}
                            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
