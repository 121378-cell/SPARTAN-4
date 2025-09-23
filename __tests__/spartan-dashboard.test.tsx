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

// Mock the UI components
jest.mock('../components/ui', () => ({
  Button: ({ children, onClick, variant }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      className="mock-button"
    >
      {children}
    </button>
  ),
  Card: ({ children, className }: any) => (
    <div className={`mock-card ${className || ''}`}>{children}</div>
  ),
  CardHeader: ({ children }: any) => <div className="mock-card-header">{children}</div>,
  CardTitle: ({ children }: any) => <h3 className="mock-card-title">{children}</h3>,
  CardDescription: ({ children }: any) => <p className="mock-card-description">{children}</p>,
  CardContent: ({ children }: any) => <div className="mock-card-content">{children}</div>
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

  it('shows gamification stats', () => {
    render(<SpartanDashboard {...mockProps} />);
    expect(screen.getByText('Puntos SPARTAN')).toBeInTheDocument();
    expect(screen.getByText('Racha Actual')).toBeInTheDocument();
    expect(screen.getByText('Logros')).toBeInTheDocument();
  });
});