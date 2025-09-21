import { useState, useEffect, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  Eye, Globe, Mountain, Waves, Sun, Moon, ArrowLeft, Play, Pause, 
  RotateCcw, Settings, Volume2, VolumeX, Maximize, Minimize,
  Thermometer, Wind, Gauge, Zap, Target, Sparkles, Orbit, Headphones, Gamepad2
} from "lucide-react";

interface VRImmersiveWorkoutProps {
  onBack: () => void;
}

type Environment = {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  gravity: number; // Earth = 1.0
  atmosphere: string;
  temperature: number; // Celsius
  pressure: number; // atm
  features: string[];
  benefits: string[];
  icon: React.ReactNode;
  color: string;
  available: boolean;
  vrSupport: boolean;
};

type EnvironmentSession = {
  environment: Environment;
  isActive: boolean;
  timeElapsed: number;
  caloriesBurned: number;
  adaptationLevel: number;
  environmentalStress: number;
  oxygenEfficiency: number;
  vrImmersion: number;
};

export default function VRImmersiveWorkout({ onBack }: VRImmersiveWorkoutProps) {
  const [currentSession, setCurrentSession] = useState<EnvironmentSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hologramQuality, setHologramQuality] = useState(100);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [vrEnabled, setVrEnabled] = useState(false);
  const [immersionLevel, setImmersionLevel] = useState(85);
  const [spatialAudioEnabled, setSpatialAudioEnabled] = useState(true);
  const vrContainerRef = useRef<HTMLDivElement>(null);

  const environments: Environment[] = [
    {
      id: 'mars-colony',
      name: 'Colonia Marciana 2157',
      description: 'Entrena en una colonia futurista en Marte con gravedad reducida y atmósfera controlada',
      difficulty: 7,
      gravity: 0.38,
      atmosphere: '95% CO2, Oxígeno Artificial',
      temperature: -63,
      pressure: 0.006,
      features: ['Gravedad Reducida', 'Trajes Presurizados', 'Tormentas de Polvo', 'Paisaje Alienígena'],
      benefits: ['Fortaleza Extrema', 'Adaptación Planetaria', 'Resistencia Atmosférica'],
      icon: <Globe className="h-8 w-8" />,
      color: 'from-red-500 to-orange-600',
      available: true,
      vrSupport: true
    },
    {
      id: 'underwater-city',
      name: 'Ciudad Submarina Atlántida',
      description: 'Sumérgete en una ciudad submarina con presión acuática y bioluminiscencia',
      difficulty: 8,
      gravity: 1.0,
      atmosphere: 'Agua Presurizada, Oxígeno Neural',
      temperature: 4,
      pressure: 50.0,
      features: ['Presión Extrema', 'Bioluminiscencia', 'Corrientes Acuáticas', 'Vida Marina'],
      benefits: ['Resistencia Pulmonar', 'Fuerza Hidrostática', 'Equilibrio Perfecto'],
      icon: <Waves className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-600',
      available: true,
      vrSupport: true
    },
    {
      id: 'zero-gravity-station',
      name: 'Estación Espacial Quantum',
      description: 'Experimenta el entrenamiento en gravedad cero con efectos cuánticos avanzados',
      difficulty: 9,
      gravity: 0.0,
      atmosphere: 'Oxígeno Puro Recirculado',
      temperature: 21,
      pressure: 1.0,
      features: ['Gravedad Cero', 'Efectos Cuánticos', 'Vista Estelar 360°', 'Campos Magnéticos'],
      benefits: ['Desarrollo Tridimensional', 'Coordinación Espacial', 'Fuerza Central'],
      icon: <Orbit className="h-8 w-8" />,
      color: 'from-purple-500 to-indigo-600',
      available: true,
      vrSupport: true
    },
    {
      id: 'plasma-storm',
      name: 'Tormenta de Plasma Estelar',
      description: 'Entrena en medio de una tormenta de plasma con campos electromagnéticos intensos',
      difficulty: 10,
      gravity: 1.2,
      atmosphere: 'Plasma Ionizado Controlado',
      temperature: 500,
      pressure: 2.5,
      features: ['Campos Electromagnéticos', 'Plasma Ionizado', 'Rayos de Energía', 'Distorsión Temporal'],
      benefits: ['Resistencia Electromagnética', 'Adaptación Extrema', 'Evolución Acelerada'],
      icon: <Zap className="h-8 w-8" />,
      color: 'from-yellow-500 to-red-600',
      available: false,
      vrSupport: false
    },
    {
      id: 'quantum-void',
      name: 'Vacío Cuántico Multidimensional',
      description: 'Experimenta el entrenamiento en un vacío cuántico donde las leyes físicas son maleables',
      difficulty: 11,
      gravity: -1, // Variable gravity represented as -1
      atmosphere: 'Vacío Cuántico Perfecto',
      temperature: -273,
      pressure: 0.0,
      features: ['Leyes Físicas Variables', 'Múltiples Dimensiones', 'Tiempo Distorsionado', 'Realidad Cuántica'],
      benefits: ['Transcendencia Física', 'Manipulación Cuántica', 'Conciencia Expandida'],
      icon: <Sparkles className="h-8 w-8" />,
      color: 'from-indigo-500 to-purple-600',
      available: false,
      vrSupport: false
    },
    {
      id: 'alpine-peaks',
      name: 'Picos Alpinos Himalaya 8.0',
      description: 'Escala las montañas más altas con oxígeno reducido y condiciones extremas',
      difficulty: 6,
      gravity: 1.0,
      atmosphere: 'Oxígeno Reducido 40%',
      temperature: -40,
      pressure: 0.3,
      features: ['Altitud Extrema', 'Vientos Huracanados', 'Avalanchas', 'Hipoxia Controlada'],
      benefits: ['Capacidad Pulmonar', 'Resistencia Altitud', 'Fuerza Gravitacional'],
      icon: <Mountain className="h-8 w-8" />,
      color: 'from-gray-500 to-white',
      available: true,
      vrSupport: true
    }
  ];

  // Simulate session progress
  useEffect(() => {
    if (currentSession?.isActive) {
      const interval = setInterval(() => {
        setCurrentSession(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            timeElapsed: prev.timeElapsed + 1,
            caloriesBurned: prev.caloriesBurned + (Math.random() * 3 + 2),
            adaptationLevel: Math.min(100, prev.adaptationLevel + (Math.random() * 0.5)),
            environmentalStress: Math.max(0, prev.environmentalStress + (Math.random() - 0.7) * 2),
            oxygenEfficiency: Math.min(100, prev.oxygenEfficiency + (Math.random() * 0.3)),
            vrImmersion: Math.min(100, prev.vrImmersion + (Math.random() * 0.2))
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentSession?.isActive]);

  // Simulate hologram quality fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setHologramQuality(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate VR headset connection
  const connectVRHeadset = async () => {
    setIsInitializing(true);
    
    // Simulate VR initialization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setVrEnabled(true);
    setIsInitializing(false);
  };

  const initializeEnvironment = async (environment: Environment) => {
    setIsInitializing(true);
    
    // Simulate initialization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCurrentSession({
      environment,
      isActive: false,
      timeElapsed: 0,
      caloriesBurned: 0,
      adaptationLevel: 20,
      environmentalStress: environment.difficulty * 8,
      oxygenEfficiency: environment.atmosphere.includes('Oxígeno') ? 85 : 60,
      vrImmersion: 75
    });
    
    setIsInitializing(false);
  };

  const startSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: true
      });
    }
  };

  const pauseSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: false
      });
    }
  };

  const endSession = () => {
    setCurrentSession(null);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 5) return 'text-green-400 bg-green-400/20';
    if (difficulty <= 7) return 'text-yellow-400 bg-yellow-400/20';
    if (difficulty <= 9) return 'text-orange-400 bg-orange-400/20';
    return 'text-red-400 bg-red-400/20';
  };

  return (
    <div className="spartan-xxii-body min-h-screen p-6">
      {/* Holographic particle effects */}
      <div className="neural-network">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="neural-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              background: `hsl(${Math.random() * 360}, 70%, 60%)`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="holographic-text text-4xl mb-2" data-text="Entrenamiento Inmersivo VR">
              Entrenamiento Inmersivo VR
            </h1>
            <p className="text-lg text-gray-300">
              Entornos de entrenamiento completamente inmersivos con realidad virtual avanzada
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="neural-button bg-transparent border-2 border-cyan-400 text-cyan-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* System Status */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 dimensional-icon" />
                  Estado del Sistema VR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Calidad Holograma</span>
                    <span className="text-cyan-400">{hologramQuality.toFixed(1)}%</span>
                  </div>
                  <div className="neural-progress">
                    <div 
                      className="neural-progress-fill"
                      style={{ width: `${hologramQuality}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Nivel de Inmersión</span>
                    <span className="text-green-400">{immersionLevel}%</span>
                  </div>
                  <div className="neural-progress">
                    <div 
                      className="neural-progress-fill"
                      style={{ width: `${immersionLevel}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className="flex-1"
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSpatialAudioEnabled(!spatialAudioEnabled)}
                    className="flex-1"
                  >
                    {spatialAudioEnabled ? <Headphones className="h-4 w-4" /> : <Gamepad2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* VR Connection */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Conexión VR</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${vrEnabled ? 'bg-green-500' : 'bg-red-500'}`}>
                      {vrEnabled ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  
                  {!vrEnabled ? (
                    <Button 
                      onClick={connectVRHeadset}
                      disabled={isInitializing}
                      className="w-full neural-button"
                    >
                      {isInitializing ? (
                        <>
                          <div className="holographic-loader mr-2" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <Gamepad2 className="mr-2 h-4 w-4" />
                          Conectar Visor VR
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Visor VR conectado y listo para usar
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Session Monitor */}
            {currentSession && (
              <Card className="quantum-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 dimensional-icon" />
                    Sesión Activa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{currentSession.environment.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tiempo:</span>
                        <p className="text-cyan-400 font-mono">{formatTime(currentSession.timeElapsed)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Calorías:</span>
                        <p className="text-green-400 font-mono">{Math.round(currentSession.caloriesBurned)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Adaptación</span>
                        <span className="text-blue-400">{currentSession.adaptationLevel.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.adaptationLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Estrés Ambiental</span>
                        <span className="text-orange-400">{currentSession.environmentalStress.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.environmentalStress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Eficiencia O₂</span>
                        <span className="text-purple-400">{currentSession.oxygenEfficiency.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.oxygenEfficiency}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Inmersión VR</span>
                        <span className="text-cyan-400">{currentSession.vrImmersion.toFixed(1)}%</span>
                      </div>
                      <div className="neural-progress">
                        <div 
                          className="neural-progress-fill"
                          style={{ width: `${currentSession.vrImmersion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={currentSession.isActive ? pauseSession : startSession}
                      className="neural-button flex-1"
                      disabled={isInitializing}
                    >
                      {currentSession.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      onClick={endSession}
                      className="neural-button flex-1"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Environmental Conditions */}
            {currentSession && (
              <Card className="quantum-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 dimensional-icon" />
                    Condiciones Ambientales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Gravedad:</span>
                    <span className="text-cyan-400">{currentSession.environment.gravity}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Temperatura:</span>
                    <span className="text-cyan-400">{currentSession.environment.temperature}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Presión:</span>
                    <span className="text-cyan-400">{currentSession.environment.pressure} atm</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-1">Atmósfera:</span>
                    <span className="text-xs text-cyan-400">{currentSession.environment.atmosphere}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Environment Selection */}
          <div className="lg:col-span-2">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="holographic-text text-2xl" data-text="Entornos Inmersivos VR">
                  Entornos Inmersivos VR
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Selecciona un entorno completamente inmersivo para tu sesión de entrenamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {environments.map((environment) => (
                    <Card key={environment.id} className="quantum-card quantum-float">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-4 rounded-xl bg-gradient-to-r ${environment.color} bg-opacity-20`}>
                            <div className="dimensional-icon text-white">
                              {environment.icon}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(environment.difficulty)}`}>
                              Nivel {environment.difficulty}
                            </span>
                            {!environment.available && (
                              <div className="mt-1">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                  BLOQUEADO
                                </span>
                              </div>
                            )}
                            {environment.vrSupport && (
                              <div className="mt-1">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500 text-white">
                                  VR
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{environment.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm leading-relaxed">
                          {environment.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mb-6">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <Orbit className="h-3 w-3 text-cyan-400" />
                              <span className="text-gray-400">Gravedad: <span className="text-cyan-400">{environment.gravity}g</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-3 w-3 text-cyan-400" />
                              <span className="text-gray-400">Temp: <span className="text-cyan-400">{environment.temperature}°C</span></span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold mb-2 text-gray-300">Características:</h4>
                            <div className="flex flex-wrap gap-1">
                              {environment.features.map((feature, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold mb-2 text-gray-300">Beneficios:</h4>
                            <ul className="space-y-1">
                              {environment.benefits.map((benefit, index) => (
                                <li key={index} className="text-xs text-gray-400 flex items-center gap-2">
                                  <Sparkles className="h-3 w-3 text-green-400" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => initializeEnvironment(environment)}
                          disabled={!environment.available || isInitializing || (currentSession?.environment.id === environment.id)}
                          className={`neural-button w-full bg-gradient-to-r ${environment.color} hover:scale-105`}
                        >
                          {isInitializing && currentSession?.environment.id === environment.id ? (
                            <>
                              <div className="holographic-loader mr-2" />
                              Inicializando...
                            </>
                          ) : currentSession?.environment.id === environment.id ? (
                            'Entorno Activo'
                          ) : environment.available ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Inicializar Entorno
                            </>
                          ) : (
                            'Requiere Evolución'
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
}