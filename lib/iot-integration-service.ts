import { storageManager } from './storage';
import { wearableIntegrationService } from './wearable-integration-service';
import { spartanNervousSystem } from './spartan-nervous-system';
import type { 
  WearableData,
  WearableInsights
} from './wearable-integration-service';

// Types for IoT equipment integration
export type EquipmentType = 'resistance_band' | 'smart_mat' | 'smart_gym' | 'other';

export type EquipmentData = {
  id: string;
  name: string;
  type: EquipmentType;
  connected: boolean;
  lastSync: string;
  batteryLevel?: number;
  firmwareVersion?: string;
  capabilities: string[];
  metrics: {
    [key: string]: number | string | boolean;
  };
};

// Types for environmental sensors
export type EnvironmentalSensorType = 'temperature' | 'humidity' | 'air_quality' | 'pressure' | 'light';

export type EnvironmentalData = {
  timestamp: string;
  sensors: {
    type: EnvironmentalSensorType;
    value: number;
    unit: string;
    location?: string;
    quality?: 'good' | 'fair' | 'poor';
  }[];
  airQualityIndex?: number;
  comfortLevel?: 'comfortable' | 'uncomfortable' | 'extreme';
};

// Types for enhanced wearable synchronization
export type EnhancedWearableData = {
  standardData: WearableData;
  additionalMetrics: {
    muscleOxygen?: number; // %
    lactate?: number; // mmol/L
    bodyTemperature?: number; // Celsius
    gsr?: number; // Galvanic Skin Response
    emg?: number; // Electromyography
    eeg?: number; // Electroencephalography
    posture?: {
      angle: number;
      position: 'upright' | 'slouched' | 'leaning';
    };
  };
  synchronizationQuality: 'excellent' | 'good' | 'fair' | 'poor';
  dataCompleteness: number; // 0-100%
};

export type IoTInsights = {
  equipmentStatus: {
    connected: number;
    total: number;
    issues: string[];
  };
  environmentalConditions: {
    temperature: number;
    humidity: number;
    airQuality: number;
    recommendations: string[];
  };
  enhancedRecovery: {
    muscleOxygenStatus: 'optimal' | 'good' | 'concern';
    hydrationStatus: 'optimal' | 'good' | 'concern';
    thermalStatus: 'optimal' | 'good' | 'concern';
  };
  synchronizationQuality: 'excellent' | 'good' | 'fair' | 'poor';
};

export class IoTIntegrationService {
  private static instance: IoTIntegrationService;
  private connectedEquipment: Map<string, EquipmentData>;
  private environmentalData: EnvironmentalData | null;
  private enhancedWearableData: EnhancedWearableData | null;
  
  static getInstance(): IoTIntegrationService {
    if (!IoTIntegrationService.instance) {
      IoTIntegrationService.instance = new IoTIntegrationService();
    }
    return IoTIntegrationService.instance;
  }
  
  constructor() {
    this.connectedEquipment = new Map();
    this.environmentalData = null;
    this.enhancedWearableData = null;
  }
  
  /**
   * Register a new smart equipment device
   */
  registerEquipment(equipment: EquipmentData): void {
    console.log('🔌 Registering new equipment:', equipment.name);
    this.connectedEquipment.set(equipment.id, equipment);
    
    // Notify the nervous system of new equipment
    spartanNervousSystem.emitEvent({
      type: 'equipment_registered',
      timestamp: new Date(),
      userId: '', // Will be set by the caller
      payload: {
        equipment
      },
      sourceModule: 'IoTIntegrationService',
      priority: 'medium'
    });
  }
  
  /**
   * Update equipment data
   */
  updateEquipmentData(equipmentId: string, data: Partial<EquipmentData>): void {
    const equipment = this.connectedEquipment.get(equipmentId);
    if (equipment) {
      const updatedEquipment = { ...equipment, ...data };
      this.connectedEquipment.set(equipmentId, updatedEquipment);
      
      // Check for any issues
      const issues = this.checkEquipmentIssues(updatedEquipment);
      if (issues.length > 0) {
        spartanNervousSystem.emitEvent({
          type: 'equipment_issue',
          timestamp: new Date(),
          userId: '', // Will be set by the caller
          payload: {
            equipmentId,
            issues
          },
          sourceModule: 'IoTIntegrationService',
          priority: 'high'
        });
      }
    }
  }
  
