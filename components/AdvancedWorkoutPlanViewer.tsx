/**
 * Advanced Workout Plan Viewer - Visualizador de planes personalizados
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { ArrowLeft, Calendar, Target, Clock, TrendingUp, Users, Award } from 'lucide-react';
import type { PersonalizedWorkoutPlan } from '../lib/advancedWorkoutGenerator';

interface AdvancedWorkoutPlanViewerProps {
  plan: PersonalizedWorkoutPlan;
  onBack: () => void;
  onStartWorkout?: () => void;
}

const AdvancedWorkoutPlanViewer = memo(function AdvancedWorkoutPlanViewer({
  plan,
  onBack,
  onStartWorkout
}: AdvancedWorkoutPlanViewerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-sm text-gray-600">Plan personalizado generado con IA científica</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-600">Confianza Científica</div>
              <div className="text-lg font-bold text-green-600">{(plan.confidenceLevel * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Resumen del Plan */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{plan.duration}</div>
              <div className="text-sm text-gray-600">Semanas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{plan.weeklySchedule.daysPerWeek}</div>
              <div className="text-sm text-gray-600">Días/Semana</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{plan.primaryGoals.length}</div>
              <div className="text-sm text-gray-600">Objetivos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{plan.phases.length}</div>
              <div className="text-sm text-gray-600">Fases</div>
            </CardContent>
          </Card>
        </div>

        {/* Descripción */}
        <Card>
          <CardHeader>
            <CardTitle>Descripción del Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{plan.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {plan.methodology}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {plan.periodization.type}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Objetivos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objetivos de Entrenamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-3">Objetivos Primarios</h4>
                {plan.primaryGoals.map((goal, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{goal.type.replace('-', ' ')}</span>
                      <span className="text-sm bg-green-600 text-white px-2 py-1 rounded">
                        Prioridad {goal.priority}/5
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Timeline: {goal.timeline} semanas
                    </div>
                  </div>
                ))}
              </div>
              
              {plan.secondaryGoals.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-3">Objetivos Secundarios</h4>
                  {plan.secondaryGoals.map((goal, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{goal.type.replace('-', ' ')}</span>
                        <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
                          Prioridad {goal.priority}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cronograma Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plan.weeklySchedule.sessions.map((session, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="font-semibold text-blue-700">{session.day}</div>
                    <div className="text-sm text-gray-600 mb-2">{session.type}</div>
                    <div className="text-xs text-gray-500 mb-3">
                      {session.duration} min • {session.intensity}
                    </div>
                    <div className="space-y-1">
                      {session.exercises.slice(0, 3).map((exercise, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                          {exercise.name}
                        </div>
                      ))}
                      {session.exercises.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{session.exercises.length - 3} ejercicios más
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {plan.weeklySchedule.restDays.map((restDay, index) => (
                <Card key={`rest-${index}`} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="font-semibold text-green-700">{restDay.day}</div>
                    <div className="text-sm text-gray-600 mb-2">Descanso</div>
                    <div className="text-xs text-gray-500 mb-3">{restDay.type}</div>
                    <div className="space-y-1">
                      {restDay.activities.map((activity, idx) => (
                        <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resultados Esperados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Resultados Esperados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plan.expectedOutcomes.map((outcome, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="font-semibold text-gray-800">{outcome.metric}</div>
                  <div className="text-2xl font-bold text-blue-600">{outcome.improvement}</div>
                  <div className="text-sm text-gray-600">en {outcome.timeframe}</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Confianza: {(outcome.confidence * 100).toFixed(0)}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full" 
                        style={{ width: `${outcome.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evidencia Científica */}
        {plan.scientificBasis.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Evidencia Científica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.scientificBasis.map((evidence, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-l-green-500">
                    <div className="text-sm text-gray-700">{evidence}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adaptaciones y Consideraciones */}
        {(plan.adaptations.length > 0 || plan.contraindications.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.adaptations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Adaptaciones Personalizadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.adaptations.map((adaptation, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {adaptation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {plan.contraindications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-700">Consideraciones Importantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.contraindications.map((contraindication, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-600 mt-1">⚠</span>
                        {contraindication}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Acción */}
        {onStartWorkout && (
          <div className="text-center">
            <button
              onClick={onStartWorkout}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Comenzar Mi Entrenamiento
            </button>
          </div>
        )}
      </main>
    </div>
  );
});

export default AdvancedWorkoutPlanViewer;