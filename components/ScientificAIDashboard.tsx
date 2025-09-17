import { useState, useEffect, memo } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "./ui";
import { 
  Brain, BookOpen, TrendingUp, AlertCircle, CheckCircle2, Clock, 
  Microscope, Database, Zap, Target, ArrowLeft, Sparkles, Beaker,
  FileText, Users, Calendar, Activity, Lightbulb, RefreshCw,
  BarChart3, PieChart, LineChart
} from "lucide-react";
import { scientificAI, type ScientificEvidence, type AILearningUpdate, type WeeklyDigest } from '../lib/scientificAI';

interface ScientificAIDashboardProps {
  onBack: () => void;
}

const ScientificAIDashboard = memo(function ScientificAIDashboard({ onBack }: ScientificAIDashboardProps) {
  const [currentUpdate, setCurrentUpdate] = useState<AILearningUpdate | null>(null);
  const [weeklyDigest, setWeeklyDigest] = useState<WeeklyDigest | null>(null);
  const [knowledgeStatus, setKnowledgeStatus] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'protocols' | 'digest'>('overview');
  const [recentEvidence, setRecentEvidence] = useState<ScientificEvidence[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const status = scientificAI.getKnowledgeStatus();
      setKnowledgeStatus(status);
      
      // Generar digest semanal si no existe
      if (status.weeklyDigestAvailable) {
        const digest = await scientificAI.generateWeeklyDigest();
        setWeeklyDigest(digest);
      }
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  const handleForceUpdate = async () => {
    setIsUpdating(true);
    try {
      const update = await scientificAI.forceUpdate();
      setCurrentUpdate(update);
      setRecentEvidence(update.evidenceProcessed);
      
      // Actualizar estado del conocimiento
      const newStatus = scientificAI.getKnowledgeStatus();
      setKnowledgeStatus(newStatus);
    } catch (error) {
      console.error('Error durante actualización:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'revolutionary': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'PubMed': return 'bg-green-100 text-green-800';
      case 'Nature': return 'bg-purple-100 text-purple-800';
      case 'Science': return 'bg-red-100 text-red-800';
      case 'arXiv': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="spartan-xxii-body min-h-screen p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="holographic-text text-4xl mb-2" data-text="IA Científica Adaptativa">
              IA Científica Adaptativa
            </h1>
            <p className="text-lg text-gray-300">
              Sistema de aprendizaje continuo basado en evidencia científica mundial
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="neural-button bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Microscope className="mr-2 h-4 w-4" />
                  Buscar Nueva Evidencia
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="neural-button bg-transparent border-2 border-cyan-400 text-cyan-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        {knowledgeStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="quantum-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Database className="h-8 w-8 dimensional-icon text-blue-400" />
                  <Badge className="bg-blue-100 text-blue-800">ACTIVO</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Base de Conocimiento</h3>
                <p className="text-3xl font-bold text-cyan-400">{knowledgeStatus.totalEvidence}</p>
                <p className="text-xs text-gray-400 mt-2">Estudios científicos analizados</p>
              </CardContent>
            </Card>

            <Card className="quantum-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 dimensional-icon text-green-400" />
                  <Badge className="bg-green-100 text-green-800">
                    {(knowledgeStatus.confidenceAverage * 100).toFixed(1)}%
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Confianza Promedio</h3>
                <div className="neural-progress mt-3">
                  <div 
                    className="neural-progress-fill"
                    style={{ width: `${knowledgeStatus.confidenceAverage * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">Evidencia científica validada</p>
              </CardContent>
            </Card>

            <Card className="quantum-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Beaker className="h-8 w-8 dimensional-icon text-purple-400" />
                  <Badge className="bg-purple-100 text-purple-800">OPTIMIZADOS</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Protocolos Activos</h3>
                <p className="text-3xl font-bold text-purple-400">{knowledgeStatus.protocolsActive}</p>
                <p className="text-xs text-gray-400 mt-2">Basados en evidencia actual</p>
              </CardContent>
            </Card>

            <Card className="quantum-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 dimensional-icon text-yellow-400" />
                  <Badge className="bg-yellow-100 text-yellow-800">TIEMPO REAL</Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2">Última Actualización</h3>
                <p className="text-sm text-yellow-400 font-mono">
                  {formatDate(knowledgeStatus.lastUpdate)}
                </p>
                <p className="text-xs text-gray-400 mt-2">Investigación continua 24/7</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'overview', label: 'Resumen', icon: <BarChart3 className="h-4 w-4" /> },
            { key: 'evidence', label: 'Evidencia Reciente', icon: <BookOpen className="h-4 w-4" /> },
            { key: 'protocols', label: 'Protocolos', icon: <Target className="h-4 w-4" /> },
            { key: 'digest', label: 'Digest Semanal', icon: <Calendar className="h-4 w-4" /> }
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

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* AI Learning Status */}
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 dimensional-icon" />
                  Estado del Aprendizaje Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="holographic-loader mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Investigación Activa</h4>
                    <p className="text-sm text-gray-400">
                      Analizando continuamente 7 bases de datos científicas principales
                    </p>
                  </div>
                  <div className="text-center">
                    <Lightbulb className="h-12 w-12 dimensional-icon mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Síntesis en Tiempo Real</h4>
                    <p className="text-sm text-gray-400">
                      Integrando nuevos hallazgos en protocolos existentes
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 dimensional-icon mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">Optimización Continua</h4>
                    <p className="text-sm text-gray-400">
                      Mejorando recomendaciones basadas en nueva evidencia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Findings Preview */}
            {currentUpdate && (
              <Card className="quantum-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 dimensional-icon" />
                    Última Actualización Científica
                  </CardTitle>
                  <CardDescription>
                    {formatDate(currentUpdate.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold mb-2 text-green-400">Nuevas Recomendaciones</h5>
                        <ul className="space-y-1">
                          {currentUpdate.newRecommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2 text-red-400">Prácticas Obsoletas</h5>
                        {currentUpdate.deprecatedPractices.length > 0 ? (
                          <ul className="space-y-1">
                            {currentUpdate.deprecatedPractices.slice(0, 3).map((dep, idx) => (
                              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
                                {dep}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">No se identificaron prácticas obsoletas</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle>Evidencia Científica Reciente</CardTitle>
                <CardDescription>
                  Estudios analizados y validados por el sistema de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentEvidence.length > 0 ? (
                  <div className="space-y-4">
                    {recentEvidence.map((evidence) => (
                      <Card key={evidence.id} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{evidence.title}</CardTitle>
                              <div className="flex gap-2 mb-2">
                                <Badge className={getSourceColor(evidence.source)}>
                                  {evidence.source}
                                </Badge>
                                <Badge className={getImpactColor(evidence.impactLevel)}>
                                  {evidence.impactLevel.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">
                                  Confianza: {(evidence.confidence * 100).toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-semibold text-cyan-400 mb-2">Hallazgos Clave:</h5>
                              <ul className="space-y-1">
                                {evidence.keyFindings.map((finding, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                    <Zap className="h-3 w-3 text-cyan-400 mt-1" />
                                    {finding}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-semibold text-green-400 mb-2">Aplicaciones Prácticas:</h5>
                              <ul className="space-y-1">
                                {evidence.practicalApplications.map((app, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                    <Target className="h-3 w-3 text-green-400 mt-1" />
                                    {app}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-2 border-t border-gray-600">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
                                <div>
                                  <span className="font-medium">Muestra:</span> {evidence.methodology.sampleSize}
                                </div>
                                <div>
                                  <span className="font-medium">Duración:</span> {evidence.methodology.duration}
                                </div>
                                <div>
                                  <span className="font-medium">Tipo:</span> {evidence.methodology.studyType}
                                </div>
                                <div>
                                  <span className="font-medium">Publicado:</span> {formatDate(evidence.datePublished)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No hay evidencia reciente disponible</p>
                    <p className="text-sm text-gray-500">Ejecuta una búsqueda para obtener la última evidencia científica</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'protocols' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle>Protocolos Científicos Activos</CardTitle>
                <CardDescription>
                  Protocolos optimizados basados en evidencia científica actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentUpdate?.protocolUpdates.length ? (
                  <div className="space-y-4">
                    {currentUpdate.protocolUpdates.map((update) => (
                      <Card key={update.protocolId} className="bg-gray-800 border-gray-700">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{update.protocolName}</CardTitle>
                            <Badge className={`${
                              update.changeType === 'optimization' ? 'bg-blue-500' :
                              update.changeType === 'replacement' ? 'bg-orange-500' :
                              update.changeType === 'enhancement' ? 'bg-green-500' :
                              'bg-red-500'
                            } text-white`}>
                              {update.changeType.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <span className="font-semibold text-cyan-400">Efectividad:</span>
                              <div className="neural-progress mt-2">
                                <div 
                                  className="neural-progress-fill"
                                  style={{ width: `${update.effectiveness * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-400">
                                {(update.effectiveness * 100).toFixed(1)}% de confianza
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-green-400">Recomendación de Adopción:</span>
                              <Badge className={`ml-2 ${
                                update.adoptionRecommendation === 'immediate' ? 'bg-red-500' :
                                update.adoptionRecommendation === 'gradual' ? 'bg-yellow-500' :
                                update.adoptionRecommendation === 'trial' ? 'bg-blue-500' :
                                'bg-gray-500'
                              } text-white`}>
                                {update.adoptionRecommendation.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No hay actualizaciones de protocolos disponibles</p>
                    <p className="text-sm text-gray-500">Los protocolos se actualizarán automáticamente con nueva evidencia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'digest' && (
          <div className="space-y-6">
            <Card className="quantum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 dimensional-icon" />
                  Digest Semanal de Evidencia Científica
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyDigest ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-cyan-400">{weeklyDigest.totalStudiesAnalyzed}</p>
                        <p className="text-sm text-gray-400">Estudios Analizados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">{weeklyDigest.breakthroughFindings.length}</p>
                        <p className="text-sm text-gray-400">Descubrimientos Destacados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{weeklyDigest.protocolChanges.length}</p>
                        <p className="text-sm text-gray-400">Protocolos Actualizados</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-yellow-400">Temas Tendencia Esta Semana:</h4>
                      <div className="flex flex-wrap gap-2">
                        {weeklyDigest.trendingTopics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="border-yellow-400 text-yellow-400">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-blue-400">Direcciones de Investigación Futura:</h4>
                      <ul className="space-y-2">
                        {weeklyDigest.futureResearchDirections.map((direction, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-400 mt-0.5" />
                            {direction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-green-400">Resumen de Impacto para Usuarios:</h4>
                      <p className="text-sm text-gray-300">{weeklyDigest.userImpactSummary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Digest semanal no disponible</p>
                    <p className="text-sm text-gray-500">El digest se genera automáticamente cada semana</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
});

export default ScientificAIDashboard;