
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "./ui";
import { Dumbbell, Gauge, MoveRight, AlertTriangle } from "lucide-react";
import type { TrainingLevel, TrainingLocation, Equipment, InjuryHistory, TrainingDays } from "../lib/types";

interface GeneratorFormProps {
    level: TrainingLevel;
    setLevel: (level: TrainingLevel) => void;
    availableDays: TrainingDays;
    setAvailableDays: (days: TrainingDays) => void;
    trainingLocation: TrainingLocation;
    setTrainingLocation: (location: TrainingLocation) => void;
    equipment: Equipment;
    setEquipment: (equipment: Equipment) => void;
    injuryHistory: InjuryHistory;
    setInjuryHistory: (history: InjuryHistory) => void;
    previousProgress: string;
    setPreviousProgress: (progress: string) => void;
    goals: Record<string, boolean>;
    setGoals: (goals: Record<string, boolean>) => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

export default function GeneratorForm({
    level, setLevel,
    availableDays, setAvailableDays,
    trainingLocation, setTrainingLocation,
    equipment, setEquipment,
    injuryHistory, setInjuryHistory,
    previousProgress, setPreviousProgress,
    goals, setGoals,
    isGenerating, onGenerate
}: GeneratorFormProps) {

    const toggleGoal = (goal: string) => {
        setGoals({ ...goals, [goal]: !goals[goal] });
    };

    const toggleEquipment = (equip: keyof Equipment) => {
        setEquipment({ ...equipment, [equip]: !equipment[equip] });
    };

    return (
        <>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <Gauge className="h-5 w-5 text-white" />
                        </div>
                        Nivel y Objetivos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Nivel de Entrenamiento</Label>
                            <p className="text-xs text-gray-500">Selecciona tu nivel predominante. La IA creará ejercicios progresivos si tienes experiencia mixta.</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {(['beginner', 'intermediate', 'advanced'] as TrainingLevel[]).map(lvl => (
                                <Button
                                    key={lvl}
                                    variant={level === lvl ? 'default' : 'outline'}
                                    size="default"
                                    onClick={() => setLevel(lvl)}
                                    className={`h-10 px-4 font-medium rounded-lg transition-all duration-200 ${
                                        level === lvl
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    {lvl === 'beginner' ? 'Principiante' : lvl === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Días de Entrenamiento por Semana</Label>
                            <p className="text-xs text-gray-500">Selecciona tu disponibilidad usual. Puedes ajustar semana a semana según tus necesidades.</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {([1, 2, 3, 4, 5, 6] as TrainingDays[]).map(num => (
                                <Button
                                    key={num}
                                    variant={availableDays === num ? 'default' : 'outline'}
                                    size="default"
                                    onClick={() => setAvailableDays(num)}
                                    className={`h-10 w-12 font-medium rounded-lg transition-all duration-200 ${
                                        availableDays === num
                                            ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md'
                                            : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-gray-700">Lugar Principal de Entrenamiento</Label>
                            <p className="text-xs text-gray-500">Elige tu ubicación principal. La rutina incluirá alternativas para otros lugares cuando sea posible.</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {[
                                { key: 'gym', label: 'Gimnasio' },
                                { key: 'home', label: 'Casa' },
                                { key: 'outdoor', label: 'Exterior' }
                            ].map(loc => (
                                <Button
                                    key={loc.key}
                                    variant={trainingLocation === loc.key ? 'default' : 'outline'}
                                    size="default"
                                    onClick={() => setTrainingLocation(loc.key as TrainingLocation)}
                                    className={`h-10 px-4 font-medium rounded-lg transition-all duration-200 ${
                                        trainingLocation === loc.key
                                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                                            : 'bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    {loc.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        Objetivos de Entrenamiento
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries({
                        strength: 'Fuerza',
                        hypertrophy: 'Hipertrofia',
                        endurance: 'Resistencia',
                        mobility: 'Movilidad',
                        definition: 'Definición'
                    }).map(([goal, label]) => (
                        <div key={goal} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-100 hover:bg-white/70 transition-all duration-200">
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant={goals[goal] ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleGoal(goal)}
                                    className={`w-8 h-8 rounded-full p-0 transition-all duration-200 ${
                                        goals[goal]
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {goals[goal] ? '✓' : ''}
                                </Button>
                                <span className="font-medium text-gray-800">{label}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                                {goals[goal] && (
                                    goal === 'strength' ? '(3-6 reps)' :
                                    goal === 'hypertrophy' ? '(8-12 reps)' :
                                    goal === 'endurance' ? '(15-20 reps)' :
                                    goal === 'mobility' ? '(10-15 reps)' :
                                    goal === 'definition' ? '(Tonificación)' : ''
                                )}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                            <MoveRight className="h-5 w-5 text-white" />
                        </div>
                        Equipamiento Disponible
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { key: 'dumbbells', label: 'Mancuernas' },
                            { key: 'barbell', label: 'Barra' },
                            { key: 'kettlebells', label: 'Kettlebells' },
                            { key: 'resistanceBands', label: 'Bandas elásticas' },
                            { key: 'pullUpBar', label: 'Barra de dominadas' },
                            { key: 'bench', label: 'Banco' },
                            { key: 'machine', label: 'Máquinas' }
                        ].map((equip) => (
                            <div key={equip.key} className="flex items-center p-3 bg-white/50 rounded-lg border border-gray-100 hover:bg-white/70 transition-all duration-200">
                                <Button
                                    variant={equipment[equip.key as keyof Equipment] ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => toggleEquipment(equip.key as keyof Equipment)}
                                    className={`w-8 h-8 rounded-full p-0 mr-3 transition-all duration-200 ${
                                        equipment[equip.key as keyof Equipment]
                                            ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {equipment[equip.key as keyof Equipment] ? '✓' : ''}
                                </Button>
                                <span className="font-medium text-gray-800">{equip.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        Historial de Lesiones
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
                        <Label className="text-sm font-semibold text-gray-700">¿Tienes lesiones previas?</Label>
                        <Button
                            variant={injuryHistory.hasInjuries ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setInjuryHistory({ ...injuryHistory, hasInjuries: !injuryHistory.hasInjuries })}
                            className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 ${
                                injuryHistory.hasInjuries
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {injuryHistory.hasInjuries ? 'Sí' : 'No'}
                        </Button>
                    </div>
                    {injuryHistory.hasInjuries && (
                        <div className="space-y-3">
                            <Label htmlFor="injuries" className="text-sm font-semibold text-gray-700">Describe tus lesiones</Label>
                            <Input
                                id="injuries"
                                placeholder="Ej: Dolor lumbar crónico..."
                                value={injuryHistory.injuries}
                                onChange={(e) => setInjuryHistory({ ...injuryHistory, injuries: e.target.value })}
                                className="h-12 bg-white/70 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                            <Gauge className="h-5 w-5 text-white" />
                        </div>
                        Progresión Anterior
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">Describe tu rutina anterior y progresos</Label>
                        <Textarea
                            placeholder="Describe tu rutina anterior, progresos, cargas utilizadas, etc."
                            value={previousProgress}
                            onChange={(e) => setPreviousProgress(e.target.value)}
                            rows={4}
                            className="bg-white/70 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full h-14 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                size="lg"
                variant="default"
            >
                {isGenerating ? (
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generando Rutina...
                    </div>
                ) : (
                    'Generar Rutina Personalizada'
                )}
            </Button>
        </>
    );
}

