import { storageManager } from './storage';
import { wearableIntegrationService } from './wearable-integration-service';
import { iotIntegrationService } from './iot-integration-service';
import { spartanNervousSystem } from './spartan-nervous-system';
import { realTimeDataIntegrationService } from './real-time-data-integration';
import { logger } from './logger';
import type { 
  WearableData,
  WearableInsights
} from './wearable-integration-service';
import type { 
  EquipmentData,
  EnvironmentalData,
  EnhancedWearableData
} from './iot-integration-service';
import type { DataEvent } from './real-time-data-integration';

// Universal device types
export type UniversalDeviceType = 
  | 'wearable'
  | 'smart_equipment'
  | 'environmental_sensor'
  | 'biometric_sensor'
  | 'force_sensor'
  | 'emg_sensor'
  | 'imu_sensor'
  | 'camera_system'
  | 'custom_device';

// Universal device connection protocols
export type DeviceConnectionProtocol = 
  | 'bluetooth'
  | 'wifi'
  | 'usb'
  | 'serial'
  | 'mqtt'
  | 'websocket'
  | 'http'
  | 'custom';

// Universal device data format
export interface UniversalDeviceData {
  deviceId: string;
  deviceName: string;
  deviceType: UniversalDeviceType;
  protocol: DeviceConnectionProtocol;
  timestamp: Date;
  rawData: any;
  processedData: any;
  qualityMetrics: {
    signalStrength: number; // 0-100
    dataCompleteness: number; // 0-100
    synchronizationQuality: 'excellent' | 'good' | 'fair' | 'poor';
    batteryLevel?: number; // 0-100
  };
  metadata: {
    firmwareVersion?: string;
    manufacturer?: string;
    model?: string;
    capabilities: string[];
  };
}

// Device integration configuration
export interface DeviceIntegrationConfig {
  autoDiscovery: boolean;
  dataSyncInterval: number; // milliseconds
  qualityThreshold: number; // 0-100, minimum quality to process data
  retryAttempts: number;
  fallbackProtocols: DeviceConnectionProtocol[];
}

// Device integration statistics
export interface DeviceIntegrationStats {
  totalDevices: number;
  connectedDevices: number;
  dataPointsProcessed: number;
  lastSync: Date | null;
  averageQuality: number;
  errorCount: number;
}

export class UniversalDeviceIntegrationService {
  private static instance: UniversalDeviceIntegrationService;
  private devices: Map<string, UniversalDeviceData>;
  private config: DeviceIntegrationConfig;
  private stats: DeviceIntegrationStats;
  private integrationInterval: NodeJS.Timeout | null = null;
  
  static getInstance(): UniversalDeviceIntegrationService {
    if (!UniversalDeviceIntegrationService.instance) {
      UniversalDeviceIntegrationService.instance = new UniversalDeviceIntegrationService();
    }
    return UniversalDeviceIntegrationService.instance;
  }
  
  constructor() {
    this.devices = new Map();
    this.config = {
      autoDiscovery: true,
      dataSyncInterval: 5000, // 5 seconds
      qualityThreshold: 70,
      retryAttempts: 3,
      fallbackProtocols: ['bluetooth', 'wifi', 'usb']
    };
    this.stats = {
      totalDevices: 0,
      connectedDevices: 0,
      dataPointsProcessed: 0,
      lastSync: null,
      averageQuality: 0,
      errorCount: 0
    };
    
    // Start integration process
    this.startIntegrationProcess();
  }
  
  /**
   * Configure device integration settings
   */
  configure(config: Partial<DeviceIntegrationConfig>): void {
    this.config = { ...this.config, ...config };
    logger.info('UniversalDeviceIntegrationService: Configuration updated', this.config);
  }
  
