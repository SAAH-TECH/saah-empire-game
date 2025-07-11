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
import { Gift, Calendar, Star } from 'lucide-react';

const DailyRewardModal = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getRewardAmount = (day) => {
    return Math.floor(100 * Math.pow(2, Math.min(day - 1, 6)));
  };
  
  const currentStreak = state.dailyRewards.streak || 1;
  const currentReward = getRewardAmount(currentStreak);
  
  const handleClaim = () => {
    dispatch({ type: 'CLAIM_DAILY_REWARD' });
    dispatch({ type: 'SHOW_DAILY_REWARD', show: false });
  };
  
  const handleClose = () => {
    dispatch({ type: 'SHOW_DAILY_REWARD', show: false });
  };
  
  return (
    <Dialog open={state.showDailyReward} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-400 flex items-center justify-center space-x-2">
            <Gift className="w-8 h-8" />
            <span>Daily Reward</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Claim your daily reward to keep your streak going!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-500/30">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {formatMoney(currentReward)}
                </div>
                <div className="text-sm text-gray-300">
                  Day {currentStreak} Reward
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">
                  {currentStreak} Day Streak
                </span>
              </div>
              
              <Button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold py-3"
              >
                Claim Reward
              </Button>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const reward = getRewardAmount(day);
              const isCurrentDay = day === currentStreak;
              const isPastDay = day < currentStreak;
              
              return (
                <div key={day} className="text-center">
                  <div 
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      isCurrentDay 
                        ? 'bg-yellow-600 border-yellow-400 animate-pulse' 
                        : isPastDay 
                        ? 'bg-green-600 border-green-400' 
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">Day {day}</div>
                    <div className="text-xs mt-1">
                      {formatMoney(reward)}
                    </div>
                    {isPastDay && (
                      <Star className="w-4 h-4 mx-auto mt-1 text-green-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>Come back tomorrow for an even bigger reward!</p>
            <p className="mt-1">Miss a day and your streak resets.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyRewardModal;