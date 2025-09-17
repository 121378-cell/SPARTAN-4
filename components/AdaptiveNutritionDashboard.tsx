/**
 * Adaptive Nutrition Dashboard
 * Real-time meal planning with dynamic adjustments
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Progress, Badge, Input, Label } from './ui';
import { 
  ArrowLeft, Utensils, ShoppingCart, TrendingUp, Clock, 
  Activity, Target, Zap, Droplets, Apple, Calendar,
  Settings, BarChart3, ChefHat, MapPin
} from 'lucide-react';
import { 
  adaptiveNutritionAI,
  type AdaptiveNutritionProfile,
  type AdaptiveMealPlan,
  type NutritionGoal,
  type ActivityData,
  type SmartRecipe
} from '../lib/adaptiveNutritionAI';
import type { UserData } from '../lib/types';

interface AdaptiveNutritionDashboardProps {
  userData: UserData;
  onBack: () => void;
}

const AdaptiveNutritionDashboard = memo(function AdaptiveNutritionDashboard({
  userData,
  onBack
}: AdaptiveNutritionDashboardProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'meals' | 'shopping' | 'analytics'>('plan');
  const [nutritionProfile, setNutritionProfile] = useState<AdaptiveNutritionProfile | null>(null);
  const [currentPlan, setCurrentPlan] = useState<AdaptiveMealPlan | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chronotype, setChronotype] = useState<'morning' | 'intermediate' | 'evening'>('intermediate');
  const [sleepSchedule, setSleepSchedule] = useState({ bedtime: '22:30', wakeup: '06:30' });
  const [useCircadianOptimization, setUseCircadianOptimization] = useState(false);
  const [activityInput, setActivityInput] = useState({
    type: '',
    duration: 0,
    intensity: 'moderate' as 'low' | 'moderate' | 'high' | 'very_high',
    caloriesBurned: 0
  });
  const [unavailableIngredients, setUnavailableIngredients] = useState<string[]>([]);

  useEffect(() => {
    initializeProfile();
  }, [userData]);

  useEffect(() => {
    if (currentPlan) {
      const recs = adaptiveNutritionAI.getRecommendations();
      setRecommendations(recs);
    }
  }, [currentPlan]);

  const initializeProfile = useCallback(() => {
    const goals: NutritionGoal[] = userData.goals.map(goal => ({
      type: goal.includes('Muscle') ? 'muscle_gain' : 
            goal.includes('Weight') ? 'weight_loss' : 'maintenance',
      priority: 1,
      targetMacros: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fats: 65,
        fiber: 25
      }
    }));

    const profile = adaptiveNutritionAI.createProfile(userData, goals);
    setNutritionProfile(profile);
  }, [userData]);

  const generateMealPlan = useCallback(async () => {
    setIsGenerating(true);
    try {
      let plan;
      if (useCircadianOptimization) {
        // Update profile with circadian data before generating
        if (nutritionProfile) {
          nutritionProfile.mealTiming.chronotype = chronotype;
          nutritionProfile.mealTiming.sleepSchedule = {
            bedtime: sleepSchedule.bedtime,
            wakeup: sleepSchedule.wakeup,
            duration: 8
          };
        }
        plan = await adaptiveNutritionAI.generateCircadianOptimizedPlan();
      } else {
        plan = await adaptiveNutritionAI.generatePlan();
      }
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [useCircadianOptimization, chronotype, sleepSchedule, nutritionProfile]);

  const handleActivityAdaptation = useCallback(() => {
    if (!activityInput.type || activityInput.duration === 0) return;

    const activity: ActivityData = {
      type: activityInput.type,
      duration: activityInput.duration,
      intensity: activityInput.intensity,
      caloriesBurned: activityInput.caloriesBurned,
      timestamp: new Date()
    };

    const adaptedPlan = adaptiveNutritionAI.adaptToActivity(activity);
    setCurrentPlan(adaptedPlan);
    
    // Reset form
    setActivityInput({
      type: '',
      duration: 0,
      intensity: 'moderate',
      caloriesBurned: 0
    });
  }, [activityInput]);

  const handleAvailabilityAdaptation = useCallback(() => {
    if (unavailableIngredients.length === 0) return;

    const adaptedPlan = adaptiveNutritionAI.adaptToAvailability(unavailableIngredients);
    setCurrentPlan(adaptedPlan);
    setUnavailableIngredients([]);
  }, [unavailableIngredients]);

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMacroColor = (macro: string): string => {
    const colors = {
      protein: 'text-blue-600',
      carbs: 'text-green-600',
      fats: 'text-yellow-600',
      calories: 'text-purple-600'
    };
    return colors[macro as keyof typeof colors] || 'text-gray-600';
  };

  const renderPlanTab = () => (
    <div className="space-y-6">
      {/* Recipe Features Highlight */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-green-700">Recetas Rápidas</h4>
              <p className="text-sm text-green-600">5-15 min preparación</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-semibold text-blue-700">Económicas</h4>
              <p className="text-sm text-blue-600">Ingredientes accesibles</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-semibold text-purple-700">Locales</h4>
              <p className="text-sm text-purple-600">Productos de la región</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🌱</div>
              <h4 className="font-semibold text-orange-700">Saludables</h4>
              <p className="text-sm text-orange-600">Balanceadas nutricional</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Chronotype Configuration */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Optimización Circadiana
          </CardTitle>
          <CardDescription>Configura tu cronotipo para sincronizar comidas con tu ritmo biológico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Tu Cronotipo</Label>
              <select
                value={chronotype}
                onChange={(e) => setChronotype(e.target.value as any)}
                className="w-full p-2 border rounded-lg mt-1"
              >
                <option value="morning">🌅 Matutino - Máximo rendimiento mañana</option>
                <option value="intermediate">☀️ Intermedio - Flexible durante el día</option>
                <option value="evening">🌙 Vespertino - Máximo rendimiento noche</option>
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium">Hora de Dormir</Label>
              <Input
                type="time"
                value={sleepSchedule.bedtime}
                onChange={(e) => setSleepSchedule(prev => ({ ...prev, bedtime: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Hora de Despertar</Label>
              <Input
                type="time"
                value={sleepSchedule.wakeup}
                onChange={(e) => setSleepSchedule(prev => ({ ...prev, wakeup: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <input
              type="checkbox"
              id="circadianOptimization"
              checked={useCircadianOptimization}
              onChange={(e) => setUseCircadianOptimization(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="circadianOptimization" className="text-sm">
              🧬 <strong>Activar Optimización Circadiana Avanzada</strong>
              <p className="text-xs text-gray-600 mt-1">
                Sincroniza nutrientes con ritmos hormonales (cortisol, insulina, melatonina)
              </p>
            </label>
          </div>
          
          {useCircadianOptimization && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">🔬 Optimizaciones Activas:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-indigo-700">
                <p>• Sincronización con pico de cortisol matutino</p>
                <p>• Optimización de sensibilidad a insulina</p>
                <p>• Ventana metabólica personalizada</p>
                <p>• Distribución de macros por horario</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {nutritionProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Perfil Nutricional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {nutritionProfile.baseCalories}
                </div>
                <div className="text-sm text-gray-600">Calorías Base</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {nutritionProfile.goals.length}
                </div>
                <div className="text-sm text-gray-600">Objetivos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {nutritionProfile.mealTiming.mealsPerDay}
                </div>
                <div className="text-sm text-gray-600">Comidas/Día</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {nutritionProfile.preferences.prepTime}min
                </div>
                <div className="text-sm text-gray-600">Tiempo Prep</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Overview */}
      {currentPlan ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Plan del Día - {currentPlan.date.toLocaleDateString()}
              </div>
              <Badge variant="outline">
                {currentPlan.adaptations.length} adaptaciones
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {currentPlan.totalMacros.calories}
                </div>
                <div className="text-sm text-gray-600">Calorías</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {currentPlan.totalMacros.protein}g
                </div>
                <div className="text-sm text-gray-600">Proteína</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {currentPlan.totalMacros.carbs}g
                </div>
                <div className="text-sm text-gray-600">Carbohidratos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">
                  {currentPlan.totalMacros.fats}g
                </div>
                <div className="text-sm text-gray-600">Grasas</div>
              </div>
            </div>

            {/* Macro Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Proteína</span>
                  <span>{currentPlan.totalMacros.protein}g</span>
                </div>
                <Progress value={(currentPlan.totalMacros.protein / 200) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbohidratos</span>
                  <span>{currentPlan.totalMacros.carbs}g</span>
                </div>
                <Progress value={(currentPlan.totalMacros.carbs / 300) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Grasas</span>
                  <span>{currentPlan.totalMacros.fats}g</span>
                </div>
                <Progress value={(currentPlan.totalMacros.fats / 80) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Plan Nutricional Adaptativo</h3>
            <p className="text-gray-600 mb-6">
              Genera tu plan personalizado que se adapta automáticamente a tu actividad física
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">🎆 Características del Sistema:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                <p>• Recetas de 5-15 minutos</p>
                <p>• Ingredientes económicos</p>
                <p>• Alternativas locales</p>
                <p>• Adaptación en tiempo real</p>
              </div>
            </div>
            <Button
              onClick={generateMealPlan}
              disabled={isGenerating}
              size="lg"
              className={`${useCircadianOptimization 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
              }`}
            >
              {isGenerating ? 'Generando...' : useCircadianOptimization 
                ? '🧬 Generar Plan Circadiano Avanzado' 
                : 'Generar Plan Adaptativo'
              }
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Adaptations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Adaptation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              Adaptación por Actividad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Actividad</Label>
                <Input
                  placeholder="ej: Cardio, Pesas"
                  value={activityInput.type}
                  onChange={(e) => setActivityInput(prev => ({ ...prev, type: e.target.value }))}
                />
              </div>
              <div>
                <Label>Duración (min)</Label>
                <Input
                  type="number"
                  value={activityInput.duration}
                  onChange={(e) => setActivityInput(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Intensidad</Label>
                <select
                  value={activityInput.intensity}
                  onChange={(e) => setActivityInput(prev => ({ ...prev, intensity: e.target.value as any }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Baja</option>
                  <option value="moderate">Moderada</option>
                  <option value="high">Alta</option>
                  <option value="very_high">Muy Alta</option>
                </select>
              </div>
              <div>
                <Label>Calorías Quemadas</Label>
                <Input
                  type="number"
                  value={activityInput.caloriesBurned}
                  onChange={(e) => setActivityInput(prev => ({ ...prev, caloriesBurned: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <Button
              onClick={handleActivityAdaptation}
              disabled={!activityInput.type}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Adaptar Plan
            </Button>
          </CardContent>
        </Card>

        {/* Availability Adaptation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Disponibilidad de Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Ingredientes No Disponibles</Label>
              <Input
                placeholder="ej: pollo, arroz integral"
                value={unavailableIngredients.join(', ')}
                onChange={(e) => setUnavailableIngredients(
                  e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                )}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separar con comas. El sistema buscará sustitutos automáticamente.
              </p>
            </div>
            <Button
              onClick={handleAvailabilityAdaptation}
              disabled={unavailableIngredients.length === 0}
              className="w-full"
              variant="outline"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buscar Sustitutos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Recomendaciones en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-lg">{rec.split(' ')[0]}</span>
                  <span className="text-sm text-gray-700">{rec.substring(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderMealsTab = () => (
    <div className="space-y-6">
      {currentPlan ? (
        <>
          <div className="grid gap-6">
            {currentPlan.meals.map((meal, index) => (
              <Card key={meal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-green-600" />
                      {meal.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatTime(meal.time)}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Información Nutricional</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Calorías: <span className="font-medium">{meal.macros.calories}</span></div>
                        <div>Proteína: <span className="font-medium">{meal.macros.protein}g</span></div>
                        <div>Carbohidratos: <span className="font-medium">{meal.macros.carbs}g</span></div>
                        <div>Grasas: <span className="font-medium">{meal.macros.fats}g</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        Recetas 
                        <Badge variant="outline" className="text-xs">
                          ⚡ Rápida
                        </Badge>
                        {useCircadianOptimization && (
                          <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                            🧬 Circadiana
                          </Badge>
                        )}
                      </h4>
                      {meal.recipes.map((recipe, recipeIndex) => (
                        <div key={recipe.id} className="mb-4 p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-green-800">{recipe.name}</h5>
                            <div className="flex gap-2">
                              {recipe.prepTime <= 5 && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  🚀 Express
                                </Badge>
                              )}
                              {(recipe.prepTime + recipe.cookTime) <= 15 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  ⏱️ Quick
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-green-700 mb-2">{recipe.description}</p>
                          <div className="flex gap-4 text-xs text-green-600">
                            <span className="flex items-center gap-1">
                              🕪 Prep: {recipe.prepTime}min
                            </span>
                            <span className="flex items-center gap-1">
                              🔥 Cocción: {recipe.cookTime}min
                            </span>
                            <span className="flex items-center gap-1">
                              🍽️ Porciones: {recipe.servings}
                            </span>
                            <span className="flex items-center gap-1">
                              💰 Económico
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {meal.recipes[0] && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Ingredientes</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {meal.recipes[0].ingredients.map((ingredient, ingIndex) => {
                          const budgetIcon = ingredient.cost < 3 ? '💰' : ingredient.cost < 6 ? '💵' : '💸';
                          const localIcon = ingredient.substitutes.length > 2 ? '🌍' : '🏪';
                          return (
                            <div key={ingIndex} className="text-sm p-2 bg-gray-50 rounded flex items-center justify-between">
                              <span>{ingredient.amount}{ingredient.unit} {ingredient.name}</span>
                              <div className="flex gap-1">
                                <span title="Nivel de precio">{budgetIcon}</span>
                                <span title="Disponibilidad local">{localIcon}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Genera un plan nutricional para ver tus comidas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderShoppingTab = () => (
    <div className="space-y-6">
      {currentPlan?.shoppingList ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Lista de Compras Optimizada
                </div>
                <Badge variant="outline">
                  ${currentPlan.shoppingList.totalCost.toFixed(2)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPlan.shoppingList.categories.map((category, index) => (
                  <div key={category.name}>
                    <h4 className="font-semibold mb-3 capitalize">{category.name}</h4>
                    <div className="space-y-2">
                      {category.items.map((itemName, itemIndex) => {
                        const item = currentPlan.shoppingList.items.find(i => i.name === itemName);
                        const budgetLevel = item?.cost && item.cost < 3 ? 'Económico' : item?.cost && item.cost < 6 ? 'Moderado' : 'Premium';
                        const budgetColor = item?.cost && item.cost < 3 ? 'text-green-600' : item?.cost && item.cost < 6 ? 'text-yellow-600' : 'text-orange-600';
                        return (
                          <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="text-sm font-medium">{item?.quantity}{item?.unit} {itemName}</span>
                              <div className="flex gap-2 mt-1">
                                <span className={`text-xs ${budgetColor}`}>
                                  💰 {budgetLevel}
                                </span>
                                {item?.substitutes && item.substitutes.length > 0 && (
                                  <span className="text-xs text-blue-600" title={`Alternativas: ${item.substitutes.slice(0, 2).join(', ')}`}>
                                    🌍 {item.substitutes.length} alternativas
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-gray-700">${item?.cost?.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2">Ruta Optimizada</h4>
                <div className="flex gap-2">
                  {currentPlan.shoppingList.optimizedRoute.map((step, index) => (
                    <Badge key={index} variant="outline">
                      {index + 1}. {step}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Genera un plan nutricional para ver tu lista de compras</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {currentPlan ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Historial de Adaptaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlan.adaptations.length > 0 ? (
                <div className="space-y-3">
                  {currentPlan.adaptations.map((adaptation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{adaptation.trigger}</span>
                        <span className="text-xs text-gray-500">
                          {adaptation.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{adaptation.reason}</p>
                      <Badge variant="outline" className="mt-2">
                        {adaptation.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay adaptaciones registradas aún
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Macronutrientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((currentPlan.totalMacros.protein * 4 / currentPlan.totalMacros.calories) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Proteína</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((currentPlan.totalMacros.carbs * 4 / currentPlan.totalMacros.calories) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Carbohidratos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.round((currentPlan.totalMacros.fats * 9 / currentPlan.totalMacros.calories) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Grasas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Circadian Performance Metrics */}
          {useCircadianOptimization && 'performanceMetrics' in currentPlan && (
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🧬 Métricas de Optimización Circadiana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {(currentPlan as any).performanceMetrics?.energyAlignment || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Alineación Energética</div>
                    <p className="text-xs text-purple-600 mt-1">Sincronización con picos naturales</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">
                      {(currentPlan as any).performanceMetrics?.recoveryOptimization || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Optimización de Recuperación</div>
                    <p className="text-xs text-indigo-600 mt-1">Facilitación del descanso nocturno</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {(currentPlan as any).performanceMetrics?.metabolicEfficiency || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Eficiencia Metabólica</div>
                    <p className="text-xs text-blue-600 mt-1">Aprovechamiento de ventanas óptimas</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">🕰️ Sincronización Circadiana Activa:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">🌅</span>
                      <span>Cortisol: Desayuno optimizado para pico matutino</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🧬</span>
                      <span>Insulina: Carbohidratos en ventana sensible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">⚡</span>
                      <span>Metabolismo: Comidas en ventana activa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">🌙</span>
                      <span>Recuperación: Cena para descanso óptimo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Genera un plan para ver las analíticas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const tabs = [
    { id: 'plan', label: 'Plan Adaptativo', icon: Target },
    { id: 'meals', label: 'Comidas', icon: Utensils },
    { id: 'shopping', label: 'Lista de Compras', icon: ShoppingCart },
    { id: 'analytics', label: 'Analíticas', icon: BarChart3 }
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
                Nutrición Adaptativa IA
              </h1>
              <p className="text-sm text-gray-600">Plan nutricional que se adapta en tiempo real</p>
            </div>
          </div>
          {currentPlan && (
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <Droplets className="h-4 w-4" />
              <span className="text-sm font-medium">Plan Activo</span>
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
        {activeTab === 'plan' && renderPlanTab()}
        {activeTab === 'meals' && renderMealsTab()}
        {activeTab === 'shopping' && renderShoppingTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </main>
    </div>
  );
});

export default AdaptiveNutritionDashboard;