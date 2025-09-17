
import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, Progress, Badge } from "./ui";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from "recharts";
import { Activity, HeartPulse, Moon, BatteryFull, Zap, AlertCircle, TrendingUp, TrendingDown, ArrowLeft, Droplets, Target, Brain, Wind, Shield, Gauge, Award, Clock, Thermometer } from "lucide-react";
import React from "react";

interface WearableIntegrationProps {
    onBack: () => void;
}

type WearableData = {
  source: 'garmin' | 'apple' | 'fitbit' | 'oura' | 'whoop';
  sleep: {
    duration: number; // in minutes
    quality: number; // 1-100
    deepSleep: number; // minutes
    remSleep: number; // minutes
    lightSleep: number; // minutes
    wakeTimes: number;
    bedtime: string;
    wakeTime: string;
    sleepEfficiency: number; // percentage
    sleepLatency: number; // minutes to fall asleep
  };
  activity: {
    steps: number;
    calories: number;
    activeMinutes: number;
    workoutType?: string;
    workoutDuration?: number;
    vo2max: number; // ml/kg/min
    trainingLoad: number; // 1-100
    lactateThreshold: number; // bpm
    maxHeartRate: number; // bpm
    zones: {
      zone1: number; // minutes
      zone2: number;
      zone3: number;
      zone4: number;
      zone5: number;
    };
  };
  recovery: {
    hrv: number; // Heart Rate Variability
    restingHeartRate: number;
    readiness?: number; // Oura/Whoop
    stress: number; // 1-100
    recoveryScore: number; // 1-100
    autonomicBalance: number; // sympathetic/parasympathetic ratio
  };
  vitals: {
    bloodPressure: {
      systolic: number;
      diastolic: number;
      pulse: number;
      timestamp: string;
    };
    glucose: {
      current: number; // mg/dL
      average24h: number;
      timeInRange: number; // percentage
      variability: number;
      timestamp: string;
    };
    temperature: {
      body: number; // celsius
      skin: number;
      variance: number;
    };
    hydration: {
      level: number; // 1-100
      electrolytes: {
        sodium: number;
        potassium: number;
        magnesium: number;
      };
    };
    inflammation: {
      crp: number; // C-reactive protein
      il6: number; // Interleukin-6
      score: number; // 1-100
    };
  };
  performance: {
    fitnessAge: number;
    recoveryTime: number; // hours
    trainingReadiness: number; // 1-100
    metabolicEfficiency: number; // 1-100
    powerOutput: {
      ftp: number; // watts
      critical: number;
      anaerobic: number;
    };
    cognitiveLoad: number; // 1-100
  };
  lastSync: string;
};

type HealthInsight = {
  category: 'cardiovascular' | 'metabolic' | 'recovery' | 'performance' | 'cognitive' | 'sleep';
  severity: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  title: string;
  description: string;
  value: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendation: string;
  confidence: number; // 1-100
};

type BiomarkerTrend = {
  metric: string;
  current: number;
  baseline: number;
  change: number;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'concern';
};

type Recommendation = {
  type: 'sleep' | 'activity' | 'nutrition' | 'recovery' | 'cardiovascular' | 'metabolic' | 'cognitive';
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  action?: string;
  icon: React.ReactElement;
  timeframe: string;
  expectedImprovement: string;
};

