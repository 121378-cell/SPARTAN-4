import React, { useState, useEffect } from 'react';
import { freeTierMonitor } from '../lib/free-tier-monitor';
import { Card, CardContent, CardHeader, CardTitle } from './ui';

interface UsageData {
  service: string;
  resource: string;
  current: number;
  limit: number;
  percentage: number;
  remaining: number;
}

export const FreeTierDashboard: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [conservationMode, setConservationMode] = useState<any>({});

  useEffect(() => {
    const updateData = () => {
      const dashboardData = freeTierMonitor.getDashboardData();
      
      // Flatten usage data
      const flattenedUsage: UsageData[] = [];
      Object.keys(dashboardData.usage).forEach(service => {
        Object.keys(dashboardData.usage[service]).forEach(resource => {
          const data = dashboardData.usage[service][resource];
          flattenedUsage.push({
            service,
            resource,
            ...data,
          });
        });
      });
      
      setUsageData(flattenedUsage);
      setNotifications(dashboardData.notifications.slice(-10)); // Last 10 notifications
      setConservationMode(dashboardData.conservationMode);
    };

    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return 'text-red-600 bg-red-50';
    if (percentage >= 90) return 'text-orange-600 bg-orange-50';
    if (percentage >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-red-500';
    if (percentage >= 90) return 'bg-orange-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatValue = (value: number, resource: string) => {
    if (value === Infinity) return '∞';
    
    if (resource === 'bandwidth' || resource === 'functions' || resource === 'storage') {
      // Convert bytes to readable format
      if (value >= 1024 * 1024 * 1024) {
        return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
      if (value >= 1024 * 1024) {
        return `${(value / (1024 * 1024)).toFixed(2)} MB`;
      }
      if (value >= 1024) {
        return `${(value / 1024).toFixed(2)} KB`;
      }
      return `${value} B`;
    }
    
    return value.toLocaleString();
  };

  const canUseAI = freeTierMonitor.canUseAI();
  const remainingAI = freeTierMonitor.getRemainingAIRequests();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Recursos Gratuitos</h2>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            Object.values(conservationMode).some(Boolean) 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {Object.values(conservationMode).some(Boolean) ? 'Modo Conservación' : 'Normal'}
          </span>
        </div>
      </div>

      {/* AI Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Estado de IA (Gemini)</span>
            <span className={`px-2 py-1 rounded text-sm ${
              canUseAI ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {canUseAI ? 'Disponible' : 'Limitado'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {remainingAI} requests restantes hoy
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {canUseAI 
              ? 'Puedes seguir generando workouts y recetas'
              : 'Límite diario alcanzado. Reinicia mañana.'
            }
          </p>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usageData.map((item) => (
          <Card key={`${item.service}-${item.resource}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {item.service} - {item.resource.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usado: {formatValue(item.current, item.resource)}</span>
                  <span>Límite: {formatValue(item.limit, item.resource)}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(item.percentage)}`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
                
                <div className={`text-right text-sm font-medium px-2 py-1 rounded ${getStatusColor(item.percentage)}`}>
                  {item.percentage.toFixed(1)}%
                </div>
                
                {item.remaining !== Infinity && (
                  <div className="text-xs text-gray-500">
                    Restante: {formatValue(item.remaining, item.resource)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conservation Mode Status */}
      {Object.values(conservationMode).some(Boolean) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Modo Conservación Activo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conservationMode.aiRateLimit && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Límite de IA reducido a 2 requests/día</span>
                </div>
              )}
              {conservationMode.aiDisabled && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Funciones de IA temporalmente deshabilitadas</span>
                </div>
              )}
              {conservationMode.maxCompression && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Compresión máxima activada</span>
                </div>
              )}
              {conservationMode.readOnlyMode && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Modo solo lectura activado</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.level === 'danger' ? 'border-red-500 bg-red-50' :
                    notification.level === 'critical' ? 'border-orange-500 bg-orange-50' :
                    'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {notification.service} - {notification.resource}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">
                        {notification.percentage.toFixed(1)}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips for Optimization */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Consejos para Optimizar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Para reducir uso de IA:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Guarda workouts favoritos</li>
                <li>• Reutiliza recetas generadas</li>
                <li>• Usa análisis en batch</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Para optimizar bandwidth:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Usa la aplicación como PWA</li>
                <li>• Aprovecha el cache offline</li>
                <li>• Minimiza recargas de página</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeTierDashboard;