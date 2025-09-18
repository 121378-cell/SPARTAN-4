import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea } from './ui';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Brain, 
  Zap, 
  Heart, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Settings,
  X
} from 'lucide-react';
import { chatMaestroService, ChatResponse, ChatContext } from '../lib/chat-maestro-service';
import type { WorkoutPlan, UserData } from '../lib/types';

interface ChatMaestroProps {
  userId: string;
  currentScreen: string;
  activeWorkout?: WorkoutPlan;
  userData: UserData;
  onClose?: () => void;
  onNavigate: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'maestro';
  content: string;
  timestamp: Date;
  actionItems?: string[];
}

export default function ChatMaestro({ 
  userId, 
  currentScreen, 
  activeWorkout, 
  userData,
  onClose,
  onNavigate 
}: ChatMaestroProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [realTimeInsights, setRealTimeInsights] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [userId, currentScreen, activeWorkout]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Build context for Chat Maestro
      const chatContext = await chatMaestroService.buildContext(userId, currentScreen, activeWorkout);
      setContext(chatContext);
      
      // Generate welcome message
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        type: 'maestro',
        content: `¡Hola ${userData.name}! Soy tu Chat Maestro de SPARTAN. Estoy aquí para ayudarte a optimizar tu entrenamiento, nutrición y recuperación. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
        actionItems: [
          'Explicar mi rutina actual',
          'Recomendaciones de recuperación',
          'Ajustar mi progresión',
          'Consejos nutricionales'
        ]
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing Chat Maestro:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !context) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Process user input with Chat Maestro
      const response: ChatResponse = await chatMaestroService.processUserInput(inputMessage, context);
      
      // Add maestro response
      const maestroMessage: ChatMessage = {
        id: `maestro_${Date.now()}`,
        type: 'maestro',
        content: response.response,
        timestamp: new Date(),
        actionItems: response.actionItems
      };
      
      setMessages(prev => [...prev, maestroMessage]);
      
      // Update context if needed
      if (response.contextUpdates) {
        setContext(prev => prev ? { ...prev, ...response.contextUpdates } : null);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'maestro',
        content: 'Lo siento, tuve un problema procesando tu solicitud. ¿Podrías reformularla?',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePerformAnalysis = async () => {
    if (!context) return;
    
    setIsTyping(true);
    
    try {
      // Perform real-time analysis
      const insights = await chatMaestroService.performRealTimeAnalysis(context);
      setRealTimeInsights(insights);
      setShowAnalysis(true);
      
      // Add analysis message
      const analysisMessage: ChatMessage = {
        id: `analysis_${Date.now()}`,
        type: 'maestro',
        content: 'He realizado un análisis completo de tu progreso. Haz clic en "Ver Análisis" para ver los detalles.',
        timestamp: new Date(),
        actionItems: ['Ver Análisis']
      };
      
      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Error performing analysis:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'maestro',
        content: 'Lo siento, tuve un problema realizando el análisis. Inténtalo de nuevo más tarde.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleViewAnalysis = () => {
    if (realTimeInsights) {
      const analysisSummary = `
📊 **Análisis de Progreso**

**Patrones de Entrenamiento:**
- Frecuencia: ${realTimeInsights.trainingPatterns.frequency} sesiones
- Duración promedio: ${realTimeInsights.trainingPatterns.avgDuration} minutos
- Ejercicios favoritos: ${realTimeInsights.trainingPatterns.favoriteExercises.join(', ')}

**Tendencias de Recuperación:**
- Puntaje promedio: ${realTimeInsights.recoveryTrends.avgRecoveryScore}/100
- Nivel de fatiga más común: ${realTimeInsights.recoveryTrends.mostCommonFatigueLevel}

**Tendencias de Progresión:**
- Ajustes promedio por plan: ${realTimeInsights.progressionTrends.avgAdjustments}
- Tipo de ajuste más común: ${realTimeInsights.progressionTrends.mostCommonAdjustment}

**Proyecciones (3 meses):**
- Aumento de fuerza: ${realTimeInsights.predictiveInsights.projections[0].strength.projectedIncrease}%
- Aumento de masa muscular: ${realTimeInsights.predictiveInsights.projections[0].muscleMass.projectedIncrease}%
      `;
      
      const analysisMessage: ChatMessage = {
        id: `analysis_detail_${Date.now()}`,
        type: 'maestro',
        content: analysisSummary,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      setShowAnalysis(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const handleActionItemClick = (item: string) => {
    // Handle special action items
    if (item === 'Generar nueva rutina') {
      onNavigate('generator');
    } else if (item === 'Ver rutinas existentes') {
      onNavigate('workouts');
    } else if (item === 'Registrar métricas de recuperación') {
      onNavigate('recovery');
    } else if (item === 'Ver plan nutricional completo') {
      onNavigate('nutrition');
    } else if (item === 'Ver informe de progreso completo') {
      onNavigate('progressReport');
    } else if (item === 'Definir nueva meta') {
      onNavigate('profile');
    } else {
      // Treat as regular message
      setInputMessage(item);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Chat Maestro - SPARTAN 4
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePerformAnalysis}
                disabled={isTyping}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Análisis
              </Button>
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Panel */}
      {showAnalysis && realTimeInsights && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Análisis en Tiempo Real</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAnalysis(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Entrenamiento</p>
                <p>Consistencia: {realTimeInsights.trainingPatterns.consistency}%</p>
                <p>Ejercicios: {realTimeInsights.trainingPatterns.favoriteExercises.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Recuperación</p>
                <p>Puntaje: {realTimeInsights.recoveryTrends.avgRecoveryScore}/100</p>
                <p>Tendencia: {realTimeInsights.recoveryTrends.trend}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full"
              onClick={handleViewAnalysis}
            >
              Ver Análisis Detallado
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.type === 'maestro' ? (
                      <Brain className="h-4 w-4 text-purple-600" />
                    ) : (
                      <MessageCircle className="h-4 w-4 text-blue-200" />
                    )}
                    <span className="text-xs font-medium">
                      {message.type === 'user' ? 'Tú' : 'Chat Maestro'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  {message.actionItems && message.actionItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold mb-2">Acciones recomendadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.actionItems.map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-1 px-2"
                            onClick={() => handleActionItemClick(action)}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Chat Maestro está pensando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t p-4 bg-gray-50">
            <div className="flex flex-wrap gap-2 mb-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleQuickAction('¿Cómo debo entrenar hoy?')}
              >
                <Dumbbell className="h-3 w-3 mr-1" />
                Entrenamiento
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleQuickAction('¿Cómo está mi recuperación?')}
              >
                <Heart className="h-3 w-3 mr-1" />
                Recuperación
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleQuickAction('¿Debo aumentar la carga?')}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Progresión
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleQuickAction('¿Qué debo comer hoy?')}
              >
                <Utensils className="h-3 w-3 mr-1" />
                Nutrición
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleQuickAction('Motívame')}
              >
                <Zap className="h-3 w-3 mr-1" />
                Motivación
              </Button>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputMessage(e.target.value)}
                placeholder="Pregunta a tu Chat Maestro..."
                className="flex-1 min-h-[60px] resize-none"
                onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleVoiceInput}
                  variant="outline"
                  size="sm"
                  className={`${isListening ? 'bg-red-100 border-red-300' : ''}`}
                  disabled={isListening}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'text-red-600' : ''}`} />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}