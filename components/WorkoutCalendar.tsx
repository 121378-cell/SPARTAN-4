import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "./ui";
import { 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Zap, 
  TrendingUp, 
  RotateCcw, 
  Activity,
  Clock,
  Calendar as CalendarIcon,
  Bell,
  Coffee,
  Apple
} from "lucide-react";
import type { WorkoutPlan } from '../lib/types';
import { habitTrackingService } from '../lib/habit-tracking';

interface WorkoutCalendarProps {
  workoutPlans: WorkoutPlan[];
  onWorkoutSelect: (workout: WorkoutPlan, date: Date) => void;
  onBack: () => void;
}

// Define exercise categories and their colors
const CATEGORY_COLORS: Record<string, string> = {
  'fuerza': 'bg-red-500',
  'hipertrofia': 'bg-blue-500',
  'definicion': 'bg-green-500',
  'movilidad': 'bg-yellow-500',
  'cardio': 'bg-purple-500',
  'descanso': 'bg-gray-500',
  'default': 'bg-indigo-500'
};

const CATEGORY_LABELS: Record<string, string> = {
  'fuerza': 'Fuerza',
  'hipertrofia': 'Hipertrofia',
  'definicion': 'Definición',
  'movilidad': 'Movilidad',
  'cardio': 'Cardio',
  'descanso': 'Descanso',
  'default': 'General'
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'fuerza': <Dumbbell className="h-3 w-3" />,
  'hipertrofia': <Zap className="h-3 w-3" />,
  'definicion': <TrendingUp className="h-3 w-3" />,
  'movilidad': <RotateCcw className="h-3 w-3" />,
  'cardio': <Activity className="h-3 w-3" />,
  'descanso': <Clock className="h-3 w-3" />,
  'default': <CalendarIcon className="h-3 w-3" />
};

