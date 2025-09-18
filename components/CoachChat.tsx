import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui';
import { Button } from './ui';
import { Badge } from './ui';
import { Textarea } from './ui';
import { MessageCircle, Send, Mic, Brain, Heart, Zap, Target } from 'lucide-react';
import { ConversationalCoach, UserPsychologyProfile, CoachingContext, CoachingMessage } from '../lib/conversationalCoach';
import ChatMaestro from './ChatMaestro';

interface CoachChatProps {
  userProfile: any;
  currentWorkout?: any;
  performanceData?: any;
  onPsychologyUpdate?: (profile: UserPsychologyProfile) => void;
  userId: string;
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export default function CoachChat({ 
  userProfile, 
  currentWorkout, 
  performanceData, 
  onPsychologyUpdate,
  userId,
  currentScreen,
  onNavigate
}: CoachChatProps) {
  const [messages, setMessages] = useState<CoachingMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [coach] = useState(new ConversationalCoach());
  const [userPsychology, setUserPsychology] = useState<UserPsychologyProfile | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatMaestro, setShowChatMaestro] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeCoach();
  }, [userProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentWorkout && performanceData) {
      handleWorkoutContext();
    }
  }, [currentWorkout, performanceData]);

  const initializeCoach = async () => {
    try {
      // Analyze user psychology from available data
      const behaviorData = userProfile.workoutHistory || [];
      const userFeedback = userProfile.feedback || [];
      
      const psychology = coach.analyzeUserPsychology(
        behaviorData,
        performanceData || {},
        userFeedback
      );
      
      setUserPsychology(psychology);
      onPsychologyUpdate?.(psychology);

      // Generate welcome message
      const welcomeContext: CoachingContext = {
        sessionType: 'goal-setting',
        timeOfDay: getCurrentTimeOfDay(),
        recentBehavior: {
          consistency: psychology.personalityTraits.resilience,
          adherence: 7,
          effort: 7
        }
      };

      const welcomeMessage = coach.generateCoachingMessage(psychology, welcomeContext);
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing coach:', error);
    }
  };

  const handleWorkoutContext = () => {
    if (!userPsychology) return;

    const context: CoachingContext = {
      sessionType: determineSessionType(),
      timeOfDay: getCurrentTimeOfDay(),
      workoutIntensity: performanceData?.intensity || 'moderate',
      performanceMetrics: {
        completionRate: performanceData?.completionRate || 80,
        intensityLevel: performanceData?.intensityLevel || 7,
        progressTrend: performanceData?.trend || 'improving'
      },
      recentBehavior: {
        consistency: userPsychology.personalityTraits.resilience,
        adherence: performanceData?.adherence || 8,
        effort: performanceData?.effort || 7
      }
    };

    const contextMessage = coach.generateCoachingMessage(userPsychology, context);
    addMessage(contextMessage);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !userPsychology) return;

    // Add user message
    const userMessage: CoachingMessage = {
      messageId: `user_${Date.now()}`,
      type: 'feedback',
      content: inputMessage,
      tone: 'neutral' as any,
      personalizedElements: [],
      estimatedImpact: 'moderate'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate coach thinking time
    setTimeout(() => {
      generateCoachResponse(inputMessage);
      setIsTyping(false);
    }, 1500);
  };

  const generateCoachResponse = (userInput: string) => {
    if (!userPsychology) return;

    const context = analyzeUserInput(userInput);
    const response = coach.generateCoachingMessage(userPsychology, context);
    addMessage(response);
  };

  const analyzeUserInput = (input: string): CoachingContext => {
    const lowerInput = input.toLowerCase();
    
    let sessionType: CoachingContext['sessionType'] = 'goal-setting';
    
    if (lowerInput.includes('cansado') || lowerInput.includes('difícil') || lowerInput.includes('no puedo')) {
      sessionType = 'setback';
    } else if (lowerInput.includes('entrenamiento') || lowerInput.includes('ejercicio')) {
      sessionType = currentWorkout ? 'during-workout' : 'pre-workout';
    } else if (lowerInput.includes('terminé') || lowerInput.includes('completé')) {
      sessionType = 'post-workout';
    }

    return {
      sessionType,
      timeOfDay: getCurrentTimeOfDay(),
      recentBehavior: {
        consistency: userPsychology?.personalityTraits.resilience || 7,
        adherence: 7,
        effort: 7
      }
    };
  };

  const addMessage = (message: CoachingMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const determineSessionType = (): CoachingContext['sessionType'] => {
    if (!currentWorkout) return 'rest-day';
    if (currentWorkout.status === 'in-progress') return 'during-workout';
    if (currentWorkout.status === 'completed') return 'post-workout';
    return 'pre-workout';
  };

  const getCurrentTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageIcon = (type: CoachingMessage['type']) => {
    switch (type) {
      case 'motivation':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'challenge':
        return <Target className="h-4 w-4 text-red-500" />;
      case 'encouragement':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'reflection':
        return <Brain className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getToneColor = (tone: CoachingMessage['tone']) => {
    switch (tone) {
      case 'challenging':
        return 'border-l-red-500 bg-red-50';
      case 'supportive':
        return 'border-l-green-500 bg-green-50';
      case 'enthusiastic':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'understanding':
        return 'border-l-blue-500 bg-blue-50';
      case 'firm':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
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

  const handleQuickResponse = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Toggle between Coach and Chat Maestro */}
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowChatMaestro(!showChatMaestro)}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          {showChatMaestro ? 'Volver al Coach' : 'Chat Maestro'}
        </Button>
      </div>

      {showChatMaestro ? (
        <ChatMaestro 
          userId={userId}
          currentScreen={currentScreen}
          activeWorkout={currentWorkout}
          userData={userProfile}
          onClose={() => setShowChatMaestro(false)}
          onNavigate={onNavigate}
        />
      ) : (
        <>
          {/* Psychology Profile Header */}
          {userPsychology && (
            <Card className="mb-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Perfil Psicológico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      {userPsychology.motivationType}
                    </Badge>
                    <p className="text-xs text-gray-600">Motivación</p>
                  </div>
                  <div className="text-center">
                    <Badge variant={userPsychology.disciplineLevel === 'high' ? 'default' : 'secondary'}>
                      {userPsychology.disciplineLevel}
                    </Badge>
                    <p className="text-xs text-gray-600">Disciplina</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">
                      {userPsychology.emotionalState}
                    </Badge>
                    <p className="text-xs text-gray-600">Estado Emocional</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline">
                      {userPsychology.communicationPreference}
                    </Badge>
                    <p className="text-xs text-gray-600">Comunicación</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Coach IA Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                {messages.map((message, index) => (
                  <div
                    key={message.messageId}
                    className={`flex ${message.messageId.startsWith('user_') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.messageId.startsWith('user_')
                          ? 'bg-blue-600 text-white'
                          : `border-l-4 ${getToneColor(message.tone)}`
                      }`}
                    >
                      {!message.messageId.startsWith('user_') && (
                        <div className="flex items-center gap-2 mb-2">
                          {getMessageIcon(message.type)}
                          <Badge variant="outline" className="text-xs">
                            {message.type}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.actionItems && message.actionItems.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold mb-2">Acciones recomendadas:</p>
                          <ul className="list-disc list-inside text-xs space-y-1">
                            {message.actionItems.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold">Preguntas de reflexión:</p>
                          {message.followUpQuestions.map((question, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-auto p-2 justify-start"
                              onClick={() => handleQuickResponse(question)}
                            >
                              "{question}"
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Coach está pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Cuéntame cómo te sientes o pregúntame lo que necesites..."
                    className="flex-1 min-h-[60px] resize-none"
                    onKeyPress={(e) => {
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
        </>
      )}
    </div>
  );
}