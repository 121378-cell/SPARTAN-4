import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IoTDashboard from '../components/IoTDashboard';
import { iotIntegrationService } from '../lib/iot-integration-service';

// Mock the iotIntegrationService
jest.mock('../lib/iot-integration-service', () => ({
  iotIntegrationService: {
    getConnectedEquipment: jest.fn(),
    getEnvironmentalData: jest.fn(),
    getEnhancedWearableData: jest.fn(),
    generateIoTInsights: jest.fn()
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

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Activity: () => <div data-testid="activity-icon" />,
  Thermometer: () => <div data-testid="thermometer-icon" />,
  Droplets: () => <div data-testid="droplets-icon" />,
  Wind: () => <div data-testid="wind-icon" />,
  Battery: () => <div data-testid="battery-icon" />,
  Wifi: () => <div data-testid="wifi-icon" />,
  AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
  Cpu: () => <div data-testid="cpu-icon" />,
  Gauge: () => <div data-testid="gauge-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />
}));

// Mock recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div className="mock-line-chart">{children}</div>,
  Line: () => <div className="mock-line" />,
  XAxis: () => <div className="mock-x-axis" />,
  YAxis: () => <div className="mock-y-axis" />,
  CartesianGrid: () => <div className="mock-cartesian-grid" />,
  Tooltip: () => <div className="mock-tooltip" />,
  Legend: () => <div className="mock-legend" />,
  ResponsiveContainer: ({ children }: any) => <div className="mock-responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div className="mock-bar-chart">{children}</div>,
  Bar: () => <div className="mock-bar" />,
  PieChart: ({ children }: any) => <div className="mock-pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div className="mock-pie">{children}</div>,
  Cell: () => <div className="mock-cell" />,
  RadarChart: ({ children }: any) => <div className="mock-radar-chart">{children}</div>,
  PolarGrid: () => <div className="mock-polar-grid" />,
  PolarAngleAxis: () => <div className="mock-polar-angle-axis" />,
  PolarRadiusAxis: () => <div className="mock-polar-radius-axis" />,
  Radar: () => <div className="mock-radar" />
}));

// Mock setTimeout to execute immediately
jest.useFakeTimers();

