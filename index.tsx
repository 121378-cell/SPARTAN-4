/*  Si tu proyecto es Vite / CRA, puedes eliminar "use client"  */
import { useState, lazy, Suspense, memo, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";

import type {
  UserData,
  WorkoutPlan,
  ProgressData,
} from "./lib/types";
import { storageManager } from "./lib/storage";

/* Componentes de la aplicación - Lazy loading para optimizar rendimiento */
const AuthScreen = lazy(() => import("./components/AuthScreen"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ProfileScreen = lazy(() => import("./components/ProfileScreen"));
const WorkoutDetailScreen = lazy(() => import("./components/WorkoutDetailScreen"));
const WorkoutGeneratorScreen = lazy(() => import("./components/WorkoutGeneratorScreen"));
const ExerciseFormChecker = lazy(() => import("./components/ExerciseFormChecker"));
const RecipeGenerator = lazy(() => import("./components/RecipeGenerator"));
const CircadianRhythmPlanner = lazy(() => import("./components/CircadianRhythmPlanner"));
const WearableIntegration = lazy(() => import("./components/WearableIntegration"));
const BloodTestAnalyzer = lazy(() => import("./components/BloodTestAnalyzer"));
const OverloadDetection = lazy(() => import("./components/OverloadDetection"));

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
  | "overloadDetection";
/* ------------------------------------------------------------------ */

const App = memo(() => {
  /* -------------------------- STATE -------------------------- */
  const [currentScreen, setCurrentScreen] = useState<Screen>("auth");

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
  const handleLogout = useCallback(() => setCurrentScreen("auth"), []);

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
        return <WearableIntegration onBack={handleBackToDashboard} />;

      case "bloodTestAnalyzer":
        return <BloodTestAnalyzer onBack={handleBackToDashboard} />;

      case "overloadDetection":
        return <OverloadDetection onBack={handleBackToDashboard} />;

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
    handleLoginSuccess,
    handleGenerateWorkout,
    handleSelectWorkout,
    handleProfileClick,
    handleNavigateToRecipes,
    handleNavigateToCircadian,
    handleNavigateToWearable,
    handleNavigateToBloodTestAnalyzer,
    handleNavigateToOverloadDetection,
    handleLogout,
    handlePlanGenerated,
    handleBackToDashboard,
    handleBackToDashboardFromDetail,
    handleWorkoutComplete,
    handleCheckForm,
    handleBackToDetail
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="app-container">{renderScreen}</div>
    </Suspense>
  );
});

export default App;

/* ------------ ROOT MOUNT (única vez) ------------ */
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
