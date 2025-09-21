/**
 * Neural Interface Connectivity Demo
 * Demonstrates the integration of neural interface capabilities with the SPARTAN 4 ecosystem
 */

import { neuralInterfaceService } from '../lib/neural-interface-service';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { storageManager } from '../lib/storage';
import type { NeuralSignalType } from '../lib/types';

async function runNeuralInterfaceDemo() {
  console.log('🚀 Starting Neural Interface Connectivity Demo');
  console.log('=============================================');
  
  // Initialize the neural interface service
  await neuralInterfaceService.initialize();
  
  // Register a sample neural interface device
  const eegDevice = {
    id: 'eeg_headset_001',
    name: 'SPARTAN Neural Headset Pro',
    type: 'eeg_headset' as const,
    connected: false,
    signalQuality: 95,
    lastSync: new Date(),
    supportedSignals: ['eeg_alpha' as NeuralSignalType, 'eeg_beta' as NeuralSignalType, 'eeg_theta' as NeuralSignalType, 'eeg_delta' as NeuralSignalType]
  };
  
  const emgDevice = {
    id: 'emg_sensor_001',
    name: 'SPARTAN Muscle Sensor',
    type: 'emg_sensor' as const,
    connected: false,
    signalQuality: 92,
    lastSync: new Date(),
    supportedSignals: ['emg' as NeuralSignalType, 'hrv' as NeuralSignalType]
  };
  
  console.log('\n📋 Registering neural interface devices...');
  neuralInterfaceService.registerDevice(eegDevice);
  neuralInterfaceService.registerDevice(emgDevice);
  
  // Connect to devices
  console.log('\n🔌 Connecting to neural interface devices...');
  const eegConnected = await neuralInterfaceService.connectToDevice('eeg_headset_001');
  const emgConnected = await neuralInterfaceService.connectToDevice('emg_sensor_001');
  
  if (eegConnected && emgConnected) {
    console.log('✅ Successfully connected to all neural interface devices');
  } else {
    console.log('❌ Failed to connect to one or more devices');
    return;
  }
  
  // Create neurofeedback protocols
  console.log('\n🧠 Creating neurofeedback protocols...');
  
  const focusProtocol = neuralInterfaceService.createNeurofeedbackProtocol({
    name: 'Focus Enhancement',
    description: 'Protocol to improve cognitive focus and attention',
    targetMetrics: ['cognitive_load', 'attention_level'],
    protocol: {
      duration: 20,
      frequency: 'daily',
      intensity: 'medium',
      guidance: [
        'Find a quiet space and sit comfortably',
        'Put on the neural headset',
        'Follow the visual feedback to increase focus',
        'Maintain focus for the full 20 minutes'
      ]
    }
  });
  
  const stressProtocol = neuralInterfaceService.createNeurofeedbackProtocol({
    name: 'Stress Reduction',
    description: 'Protocol to reduce stress and promote relaxation',
    targetMetrics: ['stress_response', 'readiness_score'],
    protocol: {
      duration: 15,
      frequency: 'as_needed',
      intensity: 'low',
      guidance: [
        'Find a comfortable position',
        'Close your eyes and take deep breaths',
        'Follow the audio guidance for progressive relaxation',
        'Allow your mind to settle into a relaxed state'
      ]
    }
  });
  
  console.log(`✅ Created protocol: ${focusProtocol.name}`);
  console.log(`✅ Created protocol: ${stressProtocol.name}`);
  
  // Start monitoring neural signals
  console.log('\n📡 Starting neural signal monitoring...');
  neuralInterfaceService.startMonitoring();
  
  // Subscribe to nervous system events to see the integration
  console.log('\n🔗 Subscribing to nervous system events...');
  
  spartanNervousSystem.subscribe('neural_data_received', (event) => {
    console.log(`\n🔔 Neural Data Received Event:`);
    console.log(`  Source: ${event.sourceModule}`);
    console.log(`  Timestamp: ${event.timestamp}`);
  });
  
  spartanNervousSystem.subscribe('mental_state_changed', (event) => {
    console.log(`\n🧠 Mental State Changed Event:`);
    console.log(`  Source: ${event.sourceModule}`);
    console.log(`  State: ${event.payload.data.state}`);
    console.log(`  Confidence: ${event.payload.data.confidence}%`);
  });
  
  spartanNervousSystem.subscribe('neural_feedback_received', (event) => {
    console.log(`\n📊 Neural Feedback Received Event:`);
    console.log(`  Source: ${event.sourceModule}`);
    console.log(`  Feedback Type: ${event.payload.data.type}`);
    console.log(`  Value: ${event.payload.data.value}`);
  });
  
  spartanNervousSystem.subscribe('recommendation_made', (event) => {
    if (event.payload.type === 'neural_feedback') {
      console.log(`\n💡 Neural Feedback Recommendation:`);
      console.log(`  Title: ${event.payload.title}`);
      console.log(`  Description: ${event.payload.description}`);
    }
  });
  
  // Simulate some time for data collection
  console.log('\n⏳ Collecting neural data for 10 seconds...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Show current neural data
  console.log('\n📈 Current Neural Data:');
  const currentSignals = neuralInterfaceService.getCurrentSignals();
  const currentMentalState = neuralInterfaceService.getCurrentMentalState();
  const currentFeedback = neuralInterfaceService.getCurrentFeedback();
  
  console.log(`  Signal Count: ${currentSignals.length}`);
  if (currentMentalState) {
    console.log(`  Current Mental State: ${currentMentalState.state} (${currentMentalState.confidence}% confidence)`);
  }
  if (currentFeedback) {
    console.log(`  Current Feedback: ${currentFeedback.type} = ${currentFeedback.value}`);
  }
  
  // Start a neurofeedback session
  console.log('\n🎮 Starting neurofeedback session...');
  const sessionStarted = await neuralInterfaceService.startNeurofeedbackSession(focusProtocol.id);
  
  if (sessionStarted) {
    console.log('✅ Neurofeedback session started successfully');
    
    // Simulate session duration
    console.log('⏳ Running neurofeedback session for 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Neurofeedback session completed');
  } else {
    console.log('❌ Failed to start neurofeedback session');
  }
  
  // Show protocol progress
  console.log('\n📊 Neurofeedback Protocol Progress:');
  const protocols = neuralInterfaceService.getProtocols();
  protocols.forEach(protocol => {
    console.log(`  ${protocol.name}: ${protocol.progressTracking.sessionsCompleted} sessions completed`);
  });
  
  // Show connected devices
  console.log('\n🔌 Connected Devices:');
  const connectedDevices = neuralInterfaceService.getConnectedDevices();
  connectedDevices.forEach(device => {
    console.log(`  ${device.name} (${device.type}) - Quality: ${device.signalQuality}%`);
  });
  
  // Stop monitoring
  console.log('\n⏹️ Stopping neural signal monitoring...');
  neuralInterfaceService.stopMonitoring();
  
  // Disconnect devices
  console.log('\n🔌 Disconnecting from neural interface devices...');
  neuralInterfaceService.disconnectFromDevice('eeg_headset_001');
  neuralInterfaceService.disconnectFromDevice('emg_sensor_001');
  
  console.log('\n🎉 Neural Interface Connectivity Demo Completed Successfully!');
  console.log('\n📋 Summary of Capabilities Demonstrated:');
  console.log('  • Direct integration with Spartan Nervous System for biometric feedback');
  console.log('  • Brain-computer interface for mental state monitoring');
  console.log('  • Neurofeedback training modules');
  console.log('  • Real-time neural signal processing');
  console.log('  • Event-driven communication with the ecosystem');
  
  // Show stored data
  console.log('\n💾 Stored Data:');
  const storedProtocols = storageManager.getNeurofeedbackProtocols();
  const storedDevices = storageManager.getNeuralInterfaceDevices();
  console.log(`  Stored Protocols: ${storedProtocols.length}`);
  console.log(`  Stored Devices: ${storedDevices.length}`);
}

// Run the demo
runNeuralInterfaceDemo().catch(console.error);