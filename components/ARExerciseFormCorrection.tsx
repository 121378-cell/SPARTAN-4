import { useState, useEffect, useRef } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Alert, AlertTitle, AlertDescription } from "./ui";
import { RotateCcw, AlertTriangle, Check, Video, Activity, Zap, ArrowLeft, Eye, Camera, Scan } from "lucide-react";

interface ARExerciseFormCorrectionProps {
    onBack: () => void;
    exerciseName?: string | null;
}

type Exercise = {
  name: string;
  commonMistakes: Mistake[];
  optimalRange: {
    jointAngles: number[];
    speed: number[];
    symmetry: number[];
  };
};

type Mistake = {
  name: string;
  description: string;
  correction: string;
  severity: 'low' | 'medium' | 'high';
  sensorsDetected: string[];
};

type ARVisualization = {
  jointPositions: { x: number; y: number; z: number }[];
  skeletonLines: { start: number; end: number }[];
  mistakeHighlights: { jointIndex: number; mistake: Mistake }[];
};

export default function ARExerciseFormCorrection({ onBack, exerciseName }: ARExerciseFormCorrectionProps) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [arVisualization, setArVisualization] = useState<ARVisualization | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isARActive, setIsARActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Base de datos de ejercicios y errores comunes
  const exerciseDatabase: Exercise[] = [
    {
      name: "Sentadilla",
      commonMistakes: [
        {
          name: "Valgo de rodillas",
          description: "Las rodillas colapsan hacia adentro durante el movimiento",
          correction: "Mantener las rodillas alineadas con los dedos de los pies, activar glúteo medio",
          severity: 'high',
          sensorsDetected: ['cámara', 'IMU rodilla']
        },
        {
          name: "Profundidad insuficiente",
          description: "No alcanza la paralela (cadera por encima de la rodilla)",
          correction: "Trabajar movilidad de tobillo y cadera, usar box como guía",
          severity: 'medium',
          sensorsDetected: ['cámara', 'IMU cadera']
        },
        {
          name: "Curvatura lumbar",
          description: "Pérdida de neutralidad en columna lumbar",
          correction: "Activar core, mantener pecho alto, considerar menor peso",
          severity: 'high',
          sensorsDetected: ['cámara', 'EMG lumbar']
        }
      ],
      optimalRange: {
        jointAngles: [120, 145, 90], // Cadera, rodilla, tobillo
        speed: [0.8, 1.2], // m/s
        symmetry: [85, 100] // % simetría izquierda/derecha
      }
    },
    {
      name: "Press Banca",
      commonMistakes: [
        {
          name: "Arqueo excesivo lumbar",
          description: "Hiperextensión lumbar que compromete la columna",
          correction: "Mantener pelvis neutra, pies firmes en el suelo",
          severity: 'high',
          sensorsDetected: ['cámara', 'EMG lumbar']
        },
        {
          name: "Recorrido incompleto",
          description: "No toca el pecho en la fase excéntrica",
          correction: "Reducir peso, trabajar movilidad de hombros",
          severity: 'medium',
          sensorsDetected: ['cámara', 'IMU muñeca']
        },
        {
          name: "Desbalance lateral",
          description: "Un brazo se mueve más rápido o más lejos que el otro",
          correction: "Trabajar con peso unilateral primero, concentrarse en simetría",
          severity: 'medium',
          sensorsDetected: ['cámara', 'IMU bilateral']
        }
      ],
      optimalRange: {
        jointAngles: [75, 170, 45], // Hombro, codo, muñeca
        speed: [0.5, 0.9], // m/s
        symmetry: [90, 100] // % simetría izquierda/derecha
      }
    }
  ];

  // Initialize camera for AR
  useEffect(() => {
    if (isARActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isARActive]);

  // Simulate AR visualization
  const simulateARVisualization = () => {
    // Simulate joint positions in 3D space
    const jointPositions = [
      { x: 0.5, y: 0.2, z: 0 }, // Head
      { x: 0.5, y: 0.4, z: 0 }, // Shoulder center
      { x: 0.3, y: 0.4, z: 0 }, // Left shoulder
      { x: 0.7, y: 0.4, z: 0 }, // Right shoulder
      { x: 0.3, y: 0.6, z: 0 }, // Left elbow
      { x: 0.7, y: 0.6, z: 0 }, // Right elbow
      { x: 0.3, y: 0.8, z: 0 }, // Left wrist
      { x: 0.7, y: 0.8, z: 0 }, // Right wrist
      { x: 0.5, y: 0.9, z: 0 }, // Hip center
      { x: 0.35, y: 0.9, z: 0 }, // Left hip
      { x: 0.65, y: 0.9, z: 0 }, // Right hip
      { x: 0.35, y: 1.1, z: 0 }, // Left knee
      { x: 0.65, y: 1.1, z: 0 }, // Right knee
      { x: 0.35, y: 1.3, z: 0 }, // Left ankle
      { x: 0.65, y: 1.3, z: 0 }  // Right ankle
    ];

    // Define skeleton connections
    const skeletonLines = [
      { start: 0, end: 1 }, // Head to shoulder center
      { start: 1, end: 2 }, // Shoulder center to left shoulder
      { start: 1, end: 3 }, // Shoulder center to right shoulder
      { start: 2, end: 4 }, // Left shoulder to left elbow
      { start: 3, end: 5 }, // Right shoulder to right elbow
      { start: 4, end: 6 }, // Left elbow to left wrist
      { start: 5, end: 7 }, // Right elbow to right wrist
      { start: 1, end: 8 }, // Shoulder center to hip center
      { start: 8, end: 9 }, // Hip center to left hip
      { start: 8, end: 10 }, // Hip center to right hip
      { start: 9, end: 11 }, // Left hip to left knee
      { start: 10, end: 12 }, // Right hip to right knee
      { start: 11, end: 13 }, // Left knee to left ankle
      { start: 12, end: 14 }  // Right knee to right ankle
    ];

    // Simulate mistake highlights
    const mistakeHighlights = [];
    if (currentExercise && Math.random() > 0.5) {
      const randomMistake = currentExercise.commonMistakes[
        Math.floor(Math.random() * currentExercise.commonMistakes.length)
      ];
      mistakeHighlights.push({
        jointIndex: Math.floor(Math.random() * jointPositions.length),
        mistake: randomMistake
      });
    }

    setArVisualization({
      jointPositions,
      skeletonLines,
      mistakeHighlights
    });
  };

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCountdown(3);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setProgress(0);
    
    // Simulate AR visualization in real-time
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsMonitoring(false);
          return 100;
        }
        return prev + 10;
      });

      // Update AR visualization
      simulateARVisualization();
    }, 800);
  };

  // Efecto para el countdown
  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(null);
        startMonitoring();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
      if (exerciseName) {
          const exerciseToStart = exerciseDatabase.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase());
          if (exerciseToStart) {
              startExercise(exerciseToStart);
          }
      }
  }, [exerciseName]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Corrección de Forma con Realidad Aumentada</h1>
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {/* Panel de selección */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Selecciona Ejercicio
                </CardTitle>
                <CardDescription>
                  El sistema analizará tu técnica usando AR en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exerciseDatabase.map(exercise => (
                  <Button
                    key={exercise.name}
                    variant={currentExercise?.name === exercise.name ? 'default' : 'outline'}
                    onClick={() => startExercise(exercise)}
                    className="w-full justify-start"
                    disabled={isMonitoring}
                  >
                    {exercise.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visualización AR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setIsARActive(!isARActive)}
                  className="w-full"
                  variant={isARActive ? "default" : "outline"}
                >
                  {isARActive ? (
                    <>
                      <Scan className="h-4 w-4 mr-2" />
                      Desactivar AR
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Activar AR
                    </>
                  )}
                </Button>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Posicionamiento</AlertTitle>
                  <AlertDescription>
                    Asegúrate de que todo tu cuerpo esté visible en la cámara para una mejor detección.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
          
          {/* Panel principal */}
          <div className="md:col-span-2 space-y-6">
            {!currentExercise ? (
              <Card>
                <CardHeader>
                  <CardTitle>Instrucciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <AlertTitle>Selecciona un ejercicio</AlertTitle>
                        <AlertDescription>
                          Elige un ejercicio de la lista para comenzar el análisis de tu técnica con AR.
                        </AlertDescription>
                      </div>
                    </Alert>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Cómo funciona:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Selecciona el ejercicio que vas a realizar</li>
                        <li>Activa la visualización AR</li>
                        <li>El sistema superpondrá un esqueleto 3D en tiempo real</li>
                        <li>Recibirás feedback visual inmediato sobre errores técnicos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {countdown !== null ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">Preparados...</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-6xl font-bold text-primary">{countdown}</p>
                        <p className="text-lg mt-4">Posiciónate para comenzar {currentExercise.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : isMonitoring ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Analizando {currentExercise.name}</span>
                        <span>{progress}%</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* AR Visualization Canvas */}
                        {isARActive && (
                          <div className="relative">
                            <video 
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-auto rounded-lg border"
                            />
                            <canvas 
                              ref={canvasRef}
                              className="absolute top-0 left-0 w-full h-full"
                            />
                            
                            {/* AR Overlay Visualization */}
                            {arVisualization && (
                              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                <svg 
                                  viewBox="0 0 1 1" 
                                  className="w-full h-full"
                                  preserveAspectRatio="none"
                                >
                                  {/* Draw skeleton lines */}
                                  {arVisualization.skeletonLines.map((line, index) => {
                                    const start = arVisualization.jointPositions[line.start];
                                    const end = arVisualization.jointPositions[line.end];
                                    return (
                                      <line
                                        key={index}
                                        x1={start.x}
                                        y1={start.y}
                                        x2={end.x}
                                        y2={end.y}
                                        stroke="#3b82f6"
                                        strokeWidth="0.01"
                                      />
                                    );
                                  })}
                                  
                                  {/* Draw joints */}
                                  {arVisualization.jointPositions.map((joint, index) => (
                                    <circle
                                      key={index}
                                      cx={joint.x}
                                      cy={joint.y}
                                      r="0.02"
                                      fill="#3b82f6"
                                    />
                                  ))}
                                  
                                  {/* Highlight mistakes */}
                                  {arVisualization.mistakeHighlights.map((highlight, index) => {
                                    const joint = arVisualization.jointPositions[highlight.jointIndex];
                                    return (
                                      <circle
                                        key={index}
                                        cx={joint.x}
                                        cy={joint.y}
                                        r="0.04"
                                        fill="#ef4444"
                                        stroke="#ffffff"
                                        strokeWidth="0.005"
                                      />
                                    );
                                  })}
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {!isARActive && (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                            <p className="text-gray-500">AR desactivada. Activa la visualización para ver la superposición.</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Mistake alerts */}
                      {arVisualization?.mistakeHighlights.map((highlight, index) => (
                        <Alert key={index} variant="destructive" className="mt-4">
                          <AlertTriangle className="h-4 w-4" />
                          <div>
                            <AlertTitle>{highlight.mistake.name}</AlertTitle>
                            <AlertDescription>
                              {highlight.mistake.description}
                              <p className="font-medium mt-2">Corrección: {highlight.mistake.correction}</p>
                            </AlertDescription>
                          </div>
                        </Alert>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Listo para {currentExercise.name}</CardTitle>
                      <CardDescription>
                        El sistema analizará tu técnica usando realidad aumentada
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-medium">Errores comunes que detectaremos:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                          {currentExercise.commonMistakes.map((mistake, index) => (
                            <li key={index}>
                              <span className="font-medium">{mistake.name}:</span> {mistake.description}
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          onClick={startMonitoring}
                          className="w-full mt-6"
                        >
                          Comenzar Análisis con AR
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}