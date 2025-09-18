import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "./ui";
import { Calendar, Clock, Heart, User, Settings, Plus, Utensils, Zap, Droplets, StretchHorizontal, LogOut, Brain, Microscope, TrendingUp, BarChart3, Bell, ChevronRight, Dumbbell } from "lucide-react";
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
    onLogout: () => void;
}

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SPARTAN 4</h1>
                        {authUser && (
                            <p className="text-sm text-gray-600 font-medium">
                                ¡Hola, {authUser.name}! 👋
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.location.hash = '#chat-maestro'}
                            className="h-10 w-10 rounded-full hover:bg-blue-100 transition-colors"
                            title="Chat Maestro"
                        >
                            <Brain className="h-5 w-5 text-purple-600" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onProfileClick}
                            className="h-10 w-10 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            <User className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            <Settings className="h-5 w-5 text-gray-600" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleLogout} 
                            title="Cerrar sesión"
                            className="h-10 w-10 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="h-5 w-5 text-gray-600 hover:text-red-600" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex border-b border-gray-200 mb-10 bg-white rounded-lg shadow-sm p-2">
                    <Button
                        variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                        size="default"
                        onClick={() => setActiveTab('dashboard')}
                        className={`rounded-md px-6 py-3 font-semibold transition-all ${
                            activeTab === 'dashboard' 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        Panel Principal
                    </Button>
                    <Button
                        variant={activeTab === 'workouts' ? 'default' : 'ghost'}
                        size="default"
                        onClick={() => setActiveTab('workouts')}
                        className={`rounded-md px-6 py-3 font-semibold transition-all ${
                            activeTab === 'workouts' 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        Entrenamientos
                    </Button>
                    <Button
                        variant={activeTab === 'progress' ? 'default' : 'ghost'}
                        size="default"
                        onClick={() => setActiveTab('progress')}
                        className={`rounded-md px-6 py-3 font-semibold transition-all ${
                            activeTab === 'progress' 
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        Progreso
                    </Button>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-10">
                        {/* Notifications Section */}
                        {notifications.length > 0 && (
                            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                        <Bell className="h-5 w-5 mr-2 text-blue-500" />
                                        Notificaciones
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {notifications.map((notification, index) => (
                                            <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-gray-200">
                                                <Bell className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                                                <p className="text-sm text-gray-700">{notification}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Predicted Next Session */}
                        {predictedNextSession && (
                            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                                        Próxima Sesión Predicha
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-medium text-gray-900">Basado en tu historial de entrenamiento</p>
                                            <p className="text-sm text-gray-600 mt-1">El sistema predice tu próxima sesión</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">{formatDate(predictedNextSession)}</p>
                                            <p className="text-sm text-gray-600 mt-1">¡Prepárate para entrenar!</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid gap-8 md:grid-cols-3">
                            <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-sm font-medium text-green-100">Entrenamientos Completados</CardTitle>
                                    <Heart className="h-6 w-6 text-green-100" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
                                    <p className="text-xs text-green-100 mt-2">¡Sigue así de bien!</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-sm font-medium text-purple-100">Último Plan de Entrenamiento</CardTitle>
                                    <Calendar className="h-6 w-6 text-purple-100" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold truncate">
                                        {recentPlans.length > 0 ? recentPlans[0].name : "Sin planes"}
                                    </div>
                                    <p className="text-xs text-purple-100 mt-2">
                                        {recentPlans.length > 0 
                                            ? `${recentPlans[0].days.length} días, ${recentPlans[0].duration} min` 
                                            : "Crea tu primer plan"}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-sm font-medium text-amber-100">Esta Semana</CardTitle>
                                    <Zap className="h-6 w-6 text-amber-100" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stats.thisWeek}</div>
                                    <p className="text-xs text-amber-100 mt-2">Sesiones completadas</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-gray-900">Planes de Entrenamiento Recientes</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Tus planes más recientes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentPlans.length > 0 ? (
                                            recentPlans.map((plan) => (
                                                <div 
                                                    key={plan.id} 
                                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                                    onClick={() => onSelectWorkout(plan)}
                                                >
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{plan.name}</h3>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{plan.description}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {plan.days.length} días
                                                        </Badge>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8">
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto" />
                                                <p className="mt-4 text-gray-600">Aún no tienes planes de entrenamiento</p>
                                                <Button 
                                                    onClick={onGenerateWorkout} 
                                                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-gray-900">Herramientas Rápidas</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Acceso directo a tus herramientas favoritas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200"
                                            onClick={onNavigateToRecipes}
                                        >
                                            <Utensils className="h-6 w-6 text-blue-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Recetas</span>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 border-green-200"
                                            onClick={onNavigateToCircadian}
                                        >
                                            <Clock className="h-6 w-6 text-green-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Ritmo Circadiano</span>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                                            onClick={onNavigateToWearable}
                                        >
                                            <Droplets className="h-6 w-6 text-purple-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Wearables</span>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200"
                                            onClick={onNavigateToWorkoutFlow}
                                        >
                                            <Zap className="h-6 w-6 text-amber-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Flujo de Entreno</span>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-red-200"
                                            onClick={onNavigateToNutrition}
                                        >
                                            <Utensils className="h-6 w-6 text-red-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Nutrición</span>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="h-20 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200"
                                            onClick={() => window.location.hash = '#load-progression'}
                                        >
                                            <TrendingUp className="h-6 w-6 text-indigo-600 mb-2" />
                                            <span className="text-sm font-medium text-gray-900">Progresión</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'workouts' && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Planes de Entrenamiento</h2>
                                <p className="text-gray-600 mt-1">Gestiona y accede a tus planes de entrenamiento</p>
                            </div>
                            <Button 
                                onClick={onGenerateWorkout} 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {workoutPlans.length > 0 ? (
                                workoutPlans.map((plan) => (
                                    <Card 
                                        key={plan.id} 
                                        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                                        onClick={() => onSelectWorkout(plan)}
                                    >
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold text-gray-900">{plan.name}</CardTitle>
                                            <CardDescription className="text-gray-600 line-clamp-2">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
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
                                                            <Badge key={index} variant="secondary" className="text-xs">
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
                                    <Dumbbell className="h-16 w-16 text-gray-400 mx-auto" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No hay planes de entrenamiento</h3>
                                    <p className="mt-2 text-gray-600">Crea tu primer plan de entrenamiento para comenzar</p>
                                    <Button 
                                        onClick={onGenerateWorkout} 
                                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Progreso</h2>
                            <p className="text-gray-600 mt-1">Visualiza tu evolución y mejora continua</p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
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
                                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                                            <p className="mt-4 text-gray-600">Aún no tienes datos de progreso</p>
                                            <p className="text-sm text-gray-500 mt-1">Completa sesiones de entrenamiento para ver tu progreso</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-bold text-gray-900">Herramientas de Progreso</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Analiza y compara tu evolución
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-16 flex items-center justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200"
                                            onClick={onNavigateToProgress}
                                        >
                                            <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Informe de Progreso</p>
                                                <p className="text-xs text-gray-600">Análisis detallado de tu evolución</p>
                                            </div>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-16 flex items-center justify-start bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 border-green-200"
                                            onClick={onNavigateToProgressComparison}
                                        >
                                            <StretchHorizontal className="h-6 w-6 text-green-600 mr-3" />
                                            <div className="text-left">
                                                <p className="font-medium text-gray-900">Comparar Progreso</p>
                                                <p className="text-xs text-gray-600">Visualiza mejoras o retrocesos</p>
                                            </div>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-16 flex items-center justify-start bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                                            onClick={onNavigateToPredictiveAnalytics}
                                        >
                                            <Brain className="h-6 w-6 text-purple-600 mr-3" />
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