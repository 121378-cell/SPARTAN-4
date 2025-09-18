import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui";
import { 
  ArrowLeft, 
  Utensils, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  Activity, 
  Target, 
  Zap, 
  Droplets, 
  Apple, 
  Calendar,
  Settings,
  BarChart3,
  ChefHat,
  MapPin,
  Flame
} from 'lucide-react';
import type { UserData, Meal, DailyNutrition, NutritionGoal } from '../lib/types';
import { nutritionService } from '../lib/nutrition-service';
import { storageManager } from '../lib/storage';

interface NutritionDashboardProps {
  userData: UserData;
  onBack: () => void;
}

const NutritionDashboard = ({ userData, onBack }: NutritionDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'meals' | 'shopping' | 'analytics'>('plan');
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoal[]>(['maintenance']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDailyNutrition();
  }, [selectedDate]);

  const loadDailyNutrition = () => {
    setIsLoading(true);
    try {
      const userId = 'default-user'; // In a real app, this would come from auth
      const nutritionData = nutritionService.getNutritionRecommendations(userId, selectedDate);
      setDailyNutrition(nutritionData);
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMacroColor = (macro: string): string => {
    const colors: Record<string, string> = {
      protein: 'text-blue-600',
      carbs: 'text-green-600',
      fats: 'text-yellow-600',
      calories: 'text-purple-600'
    };
    return colors[macro] || 'text-gray-600';
  };

  const renderPlanTab = () => (
    <div className="space-y-6">
      {/* Daily Nutrition Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Plan Nutricional del Día
          </CardTitle>
          <CardDescription>
            Recomendaciones personalizadas para {formatDate(selectedDate)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyNutrition ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {dailyNutrition.totalNutrients.calories}
                  </div>
                  <div className="text-sm text-gray-600">Calorías</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dailyNutrition.totalNutrients.protein}g
                  </div>
                  <div className="text-sm text-gray-600">Proteína</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {dailyNutrition.totalNutrients.carbs}g
                  </div>
                  <div className="text-sm text-gray-600">Carbohidratos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {dailyNutrition.totalNutrients.fats}g
                  </div>
                  <div className="text-sm text-gray-600">Grasas</div>
                </div>
              </div>

              {dailyNutrition.calorieExpenditure && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Calorías quemadas estimadas:
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {dailyNutrition.calorieExpenditure} kcal
                    </span>
                  </div>
                </div>
              )}

              {dailyNutrition.nutritionGoal && (
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Objetivo nutricional:
                    </span>
                    <span className="text-sm font-bold text-green-600 capitalize">
                      {dailyNutrition.nutritionGoal}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Cargando plan nutricional...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meals for the Day */}
      {dailyNutrition && dailyNutrition.meals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-green-600" />
              Comidas del Día
            </CardTitle>
            <CardDescription>
              {dailyNutrition.meals.length} comidas programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyNutrition.meals.map((meal, index) => (
                <div 
                  key={meal.id} 
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{meal.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{meal.time}</span>
                        {meal.workoutRelated && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <Activity className="h-3 w-3 mr-1" />
                            Relacionado al entrenamiento
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {meal.nutrients.calories} kcal
                      </div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-blue-600">
                          P: {meal.nutrients.protein}g
                        </span>
                        <span className="text-xs text-green-600">
                          C: {meal.nutrients.carbs}g
                        </span>
                        <span className="text-xs text-yellow-600">
                          G: {meal.nutrients.fats}g
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {meal.ingredients.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredientes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {meal.ingredients.map((ingredient, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Tips */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Consejos Nutricionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <span className="text-lg">💧</span>
              <span className="text-sm text-gray-700">
                Mantén una buena hidratación: 35ml por kg de peso corporal
              </span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <span className="text-lg">⏰</span>
              <span className="text-sm text-gray-700">
                Come cada 3-4 horas para mantener niveles estables de energía
              </span>
            </div>
            <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
              <span className="text-lg">🍽️</span>
              <span className="text-sm text-gray-700">
                Incluye proteínas en cada comida para optimizar la síntesis proteica
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMealsTab = () => (
    <div className="space-y-6">
      {dailyNutrition ? (
        <div className="space-y-6">
          {dailyNutrition.meals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-green-600" />
                    {meal.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{meal.time}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Información Nutricional</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calorías: <span className="font-medium">{meal.nutrients.calories}</span></div>
                      <div>Proteína: <span className="font-medium">{meal.nutrients.protein}g</span></div>
                      <div>Carbohidratos: <span className="font-medium">{meal.nutrients.carbs}g</span></div>
                      <div>Grasas: <span className="font-medium">{meal.nutrients.fats}g</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Ingredientes</h4>
                    {meal.ingredients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No hay ingredientes especificados</p>
                    )}
                  </div>
                </div>
                
                {meal.workoutRelated && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Esta comida está optimizada para tu entrenamiento
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Cargando detalles de las comidas...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderShoppingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Lista de Compras
          </CardTitle>
          <CardDescription>
            Ingredientes necesarios para las comidas del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyNutrition ? (
            <div className="space-y-4">
              {dailyNutrition.meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyNutrition.meals.map((meal, index) => (
                    <Card key={meal.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          {meal.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {meal.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{ingredient}</span>
                              <input 
                                type="checkbox" 
                                className="rounded text-green-600 focus:ring-green-500"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay ingredientes para comprar</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Cargando lista de compras...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Análisis Nutricional
          </CardTitle>
          <CardDescription>
            Distribución de macros y seguimiento de objetivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyNutrition ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Distribución de Macronutrientes</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Proteína</span>
                      <span>{dailyNutrition.totalNutrients.protein}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(dailyNutrition.totalNutrients.protein * 4 / dailyNutrition.totalNutrients.calories) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbohidratos</span>
                      <span>{dailyNutrition.totalNutrients.carbs}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(dailyNutrition.totalNutrients.carbs * 4 / dailyNutrition.totalNutrients.calories) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Grasas</span>
                      <span>{dailyNutrition.totalNutrients.fats}g</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(dailyNutrition.totalNutrients.fats * 9 / dailyNutrition.totalNutrients.calories) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {dailyNutrition.calorieExpenditure && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-600" />
                    Balance Energético
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">Calorías consumidas</div>
                      <div className="text-lg font-bold text-gray-900">
                        {dailyNutrition.totalNutrients.calories} kcal
                      </div>
                    </div>
                    <div className="text-2xl">-</div>
                    <div>
                      <div className="text-sm text-gray-600">Calorías quemadas</div>
                      <div className="text-lg font-bold text-gray-900">
                        {dailyNutrition.calorieExpenditure} kcal
                      </div>
                    </div>
                    <div className="text-2xl">=</div>
                    <div>
                      <div className="text-sm text-gray-600">Balance</div>
                      <div className={`text-lg font-bold ${
                        dailyNutrition.totalNutrients.calories > dailyNutrition.calorieExpenditure 
                          ? 'text-red-600' 
                          : dailyNutrition.totalNutrients.calories < dailyNutrition.calorieExpenditure 
                            ? 'text-green-600' 
                            : 'text-gray-900'
                      }`}>
                        {dailyNutrition.totalNutrients.calories - dailyNutrition.calorieExpenditure} kcal
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Cargando análisis nutricional...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'plan', label: 'Plan Nutricional', icon: Target },
    { id: 'meals', label: 'Comidas', icon: Utensils },
    { id: 'shopping', label: 'Lista de Compras', icon: ShoppingCart },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Nutrición Inteligente
              </h1>
              <p className="text-sm text-gray-600">Plan nutricional personalizado sin fricción</p>
            </div>
          </div>
          {dailyNutrition && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <Droplets className="h-4 w-4" />
              <span className="text-sm font-medium">Plan Activo</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Date Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => handleDateChange(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Día Anterior
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">{formatDate(selectedDate)}</h2>
            {dailyNutrition?.nutritionGoal && (
              <p className="text-sm text-gray-600 capitalize">
                Objetivo: {dailyNutrition.nutritionGoal}
              </p>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handleDateChange(1)}
            className="flex items-center gap-2"
          >
            Día Siguiente
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'plan' && renderPlanTab()}
            {activeTab === 'meals' && renderMealsTab()}
            {activeTab === 'shopping' && renderShoppingTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </>
        )}
      </main>
    </div>
  );
};

export default NutritionDashboard;