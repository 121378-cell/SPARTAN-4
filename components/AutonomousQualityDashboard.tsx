// Autonomous Quality Dashboard Component
import React, { useState, useEffect } from 'react';
import { autonomousQualitySupervisionService, SystemHealthReport, QualityIssue } from '../lib/autonomous-quality-supervision-service';

interface AutonomousQualityDashboardProps {
  className?: string;
}

const AutonomousQualityDashboard: React.FC<AutonomousQualityDashboardProps> = ({ 
  className = ''
}) => {
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [issues, setIssues] = useState<QualityIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // 30 seconds

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load health report and issues
        const [reports, allIssues] = await Promise.all([
          autonomousQualitySupervisionService.getHealthReports(),
          autonomousQualitySupervisionService.getIssues()
        ]);
        
        if (reports.length > 0) {
          setHealthReport(reports[reports.length - 1]); // Get latest report
        }
        setIssues(allIssues);
      } catch (error) {
        console.error('Error loading quality data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up auto-refresh
    const intervalId = setInterval(() => {
      loadData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg">Cargando datos de supervisión de calidad...</div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 bg-gray-900 rounded-xl shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Supervisión Autónoma de Calidad</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            Actualizado: {healthReport?.timestamp ? new Date(healthReport.timestamp).toLocaleTimeString() : 'N/A'}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Refrescar
          </button>
        </div>
      </div>
      
      {/* Overall Status */}
      {healthReport && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Estado General del Sistema</h3>
            <div className={`px-4 py-2 rounded-full ${getStatusColor(healthReport.overallStatus)} text-white font-semibold`}>
              {healthReport.overallStatus.toUpperCase()}
            </div>
          </div>
          
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {healthReport.dataQualityMetrics.completeness}%
              </div>
              <div className="text-sm text-gray-300">Completitud</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {healthReport.dataQualityMetrics.accuracy}%
              </div>
              <div className="text-sm text-gray-300">Precisión</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {healthReport.dataQualityMetrics.consistency}%
              </div>
              <div className="text-sm text-gray-300">Consistencia</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(100 - healthReport.performanceMetrics.errorRate)}%
              </div>
              <div className="text-sm text-gray-300">Tasa de Éxito</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {healthReport.recentIssues.length}
              </div>
              <div className="text-sm text-gray-300">Problemas Activos</div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Métricas de Rendimiento</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-300">Uso de CPU</div>
                <div className="text-lg font-semibold text-white">{healthReport.performanceMetrics.cpuUsage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Uso de Memoria</div>
                <div className="text-lg font-semibold text-white">{healthReport.performanceMetrics.memoryUsage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Tiempo de Respuesta</div>
                <div className="text-lg font-semibold text-white">{healthReport.performanceMetrics.responseTime.toFixed(0)}ms</div>
              </div>
              <div>
                <div className="text-sm text-gray-300">Disponibilidad</div>
                <div className="text-lg font-semibold text-white">{healthReport.performanceMetrics.uptime.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Component Status */}
      {healthReport && healthReport.componentStatus.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Estado de Componentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthReport.componentStatus.map((component, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{component.componentName}</h4>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
                </div>
                <div className="text-sm text-gray-300 mb-2">
                  {component.status.toUpperCase()}
                </div>
                <div className="text-xs text-gray-400">
                  Última revisión: {component.lastCheck.toLocaleTimeString()}
                </div>
                {component.issues && component.issues.length > 0 && (
                  <div className="mt-2 text-xs text-red-400">
                    {component.issues.length} problema(s)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Issues */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Problemas Recientes</h3>
        {issues.length > 0 ? (
          <div className="space-y-4">
            {issues
              .slice()
              .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
              .slice(0, 10)
              .map((issue, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-800 p-4 rounded-lg border ${
                    issue.resolved ? 'border-green-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{issue.description}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(issue.severity)} text-white`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      {issue.resolved ? (
                        <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                          RESUELTO
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                          ACTIVO
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-300 mb-2">
                    Componente afectado: {issue.affectedComponent}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Detectado: {new Date(issue.detectedAt).toLocaleString()}</span>
                    {issue.resolvedAt && (
                      <span>Resuelto: {new Date(issue.resolvedAt).toLocaleString()}</span>
                    )}
                  </div>
                  {issue.correctiveAction && (
                    <div className="mt-2 text-sm text-blue-400">
                      Acción correctiva: {issue.correctiveAction}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">No se han detectado problemas recientes</div>
        )}
      </div>
      
      {/* Recommendations */}
      {healthReport && healthReport.recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Recomendaciones</h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <ul className="space-y-2">
              {healthReport.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutonomousQualityDashboard;