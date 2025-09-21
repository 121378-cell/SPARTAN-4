import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./ui";
import { Eye, Gamepad2, Headphones, ArrowLeft, Zap, Globe, Target } from "lucide-react";
import ARExerciseFormCorrection from "./ARExerciseFormCorrection";
import VRImmersiveWorkout from "./VRImmersiveWorkout";

interface ExtendedRealityIntegrationProps {
  onBack: () => void;
}

type XRMode = 'none' | 'ar-form-correction' | 'vr-immersive' | 'spatial-audio';

export default function ExtendedRealityIntegration({ onBack }: ExtendedRealityIntegrationProps) {
  const [currentMode, setCurrentMode] = useState<XRMode>('none');

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'ar-form-correction':
        return <ARExerciseFormCorrection onBack={() => setCurrentMode('none')} />;
      case 'vr-immersive':
        return <VRImmersiveWorkout onBack={() => setCurrentMode('none')} />;
      case 'spatial-audio':
        return (
          <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Guía de Audio Espacial</h1>
                <Button variant="outline" onClick={() => setCurrentMode('none')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Audio Espacial para Entrenamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <p>
                        El sistema de audio espacial proporciona indicaciones auditivas en 3D que parecen 
                        provenir de ubicaciones específicas en tu entorno de entrenamiento.
                      </p>
                      
                      <h3>Tipos de Indicaciones:</h3>
                      <ul>
                        <li><strong>Corrección de Forma:</strong> Instrucciones específicas sobre técnica de ejercicio</li>
                        <li><strong>Motivación:</strong> Mensajes de aliento durante el entrenamiento</li>
                        <li><strong>Advertencias:</strong> Alertas sobre técnica incorrecta o riesgo de lesión</li>
                        <li><strong>Instrucciones:</strong> Guía para ejercicios y rutinas</li>
                        <li><strong>Finalización:</strong> Confirmación de completado de ejercicios o sesiones</li>
                      </ul>
                      
                      <h3>Cómo Funciona:</h3>
                      <p>
                        El sistema utiliza algoritmos avanzados de procesamiento de audio para crear 
                        efectos espaciales que simulan sonidos provenientes de diferentes direcciones 
                        y distancias. Esto mejora significativamente la experiencia de entrenamiento 
                        al proporcionar retroalimentación inmediata y contextual.
                      </p>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Integración con Otros Sistemas</h4>
                        <p>
                          El audio espacial se integra automáticamente con:
                        </p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>Sistema de corrección de forma AR/VR</li>
                          <li>Entornos de realidad virtual inmersiva</li>
                          <li>Monitoreo biométrico en tiempo real</li>
                          <li>Sistema de gamificación y progresión</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => {
                          // In a real implementation, this would initialize the spatial audio service
                          alert('Audio espacial activado. Las indicaciones se reproducirán automáticamente durante el entrenamiento.');
                        }}
                        className="w-full"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Activar Audio Espacial
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // In a real implementation, this would test spatial audio
                          alert('Prueba de audio espacial: "Corrige la posición de tus rodillas" (sonido proveniente de tu izquierda)');
                        }}
                        className="w-full"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Probar Audio Espacial
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Integración de Realidad Extendida</h1>
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Panel Principal
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AR Form Correction Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentMode('ar-form-correction')}>
                  <CardHeader>
                    <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Eye className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Corrección de Forma AR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Visualización aumentada en tiempo real para corregir la técnica de ejercicio
                    </p>
                    <Button variant="outline" className="w-full">
                      Acceder al Sistema
                    </Button>
                  </CardContent>
                </Card>
                
                {/* VR Immersive Workout Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentMode('vr-immersive')}>
                  <CardHeader>
                    <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Gamepad2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Entrenamiento Inmersivo VR</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Entornos de realidad virtual completamente inmersivos para entrenamiento
                    </p>
                    <Button variant="outline" className="w-full">
                      Acceder al Sistema
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Spatial Audio Cues Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentMode('spatial-audio')}>
                  <CardHeader>
                    <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Indicaciones de Audio Espacial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Indicaciones auditivas en 3D para guía durante el entrenamiento
                    </p>
                    <Button variant="outline" className="w-full">
                      Acceder al Sistema
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Tecnología SPARTAN XR</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Realidad Aumentada (AR)</h3>
                      <p className="text-gray-600 text-sm">
                        Superpone información digital sobre el mundo real para mejorar la percepción 
                        y corrección de la técnica de ejercicio en tiempo real.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Realidad Virtual (VR)</h3>
                      <p className="text-gray-600 text-sm">
                        Crea entornos completamente inmersivos para entrenamiento en condiciones 
                        extremas y ambientaciones únicas que motivan y desafían al usuario.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Audio Espacial 3D</h3>
                      <p className="text-gray-600 text-sm">
                        Proporciona indicaciones auditivas que parecen provenir de ubicaciones 
                        específicas, mejorando la experiencia de entrenamiento y la atención.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Integración Biométrica</h3>
                      <p className="text-gray-600 text-sm">
                        Todos los sistemas XR se integran con datos biométricos en tiempo real 
                        para personalizar la experiencia y prevenir lesiones.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return <div>{renderCurrentMode()}</div>;
}