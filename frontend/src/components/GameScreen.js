import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Gift, 
  Trophy,
  Zap,
  Star,
  Target,
  Clock
} from 'lucide-react';
import ShopComponent from './ShopComponent';
import EmployeeComponent from './EmployeeComponent';
import DailyRewardModal from './DailyRewardModal';
import AchievementModal from './AchievementModal';
import StatsComponent from './StatsComponent';

const GameScreen = () => {
  const { state, dispatch, isLoaded, manualSave, manualLoad, resetGame } = useGame();
  const [tapAnimation, setTapAnimation] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  
  // Show loading screen until game is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Your Empire...</h2>
          <p className="text-gray-300">Restoring your business progress</p>
        </div>
      </div>
    );
  }
  
  // Show save indicator when game saves
  useEffect(() => {
    setShowSaveIndicator(true);
    const timer = setTimeout(() => {
      setShowSaveIndicator(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [state.money, state.level]); // Show when important values change
  
  const handleTap = () => {
    dispatch({ type: 'TAP' });
    setTapAnimation(true);
    
    // Add floating number animation
    const id = Date.now();
    setFloatingNumbers(prev => [...prev, { id, value: state.moneyPerTap }]);
    
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(num => num.id !== id));
    }, 1000);
    
    setTimeout(() => setTapAnimation(false), 150);
  };
  
  const formatMoney = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };
  
  const gameTime = Math.floor((Date.now() - state.stats.gameStarted) / 1000);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="text-yellow-400 w-8 h-8" />
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {formatMoney(state.money)}
                </div>
                <div className="text-sm text-gray-300">
                  ${state.moneyPerSecond.toFixed(2)}/sec
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <span className="text-lg font-semibold">Level {state.level}</span>
              </div>
              <div className="text-sm text-gray-300">
                {formatTime(gameTime)} played
              </div>
            </div>
            <div className="w-32">
              <Progress 
                value={(state.experience / state.experienceToNext) * 100} 
                className="h-2"
              />
              <div className="text-xs text-gray-400 mt-1">
                {state.experience}/{state.experienceToNext} XP
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={state.activeTab} onValueChange={(tab) => dispatch({ type: 'SET_ACTIVE_TAB', tab })}>
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="main" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Main</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Shop</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Tap Area */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-8">
                  <div className="text-center relative">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold mb-2">Tap to Earn</h2>
                      <p className="text-gray-400">+{formatMoney(state.moneyPerTap)} per tap</p>
                    </div>
                    
                    <div className="relative inline-block">
                      <Button
                        onClick={handleTap}
                        className={`w-48 h-48 rounded-full text-6xl bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 border-4 border-yellow-300 shadow-2xl transition-all duration-150 ${tapAnimation ? 'scale-95' : 'scale-100'}`}
                      >
                        <Coins className="w-16 h-16" />
                      </Button>
                      
                      {/* Floating Numbers */}
                      {floatingNumbers.map(num => (
                        <div
                          key={num.id}
                          className="absolute text-yellow-400 font-bold text-2xl animate-bounce pointer-events-none"
                          style={{
                            left: '50%',
                            top: '20%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'float 1s ease-out forwards'
                          }}
                        >
                          +{formatMoney(num.value)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Stats */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {formatMoney(state.stats.totalEarned)}
                      </div>
                      <div className="text-sm text-gray-400">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {state.stats.totalTaps.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Total Taps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {state.stats.upgradesPurchased}
                      </div>
                      <div className="text-sm text-gray-400">Upgrades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {state.stats.employeesHired}
                      </div>
                      <div className="text-sm text-gray-400">Employees</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: 'shop' })}
                className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                <div>
                  <div className="font-semibold">Shop</div>
                  <div className="text-sm opacity-80">Buy Upgrades</div>
                </div>
              </Button>
              
              <Button
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: 'employees' })}
                className="h-16 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
              >
                <Users className="w-6 h-6 mr-2" />
                <div>
                  <div className="font-semibold">Employees</div>
                  <div className="text-sm opacity-80">Hire Staff</div>
                </div>
              </Button>
              
              <Button
                onClick={() => dispatch({ type: 'SHOW_DAILY_REWARD', show: true })}
                className="h-16 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
                disabled={!state.dailyRewards.canClaim}
              >
                <Gift className="w-6 h-6 mr-2" />
                <div>
                  <div className="font-semibold">Daily Reward</div>
                  <div className="text-sm opacity-80">
                    {state.dailyRewards.canClaim ? 'Available' : 'Claimed'}
                  </div>
                </div>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="shop">
            <ShopComponent />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeeComponent />
          </TabsContent>
          
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Daily Reward</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      Day {state.dailyRewards.streak || 1}
                    </div>
                    <div className="text-gray-400 mb-4">
                      Current Streak: {state.dailyRewards.streak} days
                    </div>
                    <Button
                      onClick={() => dispatch({ type: 'SHOW_DAILY_REWARD', show: true })}
                      disabled={!state.dailyRewards.canClaim}
                      className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500"
                    >
                      {state.dailyRewards.canClaim ? 'Claim Reward' : 'Already Claimed'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(state.achievements).map(([key, achieved]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Badge variant={achieved ? "default" : "secondary"}>
                          {achieved ? "✓" : "○"}
                        </Badge>
                        <span className={achieved ? "text-green-400" : "text-gray-400"}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsComponent />
          </TabsContent>
        </Tabs>
      </div>
      
      <DailyRewardModal />
      <AchievementModal />
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -200%) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GameScreen;