  /**
   * Check for equipment issues
   */
  private checkEquipmentIssues(equipment: EquipmentData): string[] {
    const issues: string[] = [];
    
    if (equipment.batteryLevel !== undefined && equipment.batteryLevel < 20) {
      issues.push(`Low battery on ${equipment.name} (${equipment.batteryLevel}%)`);
    }
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastSync = new Date(equipment.lastSync);
    if (lastSync < oneHourAgo) {
      issues.push(`${equipment.name} not synced recently`);
    }
    
    return issues;
  }
  
  /**
   * Process environmental sensor data
   */
  processEnvironmentalData(data: EnvironmentalData): void {
    console.log('🌡️ Processing environmental data');
    this.environmentalData = data;
    
    // Store environmental data
    storageManager.setEnvironmentalData(data);
    
    // Notify the nervous system of environmental update
    spartanNervousSystem.emitEvent({
      type: 'environmental_data_updated',
      timestamp: new Date(),
      userId: '', // Will be set by the caller
      payload: {
        data
      },
      sourceModule: 'IoTIntegrationService',
      priority: 'medium'
    });
  }
  
  /**
   * Process enhanced wearable data
   */
  processEnhancedWearableData(userId: string, data: EnhancedWearableData): WearableInsights {
    console.log('⌚ Processing enhanced wearable data');
    this.enhancedWearableData = data;
    
    // Combine standard wearable data with enhanced metrics
    const combinedData = {
      ...data.standardData,
      // Add enhanced metrics to vitals if they exist
      vitals: {
        ...data.standardData.vitals,
        ...(data.additionalMetrics.muscleOxygen !== undefined && {
          muscleOxygen: data.additionalMetrics.muscleOxygen
        }),
        ...(data.additionalMetrics.bodyTemperature !== undefined && {
          bodyTemperature: data.additionalMetrics.bodyTemperature
        })
      }
    };
    
    // Process with existing wearable integration service
    const insights = wearableIntegrationService.processWearableData(userId, combinedData);
    
    // Add enhanced recovery insights
    const enhancedInsights = this.generateEnhancedRecoveryInsights(data);
    
    // Store enhanced data
    storageManager.setEnhancedWearableData(data);
    
    // Notify the nervous system of enhanced wearable update
    spartanNervousSystem.emitEvent({
      type: 'enhanced_wearable_data_updated',
      timestamp: new Date(),
      userId: userId,
      payload: {
        data,
        insights: enhancedInsights
      },
      sourceModule: 'IoTIntegrationService',
      priority: 'high'
    });
    
    return insights;
  }
  
  /**
   * Generate enhanced recovery insights from additional metrics
   */
  private generateEnhancedRecoveryInsights(data: EnhancedWearableData): any {
    const insights: any = {};
    
    // Muscle oxygen insights
    if (data.additionalMetrics.muscleOxygen !== undefined) {
      insights.muscleOxygenStatus = data.additionalMetrics.muscleOxygen > 60 ? 'optimal' : 
                                  data.additionalMetrics.muscleOxygen > 50 ? 'good' : 'concern';
    }
    
    // Hydration insights (from existing data)
    if (data.standardData.vitals.hydration) {
      insights.hydrationStatus = data.standardData.vitals.hydration.level > 85 ? 'optimal' : 
                                data.standardData.vitals.hydration.level > 70 ? 'good' : 'concern';
    }
    
    // Thermal insights
    if (data.additionalMetrics.bodyTemperature !== undefined) {
      insights.thermalStatus = data.additionalMetrics.bodyTemperature >= 36.1 && 
                              data.additionalMetrics.bodyTemperature <= 37.2 ? 'optimal' : 
                              data.additionalMetrics.bodyTemperature >= 35.5 && 
                              data.additionalMetrics.bodyTemperature <= 37.8 ? 'good' : 'concern';
    }
    
    return insights;
  }
  
