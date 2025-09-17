import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Users, Heart, MessageCircle, Award, Trophy, Target, 
  TrendingUp, Plus, Verified, Crown, HandHeart
} from 'lucide-react';
import { 
  CommunityEngine, 
  CommunityPost, 
  UserReputation, 
  CommunityChallenge
} from '@/lib/communityEngine';

interface CommunityPlatformProps {
  userId: string;
  userProfile: any;
}

export default function CommunityPlatform({ userId, userProfile }: CommunityPlatformProps) {
  const [communityEngine] = useState(new CommunityEngine());
  const [userReputation, setUserReputation] = useState<UserReputation | null>(null);
  const [communityFeed, setCommunityFeed] = useState<CommunityPost[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<CommunityChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [postType, setPostType] = useState<CommunityPost['type']>('progress');

  useEffect(() => {
    initializeCommunity();
  }, [userId]);

  const initializeCommunity = async () => {
    const reputation = communityEngine.calculateUserReputation(userId);
    setUserReputation(reputation);

    const feed = communityEngine.getPersonalizedFeed(userId);
    setCommunityFeed(feed);

    const leaders = communityEngine.getCommunityLeaderboards('overall', 'month');
    setLeaderboard(leaders.slice(0, 10));

    // Mock challenge
    const mockChallenge: CommunityChallenge = {
      id: 'challenge_1',
      creatorId: 'admin_1',
      title: 'Desafío de Consistencia Biomolecular',
      description: 'Completa entrenamientos durante 21 días consecutivos',
      type: 'consistency',
      category: 'strength',
      difficulty: 'intermediate',
      startDate: new Date(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      participants: [],
      requirements: { minLevel: 5, minReputation: 100, requiredBadges: [] },
      rewards: {
        reputationBonus: 200,
        badges: ['consistency_master'],
        biomolecularEnhancements: ['mitochondrial_boost'],
        quantumAccess: ['advanced_metrics']
      },
      leaderboard: [],
      communityGoal: {
        target: 1000,
        current: 487,
        unit: 'entrenamientos completados',
        collectiveReward: { type: 'community_unlock', value: 'quantum_gym_access' }
      }
    };
    setActiveChallenges([mockChallenge]);
  };

  const createPost = async () => {
    if (!newPostContent.trim() || !newPostTitle.trim()) return;

    const post = await communityEngine.createPost(userId, {
      type: postType,
      title: newPostTitle,
      content: newPostContent,
      tags: extractTags(newPostContent)
    });

    setCommunityFeed(prev => [post, ...prev]);
    setNewPostContent('');
    setNewPostTitle('');
    
    const updatedRep = communityEngine.calculateUserReputation(userId);
    setUserReputation(updatedRep);
  };

  const joinChallenge = async (challengeId: string) => {
    const success = await communityEngine.joinChallenge(userId, challengeId);
    if (success) {
      setActiveChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, participants: [...challenge.participants, userId] }
            : challenge
        )
      );
    }
  };

  const getReputationColor = (level: string) => {
    const colors = {
      'Novice': 'bg-gray-100 text-gray-800',
      'Supporter': 'bg-green-100 text-green-800',
      'Motivator': 'bg-blue-100 text-blue-800',
      'Mentor': 'bg-purple-100 text-purple-800',
      'Legend': 'bg-yellow-100 text-yellow-800',
      'Quantum': 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPostTypeIcon = (type: string) => {
    const icons = {
      'progress': <TrendingUp className="h-4 w-4 text-green-500" />,
      'achievement': <Trophy className="h-4 w-4 text-yellow-500" />,
      'challenge': <Target className="h-4 w-4 text-red-500" />,
      'question': <MessageCircle className="h-4 w-4 text-blue-500" />,
      'motivation': <Heart className="h-4 w-4 text-pink-500" />
    };
    return icons[type as keyof typeof icons] || <MessageCircle className="h-4 w-4 text-gray-500" />;
  };

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  if (!userReputation) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando comunidad SPARTAN...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🌐 Comunidad SPARTAN
        </h1>
        <p className="text-gray-600">Conecta, comparte y evoluciona junto a la élite del fitness</p>
      </div>

      {/* User Reputation Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{userProfile.name || 'SPARTAN Elite'}</h2>
                <Badge className={getReputationColor(userReputation.level)}>
                  {userReputation.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{userReputation.totalScore}</div>
              <p className="text-sm text-gray-600">Puntos de Reputación</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{userReputation.consistencyScore}</div>
              <p className="text-xs text-gray-600">Consistencia</p>
              <Progress value={(userReputation.consistencyScore / 1000) * 100} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{userReputation.supportScore}</div>
              <p className="text-xs text-gray-600">Apoyo</p>
              <Progress value={(userReputation.supportScore / 1000) * 100} className="h-2 mt-1" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{userReputation.resultsScore}</div>
              <p className="text-xs text-gray-600">Resultados</p>
              <Progress value={(userReputation.resultsScore / 1000) * 100} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
          <TabsTrigger value="create">Crear</TabsTrigger>
        </TabsList>

        {/* Community Feed */}
        <TabsContent value="feed" className="space-y-4">
          {communityFeed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">¡Bienvenido a la Comunidad!</h3>
                <p className="text-gray-600 mb-4">Sé el primero en compartir tu progreso</p>
                <Button onClick={() => setSelectedTab('create')}>Crear Primera Publicación</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {communityFeed.map(post => (
                <Card key={post.id} className="border-gray-200 hover:border-blue-300 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {post.authorName.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.authorName}</span>
                          <Badge className={getReputationColor(post.authorReputation.level)} variant="outline">
                            {post.authorReputation.level}
                          </Badge>
                          {post.verified && <Verified className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {getPostTypeIcon(post.type)}
                          <span className="capitalize">{post.type}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                        <span>{post.interactions.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-blue-500">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.interactions.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-green-500">
                        <HandHeart className="h-4 w-4" />
                        <span>{post.interactions.supports}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Community Challenges */}
        <TabsContent value="challenges" className="space-y-4">
          {activeChallenges.map(challenge => (
            <Card key={challenge.id} className="border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    {challenge.title}
                  </CardTitle>
                  <Badge className={getReputationColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className="text-gray-600">{challenge.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Community Goal */}
                  {challenge.communityGoal && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-purple-800">🎯 Meta Comunitaria</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{challenge.communityGoal.unit}</span>
                          <span>{challenge.communityGoal.current} / {challenge.communityGoal.target}</span>
                        </div>
                        <Progress 
                          value={(challenge.communityGoal.current / challenge.communityGoal.target) * 100} 
                          className="h-3"
                        />
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div>
                    <h4 className="font-semibold mb-2">🏆 Recompensas</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        +{challenge.rewards.reputationBonus} Reputación
                      </Badge>
                      {challenge.rewards.badges.map((badge, index) => (
                        <Badge key={index} variant="outline">
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => joinChallenge(challenge.id)}
                    disabled={challenge.participants.includes(userId)}
                    className="w-full"
                  >
                    {challenge.participants.includes(userId) ? 'Ya Participando' : 'Unirse al Desafío'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ranking de Reputación
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Usuario #{entry.reputation?.userId?.slice(-4) || '0000'}</span>
                        <Badge className={getReputationColor(entry.reputation?.level || 'Novice')} variant="outline">
                          {entry.reputation?.level || 'Novice'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{entry.reputation?.totalScore || 0}</div>
                      <div className="text-sm text-gray-500">puntos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Post */}
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-500" />
                Crear Nueva Publicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Publicación</label>
                <select 
                  value={postType} 
                  onChange={(e) => setPostType(e.target.value as CommunityPost['type'])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="progress">Progreso</option>
                  <option value="achievement">Logro</option>
                  <option value="challenge">Desafío</option>
                  <option value="question">Pregunta</option>
                  <option value="motivation">Motivación</option>
                  <option value="research">Investigación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Título de tu publicación..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenido</label>
                <Textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Comparte tu progreso, logros o motivación... Usa #hashtags para mejor visibilidad."
                  rows={6}
                />
              </div>

              <Button 
                onClick={createPost}
                disabled={!newPostContent.trim() || !newPostTitle.trim()}
                className="w-full"
              >
                Publicar en la Comunidad
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}