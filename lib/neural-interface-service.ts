/**
 * Neural Interface Service for SPARTAN 4
 * Direct integration with Spartan Nervous System for biometric feedback,
 * brain-computer interface for mental state monitoring, and neurofeedback training modules
 */

import { spartanNervousSystem } from './spartan-nervous-system';
import { dataManagementService } from './data-management-service';
import { wearableIntegrationService } from './wearable-integration-service';
import { storageManager } from './storage';
import { logger } from './logger';
import type { 
  NeuralSignalData, 
  MentalStateData, 
  NeuralFeedback, 
  NeurofeedbackProtocol,
  NeuralInterfaceDevice,
  NeuralSignalType,
  MentalState,
  NeuralFeedbackType
} from './types';

export class NeuralInterfaceService {
  private static instance: NeuralInterfaceService;
  private devices: Map<string, NeuralInterfaceDevice> = new Map();
  private signalBuffer: NeuralSignalData[] = [];
  private mentalStateBuffer: MentalStateData[] = [];
  private feedbackBuffer: NeuralFeedback[] = [];
  private protocols: NeurofeedbackProtocol[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): NeuralInterfaceService {
    if (!NeuralInterfaceService.instance) {
      NeuralInterfaceService.instance = new NeuralInterfaceService();
    }
    return NeuralInterfaceService.instance;
  }

  /**
   * Initialize the neural interface service
   */
  async initialize(): Promise<void> {
    logger.info('NeuralInterfaceService: Initializing service');
    
    // Load saved protocols
    this.protocols = storageManager.getNeurofeedbackProtocols() || [];
    
    // Load saved devices
    const savedDevices = storageManager.getNeuralInterfaceDevices() || [];
    savedDevices.forEach((device: NeuralInterfaceDevice) => {
      this.devices.set(device.id, device);
    });
    
    logger.info('NeuralInterfaceService: Service initialized successfully');
  }

  /**
   * Register a neural interface device
   */
  registerDevice(device: NeuralInterfaceDevice): void {
    this.devices.set(device.id, device);
    storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
    logger.info(`NeuralInterfaceService: Device ${device.name} registered`);
  }

  /**
   * Connect to a neural interface device
   */
  async connectToDevice(deviceId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) {
      logger.error(`NeuralInterfaceService: Device ${deviceId} not found`);
      return false;
    }

