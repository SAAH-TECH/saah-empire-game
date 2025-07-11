import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Clock, 
  MousePointer, 
  Users, 
  ShoppingCart,
  Target,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';

const StatsComponent = () => {
  const { state } = useGame();
  
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
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };
  
  const gameTime = Math.floor((Date.now() - state.stats.gameStarted) / 1000);
  const averagePerSecond = gameTime > 0 ? state.stats.totalEarned / gameTime : 0;
  const averagePerTap = state.stats.totalTaps > 0 ? state.stats.totalEarned / state.stats.totalTaps : 0;
  
  const achievementCount = Object.values(state.achievements).filter(Boolean).length;
  const totalAchievements = Object.keys(state.achievements).length;
  const achievementProgress = (achievementCount / totalAchievements) * 100;
  
  const totalEmployees = Object.values(state.employees).reduce((sum, emp) => sum + emp.count, 0);
  const totalUpgrades = Object.values(state.upgrades).reduce((sum, upgrade) => sum + upgrade.level, 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Game Statistics</h2>
        <p className="text-gray-400">Track your tycoon empire progress</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {formatMoney(state.stats.totalEarned)}
                </div>
                <div className="text-sm text-gray-300">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MousePointer className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-blue-300">
                  {state.stats.totalTaps.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Total Taps</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-purple-300">
                  {formatTime(gameTime)}
                </div>
                <div className="text-sm text-gray-300">Time Played</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-yellow-300">
                  {state.level}
                </div>
                <div className="text-sm text-gray-300">Current Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold text-green-400">
                  {formatMoney(averagePerSecond)}
                </div>
                <div className="text-sm text-gray-400">Avg. per Second</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-400">
                  {formatMoney(averagePerTap)}
                </div>
                <div className="text-sm text-gray-400">Avg. per Tap</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-400">
                  {formatMoney(state.moneyPerTap)}
                </div>
                <div className="text-sm text-gray-400">Current Tap Power</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-400">
                  {formatMoney(state.moneyPerSecond)}
                </div>
                <div className="text-sm text-gray-400">Passive Income</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievement Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Overall Progress</span>
                <span className="text-sm font-semibold">
                  {achievementCount}/{totalAchievements}
                </span>
              </div>
              <Progress value={achievementProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(state.achievements).map(([key, achieved]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Badge variant={achieved ? "default" : "secondary"} className="text-xs">
                    {achieved ? "✓" : "○"}
                  </Badge>
                  <span className={`text-xs ${achieved ? "text-green-400" : "text-gray-400"}`}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Investment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Upgrade Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-blue-400">
                  {state.stats.upgradesPurchased}
                </div>
                <div className="text-sm text-gray-400">Total Purchases</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-400">
                  {totalUpgrades}
                </div>
                <div className="text-sm text-gray-400">Total Levels</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {Object.entries(state.upgrades).map(([key, upgrade]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <Badge variant="outline">
                    Level {upgrade.level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Employee Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold text-green-400">
                  {state.stats.employeesHired}
                </div>
                <div className="text-sm text-gray-400">Total Hired</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-400">
                  {totalEmployees}
                </div>
                <div className="text-sm text-gray-400">Currently Employed</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {Object.entries(state.employees).map(([key, employee]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-300 capitalize">
                    {key}s
                  </span>
                  <Badge variant="outline">
                    {employee.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Fun Facts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">
                If you tapped non-stop, you'd make
              </div>
              <div className="text-lg font-semibold text-cyan-400">
                {formatMoney(state.moneyPerTap * 60)} per minute
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-300 mb-1">
                Your business empire generates
              </div>
              <div className="text-lg font-semibold text-green-400">
                {formatMoney(state.moneyPerSecond * 3600)} per hour
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsComponent;