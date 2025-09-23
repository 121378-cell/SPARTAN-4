import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Activity, Thermometer, Droplets, Wind, Battery, Wifi, AlertTriangle, CheckCircle, Zap, Cpu, Gauge, TrendingUp, MapPin } from "lucide-react";
import { iotIntegrationService, EquipmentData, EnvironmentalData, EnhancedWearableData, IoTInsights } from '../lib/iot-integration-service';

interface IoTDashboardProps {
  onBack: () => void;
  userId: string;
}

// Export for testing purposes
export const LOADING_DELAY = process.env.NODE_ENV === 'test' ? 0 : 1000;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function IoTDashboard({ onBack, userId }: IoTDashboardProps) {
  const [equipment, setEquipment] = useState<EquipmentData[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [enhancedWearableData, setEnhancedWearableData] = useState<EnhancedWearableData | null>(null);
  const [iotInsights, setIotInsights] = useState<IoTInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');

  // Simulate fetching IoT data
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      // Simulate API calls with timeout
      setTimeout(() => {
        // Get equipment data
        const equipmentData = iotIntegrationService.getConnectedEquipment();
        setEquipment(equipmentData);
        
        // Get environmental data
        const envData = iotIntegrationService.getEnvironmentalData();
        setEnvironmentalData(envData || generateMockEnvironmentalData());
        
        // Get enhanced wearable data
        const wearableData = iotIntegrationService.getEnhancedWearableData();
        setEnhancedWearableData(wearableData || generateMockEnhancedWearableData());
        
        // Generate insights
        const insights = iotIntegrationService.generateIoTInsights();
        setIotInsights(insights);
        
        setLoading(false);
      }, LOADING_DELAY);
    };
    
    fetchData();
    
    // Set up interval to refresh data
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [timeframe]);

  // Generate mock environmental data
  const generateMockEnvironmentalData = (): EnvironmentalData => {
    const now = new Date().toISOString();
    return {
      timestamp: now,
      sensors: [
        { type: 'temperature', value: 22.5, unit: '°C', location: 'Gym' },
        { type: 'humidity', value: 45, unit: '%', location: 'Gym' },
        { type: 'air_quality', value: 85, unit: 'AQI', location: 'Gym', quality: 'good' },
        { type: 'pressure', value: 1013.25, unit: 'hPa', location: 'Gym' },
        { type: 'light', value: 450, unit: 'lux', location: 'Gym' }
      ],
      airQualityIndex: 85,
      comfortLevel: 'comfortable'
    };
  };

  // Generate mock enhanced wearable data
  const generateMockEnhancedWearableData = (): EnhancedWearableData => {
    return {
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
    };
  };

  // Prepare data for charts
  const prepareEnvironmentalChartData = () => {
    if (!environmentalData) return [];
    
    return environmentalData.sensors.map(sensor => ({
      name: sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1),
      value: sensor.value,
      unit: sensor.unit
    }));
  };

  const prepareEquipmentStatusData = () => {
    if (!iotInsights) return [];
    
    return [
      { name: 'Connected', value: iotInsights.equipmentStatus.connected },
      { name: 'Disconnected', value: iotInsights.equipmentStatus.total - iotInsights.equipmentStatus.connected }
    ];
  };

  const prepareRecoveryMetricsData = () => {
    if (!enhancedWearableData) return [];
    
    return [
      { name: 'HRV', value: enhancedWearableData.standardData.recovery.hrv },
      { name: 'Sleep Quality', value: enhancedWearableData.standardData.sleep.quality },
      { name: 'Muscle Oxygen', value: enhancedWearableData.additionalMetrics.muscleOxygen || 0 },
      { name: 'Hydration', value: enhancedWearableData.standardData.vitals.hydration?.level || 0 }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">IoT Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive view of your connected equipment and environmental conditions.
              </p>
            </div>
            <Button variant="outline" size="default" onClick={onBack}>
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="py-12 text-center">
              <p>Loading IoT data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">IoT Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive view of your connected equipment and environmental conditions.
            </p>
          </div>
          <Button variant="outline" size="default" onClick={onBack}>
            Back
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wifi className="h-4 w-4" />Connected Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {iotInsights?.equipmentStatus.connected || 0}/{iotInsights?.equipmentStatus.total || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active devices</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Thermometer className="h-4 w-4" />Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {environmentalData?.sensors.find(s => s.type === 'temperature')?.value.toFixed(1) || 'N/A'}
                <span className="text-sm font-normal">°C</span>
              </div>
              <div className="text-sm text-muted-foreground">Current</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Droplets className="h-4 w-4" />Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {environmentalData?.sensors.find(s => s.type === 'humidity')?.value || 'N/A'}%
              </div>
              <div className="text-sm text-muted-foreground">Relative</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wind className="h-4 w-4" />Air Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {environmentalData?.airQualityIndex || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">AQI</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Equipment Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />Connected Equipment
            </CardTitle>
            <CardDescription>Overview of your smart fitness equipment</CardDescription>
          </CardHeader>
          <CardContent>
            {equipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((device) => (
                  <Card key={device.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{device.type.replace('_', ' ')}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {device.connected ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      {device.batteryLevel !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm">
                            <span>Battery</span>
                            <span>{device.batteryLevel}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                device.batteryLevel > 50 ? 'bg-green-500' : 
                                device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${device.batteryLevel}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 text-xs text-muted-foreground">
                        Last sync: {new Date(device.lastSync).toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Wifi className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No connected equipment found</p>
                <Button variant="outline" className="mt-3">Connect New Device</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Environmental Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />Environmental Conditions
              </CardTitle>
              <CardDescription>Real-time sensor data from your environment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareEnvironmentalChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />Environmental Summary
              </CardTitle>
              <CardDescription>Comfort and quality metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareEnvironmentalChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareEnvironmentalChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {environmentalData?.comfortLevel && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium capitalize">{environmentalData.comfortLevel} conditions</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Recovery Metrics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />Enhanced Recovery Metrics
            </CardTitle>
            <CardDescription>Advanced biometric data from enhanced wearable synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={prepareRecoveryMetricsData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Metrics" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {enhancedWearableData?.additionalMetrics.muscleOxygen !== undefined && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Droplets className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Muscle Oxygen</h4>
                        <p className="text-sm text-muted-foreground">Tissue oxygenation level</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{enhancedWearableData.additionalMetrics.muscleOxygen}%</div>
                      <div className={`text-xs ${
                        enhancedWearableData.additionalMetrics.muscleOxygen > 60 ? 'text-green-600' : 
                        enhancedWearableData.additionalMetrics.muscleOxygen > 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {enhancedWearableData.additionalMetrics.muscleOxygen > 60 ? 'Optimal' : 
                         enhancedWearableData.additionalMetrics.muscleOxygen > 50 ? 'Good' : 'Concern'}
                      </div>
                    </div>
                  </div>
                )}
                
                {enhancedWearableData?.additionalMetrics.posture && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Posture</h4>
                        <p className="text-sm text-muted-foreground">Body alignment during activity</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{enhancedWearableData.additionalMetrics.posture.angle}°</div>
                      <div className={`text-xs ${
                        enhancedWearableData.additionalMetrics.posture.position === 'upright' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {enhancedWearableData.additionalMetrics.posture.position}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Synchronization</h4>
                      <p className="text-sm text-muted-foreground">Quality of data transfer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold capitalize">{enhancedWearableData?.synchronizationQuality || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground">
                      {enhancedWearableData?.dataCompleteness || 0}% complete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Issues and Recommendations */}
        {iotInsights && iotInsights.equipmentStatus.issues.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />Equipment Issues
              </CardTitle>
              <CardDescription>Problems detected with your connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {iotInsights.equipmentStatus.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {environmentalData && environmentalData.sensors.some(s => s.quality === 'poor') && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />Environmental Warnings
              </CardTitle>
              <CardDescription>Suboptimal conditions detected in your environment</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {environmentalData.sensors
                  .filter(s => s.quality === 'poor')
                  .map((sensor, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Poor {sensor.type} quality detected: {sensor.value}{sensor.unit}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}