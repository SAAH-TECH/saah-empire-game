import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Trophy, Star, Award } from 'lucide-react';

const AchievementModal = () => {
  const { state, dispatch } = useGame();
  
  const achievementData = {
    firstTap: {
      title: "First Steps",
      description: "Make your first tap",
      icon: "👆",
      reward: 10
    },
    hundredTaps: {
      title: "Tapping Expert",
      description: "Tap 100 times",
      icon: "💪",
      reward: 100
    },
    thousandTaps: {
      title: "Tap Master",
      description: "Tap 1000 times",
      icon: "🔥",
      reward: 1000
    },
    firstUpgrade: {
      title: "Growing Business",
      description: "Purchase your first upgrade",
      icon: "📈",
      reward: 50
    },
    firstEmployee: {
      title: "Team Builder",
      description: "Hire your first employee",
      icon: "👥",
      reward: 100
    },
    millionaire: {
      title: "Millionaire",
      description: "Reach $1,000,000",
      icon: "💰",
      reward: 10000
    }
  };
  
  const formatMoney = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const handleClose = () => {
    dispatch({ type: 'SHOW_ACHIEVEMENT', achievement: null });
  };
  
  if (!state.showAchievement) return null;
  
  const achievement = achievementData[state.showAchievement];
  
  return (
    <Dialog open={!!state.showAchievement} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center space-x-2">
            <Trophy className="w-8 h-8" />
            <span>Achievement Unlocked!</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Congratulations on your progress!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">
                {achievement.icon}
              </div>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-purple-300 mb-2">
                  {achievement.title}
                </div>
                <div className="text-gray-300">
                  {achievement.description}
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">
                  Reward: {formatMoney(achievement.reward)}
                </span>
              </div>
              
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3"
              >
                Awesome!
              </Button>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-400">
            <p>Keep playing to unlock more achievements!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;