export default function WorkoutCalendar({ 
  workoutPlans, 
  onWorkoutSelect,
  onBack
}: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWorkouts, setSelectedWorkouts] = useState<Record<string, WorkoutPlan>>({});
  const [predictedPatterns, setPredictedPatterns] = useState<{
    nextLikelySession: Date | null;
    recommendedTimes: string[];
    recommendedDays: number[];
    averageDuration: number;
  } | null>(null);
  const [recommendations, setRecommendations] = useState<{
    workoutReminders: string[];
    restRecommendations: string[];
    nutritionTips: string[];
  } | null>(null);

  // Load user habits and predictions
  useEffect(() => {
    const userId = 'default-user'; // In a real app, this would come from auth
    const patterns = habitTrackingService.predictTrainingPatterns(userId);
    const recs = habitTrackingService.generateRecommendations(userId);
    
    setPredictedPatterns(patterns);
    setRecommendations(recs);
  }, []);

  // Generate calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days from previous month to show
    const prevMonthDays = firstDay.getDay();
    // Days from next month to show
    const nextMonthDays = 6 - lastDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getWorkoutForDate = (date: Date) => {
    const key = formatDateKey(date);
    return selectedWorkouts[key];
  };

  const assignWorkoutToDate = (workout: WorkoutPlan, date: Date) => {
    const key = formatDateKey(date);
    setSelectedWorkouts(prev => ({
      ...prev,
      [key]: workout
    }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
      return newDate;
    });
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isPredictedDay = (date: Date) => {
    if (!predictedPatterns?.recommendedDays) return false;
    return predictedPatterns.recommendedDays.includes(date.getDay());
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Calendario de Entrenamiento
            </h1>
            <p className="text-gray-600">
              Planifica y sigue tu progreso semanal
            </p>
          </div>
          <Button 
            variant="outline" 
            size="default" 
            onClick={onBack}
            className="h-10 px-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            Volver al Panel
          </Button>
        </div>

        {/* Recommendations Section */}
        {recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {recommendations.workoutReminders.length > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                    <Bell className="h-5 w-5 mr-2 text-blue-500" />
                    Recordatorios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.workoutReminders.map((reminder, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0"></div>
                        {reminder}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {recommendations.restRecommendations.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                    <Coffee className="h-5 w-5 mr-2 text-green-500" />
                    Descanso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.restRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {recommendations.nutritionTips.length > 0 && (
              <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-bold text-gray-900">
                    <Apple className="h-5 w-5 mr-2 text-orange-500" />
                    Nutrición
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendations.nutritionTips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 mr-2 flex-shrink-0"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Calendar Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
                className="h-10 w-10 bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <h2 className="text-xl font-bold text-gray-900">
                {getMonthName(currentDate)}
              </h2>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
                className="h-10 w-10 bg-white/80 border-gray-200 text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, index) => {
                const day = dayObj.date;
                const workout = getWorkoutForDate(day);
                const dayKey = formatDateKey(day);
                const isPredicted = isPredictedDay(day);
                
                return (
                  <div 
                    key={index}
                    className={`min-h-24 rounded-lg border p-2 relative ${
                      dayObj.isCurrentMonth 
                        ? isToday(day) 
                          ? 'bg-blue-50 border-blue-300' 
                          : isPredicted
                            ? 'bg-purple-50 border-purple-200'
                            : 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}
                  >
                    {/* Prediction indicator */}
                    {isPredicted && !isToday(day) && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-medium ${
                        isToday(day) ? 'text-blue-600' : ''
                      }`}>
                        {getDayNumber(day)}
                      </span>
                      {workout && (
                        <div className="flex flex-wrap gap-1">
                          {workout.focus.map((focus, idx) => {
                            const normalizedFocus = focus.toLowerCase();
                            return (
                              <div 
                                key={idx}
                                className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[normalizedFocus] || CATEGORY_COLORS['default']}`}
                                title={CATEGORY_LABELS[normalizedFocus] || focus}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {workout ? (
                      <div 
                        className="mt-1 cursor-pointer group"
                        onClick={() => onWorkoutSelect(workout, day)}
                      >
                        <div className="text-xs font-medium text-gray-900 group-hover:text-blue-600 truncate">
                          {workout.name}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {workout.focus.slice(0, 2).map((focus, idx) => {
                            const normalizedFocus = focus.toLowerCase();
                            return (
                              <span 
                                key={idx}
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  CATEGORY_COLORS[normalizedFocus] 
                                    ? `${CATEGORY_COLORS[normalizedFocus].replace('500', '100')} text-${normalizedFocus === 'fuerza' ? 'red' : normalizedFocus === 'hipertrofia' ? 'blue' : normalizedFocus === 'definicion' ? 'green' : normalizedFocus === 'movilidad' ? 'yellow' : normalizedFocus === 'cardio' ? 'purple' : 'indigo'}-800 border-${normalizedFocus === 'fuerza' ? 'red' : normalizedFocus === 'hipertrofia' ? 'blue' : normalizedFocus === 'definicion' ? 'green' : normalizedFocus === 'movilidad' ? 'yellow' : normalizedFocus === 'cardio' ? 'purple' : 'indigo'}-200`
                                    : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                } border`}
                              >
                                {CATEGORY_ICONS[normalizedFocus] || CATEGORY_ICONS['default']}
                                <span className="ml-1">{CATEGORY_LABELS[normalizedFocus] || focus}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 space-y-1">
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedWorkout = workoutPlans.find(w => w.id === e.target.value);
                            if (selectedWorkout) {
                              assignWorkoutToDate(selectedWorkout, day);
                            }
                          }}
                          className="w-full text-xs rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Asignar entrenamiento</option>
                          {workoutPlans.map(workout => (
                            <option key={workout.id} value={workout.id}>
                              {workout.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Workout Plans */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              Planes de Entrenamiento Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutPlans.map(workout => (
                <div 
                  key={workout.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    // For demo purposes, assign to today
                    assignWorkoutToDate(workout, new Date());
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{workout.name}</h3>
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {workout.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {workout.focus.slice(0, 3).map((focus, index) => {
                      const normalizedFocus = focus.toLowerCase();
                      return (
                        <span 
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            CATEGORY_COLORS[normalizedFocus] 
                              ? `${CATEGORY_COLORS[normalizedFocus].replace('500', '100')} text-${normalizedFocus === 'fuerza' ? 'red' : normalizedFocus === 'hipertrofia' ? 'blue' : normalizedFocus === 'definicion' ? 'green' : normalizedFocus === 'movilidad' ? 'yellow' : normalizedFocus === 'cardio' ? 'purple' : 'indigo'}-800 border-${normalizedFocus === 'fuerza' ? 'red' : normalizedFocus === 'hipertrofia' ? 'blue' : normalizedFocus === 'definicion' ? 'green' : normalizedFocus === 'movilidad' ? 'yellow' : normalizedFocus === 'cardio' ? 'purple' : 'indigo'}-200`
                              : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                          } border`}
                        >
                          {CATEGORY_ICONS[normalizedFocus] || CATEGORY_ICONS['default']}
                          <span className="ml-1">{CATEGORY_LABELS[normalizedFocus] || focus}</span>
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>{workout.days.length} días</span>
                    <span>{workout.duration} min</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}