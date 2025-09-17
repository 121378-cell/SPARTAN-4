
import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Progress, Input, Label, Alert, AlertDescription, AlertTitle, Badge } from "./ui";
import { Activity, AlertCircle, RotateCw, StretchHorizontal, ArrowLeft, Brain, Target, TrendingUp, Shield, Zap, Clock } from "lucide-react";
import type { BodyPart, OverloadData, CorrectiveExercise } from "../lib/types";
import { detectOverloadApi } from "../lib/api";
import { BiomechanicalOverloadAI, type OverloadRisk, type CorrectiveProtocol, type LoadManagementStrategy } from "../lib/biomechanicalOverloadAI";

interface OverloadDetectionProps {
    onBack: () => void;
}

function OverloadDetection({ onBack }: OverloadDetectionProps) {
  const [userInput, setUserInput] = useState<{
    painAreas: BodyPart[];
    activityLevel: 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'atleta';
    recentWorkouts: string[];
  }>({
    painAreas: [],
    activityLevel: 'moderado',
    recentWorkouts: []
  });

  const [overloadData, setOverloadData] = useState<OverloadData[]>([]);
  const [correctiveExercises, setCorrectiveExercises] = useState<CorrectiveExercise[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState<BodyPart | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced biomechanical analysis state
  const [biomechanicalAI] = useState(new BiomechanicalOverloadAI());
  const [overloadRisks, setOverloadRisks] = useState<OverloadRisk[]>([]);
  const [correctiveProtocols, setCorrectiveProtocols] = useState<CorrectiveProtocol[]>([]);
  const [loadManagement, setLoadManagement] = useState<LoadManagementStrategy | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'basic' | 'advanced'>('basic');
  const [showAdvancedResults, setShowAdvancedResults] = useState(false);

  const detectOverload = async () => {
    setIsAnalyzing(true);
    setError(null);
    setOverloadData([]);
    setCorrectiveExercises([]);
    setOverloadRisks([]);
    setCorrectiveProtocols([]);
    setLoadManagement(null);
    
    try {
        if (analysisMode === 'basic') {
          // Basic analysis using existing API
          const result = await detectOverloadApi(userInput);
          setOverloadData(result.overloadData);
          setCorrectiveExercises(result.correctiveExercises);
        } else {
          // Advanced biomechanical analysis
          await performAdvancedAnalysis();
        }
    } catch (e) {
        console.error("Failed to detect overload:", e);
        setError("An error occurred during analysis. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };
  
  const performAdvancedAnalysis = async () => {
    // Simulate training metrics from user input
    const mockTrainingMetrics = generateMockTrainingMetrics();
    const mockWearableData = generateMockWearableData();
    const mockExerciseHistory = generateMockExerciseHistory();
    
    const analysis = await biomechanicalAI.analyzeOverloadRisk(
      mockTrainingMetrics,
      mockWearableData,
      mockExerciseHistory
    );
    
    setOverloadRisks(analysis.overloadRisks);
    setCorrectiveProtocols(analysis.correctiveProtocols);
    setLoadManagement(analysis.loadManagement);
    setShowAdvancedResults(true);
  };
  
  const generateMockTrainingMetrics = () => {
    // Generate training metrics based on user activity level
    const baseRPE = userInput.activityLevel === 'atleta' ? 8 : 
                   userInput.activityLevel === 'intenso' ? 7 : 
                   userInput.activityLevel === 'moderado' ? 6 : 5;
    
    return [{
      sessionId: 'mock-session',
      date: new Date(),
      rpe: baseRPE + (userInput.painAreas.length * 0.5),
      rir: Math.max(0, 3 - userInput.painAreas.length),
      heartRateData: {
        avgHR: 150,
        maxHR: 180,
        hrv: Math.max(30, 60 - (userInput.painAreas.length * 5)),
        recoveryHR: 120
      },
      adherence: Math.max(60, 90 - (userInput.painAreas.length * 5)),
      sleepQuality: Math.max(5, 8 - (userInput.painAreas.length * 0.3)),
      stressLevel: Math.min(10, 4 + (userInput.painAreas.length * 0.8)),
      muscleSymptoms: Math.min(10, 2 + (userInput.painAreas.length * 1.5)),
      motivation: Math.max(3, 8 - (userInput.painAreas.length * 0.5)),
      exerciseData: []
    }];
  };
  
  const generateMockWearableData = () => {
    return {
      recovery: {
        hrv: Math.max(30, 60 - (userInput.painAreas.length * 5)),
        recoveryScore: Math.max(40, 85 - (userInput.painAreas.length * 8))
      },
      sleep: {
        quality: Math.max(50, 85 - (userInput.painAreas.length * 6))
      }
    };
  };
  
  const generateMockExerciseHistory = () => {
    // Generate exercise history based on pain areas
    const exercises = [];
    
    for (const painArea of userInput.painAreas) {
      const exercise = {
        exerciseName: getExerciseForBodyPart(painArea),
        plannedWeight: 100,
        actualWeight: 100,
        plannedSets: 3,
        completedSets: 3,
        plannedReps: 10,
        actualReps: [10, 10, 8],
        restTime: [90, 90, 120],
        rpe: Math.min(10, 7 + Math.random() * 2),
        rir: Math.max(0, Math.floor(Math.random() * 3)),
        formQuality: Math.max(4, 8 - Math.random() * 2),
        notes: `Ejercicio afectando ${painArea}`
      };
      exercises.push(exercise);
    }
    
    return exercises;
  };
  
  const getExerciseForBodyPart = (bodyPart: BodyPart): string => {
    const exerciseMap: { [key in BodyPart]: string } = {
      'hombros': 'Overhead Press',
      'columna': 'Deadlift',
      'caderas': 'Squat',
      'rodillas': 'Leg Press',
      'tobillos': 'Calf Raise',
      'cuello': 'Neck Exercise',
      'muñecas': 'Wrist Curl',
      'lumbar': 'Back Squat',
      'isquios': 'Romanian Deadlift',
      'gemelos': 'Standing Calf Raise'
    };
    
    return exerciseMap[bodyPart] || 'General Exercise';
  };

  const toggleBodyPart = (part: BodyPart) => {
    setUserInput(prev => {
      if (prev.painAreas.includes(part)) {
        return {
          ...prev,
          painAreas: prev.painAreas.filter(p => p !== part)
        };
      } else {
        return {
          ...prev,
          painAreas: [...prev.painAreas, part]
        };
      }
    });
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-green-500';
    if (severity <= 6) return 'bg-yellow-500';
    if (severity <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Detección de Sobrecarga Muscular</h1>
                <p className="text-muted-foreground">
                Identifica áreas de tensión acumulada y recibe ejercicios correctivos personalizados
                </p>
            </div>
            <Button variant="outline" size="default" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel de entrada */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Perfil de Actividad</CardTitle>
                <CardDescription>
                  Proporciona información para un análisis preciso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de análisis</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={analysisMode === 'basic' ? 'default' : 'outline'}
                      onClick={() => setAnalysisMode('basic')}
                      size="sm"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Básico
                    </Button>
                    <Button
                      variant={analysisMode === 'advanced' ? 'default' : 'outline'}
                      onClick={() => setAnalysisMode('advanced')}
                      size="sm"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Biomecánico IA
                    </Button>
                  </div>
                  {analysisMode === 'advanced' && (
                    <p className="text-xs text-muted-foreground">
                      Análisis avanzado con inteligencia artificial que evalúa patrones biomecánicos y riesgo de lesión
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Nivel de actividad física</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['sedentario', 'ligero', 'moderado', 'intenso', 'atleta'] as const).map(level => (
                      <Button
                        key={level}
                        variant={userInput.activityLevel === level ? 'default' : 'outline'}
                        onClick={() => setUserInput({...userInput, activityLevel: level})}
                        size="sm"
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Entrenamientos recientes (opcional)</Label>
                  <Input 
                    placeholder="Ej: running, pesas, yoga..."
                    value={userInput.recentWorkouts.join(', ')}
                    onChange={(e) => setUserInput({
                      ...userInput,
                      recentWorkouts: e.target.value.split(',').map(s => s.trim())
                    })}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Áreas de Molestia</CardTitle>
                <CardDescription>
                  Selecciona las zonas donde sientes tensión o dolor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    'hombros', 'cuello', 'columna', 'lumbar', 
                    'caderas', 'rodillas', 'tobillos', 'muñecas',
                    'isquios', 'gemelos'
                  ] as BodyPart[]).map(part => (
                    <Button
                      key={part}
                      variant={userInput.painAreas.includes(part) ? 'default' : 'outline'}
                      onClick={() => toggleBodyPart(part)}
                      size="sm"
                    >
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={detectOverload}
                  disabled={userInput.painAreas.length === 0 || isAnalyzing}
                  className="w-full"
                  variant="default"
                  size="default"
                >
                  {isAnalyzing ? (
                    <>
                      <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4 mr-2" />
                      Detectar Sobrecarga
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Resultados */}
          <div className="md:col-span-2 space-y-6">
            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
                
                {isAnalyzing ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Progress value={50} className="w-full" />
                      <p className="mt-4 text-muted-foreground">
                        {analysisMode === 'advanced' 
                          ? 'Realizando análisis biomecánico avanzado con IA...' 
                          : 'Analizando patrones de movimiento y tensión muscular...'
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {showAdvancedResults && overloadRisks.length > 0 && (
                      <>
                        {/* Biomechanical Risk Assessment */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Brain className="h-5 w-5" />
                              Análisis Biomecánico Avanzado
                            </CardTitle>
                            <CardDescription>
                              Evaluación integral de riesgos de sobrecarga basada en IA
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {overloadRisks.map((risk, idx) => (
                                <div key={idx} className={`border rounded-lg p-4 ${
                                  risk.riskLevel === 'crítico' ? 'border-red-500 bg-red-50' :
                                  risk.riskLevel === 'alto' ? 'border-orange-500 bg-orange-50' :
                                  risk.riskLevel === 'moderado' ? 'border-yellow-500 bg-yellow-50' :
                                  'border-green-500 bg-green-50'
                                }`}>
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h3 className="font-semibold capitalize">{risk.bodyPart.replace('_', ' ')}</h3>
                                      <Badge variant={
                                        risk.riskLevel === 'crítico' ? 'outline' :
                                        risk.riskLevel === 'alto' ? 'outline' :
                                        risk.riskLevel === 'moderado' ? 'secondary' : 'default'
                                      }>
                                        {risk.riskLevel.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold">{risk.riskScore}</div>
                                      <div className="text-sm text-muted-foreground">Puntuación</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="font-medium">Causa principal:</span> {risk.primaryCause}
                                    </div>
                                    <div>
                                      <span className="font-medium">Estado de adaptación:</span> 
                                      <Badge variant="outline" className="ml-2">
                                        {risk.adaptationStatus.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Tiempo estimado a lesión:</span>
                                      <span className={`font-bold ${
                                        risk.timeToInjury <= 14 ? 'text-red-600' :
                                        risk.timeToInjury <= 35 ? 'text-orange-600' : 'text-green-600'
                                      }`}>
                                        {risk.timeToInjury} días
                                      </span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t">
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Shield className="h-3 w-3" />
                                        Confianza del análisis: {risk.confidenceLevel}%
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Load Management Strategy */}
                        {loadManagement && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Estrategia de Gestión de Carga
                              </CardTitle>
                              <CardDescription>
                                Plan personalizado para optimizar la recuperación y prevenir lesiones
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Fase Actual</h4>
                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                      {loadManagement.phase.charAt(0).toUpperCase() + loadManagement.phase.slice(1)}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Duración: {loadManagement.durationWeeks} semanas
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Reducción de Carga</h4>
                                    <div className="flex items-center gap-2">
                                      <div className="text-2xl font-bold text-orange-600">
                                        {loadManagement.loadReduction}%
                                      </div>
                                      <TrendingUp className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <Progress 
                                      value={loadManagement.loadReduction} 
                                      className="mt-2"
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Estrategias de Recuperación</h4>
                                    <ul className="text-sm space-y-1">
                                      {loadManagement.recoveryEnhancement.map((strategy, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                          {strategy}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Marcadores a Monitorear</h4>
                                    <ul className="text-sm space-y-1">
                                      {loadManagement.monitoringMarkers.slice(0, 3).map((marker, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                          <Clock className="h-3 w-3 text-blue-500" />
                                          {marker}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Advanced Corrective Protocols */}
                        {correctiveProtocols.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <StretchHorizontal className="h-5 w-5" />
                                Protocolos Correctivos Avanzados
                              </CardTitle>
                              <CardDescription>
                                Ejercicios terapéuticos basados en análisis biomecánico
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {correctiveProtocols.map((protocol, idx) => (
                                  <div key={idx} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h3 className="font-semibold capitalize">
                                          {protocol.targetStructure.replace('_', ' ')}
                                        </h3>
                                        <div className="flex gap-2 mt-2">
                                          <Badge variant={
                                            protocol.priority === 'inmediata' ? 'outline' :
                                            protocol.priority === 'alta' ? 'outline' :
                                            protocol.priority === 'media' ? 'secondary' : 'default'
                                          }>
                                            Prioridad: {protocol.priority}
                                          </Badge>
                                          <Badge variant="outline">
                                            {protocol.type.charAt(0).toUpperCase() + protocol.type.slice(1)}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm text-muted-foreground">
                                          Timeline esperado
                                        </div>
                                        <div className="font-medium">{protocol.expectedTimeline}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {protocol.exercises.map((exercise, exIdx) => (
                                        <div key={exIdx} className="bg-gray-50 rounded p-3">
                                          <h4 className="font-medium mb-2">{exercise.name}</h4>
                                          <Badge variant="outline" className="mb-2 text-xs">
                                            {exercise.category}
                                          </Badge>
                                          <p className="text-sm text-muted-foreground mb-3">
                                            {exercise.description}
                                          </p>
                                          <div className="text-xs space-y-1">
                                            <div><strong>Propósito:</strong> {exercise.biomechanicalPurpose}</div>
                                            <div><strong>Dosificación:</strong> {exercise.dosage.sets} series x {exercise.dosage.reps}</div>
                                            <div><strong>Frecuencia:</strong> {exercise.dosage.frequency}</div>
                                            <div><strong>Equipo:</strong> {exercise.equipment}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t">
                                      <h4 className="font-medium mb-2">Objetivos Biomecánicos:</h4>
                                      <ul className="text-sm space-y-1">
                                        {protocol.biomechanicalGoals.map((goal, goalIdx) => (
                                          <li key={goalIdx} className="flex items-center gap-2">
                                            <Zap className="h-3 w-3 text-blue-500" />
                                            {goal}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                    
                    {!showAdvancedResults && overloadData.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Resultados del Análisis</CardTitle>
                          <CardDescription>
                            Nivel de sobrecarga detectado en tus tejidos
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {overloadData.map((data, idx) => (
                              <div key={idx} className="border rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${getSeverityColor(data.severity)}`} />
                                    <h3 className="font-medium capitalize">
                                      {data.bodyPart} - {data.type}
                                    </h3>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setShowDetails(showDetails === data.bodyPart ? null : data.bodyPart)}
                                  >
                                    {showDetails === data.bodyPart ? 'Menos detalles' : 'Más detalles'}
                                  </Button>
                                </div>
                                
                                <div className="mt-2 flex items-center gap-4">
                                  <div className="flex-1">
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                      <span>Nivel de sobrecarga</span>
                                      <span>{data.severity}/10</span>
                                    </div>
                                    <Progress value={data.severity * 10} className="h-2" />
                                  </div>
                                  <span className="text-sm capitalize">{data.frequency}</span>
                                </div>
                                
                                {showDetails === data.bodyPart && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <p className="text-muted-foreground">
                                      {data.severity > 7 ? (
                                        "Sobrecarga crítica - necesita atención inmediata y posible evaluación profesional"
                                      ) : data.severity > 4 ? (
                                        "Sobrecarga significativa - implementa ejercicios correctivos y modifica tu rutina"
                                      ) : (
                                        "Sobrecarga leve - buena oportunidad para prevención proactiva"
                                      )}
                                    </p>
                                    {data.type === 'articular' && (
                                      <p className="mt-2">
                                        <span className="font-medium">Cuidado articular:</span> Considera reducir carga de impacto y trabajar en movilidad.
                                      </p>
                                    )}
                                    {data.type === 'tendinosa' && (
                                      <p className="mt-2">
                                        <span className="font-medium">Atención tendinosa:</span> Enfócate en ejercicios excéntricos y evita sobreuso.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {!overloadData.length && (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <div className="mx-auto max-w-md space-y-4">
                            <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="text-xl font-medium">Comienza tu análisis</h3>
                            <p className="text-muted-foreground">
                              Selecciona las áreas donde experimentas molestias y haz clic en "Detectar Sobrecarga" para recibir recomendaciones personalizadas.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {overloadData.length > 0 && overloadData.some(d => d.severity > 7) && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Atención: Sobrecarga crítica detectada</AlertTitle>
                        <AlertDescription>
                          Algunas áreas muestran niveles de sobrecarga altos. Considera consultar con un profesional de la salud además de seguir las recomendaciones.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}
            
            {!overloadData.length && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="mx-auto max-w-md space-y-4">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-xl font-medium">Comienza tu análisis</h3>
                    <p className="text-muted-foreground">
                      Selecciona las áreas donde experimentas molestias y haz clic en "Detectar Sobrecarga" para recibir recomendaciones personalizadas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverloadDetection;