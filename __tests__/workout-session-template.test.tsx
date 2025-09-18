/**
 * Test suite for WorkoutSessionTemplate component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutSessionTemplate from '../components/WorkoutSessionTemplate';
import type { WorkoutPlan } from '../lib/types';

// Mock the storage manager
jest.mock('../lib/storage', () => ({
  storageManager: {
    addProgressData: jest.fn()
  }
}));

// Mock the habit tracking service
jest.mock('../lib/habit-tracking', () => ({
  habitTrackingService: {
    recordWorkoutSession: jest.fn()
  }
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Dumbbell: () => <div data-testid="dumbbell-icon" />,
  RotateCcw: () => <div data-testid="rotate-ccw-icon" />,
  Save: () => <div data-testid="save-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  ChevronLeft: () => <div data-testid="chevron-left-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Play: () => <div data-testid="play-icon" />,
  Square: () => <div data-testid="square-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />
}));

describe('WorkoutSessionTemplate', () => {
  const mockWorkoutPlan: WorkoutPlan = {
    id: 'test-plan-1',
    name: 'Test Workout Plan',
    description: 'A test workout plan',
    focus: ['strength'],
    days: [
      {
        day: 1,
        focus: 'strength',
        exercises: [
          {
            name: 'Bench Press',
            sets: 3,
            reps: '8-12',
            rest: 90,
            equipment: 'barbell',
            notes: 'Warm up set first'
          },
          {
            name: 'Squats',
            sets: 3,
            reps: '10-15',
            rest: 120,
            equipment: 'barbell',
            notes: 'Focus on form'
          }
        ]
      }
    ],
    duration: 60,
    createdAt: new Date(),
    updatedAt: new Date(),
    difficulty: 'intermediate',
    equipment: ['barbell']
  };

  const mockSelectedDate = new Date();
  const mockOnBack = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the workout session template with correct information', () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Test Workout Plan')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();
  });

  it('should automatically start the session when component mounts', async () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Wait for the auto-start to happen
    await waitFor(() => {
      expect(screen.getByText('Sesión Iniciada Automáticamente')).toBeInTheDocument();
    });
  });

  it('should allow manual session start/stop', () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Find and click the start button
    const startButton = screen.getByText('Iniciar Entreno');
    fireEvent.click(startButton);

    // Check that the stop button appears
    expect(screen.getByText('Finalizar')).toBeInTheDocument();

    // Click the stop button
    const stopButton = screen.getByText('Finalizar');
    fireEvent.click(stopButton);

    // Check that the start button appears again
    expect(screen.getByText('Iniciar Entreno')).toBeInTheDocument();
  });

  it('should update exercise set data when inputs change', () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Find the weight input for the first set of Bench Press
    const weightInput = screen.getByPlaceholderText('0');
    fireEvent.change(weightInput, { target: { value: '100' } });

    expect(weightInput).toHaveValue('100');
  });

  it('should save session data when save button is clicked', async () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    // Click the save button
    const saveButton = screen.getByText('Completar Sesión');
    fireEvent.click(saveButton);

    // Wait for the save to complete
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('should show progress tracking', () => {
    render(
      <WorkoutSessionTemplate
        workoutPlan={mockWorkoutPlan}
        selectedDate={mockSelectedDate}
        onBack={mockOnBack}
        onComplete={mockOnComplete}
      />
    );

    expect(screen.getByText('Progreso del Entreno')).toBeInTheDocument();
  });
});