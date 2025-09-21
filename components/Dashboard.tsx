import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge
} from "./ui.tsx";
import { Calendar, Clock, Heart, User, Settings, Plus, Utensils, Zap, Droplets, StretchHorizontal, LogOut, Brain, Microscope, TrendingUp, BarChart3, Bell, ChevronRight, Dumbbell, Target, Award, Activity } from "lucide-react";
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';
import { authManager, type User as AuthUser } from '../lib/auth';
import { habitTrackingService } from '../lib/habit-tracking';
import { notificationService } from '../lib/notification-service';

interface DashboardProps {
    userData: UserData;
    workoutPlans: WorkoutPlan[];
    progressData: ProgressData[];
    onGenerateWorkout: () => void;
    isGeneratingWorkout: boolean;
    onSelectWorkout: (plan: WorkoutPlan) => void;
    onProfileClick: () => void;
    onNavigateToRecipes: () => void;
    onNavigateToCircadian: () => void;
    onNavigateToWearable: () => void;
    onNavigateToBloodTestAnalyzer: () => void;
    onNavigateToOverloadDetection: () => void;
    onNavigateToSpartanXXII?: () => void;
    onNavigateToScientificAI?: () => void;
    onNavigateToAdvancedAI?: () => void;
    onNavigateToAdvancedWorkout?: () => void;
    onNavigateToAdaptiveTraining?: () => void;
    onNavigateToTechniqueAnalysis?: () => void;
    onNavigateToAdaptiveNutrition?: () => void;
    onNavigateToProgress?: () => void;
    onNavigateToProgressComparison?: () => void;
    onNavigateToWorkoutFlow?: () => void;
    onNavigateToPredictiveAnalytics?: () => void;
    onNavigateToNutrition?: () => void;
    onNavigateToChatMaestro?: () => void;
    onNavigateToSpartanDashboard?: () => void;
    onLogout: () => void;
}

// Progress visualization component
const ProgressVisualization = ({ progressData }: { progressData: ProgressData[] }) => {
    // Calculate weekly progress
    const weeklyProgress = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyData = progressData.filter(p => 
            new Date(p.date) >= oneWeekAgo && new Date(p.date) <= now
        );
        
        return weeklyData.length;
    }, [progressData]);
    
    // Calculate consistency (percentage of days with workouts in the last week)
    const consistency = useMemo(() => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const daysInWeek = 7;
        const workoutDays = new Set(progressData
            .filter(p => new Date(p.date) >= oneWeekAgo && new Date(p.date) <= now)
            .map(p => new Date(p.date).toDateString())
        ).size;
        
        return Math.round((workoutDays / daysInWeek) * 100);
    }, [progressData]);
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-800">Esta semana</p>
                        <p className="text-2xl font-bold text-blue-900">{weeklyProgress}</p>
                        <p className="text-xs text-blue-600 mt-1">sesiones</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-purple-800">Consistencia</p>
                        <p className="text-2xl font-bold text-purple-900">{consistency}%</p>
                        <p className="text-xs text-purple-600 mt-1">objetivo</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                </div>
            </div>
        </div>
    );
};

// Motivational quote component
const MotivationalQuote = () => {
    const quotes = [
        "La disciplina es el puente entre metas y logros.",
        "Cada entrenamiento te acerca a tu mejor versión.",
        "La fuerza no viene de lo físico, viene de la voluntad indomable.",
        "El dolor que sientes hoy es la fuerza que sentirás mañana.",
        "No cuentes los días, haz que los días cuenten."
    ];
    
    const [currentQuote, setCurrentQuote] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote(prev => (prev + 1) % quotes.length);
        }, 10000); // Change quote every 10 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl">
            <div className="flex items-center mb-2">
                <Award className="h-5 w-5 mr-2 text-yellow-400" />
                <p className="text-sm font-medium">Tu mantra diario</p>
            </div>
            <p className="text-base font-medium italic">"{quotes[currentQuote]}"</p>
        </div>
    );
};

