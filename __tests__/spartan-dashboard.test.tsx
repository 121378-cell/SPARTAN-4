import React from 'react';
import { render, screen } from '@testing-library/react';
import SpartanDashboard from '../components/SpartanDashboard';
import type { TrainingLevel } from '../lib/types';

// Mock the ChatMaestro component since it's complex
jest.mock('../components/ChatMaestro', () => {
  return function MockChatMaestro() {
    return <div data-testid="chat-maestro">Chat Maestro Component</div>;
  };
});

// Mock the spartan-nervous-system
jest.mock('../lib/spartan-nervous-system', () => ({
  spartanNervousSystem: {
    subscribe: jest.fn(),
    cleanup: jest.fn(),
    dismissAlert: jest.fn(),
    executeRecommendation: jest.fn()
  }
}));

// Mock the data-management-service
jest.mock('../lib/data-management-service', () => ({
  dataManagementService: {
    initialize: jest.fn(),
    cleanup: jest.fn()
  }
}));

describe('SpartanDashboard', () => {
  const mockProps = {
    userId: 'test-user-123',
    userData: {
      name: 'Test User',
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: 'intermediate' as TrainingLevel,
      goals: ['strength', 'muscle_gain']
    },
    workoutPlans: [],
    progressData: [],
    onLogout: jest.fn(),
    onNavigate: jest.fn()
  };

  it('renders without crashing', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText('SPARTAN 4')).toBeInTheDocument();
  });

  it('displays welcome message with user name', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText(/¡Hola, Test User!/)).toBeInTheDocument();
  });

  it('shows system status bar', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText('Ecosistema en línea')).toBeInTheDocument();
  });

  it('renders quick action buttons', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText('Diseña tu Plan')).toBeInTheDocument();
    expect(screen.getByText('Calendario')).toBeInTheDocument();
    expect(screen.getByText('Progreso')).toBeInTheDocument();
    expect(screen.getByText('Nutrición')).toBeInTheDocument();
  });

  it('shows gamification stats', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText('Puntos SPARTAN')).toBeInTheDocument();
    expect(screen.getByText('Racha Actual')).toBeInTheDocument();
    expect(screen.getByText('Logros')).toBeInTheDocument();
  });

  it('renders tactical calendar when selected', () => {
    render(<SpartanDashboard {...mockProps} />);
    // Calendar view is not default, but component should handle the view switch
    expect(screen.getByText('Calendario Táctico Visual')).toBeInTheDocument();
  });

  it('shows biométric data visualization', () => {
    render(<SpartanDashboard {...mockProps} />);
    // Analytics view is not default, but component should handle the view switch
    expect(screen.getByText('Visualización de Datos Biométricos')).toBeInTheDocument();
  });
});