  /**
   * Generate comprehensive IoT insights
   */
  generateIoTInsights(): IoTInsights {
    // Equipment status
    const allEquipment = Array.from(this.connectedEquipment.values());
    const connectedEquipment = allEquipment.filter(e => e.connected);
    const equipmentIssues: string[] = [];
    
    connectedEquipment.forEach(equipment => {
      const issues = this.checkEquipmentIssues(equipment);
      equipmentIssues.push(...issues);
    });
    
    const equipmentStatus = {
      connected: connectedEquipment.length,
      total: allEquipment.length,
      issues: equipmentIssues
    };
    
    // Environmental conditions
    const environmentalConditions = {
      temperature: 0,
      humidity: 0,
      airQuality: 0,
      recommendations: [] as string[]
    };
    
    if (this.environmentalData) {
      // Get average values from all sensors
      const tempSensors = this.environmentalData.sensors.filter(s => s.type === 'temperature');
      const humiditySensors = this.environmentalData.sensors.filter(s => s.type === 'humidity');
      const airQualitySensors = this.environmentalData.sensors.filter(s => s.type === 'air_quality');
      
      if (tempSensors.length > 0) {
        const avgTemp = tempSensors.reduce((sum, s) => sum + (typeof s.value === 'number' ? s.value : 0), 0) / tempSensors.length;
        environmentalConditions.temperature = Math.round(avgTemp * 10) / 10;
      }
      
      if (humiditySensors.length > 0) {
        const avgHumidity = humiditySensors.reduce((sum, s) => sum + (typeof s.value === 'number' ? s.value : 0), 0) / humiditySensors.length;
        environmentalConditions.humidity = Math.round(avgHumidity * 10) / 10;
      }
      
      if (airQualitySensors.length > 0) {
        const avgAirQuality = airQualitySensors.reduce((sum, s) => sum + (typeof s.value === 'number' ? s.value : 0), 0) / airQualitySensors.length;
        environmentalConditions.airQuality = Math.round(avgAirQuality * 10) / 10;
      }
      
      // Generate environmental recommendations
      if (environmentalConditions.temperature < 18 || environmentalConditions.temperature > 24) {
        environmentalConditions.recommendations.push('Temperature outside optimal range for training (18-24°C)');
      }
      
      if (environmentalConditions.humidity < 40 || environmentalConditions.humidity > 60) {
        environmentalConditions.recommendations.push('Humidity outside optimal range for training (40-60%)');
      }
      
      if (environmentalConditions.airQuality < 50) {
        environmentalConditions.recommendations.push('Poor air quality may affect performance');
      }
    }
    
    // Enhanced recovery insights
    const enhancedRecovery = {
      muscleOxygenStatus: 'optimal' as 'optimal' | 'good' | 'concern',
      hydrationStatus: 'optimal' as 'optimal' | 'good' | 'concern',
      thermalStatus: 'optimal' as 'optimal' | 'good' | 'concern'
    };
    
    if (this.enhancedWearableData) {
      const enhancedInsights = this.generateEnhancedRecoveryInsights(this.enhancedWearableData);
      Object.assign(enhancedRecovery, enhancedInsights);
    }
    
    // Synchronization quality
    let synchronizationQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    if (this.enhancedWearableData) {
      synchronizationQuality = this.enhancedWearableData.synchronizationQuality;
    }
    
    return {
      equipmentStatus,
      environmentalConditions,
      enhancedRecovery,
      synchronizationQuality
    };
  }
  
  /**
   * Get all connected equipment
   */
  getConnectedEquipment(): EquipmentData[] {
    return Array.from(this.connectedEquipment.values()).filter(e => e.connected);
  }
  
  /**
   * Get environmental data
   */
  getEnvironmentalData(): EnvironmentalData | null {
    return this.environmentalData;
  }
  
  /**
   * Get enhanced wearable data
   */
  getEnhancedWearableData(): EnhancedWearableData | null {
    return this.enhancedWearableData;
  }
}

export const iotIntegrationService = IoTIntegrationService.getInstance();