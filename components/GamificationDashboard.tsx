import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Award, Target, Users, Zap, Star, Crown, 
  TrendingUp, Gift, Calendar, Atom, Dna, Brain 
} from 'lucide-react';
import { 
  GamificationEngine, 
  UserProgress, 
  Achievement, 
  Challenge,
  LeaderboardEntry,
  SeasonalEvent 
} from '@/lib/gamificationEngine';

interface GamificationDashboardProps {
  userId: string;
  userProfile: any;
  workoutData: any;
  onRewardClaim?: (reward: any) => void;
}

export default function GamificationDashboard({ 
  userId, 
  userProfile, 
  workoutData, 
  onRewardClaim 
}: GamificationDashboardProps) {
  const [gamificationEngine] = useState(new GamificationEngine());
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [seasonalEvent, setSeasonalEvent] = useState<SeasonalEvent | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    initializeGamification();
  }, [userId]);

  useEffect(() => {
    if (workoutData) {
      processWorkoutCompletion();
    }
  }, [workoutData]);

  const initializeGamification = async () => {
    try {
      // Initialize user level and progress
      const level = gamificationEngine.calculateLevelProgression(
        userProfile.totalXP || 0,
        userProfile.quantumCoherence || 0
      );

      // Create user progress object
      const progress: UserProgress = {
        userId,
        level,
        achievements: {},
        activeChallenges: {},
        inventory: {},
        statistics: {
          totalWorkouts: userProfile.totalWorkouts || 0,
          totalXP: userProfile.totalXP || 0,
          achievementsUnlocked: 0,
          challengesCompleted: 0,
          streaks: [],
          biomolecularEnhancements: {
            totalBoosts: 0,
            activeEnhancements: [],
            quantumCoherence: userProfile.quantumCoherence || 0
          }
        },
        motivationProfile: {
          preferredChallengeTypes: ['fitness', 'consistency'],
          achievementHunter: userProfile.achievementHunter || false,
          competitiveLevel: userProfile.competitiveLevel || 5,
          explorationPreference: userProfile.explorationPreference || 5
        }
      };

      setUserProgress(progress);

      // Load active challenges
      const challenges = gamificationEngine.generateDynamicChallenges(userId);
      setActiveChallenges(challenges);

      // Load leaderboard
      const leaderboardData = gamificationEngine.generateLeaderboards('weekly', 'xp');
      setLeaderboard(leaderboardData.slice(0, 10));

      // Load seasonal event
      const event = gamificationEngine.createSeasonalEvent('Biomolecular Enhancement');
      setSeasonalEvent(event);
    } catch (error) {
      console.error('Error initializing gamification:', error);
    }
  };

  const processWorkoutCompletion = () => {
    if (!userProgress) return;

    // Check for achievement progress
    const { unlockedAchievements, biomolecularBoosts } = gamificationEngine.checkAchievementProgress(
      userId,
      'workouts_completed',
      userProgress.statistics.totalWorkouts + 1
    );

    if (unlockedAchievements.length > 0) {
      setRecentAchievements(unlockedAchievements);
      
      // Show achievement notification
      unlockedAchievements.forEach(achievement => {
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
      });
    }

    // Update user progress
    setUserProgress(prev => prev ? {
      ...prev,
      statistics: {
        ...prev.statistics,
        totalWorkouts: prev.statistics.totalWorkouts + 1,
        totalXP: prev.statistics.totalXP + 50 // Base workout XP
      }
    } : null);
  };

  const joinChallenge = (challengeId: string) => {
    const challenge = activeChallenges.find(c => c.id === challengeId);
    if (!challenge || !userProgress) return;

    // Add challenge to user's active challenges
    setUserProgress(prev => prev ? {
      ...prev,
      activeChallenges: {
        ...prev.activeChallenges,
        [challengeId]: {
          joinedDate: new Date(),
          progress: challenge.objectives.map(obj => ({ ...obj })),
          isCompleted: false,
          rewards: []
        }
      }
    } : null);

    console.log(`Joined challenge: ${challenge.name}`);
  };

  const claimReward = (rewardId: string) => {
    onRewardClaim?.({ rewardId, userId });
    console.log(`Reward claimed: ${rewardId}`);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'quantum':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return <Award className="h-4 w-4 text-orange-600" />;
      case 'silver':
        return <Award className="h-4 w-4 text-gray-400" />;
      case 'gold':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'platinum':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'quantum':
        return <Atom className="h-4 w-4 text-blue-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return <Zap className="h-4 w-4 text-red-500" />;
      case 'endurance':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'consistency':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'quantum':
        return <Atom className="h-4 w-4 text-purple-500" />;
      case 'biomolecular':
        return <Dna className="h-4 w-4 text-pink-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!userProgress) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Atom className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Inicializando sistema de gamificación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🏆 SPARTAN Achievement System
        </h1>
        <p className="text-gray-600">Evoluciona tu potencial humano a través de la gamificación científica</p>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-purple-800">{userProgress.level.levelName}</h2>
              <p className="text-purple-600">Rango Biomolecular: {userProgress.level.biomolecularRank}</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg px-4 py-2">
              Nivel {userProgress.level.currentLevel}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso al siguiente nivel</span>
              <span>{userProgress.level.currentXP} / {userProgress.level.currentXP + userProgress.level.xpToNextLevel} XP</span>
            </div>
            <Progress 
              value={(userProgress.level.currentXP / (userProgress.level.currentXP + userProgress.level.xpToNextLevel)) * 100} 
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.statistics.totalXP}</div>
              <p className="text-sm text-gray-600">XP Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProgress.statistics.achievementsUnlocked}</div>
              <p className="text-sm text-gray-600">Logros</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {userProgress.statistics.biomolecularEnhancements.quantumCoherence}%
              </div>
              <p className="text-sm text-gray-600">Coherencia Cuántica</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Trophy className="h-5 w-5" />
              ¡Logros Desbloqueados!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-2">
                    {getDifficultyIcon(achievement.difficulty)}
                    {getCategoryIcon(achievement.category)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">+{achievement.xpReward} XP</div>
                    <Badge className={getRarityColor(achievement.difficulty)}>
                      {achievement.difficulty}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="challenges">Retos</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Estadísticas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Entrenamientos Totales</span>
                  <span className="font-bold">{userProgress.statistics.totalWorkouts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retos Completados</span>
                  <span className="font-bold">{userProgress.statistics.challengesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mejoras Biomoleculares</span>
                  <span className="font-bold">{userProgress.statistics.biomolecularEnhancements.totalBoosts}</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Enhancements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5 text-pink-500" />
                  Mejoras Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProgress.statistics.biomolecularEnhancements.activeEnhancements.length > 0 ? (
                  <div className="space-y-2">
                    {userProgress.statistics.biomolecularEnhancements.activeEnhancements.map((enhancement, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {enhancement}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay mejoras activas</p>
                )}
              </CardContent>
            </Card>

            {/* Next Achievement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Próximo Objetivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold">Racha de 7 Días</div>
                  <p className="text-sm text-gray-600 mb-2">Completa entrenamientos por 7 días consecutivos</p>
                  <Progress value={60} className="h-2 mb-2" />
                  <p className="text-xs text-gray-500">4/7 días completados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {activeChallenges.map(challenge => (
              <Card key={challenge.id} className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      {challenge.name}
                    </CardTitle>
                    <Badge className={getRarityColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{challenge.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Objectives */}
                    <div>
                      <h4 className="font-semibold mb-2">Objetivos:</h4>
                      <div className="space-y-2">
                        {challenge.objectives.map(objective => (
                          <div key={objective.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{objective.description}</span>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {objective.current}/{objective.target} {objective.unit}
                              </div>
                              <Progress 
                                value={(objective.current / objective.target) * 100} 
                                className="h-1 w-20" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <h4 className="font-semibold mb-2">Recompensas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {challenge.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline">
                            <Gift className="h-3 w-3 mr-1" />
                            {reward.name}
                          </Badge>
                        ))}
                        <Badge className="bg-blue-100 text-blue-800">
                          +{challenge.xpReward} XP
                        </Badge>
                      </div>
                    </div>

                    {/* Join/Progress */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {challenge.currentParticipants} participantes
                        {challenge.maxParticipants && ` / ${challenge.maxParticipants}`}
                      </div>
                      <Button 
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={!!userProgress.activeChallenges[challenge.id]}
                        size="sm"
                      >
                        {userProgress.activeChallenges[challenge.id] ? 'En Progreso' : 'Unirse'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Achievement categories would be rendered here */}
            <Card>
              <CardHeader>
                <CardTitle>Categorías de Logros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {['strength', 'endurance', 'consistency', 'nutrition', 'quantum', 'biomolecular'].map(category => (
                    <div key={category} className="text-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      {getCategoryIcon(category)}
                      <div className="mt-2 text-sm font-medium capitalize">{category}</div>
                      <div className="text-xs text-gray-500">3/10 completados</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progreso Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Genesis Protocol</div>
                      <div className="text-sm text-gray-500">Completado hace 2 días</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Neural Pathway Formation</div>
                      <div className="text-sm text-gray-500">En progreso (4/7)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Ranking Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userId} 
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      entry.userId === userId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="w-8 text-center font-bold">
                      {index < 3 ? (
                        <Crown className={`h-5 w-5 mx-auto ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-orange-600'
                        }`} />
                      ) : (
                        `#${entry.rank}`
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{entry.username}</div>
                      <div className="text-sm text-gray-500">
                        Nivel {entry.level} • {entry.tier}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.weeklyXP} XP</div>
                      <div className="text-sm text-gray-500">{entry.achievements} logros</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          {seasonalEvent && (
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5 text-purple-500" />
                  {seasonalEvent.name}
                </CardTitle>
                <p className="text-gray-600">{seasonalEvent.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Investigación Biomolecular</div>
                      <div className="text-lg font-bold text-purple-600">
                        {seasonalEvent.biomolecularResearch.topic}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Participantes</div>
                      <div className="text-lg font-bold text-blue-600">
                        {seasonalEvent.biomolecularResearch.participants}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Recompensas Exclusivas</div>
                    <div className="flex flex-wrap gap-2">
                      {seasonalEvent.exclusiveRewards.map((reward, index) => (
                        <Badge key={index} className={getRarityColor(reward.rarity)}>
                          {reward.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                    <Brain className="h-4 w-4 mr-2" />
                    Participar en Investigación
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}