  /**
   * Register a new device
   */
  registerDevice(deviceData: Omit<UniversalDeviceData, 'timestamp'>): void {
    const device: UniversalDeviceData = {
      ...deviceData,
      timestamp: new Date()
    };
    
    this.devices.set(device.deviceId, device);
    this.stats.totalDevices = this.devices.size;
    this.stats.connectedDevices = Array.from(this.devices.values()).filter(d => d.qualityMetrics.signalStrength > 0).length;
    
    logger.info(`UniversalDeviceIntegrationService: Device registered - ${device.deviceName} (${device.deviceId})`);
    
    // Notify the nervous system of new device registration
    spartanNervousSystem.emitEvent({
      type: 'equipment_registered',
      timestamp: new Date(),
      userId: 'current_user', // Would be dynamic in real implementation
      payload: {
        device
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'medium'
    });
  }
  
  /**
   * Update device data
   */
  updateDeviceData(deviceId: string, data: Partial<UniversalDeviceData>): void {
    const device = this.devices.get(deviceId);
    if (device) {
      const updatedDevice = { ...device, ...data, timestamp: new Date() };
      this.devices.set(deviceId, updatedDevice);
      
      // Process the updated data
      this.processDeviceData(updatedDevice);
      
      // Update stats
      this.updateStats();
    }
  }
  
  /**
   * Process device data and generate insights
   */
  private processDeviceData(device: UniversalDeviceData): void {
    // Check data quality
    if (device.qualityMetrics.dataCompleteness < this.config.qualityThreshold) {
      logger.warn(`UniversalDeviceIntegrationService: Low quality data from ${device.deviceName} (${device.deviceId})`);
      return;
    }
    
    try {
      // Route data to appropriate processing service based on device type
      switch (device.deviceType) {
        case 'wearable':
          this.processWearableData(device);
          break;
        case 'smart_equipment':
          this.processSmartEquipmentData(device);
          break;
        case 'environmental_sensor':
          this.processEnvironmentalSensorData(device);
          break;
        case 'biometric_sensor':
          this.processBiometricSensorData(device);
          break;
        case 'force_sensor':
          this.processForceSensorData(device);
          break;
        case 'emg_sensor':
          this.processEmgSensorData(device);
          break;
        case 'imu_sensor':
          this.processImuSensorData(device);
          break;
        case 'camera_system':
          this.processCameraSystemData(device);
          break;
        default:
          this.processCustomDeviceData(device);
          break;
      }
      
      // Update stats
      this.stats.dataPointsProcessed++;
      this.stats.lastSync = new Date();
      
      // Emit data updated event
      realTimeDataIntegrationService.emitEvent({
        type: 'biometric_data_received',
        timestamp: new Date(),
        userId: 'current_user', // Would be dynamic in real implementation
        payload: device,
        sourceModule: 'UniversalDeviceIntegrationService',
        priority: 'high'
      });
      
    } catch (error) {
      logger.error(`UniversalDeviceIntegrationService: Error processing data from ${device.deviceName}`, error);
      this.stats.errorCount++;
    }
  }
  
  /**
   * Process wearable device data
   */
  private processWearableData(device: UniversalDeviceData): void {
    // Convert universal device data to wearable data format
    const wearableData: WearableData = this.convertToWearableData(device);
    
    // Process with existing wearable integration service
    const insights = wearableIntegrationService.processWearableData('current_user', wearableData);
    
    // Emit insights to nervous system
    spartanNervousSystem.emitEvent({
      type: 'insight_generated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'wearable_insights',
        data: insights
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process smart equipment data
   */
  private processSmartEquipmentData(device: UniversalDeviceData): void {
    // Convert to equipment data format
    const equipmentData: EquipmentData = this.convertToEquipmentData(device);
    
    // Register with IoT integration service
    iotIntegrationService.registerEquipment(equipmentData);
    
    // Update equipment data
    iotIntegrationService.updateEquipmentData(device.deviceId, equipmentData);
  }
  
  /**
   * Process environmental sensor data
   */
  private processEnvironmentalSensorData(device: UniversalDeviceData): void {
    // Convert to environmental data format
    const environmentalData: EnvironmentalData = this.convertToEnvironmentalData(device);
    
    // Process with IoT integration service
    iotIntegrationService.processEnvironmentalData(environmentalData);
  }
  
  /**
   * Process biometric sensor data
   */
  private processBiometricSensorData(device: UniversalDeviceData): void {
    // For biometric sensors, we treat them similar to wearables
    const wearableData: WearableData = this.convertToWearableData(device);
    
    // Process with existing wearable integration service
    const insights = wearableIntegrationService.processWearableData('current_user', wearableData);
    
    // Emit insights to nervous system
    spartanNervousSystem.emitEvent({
      type: 'insight_generated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'biometric_insights',
        data: insights
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process force sensor data
   */
  private processForceSensorData(device: UniversalDeviceData): void {
    // Extract force data
    const forceData = device.rawData.force || device.rawData;
    
    // Emit force data to nervous system
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'force_data',
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        data: forceData,
        timestamp: device.timestamp
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process EMG sensor data
   */
  private processEmgSensorData(device: UniversalDeviceData): void {
    // Extract EMG data
    const emgData = device.rawData.emg || device.rawData;
    
    // Emit EMG data to nervous system
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'emg_data',
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        data: emgData,
        timestamp: device.timestamp
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process IMU sensor data
   */
  private processImuSensorData(device: UniversalDeviceData): void {
    // Extract IMU data
    const imuData = device.rawData.imu || device.rawData;
    
    // Emit IMU data to nervous system
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'imu_data',
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        data: imuData,
        timestamp: device.timestamp
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process camera system data
   */
  private processCameraSystemData(device: UniversalDeviceData): void {
    // Extract camera/visual data
    const cameraData = device.rawData.camera || device.rawData;
    
    // Emit camera data to nervous system
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'camera_data',
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        data: cameraData,
        timestamp: device.timestamp
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'high'
    });
  }
  
  /**
   * Process custom device data
   */
  private processCustomDeviceData(device: UniversalDeviceData): void {
    // Emit custom device data to nervous system
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'custom_device_data',
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        data: device.rawData,
        timestamp: device.timestamp
      },
      sourceModule: 'UniversalDeviceIntegrationService',
      priority: 'medium'
    });
  }
  
  /**
   * Convert universal device data to wearable data format
   */
  private convertToWearableData(device: UniversalDeviceData): WearableData {
    // This is a simplified conversion - in a real implementation,
    // this would depend on the specific device data structure
    return {
      source: 'garmin', // Default to Garmin, would be dynamic
      sleep: {
        duration: device.rawData.sleep?.duration || 480,
        quality: device.rawData.sleep?.quality || 80,
        deepSleep: device.rawData.sleep?.deepSleep || 120,
        remSleep: device.rawData.sleep?.remSleep || 90,
        lightSleep: device.rawData.sleep?.lightSleep || 270,
        wakeTimes: device.rawData.sleep?.wakeTimes || 1,
        bedtime: device.rawData.sleep?.bedtime || '22:00',
        wakeTime: device.rawData.sleep?.wakeTime || '06:00',
        sleepEfficiency: device.rawData.sleep?.sleepEfficiency || 90,
        sleepLatency: device.rawData.sleep?.sleepLatency || 15
      },
      activity: {
        steps: device.rawData.activity?.steps || 8000,
        calories: device.rawData.activity?.calories || 2200,
        activeMinutes: device.rawData.activity?.activeMinutes || 90,
        vo2max: device.rawData.activity?.vo2max || 50,
        trainingLoad: device.rawData.activity?.trainingLoad || 50,
        lactateThreshold: device.rawData.activity?.lactateThreshold || 160,
        maxHeartRate: device.rawData.activity?.maxHeartRate || 180,
        zones: device.rawData.activity?.zones || {
          zone1: 30,
          zone2: 35,
          zone3: 15,
          zone4: 5,
          zone5: 0
        }
      },
      recovery: {
        hrv: device.rawData.recovery?.hrv || 60,
        restingHeartRate: device.rawData.recovery?.restingHeartRate || 55,
        stress: device.rawData.recovery?.stress || 40,
        recoveryScore: device.rawData.recovery?.recoveryScore || 75,
        autonomicBalance: device.rawData.recovery?.autonomicBalance || 1.2,
        readiness: device.rawData.recovery?.readiness
      },
      vitals: {
        bloodPressure: device.rawData.vitals?.bloodPressure || {
          systolic: 120,
          diastolic: 80,
          pulse: 60,
          timestamp: new Date().toISOString()
        },
        glucose: device.rawData.vitals?.glucose || {
          current: 90,
          average24h: 95,
          timeInRange: 85,
          variability: 10,
          timestamp: new Date().toISOString()
        },
        temperature: device.rawData.vitals?.temperature || {
          body: 36.7,
          skin: 33.2,
          variance: 0.3
        },
        hydration: device.rawData.vitals?.hydration || {
          level: 80,
          electrolytes: {
            sodium: 140,
            potassium: 4.0,
            magnesium: 2.0
          }
        },
        inflammation: device.rawData.vitals?.inflammation || {
          crp: 0.8,
          il6: 1.2,
          score: 85
        }
      },
      performance: {
        fitnessAge: device.rawData.performance?.fitnessAge || 30,
        recoveryTime: device.rawData.performance?.recoveryTime || 24,
        trainingReadiness: device.rawData.performance?.trainingReadiness || 80,
        metabolicEfficiency: device.rawData.performance?.metabolicEfficiency || 75,
        powerOutput: device.rawData.performance?.powerOutput || {
          ftp: 250,
          critical: 280,
          anaerobic: 400
        },
        cognitiveLoad: device.rawData.performance?.cognitiveLoad || 45
      },
      lastSync: new Date().toISOString()
    };
  }
  
  /**
   * Convert universal device data to equipment data format
   */
  private convertToEquipmentData(device: UniversalDeviceData): EquipmentData {
    return {
      id: device.deviceId,
      name: device.deviceName,
      type: 'other', // Default to other, would be dynamic
      connected: device.qualityMetrics.signalStrength > 0,
      lastSync: device.timestamp.toISOString(),
      batteryLevel: device.qualityMetrics.batteryLevel,
      firmwareVersion: device.metadata.firmwareVersion,
      capabilities: device.metadata.capabilities,
      metrics: device.rawData.metrics || {}
    };
  }
  
  /**
   * Convert universal device data to environmental data format
   */
  private convertToEnvironmentalData(device: UniversalDeviceData): EnvironmentalData {
    return {
      timestamp: device.timestamp.toISOString(),
      sensors: device.rawData.sensors || [],
      airQualityIndex: device.rawData.airQualityIndex,
      comfortLevel: device.rawData.comfortLevel
    };
  }
  
  /**
   * Start the integration process
   */
  private startIntegrationProcess(): void {
    this.integrationInterval = setInterval(() => {
      this.performIntegrationCycle();
    }, this.config.dataSyncInterval);
    
    logger.info('UniversalDeviceIntegrationService: Integration process started');
  }
  
  /**
   * Perform a single integration cycle
   */
  private performIntegrationCycle(): void {
    // In a real implementation, this would:
    // 1. Discover new devices if autoDiscovery is enabled
    // 2. Sync data from all connected devices
    // 3. Process and analyze the data
    // 4. Generate insights and recommendations
    // 5. Update the system with new information
    
    // For now, we'll just log that a cycle is happening
    logger.debug('UniversalDeviceIntegrationService: Integration cycle performed');
  }
  
  /**
   * Update service statistics
   */
  private updateStats(): void {
    const devices = Array.from(this.devices.values());
    if (devices.length > 0) {
      const totalQuality = devices.reduce((sum, device) => sum + device.qualityMetrics.dataCompleteness, 0);
      this.stats.averageQuality = totalQuality / devices.length;
    }
    this.stats.connectedDevices = devices.filter(d => d.qualityMetrics.signalStrength > 0).length;
  }
  
  /**
   * Get current device integration statistics
   */
  getStats(): DeviceIntegrationStats {
    return { ...this.stats };
  }
  
  /**
   * Get all registered devices
   */
  getDevices(): UniversalDeviceData[] {
    return Array.from(this.devices.values());
  }
  
  /**
   * Get a specific device by ID
   */
  getDevice(deviceId: string): UniversalDeviceData | undefined {
    return this.devices.get(deviceId);
  }
  
  /**
   * Remove a device
   */
  removeDevice(deviceId: string): void {
    this.devices.delete(deviceId);
    this.stats.totalDevices = this.devices.size;
    this.updateStats();
    logger.info(`UniversalDeviceIntegrationService: Device removed (${deviceId})`);
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.integrationInterval) {
      clearInterval(this.integrationInterval);
      this.integrationInterval = null;
    }
    logger.info('UniversalDeviceIntegrationService: Service cleaned up');
  }
}

// Export singleton instance
export const universalDeviceIntegrationService = UniversalDeviceIntegrationService.getInstance();