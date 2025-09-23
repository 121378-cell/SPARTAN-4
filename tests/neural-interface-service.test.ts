/**
 * Neural Interface Service Tests
 * Tests for the neural interface connectivity features
 */

import { neuralInterfaceService } from '../lib/neural-interface-service';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { storageManager } from '../lib/storage';
import type { NeuralSignalType } from '../lib/types';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    getUserData: jest.fn(),
    setUserData: jest.fn(),
    getWorkoutPlans: jest.fn().mockReturnValue([]),
    getProgressData: jest.fn().mockReturnValue([]),
    getRecipes: jest.fn().mockReturnValue([]),
    getBloodAnalyses: jest.fn().mockReturnValue([]),
    getOverloadData: jest.fn().mockReturnValue([]),
    getCorrectiveExercises: jest.fn().mockReturnValue([]),
    getWorkoutSessions: jest.fn().mockReturnValue([]),
    getUserHabits: jest.fn().mockReturnValue([]),
    getDailyNutrition: jest.fn().mockReturnValue([]),
    getRecoveryMetrics: jest.fn().mockReturnValue([]),
    getRecoveryAnalyses: jest.fn().mockReturnValue([]),
    getProgressionMetrics: jest.fn().mockReturnValue([]),
    getProgressionHistory: jest.fn().mockReturnValue([]),
    getProgressionPlans: jest.fn().mockReturnValue([]),
    getNeurofeedbackProtocols: jest.fn().mockReturnValue([]),
    setNeurofeedbackProtocols: jest.fn(),
    getNeuralInterfaceDevices: jest.fn().mockReturnValue([]),
    setNeuralInterfaceDevices: jest.fn(),
    getEnvironmentalData: jest.fn().mockReturnValue(null),
    getEnhancedWearableData: jest.fn().mockReturnValue(null)
  }
}));

