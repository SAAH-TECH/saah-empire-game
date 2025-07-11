import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Zap, 
  MousePointer, 
  Building, 
  TrendingUp, 
  Home,
  Lock,
  CheckCircle
} from 'lucide-react';

const ShopComponent = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getUpgradeIcon = (upgradeId) => {
    switch (upgradeId) {
      case 'tapPower': return <MousePointer className="w-6 h-6" />;
      case 'autoClicker': return <Zap className="w-6 h-6" />;
      case 'businessSuite': return <Building className="w-6 h-6" />;
      case 'stockInvestment': return <TrendingUp className="w-6 h-6" />;
      case 'realEstate': return <Home className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };
  
  const getUpgradeTitle = (upgradeId) => {
    switch (upgradeId) {
      case 'tapPower': return 'Tap Power';
      case 'autoClicker': return 'Auto Clicker';
      case 'businessSuite': return 'Business Suite';
      case 'stockInvestment': return 'Stock Investment';
      case 'realEstate': return 'Real Estate';
      default: return upgradeId;
    }
  };
  
  const canAfford = (cost) => state.money >= cost;
  
  const handlePurchase = (upgradeId) => {
    dispatch({ type: 'BUY_UPGRADE', upgradeId });
  };
  
  const getUpgradeEffect = (upgradeId, level) => {
    switch (upgradeId) {
      case 'tapPower':
        return `+$${Math.pow(2, level).toFixed(2)} per tap`;
      case 'autoClicker':
        return `+$${Math.pow(2, level).toFixed(2)}/sec`;
      default:
        return `+$${Math.pow(3, level).toFixed(2)}/sec`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Upgrade Shop</h2>
        <p className="text-gray-400">Invest in your business empire</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(state.upgrades).map(([upgradeId, upgrade]) => {
          const affordable = canAfford(upgrade.cost);
          const nextEffect = getUpgradeEffect(upgradeId, upgrade.level);
          
          return (
            <Card 
              key={upgradeId} 
              className={`bg-gray-800/50 backdrop-blur-sm border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${affordable ? 'hover:border-green-500' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${affordable ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                      {getUpgradeIcon(upgradeId)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getUpgradeTitle(upgradeId)}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        Level {upgrade.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  {upgrade.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Current Effect:</span>
                    <span className="text-sm font-semibold text-blue-400">
                      {upgrade.level > 0 ? getUpgradeEffect(upgradeId, upgrade.level - 1) : 'None'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Next Level:</span>
                    <span className="text-sm font-semibold text-green-400">
                      {nextEffect}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold">
                      {formatMoney(upgrade.cost)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {affordable ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(upgradeId)}
                    disabled={!affordable}
                    className={`w-full transition-all duration-300 ${
                      affordable 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' 
                        : 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? 'Purchase' : 'Insufficient Funds'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-purple-500/30">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-purple-300">Pro Tip</h3>
            <p className="text-gray-300">
              Focus on upgrades that increase your passive income first, then boost your tap power for maximum efficiency!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopComponent;