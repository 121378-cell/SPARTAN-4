/**
 * Test suite for Dashboard component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';

// Mock the auth manager
jest.mock('../lib/auth', () => ({
  authManager: {
    subscribe: jest.fn().mockImplementation((callback) => {
      callback({ user: { name: 'Test User' } });
      return jest.fn(); // unsubscribe function
    })
  }
}));

// Mock the habit tracking and notification services
jest.mock('../lib/habit-tracking', () => ({
  habitTrackingService: {
    predictTrainingPatterns: jest.fn()
  }
}));

jest.mock('../lib/notification-service', () => ({
  notificationService: {
    generateContextualNotifications: jest.fn()
  }
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  User: () => <div data-testid="user-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Utensils: () => <div data-testid="utensils-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Droplets: () => <div data-testid="droplets-icon" />,
  StretchHorizontal: () => <div data-testid="stretch-horizontal-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
  Microscope: () => <div data-testid="microscope-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Bell: () => <div data-testid="bell-icon" />,
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Dumbbell: () => <div data-testid="dumbbell-icon" />
}));

describe('Dashboard', () => {
  const mockUserData: UserData = {
    name: 'Test User',
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate',
    goals: ['Muscle Gain', 'Strength']
  };

  const mockWorkoutPlans: WorkoutPlan[] = [
    {
      id: 'plan-1',
      name: 'Strength Plan',
      description: 'A strength focused plan',
      focus: ['fuerza'],
      days: [{ day: 1, focus: 'fuerza', exercises: [] }],
      duration: 60,
      createdAt: new Date(),
      updatedAt: new Date(),
      difficulty: 'intermediate',
      equipment: ['barbell']
    }
  ];

  const mockProgressData: ProgressData[] = [
    {
      workoutId: 'plan-1',
      date: new Date(),
      notes: 'Great session'
    }
  ];

  const mockHandlers = {
    onGenerateWorkout: jest.fn(),
    isGeneratingWorkout: false,
    onSelectWorkout: jest.fn(),
    onProfileClick: jest.fn(),
    onNavigateToRecipes: jest.fn(),
    onNavigateToCircadian: jest.fn(),
    onNavigateToWearable: jest.fn(),
    onNavigateToBloodTestAnalyzer: jest.fn(),
    onNavigateToOverloadDetection: jest.fn(),
    onNavigateToProgress: jest.fn(),
    onNavigateToProgressComparison: jest.fn(),
    onNavigateToWorkoutFlow: jest.fn(),
    onNavigateToPredictiveAnalytics: jest.fn(),
    onLogout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the notification service
    const notificationService = require('../lib/notification-service').notificationService;
    notificationService.generateContextualNotifications.mockReturnValue([
      '¡Hace varios días que no entrenas! ¿Listo para volver a la acción?'
    ]);
    
    // Mock the habit tracking service
    const habitTrackingService = require('../lib/habit-tracking').habitTrackingService;
    habitTrackingService.predictTrainingPatterns.mockReturnValue({
      nextLikelySession: new Date(),
      recommendedTimes: ['07:00'],
      recommendedDays: [1],
      averageDuration: 60
    });
  });

  it('should render the dashboard with user greeting', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('¡Hola, Test User! 👋')).toBeInTheDocument();
    expect(screen.getByText('SPARTAN 4')).toBeInTheDocument();
  });

  it('should display notifications when available', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('¡Hace varios días que no entrenas! ¿Listo para volver a la acción?')).toBeInTheDocument();
  });

  it('should display predicted next session', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Próxima Sesión Predicha')).toBeInTheDocument();
  });

  it('should switch between tabs when navigation buttons are clicked', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    // Check that dashboard tab is active by default
    expect(screen.getByText('Panel Principal')).toHaveClass('bg-gradient-to-r');

    // Click on workouts tab
    const workoutsTab = screen.getByText('Entrenamientos');
    fireEvent.click(workoutsTab);

    // Click on progress tab
    const progressTab = screen.getByText('Progreso');
    fireEvent.click(progressTab);
  });

  it('should call appropriate handlers when action buttons are clicked', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    // Test profile button
    const profileButton = screen.getByTestId('user-icon');
    fireEvent.click(profileButton);
    expect(mockHandlers.onProfileClick).toHaveBeenCalled();

    // Test logout button
    const logoutButton = screen.getByTestId('logout-icon');
    fireEvent.click(logoutButton);
    expect(mockHandlers.onLogout).toHaveBeenCalled();

    // Test quick action buttons
    const recipesButton = screen.getByText('Recetas');
    fireEvent.click(recipesButton);
    expect(mockHandlers.onNavigateToRecipes).toHaveBeenCalled();

    const circadianButton = screen.getByText('Ritmo Circadiano');
    fireEvent.click(circadianButton);
    expect(mockHandlers.onNavigateToCircadian).toHaveBeenCalled();
  });

  it('should display workout statistics correctly', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Entrenamientos Completados')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // Based on progress data

    expect(screen.getByText('Último Plan de Entrenamiento')).toBeInTheDocument();
    expect(screen.getByText('Strength Plan')).toBeInTheDocument();
  });

  it('should display recent workout plans', () => {
    render(
      <Dashboard
        userData={mockUserData}
        workoutPlans={mockWorkoutPlans}
        progressData={mockProgressData}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Planes de Entrenamiento Recientes')).toBeInTheDocument();
    expect(screen.getByText('Strength Plan')).toBeInTheDocument();
  });
});