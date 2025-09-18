import React, { useState } from 'react';
import { Button } from "./ui";
import { ChevronLeft } from "lucide-react";
import type { WorkoutPlan } from '../lib/types';
import WorkoutCalendar from './WorkoutCalendar';
import WorkoutSessionTemplate from './WorkoutSessionTemplate';

interface WorkoutFlowManagerProps {
  workoutPlans: WorkoutPlan[];
  onBack: () => void;
}

type FlowState = 'calendar' | 'session';

export default function WorkoutFlowManager({ 
  workoutPlans, 
  onBack 
}: WorkoutFlowManagerProps) {
  const [flowState, setFlowState] = useState<FlowState>('calendar');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleWorkoutSelect = (workout: WorkoutPlan, date: Date) => {
    setSelectedWorkout(workout);
    setSelectedDate(date);
    setFlowState('session');
  };

  const handleSessionComplete = (sessionData: any) => {
    // In a real implementation, this would save the session data and update progression
    console.log('Session completed:', sessionData);
    
    // Show a success message and return to calendar
    alert('¡Sesión completada con éxito! Los datos se han guardado y la progresión se ha actualizado.');
    setFlowState('calendar');
    setSelectedWorkout(null);
  };

  const handleBackToCalendar = () => {
    setFlowState('calendar');
    setSelectedWorkout(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {flowState === 'calendar' ? (
        <WorkoutCalendar 
          workoutPlans={workoutPlans}
          onWorkoutSelect={handleWorkoutSelect}
          onBack={onBack}
        />
      ) : flowState === 'session' && selectedWorkout ? (
        <WorkoutSessionTemplate
          workoutPlan={selectedWorkout}
          selectedDate={selectedDate}
          onBack={handleBackToCalendar}
          onComplete={handleSessionComplete}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      )}
    </div>
  );
}