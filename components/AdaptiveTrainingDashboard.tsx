/**
 * Adaptive Training Dashboard - Panel de Entrenamiento Adaptativo
 */

import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from './ui';
import { ArrowLeft, TrendingUp, Heart, Target, Activity, Brain, Zap } from 'lucide-react';
import { adaptiveTrainingSystem, type TrainingMetrics, type WeeklyAssessment, type TrainingAdjustment } from '../lib/adaptiveTrainingSystem';
import type { UserData } from '../lib/types';

interface AdaptiveTrainingDashboardProps {
  userData: UserData;
  onBack: () => void;
}

const AdaptiveTrainingDashboard = memo(function AdaptiveTrainingDashboard({
  userData,
  onBack
}: AdaptiveTrainingDashboardProps) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [sessionMetrics, setSessionMetrics] = useState<Partial<TrainingMetrics>>({
    rpe: 7,
    rir: 2,
    adherence: 100,
    sleepQuality: 7,
    stressLevel: 5,
    muscleSymptoms: 3,
    motivation: 8,
    heartRateData: {
      avgHR: 140,
      maxHR: 180,
      hrv: 45,
      recoveryHR: 120
    }
  });
  const [weeklyAssessment, setWeeklyAssessment] = useState<WeeklyAssessment | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    loadWeeklyAssessment();
    loadRecommendations();
  }, []);

  const loadWeeklyAssessment = async () => {
    try {
      // Simular assessment semanal
      const mockAssessment: WeeklyAssessment = {
        weekNumber: 4,
        overallReadiness: 78,
        fatigueIndex: 35,
        performanceIndex: 82,
        adherenceRate: 87,
        progressRate: 15,
        recommendedAdjustments: [
          {
            exerciseName: 'Press Banca',
            adjustmentType: 'weight',
            previousValue: 80,
            newValue: 85,
            adjustmentPercentage: 6.25,
            reason: 'RPE consistentemente bajo con RIR alto',
            confidence: 0.88,
            periodizationPhase: 'progression'
          },
          {
            exerciseName: 'Sentadilla',
            adjustmentType: 'rest',
            previousValue: '120s',
            newValue: '90s',
            adjustmentPercentage: -25,
            reason: 'Buena recuperación entre series',
            confidence: 0.75,
            periodizationPhase: 'intensification'
          }
        ],
        periodizationRecommendation: {
          currentPhase: 'development',
          recommendedPhase: 'intensification',
          transitionReason: 'Buena recuperación y progreso constante',
          transitionTimeline: '1-2 semanas',
          expectedOutcomes: ['Incremento de fuerza máxima', 'Adaptaciones neurales']
        },
        deloadRecommended: false,
        intensificationReady: true
      };
      setWeeklyAssessment(mockAssessment);
    } catch (error) {
      console.error('Error cargando assessment:', error);
    }
  };

  const loadRecommendations = () => {
    const recs = adaptiveTrainingSystem.getNextSessionRecommendations();
    setRecommendations(recs);
  };

  const handleSubmitMetrics = () => {
    const completeMetrics: TrainingMetrics = {
      sessionId: `session_${Date.now()}`,
      date: new Date(),
      exerciseData: [], // Se llenaría con datos reales
      ...sessionMetrics as TrainingMetrics
    };

    adaptiveTrainingSystem.recordSessionMetrics(completeMetrics);
    
    // Mostrar feedback
    alert('¡Métricas registradas! El sistema ajustará tu próximo entrenamiento automáticamente.');
    
    // Recargar recomendaciones
    loadRecommendations();
  };

  const renderMetricsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Registro de Sesión Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RPE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                RPE - Esfuerzo Percibido (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionMetrics.rpe || 7}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  rpe: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Muy Fácil</span>
                <span className="font-semibold">{sessionMetrics.rpe}/10</span>
                <span>Máximo Esfuerzo</span>
              </div>
            </div>

            {/* RIR */}
            <div>
              <label className="block text-sm font-medium mb-2">
                RIR - Repeticiones en Reserva (0-5)
              </label>
              <input
                type="range"
                min="0"
                max="5"
                value={sessionMetrics.rir || 2}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  rir: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Al Fallo</span>
                <span className="font-semibold">{sessionMetrics.rir}/5</span>
                <span>Muy Fácil</span>
              </div>
            </div>

            {/* Adherencia */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Adherencia - % Completado
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sessionMetrics.adherence || 100}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  adherence: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold text-blue-600">
                {sessionMetrics.adherence}%
              </div>
            </div>

            {/* Calidad del Sueño */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Calidad del Sueño (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionMetrics.sleepQuality || 7}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  sleepQuality: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold text-purple-600">
                {sessionMetrics.sleepQuality}/10
              </div>
            </div>

            {/* Nivel de Estrés */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nivel de Estrés (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionMetrics.stressLevel || 5}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  stressLevel: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold text-orange-600">
                {sessionMetrics.stressLevel}/10
              </div>
            </div>

            {/* Motivación */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nivel de Motivación (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={sessionMetrics.motivation || 8}
                onChange={(e) => setSessionMetrics(prev => ({
                  ...prev,
                  motivation: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm font-semibold text-green-600">
                {sessionMetrics.motivation}/10
              </div>
            </div>
          </div>

          {/* Datos de Frecuencia Cardíaca */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Datos Cardiovasculares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">FC Promedio</label>
                  <input
                    type="number"
                    min="60"
                    max="200"
                    value={sessionMetrics.heartRateData?.avgHR || 140}
                    onChange={(e) => setSessionMetrics(prev => ({
                      ...prev,
                      heartRateData: {
                        ...prev.heartRateData!,
                        avgHR: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">FC Máxima</label>
                  <input
                    type="number"
                    min="100"
                    max="220"
                    value={sessionMetrics.heartRateData?.maxHR || 180}
                    onChange={(e) => setSessionMetrics(prev => ({
                      ...prev,
                      heartRateData: {
                        ...prev.heartRateData!,
                        maxHR: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">HRV</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={sessionMetrics.heartRateData?.hrv || 45}
                    onChange={(e) => setSessionMetrics(prev => ({
                      ...prev,
                      heartRateData: {
                        ...prev.heartRateData!,
                        hrv: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">FC Recuperación</label>
                  <input
                    type="number"
                    min="60"
                    max="160"
                    value={sessionMetrics.heartRateData?.recoveryHR || 120}
                    onChange={(e) => setSessionMetrics(prev => ({
                      ...prev,
                      heartRateData: {
                        ...prev.heartRateData!,
                        recoveryHR: parseInt(e.target.value)
                      }
                    }))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleSubmitMetrics}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg"
            >
              Registrar Métricas de Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      {weeklyAssessment && (
        <>
          {/* Estado General */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{weeklyAssessment.overallReadiness}%</div>
                <div className="text-sm text-gray-600">Readiness</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{weeklyAssessment.performanceIndex}%</div>
                <div className="text-sm text-gray-600">Rendimiento</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{100 - weeklyAssessment.fatigueIndex}%</div>
                <div className="text-sm text-gray-600">Recuperación</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{weeklyAssessment.adherenceRate}%</div>
                <div className="text-sm text-gray-600">Adherencia</div>
              </CardContent>
            </Card>
          </div>

          {/* Ajustes Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Ajustes Automáticos Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyAssessment.recommendedAdjustments.map((adjustment, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{adjustment.exerciseName}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        adjustment.adjustmentPercentage > 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {adjustment.adjustmentPercentage > 0 ? '+' : ''}{adjustment.adjustmentPercentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Ajuste:</strong> {adjustment.adjustmentType} de {adjustment.previousValue} → {adjustment.newValue}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">{adjustment.reason}</div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Confianza: {(adjustment.confidence * 100).toFixed(0)}%</span>
                      <span className="capitalize">{adjustment.periodizationPhase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendación de Periodización */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Recomendación de Periodización
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Fase Actual:</span>
                  <span className="ml-2 px-3 py-1 bg-gray-200 rounded-full text-sm font-medium">
                    {weeklyAssessment.periodizationRecommendation.currentPhase}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Fase Recomendada:</span>
                  <span className="ml-2 px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {weeklyAssessment.periodizationRecommendation.recommendedPhase}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Razón:</strong> {weeklyAssessment.periodizationRecommendation.transitionReason}
                </p>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Resultados Esperados:</p>
                  <ul className="text-sm space-y-1">
                    {weeklyAssessment.periodizationRecommendation.expectedOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">•</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Recomendaciones para Próxima Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-l-green-500">
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Registra más sesiones para ver tus tendencias de progreso</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'metrics', label: 'Registrar Métricas', icon: Activity },
    { id: 'analysis', label: 'Análisis Semanal', icon: TrendingUp },
    { id: 'recommendations', label: 'Recomendaciones', icon: Target }
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
                Entrenamiento Adaptativo
              </h1>
              <p className="text-sm text-gray-600">Ajustes automáticos basados en tu rendimiento</p>
            </div>
          </div>
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
                onClick={() => setActiveTab(tab.id)}
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
        {activeTab === 'metrics' && renderMetricsTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}
      </main>
    </div>
  );
});

export default AdaptiveTrainingDashboard;