    try {
      // Simulate device connection
      device.connected = true;
      device.lastSync = new Date();
      this.devices.set(deviceId, device);
      storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
      
      logger.info(`NeuralInterfaceService: Connected to device ${device.name}`);
      return true;
    } catch (error) {
      logger.error(`NeuralInterfaceService: Failed to connect to device ${deviceId}`, error);
      return false;
    }
  }

  /**
   * Disconnect from a neural interface device
   */
  disconnectFromDevice(deviceId: string): void {
    const device = this.devices.get(deviceId);
    if (device) {
      device.connected = false;
      this.devices.set(deviceId, device);
      storageManager.setNeuralInterfaceDevices(Array.from(this.devices.values()));
      logger.info(`NeuralInterfaceService: Disconnected from device ${device.name}`);
    }
  }

  /**
   * Start monitoring neural signals
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      logger.warn('NeuralInterfaceService: Monitoring already started');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectNeuralData();
    }, 1000); // Collect data every second

    logger.info('NeuralInterfaceService: Started monitoring neural signals');
  }

  /**
   * Stop monitoring neural signals
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      logger.warn('NeuralInterfaceService: Monitoring not started');
      return;
    }

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.isMonitoring = false;
    logger.info('NeuralInterfaceService: Stopped monitoring neural signals');
  }

  /**
   * Collect neural data from connected devices
   */
  private async collectNeuralData(): Promise<void> {
    // In a real implementation, this would collect actual data from devices
    // For now, we'll simulate data collection
    
    const connectedDevices = Array.from(this.devices.values()).filter(d => d.connected);
    
    if (connectedDevices.length === 0) {
      return;
    }

    // Simulate collecting neural signals
    const signals: NeuralSignalData[] = [];
    
    connectedDevices.forEach(device => {
      device.supportedSignals.forEach(signalType => {
        // Generate simulated signal data
        const signal: NeuralSignalData = {
          type: signalType,
          value: this.generateSimulatedSignalValue(signalType),
          timestamp: new Date(),
          quality: Math.floor(Math.random() * 20) + 80, // 80-100 quality
          channel: device.type === 'eeg_headset' ? `channel_${Math.floor(Math.random() * 8) + 1}` : undefined
        };
        signals.push(signal);
      });
    });

    // Add signals to buffer
    this.signalBuffer.push(...signals);
    
    // Keep buffer at reasonable size
    if (this.signalBuffer.length > 1000) {
      this.signalBuffer = this.signalBuffer.slice(-1000);
    }

    // Process signals to determine mental state
    const mentalState = this.analyzeMentalState(signals);
    this.mentalStateBuffer.push(mentalState);
    
    // Keep mental state buffer at reasonable size
    if (this.mentalStateBuffer.length > 100) {
      this.mentalStateBuffer = this.mentalStateBuffer.slice(-100);
    }

    // Generate neural feedback
    const feedback = this.generateNeuralFeedback(signals, mentalState);
    this.feedbackBuffer.push(feedback);
    
    // Keep feedback buffer at reasonable size
    if (this.feedbackBuffer.length > 50) {
      this.feedbackBuffer = this.feedbackBuffer.slice(-50);
    }

    // Emit events to the nervous system
    this.emitNeuralEvents(signals, mentalState, feedback);
  }

  /**
   * Generate simulated signal values for different signal types
   */
  private generateSimulatedSignalValue(signalType: NeuralSignalType): number {
    switch (signalType) {
      case 'eeg_alpha':
        return Math.random() * 15; // 0-15 μV
      case 'eeg_beta':
        return Math.random() * 30; // 0-30 μV
      case 'eeg_theta':
        return Math.random() * 10; // 0-10 μV
      case 'eeg_delta':
        return Math.random() * 8; // 0-8 μV
      case 'emg':
        return Math.random() * 100; // 0-100 μV
      case 'ecg':
        return Math.random() * 2; // 0-2 mV
      case 'hrv':
        return Math.random() * 100; // 0-100 ms
      case 'gal':
        return Math.random() * 5; // 0-5 μS
      case 'pupillometry':
        return Math.random() * 10; // 0-10 mm
      case 'respiration':
        return Math.random() * 30; // 0-30 breaths per minute
      default:
        return Math.random() * 100;
    }
  }

  /**
   * Analyze mental state from neural signals
   */
  private analyzeMentalState(signals: NeuralSignalData[]): MentalStateData {
    // Simplified mental state analysis
    // In a real implementation, this would use ML models or signal processing algorithms
    
    let state: MentalState = 'focused';
    let confidence = 80;
    
    // Analyze EEG signals for mental state
    const alphaSignals = signals.filter(s => s.type === 'eeg_alpha');
    const betaSignals = signals.filter(s => s.type === 'eeg_beta');
    const thetaSignals = signals.filter(s => s.type === 'eeg_theta');
    
    if (alphaSignals.length > 0 && betaSignals.length > 0) {
      const alphaAvg = alphaSignals.reduce((sum, s) => sum + s.value, 0) / alphaSignals.length;
      const betaAvg = betaSignals.reduce((sum, s) => sum + s.value, 0) / betaSignals.length;
      const thetaAvg = thetaSignals.reduce((sum, s) => sum + s.value, 0) / thetaSignals.length;
      
      // Simple heuristic for mental state classification
      if (alphaAvg > betaAvg * 1.5) {
        state = 'relaxed';
      } else if (betaAvg > alphaAvg * 2) {
        state = 'focused';
      } else if (thetaAvg > alphaAvg && thetaAvg > betaAvg) {
        state = 'drowsy';
      }
      
      // Confidence based on signal quality
      const avgQuality = signals.reduce((sum, s) => sum + s.quality, 0) / signals.length;
      confidence = Math.round(avgQuality);
    }
    
    return {
      state,
      confidence,
      timestamp: new Date(),
      associatedSignals: signals
    };
  }

  /**
   * Generate neural feedback from signals and mental state
   */
  private generateNeuralFeedback(signals: NeuralSignalData[], mentalState: MentalStateData): NeuralFeedback {
    // Generate feedback based on signals and mental state
    let feedbackType: NeuralFeedbackType = 'cognitive_load';
    let value = 50; // Default value
    let recommendations: string[] = [];
    
    // Analyze signals to generate feedback
    const hrvSignals = signals.filter(s => s.type === 'hrv');
    const emgSignals = signals.filter(s => s.type === 'emg');
    const eegBeta = signals.filter(s => s.type === 'eeg_beta');
    
    if (hrvSignals.length > 0) {
      const avgHRV = hrvSignals.reduce((sum, s) => sum + s.value, 0) / hrvSignals.length;
      // HRV is inversely related to stress - higher HRV means lower stress
      value = Math.min(100, Math.max(0, (avgHRV / 100) * 100));
      feedbackType = 'stress_response';
    } else if (emgSignals.length > 0) {
      const avgEMG = emgSignals.reduce((sum, s) => sum + s.value, 0) / emgSignals.length;
      // EMG relates to muscle activation
      value = Math.min(100, (avgEMG / 100) * 100);
      feedbackType = 'fatigue_index';
    } else if (eegBeta.length > 0) {
      const avgBeta = eegBeta.reduce((sum, s) => sum + s.value, 0) / eegBeta.length;
      // Beta waves relate to cognitive load
      value = Math.min(100, (avgBeta / 30) * 100);
      feedbackType = 'cognitive_load';
    }
    
    // Generate recommendations based on feedback
    if (value < 30) {
      recommendations = [
        'Consider taking a break to reduce cognitive load',
        'Practice deep breathing exercises',
        'Hydrate and ensure proper nutrition'
      ];
    } else if (value > 70) {
      recommendations = [
        'Maintain current focus level',
        'Ensure adequate recovery between sessions',
        'Monitor for signs of overexertion'
      ];
    }
    
    return {
      type: feedbackType,
      value,
      timestamp: new Date(),
      targetRange: [40, 60], // Optimal range
      recommendations
    };
  }

  /**
   * Emit neural events to the Spartan Nervous System
   */
  private emitNeuralEvents(
    signals: NeuralSignalData[], 
    mentalState: MentalStateData, 
    feedback: NeuralFeedback
  ): void {
    // Emit biometric data received event
    spartanNervousSystem.emitEvent({
      type: 'data_updated',
      timestamp: new Date(),
      userId: 'current_user', // Would be dynamic in real implementation
      payload: {
        neuralSignals: signals,
        mentalState,
        neuralFeedback: feedback
      },
      sourceModule: 'NeuralInterfaceService',
      priority: 'high'
    });
    
    // Emit mental state event
    spartanNervousSystem.emitEvent({
      type: 'insight_generated',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'mental_state',
        data: mentalState
      },
      sourceModule: 'NeuralInterfaceService',
      priority: 'medium'
    });
    
    // Emit feedback event
    spartanNervousSystem.emitEvent({
      type: 'recommendation_made',
      timestamp: new Date(),
      userId: 'current_user',
      payload: {
        type: 'neural_feedback',
        data: feedback
      },
      sourceModule: 'NeuralInterfaceService',
      priority: 'medium'
    });
  }

  /**
   * Create a new neurofeedback protocol
   */
  createNeurofeedbackProtocol(protocol: Omit<NeurofeedbackProtocol, 'id' | 'progressTracking'>): NeurofeedbackProtocol {
    const newProtocol: NeurofeedbackProtocol = {
      ...protocol,
      id: `protocol_${Date.now()}`,
      progressTracking: {
        sessionsCompleted: 0,
        averageImprovement: 0
      }
    };
    
    this.protocols.push(newProtocol);
    storageManager.setNeurofeedbackProtocols(this.protocols);
    
    logger.info(`NeuralInterfaceService: Created neurofeedback protocol ${protocol.name}`);
    return newProtocol;
  }

  /**
   * Start a neurofeedback training session
   */
  async startNeurofeedbackSession(protocolId: string): Promise<boolean> {
    const protocol = this.protocols.find(p => p.id === protocolId);
    if (!protocol) {
      logger.error(`NeuralInterfaceService: Protocol ${protocolId} not found`);
      return false;
    }

    try {
      // In a real implementation, this would start the actual training session
      logger.info(`NeuralInterfaceService: Starting neurofeedback session for protocol ${protocol.name}`);
      
      // Update protocol progress
      protocol.progressTracking.sessionsCompleted += 1;
      protocol.progressTracking.lastSessionDate = new Date();
      
      // Update in storage
      storageManager.setNeurofeedbackProtocols(this.protocols);
      
      return true;
    } catch (error) {
      logger.error(`NeuralInterfaceService: Failed to start neurofeedback session for protocol ${protocolId}`, error);
      return false;
    }
  }

  /**
   * Get current neural signals
   */
  getCurrentSignals(): NeuralSignalData[] {
    // Return recent signals (last 10 seconds)
    const cutoffTime = new Date(Date.now() - 10000);
    return this.signalBuffer.filter(signal => signal.timestamp > cutoffTime);
  }

  /**
   * Get current mental state
   */
  getCurrentMentalState(): MentalStateData | null {
    if (this.mentalStateBuffer.length === 0) {
      return null;
    }
    return this.mentalStateBuffer[this.mentalStateBuffer.length - 1];
  }

  /**
   * Get current neural feedback
   */
  getCurrentFeedback(): NeuralFeedback | null {
    if (this.feedbackBuffer.length === 0) {
      return null;
    }
    return this.feedbackBuffer[this.feedbackBuffer.length - 1];
  }

  /**
   * Get all neurofeedback protocols
   */
  getProtocols(): NeurofeedbackProtocol[] {
    return [...this.protocols];
  }

  /**
   * Get connected devices
   */
  getConnectedDevices(): NeuralInterfaceDevice[] {
    return Array.from(this.devices.values()).filter(d => d.connected);
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopMonitoring();
    logger.info('NeuralInterfaceService: Service cleaned up');
  }
}

// Export singleton instance
export const neuralInterfaceService = NeuralInterfaceService.getInstance();