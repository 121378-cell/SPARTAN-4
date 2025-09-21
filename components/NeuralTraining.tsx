import React, { useState, useEffect } from 'react';
import { neuralInterfaceService } from '../lib/neural-interface-service';
import type { MentalStateData, NeuralFeedback, NeurofeedbackProtocol } from '../lib/types';

interface NeuralTrainingProps {
  onBack: () => void;
}

const NeuralTraining: React.FC<NeuralTrainingProps> = ({ onBack }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [mentalState, setMentalState] = useState<MentalStateData | null>(null);
  const [neuralFeedback, setNeuralFeedback] = useState<NeuralFeedback | null>(null);
  const [protocols, setProtocols] = useState<NeurofeedbackProtocol[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    // Initialize the neural interface service
    neuralInterfaceService.initialize();

    // Load protocols
    const loadedProtocols = neuralInterfaceService.getProtocols();
    setProtocols(loadedProtocols);

    // Set up monitoring if it was previously active
    const monitoringInterval = setInterval(() => {
      const currentState = neuralInterfaceService.getCurrentMentalState();
      const currentFeedback = neuralInterfaceService.getCurrentFeedback();
      
      if (currentState) setMentalState(currentState);
      if (currentFeedback) setNeuralFeedback(currentFeedback);
    }, 1000);

    return () => {
      clearInterval(monitoringInterval);
      if (isMonitoring) {
        neuralInterfaceService.stopMonitoring();
      }
    };
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    if (isMonitoring) {
      neuralInterfaceService.stopMonitoring();
    } else {
      neuralInterfaceService.startMonitoring();
    }
    setIsMonitoring(!isMonitoring);
  };

  const startNeurofeedbackSession = async () => {
    if (!selectedProtocol) return;
    
    setIsSessionActive(true);
    const success = await neuralInterfaceService.startNeurofeedbackSession(selectedProtocol);
    
    if (success) {
      // Update protocols to reflect the new session
      const updatedProtocols = neuralInterfaceService.getProtocols();
      setProtocols(updatedProtocols);
    }
    
    // Simulate session duration
    setTimeout(() => {
      setIsSessionActive(false);
    }, 5000);
  };

  const createFocusProtocol = () => {
    const protocol = neuralInterfaceService.createNeurofeedbackProtocol({
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
    
    setProtocols([...protocols, protocol]);
    setSelectedProtocol(protocol.id);
  };

  const createStressProtocol = () => {
    const protocol = neuralInterfaceService.createNeurofeedbackProtocol({
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
    
    setProtocols([...protocols, protocol]);
    setSelectedProtocol(protocol.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Neural Training Interface</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            ← Back to SPARTAN XXII
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monitoring Panel */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Neural Monitoring</h2>
            
            <div className="mb-6">
              <button
                onClick={toggleMonitoring}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isMonitoring 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              
              <div className="mt-4 text-sm text-gray-300">
                Status: {isMonitoring ? 'Active' : 'Inactive'}
              </div>
            </div>

            {mentalState && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Current Mental State</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg capitalize">{mentalState.state}</span>
                    <span className="text-gray-300">{mentalState.confidence}% confidence</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${mentalState.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {neuralFeedback && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Neural Feedback</h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg capitalize">{neuralFeedback.type.replace('_', ' ')}</span>
                    <span className="text-2xl font-bold">{neuralFeedback.value}</span>
                  </div>
                  {neuralFeedback.targetRange && (
                    <div className="mt-2 text-sm text-gray-300">
                      Target range: {neuralFeedback.targetRange[0]} - {neuralFeedback.targetRange[1]}
                    </div>
                  )}
                  {neuralFeedback.recommendations && (
                    <div className="mt-3">
                      <h4 className="font-medium">Recommendations:</h4>
                      <ul className="mt-1 space-y-1">
                        {neuralFeedback.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-300">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Neurofeedback Protocols */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Neurofeedback Protocols</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Create New Protocol</h3>
              <div className="flex space-x-3">
                <button
                  onClick={createFocusProtocol}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Focus Protocol
                </button>
                <button
                  onClick={createStressProtocol}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Stress Protocol
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Select Protocol</h3>
              {protocols.length > 0 ? (
                <div className="space-y-3">
                  {protocols.map((protocol) => (
                    <div 
                      key={protocol.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedProtocol === protocol.id
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedProtocol(protocol.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold">{protocol.name}</h4>
                        <span className="text-sm text-gray-300">
                          {protocol.progressTracking.sessionsCompleted} sessions
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{protocol.description}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        Duration: {protocol.protocol.duration} min | 
                        Frequency: {protocol.protocol.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No protocols created yet. Create one above.
                </div>
              )}
            </div>

            <div>
              <button
                onClick={startNeurofeedbackSession}
                disabled={!selectedProtocol || isSessionActive}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedProtocol && !isSessionActive
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                {isSessionActive ? 'Session Active...' : 'Start Neurofeedback Session'}
              </button>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Neural Interface Connectivity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Biometric Feedback</h3>
              <p className="text-gray-300 text-sm">
                Direct integration with Spartan Nervous System for real-time biometric monitoring through neural interfaces.
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Mental State Monitoring</h3>
              <p className="text-gray-300 text-sm">
                Brain-computer interface for continuous monitoring of cognitive and emotional states.
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Neurofeedback Training</h3>
              <p className="text-gray-300 text-sm">
                Personalized neurofeedback modules for cognitive enhancement and mental performance optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralTraining;