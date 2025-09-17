/**
 * Advanced Technique Analysis Dashboard
 * Real-time movement analysis with immediate feedback
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Progress, Badge, Alert, AlertDescription } from './ui';
import { 
  ArrowLeft, Camera, Activity, Zap, AlertTriangle, CheckCircle, 
  Eye, Wifi, Smartphone, Target, TrendingUp, Shield, Play, 
  Pause, Square, Settings, BarChart3, Brain, Waves
} from 'lucide-react';
import { 
  techniqueAnalysisAI, 
  type TechniqueFeedback, 
  type ExerciseProfile,
  type SensorData,
  type VideoFrame,
  type Keypoint
} from '../lib/techniqueAnalysisAI';
import type { UserData } from '../lib/types';

interface TechniqueAnalysisDashboardProps {
  userData: UserData;
  onBack: () => void;
}

interface SensorConnection {
  id: string;
  name: string;
  type: 'imu' | 'emg' | 'force' | 'camera';
  status: 'connected' | 'disconnected' | 'calibrating';
  batteryLevel?: number;
  signalStrength?: number;
}

interface AnalysisSession {
  id: string;
  exerciseName: string;
  startTime: Date;
  duration: number;
  feedbackCount: number;
  averageScore: number;
  criticalIssues: number;
}

const TechniqueAnalysisDashboard = memo(function TechniqueAnalysisDashboard({
  userData,
  onBack
}: TechniqueAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<'setup' | 'analysis' | 'feedback' | 'history'>('setup');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realtimeFeedback, setRealtimeFeedback] = useState<TechniqueFeedback[]>([]);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [sensors, setSensors] = useState<SensorConnection[]>([
    {
      id: 'camera_main',
      name: 'Primary Camera',
      type: 'camera',
      status: 'connected',
      signalStrength: 95
    },
    {
      id: 'imu_knee_left',
      name: 'Left Knee IMU',
      type: 'imu',
      status: 'connected',
      batteryLevel: 87,
      signalStrength: 92
    },
    {
      id: 'imu_knee_right',
      name: 'Right Knee IMU',
      type: 'imu',
      status: 'connected',
      batteryLevel: 91,
      signalStrength: 89
    },
    {
      id: 'emg_quads',
      name: 'Quadriceps EMG',
      type: 'emg',
      status: 'calibrating',
      batteryLevel: 76,
      signalStrength: 85
    }
  ]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisSession[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const supportedExercises = techniqueAnalysisAI.getSupportedExercises();

  // Initialize camera stream
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanupCamera();
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (isAnalyzing) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isAnalyzing]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          frameRate: 30
        } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const cleanupCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
  };

  const startAnalysis = useCallback(() => {
    if (!selectedExercise) return;

    const success = techniqueAnalysisAI.startAnalysis(selectedExercise);
    if (success) {
      setIsAnalyzing(true);
      setRealtimeFeedback([]);
      setCurrentScore(100);
      setSessionTime(0);
      setActiveTab('analysis');

      // Subscribe to feedback
      techniqueAnalysisAI.onFeedback((feedback: TechniqueFeedback) => {
        setRealtimeFeedback(prev => {
          const newFeedback = [feedback, ...prev.slice(0, 9)]; // Keep last 10
          
          // Update score based on feedback severity
          const severityWeights = { critical: -20, high: -10, medium: -5, low: -2, info: 0 };
          const impact = severityWeights[feedback.severity];
          setCurrentScore(prev => Math.max(0, Math.min(100, prev + impact)));
          
          return newFeedback;
        });
      });

      // Start simulated sensor data
      startSensorSimulation();
    }
  }, [selectedExercise]);

  const stopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    techniqueAnalysisAI.stopAnalysis();
    
    if (feedbackIntervalRef.current) {
      clearInterval(feedbackIntervalRef.current);
    }

    // Save session to history
    const session: AnalysisSession = {
      id: Date.now().toString(),
      exerciseName: selectedExercise,
      startTime: new Date(Date.now() - sessionTime * 1000),
      duration: sessionTime,
      feedbackCount: realtimeFeedback.length,
      averageScore: currentScore,
      criticalIssues: realtimeFeedback.filter(f => f.severity === 'critical').length
    };
    
    setAnalysisHistory(prev => [session, ...prev.slice(0, 9)]);
  }, [selectedExercise, sessionTime, realtimeFeedback, currentScore]);

  const startSensorSimulation = () => {
    // Simulate real-time sensor data
    feedbackIntervalRef.current = setInterval(() => {
      // Simulate IMU data
      const sensorData: SensorData = {
        timestamp: Date.now(),
        accelerometer: {
          x: (Math.random() - 0.5) * 20,
          y: Math.random() * 10 - 5,
          z: 9.8 + (Math.random() - 0.5) * 2
        },
        gyroscope: {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          z: (Math.random() - 0.5) * 100
        }
      };

      // Simulate video frame with keypoints
      const videoFrame: VideoFrame = {
        timestamp: Date.now(),
        confidence: 0.85 + Math.random() * 0.1,
        keypoints: generateSimulatedKeypoints()
      };

      techniqueAnalysisAI.addSensorData(sensorData);
      techniqueAnalysisAI.addVideoFrame(videoFrame);
    }, 100); // 10 FPS
  };

  const generateSimulatedKeypoints = (): Keypoint[] => {
    // Generate realistic keypoints for squatting motion
    const time = Date.now() / 1000;
    const squatPhase = Math.sin(time * 0.5) * 0.5 + 0.5; // 0-1
    
    return [
      {
        name: 'hip',
        x: 320 + Math.sin(time) * 10,
        y: 200 + squatPhase * 50,
        confidence: 0.9
      },
      {
        name: 'knee',
        x: 320 + Math.sin(time) * 15,
        y: 300 + squatPhase * 30,
        confidence: 0.85
      },
      {
        name: 'ankle',
        x: 320 + Math.sin(time) * 5,
        y: 400,
        confidence: 0.8
      },
      {
        name: 'left_knee',
        x: 300 + Math.sin(time) * 15,
        y: 300 + squatPhase * 30,
        confidence: 0.85
      },
      {
        name: 'right_knee',
        x: 340 + Math.sin(time) * 15,
        y: 300 + squatPhase * 30 + (Math.random() - 0.5) * 10, // Add some asymmetry
        confidence: 0.85
      },
      {
        name: 'shoulder',
        x: 320,
        y: 150,
        confidence: 0.9
      },
      {
        name: 'elbow',
        x: 280,
        y: 200,
        confidence: 0.8
      },
      {
        name: 'wrist',
        x: 250,
        y: 250,
        confidence: 0.75
      }
    ];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSensorStatusColor = (status: SensorConnection['status']): string => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'calibrating': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFeedbackSeverityColor = (severity: TechniqueFeedback['severity']): string => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      case 'info': return 'border-gray-500 bg-gray-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const renderSetupTab = () => (
    <div className="space-y-6">
      {/* Exercise Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Exercise Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportedExercises.map(exercise => (
              <button
                key={exercise}
                onClick={() => setSelectedExercise(exercise)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedExercise === exercise
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-left">{exercise}</h3>
                <p className="text-sm text-gray-600 text-left mt-1">
                  {exercise === 'Squat' ? 'Lower body compound movement' : 'Upper body pressing movement'}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sensor Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-600" />
            Sensor Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensors.map(sensor => (
              <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getSensorStatusColor(sensor.status)}`} />
                  <div>
                    <p className="font-medium">{sensor.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{sensor.status}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  {sensor.batteryLevel && (
                    <p className="text-gray-600">{sensor.batteryLevel}% battery</p>
                  )}
                  {sensor.signalStrength && (
                    <p className="text-gray-600">{sensor.signalStrength}% signal</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Camera Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-purple-600" />
            Camera Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Camera Active
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Analysis */}
      <div className="flex justify-center">
        <Button
          onClick={startAnalysis}
          disabled={!selectedExercise || sensors.some(s => s.status === 'disconnected')}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Technique Analysis
        </Button>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Live Analysis: {selectedExercise}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Session: {formatTime(sessionTime)}</span>
              <Button onClick={stopAnalysis} variant="outline" size="sm">
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{currentScore}</div>
              <div className="text-sm text-gray-600">Technique Score</div>
              <Progress value={currentScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{realtimeFeedback.length}</div>
              <div className="text-sm text-gray-600">Corrections Given</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {realtimeFeedback.filter(f => f.severity === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Video with Overlay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Movement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-96 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            {/* Analysis overlay */}
            <div className="absolute top-4 right-4 bg-black/75 text-white p-3 rounded-lg">
              <div className="text-sm space-y-1">
                <div>Phase: Concentric</div>
                <div>Depth: 92%</div>
                <div>Symmetry: 89%</div>
                <div>Speed: 1.2 m/s</div>
              </div>
            </div>
            {isAnalyzing && (
              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                Analyzing Movement
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sensor Data Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-600" />
            Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Left Knee Angle</div>
              <div className="text-xl font-bold text-blue-600">127°</div>
              <div className="text-xs text-green-600">✓ Optimal</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Right Knee Angle</div>
              <div className="text-xl font-bold text-orange-600">115°</div>
              <div className="text-xs text-orange-600">⚠ Below optimal</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Hip Angle</div>
              <div className="text-xl font-bold text-green-600">89°</div>
              <div className="text-xs text-green-600">✓ Perfect</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">EMG Activity</div>
              <div className="text-xl font-bold text-purple-600">78%</div>
              <div className="text-xs text-green-600">✓ Good activation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeedbackTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-time Feedback</h3>
        <Badge variant="outline">
          {realtimeFeedback.length} corrections
        </Badge>
      </div>

      {realtimeFeedback.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600">Excellent Technique!</h3>
            <p className="text-gray-600">No corrections needed. Keep up the great form!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {realtimeFeedback.map((feedback, index) => (
            <Alert
              key={feedback.id}
              className={`${getFeedbackSeverityColor(feedback.severity)} border-l-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {feedback.severity === 'critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                    {feedback.severity === 'high' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    {feedback.severity === 'medium' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    <span className="font-semibold">{feedback.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {feedback.phase}
                    </Badge>
                  </div>
                  <AlertDescription className="mb-2">
                    {feedback.description}
                  </AlertDescription>
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Correction:</strong> {feedback.correction}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Confidence: {(feedback.confidence * 100).toFixed(0)}%</span>
                    <span>
                      Deviation: {feedback.data.deviation_percentage.toFixed(1)}%
                    </span>
                    <span>
                      {new Date(feedback.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={feedback.severity === 'critical' ? 'default' : 'secondary'}
                    className={`capitalize ${
                      feedback.severity === 'critical' ? 'bg-red-100 text-red-800' : ''
                    }`}
                  >
                    {feedback.severity}
                  </Badge>
                </div>
              </div>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analysis History</h3>
      
      {analysisHistory.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No analysis sessions yet. Start your first session!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {analysisHistory.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{session.exerciseName}</h4>
                  <div className="text-sm text-gray-600">
                    {session.startTime.toLocaleDateString()}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <div className="font-medium">{formatTime(session.duration)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Average Score:</span>
                    <div className="font-medium">{session.averageScore}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Corrections:</span>
                    <div className="font-medium">{session.feedbackCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Critical Issues:</span>
                    <div className="font-medium text-red-600">{session.criticalIssues}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'analysis', label: 'Live Analysis', icon: Activity },
    { id: 'feedback', label: 'Feedback', icon: AlertTriangle },
    { id: 'history', label: 'History', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Technique Analysis AI
              </h1>
              <p className="text-sm text-gray-600">Real-time movement analysis for injury prevention</p>
            </div>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                disabled={tab.id === 'analysis' && !isAnalyzing && tab.id !== activeTab}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600 disabled:text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.id === 'feedback' && realtimeFeedback.length > 0 && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 text-xs bg-red-100 text-red-800">
                    {realtimeFeedback.length}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'setup' && renderSetupTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'feedback' && renderFeedbackTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </main>
    </div>
  );
});

export default TechniqueAnalysisDashboard;