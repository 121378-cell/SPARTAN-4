/*  Si tu proyecto es Vite / CRA, puedes eliminar "use client"  */
import { useState, lazy, Suspense, memo, useCallback, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { performanceMonitor } from "./lib/performance.ts";
import { initGA, trackPageView, trackEvent, analytics } from "./lib/analytics.ts";
import { freeTierMonitor, trackPageView as trackPageViewUsage } from "./lib/free-tier-monitor";

// Import the Spartan Nervous System
import { spartanNervousSystem } from "./lib/spartan-nervous-system";

import type {
  UserData,
  WorkoutPlan,
  ProgressData,
} from "./lib/types";
import { storageManager } from "./lib/storage";
import { notificationService } from "./lib/notification-service";
import { authManager, type User as AuthUser } from "./lib/auth";

/* Componentes de la aplicación - Lazy loading para optimizar rendimiento */
const AuthScreen = lazy(() => 
  import("./components/AuthScreen").then(module => ({ default: module.default }))
);
const Dashboard = lazy(() => 
  import("./components/Dashboard").then(module => ({ default: module.default }))
);
const ProfileScreen = lazy(() => 
  import("./components/ProfileScreen").then(module => ({ default: module.default }))
);
const WorkoutDetailScreen = lazy(() => 
  import("./components/WorkoutDetailScreen").then(module => ({ default: module.default }))
);
const WorkoutGeneratorScreen = lazy(() => 
  import("./components/WorkoutGeneratorScreen").then(module => ({ default: module.default }))
);
const ExerciseFormChecker = lazy(() => 
  import("./components/ExerciseFormChecker").then(module => ({ default: module.default }))
);
const ProgressReportDashboard = lazy(() => 
  import("./components/ProgressReportDashboard").then(module => ({ default: module.default }))
);
const ProgressComparisonDashboard = lazy(() => 
  import("./components/ProgressComparisonDashboard").then(module => ({ default: module.default }))
);
const MarketplaceDashboard = lazy(() => 
  import("./components/MarketplaceDashboard").then(module => ({ default: module.default }))
);
const PredictiveAnalyticsDashboard = lazy(() => 
  import("./components/PredictiveAnalyticsDashboard").then(module => ({ default: module.default }))
);
const RecipeGenerator = lazy(() => 
  import("./components/RecipeGenerator").then(module => ({ default: module.default }))
);
const CircadianRhythmPlanner = lazy(() => 
  import("./components/CircadianRhythmPlanner").then(module => ({ default: module.default }))
);
const WearableIntegration = lazy(() => 
  import("./components/WearableIntegration").then(module => ({ default: module.default }))
);
const BloodTestAnalyzer = lazy(() => 
  import("./components/BloodTestAnalyzer").then(module => ({ default: module.default }))
);
const OverloadDetection = lazy(() => 
  import("./components/OverloadDetection").then(module => ({ default: module.default }))
);
const SpartanXXIIDashboard = lazy(() => 
  import("./components/SpartanXXIIDashboard").then(module => ({ default: module.default }))
);
const NeuralTraining = lazy(() => 
  import("./components/NeuralTraining").then(module => ({ default: module.default }))
);
const HolographicGym = lazy(() => 
  import("./components/HolographicGym").then(module => ({ default: module.default }))
);
const ScientificAIDashboard = lazy(() => 
  import("./components/ScientificAIDashboard").then(module => ({ default: module.default }))
);
const AdvancedAIDashboard = lazy(() => 
  import("./components/AdvancedAIDashboard").then(module => ({ default: module.default }))
);
const AdvancedWorkoutGeneratorScreen = lazy(() => 
  import("./components/AdvancedWorkoutGeneratorScreen").then(module => ({ default: module.default }))
);
const AdaptiveTrainingDashboard = lazy(() => 
  import("./components/AdaptiveTrainingDashboard").then(module => ({ default: module.default }))
);
const AdaptiveNutritionDashboard = lazy(() => 
  import("./components/AdaptiveNutritionDashboard").then(module => ({ default: module.default }))
);
const NutritionDashboard = lazy(() => 
  import("./components/NutritionDashboard").then(module => ({ default: module.default }))
);
const WorkoutFlowManager = lazy(() => 
  import("./components/WorkoutFlowManager").then(module => ({ default: module.default }))
);
const TechniqueAnalysisDashboard = lazy(() => 
  import("./components/TechniqueAnalysisDashboard").then(module => ({ default: module.default }))
);
const ChatMaestroScreen = lazy(() => 
  import("./components/ChatMaestro").then(module => ({ default: module.default }))
);
const SpartanDashboard = lazy(() => 
  import("./components/SpartanDashboard").then(module => ({ default: module.default }))
);

// Componente de carga
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Cargando...</p>
    </div>
  </div>
));

