import { useState, useEffect, memo, useMemo } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  Brain, Zap, Eye, Atom, Cpu, Orbit, Sparkles, Target, TrendingUp, 
  Activity, Heart, User, Settings, LogOut, Dna, Waves, Beaker,
  Rocket, Gauge, Fingerprint, Scan, Radio, Database
} from "lucide-react";
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';

interface SpartanXXIIDashboardProps {
  userData: UserData;
  workoutPlans: WorkoutPlan[];
  progressData: ProgressData[];
  onGenerateQuantumWorkout: () => void;
  onNeuralTraining: () => void;
  onHolographicGym: () => void;
  onQuantumNutrition: () => void;
  onConsciousnessFitness: () => void;
  onTemporalAnalysis: () => void;
  onBiomodification: () => void;
  onMultidimensionalMetrics: () => void;
  isGenerating: boolean;
  onBack: () => void;
}

const SpartanXXIIDashboard = memo(function SpartanXXIIDashboard({
  userData,
  workoutPlans,
  progressData,
  onGenerateQuantumWorkout,
  onNeuralTraining,
  onHolographicGym,
  onQuantumNutrition,
  onConsciousnessFitness,
  onTemporalAnalysis,
  onBiomodification,
  onMultidimensionalMetrics,
  isGenerating,
  onBack
}: SpartanXXIIDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [neuralActivity, setNeuralActivity] = useState(87.3);
  const [quantumCoherence, setQuantumCoherence] = useState(94.7);
  const [dimensionalSync, setDimensionalSync] = useState(99.2);
  const [activeTab, setActiveTab] = useState<'overview' | 'neural' | 'quantum' | 'temporal'>('overview');

  // Simulate real-time futuristic metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setNeuralActivity(prev => prev + (Math.random() - 0.5) * 2);
      setQuantumCoherence(prev => Math.min(100, Math.max(85, prev + (Math.random() - 0.5) * 1)));
      setDimensionalSync(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5) * 0.5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const quantumStats = useMemo(() => [
    {
      title: "Coherencia Cuántica",
      value: `${quantumCoherence.toFixed(1)}%`,
      icon: <Atom className="h-6 w-6" />,
      gradient: "from-blue-400 to-cyan-400",
      description: "Sincronización con el campo cuántico"
    },
    {
      title: "Actividad Neural",
      value: `${neuralActivity.toFixed(1)}Hz`,
      icon: <Brain className="h-6 w-6" />,
      gradient: "from-green-400 to-emerald-400",
      description: "Frecuencia de ondas cerebrales"
    },
    {
      title: "Sync Dimensional",
      value: `${dimensionalSync.toFixed(1)}%`,
      icon: <Orbit className="h-6 w-6" />,
      gradient: "from-purple-400 to-pink-400",
      description: "Alineación multidimensional"
    },
    {
      title: "Evolución Personal",
      value: "+847%",
      icon: <TrendingUp className="h-6 w-6" />,
      gradient: "from-yellow-400 to-orange-400",
      description: "Crecimiento desde baseline"
    }
  ], [quantumCoherence, neuralActivity, dimensionalSync]);

  const futuristicFeatures = [
    {
      title: "Entrenamiento Neural",
      description: "Interface directa cerebro-músculo con retroalimentación cuántica",
      icon: <Brain className="h-8 w-8" />,
      gradient: "from-cyan-500 to-blue-600",
      onClick: onNeuralTraining,
      status: "ACTIVO"
    },
    {
      title: "Gimnasio Holográfico",
      description: "Entornos de entrenamiento inmersivos con gravedad artificial",
      icon: <Eye className="h-8 w-8" />,
      gradient: "from-purple-500 to-indigo-600",
      onClick: onHolographicGym,
      status: "BETA"
    },
    {
      title: "Nutrición Cuántica",
      description: "Síntesis molecular de nutrientes perfectos para tu ADN",
      icon: <Beaker className="h-8 w-8" />,
      gradient: "from-green-500 to-teal-600",
      onClick: onQuantumNutrition,
      status: "NUEVO"
    },
    {
      title: "Fitness de Conciencia",
      description: "Entrenamiento de la mente como músculo cuántico",
      icon: <Sparkles className="h-8 w-8" />,
      gradient: "from-pink-500 to-rose-600",
      onClick: onConsciousnessFitness,
      status: "ALPHA"
    },
    {
      title: "Análisis Temporal",
      description: "Predicción de salud futura en múltiples líneas temporales",
      icon: <Gauge className="h-8 w-8" />,
      gradient: "from-yellow-500 to-amber-600",
      onClick: onTemporalAnalysis,
      status: "EXPERIMENTAL"
    },
    {
      title: "Biomodificación",
      description: "Optimización genética temporal y reversible",
      icon: <Dna className="h-8 w-8" />,
      gradient: "from-red-500 to-orange-600",
      onClick: onBiomodification,
      status: "RESTRINGIDO"
    }
  ];

  return (
    <div className="spartan-xxii-body min-h-screen p-6">
      {/* Neural Network Background */}
      <div className="neural-network">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="neural-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="holographic-text text-6xl mb-2" data-text="SPARTAN XXII">
              SPARTAN XXII
            </h1>
            <p className="text-xl text-gray-300 font-light">
              Ecosistema de Fitness del Siglo XXII
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>Stardate: {currentTime.toISOString().slice(0, 10)}</span>
              <span>•</span>
              <span>Neural Link: ESTABLE</span>
              <span>•</span>
              <span>Quantum Field: SINCRONIZADO</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="neural-button bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black"
            >
              Volver al Presente
            </Button>
            <Button variant="outline" className="p-3">
              <Settings className="h-5 w-5 dimensional-icon" />
            </Button>
          </div>
        </div>

        {/* Quantum Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quantumStats.map((stat, index) => (
            <Card key={index} className="quantum-card quantum-float">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.gradient} bg-opacity-20`}>
                    <div className="dimensional-icon">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold holographic-text" data-text={stat.value}>
                      {stat.value}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">{stat.title}</h3>
                <p className="text-xs text-gray-500">{stat.description}</p>
                <div className="neural-progress mt-3">
                  <div 
                    className="neural-progress-fill"
                    style={{ width: `${Math.min(100, parseFloat(stat.value))}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'overview', label: 'Vista General', icon: <Target className="h-4 w-4" /> },
            { key: 'neural', label: 'Neural', icon: <Brain className="h-4 w-4" /> },
            { key: 'quantum', label: 'Cuántico', icon: <Atom className="h-4 w-4" /> },
            { key: 'temporal', label: 'Temporal', icon: <Gauge className="h-4 w-4" /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`neural-button flex items-center gap-2 px-6 py-3 ${
                activeTab === tab.key 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                  : 'bg-gray-800 border border-gray-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quantum Workout Generator */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Rocket className="h-8 w-8 dimensional-icon" />
                  <span className="holographic-text" data-text="Generador Cuántico de Entrenamientos">
                    Generador Cuántico de Entrenamientos
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Crea rutinas optimizadas usando algoritmos cuánticos y análisis neural profundo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={onGenerateQuantumWorkout}
                  disabled={isGenerating}
                  className="neural-button w-full h-16 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="holographic-loader mr-3" />
                      Procesando en Realidades Paralelas...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-6 w-6" />
                      Generar Entrenamiento Cuántico
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Futuristic Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futuristicFeatures.map((feature, index) => (
                <Card key={index} className="quantum-card quantum-float">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-20`}>
                        <div className="dimensional-icon text-white">
                          {feature.icon}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        feature.status === 'ACTIVO' ? 'bg-green-500 text-white' :
                        feature.status === 'BETA' ? 'bg-blue-500 text-white' :
                        feature.status === 'NUEVO' ? 'bg-purple-500 text-white' :
                        feature.status === 'ALPHA' ? 'bg-yellow-500 text-black' :
                        feature.status === 'EXPERIMENTAL' ? 'bg-orange-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {feature.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={feature.onClick}
                      className={`neural-button w-full bg-gradient-to-r ${feature.gradient} hover:scale-105`}
                      disabled={feature.status === 'RESTRINGIDO'}
                    >
                      {feature.status === 'RESTRINGIDO' ? 'Acceso Denegado' : 'Acceder'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'neural' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="holographic-text text-2xl" data-text="Interface Neural">
                  Interface Neural
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="quantum-stat">
                    <div className="quantum-stat-content">
                      <Waves className="h-12 w-12 dimensional-icon mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ondas Cerebrales</h3>
                      <p className="text-3xl font-bold text-cyan-400">{neuralActivity.toFixed(1)} Hz</p>
                      <p className="text-sm text-gray-400 mt-2">Estado Theta Profundo</p>
                    </div>
                  </div>
                  <div className="quantum-stat">
                    <div className="quantum-stat-content">
                      <Cpu className="h-12 w-12 dimensional-icon mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Procesamiento</h3>
                      <p className="text-3xl font-bold text-green-400">847 TFLOPS</p>
                      <p className="text-sm text-gray-400 mt-2">Capacidad Neural</p>
                    </div>
                  </div>
                  <div className="quantum-stat">
                    <div className="quantum-stat-content">
                      <Fingerprint className="h-12 w-12 dimensional-icon mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Biometría</h3>
                      <p className="text-3xl font-bold text-purple-400">99.97%</p>
                      <p className="text-sm text-gray-400 mt-2">Precisión Cuántica</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'quantum' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="holographic-text text-2xl" data-text="Estado Cuántico">
                  Estado Cuántico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Atom className="h-6 w-6 dimensional-icon" />
                      Coherencia Cuántica
                    </h3>
                    <div className="neural-progress mb-4">
                      <div 
                        className="neural-progress-fill"
                        style={{ width: `${quantumCoherence}%` }}
                      />
                    </div>
                    <p className="text-gray-400">
                      Tu campo biológico está sincronizado con el campo cuántico universal
                      en un {quantumCoherence.toFixed(1)}%. Nivel óptimo para modificaciones temporales.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Radio className="h-6 w-6 dimensional-icon" />
                      Resonancia Dimensional
                    </h3>
                    <div className="neural-progress mb-4">
                      <div 
                        className="neural-progress-fill"
                        style={{ width: `${dimensionalSync}%` }}
                      />
                    </div>
                    <p className="text-gray-400">
                      Alineación perfecta con {dimensionalSync.toFixed(1)}% de las dimensiones
                      paralelas. Acceso completo a realidades alternativas disponible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'temporal' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="holographic-text text-2xl" data-text="Análisis Temporal">
                  Análisis Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Gauge className="h-20 w-20 dimensional-icon mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold mb-4">Líneas Temporales Analizadas</h3>
                  <p className="text-6xl font-bold holographic-text mb-4" data-text="∞">∞</p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Análisis completo de todas las posibilidades cuánticas de tu evolución
                    física en realidades paralelas. Predicción de salud futura con precisión
                    del 99.97%.
                  </p>
                  <Button className="neural-button mt-6">
                    <Database className="mr-2 h-5 w-5" />
                    Acceder a Base de Datos Temporal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
});

export default SpartanXXIIDashboard;