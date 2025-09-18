import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import type { UserData, ProgressionHistory, ProgressionPlan } from '../lib/types';
import { loadProgressionService } from '../lib/load-progression-service';
import { storageManager } from '../lib/storage';

interface LoadProgressionDashboardProps {
  userData: UserData;
  onBack: () => void;
}

const LoadProgressionDashboard = ({ userData, onBack }: LoadProgressionDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'analysis' | 'recommendations' | 'settings'>('history');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [progressionHistory, setProgressionHistory] = useState<ProgressionHistory[]>([]);
  const [progressionPlan, setProgressionPlan] = useState<ProgressionPlan | null>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProgressionData();
  }, [selectedExercise]);

  const loadProgressionData = () => {
    setIsLoading(true);
    try {
      const userId = 'default-user'; // In a real app, this would come from auth
      
      // Get all exercises with progression data
      const allMetrics = storageManager.getProgressionMetrics();
      const uniqueExercises = Array.from(new Set(allMetrics.map(m => m.exerciseName)));
      setExercises(uniqueExercises);
      
      // Set default exercise if none selected
      if (!selectedExercise && uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
      
      // Load progression history for selected exercise
      if (selectedExercise) {
        const history = loadProgressionService.getProgressionHistory(selectedExercise);
        setProgressionHistory(history);
        
        // Generate progression plan
        const plan = loadProgressionService.analyzeProgression(userId, selectedExercise);
        setProgressionPlan(plan);
      }
    } catch (error) {
      console.error('Error loading progression data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseChange = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  const handleApplyRecommendations = () => {
    if (progressionPlan && progressionPlan.adjustments.length > 0) {
      // In a real implementation, this would apply the adjustments to workout plans
      alert('Recomendaciones aplicadas correctamente. Los ajustes se aplicarán a tus próximos entrenamientos.');
      
      // Mark adjustments as applied
      const updatedPlan = { ...progressionPlan };
      updatedPlan.adjustments = updatedPlan.adjustments.map(adjustment => ({
        ...adjustment,
        applied: true
      }));
      setProgressionPlan(updatedPlan);
    }
  };

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {exercises.length > 0 ? (
        <div className="grid gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Seleccionar Ejercicio
              </CardTitle>
              <CardDescription>
                Elige un ejercicio para ver su historial de progresión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {exercises.map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => handleExerciseChange(exercise)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedExercise === exercise
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {exercise}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedExercise && progressionHistory.length > 0 ? (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Historial de Progresión: {selectedExercise}
                </CardTitle>
                <CardDescription>
                  Tu historial de cargas y rendimiento para este ejercicio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Peso (kg)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Repeticiones</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Volumen</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Intensidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progressionHistory.map((entry, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {new Date(entry.date).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4 font-medium">{entry.weight}</td>
                          <td className="py-3 px-4">{entry.reps}</td>
                          <td className="py-3 px-4">{entry.volume}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {Math.round(entry.intensity * 100)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : selectedExercise ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay datos de progresión para este ejercicio</p>
                <p className="text-sm text-gray-500 mt-1">Completa sesiones de entrenamiento que incluyan este ejercicio para ver tu progresión</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay ejercicios registrados</p>
            <p className="text-sm text-gray-500 mt-1">Completa sesiones de entrenamiento para comenzar a registrar tu progresión</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      {selectedExercise ? (
        progressionPlan ? (
          <>
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Análisis de Progresión: {selectedExercise}
                </CardTitle>
                <CardDescription>
                  Evaluación detallada de tu progresión y recomendaciones personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-gray-900">{progressionPlan.currentWeight} kg</div>
                    <div className="text-sm text-gray-600">Peso Actual</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{progressionPlan.recommendedWeight} kg</div>
                    <div className="text-sm text-gray-600">Peso Recomendado</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-xl font-bold text-purple-600 capitalize">
                      {progressionPlan.nextPhase === 'accumulation' && 'Acumulación'}
                      {progressionPlan.nextPhase === 'intensification' && 'Intensificación'}
                      {progressionPlan.nextPhase === 'peak' && 'Pico'}
                      {progressionPlan.nextPhase === 'deload' && 'Recuperación'}
                    </div>
                    <div className="text-sm text-gray-600">Fase Siguiente</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {progressionPlan.notes.length > 0 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Notas de Análisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {progressionPlan.notes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {progressionPlan.adjustments.length > 0 && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Ajustes Recomendados
                  </CardTitle>
                  <CardDescription>
                    Recomendaciones personalizadas basadas en tu rendimiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressionPlan.adjustments.map((adjustment, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border-l-4 ${
                          adjustment.adjustmentType === 'weight' ? 'border-l-blue-500 bg-blue-50' :
                          adjustment.adjustmentType === 'volume' ? 'border-l-green-500 bg-green-50' :
                          adjustment.adjustmentType === 'intensity' ? 'border-l-purple-500 bg-purple-50' :
                          'border-l-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {adjustment.adjustmentType === 'weight' && 'Ajuste de Carga'}
                              {adjustment.adjustmentType === 'volume' && 'Ajuste de Volumen'}
                              {adjustment.adjustmentType === 'intensity' && 'Ajuste de Intensidad'}
                              {adjustment.adjustmentType === 'deload' && 'Semana de Recuperación'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{adjustment.reason}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              adjustment.value > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {adjustment.value > 0 ? '+' : ''}{adjustment.value}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Confianza: {Math.round(adjustment.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                        {adjustment.applied && (
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aplicado
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      onClick={handleApplyRecommendations}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Aplicar Recomendaciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay análisis disponible para este ejercicio</p>
              <p className="text-sm text-gray-500 mt-1">Completa sesiones de entrenamiento para generar un análisis de progresión</p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Selecciona un ejercicio para ver su análisis de progresión</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-600" />
            Principios de Progresión Inteligente
          </CardTitle>
          <CardDescription>
            Cómo funciona el sistema de progresión adaptativa de Spartan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Sobrecarga Progresiva</h3>
              <p className="text-sm text-gray-600">
                El sistema ajusta automáticamente la carga, volumen o intensidad basado en tu rendimiento real.
                Cuando demuestras capacidad, se incrementa la exigencia.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Autoregulación</h3>
              <p className="text-sm text-gray-600">
                Si fallas repeticiones o muestras signos de fatiga, el sistema recalcula la progresión para
                prevenir el sobreentrenamiento y optimizar la recuperación.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Periodización</h3>
              <p className="text-sm text-gray-600">
                El sistema implementa ciclos de acumulación, intensificación y recuperación para maximizar
                adaptaciones y prevenir estancamiento.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Análisis en Tiempo Real</h3>
              <p className="text-sm text-gray-600">
                Cada sesión se analiza para detectar tendencias de rendimiento y ajustar futuras recomendaciones
                basadas en datos objetivos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Consejos para Maximizar tu Progresión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Registra consistentemente tus RPE y RIR después de cada serie</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Sé honesto sobre tu esfuerzo percibido para obtener recomendaciones precisas</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Sigue las recomendaciones de ajuste de carga y volumen</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Presta atención a las señales de fatiga y sobreentrenamiento</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">Permite semanas de recuperación cuando el sistema las recomiende</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gray-600" />
            Preferencias de Progresión
          </CardTitle>
          <CardDescription>
            Configura cómo quieres que el sistema maneje tu progresión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Método de Progresión</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div className="font-medium text-gray-900">Lineal</div>
                  <div className="text-sm text-gray-600 mt-1">Incremento constante de carga</div>
                </button>
                <button className="p-4 border-2 border-blue-500 rounded-lg text-left bg-blue-50">
                  <div className="font-medium text-blue-900">Ondulante</div>
                  <div className="text-sm text-blue-700 mt-1">Variación de intensidad por sesión</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div className="font-medium text-gray-900">Auto-regulada</div>
                  <div className="text-sm text-gray-600 mt-1">Basada en rendimiento diario</div>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Frecuencia de Progresión</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button className="p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div className="font-medium text-gray-900">Diaria</div>
                  <div className="text-sm text-gray-600 mt-1">Ajustes basados en cada entrenamiento</div>
                </button>
                <button className="p-4 border-2 border-blue-500 rounded-lg text-left bg-blue-50">
                  <div className="font-medium text-blue-900">Por Sesión</div>
                  <div className="text-sm text-blue-700 mt-1">Ajustes después de cada sesión</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div className="font-medium text-gray-900">Semanal</div>
                  <div className="text-sm text-gray-600 mt-1">Ajustes basados en rendimiento semanal</div>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Frecuencia de Recuperación</h3>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Cada</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  defaultValue="4"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center"
                />
                <span className="text-gray-600">semanas</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                El sistema recomendará una semana de recuperación cada X semanas para prevenir el sobreentrenamiento
              </p>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-semibold py-3">
              <RotateCcw className="h-5 w-5 mr-2" />
              Guardar Preferencias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'history', label: 'Historial', icon: BarChart3 },
    { id: 'analysis', label: 'Análisis', icon: TrendingUp },
    { id: 'recommendations', label: 'Recomendaciones', icon: CheckCircle },
    { id: 'settings', label: 'Configuración', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Progresión Inteligente de Cargas
              </h1>
              <p className="text-sm text-gray-600">Optimiza tu progresión con análisis adaptativo</p>
            </div>
          </div>
          {selectedExercise && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedExercise}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'history' && renderHistoryTab()}
            {activeTab === 'analysis' && renderAnalysisTab()}
            {activeTab === 'recommendations' && renderRecommendationsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </>
        )}
      </main>
    </div>
  );
};

export default LoadProgressionDashboard;