/* Hoja de estilos global (opcional, pero recomendado) */
import "./index.css";

/* ------------------------------------------------------------------ */
/*  Tipo de pantalla – **fuera** del componente para que no se recree  */
type Screen =
  | "auth"
  | "dashboard"
  | "generator"
  | "profile"
  | "workoutDetail"
  | "exerciseFormChecker"
  | "recipeGenerator"
  | "circadianPlanner"
  | "wearableIntegration"
  | "bloodTestAnalyzer"
  | "overloadDetection"
  | "spartanXXII"
  | "neuralTraining"
  | "holographicGym"
  | "scientificAI"
  | "advancedAI"
  | "advancedWorkout"
  | "adaptiveTraining"
  | "techniqueAnalysis"
  | "adaptiveNutrition"
  | "predictiveAnalytics"
  | "progressReport"
  | "progressComparison"
  | "workoutFlow"
  | "nutrition"
  | "chatMaestro"
  | "spartanDashboard";
/* ------------------------------------------------------------------ */

const App = memo(() => {
  /* -------------------------- STATE -------------------------- */
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");
  const [authUser, setAuthUser] = useState<import("./lib/auth").User | null>(null);
  const [wearableData, setWearableData] = useState<any | null>(null); // Add state for wearable data

  // Performance monitoring, service worker registration, and analytics
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    
    // Track initial page view
    analytics.trackPageView('/', 'SPARTAN 4 - AI Fitness Coach');
    
    // Measure initial app load time
    performanceMonitor.measureUserTiming('App Mount', () => {
      console.log('SPARTAN 4 App mounted successfully');
      analytics.trackPerformance('app_load', performance.now());
    });

    // Register service worker for PWA capabilities
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
          analytics.trackEvent('service_worker_registered', 'pwa');
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available, prompt user to refresh
                  if (confirm('Nueva versión disponible. ¿Recargar la aplicación?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('SW registration failed: ', error);
          analytics.trackError('service_worker_registration_failed');
        });
    }

    // Cleanup on unmount
    return () => {
      performanceMonitor.dispose();
    };
  }, []);

  // Auth state subscription
  useEffect(() => {
    const unsubscribe = authManager.subscribe((state) => {
      setAuthUser(state.user);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Hash routing listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash === 'chat-maestro') {
        setCurrentScreen('chatMaestro');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Cargar datos desde el almacenamiento local
  const [userData, setUserData] = useState<UserData>(() => 
    storageManager.getUserData() || {
      name: "Spartan User",
      age: 30,
      weight: 75,
      height: 180,
      fitnessLevel: "intermediate",
      goals: ["Muscle Gain", "Strength"],
    }
  );

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => 
    storageManager.getWorkoutPlans()
  );
  const [progressData, setProgressData] = useState<ProgressData[]>(() => 
    storageManager.getProgressData()
  );
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [exerciseToCheck, setExerciseToCheck] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ----------------------- HANDLERS ------------------------ */
  const handleLoginSuccess = useCallback(() => setCurrentScreen("dashboard"), []);
  const handleGenerateWorkout = useCallback(() => setCurrentScreen("generator"), []);
  const handleProfileClick = useCallback(() => setCurrentScreen("profile"), []);

  const handleSelectWorkout = useCallback((plan: WorkoutPlan) => {
    setSelectedWorkout(plan);
    setCurrentScreen("workoutDetail");
  }, []);

  const handleBackToDashboard = useCallback(() => setCurrentScreen("dashboard"), []);

  const handleBackToDashboardFromDetail = useCallback(() => {
    setSelectedWorkout(null);
    setCurrentScreen("dashboard");
  }, []);

  const handleCheckForm = useCallback((exerciseName: string) => {
    setExerciseToCheck(exerciseName);
    setCurrentScreen("exerciseFormChecker");
  }, []);

  const handleBackToDetail = useCallback(() => {
    setExerciseToCheck(null);
    setCurrentScreen("workoutDetail");
  }, []);

  const handlePlanGenerated = useCallback((plan: WorkoutPlan) => {
    const newPlans = [plan, ...workoutPlans];
    setWorkoutPlans(newPlans);
    storageManager.setWorkoutPlans(newPlans);
    setCurrentScreen("dashboard");
  }, [workoutPlans]);

  const handleAdvancedPlanGenerated = useCallback((plan: any) => {
    // Convertir PersonalizedWorkoutPlan a WorkoutPlan para compatibilidad
    const convertedPlan: WorkoutPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      focus: plan.primaryGoals.map((g: any) => g.type),
      days: plan.weeklySchedule.sessions.map((session: any, index: number) => ({
        day: index + 1,
        focus: session.type,
        exercises: session.exercises
      })),
      createdAt: plan.lastUpdated,
      updatedAt: plan.lastUpdated,
      duration: plan.weeklySchedule.sessions[0]?.duration || 60,
      difficulty: userData.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
      equipment: plan.weeklySchedule.sessions[0]?.exercises[0]?.equipment ? [plan.weeklySchedule.sessions[0].exercises[0].equipment] : [],
      estimatedCalories: 300
    };
    
    handlePlanGenerated(convertedPlan);
  }, [handlePlanGenerated, userData]);

  const handleWorkoutComplete = useCallback(() => {
    if (!selectedWorkout) return;
    const newProgress = [
      ...progressData,
      {
        workoutId: selectedWorkout.id,
        date: new Date(),
      },
    ];
    setProgressData(newProgress);
    storageManager.setProgressData(newProgress);
    setSelectedWorkout(null);
    setCurrentScreen("dashboard");
  }, [selectedWorkout, progressData]);

  const handleNavigateToRecipes = useCallback(() => setCurrentScreen("recipeGenerator"), []);
  const handleNavigateToCircadian = useCallback(() => setCurrentScreen("circadianPlanner"), []);
  const handleNavigateToWearable = useCallback(() => setCurrentScreen("wearableIntegration"), []);
  const handleNavigateToBloodTestAnalyzer = useCallback(() => setCurrentScreen("bloodTestAnalyzer"), []);
  const handleNavigateToOverloadDetection = useCallback(() => setCurrentScreen("overloadDetection"), []);
  const handleNavigateToProgress = useCallback(() => setCurrentScreen("progressReport"), []);
  const handleNavigateToWorkoutFlow = useCallback(() => setCurrentScreen("workoutFlow"), []);
  const handleLogout = useCallback(() => setCurrentScreen("auth"), []);
  const handleNavigateToNutrition = useCallback(() => setCurrentScreen("nutrition"), []);
  
  // SPARTAN XXII Handlers
  const handleNavigateToSpartanXXII = useCallback(() => setCurrentScreen("spartanXXII"), []);
  const handleNavigateToNeuralTraining = useCallback(() => setCurrentScreen("neuralTraining"), []);
  const handleNavigateToHolographicGym = useCallback(() => setCurrentScreen("holographicGym"), []);
  const handleNavigateToScientificAI = useCallback(() => setCurrentScreen("scientificAI"), []);
  const handleNavigateToAdvancedAI = useCallback(() => setCurrentScreen("advancedAI"), []);
  const handleNavigateToAdvancedWorkout = useCallback(() => setCurrentScreen("advancedWorkout"), []);
  const handleNavigateToAdaptiveTraining = useCallback(() => setCurrentScreen("adaptiveTraining"), []);
  const handleNavigateToTechniqueAnalysis = useCallback(() => setCurrentScreen("techniqueAnalysis"), []);
  const handleNavigateToAdaptiveNutrition = useCallback(() => setCurrentScreen("adaptiveNutrition"), []);
  const handleNavigateToProgressComparison = useCallback(() => setCurrentScreen("progressComparison"), []);
  const handleNavigateToPredictiveAnalytics = useCallback(() => setCurrentScreen("predictiveAnalytics"), []);
  const handleQuantumWorkoutGeneration = useCallback(() => {
    // Simulate quantum workout generation
    setIsGenerating(true);
    // This would integrate with quantum algorithms
    console.log('Generating quantum-enhanced workout...');
  }, []);

  /* ----------------------- RENDERING ----------------------- */
  const renderScreen = useMemo(() => {
    switch (currentScreen) {
      case "auth":
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;

      case "dashboard":
        return (
          <Dashboard
            userData={userData}
            workoutPlans={workoutPlans}
            progressData={progressData}
            onGenerateWorkout={handleGenerateWorkout}
            isGeneratingWorkout={isGenerating}
            onSelectWorkout={handleSelectWorkout}
            onProfileClick={handleProfileClick}
            onNavigateToRecipes={handleNavigateToRecipes}
            onNavigateToCircadian={handleNavigateToCircadian}
            onNavigateToWearable={handleNavigateToWearable}
            onNavigateToBloodTestAnalyzer={handleNavigateToBloodTestAnalyzer}
            onNavigateToOverloadDetection={handleNavigateToOverloadDetection}
            onNavigateToSpartanXXII={handleNavigateToSpartanXXII}
            onNavigateToScientificAI={handleNavigateToScientificAI}
            onNavigateToAdvancedAI={handleNavigateToAdvancedAI}
            onNavigateToAdvancedWorkout={handleNavigateToAdvancedWorkout}
            onNavigateToAdaptiveTraining={handleNavigateToAdaptiveTraining}
            onNavigateToTechniqueAnalysis={handleNavigateToTechniqueAnalysis}
            onNavigateToAdaptiveNutrition={handleNavigateToAdaptiveNutrition}
            onNavigateToProgress={handleNavigateToProgress}
            onNavigateToProgressComparison={handleNavigateToProgressComparison}
            onNavigateToWorkoutFlow={handleNavigateToWorkoutFlow}
            onNavigateToPredictiveAnalytics={handleNavigateToPredictiveAnalytics}
            onNavigateToNutrition={handleNavigateToNutrition}
            onNavigateToChatMaestro={() => setCurrentScreen("chatMaestro")}
            onNavigateToSpartanDashboard={() => setCurrentScreen("spartanDashboard")}
            onLogout={handleLogout}
          />
        );

      case "generator":
        return (
          <WorkoutGeneratorScreen
            onPlanGenerated={handlePlanGenerated}
            onBack={handleBackToDashboard}
            setIsGenerating={setIsGenerating}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            userData={userData}
            setUserData={setUserData}
            onBack={handleBackToDashboard}
          />
        );

      case "workoutDetail":
        if (!selectedWorkout) {
          // Seguridad: si llegamos aquí sin plan seleccionado, volvemos al dashboard
          setCurrentScreen("dashboard");
          return null;
        }
        return (
          <WorkoutDetailScreen
            workoutPlan={selectedWorkout}
            onBack={handleBackToDashboardFromDetail}
            onComplete={handleWorkoutComplete}
            onCheckForm={handleCheckForm}
          />
        );

      case "exerciseFormChecker":
        // Si `exerciseToCheck` es null, simplemente volvemos al detalle
        if (!exerciseToCheck) {
          setCurrentScreen("workoutDetail");
          return null;
        }
        return (
          <ExerciseFormChecker
            exerciseName={exerciseToCheck}
            onBack={handleBackToDetail}
          />
        );

      case "recipeGenerator":
        return <RecipeGenerator onBack={handleBackToDashboard} />;

      case "circadianPlanner":
        return <CircadianRhythmPlanner onBack={handleBackToDashboard} />;

      case "wearableIntegration":
        return (
          <WearableIntegration 
            onBack={handleBackToDashboard} 
            userId={authUser?.id || "default-user-id"}
            onWearableDataProcessed={setWearableData} // Pass callback to receive processed data
          />
        );

      case "bloodTestAnalyzer":
        return <BloodTestAnalyzer onBack={handleBackToDashboard} />;

      case "overloadDetection":
        return <OverloadDetection onBack={handleBackToDashboard} />;

      case "spartanXXII":
        return (
          <SpartanXXIIDashboard
            userData={userData}
            workoutPlans={workoutPlans}
            progressData={progressData}
            onGenerateQuantumWorkout={handleQuantumWorkoutGeneration}
            onNeuralTraining={handleNavigateToNeuralTraining}
            onHolographicGym={handleNavigateToHolographicGym}
            onQuantumNutrition={() => console.log('Quantum Nutrition - Coming Soon')}
            onConsciousnessFitness={() => console.log('Consciousness Fitness - Coming Soon')}
            onTemporalAnalysis={() => console.log('Temporal Analysis - Coming Soon')}
            onBiomodification={() => console.log('Biomodification - Coming Soon')}
            onMultidimensionalMetrics={() => console.log('Multidimensional Metrics - Coming Soon')}
            isGenerating={isGenerating}
            onBack={handleBackToDashboard}
          />
        );

      case "neuralTraining":
        return <NeuralTraining onBack={() => setCurrentScreen("spartanXXII")} />;

      case "holographicGym":
        return <HolographicGym onBack={() => setCurrentScreen("spartanXXII")} />;

      case "scientificAI":
        return <ScientificAIDashboard onBack={handleBackToDashboard} />;

      case "advancedAI":
        return <AdvancedAIDashboard onBack={handleBackToDashboard} userData={userData} />;

      case "advancedWorkout":
        return (
          <AdvancedWorkoutGeneratorScreen
            userData={userData}
            onBack={handleBackToDashboard}
            onPlanGenerated={handleAdvancedPlanGenerated}
          />
        );

      case "adaptiveTraining":
        return (
          <AdaptiveTrainingDashboard
            userData={userData}
            onBack={handleBackToDashboard}
          />
        );

      case "techniqueAnalysis":
        return (
          <TechniqueAnalysisDashboard
            userData={userData}
            onBack={handleBackToDashboard}
          />
        );

      case "adaptiveNutrition":
        return (
          <AdaptiveNutritionDashboard
            userData={userData}
            onBack={handleBackToDashboard}
          />
        );

      case "predictiveAnalytics":
        return (
          <PredictiveAnalyticsDashboard
            userData={userData}
            onBack={handleBackToDashboard}
          />
        );

      case "progressReport":
        return (
          <ProgressReportDashboard
            userId={authUser?.id || "default-user-id"}
            onBack={handleBackToDashboard}
          />
        );

      case "progressComparison":
        return (
          <ProgressComparisonDashboard
            userId={authUser?.id || "default-user-id"}
            onBack={handleBackToDashboard}
          />
        );

      case "workoutFlow":
        return (
          <WorkoutFlowManager
            workoutPlans={workoutPlans}
            onBack={handleBackToDashboard}
          />
        );

      case "nutrition":
        return (
          <NutritionDashboard
            userData={userData}
            onBack={handleBackToDashboard}
          />
        );

      case "chatMaestro":
        return (
          <ChatMaestroScreen
            userId={authUser?.id || "default-user-id"}
            currentScreen="chatMaestro"
            userData={userData}
            wearableData={wearableData} // Pass wearable data to Chat Maestro
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            onClose={() => setCurrentScreen("dashboard")}
          />
        );

      case "spartanDashboard":
        return (
          <SpartanDashboard
            userId={authUser?.id || "default-user-id"}
            userData={userData}
            workoutPlans={workoutPlans}
            progressData={progressData}
            onLogout={handleLogout}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
          />
        );

      default:
        // Nunca debería llegar aquí, pero por seguridad rendereamos AuthScreen
        return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
    }
  }, [
    currentScreen,
    userData,
    workoutPlans,
    progressData,
    isGenerating,
    selectedWorkout,
    exerciseToCheck,
    authUser,
    wearableData, // Add to dependencies
    handleLoginSuccess,
    handleGenerateWorkout,
    handleSelectWorkout,
    handleProfileClick,
    handleNavigateToRecipes,
    handleNavigateToCircadian,
    handleNavigateToWearable,
    handleNavigateToBloodTestAnalyzer,
    handleNavigateToOverloadDetection,
    handleNavigateToProgress,
    handleNavigateToProgressComparison,
    handleNavigateToWorkoutFlow,
    handleLogout,
    handlePlanGenerated,
    handleBackToDashboard,
    handleBackToDashboardFromDetail,
    handleWorkoutComplete,
    handleCheckForm,
    handleBackToDetail,
    handleNavigateToPredictiveAnalytics,
    handleNavigateToNutrition,
    wearableData // Add wearableData to dependencies
  ]);

  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      // In production, you would send this to your error reporting service
      console.error('Application Error:', error, errorInfo);
    }}>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="app-container">{renderScreen}</div>
      </Suspense>
    </ErrorBoundary>
  );
});

export default App;

/* ------------ ROOT MOUNT (única vez) ------------ */
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}