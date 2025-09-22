import { iotIntegrationService, EquipmentData, EnvironmentalData, EnhancedWearableData } from '../lib/iot-integration-service';
import { wearableIntegrationService } from '../lib/wearable-integration-service';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    setEnvironmentalData: jest.fn(),
    setEnhancedWearableData: jest.fn(),
    getEnvironmentalData: jest.fn(),
    getEnhancedWearableData: jest.fn(),
    getRecoveryMetricsForDate: jest.fn(),
    addRecoveryMetric: jest.fn()
  }
}));

// Mock the wearable integration service
jest.mock('../lib/wearable-integration-service', () => ({
  wearableIntegrationService: {
    processWearableData: jest.fn().mockReturnValue({
      recoveryStatus: 'optimal',
      trainingReadiness: 'ready',
      adjustments: [],
      recommendations: [],
      riskFactors: []
    })
  }
}));

// Mock the nervous system
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    emitEvent: jest.fn()
  }
}));

describe('IoT Integration Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the singleton instance
    // @ts-ignore - accessing private property for testing
    iotIntegrationService['connectedEquipment'].clear();
    // @ts-ignore - accessing private property for testing
    iotIntegrationService['environmentalData'] = null;
    // @ts-ignore - accessing private property for testing
    iotIntegrationService['enhancedWearableData'] = null;
  });

  describe('Equipment Management', () => {
    it('should register new equipment', () => {
      const equipment: EquipmentData = {
        id: 'test-band-001',
        name: 'Smart Resistance Band',
        type: 'resistance_band',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 85,
        firmwareVersion: '1.2.3',
        capabilities: ['tension_measurement', 'reps_counting'],
        metrics: {
          tension: 50,
          reps: 10
        }
      };

      iotIntegrationService.registerEquipment(equipment);

      const connectedEquipment = iotIntegrationService.getConnectedEquipment();
      expect(connectedEquipment).toHaveLength(1);
      expect(connectedEquipment[0]).toEqual(equipment);
    });

    it('should update equipment data', () => {
      const equipment: EquipmentData = {
        id: 'test-mat-001',
        name: 'Smart Yoga Mat',
        type: 'smart_mat',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 90,
        capabilities: ['pressure_sensing', 'pose_detection'],
        metrics: {}
      };

      // Register equipment first
      iotIntegrationService.registerEquipment(equipment);

      // Update equipment data
      iotIntegrationService.updateEquipmentData('test-mat-001', {
        batteryLevel: 75,
        metrics: {
          pressure: 45,
          pose: 'downward_dog'
        }
      });

      const connectedEquipment = iotIntegrationService.getConnectedEquipment();
      expect(connectedEquipment).toHaveLength(1);
      expect(connectedEquipment[0].batteryLevel).toBe(75);
      expect(connectedEquipment[0].metrics).toEqual({
        pressure: 45,
        pose: 'downward_dog'
      });
    });

    it('should detect equipment issues', () => {
      const equipment: EquipmentData = {
        id: 'test-band-002',
        name: 'Smart Resistance Band Pro',
        type: 'resistance_band',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 15, // Low battery
        capabilities: ['tension_measurement'],
        metrics: {}
      };

      iotIntegrationService.registerEquipment(equipment);

      // Update with old sync time to trigger sync issue
      const oldSyncTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
      iotIntegrationService.updateEquipmentData('test-band-002', {
        lastSync: oldSyncTime
      });

      const insights = iotIntegrationService.generateIoTInsights();
      expect(insights.equipmentStatus.issues).toContain('Low battery on Smart Resistance Band Pro (15%)');
      expect(insights.equipmentStatus.issues).toContain('Smart Resistance Band Pro not synced recently');
    });
  });

  describe('Environmental Data Processing', () => {
    it('should process environmental data', () => {
      const environmentalData: EnvironmentalData = {
        timestamp: new Date().toISOString(),
        sensors: [
          { type: 'temperature', value: 22.5, unit: '°C', location: 'Gym' },
          { type: 'humidity', value: 45, unit: '%', location: 'Gym' },
          { type: 'air_quality', value: 85, unit: 'AQI', location: 'Gym', quality: 'good' }
        ],
        airQualityIndex: 85,
        comfortLevel: 'comfortable'
      };

      iotIntegrationService.processEnvironmentalData(environmentalData);

      const storedData = iotIntegrationService.getEnvironmentalData();
      expect(storedData).toEqual(environmentalData);
    });

    it('should generate environmental recommendations', () => {
      const environmentalData: EnvironmentalData = {
        timestamp: new Date().toISOString(),
        sensors: [
          { type: 'temperature', value: 30, unit: '°C', location: 'Gym' }, // Too hot
          { type: 'humidity', value: 70, unit: '%', location: 'Gym' }, // Too humid
          { type: 'air_quality', value: 40, unit: 'AQI', location: 'Gym', quality: 'poor' } // Poor air quality
        ],
        airQualityIndex: 40,
        comfortLevel: 'uncomfortable'
      };

      iotIntegrationService.processEnvironmentalData(environmentalData);
      const insights = iotIntegrationService.generateIoTInsights();

      expect(insights.environmentalConditions.recommendations).toContain(
        'Temperature outside optimal range for training (18-24°C)'
      );
      expect(insights.environmentalConditions.recommendations).toContain(
        'Humidity outside optimal range for training (40-60%)'
      );
      expect(insights.environmentalConditions.recommendations).toContain(
        'Poor air quality may affect performance'
      );
    });
  });

  describe('Enhanced Wearable Data Processing', () => {
    it('should process enhanced wearable data', () => {
      // Mock storage manager methods
      (require('../lib/storage').storageManager.getRecoveryMetricsForDate as jest.Mock).mockReturnValue(undefined);
      
      const userId = 'test-user-001';
      const enhancedWearableData: EnhancedWearableData = {
        standardData: {
          source: 'garmin',
          sleep: { 
            duration: 480, 
            quality: 90, 
            deepSleep: 150, 
            remSleep: 120, 
            lightSleep: 210,
            wakeTimes: 1, 
            bedtime: '22:00', 
            wakeTime: '06:00',
            sleepEfficiency: 95,
            sleepLatency: 10
          },
          activity: { 
            steps: 10000, 
            calories: 2500, 
            activeMinutes: 150, 
            vo2max: 60,
            trainingLoad: 65,
            lactateThreshold: 170,
            maxHeartRate: 190,
            zones: { zone1: 30, zone2: 45, zone3: 20, zone4: 5, zone5: 0 }
          },
          recovery: { 
            hrv: 70, 
            restingHeartRate: 45, 
            stress: 25,
            recoveryScore: 85,
            autonomicBalance: 1.5
          },
          vitals: {
            bloodPressure: {
              systolic: 115,
              diastolic: 75,
              pulse: 45,
              timestamp: new Date().toISOString()
            },
            glucose: {
              current: 90,
              average24h: 95,
              timeInRange: 90,
              variability: 10,
              timestamp: new Date().toISOString()
            },
            temperature: {
              body: 36.7,
              skin: 33.1,
              variance: 0.2
            },
            hydration: {
              level: 90,
              electrolytes: {
                sodium: 142,
                potassium: 4.3,
                magnesium: 2.2
              }
            },
            inflammation: {
              crp: 0.5,
              il6: 0.9,
              score: 92
            }
          },
          performance: {
            fitnessAge: 26,
            recoveryTime: 15,
            trainingReadiness: 90,
            metabolicEfficiency: 80,
            powerOutput: {
              ftp: 300,
              critical: 340,
              anaerobic: 480
            },
            cognitiveLoad: 35
          },
          lastSync: new Date().toISOString()
        },
        additionalMetrics: {
          muscleOxygen: 72,
          bodyTemperature: 36.7,
          gsr: 12,
          emg: 50,
          posture: {
            angle: 3,
            position: 'upright'
          }
        },
        synchronizationQuality: 'excellent',
        dataCompleteness: 98
      };

      const insights = iotIntegrationService.processEnhancedWearableData(userId, enhancedWearableData);

      // Verify that the wearable integration service was called
      expect(wearableIntegrationService.processWearableData).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          vitals: expect.objectContaining({
            muscleOxygen: 72,
            bodyTemperature: 36.7
          })
        })
      );

      // Verify that the enhanced data was stored
      const storedData = iotIntegrationService.getEnhancedWearableData();
      expect(storedData).toEqual(enhancedWearableData);
    });

    it('should generate enhanced recovery insights', () => {
      // Mock storage manager methods
      (require('../lib/storage').storageManager.getRecoveryMetricsForDate as jest.Mock).mockReturnValue(undefined);
      
      const userId = 'test-user-002';
      const enhancedWearableData: EnhancedWearableData = {
        standardData: {
          source: 'oura',
          sleep: { 
            duration: 420, 
            quality: 85, 
            deepSleep: 120, 
            remSleep: 90, 
            lightSleep: 210,
            wakeTimes: 2, 
            bedtime: '22:30', 
            wakeTime: '06:30',
            sleepEfficiency: 90,
            sleepLatency: 15
          },
          activity: { 
            steps: 8000, 
            calories: 2200, 
            activeMinutes: 90, 
            vo2max: 55,
            trainingLoad: 50,
            lactateThreshold: 160,
            maxHeartRate: 185,
            zones: { zone1: 40, zone2: 30, zone3: 10, zone4: 0, zone5: 0 }
          },
          recovery: { 
            hrv: 60, 
            restingHeartRate: 50, 
            stress: 40,
            recoveryScore: 75,
            autonomicBalance: 1.0
          },
          vitals: {
            bloodPressure: {
              systolic: 120,
              diastolic: 78,
              pulse: 50,
              timestamp: new Date().toISOString()
            },
            glucose: {
              current: 95,
              average24h: 98,
              timeInRange: 85,
              variability: 15,
              timestamp: new Date().toISOString()
            },
            temperature: {
              body: 36.8,
              skin: 33.3,
              variance: 0.3
            },
            hydration: {
              level: 75,
              electrolytes: {
                sodium: 138,
                potassium: 4.0,
                magnesium: 2.0
              }
            },
            inflammation: {
              crp: 1.0,
              il6: 1.5,
              score: 80
            }
          },
          performance: {
            fitnessAge: 30,
            recoveryTime: 20,
            trainingReadiness: 80,
            metabolicEfficiency: 72,
            powerOutput: {
              ftp: 250,
              critical: 280,
              anaerobic: 400
            },
            cognitiveLoad: 50
          },
          lastSync: new Date().toISOString()
        },
        additionalMetrics: {
          muscleOxygen: 55, // Lower value should be 'good'
          bodyTemperature: 37.5, // Slightly elevated, should be 'good'
          gsr: 20,
          emg: 40,
          posture: {
            angle: 15, // Poor posture
            position: 'slouched'
          }
        },
        synchronizationQuality: 'good',
        dataCompleteness: 92
      };

      iotIntegrationService.processEnhancedWearableData(userId, enhancedWearableData);
      const insights = iotIntegrationService.generateIoTInsights();

      // Check enhanced recovery insights
      expect(insights.enhancedRecovery.muscleOxygenStatus).toBe('good');
      expect(insights.enhancedRecovery.hydrationStatus).toBe('good');
      expect(insights.enhancedRecovery.thermalStatus).toBe('good');
    });
  });

  describe('IoT Insights Generation', () => {
    it('should generate comprehensive IoT insights', () => {
      // Mock storage manager methods
      (require('../lib/storage').storageManager.getRecoveryMetricsForDate as jest.Mock).mockReturnValue(undefined);
      
      // Register some equipment
      const equipment1: EquipmentData = {
        id: 'band-001',
        name: 'Resistance Band Pro',
        type: 'resistance_band',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 80,
        capabilities: ['tension'],
        metrics: {}
      };

      const equipment2: EquipmentData = {
        id: 'mat-001',
        name: 'Smart Yoga Mat',
        type: 'smart_mat',
        connected: false, // Disconnected
        lastSync: new Date().toISOString(),
        capabilities: ['pressure'],
        metrics: {}
      };

      iotIntegrationService.registerEquipment(equipment1);
      iotIntegrationService.registerEquipment(equipment2);

      // Process environmental data
      const environmentalData: EnvironmentalData = {
        timestamp: new Date().toISOString(),
        sensors: [
          { type: 'temperature', value: 23, unit: '°C', location: 'Gym' },
          { type: 'humidity', value: 50, unit: '%', location: 'Gym' },
          { type: 'air_quality', value: 90, unit: 'AQI', location: 'Gym', quality: 'good' }
        ],
        airQualityIndex: 90,
        comfortLevel: 'comfortable'
      };

      iotIntegrationService.processEnvironmentalData(environmentalData);

      // Process enhanced wearable data
      const userId = 'test-user-003';
      const enhancedWearableData: EnhancedWearableData = {
        standardData: {
          source: 'apple',
          sleep: { 
            duration: 450, 
            quality: 88, 
            deepSleep: 130, 
            remSleep: 100, 
            lightSleep: 220,
            wakeTimes: 1, 
            bedtime: '22:15', 
            wakeTime: '06:45',
            sleepEfficiency: 92,
            sleepLatency: 12
          },
          activity: { 
            steps: 9500, 
            calories: 2400, 
            activeMinutes: 120, 
            vo2max: 57,
            trainingLoad: 60,
            lactateThreshold: 165,
            maxHeartRate: 187,
            zones: { zone1: 35, zone2: 40, zone3: 15, zone4: 2, zone5: 0 }
          },
          recovery: { 
            hrv: 68, 
            restingHeartRate: 47, 
            stress: 30,
            recoveryScore: 82,
            autonomicBalance: 1.3
          },
          vitals: {
            bloodPressure: {
              systolic: 118,
              diastolic: 76,
              pulse: 47,
              timestamp: new Date().toISOString()
            },
            glucose: {
              current: 92,
              average24h: 96,
              timeInRange: 88,
              variability: 12,
              timestamp: new Date().toISOString()
            },
            temperature: {
              body: 36.7,
              skin: 33.2,
              variance: 0.25
            },
            hydration: {
              level: 88,
              electrolytes: {
                sodium: 141,
                potassium: 4.25,
                magnesium: 2.15
              }
            },
            inflammation: {
              crp: 0.7,
              il6: 1.1,
              score: 89
            }
          },
          performance: {
            fitnessAge: 28,
            recoveryTime: 17,
            trainingReadiness: 87,
            metabolicEfficiency: 78,
            powerOutput: {
              ftp: 275,
              critical: 310,
              anaerobic: 440
            },
            cognitiveLoad: 40
          },
          lastSync: new Date().toISOString()
        },
        additionalMetrics: {
          muscleOxygen: 70,
          bodyTemperature: 36.7,
          gsr: 14,
          emg: 48,
          posture: {
            angle: 4,
            position: 'upright'
          }
        },
        synchronizationQuality: 'excellent',
        dataCompleteness: 96
      };

      iotIntegrationService.processEnhancedWearableData(userId, enhancedWearableData);

      // Generate insights
      const insights = iotIntegrationService.generateIoTInsights();

      // Verify equipment status
      expect(insights.equipmentStatus.connected).toBe(1);
      expect(insights.equipmentStatus.total).toBe(2);

      // Verify environmental conditions
      expect(insights.environmentalConditions.temperature).toBeCloseTo(23, 1);
      expect(insights.environmentalConditions.humidity).toBeCloseTo(50, 1);
      expect(insights.environmentalConditions.airQuality).toBeCloseTo(90, 1);
      expect(insights.environmentalConditions.recommendations).toHaveLength(0); // All conditions are optimal

      // Verify enhanced recovery
      expect(insights.enhancedRecovery.muscleOxygenStatus).toBe('optimal');
      expect(insights.enhancedRecovery.hydrationStatus).toBe('optimal');
      expect(insights.enhancedRecovery.thermalStatus).toBe('optimal');

      // Verify synchronization quality
      expect(insights.synchronizationQuality).toBe('excellent');
    });
  });
});