describe('NeuralInterfaceService', () => {
  beforeAll(async () => {
    // Initialize the service
    await neuralInterfaceService.initialize();
  });

  test('should register and connect to neural interface devices', async () => {
    // Register a test device
    const testDevice = {
      id: 'test_device_001',
      name: 'Test Neural Device',
      type: 'multi_modal' as const,
      connected: false,
      signalQuality: 90,
      lastSync: new Date(),
      supportedSignals: ['eeg_alpha' as NeuralSignalType, 'eeg_beta' as NeuralSignalType, 'hrv' as NeuralSignalType]
    };

    neuralInterfaceService.registerDevice(testDevice);

    // Connect to the device
    const connected = await neuralInterfaceService.connectToDevice('test_device_001');
    expect(connected).toBe(true);

    // Check that the device is in the connected devices list
    const connectedDevices = neuralInterfaceService.getConnectedDevices();
    expect(connectedDevices).toHaveLength(1);
    expect(connectedDevices[0].id).toBe('test_device_001');
    expect(connectedDevices[0].connected).toBe(true);

    // Disconnect from the device
    neuralInterfaceService.disconnectFromDevice('test_device_001');
    
    // Check that the device is no longer connected
    const disconnectedDevices = neuralInterfaceService.getConnectedDevices();
    expect(disconnectedDevices).toHaveLength(0);
  });

  test('should create and manage neurofeedback protocols', () => {
    // Create a test protocol
    const protocol = neuralInterfaceService.createNeurofeedbackProtocol({
      name: 'Test Protocol',
      description: 'A test neurofeedback protocol',
      targetMetrics: ['cognitive_load', 'attention_level'],
      protocol: {
        duration: 10,
        frequency: 'daily',
        intensity: 'low',
        guidance: ['Step 1', 'Step 2', 'Step 3']
      }
    });

    expect(protocol).toBeDefined();
    expect(protocol.name).toBe('Test Protocol');
    expect(protocol.progressTracking.sessionsCompleted).toBe(0);

    // Check that the protocol is in the protocols list
    const protocols = neuralInterfaceService.getProtocols();
    expect(protocols).toHaveLength(1);
    expect(protocols[0].id).toBe(protocol.id);

    // Start a session
    const sessionStarted = neuralInterfaceService.startNeurofeedbackSession(protocol.id);
    expect(sessionStarted).resolves.toBe(true);

    // Check that the session count was updated
    const updatedProtocols = neuralInterfaceService.getProtocols();
    expect(updatedProtocols[0].progressTracking.sessionsCompleted).toBe(1);
  });

  test('should handle neural data monitoring', () => {
    // Start monitoring
    neuralInterfaceService.startMonitoring();

    // Check that monitoring is active
    // Note: This is a private property, so we can't directly test it
    // Instead, we'll check that data is being collected

    // Get current signals (should be empty initially)
    const initialSignals = neuralInterfaceService.getCurrentSignals();
    expect(Array.isArray(initialSignals)).toBe(true);

    // Stop monitoring
    neuralInterfaceService.stopMonitoring();
  });

  test('should integrate with Spartan Nervous System', async () => {
    // Test that the service can emit events to the nervous system
    const dataUpdatedHandler = jest.fn();
    const insightGeneratedHandler = jest.fn();
    const recommendationMadeHandler = jest.fn();
    
    // Subscribe to the actual event types that the service emits
    spartanNervousSystem.subscribe('data_updated', dataUpdatedHandler);
    spartanNervousSystem.subscribe('insight_generated', insightGeneratedHandler);
    spartanNervousSystem.subscribe('recommendation_made', recommendationMadeHandler);

    // Register and connect a device to enable data collection
    const testDevice = {
      id: 'test_device_002',
      name: 'Test Neural Device 2',
      type: 'eeg_headset' as const,
      connected: false,
      signalQuality: 95,
      lastSync: new Date(),
      supportedSignals: ['eeg_alpha' as NeuralSignalType, 'eeg_beta' as NeuralSignalType]
    };

    neuralInterfaceService.registerDevice(testDevice);
    
    // Connect to the device
    const connected = await neuralInterfaceService.connectToDevice('test_device_002');
    expect(connected).toBe(true);

    // Call collectNeuralData to trigger event emission
    // @ts-ignore - accessing private method for testing
    await neuralInterfaceService.collectNeuralData();
    
    // Wait for event processing (events are processed every 500ms)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check that the event handlers were called
    expect(dataUpdatedHandler).toHaveBeenCalled();
    expect(insightGeneratedHandler).toHaveBeenCalled();
    expect(recommendationMadeHandler).toHaveBeenCalled();
  });

  test('should persist data to storage', () => {
    // Reset mock calls
    (storageManager.setNeurofeedbackProtocols as jest.Mock).mockClear();
    (storageManager.setNeuralInterfaceDevices as jest.Mock).mockClear();
    
    // Create a protocol to ensure we have data to persist
    const protocol = neuralInterfaceService.createNeurofeedbackProtocol({
      name: 'Storage Test Protocol',
      description: 'Protocol to test storage persistence',
      targetMetrics: ['cognitive_load'],
      protocol: {
        duration: 5,
        frequency: 'as_needed',
        intensity: 'low',
        guidance: ['Test step']
      }
    });

    // Register a device to ensure we have device data to persist
    const storageTestDevice = {
      id: 'storage_test_device',
      name: 'Storage Test Device',
      type: 'eeg_headset' as const,
      connected: false,
      signalQuality: 85,
      lastSync: new Date(),
      supportedSignals: ['eeg_alpha' as NeuralSignalType]
    };

    neuralInterfaceService.registerDevice(storageTestDevice);

    // Check that storage methods were called
    expect(storageManager.setNeurofeedbackProtocols).toHaveBeenCalled();
    expect(storageManager.setNeuralInterfaceDevices).toHaveBeenCalled();
  });
});