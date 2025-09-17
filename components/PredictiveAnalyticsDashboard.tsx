/**
 * Predictive Analytics Dashboard for SPARTAN 4
 * Displays projections for strength, muscle mass, and body composition evolution
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui';
import { 
  TrendingUp, 
  Target, 
  Activity, 
  Dumbbell, 
  Heart, 
  Zap, 
  AlertTriangle,
  Lightbulb,
  Calendar,
  BarChart3,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { predictiveAnalyticsEngine, type PredictiveInsights, type EvolutionProjection } from '../lib/predictive-analytics';
import type { UserData } from '../lib/types';
import type { WeeklyProgressReport } from '../lib/progress-report-types';

interface PredictiveAnalyticsDashboardProps {
  userData: UserData;
  progressReport?: WeeklyProgressReport;
  onBack: () => void;
}

export default function PredictiveAnalyticsDashboard({ 
  userData, 
  progressReport,
  onBack 
}: PredictiveAnalyticsDashboardProps) {
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1_month' | '3_months' | '6_months' | '1_year'>('3_months');

  useEffect(() => {
    generatePredictions();
  }, [userData, progressReport]);

  const generatePredictions = () => {
    setLoading(true);
    try {
      // Sample biometric data - in a real implementation, this would come from actual data sources
      const biometricData = {
        weight: userData.weight || 75,
        bodyFatPercentage: 15,
        muscleMass: 55,
        boneDensity: 1.2,
        restingHeartRate: 55,
        heartRateVariability: 65,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        vo2max: 45,
        glucose: 95,
        cholesterol: 180
      };

      // Sample adherence metrics - in a real implementation, this would come from actual data
      const adherence = {
        trainingAdherence: 85,
        nutritionAdherence: 75,
        sleepQuality: 80,
        supplementationAdherence: 60,
        stressManagement: 70
      };

      const insights = predictiveAnalyticsEngine.generatePredictions(
        userData,
        biometricData,
        adherence,
        progressReport
      );
      
      setPredictiveInsights(insights);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedProjection = (): EvolutionProjection | undefined => {
    if (!predictiveInsights) return undefined;
    return predictiveInsights.projections.find(p => p.timeframe === selectedTimeframe);
  };

  const formatTimeframe = (timeframe: string): string => {
    switch (timeframe) {
      case '1_month': return '1 Mes';
      case '3_months': return '3 Meses';
      case '6_months': return '6 Meses';
      case '1_year': return '1 Año';
      default: return timeframe;
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Análisis Predictivo
                </h1>
                <p className="text-gray-600">Proyecciones de evolución basadas en datos actuales</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!predictiveInsights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button 
                onClick={onBack}
                className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Análisis Predictivo
                </h1>
                <p className="text-gray-600">Proyecciones de evolución basadas en datos actuales</p>
              </div>
            </div>
          </div>
          
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se pudieron generar proyecciones</h3>
            <p className="text-gray-600">Hubo un error al procesar los datos. Por favor, inténtalo de nuevo.</p>
            <button 
              onClick={generatePredictions}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedProjection = getSelectedProjection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Análisis Predictivo
              </h1>
              <p className="text-gray-600">Proyecciones de evolución basadas en datos actuales</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {(['1_month', '3_months', '6_months', '1_year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {formatTimeframe(timeframe)}
              </button>
            ))}
          </div>
        </div>

        {selectedProjection && (
          <>
            {/* Confidence Indicator */}
            <div className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className="font-medium">Confianza de Proyección</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${getConfidenceColor(selectedProjection.confidence)}`}>
                        {selectedProjection.confidence}%
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        basado en adherencia actual
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                      style={{ width: `${selectedProjection.confidence}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Strength Projection */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                      <Dumbbell className="h-6 w-6 text-white" />
                    </div>
                    Proyección de Fuerza
                  </CardTitle>
                  <CardDescription>
                    Ganancias proyectadas en movimientos compuestos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedProjection.strength.squat.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-gray-600">Sentadilla</div>
                      <div className="text-xs text-green-600 mt-1">
                        +{selectedProjection.strength.projectedIncrease.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedProjection.strength.deadlift.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-gray-600">Peso Muerto</div>
                      <div className="text-xs text-green-600 mt-1">
                        +{selectedProjection.strength.projectedIncrease.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedProjection.strength.benchPress.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-gray-600">Press Banca</div>
                      <div className="text-xs text-green-600 mt-1">
                        +{selectedProjection.strength.projectedIncrease.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedProjection.strength.pullUp.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-gray-600">Dominadas</div>
                      <div className="text-xs text-green-600 mt-1">
                        +{selectedProjection.strength.projectedIncrease.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Muscle Mass Projection */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    Masa Muscular
                  </CardTitle>
                  <CardDescription>
                    Proyección de ganancias en masa muscular
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {selectedProjection.muscleMass.totalMass.toFixed(1)}kg
                    </div>
                    <div className="text-gray-600">Masa muscular total</div>
                    <div className="text-sm text-green-600 mt-1">
                      +{selectedProjection.muscleMass.projectedIncrease.toFixed(1)}% proyectado
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {selectedProjection.muscleMass.leanMass.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-gray-600">Masa magra</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Body Composition Projection */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    Composición Corporal
                  </CardTitle>
                  <CardDescription>
                    Cambios proyectados en composición corporal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedProjection.bodyComposition.bodyFatPercentage.toFixed(1)}%
                    </div>
                    <div className="text-gray-600">Grasa corporal</div>
                    <div className="text-sm text-green-600 mt-1">
                      -{selectedProjection.bodyComposition.projectedDecrease.toFixed(1)} pts proyectado
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {selectedProjection.bodyComposition.visceralFat}
                      </div>
                      <div className="text-sm text-gray-600">Grasa visceral</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Factors */}
            {selectedProjection.keyFactors.length > 0 && (
              <div className="mb-8">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                      Factores Clave
                    </CardTitle>
                    <CardDescription>
                      Elementos que más influencian tus proyecciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProjection.keyFactors.map((factor, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {/* Risk Factors and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Risk Factors */}
          {predictiveInsights.riskFactors.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                  Factores de Riesgo
                </CardTitle>
                <CardDescription>
                  Aspectos que podrían impedir tu progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveInsights.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{risk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimization Opportunities */}
          {predictiveInsights.optimizationOpportunities.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  Oportunidades de Optimización
                </CardTitle>
                <CardDescription>
                  Áreas donde puedes acelerar tu progreso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveInsights.optimizationOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Personalized Recommendations */}
        {predictiveInsights.personalizedRecommendations.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Lightbulb className="h-6 w-6 text-indigo-500" />
                  Recomendaciones Personalizadas
                </CardTitle>
                <CardDescription>
                  Acciones específicas para maximizar tu evolución
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictiveInsights.personalizedRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start p-4 bg-indigo-50 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Projections Summary */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <BarChart3 className="h-6 w-6 text-teal-500" />
                Resumen de Proyecciones
              </CardTitle>
              <CardDescription>
                Comparativa de proyecciones para diferentes periodos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Periodo</th>
                      <th className="text-left py-3 px-4">Fuerza (+%)</th>
                      <th className="text-left py-3 px-4">Masa Muscular (+%)</th>
                      <th className="text-left py-3 px-4">Grasa Corporal (-pts)</th>
                      <th className="text-left py-3 px-4">Confianza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictiveInsights.projections.map((projection, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          {formatTimeframe(projection.timeframe)}
                        </td>
                        <td className="py-3 px-4 text-green-600">
                          +{projection.strength.projectedIncrease.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-green-600">
                          +{projection.muscleMass.projectedIncrease.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-green-600">
                          -{projection.bodyComposition.projectedDecrease.toFixed(1)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getConfidenceColor(projection.confidence)}>
                            {projection.confidence}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}