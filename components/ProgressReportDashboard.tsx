/**
 * Progress Report Dashboard
 * Displays comprehensive user progress reports with training, nutrition, health and performance metrics
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Utensils, 
  Heart, 
  Target, 
  Award, 
  Calendar,
  Zap,
  Droplets,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { ProgressReportGenerator, progressReportGenerator } from '../lib/progress-report-generator';
import type { WeeklyProgressReport, Recommendation } from '../lib/progress-report-types';
import { Button } from './ui';

interface ProgressReportDashboardProps {
  userId: string;
  onBack: () => void;
}

export default function ProgressReportDashboard({ userId, onBack }: ProgressReportDashboardProps) {
  const [report, setReport] = useState<WeeklyProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly');

  useEffect(() => {
    generateReport();
  }, [userId, timeframe]);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedReport = await progressReportGenerator.generateWeeklyReport(userId);
      setReport(generatedReport);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate progress report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generando informe de progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={generateReport} className="bg-blue-500 hover:bg-blue-600 text-white">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se pudo generar el informe</p>
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
              Informe de Progreso
            </h1>
            <p className="text-sm text-gray-600">
              {report.startDate.toLocaleDateString()} - {report.endDate.toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
            </select>
            <Button 
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Volver
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Overall Score */}
        <div className="mb-10">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-white/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-white"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - report.overallScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="64"
                      cy="64"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{report.overallScore}</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Puntuación General</h2>
              <p className="text-blue-100">
                {report.overallScore >= 80 ? '¡Excelente desempeño!' : 
                 report.overallScore >= 60 ? 'Buen progreso' : 
                 'Hay margen para mejorar'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard 
            title="Entrenamiento"
            value={`${Math.round(report.training.workoutCompletionRate)}%`}
            icon={<Activity className="h-6 w-6" />}
            trend={report.trends.trainingTrend}
            color="blue"
          />
          <MetricCard 
            title="Nutrición"
            value={`${Math.round(report.nutrition.adherenceRate)}%`}
            icon={<Utensils className="h-6 w-6" />}
            trend={report.trends.nutritionTrend}
            color="green"
          />
          <MetricCard 
            title="Salud"
            value={`${Math.round(report.health.sleepQuality)}`}
            icon={<Heart className="h-6 w-6" />}
            trend={report.trends.healthTrend}
            color="red"
          />
          <MetricCard 
            title="Rendimiento"
            value={`${Math.round((report.performance.strengthImprovements.squat + 
                              report.performance.strengthImprovements.deadlift + 
                              report.performance.strengthImprovements.benchPress + 
                              report.performance.strengthImprovements.pullUp) / 4)}%`}
            icon={<Zap className="h-6 w-6" />}
            trend={report.trends.performanceTrend}
            color="purple"
          />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Training Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Entrenamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatBox 
                  label="Sesiones Completadas"
                  value={report.training.completedWorkouts.toString()}
                  secondary={report.training.totalWorkouts.toString()}
                />
                <StatBox 
                  label="Duración Promedio"
                  value={`${Math.round(report.training.avgWorkoutDuration)} min`}
                />
                <StatBox 
                  label="Consistencia"
                  value={`${Math.round(report.training.consistencyScore)}%`}
                />
                <StatBox 
                  label="Intensidad"
                  value={`${Math.round(report.training.intensityScore)}%`}
                />
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Distribución de Entrenamiento</h4>
                <div className="space-y-2">
                  <DistributionBar 
                    label="Fuerza"
                    value={report.training.workoutDistribution.strength}
                    color="bg-blue-500"
                  />
                  <DistributionBar 
                    label="Calistenia"
                    value={report.training.workoutDistribution.calisthenics}
                    color="bg-green-500"
                  />
                  <DistributionBar 
                    label="Yoga"
                    value={report.training.workoutDistribution.yoga}
                    color="bg-purple-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-green-500" />
                Nutrición
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatBox 
                  label="Adherencia"
                  value={`${Math.round(report.nutrition.adherenceRate)}%`}
                />
                <StatBox 
                  label="Hidratación"
                  value={`${Math.round(report.nutrition.hydrationLevel)}%`}
                />
                <StatBox 
                  label="Comidas/Día"
                  value={report.nutrition.mealFrequency.toFixed(1)}
                />
                <StatBox 
                  label="Micronutrientes"
                  value={`${Math.round(report.nutrition.micronutrientScore)}%`}
                />
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Adherencia a Macros</h4>
                <div className="space-y-3">
                  <MacroProgress 
                    name="Calorías"
                    target={report.nutrition.macroTargets.calories}
                    actual={report.nutrition.actualIntake.calories}
                    adherence={report.nutrition.macroAdherence.calories}
                  />
                  <MacroProgress 
                    name="Proteína"
                    target={report.nutrition.macroTargets.protein}
                    actual={report.nutrition.actualIntake.protein}
                    adherence={report.nutrition.macroAdherence.protein}
                  />
                  <MacroProgress 
                    name="Carbohidratos"
                    target={report.nutrition.macroTargets.carbs}
                    actual={report.nutrition.actualIntake.carbs}
                    adherence={report.nutrition.macroAdherence.carbs}
                  />
                  <MacroProgress 
                    name="Grasas"
                    target={report.nutrition.macroTargets.fats}
                    actual={report.nutrition.actualIntake.fats}
                    adherence={report.nutrition.macroAdherence.fats}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Health Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Salud
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatBox 
                  label="Calidad de Sueño"
                  value={`${Math.round(report.health.sleepQuality)}/100`}
                />
                <StatBox 
                  label="Duración Sueño"
                  value={`${report.health.sleepDuration.toFixed(1)} hrs`}
                />
                <StatBox 
                  label="RHR"
                  value={`${report.health.restingHeartRate} bpm`}
                  secondary="↓2 bpm vs semana anterior"
                />
                <StatBox 
                  label="HRV"
                  value={`${report.health.heartRateVariability} ms`}
                />
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Composición Corporal</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peso</span>
                    <span className="font-medium">{report.health.bodyComposition.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grasa Corporal</span>
                    <span className="font-medium">{report.health.bodyComposition.bodyFatPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Masa Muscular</span>
                    <span className="font-medium">{report.health.bodyComposition.muscleMass} kg</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Rendimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Mejoras de Fuerza</h4>
                <div className="space-y-3">
                  <PerformanceMetric 
                    name="Sentadilla"
                    value={report.performance.strengthImprovements.squat}
                    unit="%"
                  />
                  <PerformanceMetric 
                    name="Peso Muerto"
                    value={report.performance.strengthImprovements.deadlift}
                    unit="%"
                  />
                  <PerformanceMetric 
                    name="Press Banca"
                    value={report.performance.strengthImprovements.benchPress}
                    unit="%"
                  />
                  <PerformanceMetric 
                    name="Dominadas"
                    value={report.performance.strengthImprovements.pullUp}
                    unit="%"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Métricas Cognitivas</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{report.performance.cognitiveMetrics.focusScore}</div>
                    <div className="text-xs text-gray-600">Enfoque</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{report.performance.cognitiveMetrics.reactionTime}ms</div>
                    <div className="text-xs text-gray-600">Reacción</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{report.performance.cognitiveMetrics.memoryScore}</div>
                    <div className="text-xs text-gray-600">Memoria</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-5 w-5" />
                Áreas de Mejora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.recommendations.map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Helper Components
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: 'improving' | 'stable' | 'declining';
  color: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  }[color];

  const trendIcon = trend === 'improving' ? 
    <TrendingUp className="h-4 w-4 text-green-500" /> : 
    trend === 'declining' ? 
    <TrendingDown className="h-4 w-4 text-red-500" /> : 
    <BarChart3 className="h-4 w-4 text-gray-500" />;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          {trendIcon}
          <span className="ml-1 capitalize">
            {trend === 'improving' ? 'Mejorando' : 
             trend === 'declining' ? 'Disminuyendo' : 'Estable'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatBox = ({ label, value, secondary }: { label: string; value: string; secondary?: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="text-xl font-bold">{value}</p>
    {secondary && <p className="text-gray-500 text-xs mt-1">{secondary}</p>}
  </div>
);

const DistributionBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const MacroProgress = ({ name, target, actual, adherence }: { 
  name: string; 
  target: number; 
  actual: number; 
  adherence: number; 
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{name}</span>
      <span>{actual}/{target}g</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${adherence >= 90 ? 'bg-green-500' : adherence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
        style={{ width: `${Math.min(100, adherence)}%` }}
      ></div>
    </div>
    <div className="text-right text-xs mt-1">{Math.round(adherence)}%</div>
  </div>
);

const PerformanceMetric = ({ name, value, unit }: { name: string; value: number; unit: string }) => (
  <div className="flex justify-between items-center">
    <span>{name}</span>
    <span className={`font-medium ${value > 5 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
      +{value.toFixed(1)}{unit}
    </span>
  </div>
);

const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const categoryIcons = {
    training: <Activity className="h-4 w-4" />,
    nutrition: <Utensils className="h-4 w-4" />,
    health: <Heart className="h-4 w-4" />,
    performance: <Zap className="h-4 w-4" />,
    recovery: <Droplets className="h-4 w-4" />
  };

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              {categoryIcons[recommendation.category]}
            </div>
            <h3 className="font-semibold">{recommendation.title}</h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[recommendation.priority]}`}>
            {recommendation.priority === 'high' ? 'Alta' : 
             recommendation.priority === 'medium' ? 'Media' : 'Baja'}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{recommendation.description}</p>
        <div className="space-y-2 mb-4">
          {recommendation.actionItems.map((action, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
              <span className="text-sm">{action}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Impacto esperado: {recommendation.expectedImpact}</span>
          <span>Plazo: {recommendation.timeframe}</span>
        </div>
      </CardContent>
    </Card>
  );
};