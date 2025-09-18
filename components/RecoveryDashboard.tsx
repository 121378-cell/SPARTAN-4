import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  ArrowLeft, 
  Heart, 
  Zap, 
  Moon, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus
} from 'lucide-react';
import type { UserData, RecoveryMetric, RecoveryAnalysis, RecoveryRecommendation } from '../lib/types';
import { recoveryService } from '../lib/recovery-service';
import { storageManager } from '../lib/storage';

interface RecoveryDashboardProps {
  userData: UserData;
  onBack: () => void;
}

const RecoveryDashboard = ({ userData, onBack }: RecoveryDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'analysis' | 'recommendations' | 'history'>('metrics');
  const [recoveryMetrics, setRecoveryMetrics] = useState<Omit<RecoveryMetric, 'date'> & { date?: Date }>({
    energyLevel: 5,
    muscleSoreness: 5,
    sleepQuality: 5,
    stressLevel: 5,
    motivation: 5,
    notes: ''
  });
  const [todayAnalysis, setTodayAnalysis] = useState<RecoveryAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RecoveryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const loadRecoveryData = () => {
    setIsLoading(true);
    try {
      const userId = 'default-user'; // In a real app, this would come from auth
      const today = new Date();
      const analysis = recoveryService.getRecoveryAnalysis(userId, today);
      setTodayAnalysis(analysis);
      
      const recent = recoveryService.getRecentRecoveryAnalyses(7);
      setRecentAnalyses(recent);
    } catch (error) {
      console.error('Error loading recovery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricChange = (field: keyof Omit<RecoveryMetric, 'date'>, value: number | string) => {
    setRecoveryMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitMetrics = () => {
    try {
      const userId = 'default-user'; // In a real app, this would come from auth
      const metric = recoveryService.recordRecoveryMetrics(userId, recoveryMetrics);
      alert('Métricas de recuperación registradas correctamente');
      loadRecoveryData();
      
      // Reset form
      setRecoveryMetrics({
        energyLevel: 5,
        muscleSoreness: 5,
        sleepQuality: 5,
        stressLevel: 5,
        motivation: 5,
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting recovery metrics:', error);
      alert('Error al registrar las métricas de recuperación');
    }
  };

  const getFatigueLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'extreme': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getFatigueLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'moderate': return 'Moderado';
      case 'high': return 'Alto';
      case 'extreme': return 'Extremo';
      default: return 'Desconocido';
    }
  };

  const getRecoveryScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendationIcon = (type: RecoveryRecommendation['type']) => {
    switch (type) {
      case 'rest': return <Moon className="h-5 w-5" />;
      case 'active_recovery': return <Activity className="h-5 w-5" />;
      case 'mobility': return <Activity className="h-5 w-5" />;
      case 'stretching': return <Activity className="h-5 w-5" />;
      case 'sauna': return <Zap className="h-5 w-5" />;
      case 'massage': return <Heart className="h-5 w-5" />;
      case 'nap': return <Moon className="h-5 w-5" />;
      case 'light_training': return <Activity className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getRecommendationColor = (priority: RecoveryRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const renderMetricsTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-600" />
            Registrar Métricas de Recuperación
          </CardTitle>
          <CardDescription>
            Evalúa tu estado subjetivo para ayudar al sistema a predecir tus necesidades de recuperación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Energy Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Energía (1-10)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Bajo</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={recoveryMetrics.energyLevel}
                  onChange={(e) => handleMetricChange('energyLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm text-gray-500">Alto</span>
                <span className="text-lg font-bold text-blue-600 w-8">{recoveryMetrics.energyLevel}</span>
              </div>
            </div>

            {/* Muscle Soreness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dolor Muscular (1-10)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Nada</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={recoveryMetrics.muscleSoreness}
                  onChange={(e) => handleMetricChange('muscleSoreness', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <span className="text-sm text-gray-500">Mucho</span>
                <span className="text-lg font-bold text-red-600 w-8">{recoveryMetrics.muscleSoreness}</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calidad del Sueño (1-10)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Mala</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={recoveryMetrics.sleepQuality}
                  onChange={(e) => handleMetricChange('sleepQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="text-sm text-gray-500">Excelente</span>
                <span className="text-lg font-bold text-purple-600 w-8">{recoveryMetrics.sleepQuality}</span>
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Estrés (1-10)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Relajado</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={recoveryMetrics.stressLevel}
                  onChange={(e) => handleMetricChange('stressLevel', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <span className="text-sm text-gray-500">Estresado</span>
                <span className="text-lg font-bold text-orange-600 w-8">{recoveryMetrics.stressLevel}</span>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivación (1-10)
              </label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Baja</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={recoveryMetrics.motivation}
                  onChange={(e) => handleMetricChange('motivation', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="text-sm text-gray-500">Alta</span>
                <span className="text-lg font-bold text-green-600 w-8">{recoveryMetrics.motivation}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={recoveryMetrics.notes || ''}
              onChange={(e) => handleMetricChange('notes', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="¿Algo que quieras compartir sobre tu recuperación hoy?"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleSubmitMetrics}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
          >
            <Plus className="h-5 w-5 mr-2" />
            Registrar Métricas
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      {todayAnalysis ? (
        <>
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Análisis de Recuperación de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-3xl font-bold mb-2">
                    <span className={getRecoveryScoreColor(todayAnalysis.recoveryScore)}>
                      {todayAnalysis.recoveryScore}
                    </span>
                    <span className="text-gray-500 text-lg">/100</span>
                  </div>
                  <div className="text-sm text-gray-600">Puntaje de Recuperación</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl font-bold mb-2">
                    <span className={getFatigueLevelColor(todayAnalysis.fatigueLevel)}>
                      {getFatigueLevelText(todayAnalysis.fatigueLevel)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Nivel de Fatiga</div>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-xl font-bold mb-2 text-blue-600">
                    {todayAnalysis.suggestedWorkoutIntensity === 'rest' ? 'Descanso' : 
                     todayAnalysis.suggestedWorkoutIntensity === 'low' ? 'Baja' : 
                     todayAnalysis.suggestedWorkoutIntensity === 'moderate' ? 'Moderada' : 'Alta'}
                  </div>
                  <div className="text-sm text-gray-600">Intensidad Sugerida</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {todayAnalysis.predictedFatigueDays.length > 0 && (
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Días de Fatiga Acumulada Predichos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {todayAnalysis.predictedFatigueDays.map((date, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      {date.toLocaleDateString('es-ES', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  El sistema predice que estos días podrías experimentar fatiga acumulada. 
                  Considera planificar actividades de recuperación activa o descanso completo.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay análisis de recuperación disponible para hoy</p>
            <p className="text-sm text-gray-500 mt-1">Registra tus métricas de recuperación para generar un análisis</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      {todayAnalysis && todayAnalysis.recommendations.length > 0 ? (
        <div className="space-y-4">
          {todayAnalysis.recommendations.map((rec, index) => (
            <Card 
              key={index} 
              className={`${getRecommendationColor(rec.priority)} border-l-4 ${rec.priority === 'high' ? 'border-l-red-500' : rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                    {getRecommendationIcon(rec.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{rec.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    {rec.duration && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{rec.duration}</span>
                      </div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-800' : rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay recomendaciones de recuperación disponibles</p>
            <p className="text-sm text-gray-500 mt-1">Registra tus métricas de recuperación para obtener recomendaciones personalizadas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      {recentAnalyses.length > 0 ? (
        <div className="space-y-4">
          {recentAnalyses.map((analysis, index) => (
            <Card key={index} className="bg-white border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {analysis.date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecoveryScoreColor(analysis.recoveryScore)}`}>
                      {analysis.recoveryScore}/100
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFatigueLevelColor(analysis.fatigueLevel)}`}>
                      {getFatigueLevelText(analysis.fatigueLevel)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Intensidad Sugerida</div>
                    <div className="font-medium mt-1">
                      {analysis.suggestedWorkoutIntensity === 'rest' ? 'Descanso' : 
                       analysis.suggestedWorkoutIntensity === 'low' ? 'Baja' : 
                       analysis.suggestedWorkoutIntensity === 'moderate' ? 'Moderada' : 'Alta'}
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Recomendaciones</div>
                    <div className="font-medium mt-1">{analysis.recommendations.length}</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Días de Fatiga</div>
                    <div className="font-medium mt-1">{analysis.predictedFatigueDays.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay historial de análisis de recuperación</p>
            <p className="text-sm text-gray-500 mt-1">Los análisis aparecerán aquí después de registrar tus métricas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const tabs = [
    { id: 'metrics', label: 'Métricas', icon: Heart },
    { id: 'analysis', label: 'Análisis', icon: Activity },
    { id: 'recommendations', label: 'Recomendaciones', icon: CheckCircle },
    { id: 'history', label: 'Historial', icon: Calendar }
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
                Monitorización de Recuperación
              </h1>
              <p className="text-sm text-gray-600">Evalúa y mejora tu recuperación para optimizar el rendimiento</p>
            </div>
          </div>
          {todayAnalysis && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Análisis Activo</span>
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
            {activeTab === 'metrics' && renderMetricsTab()}
            {activeTab === 'analysis' && renderAnalysisTab()}
            {activeTab === 'recommendations' && renderRecommendationsTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </>
        )}
      </main>
    </div>
  );
};

export default RecoveryDashboard;