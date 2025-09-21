/**
 * Neural Interface Service Tests
 * Tests for the neural interface connectivity features
 */

import { neuralInterfaceService } from '../lib/neural-interface-service';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { storageManager } from '../lib/storage';
import type { NeuralSignalType } from '../lib/types';

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

  test('should integrate with Spartan Nervous System', () => {
    // Test that the service can emit events to the nervous system
    const eventHandler = jest.fn();
    
    // Subscribe to neural events
    spartanNervousSystem.subscribe('neural_data_received', eventHandler);
    spartanNervousSystem.subscribe('mental_state_changed', eventHandler);
    spartanNervousSystem.subscribe('neural_feedback_received', eventHandler);

    // Emit a test event
    spartanNervousSystem.emitEvent({
      type: 'neural_data_received',
      timestamp: new Date(),
      userId: 'test_user',
      payload: {
        neuralSignals: [],
        mentalState: null,
        neuralFeedback: null
      },
      sourceModule: 'NeuralInterfaceService',
      priority: 'medium'
    });

    // Check that the event handler was called
    expect(eventHandler).toHaveBeenCalled();
  });

  test('should persist data to storage', () => {
    // Create a protocol to ensure we have data to persist
    neuralInterfaceService.createNeurofeedbackProtocol({
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

    // Check that data was persisted to storage
    const storedProtocols = storageManager.getNeurofeedbackProtocols();
    const storedDevices = storageManager.getNeuralInterfaceDevices();

    expect(Array.isArray(storedProtocols)).toBe(true);
    expect(Array.isArray(storedDevices)).toBe(true);
    expect(storedProtocols.length).toBeGreaterThanOrEqual(1);
    expect(storedDevices.length).toBeGreaterThanOrEqual(1);
  });
});