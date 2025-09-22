/**
 * Universal Device Dashboard
 * Comprehensive visualization of all connected devices and their data
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { 
  Activity, Wifi, Battery, Zap, Thermometer, Droplets, Wind, 
  Eye, Camera, BarChart3, Settings, RefreshCw, AlertTriangle,
  CheckCircle, XCircle, Signal
} from 'lucide-react';
import { universalDeviceIntegrationService, UniversalDeviceData } from '../lib/universal-device-integration-service';
import type { DeviceIntegrationStats } from '../lib/universal-device-integration-service';

interface DeviceDashboardProps {
  userId: string;
  onDeviceRegistered?: (device: UniversalDeviceData) => void;
  onDeviceDataUpdate?: (device: UniversalDeviceData) => void;
}

const UniversalDeviceDashboard: React.FC<DeviceDashboardProps> = ({
  userId,
  onDeviceRegistered,
  onDeviceDataUpdate
}) => {
  const [devices, setDevices] = useState<UniversalDeviceData[]>([]);
  const [stats, setStats] = useState<DeviceIntegrationStats>({
    totalDevices: 0,
    connectedDevices: 0,
    dataPointsProcessed: 0,
    lastSync: null,
    averageQuality: 0,
    errorCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load devices and stats
  const loadDevicesAndStats = useCallback(() => {
    try {
      const deviceList = universalDeviceIntegrationService.getDevices();
      const serviceStats = universalDeviceIntegrationService.getStats();
      
      setDevices(deviceList);
      setStats(serviceStats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading devices:', error);
      setIsLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    setRefreshing(true);
    loadDevicesAndStats();
    setTimeout(() => setRefreshing(false), 1000);
  }, [loadDevicesAndStats]);

  // Initialize dashboard
  useEffect(() => {
    loadDevicesAndStats();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadDevicesAndStats();
    }, 5000); // Refresh every 5 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, [loadDevicesAndStats]);

  // Register a sample device for demonstration
  const registerSampleDevice = () => {
    const sampleDevices: Omit<UniversalDeviceData, 'timestamp'>[] = [
      {
        deviceId: `smartwatch-${Date.now()}`,
        deviceName: 'Apple Watch Series 8',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {
          heartRate: 72,
          steps: 8432,
          calories: 2100,
          sleep: {
            duration: 480,
            quality: 87
          }
        },
        processedData: {
          heartRate: 72,
          steps: 8432,
          calories: 2100
        },
        qualityMetrics: {
          signalStrength: 92,
          dataCompleteness: 98,
          synchronizationQuality: 'excellent',
          batteryLevel: 78
        },
        metadata: {
          manufacturer: 'Apple',
          model: 'Series 8',
          firmwareVersion: '9.1',
          capabilities: ['heart_rate', 'steps', 'calories', 'sleep_tracking', 'gps']
        }
      },
      {
        deviceId: `force-plate-${Date.now()}`,
        deviceName: 'SPARTAN Force Plate Pro',
        deviceType: 'force_sensor',
        protocol: 'usb',
        rawData: {
          force: {
            x: 180,
            y: 95,
            z: 750
          },
          pressureDistribution: [0.2, 0.3, 0.25, 0.25]
        },
        processedData: {
          totalForce: 775,
          balanceScore: 85
        },
        qualityMetrics: {
          signalStrength: 98,
          dataCompleteness: 100,
          synchronizationQuality: 'excellent',
          batteryLevel: 100
        },
        metadata: {
          manufacturer: 'SPARTAN Fitness',
          model: 'Force Plate Pro',
          firmwareVersion: '2.3',
          capabilities: ['force_measurement', 'balance_analysis', 'pressure_mapping']
        }
      },
      {
        deviceId: `emg-sensor-${Date.now()}`,
        deviceName: 'Delsys Trigno EMG',
        deviceType: 'emg_sensor',
        protocol: 'wifi',
        rawData: {
          muscleActivity: {
            quadriceps: 75,
            hamstrings: 68,
            glutes: 82,
            calves: 60
          }
        },
        processedData: {
          muscleActivation: {
            quadriceps: 75,
            hamstrings: 68,
            glutes: 82,
            calves: 60
          },
          fatigueLevel: 25
        },
        qualityMetrics: {
          signalStrength: 88,
          dataCompleteness: 94,
          synchronizationQuality: 'good',
          batteryLevel: 92
        },
        metadata: {
          manufacturer: 'Delsys',
          model: 'Trigno',
          firmwareVersion: '4.1',
          capabilities: ['emg_measurement', 'muscle_activation', 'fatigue_monitoring']
        }
      }
    ];

    // Register a random sample device
    const randomDevice = sampleDevices[Math.floor(Math.random() * sampleDevices.length)];
    universalDeviceIntegrationService.registerDevice(randomDevice);
    
    if (onDeviceRegistered) {
      // @ts-ignore - timestamp will be added by the service
      onDeviceRegistered(randomDevice);
    }
    
    refreshData();
  };

  // Get device icon based on device type
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'wearable':
        return <Activity className="h-5 w-5" />;
      case 'smart_equipment':
        return <Settings className="h-5 w-5" />;
      case 'environmental_sensor':
        return <Thermometer className="h-5 w-5" />;
      case 'biometric_sensor':
        return <Activity className="h-5 w-5" />;
      case 'force_sensor':
        return <BarChart3 className="h-5 w-5" />;
      case 'emg_sensor':
        return <Zap className="h-5 w-5" />;
      case 'imu_sensor':
        return <Wind className="h-5 w-5" />;
      case 'camera_system':
        return <Camera className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  // Get quality color based on quality score
  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-500';
    if (quality >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get synchronization quality color
  const getSynchronizationColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading device data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-2xl font-bold">{stats.totalDevices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold">{stats.connectedDevices}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Data Points</p>
                <p className="text-2xl font-bold">{stats.dataPointsProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                <p className={`text-2xl font-bold ${getQualityColor(stats.averageQuality)}`}>
                  {Math.round(stats.averageQuality)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-full">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-sm font-bold">
                  {stats.lastSync 
                    ? new Date(stats.lastSync).toLocaleTimeString() 
                    : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-2xl font-bold">{stats.errorCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Connected Devices</h2>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={registerSampleDevice}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Settings className="h-4 w-4 mr-2" />
            Add Sample Device
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      {devices.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No devices connected</h3>
            <p className="text-gray-500 mb-4">
              Register devices to start collecting data from wearables, sensors, and equipment.
            </p>
            <button
              onClick={registerSampleDevice}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Register Sample Device
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <Card key={device.deviceId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-full mr-3">
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <span className="text-lg">{device.deviceName}</span>
                  </div>
                  <div className="flex items-center">
                    <Signal className={`h-4 w-4 mr-1 ${
                      device.qualityMetrics.signalStrength > 80 ? 'text-green-500' :
                      device.qualityMetrics.signalStrength > 50 ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <span className="text-sm font-medium">
                      {device.qualityMetrics.signalStrength}%
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Device ID</span>
                    <span className="text-sm font-mono">{device.deviceId.substring(0, 8)}...</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium capitalize">{device.deviceType.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Protocol</span>
                    <span className="text-sm font-medium uppercase">{device.protocol}</span>
                  </div>
                  
                  {device.qualityMetrics.batteryLevel !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Battery</span>
                      <div className="flex items-center">
                        <Battery className="h-4 w-4 mr-1 text-gray-600" />
                        <span className="text-sm font-medium">{device.qualityMetrics.batteryLevel}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Quality</span>
                    <span className={`text-sm font-medium ${getQualityColor(device.qualityMetrics.dataCompleteness)}`}>
                      {device.qualityMetrics.dataCompleteness}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sync Quality</span>
                    <span className={`text-sm font-medium ${getSynchronizationColor(device.qualityMetrics.synchronizationQuality)}`}>
                      {device.qualityMetrics.synchronizationQuality}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Update</span>
                    <span className="text-sm">
                      {device.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Capabilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {device.metadata.capabilities.map((capability, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {capability.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversalDeviceDashboard;