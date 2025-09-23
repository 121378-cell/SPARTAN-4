// Advanced Gamification Dashboard Component
import React, { useState, useEffect } from 'react';
import { advancedGamificationService, Achievement, Medal, Challenge, UserGamificationStatistics } from '../lib/advanced-gamification-service';

interface AdvancedGamificationDashboardProps {
  userId: string;
  className?: string;
}

const AdvancedGamificationDashboard: React.FC<AdvancedGamificationDashboardProps> = ({ 
  userId,
  className = ''
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [statistics, setStatistics] = useState<UserGamificationStatistics | null>(null);
  const [levelInfo, setLevelInfo] = useState<{ level: number; xp: number; xpToNextLevel: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all gamification data
        const [
          userAchievements,
          userMedals,
          userActiveChallenges,
          userCompletedChallenges,
          userStatistics,
          userLevelInfo
        ] = await Promise.all([
          advancedGamificationService.getUserAchievements(userId),
          advancedGamificationService.getUserMedals(userId),
          advancedGamificationService.getActiveChallenges(userId),
          advancedGamificationService.getCompletedChallenges(userId),
          advancedGamificationService.getUserStatistics(userId),
          advancedGamificationService.getUserLevelInfo(userId)
        ]);
        
        setAchievements(userAchievements);
        setMedals(userMedals);
        setActiveChallenges(userActiveChallenges);
        setCompletedChallenges(userCompletedChallenges);
        setStatistics(userStatistics);
        setLevelInfo(userLevelInfo);
      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadData();
    }
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-lg">Cargando datos de gamificación...</div>
      </div>
    );
  }
  
  return (
    <div className={`p-6 bg-gray-900 rounded-xl shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-6">Sistema de Gamificación Avanzada</h2>
      
      {/* Level and XP Progress */}
      {levelInfo && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-white">Nivel {levelInfo.level}</h3>
            <span className="text-sm text-gray-300">
              {levelInfo.xp} / {levelInfo.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${Math.min(100, (levelInfo.xp / levelInfo.xpToNextLevel) * 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{statistics.achievementsUnlocked}</div>
            <div className="text-sm text-gray-300">Logros</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{statistics.challengesCompleted}</div>
            <div className="text-sm text-gray-300">Retos Completados</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{statistics.currentStreak}</div>
            <div className="text-sm text-gray-300">Racha Actual</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{medals.length}</div>
            <div className="text-sm text-gray-300">Medallas</div>
          </div>
        </div>
      )}
      
      {/* Achievements Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Logros</h3>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(achievement => achievement.unlocked)
              .map(achievement => (
                <div 
                  key={achievement.id} 
                  className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="bg-gray-700 rounded-lg p-2 mr-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{achievement.title}</h4>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          achievement.rarity === 'common' ? 'bg-gray-600 text-gray-200' :
                          achievement.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                          achievement.rarity === 'rare' ? 'bg-blue-600 text-white' :
                          achievement.rarity === 'epic' ? 'bg-purple-600 text-white' :
                          achievement.rarity === 'legendary' ? 'bg-yellow-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">Aún no has desbloqueado logros</div>
        )}
      </div>
      
      {/* Medals Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Medallas</h3>
        {medals.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {medals.map(medal => (
              <div 
                key={medal.id} 
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-32 text-center"
              >
                <div className="mx-auto mb-2">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                    medal.rarity === 'bronze' ? 'bg-yellow-800' :
                    medal.rarity === 'silver' ? 'bg-gray-300' :
                    medal.rarity === 'gold' ? 'bg-yellow-400' :
                    medal.rarity === 'platinum' ? 'bg-blue-300' :
                    medal.rarity === 'diamond' ? 'bg-blue-100' :
                    'bg-purple-400'
                  }`}>
                    <span className="text-white font-bold text-lg">★</span>
                  </div>
                </div>
                <h4 className="font-semibold text-white text-sm">{medal.title}</h4>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    medal.rarity === 'bronze' ? 'bg-yellow-800 text-white' :
                    medal.rarity === 'silver' ? 'bg-gray-600 text-white' :
                    medal.rarity === 'gold' ? 'bg-yellow-500 text-gray-900' :
                    medal.rarity === 'platinum' ? 'bg-blue-400 text-gray-900' :
                    medal.rarity === 'diamond' ? 'bg-blue-200 text-gray-900' :
                    'bg-purple-500 text-white'
                  }`}>
                    {medal.rarity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">Aún no has ganado medallas</div>
        )}
      </div>
      
      {/* Active Challenges Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Retos Activos</h3>
        {activeChallenges.length > 0 ? (
          <div className="space-y-4">
            {activeChallenges.map(challenge => (
              <div 
                key={challenge.id} 
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{challenge.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${
                    challenge.difficulty === 'beginner' ? 'bg-green-600' :
                    challenge.difficulty === 'intermediate' ? 'bg-yellow-600' :
                    challenge.difficulty === 'advanced' ? 'bg-orange-600' :
                    challenge.difficulty === 'expert' ? 'bg-red-600' :
                    'bg-purple-600'
                  } text-white`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                <div className="flex items-center">
                  <div className="flex-1 mr-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {challenge.currentValue} {challenge.unit}
                      </span>
                      <span className="text-gray-300">
                        {challenge.targetValue} {challenge.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min(100, (challenge.currentValue / challenge.targetValue) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-300">
                    {Math.round((challenge.currentValue / challenge.targetValue) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">No tienes retos activos</div>
        )}
      </div>
      
      {/* Completed Challenges Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Retos Completados</h3>
        {completedChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map(challenge => (
              <div 
                key={challenge.id} 
                className="bg-gray-800 p-4 rounded-lg border border-green-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{challenge.title}</h4>
                  <span className="px-2 py-1 text-xs rounded bg-green-600 text-white">
                    Completado
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{challenge.description}</p>
                <div className="mt-3 flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    Completado el {challenge.endDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">Aún no has completado retos</div>
        )}
      </div>
    </div>
  );
};

export default AdvancedGamificationDashboard;