// Quick stats component
const QuickStats = ({ stats }: { stats: { totalWorkouts: number; thisWeek: number } }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totalWorkouts}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-500">Esta semana</p>
                        <p className="text-xl font-bold text-gray-900">{stats.thisWeek}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = memo(function Dashboard({
    userData,
    workoutPlans,
    progressData,
    onGenerateWorkout,
    isGeneratingWorkout,
    onSelectWorkout,
    onProfileClick,
    onNavigateToRecipes,
    onNavigateToCircadian,
    onNavigateToWearable,
    onNavigateToBloodTestAnalyzer,
    onNavigateToOverloadDetection,
    onNavigateToSpartanXXII,
    onNavigateToScientificAI,
    onNavigateToAdvancedAI,
    onNavigateToAdvancedWorkout,
    onNavigateToAdaptiveTraining,
    onNavigateToTechniqueAnalysis,
    onNavigateToAdaptiveNutrition,
    onNavigateToProgress,
    onNavigateToProgressComparison,
    onNavigateToWorkoutFlow,
    onNavigateToPredictiveAnalytics,
    onNavigateToNutrition,
    onNavigateToChatMaestro,
    onNavigateToSpartanDashboard,
    onLogout,
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'progress'>('dashboard');
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [predictedNextSession, setPredictedNextSession] = useState<Date | null>(null);

    useEffect(() => {
        const unsubscribe = authManager.subscribe((state) => {
            setAuthUser(state.user);
        });
        
        return () => {
            unsubscribe();
        };
    }, []);

    // Load user habits and notifications
    useEffect(() => {
        const userId = 'default-user'; // In a real app, this would come from auth
        const contextualNotifications = notificationService.generateContextualNotifications(userId);
        setNotifications(contextualNotifications);
        
        const patterns = habitTrackingService.predictTrainingPatterns(userId);
        setPredictedNextSession(patterns.nextLikelySession);
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await authManager.logout();
            onLogout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }, [onLogout]);

    // Memoizar estadísticas calculadas
    const stats = useMemo(() => {
        const totalWorkouts = progressData.length;
        const thisWeek = progressData.filter(p => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return p.date >= weekAgo;
        }).length;
        
        return { totalWorkouts, thisWeek };
    }, [progressData]);

    // Memoizar planes de entrenamiento recientes
    const recentPlans = useMemo(() => 
        workoutPlans.slice(0, 3), 
        [workoutPlans]
    );

    const formatDate = (date: Date | null) => {
        if (!date) return 'No disponible';
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const quickActions = [
        { 
            id: 'chat', 
            title: 'Chat Maestro', 
            icon: <Brain className="h-5 w-5" />,
            action: onNavigateToChatMaestro
        },
        { 
            id: 'recipes', 
            title: 'Recetas', 
            icon: <Utensils className="h-5 w-5" />,
            action: onNavigateToRecipes
        },
        { 
            id: 'circadian', 
            title: 'Ritmo Circadiano', 
            icon: <Clock className="h-5 w-5" />,
            action: onNavigateToCircadian
        },
        { 
            id: 'wearable', 
            title: 'Wearables', 
            icon: <Activity className="h-5 w-5" />,
            action: onNavigateToWearable
        },
        { 
            id: 'spartan-dashboard', 
            title: 'Spartan Dashboard', 
            icon: <BarChart3 className="h-5 w-5" />,
            action: onNavigateToSpartanDashboard
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with minimalist design */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">SPARTAN 4</h1>
                            {authUser && (
                                <p className="ml-4 text-sm text-gray-600 hidden sm:block">
                                    ¡Hola, {authUser.name}!
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onNavigateToChatMaestro}
                                className="h-9 w-9 rounded-lg hover:bg-gray-100"
                                title="Chat Maestro"
                            >
                                <Brain className="h-5 w-5 text-gray-700" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={onProfileClick}
                                className="h-9 w-9 rounded-lg hover:bg-gray-100"
                            >
                                <User className="h-5 w-5 text-gray-700" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={handleLogout} 
                                title="Cerrar sesión"
                                className="h-9 w-9 rounded-lg hover:bg-red-50"
                            >
                                <LogOut className="h-5 w-5 text-gray-700" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Navigation - Simplified */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('dashboard')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'dashboard' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Panel
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('workouts')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'workouts' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Entrenamientos
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('progress')}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'progress' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        Progreso
                    </Button>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">¡Bienvenido de nuevo, {authUser?.name || 'Spartan'}!</h2>
                                    <p className="mt-2 text-blue-100 max-w-2xl">
                                        Hoy es un gran día para desafiar tus límites. Tu cuerpo está listo, tu mente está enfocada.
                                    </p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-lg">
                                    <Calendar className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        {/* Stats and Progress */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Quick Stats */}
                                <QuickStats stats={stats} />
                                
                                {/* Progress Visualization */}
                                <Card className="bg-white border-0 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-bold text-gray-900">Tu Progreso</CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Visualización de tu actividad reciente
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ProgressVisualization progressData={progressData} />
                                    </CardContent>
                                </Card>
                                
                                {/* Motivational Quote */}
                                <MotivationalQuote />
                            </div>
                            
                            <div className="space-y-6">
                                {/* Next Session Prediction */}
                                {predictedNextSession && (
                                    <Card className="bg-white border-0 shadow-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                                                Próxima Sesión
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-4">
                                                <p className="font-medium text-gray-900">{formatDate(predictedNextSession)}</p>
                                                <p className="text-sm text-gray-600 mt-2">¡Prepárate para entrenar!</p>
                                                <Button 
                                                    size="sm" 
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => onGenerateWorkout()}
                                                >
                                                    Planificar Ahora
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                                
                                {/* Quick Actions */}
                                <Card className="bg-white border-0 shadow-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-bold text-gray-900">Acciones Rápidas</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-16 flex flex-col items-center justify-center"
                                                onClick={onNavigateToChatMaestro}
                                            >
                                                <Brain className="h-5 w-5 text-gray-700 mb-1" />
                                                <span className="text-xs">Chat Maestro</span>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-16 flex flex-col items-center justify-center"
                                                onClick={onNavigateToRecipes}
                                            >
                                                <Utensils className="h-5 w-5 text-gray-700 mb-1" />
                                                <span className="text-xs">Recetas</span>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-16 flex flex-col items-center justify-center"
                                                onClick={onNavigateToNutrition}
                                            >
                                                <Activity className="h-5 w-5 text-gray-700 mb-1" />
                                                <span className="text-xs">Nutrición</span>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="h-16 flex flex-col items-center justify-center"
                                                onClick={onNavigateToProgress}
                                            >
                                                <TrendingUp className="h-5 w-5 text-gray-700 mb-1" />
                                                <span className="text-xs">Progreso</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Recent Workouts */}
                        <Card className="bg-white border-0 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-gray-900">Planes Recientes</CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Tus planes de entrenamiento más recientes
                                        </CardDescription>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        onClick={onGenerateWorkout}
                                        disabled={isGeneratingWorkout}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isGeneratingWorkout ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Nuevo Plan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {recentPlans.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {recentPlans.map((plan) => (
                                            <div 
                                                key={plan.id} 
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => onSelectWorkout(plan)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{plan.description}</p>
                                                <div className="flex items-center mt-3 text-xs text-gray-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>{plan.days.length} días</span>
                                                    <span className="mx-2">•</span>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{plan.duration} min</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Dumbbell className="h-12 w-12 text-gray-300 mx-auto" />
                                        <p className="mt-4 text-gray-600">Aún no tienes planes de entrenamiento</p>
                                        <Button 
                                            onClick={onGenerateWorkout} 
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={isGeneratingWorkout}
                                        >
                                            {isGeneratingWorkout ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Generando...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Crear tu primer plan
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'workouts' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Planes de Entrenamiento</h2>
                                <p className="text-gray-600 mt-1">Gestiona y accede a tus planes de entrenamiento</p>
                            </div>
                            <Button 
                                onClick={onGenerateWorkout} 
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isGeneratingWorkout}
                            >
                                {isGeneratingWorkout ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nuevo Plan
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {workoutPlans.length > 0 ? (
                                workoutPlans.map((plan) => (
                                    <Card 
                                        key={plan.id} 
                                        className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => onSelectWorkout(plan)}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg font-bold text-gray-900">{plan.name}</CardTitle>
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <CardDescription className="text-gray-600 line-clamp-2 mt-2">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Duración:</span>
                                                    <span className="font-medium">{plan.duration} min</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Días:</span>
                                                    <span className="font-medium">{plan.days.length}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Nivel:</span>
                                                    <span className="font-medium capitalize">{plan.difficulty}</span>
                                                </div>
                                                <div className="pt-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {plan.focus.slice(0, 3).map((focus, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-800">
                                                                {focus}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <Dumbbell className="h-16 w-16 text-gray-300 mx-auto" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No hay planes de entrenamiento</h3>
                                    <p className="mt-2 text-gray-600">Crea tu primer plan de entrenamiento para comenzar</p>
                                    <Button 
                                        onClick={onGenerateWorkout} 
                                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={isGeneratingWorkout}
                                    >
                                        {isGeneratingWorkout ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Crear Plan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Progreso</h2>
                            <p className="text-gray-600 mt-1">Visualiza tu evolución y mejora continua</p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-white border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-gray-900">Actividad Reciente</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Tus sesiones de entrenamiento más recientes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {progressData.length > 0 ? (
                                        <div className="space-y-4">
                                            {[...progressData]
                                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                .slice(0, 5)
                                                .map((progress, index) => {
                                                    const plan = workoutPlans.find(p => p.id === progress.workoutId);
                                                    return (
                                                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <Zap className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-4 flex-1">
                                                                <h4 className="text-sm font-medium text-gray-900">
                                                                    {plan ? plan.name : "Sesión de entrenamiento"}
                                                                </h4>
                                                                <p className="text-xs text-gray-600">
                                                                    {new Date(progress.date).toLocaleDateString('es-ES', {
                                                                        weekday: 'short',
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto" />
                                            <p className="mt-4 text-gray-600">Aún no tienes datos de progreso</p>
                                            <p className="text-sm text-gray-500 mt-1">Completa sesiones de entrenamiento para ver tu progreso</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-0 shadow-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-gray-900">Herramientas de Progreso</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Analiza y compara tu evolución
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-14 flex items-center justify-start"
                                            onClick={onNavigateToProgress}
                                        >
                                            <TrendingUp className="h-5 w-5 text-gray-700 mr-3" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Informe de Progreso</p>
                                                <p className="text-xs text-gray-600">Análisis detallado de tu evolución</p>
                                            </div>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-14 flex items-center justify-start"
                                            onClick={onNavigateToProgressComparison}
                                        >
                                            <StretchHorizontal className="h-5 w-5 text-gray-700 mr-3" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Comparar Progreso</p>
                                                <p className="text-xs text-gray-600">Visualiza mejoras o retrocesos</p>
                                            </div>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-14 flex items-center justify-start"
                                            onClick={onNavigateToPredictiveAnalytics}
                                        >
                                            <Brain className="h-5 w-5 text-gray-700 mr-3" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Análisis Predictivo</p>
                                                <p className="text-xs text-gray-600">Predicciones basadas en datos</p>
                                            </div>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
});

export default Dashboard;