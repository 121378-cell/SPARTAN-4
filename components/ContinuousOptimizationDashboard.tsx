// Continuous Optimization Dashboard Component
// Demonstrates integration of Continuous Ecosystem Optimization Service with UI

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { 
  Activity, 
  Zap, 
  Database, 
  Cpu, 
  MemoryStick, 
  BarChart3, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { continuousEcosystemOptimizationService } from '../lib/continuous-ecosystem-optimization-service';
import type { OptimizationMetrics, SystemAuditReport, OptimizationRecommendation } from '../lib/continuous-ecosystem-optimization-service';

interface ContinuousOptimizationDashboardProps {
  className?: string;
}

const ContinuousOptimizationDashboard: React.FC<ContinuousOptimizationDashboardProps> = ({ 
  className = '' 
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<OptimizationMetrics | null>(null);
  const [auditHistory, setAuditHistory] = useState<SystemAuditReport[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize the optimization service
  useEffect(() => {
    // Initialize with custom configuration for the dashboard
    continuousEcosystemOptimizationService.initialize({
      auditInterval: 60000, // 1 minute for dashboard
      autoApplyOptimizations: true,
      performanceThreshold: 0.7,
      enableDetailedLogging: true
    });

    // Load initial data
    loadData();

    // Set up interval for periodic updates
    const intervalId = setInterval(() => {
      loadData();
    }, 30000); // Update every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get current metrics
      const metrics = await continuousEcosystemOptimizationService.getCurrentMetrics();
      setCurrentMetrics(metrics);
      
      // Get audit history
      const history = continuousEcosystemOptimizationService.getOptimizationHistory();
      setAuditHistory(history);
      
      // Get current recommendations
      const currentRecommendations = continuousEcosystemOptimizationService.getCurrentRecommendations();
      setRecommendations(currentRecommendations);
    } catch (error) {
      console.error('Error loading optimization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render metric cards
  const renderMetricCard = (title: string, value: number | null, icon: React.ReactNode, color: string) => {
    if (value === null) return null;
    
    const percentage = Math.round(value * 100);
    const isGood = value >= 0.8;
    const isWarning = value >= 0.6 && value < 0.8;
    const isCritical = value < 0.6;
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`p-2 rounded-full ${isGood ? 'bg-green-100' : isWarning ? 'bg-yellow-100' : 'bg-red-100'}`}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{percentage}%</div>
          <div className={`text-xs ${isGood ? 'text-green-600' : isWarning ? 'text-yellow-600' : 'text-red-600'}`}>
            {isGood ? 'Optimal' : isWarning ? 'Needs attention' : 'Critical'}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  if (!currentMetrics) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
          <p className="mt-4 text-gray-500">Unable to load optimization metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          "Data Flow Efficiency", 
          currentMetrics.dataFlowEfficiency, 
          <Activity className="h-5 w-5 text-blue-500" />,
          "blue"
        )}
        
        {renderMetricCard(
          "Visualization Performance", 
          currentMetrics.visualizationPerformance, 
          <BarChart3 className="h-5 w-5 text-green-500" />,
          "green"
        )}
        
        {renderMetricCard(
          "Chat Responsiveness", 
          currentMetrics.chatMaestroResponsiveness, 
          <Zap className="h-5 w-5 text-purple-500" />,
          "purple"
        )}
        
        {renderMetricCard(
          "Modal Activation Speed", 
          currentMetrics.modalActivationSpeed, 
          <Database className="h-5 w-5 text-orange-500" />,
          "orange"
        )}
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MemoryStick className="h-5 w-5 mr-2 text-red-500" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(currentMetrics.memoryUsage * 100)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${
                  currentMetrics.memoryUsage < 0.7 ? 'bg-green-500' : 
                  currentMetrics.memoryUsage < 0.85 ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${currentMetrics.memoryUsage * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-blue-500" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(currentMetrics.cpuUsage * 100)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${
                  currentMetrics.cpuUsage < 0.7 ? 'bg-green-500' : 
                  currentMetrics.cpuUsage < 0.85 ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${currentMetrics.cpuUsage * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">System Running Optimally</h3>
              <p className="text-gray-500">No optimization recommendations at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'critical' ? 'border-red-200 bg-red-50' : 
                    rec.priority === 'high' ? 'border-orange-200 bg-orange-50' : 
                    rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{rec.description}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.implementation}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                      rec.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContinuousOptimizationDashboard;