/**
 * Progress Comparison Dashboard
 * Allows users to compare their current physical and mental state with any point in their history
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { 
  Activity, 
  Utensils, 
  Heart, 
  Zap,
  Brain,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  X
} from 'lucide-react';
import { ProgressReportGenerator } from '../lib/progress-report-generator';
import type { WeeklyProgressReport } from '../lib/progress-report-types';
import { Button } from './ui';

interface ProgressComparisonDashboardProps {
  userId: string;
  onBack: () => void;
}

export default function ProgressComparisonDashboard({ userId, onBack }: ProgressComparisonDashboardProps) {
  const [reports, setReports] = useState<WeeklyProgressReport[]>([]);
  const [selectedReport1, setSelectedReport1] = useState<WeeklyProgressReport | null>(null);
  const [selectedReport2, setSelectedReport2] = useState<WeeklyProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  useEffect(() => {
    fetchProgressHistory();
  }, [userId]);

  const fetchProgressHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would fetch historical reports from the database
      // For now, we'll generate some sample reports for demonstration
      const progressReportGenerator = new ProgressReportGenerator();
      const currentReport = await progressReportGenerator.generateWeeklyReport(userId);
      
      // Generate some historical reports with variations
      const historicalReports = [];
      for (let i = 1; i <= 4; i++) {
        const historicalReport = await progressReportGenerator.generateWeeklyReport(userId);
        // Modify dates to simulate historical data
        const dateOffset = i * 7; // 1 week, 2 weeks, etc. ago
        historicalReport.startDate = new Date(Date.now() - dateOffset * 24 * 60 * 60 * 1000);
        historicalReport.endDate = new Date(historicalReport.startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        historicalReport.overallScore = Math.max(0, currentReport.overallScore - (i * 5));
        historicalReports.push(historicalReport);
      }
      
      const allReports = [currentReport, ...historicalReports];
      setReports(allReports);
      setSelectedReport1(allReports[0]); // Current report
      setSelectedReport2(allReports[1]); // Previous report
    } catch (err) {
      console.error('Error fetching progress history:', err);
      setError('Failed to load progress history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedReport1 && selectedReport2) {
      compareReports(selectedReport1, selectedReport2);
    }
  }, [selectedReport1, selectedReport2]);

  const compareReports = (report1: WeeklyProgressReport, report2: WeeklyProgressReport) => {
    const comparison = {
      overallScore: {
        value1: report1.overallScore,
        value2: report2.overallScore,
        difference: report1.overallScore - report2.overallScore,
        improvement: report1.overallScore > report2.overallScore
      },
      training: {
        completionRate: {
          value1: report1.training.workoutCompletionRate,
          value2: report2.training.workoutCompletionRate,
          difference: report1.training.workoutCompletionRate - report2.training.workoutCompletionRate,
          improvement: report1.training.workoutCompletionRate > report2.training.workoutCompletionRate
        },
        consistency: {
          value1: report1.training.consistencyScore,
          value2: report2.training.consistencyScore,
          difference: report1.training.consistencyScore - report2.training.consistencyScore,
          improvement: report1.training.consistencyScore > report2.training.consistencyScore
        }
      },
      nutrition: {
        adherence: {
          value1: report1.nutrition.adherenceRate,
          value2: report2.nutrition.adherenceRate,
          difference: report1.nutrition.adherenceRate - report2.nutrition.adherenceRate,
          improvement: report1.nutrition.adherenceRate > report2.nutrition.adherenceRate
        },
        hydration: {
          value1: report1.nutrition.hydrationLevel,
          value2: report2.nutrition.hydrationLevel,
          difference: report1.nutrition.hydrationLevel - report2.nutrition.hydrationLevel,
          improvement: report1.nutrition.hydrationLevel > report2.nutrition.hydrationLevel
        }
      },
      health: {
        sleepQuality: {
          value1: report1.health.sleepQuality,
          value2: report2.health.sleepQuality,
          difference: report1.health.sleepQuality - report2.health.sleepQuality,
          improvement: report1.health.sleepQuality > report2.health.sleepQuality
        },
        restingHeartRate: {
          value1: report1.health.restingHeartRate,
          value2: report2.health.restingHeartRate,
          difference: report1.health.restingHeartRate - report2.health.restingHeartRate,
          improvement: report1.health.restingHeartRate < report2.health.restingHeartRate // Lower is better
        }
      },
      performance: {
        strength: {
          value1: (report1.performance.strengthImprovements.squat + 
                  report1.performance.strengthImprovements.deadlift + 
                  report1.performance.strengthImprovements.benchPress + 
                  report1.performance.strengthImprovements.pullUp) / 4,
          value2: (report2.performance.strengthImprovements.squat + 
                  report2.performance.strengthImprovements.deadlift + 
                  report2.performance.strengthImprovements.benchPress + 
                  report2.performance.strengthImprovements.pullUp) / 4,
          difference: ((report1.performance.strengthImprovements.squat + 
                       report1.performance.strengthImprovements.deadlift + 
                       report1.performance.strengthImprovements.benchPress + 
                       report1.performance.strengthImprovements.pullUp) / 4) -
                      ((report2.performance.strengthImprovements.squat + 
                       report2.performance.strengthImprovements.deadlift + 
                       report2.performance.strengthImprovements.benchPress + 
                       report2.performance.strengthImprovements.pullUp) / 4),
          improvement: (report1.performance.strengthImprovements.squat + 
                       report1.performance.strengthImprovements.deadlift + 
                       report1.performance.strengthImprovements.benchPress + 
                       report1.performance.strengthImprovements.pullUp) >
                      (report2.performance.strengthImprovements.squat + 
                       report2.performance.strengthImprovements.deadlift + 
                       report2.performance.strengthImprovements.benchPress + 
                       report2.performance.strengthImprovements.pullUp)
        },
        cognitive: {
          value1: (report1.performance.cognitiveMetrics.focusScore + 
                  report1.performance.cognitiveMetrics.memoryScore) / 2,
          value2: (report2.performance.cognitiveMetrics.focusScore + 
                  report2.performance.cognitiveMetrics.memoryScore) / 2,
          difference: ((report1.performance.cognitiveMetrics.focusScore + 
                       report1.performance.cognitiveMetrics.memoryScore) / 2) -
                      ((report2.performance.cognitiveMetrics.focusScore + 
                       report2.performance.cognitiveMetrics.memoryScore) / 2),
          improvement: (report1.performance.cognitiveMetrics.focusScore + 
                       report1.performance.cognitiveMetrics.memoryScore) >
                      (report2.performance.cognitiveMetrics.focusScore + 
                       report2.performance.cognitiveMetrics.memoryScore)
        }
      }
    };
    
    setComparisonResult(comparison);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTrendIcon = (improvement: boolean, isLowerBetter: boolean = false) => {
    const actualImprovement = isLowerBetter ? !improvement : improvement;
    return actualImprovement ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getDifferenceText = (difference: number, isPercentage: boolean = true) => {
    const absDiff = Math.abs(difference);
    const sign = difference >= 0 ? '+' : '';
    return `${sign}${difference.toFixed(1)}${isPercentage ? '%' : ''}`;
  };

  const getDifferenceClass = (difference: number, isLowerBetter: boolean = false) => {
    const actualImprovement = isLowerBetter ? difference <= 0 : difference >= 0;
    return actualImprovement ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando historial de progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 mx-auto mb-4">
            <X className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchProgressHistory} className="bg-blue-500 hover:bg-blue-600 text-white">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Comparación de Progreso
            </h1>
            <p className="text-sm text-gray-600">
              Compara tu estado físico y mental actual con cualquier momento de tu historial
            </p>
          </div>
          <Button 
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Volver
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Report Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Seleccionar Períodos para Comparar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período 1 (Base)
              </label>
              <select
                value={selectedReport1?.reportId || ''}
                onChange={(e) => {
                  const report = reports.find(r => r.reportId === e.target.value);
                  if (report) setSelectedReport1(report);
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                {reports.map(report => (
                  <option key={report.reportId} value={report.reportId}>
                    {formatDate(report.startDate)} - {formatDate(report.endDate)} (Puntaje: {report.overallScore})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período 2 (Comparación)
              </label>
              <select
                value={selectedReport2?.reportId || ''}
                onChange={(e) => {
                  const report = reports.find(r => r.reportId === e.target.value);
                  if (report) setSelectedReport2(report);
                }}
                className="w-full border rounded-lg px-3 py-2"
              >
                {reports.map(report => (
                  <option key={report.reportId} value={report.reportId}>
                    {formatDate(report.startDate)} - {formatDate(report.endDate)} (Puntaje: {report.overallScore})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {comparisonResult && (
          <>
            {/* Overall Comparison */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Comparación General
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {selectedReport1 && formatDate(selectedReport1.startDate)}
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {comparisonResult.overallScore.value1}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <ArrowUpDown className="h-8 w-8 text-gray-400 mb-2" />
                    <div className={`text-lg font-semibold ${getDifferenceClass(comparisonResult.overallScore.difference)}`}>
                      {getTrendIcon(comparisonResult.overallScore.improvement)}
                      <span className="ml-1">
                        {getDifferenceText(comparisonResult.overallScore.difference)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      {selectedReport2 && formatDate(selectedReport2.startDate)}
                    </div>
                    <div className="text-3xl font-bold text-gray-800">
                      {comparisonResult.overallScore.value2}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-gray-700">
                    {comparisonResult.overallScore.difference >= 0 
                      ? `Has mejorado ${comparisonResult.overallScore.difference.toFixed(1)} puntos en tu puntuación general`
                      : `Tu puntuación ha disminuido ${Math.abs(comparisonResult.overallScore.difference).toFixed(1)} puntos`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metrics Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Training Comparison */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Entrenamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ComparisonRow
                    label="Tasa de Finalización"
                    value1={comparisonResult.training.completionRate.value1}
                    value2={comparisonResult.training.completionRate.value2}
                    difference={comparisonResult.training.completionRate.difference}
                    improvement={comparisonResult.training.completionRate.improvement}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Consistencia"
                    value1={comparisonResult.training.consistency.value1}
                    value2={comparisonResult.training.consistency.value2}
                    difference={comparisonResult.training.consistency.difference}
                    improvement={comparisonResult.training.consistency.improvement}
                    unit="%"
                  />
                </CardContent>
              </Card>

              {/* Nutrition Comparison */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-green-500" />
                    Nutrición
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ComparisonRow
                    label="Adherencia Nutricional"
                    value1={comparisonResult.nutrition.adherence.value1}
                    value2={comparisonResult.nutrition.adherence.value2}
                    difference={comparisonResult.nutrition.adherence.difference}
                    improvement={comparisonResult.nutrition.adherence.improvement}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Nivel de Hidratación"
                    value1={comparisonResult.nutrition.hydration.value1}
                    value2={comparisonResult.nutrition.hydration.value2}
                    difference={comparisonResult.nutrition.hydration.difference}
                    improvement={comparisonResult.nutrition.hydration.improvement}
                    unit="%"
                  />
                </CardContent>
              </Card>

              {/* Health Comparison */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Salud
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ComparisonRow
                    label="Calidad de Sueño"
                    value1={comparisonResult.health.sleepQuality.value1}
                    value2={comparisonResult.health.sleepQuality.value2}
                    difference={comparisonResult.health.sleepQuality.difference}
                    improvement={comparisonResult.health.sleepQuality.improvement}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Frecuencia Cardíaca en Reposo"
                    value1={comparisonResult.health.restingHeartRate.value1}
                    value2={comparisonResult.health.restingHeartRate.value2}
                    difference={comparisonResult.health.restingHeartRate.difference}
                    improvement={comparisonResult.health.restingHeartRate.improvement}
                    unit="bpm"
                    isLowerBetter={true}
                  />
                </CardContent>
              </Card>

              {/* Performance Comparison */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ComparisonRow
                    label="Mejoras de Fuerza"
                    value1={comparisonResult.performance.strength.value1}
                    value2={comparisonResult.performance.strength.value2}
                    difference={comparisonResult.performance.strength.difference}
                    improvement={comparisonResult.performance.strength.improvement}
                    unit="%"
                  />
                  <ComparisonRow
                    label="Métricas Cognitivas"
                    value1={comparisonResult.performance.cognitive.value1}
                    value2={comparisonResult.performance.cognitive.value2}
                    difference={comparisonResult.performance.cognitive.difference}
                    improvement={comparisonResult.performance.cognitive.improvement}
                    unit="%"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-500" />
                  Insights de la Comparación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Áreas Mejoradas</h3>
                    <ul className="space-y-1 text-green-700">
                      {comparisonResult.overallScore.difference > 0 && (
                        <li>• Puntuación general mejorada</li>
                      )}
                      {comparisonResult.training.completionRate.difference > 0 && (
                        <li>• Mayor tasa de finalización de entrenamientos</li>
                      )}
                      {comparisonResult.nutrition.adherence.difference > 0 && (
                        <li>• Mejor adherencia nutricional</li>
                      )}
                      {comparisonResult.health.sleepQuality.difference > 0 && (
                        <li>• Mejor calidad de sueño</li>
                      )}
                      {comparisonResult.performance.strength.difference > 0 && (
                        <li>• Mejoras en fuerza</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">Áreas a Mejorar</h3>
                    <ul className="space-y-1 text-orange-700">
                      {comparisonResult.overallScore.difference < 0 && (
                        <li>• Puntuación general disminuida</li>
                      )}
                      {comparisonResult.training.completionRate.difference < 0 && (
                        <li>• Menor tasa de finalización de entrenamientos</li>
                      )}
                      {comparisonResult.nutrition.adherence.difference < 0 && (
                        <li>• Adherencia nutricional reducida</li>
                      )}
                      {comparisonResult.health.sleepQuality.difference < 0 && (
                        <li>• Calidad de sueño disminuida</li>
                      )}
                      {comparisonResult.performance.strength.difference < 0 && (
                        <li>• Disminución en fuerza</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

// Helper Components
const ComparisonRow = ({ 
  label, 
  value1, 
  value2, 
  difference, 
  improvement, 
  unit = '', 
  isLowerBetter = false 
}: { 
  label: string; 
  value1: number; 
  value2: number; 
  difference: number; 
  improvement: boolean; 
  unit?: string;
  isLowerBetter?: boolean;
}) => {
  const actualImprovement = isLowerBetter ? difference <= 0 : difference >= 0;
  const trendIcon = actualImprovement ? 
    <TrendingUp className="h-4 w-4 text-green-500" /> : 
    <TrendingDown className="h-4 w-4 text-red-500" />;
  
  const differenceClass = actualImprovement ? 'text-green-600' : 'text-red-600';
  const absDifference = Math.abs(difference);
  const sign = difference >= 0 ? '+' : '';
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm">{value1.toFixed(1)}{unit}</div>
          <div className="text-xs text-gray-500">vs {value2.toFixed(1)}{unit}</div>
        </div>
        <div className={`flex items-center ${differenceClass}`}>
          {trendIcon}
          <span className="ml-1 text-sm font-medium">
            {sign}{absDifference.toFixed(1)}{unit}
          </span>
        </div>
      </div>
    </div>
  );
};