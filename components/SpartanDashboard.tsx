import React, { useState, useEffect, useRef } from 'react';
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui";
import { 
  MessageCircle, 
  Brain, 
  Dumbbell, 
  Calendar,
  Activity,
  TrendingUp,
  Award,
  Settings,
  X,
  ChevronRight,
  Zap,
  Target,
  Clock,
  Apple,
  Moon,
  Shield,
  Bell,
  Plus,
  Menu,
  Grid,
  BarChart3,
  AlertCircle,
  User,
  BookOpen,
  Trophy,
  Flame,
  Heart,
  Droplets,
  Wind,
  Eye,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Check,
  Star,
  Users,
  Map,
  Compass
} from "lucide-react";
import ChatMaestro from './ChatMaestro';
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';
import { spartanNervousSystem } from '../lib/spartan-nervous-system';
import { dataManagementService } from '../lib/data-management-service';
import { wearableIntegrationService } from '../lib/wearable-integration-service';
import { SpartanModalService } from '../lib/spartan-modal-service';

// Import modal components
import { AdvancedSmartCardsEngine } from '../modals/smart-cards-engine';
import { AdvancedPlanDesignService } from '../modals/plan-design-service';
import { GamificationEngine } from '../modals/gamification-engine';

interface SpartanDashboardProps {
  userId: string;
  userData: UserData;
  workoutPlans: WorkoutPlan[];
  progressData: ProgressData[];
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

interface ModalState {
  id: string;
  type: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
}

interface SmartCardData {
  id: string;
  exerciseName: string;
  sets: number;
  reps: string;
  rest: number;
  completed: boolean;
  timerActive: boolean;
  timeRemaining: number;
}

interface TacticalCalendarDay {
  date: Date;
  isWorkoutDay: boolean;
  workoutType?: string;
  isCompleted?: boolean;
  isSelected?: boolean;
}

interface BiométricDataPoint {
  timestamp: Date;
  heartRate?: number;
  sleepQuality?: number;
  stressLevel?: number;
  recoveryScore?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
}

export default function SpartanDashboard({ 
  userId, 
  userData, 
  workoutPlans, 
  progressData, 
  onLogout,
  onNavigate
}: SpartanDashboardProps) {
  const [activeModals, setActiveModals] = useState<ModalState[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'analytics'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [smartCards, setSmartCards] = useState<SmartCardData[]>([]);
  const [tacticalCalendar, setTacticalCalendar] = useState<TacticalCalendarDay[]>([]);
  const [biométricData, setBiométricData] = useState<BiométricDataPoint[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gamificationPoints, setGamificationPoints] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(5);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Initialize the nervous system and subscribe to events
  useEffect(() => {
    // Subscribe to alerts from the nervous system
    spartanNervousSystem.subscribe('alert_triggered', (event) => {
      setAlerts(prev => [...prev, event.payload]);
    });

    // Subscribe to recommendations from the nervous system
    spartanNervousSystem.subscribe('recommendation_made', (event) => {
      setRecommendations(prev => [...prev, event.payload]);
    });

    // Initialize data management service
    dataManagementService.initialize(userId);

    // Initialize sample data
    initializeSampleData();

    // Clean up subscriptions
    return () => {
      spartanNervousSystem.cleanup();
      dataManagementService.cleanup();
    };
  }, [userId]);

  // Initialize sample data for demonstration
  const initializeSampleData = () => {
    // Sample smart cards
    const sampleCards: SmartCardData[] = [
      {
        id: 'card-1',
        exerciseName: 'Sentadilla con Barra',
        sets: 4,
        reps: '8-10',
        rest: 90,
        completed: false,
        timerActive: false,
        timeRemaining: 90
      },
      {
        id: 'card-2',
        exerciseName: 'Press de Banca',
        sets: 3,
        reps: '6-8',
        rest: 120,
        completed: true,
        timerActive: false,
        timeRemaining: 120
      },
      {
        id: 'card-3',
        exerciseName: 'Dominadas',
        sets: 3,
        reps: 'AMRAP',
        rest: 180,
        completed: false,
        timerActive: false,
        timeRemaining: 180
      }
    ];
    setSmartCards(sampleCards);

    // Sample tactical calendar
    const today = new Date();
    const calendarDays: TacticalCalendarDay[] = [];
    for (let i = -3; i <= 10; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      calendarDays.push({
        date,
        isWorkoutDay: i % 3 === 0, // Every 3rd day is a workout day
        workoutType: i % 3 === 0 ? (i % 6 === 0 ? 'Fuerza' : 'Cardio') : undefined,
        isCompleted: i < 0 && i % 3 === 0,
        isSelected: i === 0
      });
    }
    setTacticalCalendar(calendarDays);

    // Sample biométric data
    const sampleBiométricData: BiométricDataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      sampleBiométricData.push({
        timestamp: date,
        heartRate: 60 + Math.floor(Math.random() * 20),
        sleepQuality: 70 + Math.floor(Math.random() * 30),
        stressLevel: 30 + Math.floor(Math.random() * 40),
        recoveryScore: 60 + Math.floor(Math.random() * 40)
      });
    }
    setBiométricData(sampleBiométricData);

    // Sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: 'ach-1',
        title: 'Primer Entreno',
        description: 'Completa tu primer entrenamiento',
        icon: '🎯',
        earned: true,
        progress: 100
      },
      {
        id: 'ach-2',
        title: 'Racha de 7 Días',
        description: 'Entrena 7 días consecutivos',
        icon: '🔥',
        earned: true,
        progress: 100
      },
      {
        id: 'ach-3',
        title: 'Maestro de la Forma',
        description: 'Completa 10 sesiones con técnica perfecta',
        icon: '⭐',
        earned: false,
        progress: 65
      },
      {
        id: 'ach-4',
        title: 'Explorador',
        description: 'Prueba 5 tipos diferentes de entrenamiento',
        icon: '🧭',
        earned: false,
        progress: 40
      }
    ];
    setAchievements(sampleAchievements);
  };

  // Handle dismissing alerts
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    spartanNervousSystem.dismissAlert(alertId);
  };

  // Handle executing recommendations
  const executeRecommendation = async (recId: string) => {
    await spartanNervousSystem.executeRecommendation(recId);
    setRecommendations(prev => prev.filter(rec => rec.id !== recId));
  };

  // Open a modal
  const openModal = (modalType: string, title: string, component: React.ReactNode) => {
    const newModal: ModalState = {
      id: `modal-${Date.now()}`,
      type: modalType,
      title,
      component,
      position: { x: 100, y: 100 },
      size: { width: 400, height: 500 },
      minimized: false
    };

    setActiveModals(prev => [...prev, newModal]);
  };

  // Close a modal
  const closeModal = (modalId: string) => {
    setActiveModals(prev => prev.filter(modal => modal.id !== modalId));
  };

  // Minimize a modal
  const minimizeModal = (modalId: string) => {
    setActiveModals(prev => 
      prev.map(modal => 
        modal.id === modalId ? { ...modal, minimized: !modal.minimized } : modal
      )
    );
  };

  // Move a modal
  const moveModal = (modalId: string, x: number, y: number) => {
    setActiveModals(prev => 
      prev.map(modal => 
        modal.id === modalId ? { ...modal, position: { x, y } } : modal
      )
    );
  };

  // Resize a modal
  const resizeModal = (modalId: string, width: number, height: number) => {
    setActiveModals(prev => 
      prev.map(modal => 
        modal.id === modalId ? { ...modal, size: { width, height } } : modal
      )
    );
  };

  // Toggle smart card timer
  const toggleCardTimer = (cardId: string) => {
    setSmartCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, timerActive: !card.timerActive } : card
      )
    );
  };

  // Complete a smart card
  const completeCard = (cardId: string) => {
    setSmartCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, completed: true, timerActive: false } : card
      )
    );
  };

  // Select a calendar day
  const selectCalendarDay = (date: Date) => {
    setTacticalCalendar(prev => 
      prev.map(day => ({
        ...day,
        isSelected: day.date.toDateString() === date.toDateString()
      }))
    );
  };

  // Quick action buttons
  const quickActions = [
    { 
      id: 'workout', 
      title: 'Diseña tu Plan', 
      icon: <Dumbbell className="h-5 w-5" />,
      action: () => onNavigate('workoutGenerator')
    },
    { 
      id: 'calendar', 
      title: 'Calendario', 
      icon: <Calendar className="h-5 w-5" />,
      action: () => setCurrentView('calendar')
    },
    { 
      id: 'progress', 
      title: 'Progreso', 
      icon: <TrendingUp className="h-5 w-5" />,
      action: () => onNavigate('progressReport')
    },
    { 
      id: 'nutrition', 
      title: 'Nutrición', 
      icon: <Apple className="h-5 w-5" />,
      action: () => onNavigate('nutrition')
    }
  ];

  // System modules status
  const systemModules = [
    { name: 'Entrenamiento', icon: Dumbbell, status: 'active' },
    { name: 'Nutrición', icon: Apple, status: 'active' },
    { name: 'Recuperación', icon: Moon, status: 'active' },
    { name: 'Progreso', icon: TrendingUp, status: 'active' },
    { name: 'Wearables', icon: Activity, status: 'active' },
    { name: 'Seguridad', icon: Shield, status: 'active' }
  ];

  return (
    <div 
      ref={dashboardRef}
      className="flex h-screen bg-gray-900 text-white overflow-hidden"
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white ml-2">SPARTAN 4</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => openModal('manual', 'Manual del Usuario', <div>Manual del Usuario</div>)}
              className="relative"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="relative"
            >
              <MessageCircle className="h-5 w-5" />
              {recommendations.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* System Status Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs">Ecosistema en línea</span>
            </div>
            <div className="flex space-x-2">
              {systemModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center text-xs bg-white/20 px-2 py-1 rounded"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    <span>{module.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-xs">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-yellow-900/50 border-b border-yellow-800 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-200">
                  {alerts[0].title}: {alerts[0].message}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => dismissAlert(alerts[0].id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto p-4">
            {currentView === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-white">¡Hola, {userData.name}! 👋</h2>
                      <p className="text-gray-400 mt-1">
                        Tu ecosistema SPARTAN está listo para guiarte hacia la excelencia
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-400">85%</div>
                      <div className="text-sm text-gray-400">Consistencia esta semana</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="bg-gray-700/50 hover:bg-gray-700 border-gray-600 text-white"
                      >
                        {action.icon}
                        <span className="ml-2">{action.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gamification Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-900/50 rounded-lg">
                          <Trophy className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-400">Puntos SPARTAN</p>
                          <p className="text-2xl font-bold text-white">{gamificationPoints}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-900/50 rounded-lg">
                          <Flame className="h-6 w-6 text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-400">Racha Actual</p>
                          <p className="text-2xl font-bold text-white">{currentStreak} días</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-900/50 rounded-lg">
                          <Star className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-gray-400">Logros</p>
                          <p className="text-2xl font-bold text-white">
                            {achievements.filter(a => a.earned).length}/{achievements.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Smart Cards Section */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Target className="h-5 w-5 text-blue-400 mr-2" />
                      Tarjetas Inteligentes Dinámicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {smartCards.map((card) => (
                        <Card key={card.id} className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-white">{card.exerciseName}</h3>
                              {card.completed && (
                                <Check className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <div className="mt-2 text-sm text-gray-300">
                              <p>{card.sets} series de {card.reps}</p>
                              <p>Descanso: {card.rest} segundos</p>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
                                onClick={() => toggleCardTimer(card.id)}
                              >
                                {card.timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
                                onClick={() => completeCard(card.id)}
                                disabled={card.completed}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                            {card.timerActive && (
                              <div className="mt-2 text-center text-blue-400 font-mono">
                                {Math.floor(card.timeRemaining / 60)}:{(card.timeRemaining % 60).toString().padStart(2, '0')}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                        Recomendaciones Personalizadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recommendations.slice(0, 3).map((rec) => (
                          <div 
                            key={rec.id} 
                            className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg border border-blue-800/50"
                          >
                            <div>
                              <h4 className="font-medium text-white">{rec.title}</h4>
                              <p className="text-sm text-gray-300">{rec.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-blue-800/50 hover:bg-blue-700/50 border-blue-600 text-white"
                                onClick={() => executeRecommendation(rec.id)}
                              >
                                Aplicar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => dismissAlert(rec.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Achievements */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Award className="h-5 w-5 text-purple-400 mr-2" />
                      Logros y Retos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className={`p-3 rounded-lg border ${
                            achievement.earned 
                              ? 'bg-purple-900/30 border-purple-700/50' 
                              : 'bg-gray-700/30 border-gray-600/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{achievement.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{achievement.title}</h4>
                              <p className="text-sm text-gray-300">{achievement.description}</p>
                              <div className="mt-1 w-full bg-gray-600 rounded-full h-1.5">
                                <div 
                                  className="bg-purple-500 h-1.5 rounded-full" 
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {achievement.progress}% completado
                              </div>
                            </div>
                            {achievement.earned && (
                              <Check className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === 'calendar' && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Calendario Táctico Visual</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                    onClick={() => openModal('plan-design', 'Diseñar Plan', <div>Diseñar Plan</div>)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Nuevo Plan
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
                    <div key={index} className="text-center text-sm text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {tacticalCalendar.map((day, index) => {
                    const isSelected = day.isSelected;
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div 
                        key={index}
                        className={`h-20 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-900/50 border-blue-500' 
                            : day.isWorkoutDay 
                              ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                              : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => selectCalendarDay(day.date)}
                      >
                        <div className="p-2">
                          <div className={`text-xs ${
                            isToday ? 'text-blue-400 font-bold' : 'text-gray-400'
                          }`}>
                            {day.date.getDate()}
                          </div>
                          {day.isWorkoutDay && (
                            <div className="mt-1">
                              <div className={`text-xs px-1 py-0.5 rounded truncate ${
                                day.isCompleted 
                                  ? 'bg-green-900/50 text-green-400' 
                                  : 'bg-blue-900/50 text-blue-400'
                              }`}>
                                {day.workoutType}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-white mb-3">Entrenamientos Programados</h3>
                  <div className="space-y-2">
                    {tacticalCalendar
                      .filter(day => day.isWorkoutDay)
                      .slice(0, 3)
                      .map((day, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-blue-400 mr-2" />
                            <div>
                              <p className="text-white">
                                {day.date.toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-gray-400">{day.workoutType}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
                            onClick={() => openModal('workout-detail', 'Detalles del Entrenamiento', <div>Detalles del Entrenamiento</div>)}
                          >
                            Ver
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'analytics' && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">Visualización de Datos Biométricos</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Biométric Charts */}
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Heart className="h-5 w-5 text-red-400 mr-2" />
                        Frecuencia Cardíaca
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {biométricData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-red-500 to-red-300 rounded-t"
                              style={{ height: `${(data.heartRate || 0) / 2}px` }}
                            ></div>
                            <div className="text-xs text-gray-400 mt-1">
                              {data.timestamp.getDate()}/{data.timestamp.getMonth()+1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Moon className="h-5 w-5 text-indigo-400 mr-2" />
                        Calidad del Sueño
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {biométricData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                              style={{ height: `${(data.sleepQuality || 0) / 2}px` }}
                            ></div>
                            <div className="text-xs text-gray-400 mt-1">
                              {data.timestamp.getDate()}/{data.timestamp.getMonth()+1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Wind className="h-5 w-5 text-yellow-400 mr-2" />
                        Nivel de Estrés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {biométricData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t"
                              style={{ height: `${(data.stressLevel || 0) / 2}px` }}
                            ></div>
                            <div className="text-xs text-gray-400 mt-1">
                              {data.timestamp.getDate()}/{data.timestamp.getMonth()+1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-700/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Droplets className="h-5 w-5 text-green-400 mr-2" />
                        Puntaje de Recuperación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {biométricData.map((data, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                              style={{ height: `${(data.recoveryScore || 0) / 2}px` }}
                            ></div>
                            <div className="text-xs text-gray-400 mt-1">
                              {data.timestamp.getDate()}/{data.timestamp.getMonth()+1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-white mb-3">Recomendaciones del Chat Maestro</h3>
                  <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                    <p className="text-gray-200">
                      Basado en tus datos biométricos, te recomiendo reducir la intensidad del entrenamiento hoy 
                      y enfocarte en ejercicios de recuperación activa. Tu nivel de estrés es alto y tu recuperación 
                      está en 62%, lo cual indica que necesitas un día de descarga.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Modals */}
      {activeModals.map((modal) => (
        <div
          key={modal.id}
          className="absolute bg-gray-800 rounded-xl shadow-xl border border-gray-700 flex flex-col"
          style={{
            left: modal.position.x,
            top: modal.position.y,
            width: modal.size.width,
            height: modal.size.height,
            zIndex: 1000
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h4 className="font-medium text-white">{modal.title}</h4>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => minimizeModal(modal.id)}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => closeModal(modal.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {modal.component}
          </div>
        </div>
      ))}

      {/* Quick Access Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 w-64 z-50">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="ghost"
                className="flex flex-col items-center justify-center h-20 text-white hover:bg-gray-700"
                onClick={() => {
                  action.action();
                  setIsMenuOpen(false);
                }}
              >
                <div className="bg-gray-700 p-2 rounded-lg mb-2">
                  {action.icon}
                </div>
                <span className="text-xs">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
