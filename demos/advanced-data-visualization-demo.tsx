/**
 * Advanced Data Visualization Demo for SPARTAN 4
 * Demonstrates the implementation of 3D biométric data representation,
 * real-time performance heatmaps, and comparative analytics
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import AdvancedDataVisualizationDashboard from '../components/AdvancedDataVisualizationDashboard';

// Mock data for demonstration
const mockUserData = {
  name: 'Alex Spartan',
  age: 28,
  weight: 78,
  height: 182,
  fitnessLevel: 'advanced' as const,
  goals: ['strength', 'endurance']
};

const mockProgressReport = {
  startDate: new Date('2025-09-01'),
  endDate: new Date('2025-09-07'),
  totalWorkouts: 5,
  averageWorkoutDuration: 72,
  caloriesBurned: 2850,
  strengthGains: {
    squat: { current: 120, previous: 110, unit: 'kg' },
    benchPress: { current: 85, previous: 80, unit: 'kg' },
    deadlift: { current: 160, previous: 150, unit: 'kg' }
  },
  enduranceMetrics: {
    vo2max: { current: 48, previous: 45, unit: 'ml/kg/min' },
    restingHeartRate: { current: 52, previous: 55, unit: 'bpm' }
  }
};

const mockWorkoutSessions = [
  {
    id: '1',
    workoutPlanId: 'plan1',
    date: new Date('2025-09-01'),
    startTime: new Date('2025-09-01T07:00:00'),
    endTime: new Date('2025-09-01T08:15:00'),
    duration: 75,
    exercises: [
      {
        exerciseId: 'squat',
        name: 'Sentadilla',
        sets: [
          { setNumber: 1, weight: 80, reps: 8, rpe: 7, tempo: '3-1-2', rest: 90, notes: '' },
          { setNumber: 2, weight: 90, reps: 6, rpe: 8, tempo: '3-1-2', rest: 120, notes: '' },
          { setNumber: 3, weight: 100, reps: 5, rpe: 9, tempo: '3-1-2', rest: 150, notes: '' }
        ]
      }
    ],
    notes: 'Buena forma, músculos activos'
  }
];

const mockRecoveryData = [
  {
    date: new Date('2025-09-01'),
    energyLevel: 8,
    muscleSoreness: 3,
    sleepQuality: 9,
    stressLevel: 2,
    motivation: 9,
    notes: 'Excelente recuperación'
  }
];

const AdvancedDataVisualizationDemo = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Demo: Visualización Avanzada de Datos</h1>
      <p className="mb-6">Esta demo muestra las capacidades de visualización avanzada de datos biométricos en 3D, mapas de calor de rendimiento y análisis comparativo.</p>
      
      <AdvancedDataVisualizationDashboard
        userData={mockUserData}
        progressReport={mockProgressReport}
        workoutSessions={mockWorkoutSessions}
        recoveryData={mockRecoveryData}
        onBack={() => console.log('Volver al dashboard principal')}
      />
    </div>
  );
};

// Render the demo if we're in a browser environment
if (typeof document !== 'undefined') {
  const container = document.getElementById('advanced-data-visualization-demo');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<AdvancedDataVisualizationDemo />);
  }
}

export default AdvancedDataVisualizationDemo;