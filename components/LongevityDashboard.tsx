import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, Activity, Heart, Brain, Zap } from 'lucide-react';
import { LongevityReportAI, WeeklyLongevityReport } from '@/lib/longevityReportAI';

interface LongevityDashboardProps {
  userData: any;
  weeklyData: {
    trainingMetrics: any[];
    wearableData: any[];
    nutritionData: any[];
    sleepData: any[];
    biomarkerData?: any;
  };
}

export default function LongevityDashboard({ userData, weeklyData }: LongevityDashboardProps) {
  const [report, setReport] = useState<WeeklyLongevityReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReport = async () => {
      try {
        const longevityAI = new LongevityReportAI();
        const weeklyReport = await longevityAI.generateWeeklyReport(userData, weeklyData);
        setReport(weeklyReport);
      } catch (error) {
        console.error('Error generating longevity report:', error);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [userData, weeklyData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'mejorando':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'deteriorando':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critico':
        return 'destructive';
      case 'alto':
        return 'destructive';
      case 'moderado':
        return 'default';
      case 'bajo':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Generando informe de longevidad...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-gray-500 p-8">
        Error al generar el informe de longevidad
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧬 Informe Semanal de Longevidad
        </h1>
        <p className="text-gray-600">
          Semana del {report.weekStartDate.toLocaleDateString()} al {report.weekEndDate.toLocaleDateString()}
        </p>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Puntuación de Longevidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{report.longevityScore}</div>
            <p className="text-xs text-blue-600 mt-1">de 100 puntos</p>
            <Progress value={report.longevityScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Edad Biológica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {report.biologicalAge.biologicalAge}
            </div>
            <p className="text-xs text-green-600 mt-1">
              vs {report.biologicalAge.chronologicalAge} cronológica
            </p>
            <Badge variant={report.biologicalAge.biologicalAge < report.biologicalAge.chronologicalAge ? "default" : "destructive"} className="mt-2">
              {report.biologicalAge.ageReversalRate > 0 ? 'Rejuveneciendo' : 'Envejeciendo'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Expectativa de Vida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {report.predictedLifespan.currentTrajectory}
            </div>
            <p className="text-xs text-purple-600 mt-1">años proyectados</p>
            <div className="text-sm text-purple-700 mt-2">
              Potencial: +{report.predictedLifespan.interventionGap} años
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Análisis Cuántico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              {report.quantumAnalysis.cellularCoherence}%
            </div>
            <p className="text-xs text-orange-600 mt-1">coherencia celular</p>
            <div className="text-xs text-orange-700 mt-2">
              Optimización: {report.quantumAnalysis.bioenergeticOptimization}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="strength" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="strength" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Fuerza
          </TabsTrigger>
          <TabsTrigger value="composition" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Composición
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sueño
          </TabsTrigger>
          <TabsTrigger value="biomarkers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Biomarcadores
          </TabsTrigger>
          <TabsTrigger value="insights">
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Strength Metrics */}
        <TabsContent value="strength" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Fuerza Relativa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Relación Fuerza/Peso</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sentadilla:</span>
                      <span className="font-bold">{report.relativeStrength.strengthToWeightRatio.squat}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso Muerto:</span>
                      <span className="font-bold">{report.relativeStrength.strengthToWeightRatio.deadlift}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Press de Banca:</span>
                      <span className="font-bold">{report.relativeStrength.strengthToWeightRatio.benchPress}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dominadas:</span>
                      <span className="font-bold">{report.relativeStrength.strengthToWeightRatio.pullUp}x</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Calidad Funcional</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Calidad de Movimiento</span>
                        <span>{report.relativeStrength.functionalMovementQuality}%</span>
                      </div>
                      <Progress value={report.relativeStrength.functionalMovementQuality} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Potencia por kg</span>
                        <span>{report.relativeStrength.powerOutputPerKg} W/kg</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant={report.relativeStrength.sarcopeniaRisk === 'bajo' ? 'default' : 'destructive'}>
                        Riesgo Sarcopenia: {report.relativeStrength.sarcopeniaRisk}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Body Composition */}
        <TabsContent value="composition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Composición Corporal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Grasa Corporal</span>
                      <span className="font-bold">{report.bodyComposition.bodyFatPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={report.bodyComposition.bodyFatPercentage} max={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Masa Muscular</span>
                      <span className="font-bold">{report.bodyComposition.muscleMassPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={report.bodyComposition.muscleMassPercentage} max={50} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Densidad Ósea</span>
                      <span className="font-bold">{report.bodyComposition.boneDensity.toFixed(2)}</span>
                    </div>
                    <Progress value={report.bodyComposition.boneDensity * 100} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Salud Celular</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Densidad Mitocondrial</span>
                        <span>{report.bodyComposition.cellularHealth.mitochondrialDensity.toFixed(1)}%</span>
                      </div>
                      <Progress value={report.bodyComposition.cellularHealth.mitochondrialDensity} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Marcadores Inflamatorios</span>
                        <span>{report.bodyComposition.cellularHealth.inflammationMarkers.toFixed(1)}</span>
                      </div>
                      <Progress value={100 - report.bodyComposition.cellularHealth.inflammationMarkers} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Estrés Oxidativo</span>
                        <span>{report.bodyComposition.cellularHealth.oxidativeStress.toFixed(1)}</span>
                      </div>
                      <Progress value={100 - report.bodyComposition.cellularHealth.oxidativeStress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sleep Quality */}
        <TabsContent value="sleep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Calidad del Sueño</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Eficiencia del Sueño</span>
                      <span className="font-bold">{report.sleepQuality.sleepEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={report.sleepQuality.sleepEfficiency} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Sueño Profundo</span>
                      <span className="font-bold">{report.sleepQuality.deepSleepPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={report.sleepQuality.deepSleepPercentage} max={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Sueño REM</span>
                      <span className="font-bold">{report.sleepQuality.remSleepPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={report.sleepQuality.remSleepPercentage} max={25} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Optimización Hormonal</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Hormona de Crecimiento</span>
                        <span>{report.sleepQuality.hormoneOptimization.growthHormone}%</span>
                      </div>
                      <Progress value={report.sleepQuality.hormoneOptimization.growthHormone} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Melatonina</span>
                        <span>{report.sleepQuality.hormoneOptimization.melatonin}%</span>
                      </div>
                      <Progress value={report.sleepQuality.hormoneOptimization.melatonin} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Testosterona</span>
                        <span>{report.sleepQuality.hormoneOptimization.testosterone}%</span>
                      </div>
                      <Progress value={report.sleepQuality.hormoneOptimization.testosterone} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Biomarkers */}
        <TabsContent value="biomarkers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Biomarcadores Cardiovasculares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>VO2 Máx:</span>
                  <span className="font-bold">{report.biomarkers.cardiovascular.vo2max.toFixed(1)} ml/kg/min</span>
                </div>
                <div className="flex justify-between">
                  <span>FC Reposo:</span>
                  <span className="font-bold">{report.biomarkers.cardiovascular.restingHeartRate} bpm</span>
                </div>
                <div className="flex justify-between">
                  <span>VFC:</span>
                  <span className="font-bold">{report.biomarkers.cardiovascular.heartRateVariability.toFixed(1)} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Presión Arterial:</span>
                  <span className="font-bold">
                    {report.biomarkers.cardiovascular.bloodPressure.systolic}/{report.biomarkers.cardiovascular.bloodPressure.diastolic}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biomarcadores Metabólicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Variabilidad Glucosa:</span>
                  <span className="font-bold">{report.biomarkers.metabolic.glucoseVariability.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Sensibilidad Insulina:</span>
                  <span className="font-bold">{report.biomarkers.metabolic.insulinSensitivity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Flexibilidad Metabólica:</span>
                  <span className="font-bold">{report.biomarkers.metabolic.metabolicFlexibility.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biomarcadores Inflamatorios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Proteína C Reactiva:</span>
                  <span className="font-bold">{report.biomarkers.inflammatory.crp.toFixed(2)} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span>Interleucina-6:</span>
                  <span className="font-bold">{report.biomarkers.inflammatory.il6.toFixed(2)} pg/mL</span>
                </div>
                <div className="flex justify-between">
                  <span>Índice Inflamatorio:</span>
                  <span className="font-bold">{report.biomarkers.inflammatory.inflammatoryIndex.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biomarcadores Celulares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Longitud Telómeros:</span>
                  <span className="font-bold">{report.biomarkers.cellular.telomereLength.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Función Mitocondrial:</span>
                  <span className="font-bold">{report.biomarkers.cellular.mitochondrialFunction.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Marcadores Autofagia:</span>
                  <span className="font-bold">{report.biomarkers.cellular.autophagyMarkers.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Actividad Células Madre:</span>
                  <span className="font-bold">{report.biomarkers.cellular.stemCellActivity.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights and Protocols */}
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights de Longevidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.insights.map((insight, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getImpactColor(insight.impact)}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                    <div className="text-sm space-y-1">
                      <div><strong>Intervención:</strong> {insight.intervention}</div>
                      <div><strong>Tiempo de implementación:</strong> {insight.timeToImplement}</div>
                      <div><strong>Potencial de mejora:</strong> {insight.improvementPotential.toFixed(1)} años</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protocolos de Longevidad Recomendados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.protocols.map((protocol, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{protocol.name}</h4>
                      <Badge variant="outline">{protocol.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Intervenciones:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {protocol.interventions.map((intervention, i) => (
                            <li key={i} className="text-gray-700">{intervention}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div><strong>Beneficio esperado:</strong> +{protocol.expectedBenefit} años</div>
                        <div><strong>Complejidad:</strong> {protocol.implementationComplexity}</div>
                      </div>
                      <div className="text-sm">
                        <strong>Marco temporal:</strong> {protocol.timeframe}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Changes */}
            <Card>
              <CardHeader>
                <CardTitle>Cambios Semanales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.weekOverWeekChanges).map(([metric, data]) => (
                    <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium capitalize">{metric.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-2xl font-bold">{data.value}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(data.trend)}
                        <span className={`font-medium ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.change >= 0 ? '+' : ''}{data.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}