describe('IoTDashboard', () => {
  const mockOnBack = jest.fn();
  const mockUserId = 'test-user-001';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the service methods to return default values
    (iotIntegrationService.getConnectedEquipment as jest.Mock).mockReturnValue([]);
    (iotIntegrationService.getEnvironmentalData as jest.Mock).mockReturnValue(null);
    (iotIntegrationService.getEnhancedWearableData as jest.Mock).mockReturnValue(null);
    (iotIntegrationService.generateIoTInsights as jest.Mock).mockReturnValue({
      equipmentStatus: {
        connected: 0,
        total: 0,
        issues: []
      },
      environmentalConditions: {
        temperature: 0,
        humidity: 0,
        airQuality: 0,
        recommendations: []
      },
      enhancedRecovery: {
        muscleOxygenStatus: 'optimal',
        hydrationStatus: 'optimal',
        thermalStatus: 'optimal'
      },
      synchronizationQuality: 'excellent'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading IoT data...')).toBeInTheDocument();
  });

  it('renders dashboard with no equipment', async () => {
    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    // Advance timers to trigger the data fetch
    jest.advanceTimersByTime(1000);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading IoT data...')).not.toBeInTheDocument();
    });

    // Check that the no equipment message is displayed
    expect(screen.getByText('No connected equipment found')).toBeInTheDocument();
  });

  it('renders dashboard with equipment data', async () => {
    // Mock equipment data
    (iotIntegrationService.getConnectedEquipment as jest.Mock).mockReturnValue([
      {
        id: 'test-band-001',
        name: 'Smart Resistance Band',
        type: 'resistance_band',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 85,
        capabilities: ['tension_measurement'],
        metrics: {}
      }
    ]);

    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    // Advance timers to trigger the data fetch
    jest.advanceTimersByTime(1000);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading IoT data...')).not.toBeInTheDocument();
    });

    // Check that equipment is displayed
    expect(screen.getByText('Smart Resistance Band')).toBeInTheDocument();
    expect(screen.getByText('resistance band')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders dashboard with environmental data', async () => {
    // Mock environmental data
    (iotIntegrationService.getEnvironmentalData as jest.Mock).mockReturnValue({
      timestamp: new Date().toISOString(),
      sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', location: 'Gym' },
        { type: 'humidity', value: 45, unit: '%', location: 'Gym' },
        { type: 'air_quality', value: 85, unit: 'AQI', location: 'Gym', quality: 'good' }
      ],
      airQualityIndex: 85,
      comfortLevel: 'comfortable'
    });

    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    // Advance timers to trigger the data fetch
    jest.advanceTimersByTime(1000);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading IoT data...')).not.toBeInTheDocument();
    });

    // Check that environmental data is displayed
    expect(screen.getByText('22.5')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('renders dashboard with enhanced wearable data', async () => {
    // Mock enhanced wearable data
    (iotIntegrationService.getEnhancedWearableData as jest.Mock).mockReturnValue({
      standardData: {
        source: 'garmin',
        sleep: { 
          duration: 420, 
          quality: 85, 
          deepSleep: 120, 
          remSleep: 90, 
          lightSleep: 210,
          wakeTimes: 3, 
          bedtime: '22:45', 
          wakeTime: '06:45',
          sleepEfficiency: 91,
          sleepLatency: 12
        },
        activity: { 
          steps: 12450, 
          calories: 2800, 
          activeMinutes: 120, 
          workoutType: 'Running', 
          workoutDuration: 45,
          vo2max: 58.2,
          trainingLoad: 72,
          lactateThreshold: 165,
          maxHeartRate: 188,
          zones: { zone1: 15, zone2: 20, zone3: 8, zone4: 2, zone5: 0 }
        },
        recovery: { 
          hrv: 65, 
          restingHeartRate: 48, 
          stress: 32,
          recoveryScore: 78,
          autonomicBalance: 1.2
        },
        vitals: {
          bloodPressure: {
            systolic: 118,
            diastolic: 76,
            pulse: 48,
            timestamp: new Date().toISOString()
          },
          glucose: {
            current: 95,
            average24h: 102,
            timeInRange: 82,
            variability: 18,
            timestamp: new Date().toISOString()
          },
          temperature: {
            body: 36.8,
            skin: 33.2,
            variance: 0.3
          },
          hydration: {
            level: 85,
            electrolytes: {
              sodium: 140,
              potassium: 4.2,
              magnesium: 2.1
            }
          },
          inflammation: {
            crp: 0.8,
            il6: 1.2,
            score: 88
          }
        },
        performance: {
          fitnessAge: 28,
          recoveryTime: 18,
          trainingReadiness: 85,
          metabolicEfficiency: 76,
          powerOutput: {
            ftp: 285,
            critical: 320,
            anaerobic: 450
          },
          cognitiveLoad: 42
        },
        lastSync: new Date().toISOString()
      },
      additionalMetrics: {
        muscleOxygen: 68,
        bodyTemperature: 36.8,
        gsr: 15,
        emg: 45,
        posture: {
          angle: 5,
          position: 'upright'
        }
      },
      synchronizationQuality: 'excellent',
      dataCompleteness: 95
    });

    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    // Advance timers to trigger the data fetch
    jest.advanceTimersByTime(1000);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading IoT data...')).not.toBeInTheDocument();
    });

    // Check that enhanced wearable data is displayed
    expect(screen.getByText('68%')).toBeInTheDocument();
    expect(screen.getByText('5°')).toBeInTheDocument();
    expect(screen.getByText('excellent')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    render(
      <BrowserRouter>
        <IoTDashboard onBack={mockOnBack} userId={mockUserId} />
      </BrowserRouter>
    );

    // Advance timers to trigger the data fetch
    jest.advanceTimersByTime(1000);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading IoT data...')).not.toBeInTheDocument();
    });

    // Find and click the back button
    const backButton = screen.getByText('Back');
    backButton.click();

    // Check that onBack was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});