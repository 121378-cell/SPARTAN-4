import { useState, useEffect, memo } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  Brain, Zap, Activity, Waves, Target, ArrowLeft, Play, Pause, 
  RotateCcw, TrendingUp, Eye, Cpu, Radio, Gauge, AlertCircle,
  CheckCircle2, Loader2, Sparkles
} from "lucide-react";

interface NeuralTrainingProps {
  onBack: () => void;
}

type NeuralExercise = {
  id: string;
  name: string;
  description: string;
  targetFrequency: number;
  difficulty: 'Novice' | 'Intermediate' | 'Advanced' | 'Quantum Master';
  duration: number;
  neuralPattern: string;
  benefits: string[];
};

type TrainingSession = {
  exercise: NeuralExercise;
  isActive: boolean;
  progress: number;
  neuralCoherence: number;
  brainwaveSync: number;
  quantumResonance: number;
};

const NeuralTraining = memo(function NeuralTraining({ onBack }: NeuralTrainingProps) {
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [neuralReadings, setNeuralReadings] = useState({
    alpha: 8.2,
    beta: 15.7,
    theta: 6.1,
    delta: 2.3,
    gamma: 42.5
  });
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationComplete, setCalibrationComplete] = useState(false);

  const neuralExercises: NeuralExercise[] = [
    {
      id: 'focus-enhancement',
      name: 'Potenciador de Concentración',
      description: 'Amplifica la concentración neural mediante resonancia cuántica dirigida',
      targetFrequency: 40.0,
      difficulty: 'Intermediate',
      duration: 300,
      neuralPattern: 'Gamma-Theta Cross-Frequency',
      benefits: ['Concentración +340%', 'Claridad Mental', 'Reducción de Ruido Neural']
    },
    {
      id: 'memory-optimizer',
      name: 'Optimizador de Memoria',
      description: 'Fortalece las conexiones sinápticas para memoria a largo plazo',
      targetFrequency: 8.0,
      difficulty: 'Advanced',
      duration: 450,
      neuralPattern: 'Alpha-Theta Coherence',
      benefits: ['Memoria +280%', 'Retención Perfecta', 'Acceso Instantáneo']
    },
    {
      id: 'reflex-accelerator',
      name: 'Acelerador de Reflejos',
      description: 'Optimiza la velocidad de respuesta neuromuscular',
      targetFrequency: 25.0,
      difficulty: 'Intermediate',
      duration: 240,
      neuralPattern: 'Beta-Gamma Synchronization',
      benefits: ['Reflejos +420%', 'Tiempo de Reacción Cuántico', 'Coordinación Perfecta']
    },
    {
      id: 'consciousness-expansion',
      name: 'Expansión de Conciencia',
      description: 'Accede a estados expandidos de conciencia cuántica',
      targetFrequency: 4.5,
      difficulty: 'Quantum Master',
      duration: 900,
      neuralPattern: 'Delta-Gamma Paradox',
      benefits: ['Conciencia Multidimensional', 'Intuición Cuántica', 'Telepatía Básica']
    }
  ];

  // Simulate neural readings
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralReadings(prev => ({
        alpha: Math.max(0, prev.alpha + (Math.random() - 0.5) * 2),
        beta: Math.max(0, prev.beta + (Math.random() - 0.5) * 3),
        theta: Math.max(0, prev.theta + (Math.random() - 0.5) * 1.5),
        delta: Math.max(0, prev.delta + (Math.random() - 0.5) * 1),
        gamma: Math.max(0, prev.gamma + (Math.random() - 0.5) * 5)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate training session
  useEffect(() => {
    if (currentSession?.isActive) {
      const interval = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return null;
          
          const newProgress = Math.min(100, prev.progress + 1);
          const newCoherence = Math.min(100, prev.neuralCoherence + (Math.random() - 0.3) * 3);
          const newBrainwaveSync = Math.min(100, prev.brainwaveSync + (Math.random() - 0.3) * 2);
          const newQuantumResonance = Math.min(100, prev.quantumResonance + (Math.random() - 0.4) * 1.5);
          
          if (newProgress >= 100) {
            return {
              ...prev,
              progress: 100,
              isActive: false,
              neuralCoherence: newCoherence,
              brainwaveSync: newBrainwaveSync,
              quantumResonance: newQuantumResonance
            };
          }
          
          return {
            ...prev,
            progress: newProgress,
            neuralCoherence: newCoherence,
            brainwaveSync: newBrainwaveSync,
            quantumResonance: newQuantumResonance
          };
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentSession?.isActive]);

  const startCalibration = async () => {
    setIsCalibrating(true);
    
    // Simulate calibration process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsCalibrating(false);
    setCalibrationComplete(true);
  };

  const startTraining = (exercise: NeuralExercise) => {
    setCurrentSession({
      exercise,
      isActive: true,
      progress: 0,
      neuralCoherence: 65,
      brainwaveSync: 70,
      quantumResonance: 85
    });
  };

  const pauseTraining = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: !currentSession.isActive
      });
    }
  };

  const stopTraining = () => {
    setCurrentSession(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Novice': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-400/20';
      case 'Advanced': return 'text-purple-400 bg-purple-400/20';
      case 'Quantum Master': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="spartan-xxii-body min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="holographic-text text-4xl mb-2" data-text="Entrenamiento Neural">
              Entrenamiento Neural
            </h1>
            <p className="text-lg text-gray-300">
              Interface directa cerebro-computadora para optimización neural avanzada
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="neural-button bg-transparent border-2 border-cyan-400 text-cyan-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Neural Monitoring Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Calibration Status */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 dimensional-icon" />
                  Estado de Calibración
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!calibrationComplete && !isCalibrating && (
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">
                      Neural interface requiere calibración antes del entrenamiento
                    </p>
                    <Button 
                      onClick={startCalibration}
                      className="neural-button w-full"
                    >
                      <Cpu className="mr-2 h-4 w-4" />
                      Iniciar Calibración
                    </Button>
                  </div>
                )}
                
                {isCalibrating && (
                  <div className="text-center">
                    <div className="holographic-loader mx-auto mb-4" />
                    <p className="text-cyan-400 mb-2">Calibrando Interface Neural...</p>
                    <p className="text-xs text-gray-500">
                      Sincronizando patrones cerebrales con matriz cuántica
                    </p>
                  </div>
                )}
                
                {calibrationComplete && (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-green-400 mb-2">Calibración Completa</p>
                    <p className="text-xs text-gray-500">
                      Neural interface sincronizada y lista para entrenamiento
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Real-time Neural Readings */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 dimensional-icon" />
                  Lecturas Neurales en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(neuralReadings).map(([wave, value]) => (
                  <div key={wave} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{wave}</span>
                      <span className="text-sm text-cyan-400">{value.toFixed(1)} Hz</span>
                    </div>
                    <div className="neural-progress">
                      <div 
                        className="neural-progress-fill"
                        style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Current Session Monitor */}
            {currentSession && (
              <Card className="quantum-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 dimensional-icon" />
                    Sesión Activa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{currentSession.exercise.name}</h4>
                    <div className="neural-progress mb-2">
                      <div 
                        className="neural-progress-fill"
                        style={{ width: `${currentSession.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{currentSession.progress.toFixed(1)}% completado</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Coherencia Neural</span>
                        <span className="text-cyan-400">{currentSession.neuralCoherence.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.neuralCoherence}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Sincronización</span>
                        <span className="text-green-400">{currentSession.brainwaveSync.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.brainwaveSync}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Resonancia Cuántica</span>
                        <span className="text-purple-400">{currentSession.quantumResonance.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.quantumResonance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={pauseTraining}
                      className="neural-button flex-1"
                      variant="outline"
                    >
                      {currentSession.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      onClick={stopTraining}
                      className="neural-button flex-1"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Exercise Selection */}
          <div className="lg:col-span-2">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="holographic-text text-2xl" data-text="Ejercicios Neurales Disponibles">
                  Ejercicios Neurales Disponibles
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Selecciona un protocolo de entrenamiento neural para optimizar tu rendimiento cognitivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {neuralExercises.map((exercise) => (
                    <Card key={exercise.id} className="quantum-card quantum-float">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-4">
                          <Brain className="h-8 w-8 dimensional-icon" />
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{exercise.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm leading-relaxed">
                          {exercise.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Frecuencia Objetivo:</span>
                            <span className="text-cyan-400">{exercise.targetFrequency} Hz</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Duración:</span>
                            <span className="text-cyan-400">{Math.floor(exercise.duration / 60)}m {exercise.duration % 60}s</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Patrón Neural:</span>
                            <span className="text-cyan-400 text-xs">{exercise.neuralPattern}</span>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold mb-2 text-gray-300">Beneficios:</h4>
                          <ul className="space-y-1">
                            {exercise.benefits.map((benefit, index) => (
                              <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-green-400" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button 
                          onClick={() => startTraining(exercise)}
                          disabled={!calibrationComplete || (currentSession?.isActive && currentSession.exercise.id !== exercise.id)}
                          className="neural-button w-full"
                        >
                          {currentSession?.exercise.id === exercise.id && currentSession.isActive ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Entrenando...
                            </>
                          ) : (
                            <>
                              <Zap className="mr-2 h-4 w-4" />
                              Iniciar Entrenamiento
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NeuralTraining;