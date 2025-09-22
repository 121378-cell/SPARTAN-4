import { universalDeviceIntegrationService, UniversalDeviceData } from '../lib/universal-device-integration-service';

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

// Mock the IoT integration service
jest.mock('../lib/iot-integration-service', () => ({
  iotIntegrationService: {
    registerEquipment: jest.fn(),
    updateEquipmentData: jest.fn(),
    processEnvironmentalData: jest.fn()
  }
}));

// Mock the nervous system
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    emitEvent: jest.fn()
  }
}));

// Mock the real-time data integration service
jest.mock('../lib/real-time-data-integration', () => ({
  realTimeDataIntegrationService: {
    emitEvent: jest.fn()
  }
}));

// Mock the logger
jest.mock('../lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Universal Device Integration Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the singleton instance
    // @ts-ignore - accessing private property for testing
    universalDeviceIntegrationService['devices'].clear();
    
    // @ts-ignore - accessing private property for testing
    universalDeviceIntegrationService['stats'] = {
      totalDevices: 0,
      connectedDevices: 0,
      dataPointsProcessed: 0,
      lastSync: null,
      averageQuality: 0,
      errorCount: 0
    };
  });

  describe('Device Registration', () => {
    it('should register a new device', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'test-device-001',
        deviceName: 'Smart Watch Pro',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: { heartRate: 72 },
        processedData: { heartRate: 72 },
        qualityMetrics: {
          signalStrength: 95,
          dataCompleteness: 100,
          synchronizationQuality: 'excellent',
          batteryLevel: 80
        },
        metadata: {
          firmwareVersion: '1.2.3',
          manufacturer: 'TechCorp',
          model: 'SWP-2023',
          capabilities: ['heart_rate', 'steps', 'sleep_tracking']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);

      const devices = universalDeviceIntegrationService.getDevices();
      expect(devices).toHaveLength(1);
      expect(devices[0].deviceId).toBe('test-device-001');
      expect(devices[0].deviceName).toBe('Smart Watch Pro');
    });

    it('should update device data', () => {
      // Register a device first
      const initialDeviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'test-device-002',
        deviceName: 'Fitness Tracker',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: { steps: 5000 },
        processedData: { steps: 5000 },
        qualityMetrics: {
          signalStrength: 85,
          dataCompleteness: 90,
          synchronizationQuality: 'good',
          batteryLevel: 70
        },
        metadata: {
          firmwareVersion: '2.1.0',
          manufacturer: 'FitTech',
          model: 'FT-500',
          capabilities: ['steps', 'calories']
        }
      };

      universalDeviceIntegrationService.registerDevice(initialDeviceData);

      // Update the device data
      universalDeviceIntegrationService.updateDeviceData('test-device-002', {
        rawData: { steps: 7500, heartRate: 75 },
        processedData: { steps: 7500, heartRate: 75 },
        qualityMetrics: {
          signalStrength: 90,
          dataCompleteness: 95,
          synchronizationQuality: 'excellent',
          batteryLevel: 65
        }
      });

      const updatedDevice = universalDeviceIntegrationService.getDevice('test-device-002');
      expect(updatedDevice).toBeDefined();
      expect(updatedDevice?.rawData.steps).toBe(7500);
      expect(updatedDevice?.rawData.heartRate).toBe(75);
      expect(updatedDevice?.qualityMetrics.dataCompleteness).toBe(95);
    });
  });

  describe('Device Configuration', () => {
    it('should update configuration settings', () => {
      const newConfig = {
        dataSyncInterval: 10000,
        qualityThreshold: 80
      };

      universalDeviceIntegrationService.configure(newConfig);

      // @ts-ignore - accessing private property for testing
      expect(universalDeviceIntegrationService['config'].dataSyncInterval).toBe(10000);
      // @ts-ignore - accessing private property for testing
      expect(universalDeviceIntegrationService['config'].qualityThreshold).toBe(80);
    });
  });

  describe('Data Processing', () => {
    it('should process wearable device data', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'wearable-001',
        deviceName: 'Smart Watch',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {
          heartRate: 70,
          steps: 8000,
          sleep: { duration: 480, quality: 85 }
        },
        processedData: {
          heartRate: 70,
          steps: 8000,
          sleep: { duration: 480, quality: 85 }
        },
        qualityMetrics: {
          signalStrength: 90,
          dataCompleteness: 95,
          synchronizationQuality: 'excellent',
          batteryLevel: 85
        },
        metadata: {
          capabilities: ['heart_rate', 'steps', 'sleep_tracking']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      universalDeviceIntegrationService.updateDeviceData('wearable-001', {});

      // Verify that wearable integration service was called
      expect(require('../lib/wearable-integration-service').wearableIntegrationService.processWearableData)
        .toHaveBeenCalled();
    });

    it('should process smart equipment data', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'equipment-001',
        deviceName: 'Smart Resistance Band',
        deviceType: 'smart_equipment',
        protocol: 'bluetooth',
        rawData: {
          tension: 50,
          reps: 12
        },
        processedData: {
          tension: 50,
          reps: 12
        },
        qualityMetrics: {
          signalStrength: 88,
          dataCompleteness: 92,
          synchronizationQuality: 'good',
          batteryLevel: 75
        },
        metadata: {
          capabilities: ['tension_measurement', 'reps_counting']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      universalDeviceIntegrationService.updateDeviceData('equipment-001', {});

      // Verify that IoT integration service was called
      expect(require('../lib/iot-integration-service').iotIntegrationService.registerEquipment)
        .toHaveBeenCalled();
      expect(require('../lib/iot-integration-service').iotIntegrationService.updateEquipmentData)
        .toHaveBeenCalled();
    });

    it('should process environmental sensor data', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'sensor-001',
        deviceName: 'Air Quality Monitor',
        deviceType: 'environmental_sensor',
        protocol: 'wifi',
        rawData: {
          sensors: [
            { type: 'temperature', value: 22.5, unit: '°C' },
            { type: 'humidity', value: 45, unit: '%' },
            { type: 'air_quality', value: 85, unit: 'AQI' }
          ]
        },
        processedData: {
          temperature: 22.5,
          humidity: 45,
          airQuality: 85
        },
        qualityMetrics: {
          signalStrength: 92,
          dataCompleteness: 100,
          synchronizationQuality: 'excellent'
        },
        metadata: {
          capabilities: ['temperature', 'humidity', 'air_quality']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      universalDeviceIntegrationService.updateDeviceData('sensor-001', {});

      // Verify that IoT integration service was called
      expect(require('../lib/iot-integration-service').iotIntegrationService.processEnvironmentalData)
        .toHaveBeenCalled();
    });

    it('should process force sensor data', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'force-001',
        deviceName: 'Force Plate',
        deviceType: 'force_sensor',
        protocol: 'usb',
        rawData: {
          force: {
            x: 150,
            y: 75,
            z: 200
          }
        },
        processedData: {
          totalForce: 225
        },
        qualityMetrics: {
          signalStrength: 95,
          dataCompleteness: 98,
          synchronizationQuality: 'excellent'
        },
        metadata: {
          capabilities: ['force_measurement']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      universalDeviceIntegrationService.updateDeviceData('force-001', {});

      // Verify that nervous system was notified
      expect(require('../lib/spartan-nervous-system').spartanNervousSystem.emitEvent)
        .toHaveBeenCalledWith(expect.objectContaining({
          type: 'data_updated',
          payload: expect.objectContaining({
            type: 'force_data'
          })
        }));
    });
  });

  describe('Statistics and Monitoring', () => {
    it('should track device statistics', () => {
      // Register multiple devices
      const device1: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'device-001',
        deviceName: 'Device 1',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {},
        processedData: {},
        qualityMetrics: {
          signalStrength: 90,
          dataCompleteness: 85,
          synchronizationQuality: 'good',
          batteryLevel: 80
        },
        metadata: {
          capabilities: []
        }
      };

      const device2: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'device-002',
        deviceName: 'Device 2',
        deviceType: 'smart_equipment',
        protocol: 'wifi',
        rawData: {},
        processedData: {},
        qualityMetrics: {
          signalStrength: 75,
          dataCompleteness: 92,
          synchronizationQuality: 'excellent',
          batteryLevel: 90
        },
        metadata: {
          capabilities: []
        }
      };

      universalDeviceIntegrationService.registerDevice(device1);
      universalDeviceIntegrationService.registerDevice(device2);

      const stats = universalDeviceIntegrationService.getStats();
      expect(stats.totalDevices).toBe(2);
      expect(stats.connectedDevices).toBe(2);
    });

    it('should calculate average quality correctly', () => {
      const device1: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'quality-device-001',
        deviceName: 'High Quality Device',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {},
        processedData: {},
        qualityMetrics: {
          signalStrength: 95,
          dataCompleteness: 95,
          synchronizationQuality: 'excellent'
        },
        metadata: {
          capabilities: []
        }
      };

      const device2: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'quality-device-002',
        deviceName: 'Medium Quality Device',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {},
        processedData: {},
        qualityMetrics: {
          signalStrength: 85,
          dataCompleteness: 75,
          synchronizationQuality: 'good'
        },
        metadata: {
          capabilities: []
        }
      };

      universalDeviceIntegrationService.registerDevice(device1);
      universalDeviceIntegrationService.registerDevice(device2);

      // Process data to update stats
      universalDeviceIntegrationService.updateDeviceData('quality-device-001', {});
      universalDeviceIntegrationService.updateDeviceData('quality-device-002', {});

      const stats = universalDeviceIntegrationService.getStats();
      // Average should be (95 + 75) / 2 = 85
      expect(stats.averageQuality).toBeCloseTo(85, 1);
    });
  });

  describe('Device Management', () => {
    it('should remove a device', () => {
      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'remove-device-001',
        deviceName: 'Removable Device',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: {},
        processedData: {},
        qualityMetrics: {
          signalStrength: 90,
          dataCompleteness: 85,
          synchronizationQuality: 'good'
        },
        metadata: {
          capabilities: []
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      expect(universalDeviceIntegrationService.getDevices()).toHaveLength(1);

      universalDeviceIntegrationService.removeDevice('remove-device-001');
      expect(universalDeviceIntegrationService.getDevices()).toHaveLength(0);
    });

    it('should handle device data with low quality', () => {
      // Configure service to require high quality data
      universalDeviceIntegrationService.configure({ qualityThreshold: 90 });

      const lowQualityDevice: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'low-quality-001',
        deviceName: 'Low Quality Device',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: { heartRate: 72 },
        processedData: { heartRate: 72 },
        qualityMetrics: {
          signalStrength: 85,
          dataCompleteness: 80, // Below threshold
          synchronizationQuality: 'good'
        },
        metadata: {
          capabilities: ['heart_rate']
        }
      };

      universalDeviceIntegrationService.registerDevice(lowQualityDevice);
      universalDeviceIntegrationService.updateDeviceData('low-quality-001', {});

      // Verify that the data was not processed due to low quality
      expect(require('../lib/wearable-integration-service').wearableIntegrationService.processWearableData)
        .not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors during data processing', () => {
      // Mock an error in the wearable integration service
      (require('../lib/wearable-integration-service').wearableIntegrationService.processWearableData as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error('Processing error');
        });

      const deviceData: Omit<UniversalDeviceData, 'timestamp'> = {
        deviceId: 'error-device-001',
        deviceName: 'Error Device',
        deviceType: 'wearable',
        protocol: 'bluetooth',
        rawData: { heartRate: 72 },
        processedData: { heartRate: 72 },
        qualityMetrics: {
          signalStrength: 95,
          dataCompleteness: 100,
          synchronizationQuality: 'excellent'
        },
        metadata: {
          capabilities: ['heart_rate']
        }
      };

      universalDeviceIntegrationService.registerDevice(deviceData);
      universalDeviceIntegrationService.updateDeviceData('error-device-001', {});

      // Verify that error was logged
      expect(require('../lib/logger').logger.error).toHaveBeenCalled();

      // Verify that error count was incremented
      const stats = universalDeviceIntegrationService.getStats();
      expect(stats.errorCount).toBe(1);
    });
  });
});