export default function WearableIntegration({ onBack }: WearableIntegrationProps) {
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [healthData, setHealthData] = useState<any[]>([]);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [biomarkerTrends, setBiomarkerTrends] = useState<BiomarkerTrend[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceScore, setPerformanceScore] = useState(0);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);

  // Simulate connecting to wearable devices
  useEffect(() => {
    const devices = ['Garmin Forerunner 955', 'Apple Watch Series 8', 'Oura Ring Gen3'];
    setConnectedDevices(devices);
    setSelectedDevice(devices[0]);
  }, []);

  // Simulate fetching comprehensive health data from the wearable
  useEffect(() => {
    if (!selectedDevice) return;

    setLoading(true);
    
    // Simulate API call with comprehensive health data
    setTimeout(() => {
      let data: WearableData;
      
      if (selectedDevice.includes('Garmin')) {
        data = {
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
        };
      } else if (selectedDevice.includes('Apple')) {
        data = {
          source: 'apple',
          sleep: { 
            duration: 390, 
            quality: 78, 
            deepSleep: 95, 
            remSleep: 85, 
            lightSleep: 210,
            wakeTimes: 5, 
            bedtime: '23:30', 
            wakeTime: '07:00',
            sleepEfficiency: 86,
            sleepLatency: 18
          },
          activity: { 
            steps: 8900, 
            calories: 2400, 
            activeMinutes: 90, 
            workoutType: 'HIIT', 
            workoutDuration: 30,
            vo2max: 52.8,
            trainingLoad: 58,
            lactateThreshold: 158,
            maxHeartRate: 185,
            zones: { zone1: 12, zone2: 15, zone3: 3, zone4: 0, zone5: 0 }
          },
          recovery: { 
            hrv: 58, 
            restingHeartRate: 52, 
            stress: 45,
            recoveryScore: 68,
            autonomicBalance: 0.9
          },
          vitals: {
            bloodPressure: {
              systolic: 125,
              diastolic: 82,
              pulse: 52,
              timestamp: new Date().toISOString()
            },
            glucose: {
              current: 108,
              average24h: 115,
              timeInRange: 76,
              variability: 22,
              timestamp: new Date().toISOString()
            },
            temperature: {
              body: 37.1,
              skin: 33.8,
              variance: 0.5
            },
            hydration: {
              level: 72,
              electrolytes: {
                sodium: 135,
                potassium: 3.8,
                magnesium: 1.9
              }
            },
            inflammation: {
              crp: 1.5,
              il6: 2.1,
              score: 72
            }
          },
          performance: {
            fitnessAge: 35,
            recoveryTime: 24,
            trainingReadiness: 72,
            metabolicEfficiency: 68,
            powerOutput: {
              ftp: 245,
              critical: 275,
              anaerobic: 380
            },
            cognitiveLoad: 58
          },
          lastSync: new Date().toISOString()
        };
      } else { // Oura
        data = {
          source: 'oura',
          sleep: { 
            duration: 450, 
            quality: 92, 
            deepSleep: 130, 
            remSleep: 110, 
            lightSleep: 210,
            wakeTimes: 2, 
            bedtime: '22:15', 
            wakeTime: '06:45',
            sleepEfficiency: 94,
            sleepLatency: 8
          },
          activity: { 
            steps: 7500, 
            calories: 2100, 
            activeMinutes: 60,
            vo2max: 48.5,
            trainingLoad: 45,
            lactateThreshold: 152,
            maxHeartRate: 180,
            zones: { zone1: 45, zone2: 15, zone3: 0, zone4: 0, zone5: 0 }
          },
          recovery: { 
            hrv: 72, 
            restingHeartRate: 46, 
            readiness: 88, 
            stress: 25,
            recoveryScore: 92,
            autonomicBalance: 1.4
          },
          vitals: {
            bloodPressure: {
              systolic: 112,
              diastolic: 72,
              pulse: 46,
              timestamp: new Date().toISOString()
            },
            glucose: {
              current: 88,
              average24h: 92,
              timeInRange: 95,
              variability: 12,
              timestamp: new Date().toISOString()
            },
            temperature: {
              body: 36.6,
              skin: 32.8,
              variance: 0.2
            },
            hydration: {
              level: 92,
              electrolytes: {
                sodium: 142,
                potassium: 4.5,
                magnesium: 2.3
              }
            },
            inflammation: {
              crp: 0.4,
              il6: 0.8,
              score: 94
            }
          },
          performance: {
            fitnessAge: 25,
            recoveryTime: 12,
            trainingReadiness: 92,
            metabolicEfficiency: 85,
            powerOutput: {
              ftp: 220,
              critical: 240,
              anaerobic: 320
            },
            cognitiveLoad: 28
          },
          lastSync: new Date().toISOString()
        };
      }
      
      setWearableData(data);
  const generateComprehensiveAnalysis = (data: WearableData) => {
    // Generate health insights
    const insights: HealthInsight[] = [];
    
    // Cardiovascular analysis
    const cardioScore = calculateCardiovascularHealth(data);
    insights.push({
      category: 'cardiovascular',
      severity: cardioScore > 85 ? 'excellent' : cardioScore > 70 ? 'good' : cardioScore > 55 ? 'fair' : 'poor',
      title: 'Cardiovascular Health',
      description: `Your cardiovascular system shows ${cardioScore > 80 ? 'excellent' : cardioScore > 65 ? 'good' : 'concerning'} indicators`,
      value: cardioScore,
      trend: data.recovery.hrv > 60 ? 'improving' : 'stable',
      recommendation: cardioScore < 70 ? 'Focus on aerobic base building and recovery' : 'Maintain current cardiovascular training',
      confidence: 92
    });
    
    // Metabolic analysis
    const metabolicScore = calculateMetabolicHealth(data);
    insights.push({
      category: 'metabolic',
      severity: metabolicScore > 85 ? 'excellent' : metabolicScore > 70 ? 'good' : metabolicScore > 55 ? 'fair' : 'poor',
      title: 'Metabolic Efficiency',
      description: `Your metabolic profile indicates ${metabolicScore > 80 ? 'optimal' : 'suboptimal'} glucose regulation`,
      value: metabolicScore,
      trend: data.vitals.glucose.timeInRange > 80 ? 'improving' : 'declining',
      recommendation: metabolicScore < 75 ? 'Consider intermittent fasting and low-glycemic nutrition' : 'Maintain metabolic flexibility',
      confidence: 87
    });
    
    // Performance analysis
    const perfScore = calculatePerformanceScore(data);
    setPerformanceScore(perfScore);
    
    setHealthInsights(insights);
    generateBiomarkerTrends(data);
    generateAdvancedRecommendations(data);
    assessHealthRisks(data);
  };
  
  const calculateCardiovascularHealth = (data: WearableData): number => {
    const hrvScore = Math.min((data.recovery.hrv / 70) * 25, 25);
    const rhrScore = Math.max(25 - (data.recovery.restingHeartRate - 40) * 0.5, 0);
    const bpScore = data.vitals.bloodPressure.systolic < 120 && data.vitals.bloodPressure.diastolic < 80 ? 25 : 
                   data.vitals.bloodPressure.systolic < 140 && data.vitals.bloodPressure.diastolic < 90 ? 15 : 5;
    const vo2Score = Math.min((data.activity.vo2max / 60) * 25, 25);
    
    return Math.round(hrvScore + rhrScore + bpScore + vo2Score);
  };
  
  const calculateMetabolicHealth = (data: WearableData): number => {
    const glucoseScore = data.vitals.glucose.current < 100 ? 30 : data.vitals.glucose.current < 126 ? 20 : 10;
    const tirScore = (data.vitals.glucose.timeInRange / 100) * 25;
    const variabilityScore = data.vitals.glucose.variability < 15 ? 25 : data.vitals.glucose.variability < 25 ? 15 : 5;
    const inflammationScore = (data.vitals.inflammation.score / 100) * 20;
    
    return Math.round(glucoseScore + tirScore + variabilityScore + inflammationScore);
  };
  
  const calculatePerformanceScore = (data: WearableData): number => {
    const recoveryWeight = 0.3;
    const fitnessWeight = 0.25;
    const sleepWeight = 0.25;
    const stressWeight = 0.2;
    
    const recoveryScore = data.recovery.recoveryScore;
    const fitnessScore = (data.activity.vo2max / 60) * 100;
    const sleepScore = data.sleep.quality;
    const stressScore = 100 - data.recovery.stress;
    
    return Math.round(
      recoveryScore * recoveryWeight +
      fitnessScore * fitnessWeight +
      sleepScore * sleepWeight +
      stressScore * stressWeight
    );
  };
  
  const generateBiomarkerTrends = (data: WearableData) => {
    const trends: BiomarkerTrend[] = [
      {
        metric: 'VO2 Max',
        current: data.activity.vo2max,
        baseline: 50.0,
        change: data.activity.vo2max - 50.0,
        unit: 'ml/kg/min',
        status: data.activity.vo2max > 55 ? 'optimal' : data.activity.vo2max > 45 ? 'good' : 'attention'
      },
      {
        metric: 'HRV',
        current: data.recovery.hrv,
        baseline: 55,
        change: data.recovery.hrv - 55,
        unit: 'ms',
        status: data.recovery.hrv > 60 ? 'optimal' : data.recovery.hrv > 45 ? 'good' : 'attention'
      },
      {
        metric: 'Glucose TIR',
        current: data.vitals.glucose.timeInRange,
        baseline: 80,
        change: data.vitals.glucose.timeInRange - 80,
        unit: '%',
        status: data.vitals.glucose.timeInRange > 85 ? 'optimal' : data.vitals.glucose.timeInRange > 70 ? 'good' : 'concern'
      },
      {
        metric: 'Blood Pressure',
        current: data.vitals.bloodPressure.systolic,
        baseline: 120,
        change: data.vitals.bloodPressure.systolic - 120,
        unit: 'mmHg',
        status: data.vitals.bloodPressure.systolic < 120 ? 'optimal' : data.vitals.bloodPressure.systolic < 140 ? 'good' : 'concern'
      }
    ];
    
    setBiomarkerTrends(trends);
  };
  
  const assessHealthRisks = (data: WearableData) => {
    const risks = {
      cardiovascular: calculateCardiovascularRisk(data),
      metabolic: calculateMetabolicRisk(data),
      cognitive: calculateCognitiveRisk(data),
      overall: 'low'
    };
    
    setRiskAssessment(risks);
  };
  
  const calculateCardiovascularRisk = (data: WearableData): string => {
    if (data.vitals.bloodPressure.systolic > 140 || data.recovery.restingHeartRate > 80) return 'high';
    if (data.vitals.bloodPressure.systolic > 130 || data.recovery.hrv < 40) return 'moderate';
    return 'low';
  };
  
  const calculateMetabolicRisk = (data: WearableData): string => {
    if (data.vitals.glucose.current > 126 || data.vitals.glucose.timeInRange < 60) return 'high';
    if (data.vitals.glucose.current > 100 || data.vitals.glucose.timeInRange < 80) return 'moderate';
    return 'low';
  };
  
  const calculateCognitiveRisk = (data: WearableData): string => {
    if (data.performance.cognitiveLoad > 80 || data.sleep.quality < 60) return 'high';
    if (data.performance.cognitiveLoad > 60 || data.sleep.quality < 75) return 'moderate';
    return 'low';
  };
  
  const generateAdvancedRecommendations = (data: WearableData) => {
    const recs: Recommendation[] = [];
    
    // Sleep analysis
    if (data.sleep.duration < 420) {
      recs.push({ 
        type: 'sleep', 
        priority: 'high', 
        message: `You only slept ${Math.floor(data.sleep.duration/60)}h ${data.sleep.duration%60}m. Sleep debt affects recovery and performance.`, 
        action: 'Target 7-9 hours nightly, consider sleep hygiene optimization.', 
        icon: <Moon className="h-4 w-4" />,
        timeframe: '1-2 weeks',
        expectedImprovement: '15-25% better recovery scores'
      });
    }
    
    // HRV and recovery
    if (data.recovery.hrv < 50) {
      recs.push({ 
        type: 'recovery', 
        priority: 'high', 
        message: `Your HRV (${data.recovery.hrv}ms) indicates accumulated stress or insufficient recovery.`, 
        action: 'Implement breathing protocols, reduce training intensity temporarily.', 
        icon: <AlertCircle className="h-4 w-4" />,
        timeframe: '3-7 days',
        expectedImprovement: '10-20ms HRV increase'
      });
    }
    
    // Cardiovascular risk
    if (data.vitals.bloodPressure.systolic > 130) {
      recs.push({ 
        type: 'cardiovascular', 
        priority: 'high', 
        message: `Elevated blood pressure (${data.vitals.bloodPressure.systolic}/${data.vitals.bloodPressure.diastolic}) requires attention.`, 
        action: 'Reduce sodium intake, increase aerobic exercise, consider medical consultation.', 
        icon: <HeartPulse className="h-4 w-4" />,
        timeframe: '2-4 weeks',
        expectedImprovement: '5-15 mmHg reduction'
      });
    }
    
    // Metabolic optimization
    if (data.vitals.glucose.timeInRange < 80) {
      recs.push({ 
        type: 'metabolic', 
        priority: 'medium', 
        message: `Glucose time-in-range (${data.vitals.glucose.timeInRange}%) could be improved for metabolic health.`, 
        action: 'Consider continuous glucose monitoring, optimize meal timing and composition.', 
        icon: <Droplets className="h-4 w-4" />,
        timeframe: '2-6 weeks',
        expectedImprovement: '10-20% improvement in glucose stability'
      });
    }
    
    // Performance optimization
    if (data.activity.vo2max < 45) {
      recs.push({ 
        type: 'activity', 
        priority: 'medium', 
        message: `VO2 max (${data.activity.vo2max}) indicates room for cardiovascular fitness improvement.`, 
        action: 'Incorporate zone 2 base training and high-intensity intervals.', 
        icon: <Wind className="h-4 w-4" />,
        timeframe: '6-12 weeks',
        expectedImprovement: '5-15% VO2 max increase'
      });
    }
    
    // Cognitive load management
    if (data.performance.cognitiveLoad > 70) {
      recs.push({ 
        type: 'cognitive', 
        priority: 'medium', 
        message: `High cognitive load (${data.performance.cognitiveLoad}/100) may impact recovery and decision making.`, 
        action: 'Practice stress management, consider meditation or cognitive breaks.', 
        icon: <Brain className="h-4 w-4" />,
        timeframe: '1-3 weeks',
        expectedImprovement: 'Reduced perceived stress and better sleep quality'
      });
    }
    
    if (recs.length === 0) {
      recs.push({ 
        type: 'recovery', 
        priority: 'low', 
        message: "Your biomarkers are in excellent ranges! Focus on maintaining current protocols.", 
        icon: <Award className="h-4 w-4" />,
        timeframe: 'Ongoing',
        expectedImprovement: 'Sustained optimal health'
      });
    }
    
    setRecommendations(recs);
  };
      generateHistoricalData();
      setLoading(false);
    }, 1000);
  }, [selectedDevice, timeframe]);

  const generateRecommendations = (data: WearableData) => {
    // This function is kept for compatibility but generateAdvancedRecommendations is used instead
    const recs: Recommendation[] = [];
    setRecommendations(recs);
  };
  
  const generateAdvancedRecommendations = (data: WearableData) => {
    const recs: Recommendation[] = [];
    
    // Sleep analysis
    if (data.sleep.duration < 420) {
      recs.push({ 
        type: 'sleep', 
        priority: 'high', 
        message: `You only slept ${Math.floor(data.sleep.duration/60)}h ${data.sleep.duration%60}m. Sleep debt affects recovery and performance.`, 
        action: 'Target 7-9 hours nightly, consider sleep hygiene optimization.', 
        icon: <Moon className="h-4 w-4" />,
        timeframe: '1-2 weeks',
        expectedImprovement: '15-25% better recovery scores'
      });
    }
    
    // HRV and recovery
    if (data.recovery.hrv < 50) {
      recs.push({ 
        type: 'recovery', 
        priority: 'high', 
        message: `Your HRV (${data.recovery.hrv}ms) indicates accumulated stress or insufficient recovery.`, 
        action: 'Implement breathing protocols, reduce training intensity temporarily.', 
        icon: <AlertCircle className="h-4 w-4" />,
        timeframe: '3-7 days',
        expectedImprovement: '10-20ms HRV increase'
      });
    }
    
    // Cardiovascular risk
    if (data.vitals.bloodPressure.systolic > 130) {
      recs.push({ 
        type: 'cardiovascular', 
        priority: 'high', 
        message: `Elevated blood pressure (${data.vitals.bloodPressure.systolic}/${data.vitals.bloodPressure.diastolic}) requires attention.`, 
        action: 'Reduce sodium intake, increase aerobic exercise, consider medical consultation.', 
        icon: <HeartPulse className="h-4 w-4" />,
        timeframe: '2-4 weeks',
        expectedImprovement: '5-15 mmHg reduction'
      });
    }
    
    // Metabolic optimization
    if (data.vitals.glucose.timeInRange < 80) {
      recs.push({ 
        type: 'metabolic', 
        priority: 'medium', 
        message: `Glucose time-in-range (${data.vitals.glucose.timeInRange}%) could be improved for metabolic health.`, 
        action: 'Consider continuous glucose monitoring, optimize meal timing and composition.', 
        icon: <Droplets className="h-4 w-4" />,
        timeframe: '2-6 weeks',
        expectedImprovement: '10-20% improvement in glucose stability'
      });
    }
    
    // Performance optimization
    if (data.activity.vo2max < 45) {
      recs.push({ 
        type: 'activity', 
        priority: 'medium', 
        message: `VO2 max (${data.activity.vo2max}) indicates room for cardiovascular fitness improvement.`, 
        action: 'Incorporate zone 2 base training and high-intensity intervals.', 
        icon: <Wind className="h-4 w-4" />,
        timeframe: '6-12 weeks',
        expectedImprovement: '5-15% VO2 max increase'
      });
    }
    
    // Cognitive load management
    if (data.performance.cognitiveLoad > 70) {
      recs.push({ 
        type: 'cognitive', 
        priority: 'medium', 
        message: `High cognitive load (${data.performance.cognitiveLoad}/100) may impact recovery and decision making.`, 
        action: 'Practice stress management, consider meditation or cognitive breaks.', 
        icon: <Brain className="h-4 w-4" />,
        timeframe: '1-3 weeks',
        expectedImprovement: 'Reduced perceived stress and better sleep quality'
      });
    }
    
    if (recs.length === 0) {
      recs.push({ 
        type: 'recovery', 
        priority: 'low', 
        message: "Your biomarkers are in excellent ranges! Focus on maintaining current protocols.", 
        icon: <Award className="h-4 w-4" />,
        timeframe: 'Ongoing',
        expectedImprovement: 'Sustained optimal health'
      });
    }
    
    setRecommendations(recs);
  };

  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (6 - i));
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sleepDuration: Math.floor(Math.random() * 60) + 360,
        hrv: Math.floor(Math.random() * 30) + 50,
        steps: Math.floor(Math.random() * 5000) + 7000,
      });
    }
    setHealthData(data);
  };

  const connectNewDevice = () => {
    alert(`Connecting to a new device... In a real app, this would open the authentication flow.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold">Wearable Integration</h1>
                <p className="text-muted-foreground mt-1">
                  Advanced analysis of your sleep, activity, and recovery data.
                </p>
            </div>
            <Button variant="outline" size="default" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected Device</CardTitle>
            <CardDescription>Select the wearable you want to see data from.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {connectedDevices.map(device => (
                <Button key={device} variant={selectedDevice === device ? 'default' : 'outline'} size="default" onClick={() => setSelectedDevice(device)}>{device}</Button>
              ))}
              <Button variant="outline" size="default" onClick={connectNewDevice}>+ Connect new device</Button>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <Card><CardContent className="py-12 text-center"><p>Loading comprehensive health data from {selectedDevice}...</p><Progress value={50} className="mt-4 w-full" /></CardContent></Card>
        ) : wearableData ? (
          <div className="space-y-6">
            {/* Overall Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Comprehensive Health Score
                </CardTitle>
                <CardDescription>Integrated analysis of all biomarkers and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{performanceScore}</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${performanceScore}%`}}></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{calculateCardiovascularHealth(wearableData)}</div>
                    <div className="text-sm text-muted-foreground">Cardiovascular</div>
                    <Badge variant="outline" className="mt-1">
                      {calculateCardiovascularHealth(wearableData) > 80 ? 'Excellent' : 'Good'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{calculateMetabolicHealth(wearableData)}</div>
                    <div className="text-sm text-muted-foreground">Metabolic</div>
                    <Badge variant="outline" className="mt-1">
                      {calculateMetabolicHealth(wearableData) > 80 ? 'Optimal' : 'Good'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{wearableData.recovery.recoveryScore}</div>
                    <div className="text-sm text-muted-foreground">Recovery</div>
                    <Badge variant="outline" className="mt-1">
                      {wearableData.recovery.recoveryScore > 85 ? 'Excellent' : 'Good'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Vitals Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Wind className="h-4 w-4" />VO2 Max
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wearableData.activity.vo2max}</div>
                  <div className="text-sm text-muted-foreground">ml/kg/min</div>
                  <Badge variant={wearableData.activity.vo2max > 55 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.activity.vo2max > 55 ? 'Elite' : 'Good'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <HeartPulse className="h-4 w-4" />Blood Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{wearableData.vitals.bloodPressure.systolic}/{wearableData.vitals.bloodPressure.diastolic}</div>
                  <div className="text-sm text-muted-foreground">mmHg</div>
                  <Badge variant={wearableData.vitals.bloodPressure.systolic < 120 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.vitals.bloodPressure.systolic < 120 ? 'Optimal' : 'Elevated'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Droplets className="h-4 w-4" />Glucose TIR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wearableData.vitals.glucose.timeInRange}%</div>
                  <div className="text-sm text-muted-foreground">Time in Range</div>
                  <Badge variant={wearableData.vitals.glucose.timeInRange > 85 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.vitals.glucose.timeInRange > 85 ? 'Excellent' : 'Good'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Activity className="h-4 w-4" />HRV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wearableData.recovery.hrv}</div>
                  <div className="text-sm text-muted-foreground">ms</div>
                  <Badge variant={wearableData.recovery.hrv > 60 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.recovery.hrv > 60 ? 'High' : 'Normal'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Moon className="h-4 w-4" />Sleep Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wearableData.sleep.quality}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                  <Badge variant={wearableData.sleep.quality > 85 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.sleep.quality > 85 ? 'Excellent' : 'Good'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4" />Inflammation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wearableData.vitals.inflammation.score}</div>
                  <div className="text-sm text-muted-foreground">Health Score</div>
                  <Badge variant={wearableData.vitals.inflammation.score > 85 ? 'default' : 'secondary'} className="mt-1">
                    {wearableData.vitals.inflammation.score > 85 ? 'Low' : 'Moderate'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI-Powered Health Recommendations
                </CardTitle>
                <CardDescription>Evidence-based recommendations with expected outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${
                      rec.priority === 'critical' ? 'border-red-500 bg-red-50' :
                      rec.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                      rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          rec.priority === 'critical' ? 'bg-red-100 text-red-600' :
                          rec.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {rec.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{rec.message}</h4>
                            <Badge variant={rec.priority === 'critical' ? 'destructive' : rec.priority === 'high' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          {rec.action && (
                            <p className="text-sm text-muted-foreground mb-3">{rec.action}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Timeline:</span> {rec.timeframe}
                            </div>
                            <div>
                              <span className="font-medium">Expected Result:</span> {rec.expectedImprovement}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Multi-Biomarker Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="sleepDuration" name="Sleep (min)" stroke="#8884d8" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="hrv" name="HRV (ms)" stroke="#82ca9d" strokeWidth={2} />
                        <Line yAxisId="left" type="monotone" dataKey="steps" name="Steps" stroke="#ffc658" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Health Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {riskAssessment && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className={`text-xl font-bold ${
                            riskAssessment.cardiovascular === 'low' ? 'text-green-600' :
                            riskAssessment.cardiovascular === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {riskAssessment.cardiovascular.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">Cardiovascular</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className={`text-xl font-bold ${
                            riskAssessment.metabolic === 'low' ? 'text-green-600' :
                            riskAssessment.metabolic === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {riskAssessment.metabolic.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">Metabolic</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className={`text-xl font-bold ${
                            riskAssessment.cognitive === 'low' ? 'text-green-600' :
                            riskAssessment.cognitive === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {riskAssessment.cognitive.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">Cognitive</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card><CardContent className="py-12 text-center"><p>Select a wearable device to view comprehensive health analytics</p></CardContent></Card>
        )}
      </div>
    </div>
  );
}

