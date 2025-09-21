import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedDataVisualizationDashboard from '../components/AdvancedDataVisualizationDashboard';

// Mock the 3D visualization components since they require a WebGL context
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="3d-canvas">{children}</div>,
  useFrame: () => {},
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Text: ({ children }: { children: React.ReactNode }) => <div data-testid="3d-text">{children}</div>,
}));

// Mock the d3 library
jest.mock('d3', () => ({
  interpolateRainbow: () => '#ff0000',
}));

describe('AdvancedDataVisualizationDashboard', () => {
  const mockUserData = {
    name: 'Test User',
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate' as const,
    goals: ['strength'],
  };

  const mockProps = {
    userData: mockUserData,
    workoutSessions: [],
    recoveryData: [],
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<AdvancedDataVisualizationDashboard {...mockProps} />);
    
    expect(screen.getByText('Visualización Avanzada de Datos')).toBeInTheDocument();
    expect(screen.getByText('Análisis 3D y comparativo de tu rendimiento')).toBeInTheDocument();
  });

  it('displays navigation tabs after loading', async () => {
    render(<AdvancedDataVisualizationDashboard {...mockProps} />);
    
    // Advance timers to simulate loading completion
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Datos Biométricos 3D')).toBeInTheDocument();
      expect(screen.getByText('Mapa de Calor de Rendimiento')).toBeInTheDocument();
      expect(screen.getByText('Análisis Comparativo')).toBeInTheDocument();
      expect(screen.getByText('Radar de Rendimiento')).toBeInTheDocument();
    });
  });

  it('shows key metrics section after loading', async () => {
    render(<AdvancedDataVisualizationDashboard {...mockProps} />);
    
    // Advance timers to simulate loading completion
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Métricas Clave')).toBeInTheDocument();
      expect(screen.getByText('Rendimiento')).toBeInTheDocument();
      expect(screen.getByText('Recuperación')).toBeInTheDocument();
      expect(screen.getByText('Energía')).toBeInTheDocument();
    });
  });

  it('shows performance insights section after loading', async () => {
    render(<AdvancedDataVisualizationDashboard {...mockProps} />);
    
    // Advance timers to simulate loading completion
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Insights de Rendimiento')).toBeInTheDocument();
      expect(screen.getByText('Optimiza tu entrenamiento')).toBeInTheDocument();
    });
  });

  it('shows data export section after loading', async () => {
    render(<AdvancedDataVisualizationDashboard {...mockProps} />);
    
    // Advance timers to simulate loading completion
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText('Exportar Datos')).toBeInTheDocument();
      expect(screen.getByText('Exportar como PDF')).toBeInTheDocument();
      expect(screen.getByText('Exportar como CSV')).toBeInTheDocument();
    });
  });
});