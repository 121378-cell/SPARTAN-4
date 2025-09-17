import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "./ui";
import { Calendar, Clock, Heart, User, Settings, Plus, Utensils, Zap, Droplets, StretchHorizontal, LogOut, Brain, Microscope, TrendingUp, BarChart3 } from "lucide-react";
import type { UserData, WorkoutPlan, ProgressData } from '../lib/types';
import { authManager, type User as AuthUser } from '../lib/auth';

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
    onLogout,
}: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'workouts' | 'progress'>('dashboard');
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const unsubscribe = authManager.subscribe((state) => {
            setAuthUser(state.user);
        });
        
        return () => {
            unsubscribe();
        };
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
                                        {workoutPlans.length > 0 ? workoutPlans[0].name : 'Ninguno'}
                                    </div>
                                    {/* FIX: Property 'duration' does not exist on type 'WorkoutPlan'. Check if it exists. */}
                                    <p className="text-xs text-purple-100 mt-2">
                                        {workoutPlans.length > 0 ? (workoutPlans[0].duration ? `${workoutPlans[0].duration} min` : '') : 'Generar un plan'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                    <CardTitle className="text-sm font-medium text-orange-100">Nivel de Forma Física</CardTitle>
                                    <User className="h-6 w-6 text-orange-100" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold capitalize">{userData.fitnessLevel}</div>
                                    <p className="text-xs text-orange-100 truncate mt-2">{userData.goals.join(', ')}</p>
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="pb-6">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">¿Listo para un Nuevo Desafío?</CardTitle>
                                <CardDescription className="text-gray-600 text-lg">Elige tu nivel de personalización para generar tu plan de entrenamiento ideal.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Generador Básico */}
                                    <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                        <h4 className="font-semibold text-lg mb-2">🚀 Generación Rápida</h4>
                                        <p className="text-sm text-gray-600 mb-4">Plan básico personalizado con IA en segundos</p>
                                        <Button 
                                            onClick={onGenerateWorkout} 
                                            disabled={isGeneratingWorkout} 
                                            size="default" 
                                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg"
                                        >
                                            {isGeneratingWorkout ? 'Generando...' : 'Generar Plan Rápido'}
                                        </Button>
                                    </div>
                                    
                                    {/* Generador Avanzado */}
                                    {onNavigateToAdvancedWorkout && (
                                        <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                            <h4 className="font-semibold text-lg mb-2">🧬 Personalización Avanzada</h4>
                                            <p className="text-sm text-gray-600 mb-4">Plan ultra-personalizado con análisis completo</p>
                                            <Button 
                                                onClick={onNavigateToAdvancedWorkout}
                                                size="default" 
                                                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg"
                                            >
                                                Crear Plan Avanzado
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Adaptive Training System */}
                            {onNavigateToAdaptiveTraining && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                            Entrenamiento Adaptativo
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Ajusta automáticamente pesos, series y descansos basado en RPE, RIR y métricas de recuperación.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToAdaptiveTraining} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Activar Adaptación IA
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Technique Analysis AI */}
                            {onNavigateToTechniqueAnalysis && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                            Análisis de Técnica IA
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Análisis en tiempo real de movimiento con sensores y video para prevenir lesiones.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToTechniqueAnalysis} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Activar Análisis IA
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
                                            <Utensils className="h-6 w-6 text-white" />
                                        </div>
                                        Planifica tu Nutrición
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-base">Genera planes de comidas inteligentes y recetas adaptativas con IA.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Button 
                                            onClick={onNavigateToRecipes} 
                                            size="default" 
                                            variant="outline"
                                            className="h-12 px-4 bg-white border-2 border-green-200 hover:bg-green-50 text-green-700 font-semibold rounded-lg shadow-sm transition-all duration-200"
                                        >
                                            Generador de Recetas
                                        </Button>
                                        {onNavigateToAdaptiveNutrition && (
                                            <Button 
                                                onClick={onNavigateToAdaptiveNutrition} 
                                                size="default" 
                                                className="h-12 px-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                            >
                                                🧠 Nutrición Adaptativa IA
                                            </Button>
                                        )}
                                    </div>
                                    {onNavigateToAdaptiveNutrition && (
                                        <p className="text-xs text-gray-500 text-center">
                                            ⚡ El sistema adaptativo ajusta tu plan en tiempo real según tu actividad física
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                        Optimizador de Ritmo Circadiano
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-base">Sincroniza tu estilo de vida con tu reloj biológico para un rendimiento óptimo.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <Button 
                                        onClick={onNavigateToCircadian} 
                                        size="default" 
                                        className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                    >
                                        Optimizar mi Ritmo
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        Integración de Wearables
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-base">Conecta tus dispositivos para obtener conocimientos profundos sobre tu salud.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <Button 
                                        onClick={onNavigateToWearable} 
                                        size="default" 
                                        className="h-12 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                    >
                                        Conectar y Analizar
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg">
                                            <Droplets className="h-6 w-6 text-white" />
                                        </div>
                                        Analizador de Análisis de Sangre
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-base">Obtén conocimientos impulsados por IA de tus resultados de análisis de sangre para un rendimiento óptimo.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <Button 
                                        onClick={onNavigateToBloodTestAnalyzer} 
                                        size="default" 
                                        className="h-12 px-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                    >
                                        Analizar mis Resultados
                                    </Button>
                                </CardContent>
                            </Card>
                             <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg">
                                            <StretchHorizontal className="h-6 w-6 text-white" />
                                        </div>
                                        Detección de Sobrecarga
                                    </CardTitle>
                                    <CardDescription className="text-gray-600 text-base">Identifica la tensión muscular y obtén recomendaciones de ejercicios correctivos.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <Button 
                                        onClick={onNavigateToOverloadDetection} 
                                        size="default" 
                                        className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                    >
                                        Analizar Ahora
                                    </Button>
                                </CardContent>
                            </Card>
                            
                            {/* SPARTAN XXII Future Mode */}
                            {onNavigateToSpartanXXII && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
                                                <Brain className="h-6 w-6 text-white" />
                                            </div>
                                            SPARTAN XXII - Modo Futuro
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Accede al ecosistema de fitness del siglo XXII con tecnologías cuánticas avanzadas.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToSpartanXXII} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Entrar al Futuro
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Scientific AI Dashboard */}
                            {onNavigateToScientificAI && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg">
                                                <Microscope className="h-6 w-6 text-white" />
                                            </div>
                                            IA Científica Adaptativa
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Sistema de aprendizaje continuo basado en evidencia científica mundial en tiempo real.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToScientificAI} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Explorar Evidencia
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Advanced AI Comprehensive Dashboard */}
                            {onNavigateToAdvancedAI && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-violet-400 to-purple-500 rounded-lg">
                                                <Brain className="h-6 w-6 text-white" />
                                            </div>
                                            IA Experta Integral
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Sistema experto en fitness, nutrición, longevidad y psicología con análisis científico avanzado.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToAdvancedAI} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Acceder a IA Experta
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            
                            {/* Progress Report Dashboard */}
                            {onNavigateToProgress && (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg">
                                                <BarChart3 className="h-6 w-6 text-white" />
                                            </div>
                                            Informe de Progreso
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 text-base">Analiza tu evolución con métricas detalladas de entrenamiento, nutrición y salud.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <Button 
                                            onClick={onNavigateToProgress} 
                                            size="default" 
                                            className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
                                        >
                                            Ver Informe Detallado
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'workouts' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Your Workout Plans</h2>
                            {/* FIX: Added missing variant and size props to Button component */}
                            <Button onClick={onGenerateWorkout} disabled={isGeneratingWorkout} variant="default" size="default">
                                <Plus className="mr-2 h-4 w-4" />
                                {isGeneratingWorkout ? 'Generating...' : 'New Plan'}
                            </Button>
                        </div>
                        {workoutPlans.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No workout plans yet. Generate your first AI-powered plan!</p>
                                    {/* FIX: Added missing variant and size props to Button component */}
                                    <Button className="mt-4" onClick={onGenerateWorkout} disabled={isGeneratingWorkout} variant="default" size="default">
                                        {isGeneratingWorkout ? 'Generating...' : 'Generate Workout Plan'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {workoutPlans.map(plan => (
                                    <Card
                                        key={plan.id}
                                        className="cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => onSelectWorkout(plan)}
                                    >
                                        <CardHeader>
                                            <CardTitle className="truncate">{plan.name}</CardTitle>
                                            <CardDescription className="line-clamp-2 h-10">{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {/* FIX: Property 'duration' does not exist on type 'WorkoutPlan'. Check if it exists. */}
                                                {plan.duration && <span>{plan.duration} minutes</span>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Your Progress</h2>
                        {progressData.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">No progress data yet. Complete a workout to track your progress!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workout History</CardTitle>
                                    <CardDescription>Your completed workout sessions, sorted by most recent.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {progressData.map((progress, index) => {
                                            const workout = workoutPlans.find(w => w.id === progress.workoutId);
                                            return (
                                                <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold">{workout?.name || 'Unknown Workout'}</h3>
                                                        <p className="text-sm text-muted-foreground">{progress.date.toLocaleDateString()}</p>
                                                        {progress.notes && (
                                                            <p className="mt-2 text-sm text-muted-foreground">Notes: {progress.notes}</p>
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
});

export default Dashboard;
