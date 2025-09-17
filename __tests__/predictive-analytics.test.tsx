import React from 'react';
import { render, screen } from '@testing-library/react';
import PredictiveAnalyticsDashboard from '../components/PredictiveAnalyticsDashboard';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  Dumbbell: () => <div data-testid="dumbbell-icon" />,
  Heart: () => <div data-testid="heart-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

// Mock the predictive analytics engine
jest.mock('../lib/predictive-analytics', () => ({
  predictiveAnalyticsEngine: {
    generatePredictions: jest.fn().mockReturnValue({
      projections: [
        {
          timeframe: '3_months',
          strength: {
            squat: 120,
            deadlift: 140,
            benchPress: 95,
            pullUp: 75,
            projectedIncrease: 25.5,
          },
          muscleMass: {
            totalMass: 62,
            leanMass: 59,
            projectedIncrease: 12.3,
          },
          bodyComposition: {
            bodyFatPercentage: 12.5,
            visceralFat: 3,
            projectedDecrease: 2.5,
          },
          confidence: 85,
          keyFactors: ['Aumentar adherencia al entrenamiento para maximizar ganancias'],
        },
      ],
      riskFactors: ['Calidad de sueño deficiente - afecta recuperación y crecimiento muscular'],
      optimizationOpportunities: ['Aumentar adherencia al entrenamiento al 90%+ para maximizar ganancias'],
      personalizedRecommendations: [
        'Aumenta tu adherencia al entrenamiento al 85% o más para maximizar ganancias de fuerza',
        'Prioriza 7-9 horas de sueño de calidad para optimizar la recuperación hormonal',
      ],
    }),
  },
}));

describe('PredictiveAnalyticsDashboard', () => {
  const mockUserData = {
    name: 'Test User',
    age: 30,
    weight: 75,
    height: 180,
    fitnessLevel: 'intermediate' as const,
    goals: ['Muscle Gain', 'Strength'],
  };

  const mockOnBack = jest.fn();

  it('renders without crashing', () => {
    render(
      <PredictiveAnalyticsDashboard
        userData={mockUserData}
        onBack={mockOnBack}
      />
    );

    // Check that the main title is rendered
    expect(screen.getByText('Análisis Predictivo')).toBeInTheDocument();
    
    // Check that the loading state is handled
    expect(screen.getByText(/Proyecciones de evolución basadas en datos actuales/i)).toBeInTheDocument();
  });

  it('displays predictive insights after loading', async () => {
    render(
      <PredictiveAnalyticsDashboard
        userData={mockUserData}
        onBack={mockOnBack}
      />
    );

    // Wait for the component to finish loading
    setTimeout(() => {
      // Check that the projections are displayed
      expect(screen.getByText('120.0kg')).toBeInTheDocument(); // Squat projection
      expect(screen.getByText('62.0kg')).toBeInTheDocument(); // Total muscle mass
      expect(screen.getByText('12.5%')).toBeInTheDocument(); // Body fat percentage
    }, 100);
  });
});