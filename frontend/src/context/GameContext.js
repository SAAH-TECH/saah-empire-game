import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

const GameContext = createContext();

const initialState = {
  money: 0,
  moneyPerTap: 1,
  moneyPerSecond: 0,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  
  // Upgrades
  upgrades: {
    tapPower: { level: 0, cost: 10, multiplier: 1.5, description: "Increase tap power" },
    autoClicker: { level: 0, cost: 50, multiplier: 2, description: "Automatic clicking" },
    businessSuite: { level: 0, cost: 200, multiplier: 3, description: "Professional business suite" },
    stockInvestment: { level: 0, cost: 1000, multiplier: 4, description: "Stock market investments" },
    realEstate: { level: 0, cost: 5000, multiplier: 5, description: "Real estate portfolio" },
  },
  
  // Employees
  employees: {
    intern: { count: 0, cost: 25, income: 1, description: "Entry-level intern" },
    manager: { count: 0, cost: 100, income: 5, description: "Department manager" },
    director: { count: 0, cost: 500, income: 25, description: "Executive director" },
    ceo: { count: 0, cost: 2500, income: 125, description: "Chief executive officer" },
  },
  
  // Daily rewards
  dailyRewards: {
    lastClaim: null,
    streak: 0,
    canClaim: true,
  },
  
  // Achievements
  achievements: {
    firstTap: false,
    hundredTaps: false,
    thousandTaps: false,
    firstUpgrade: false,
    firstEmployee: false,
    millionaire: false,
  },
  
  // Stats
  stats: {
    totalTaps: 0,
    totalEarned: 0,
    upgradesPurchased: 0,
    employeesHired: 0,
    gameStarted: Date.now(),
  },
  
  // UI State
  activeTab: 'main',
  showDailyReward: false,
  showAchievement: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'TAP':
      const tapEarnings = state.moneyPerTap;
      const newMoney = state.money + tapEarnings;
      const newExperience = state.experience + 1;
      const newLevel = newExperience >= state.experienceToNext ? state.level + 1 : state.level;
      const newExpToNext = newExperience >= state.experienceToNext ? state.experienceToNext + 50 : state.experienceToNext;
      
      return {
        ...state,
        money: newMoney,
        experience: newExperience >= state.experienceToNext ? newExperience - state.experienceToNext : newExperience,
        level: newLevel,
        experienceToNext: newExpToNext,
        stats: {
          ...state.stats,
          totalTaps: state.stats.totalTaps + 1,
          totalEarned: state.stats.totalEarned + tapEarnings,
        },
        achievements: {
          ...state.achievements,
          firstTap: true,
          hundredTaps: state.stats.totalTaps >= 99 ? true : state.achievements.hundredTaps,
          thousandTaps: state.stats.totalTaps >= 999 ? true : state.achievements.thousandTaps,
          millionaire: newMoney >= 1000000 ? true : state.achievements.millionaire,
        }
      };
      
    case 'PASSIVE_INCOME':
      return {
        ...state,
        money: state.money + state.moneyPerSecond,
        stats: {
          ...state.stats,
          totalEarned: state.stats.totalEarned + state.moneyPerSecond,
        }
      };
      
    case 'BUY_UPGRADE':
      const upgrade = state.upgrades[action.upgradeId];
      if (state.money >= upgrade.cost) {
        const newUpgrades = {
          ...state.upgrades,
          [action.upgradeId]: {
            ...upgrade,
            level: upgrade.level + 1,
            cost: Math.floor(upgrade.cost * upgrade.multiplier),
          }
        };
        
        let newMoneyPerTap = state.moneyPerTap;
        let newMoneyPerSecond = state.moneyPerSecond;
        
        if (action.upgradeId === 'tapPower') {
          newMoneyPerTap = state.moneyPerTap + Math.pow(2, upgrade.level);
        } else if (action.upgradeId === 'autoClicker') {
          newMoneyPerSecond = state.moneyPerSecond + Math.pow(2, upgrade.level);
        } else {
          newMoneyPerSecond = state.moneyPerSecond + Math.pow(3, upgrade.level);
        }
        
        return {
          ...state,
          money: state.money - upgrade.cost,
          moneyPerTap: newMoneyPerTap,
          moneyPerSecond: newMoneyPerSecond,
          upgrades: newUpgrades,
          stats: {
            ...state.stats,
            upgradesPurchased: state.stats.upgradesPurchased + 1,
          },
          achievements: {
            ...state.achievements,
            firstUpgrade: true,
          }
        };
      }
      return state;
      
    case 'HIRE_EMPLOYEE':
      const employee = state.employees[action.employeeId];
      if (state.money >= employee.cost) {
        const newEmployees = {
          ...state.employees,
          [action.employeeId]: {
            ...employee,
            count: employee.count + 1,
            cost: Math.floor(employee.cost * 1.5),
          }
        };
        
        return {
          ...state,
          money: state.money - employee.cost,
          moneyPerSecond: state.moneyPerSecond + employee.income,
          employees: newEmployees,
          stats: {
            ...state.stats,
            employeesHired: state.stats.employeesHired + 1,
          },
          achievements: {
            ...state.achievements,
            firstEmployee: true,
          }
        };
      }
      return state;
      
    case 'CLAIM_DAILY_REWARD':
      const today = new Date().toDateString();
      const lastClaim = state.dailyRewards.lastClaim;
      const canClaim = !lastClaim || lastClaim !== today;
      
      if (canClaim) {
        const streak = lastClaim && new Date(lastClaim).getTime() > Date.now() - 48 * 60 * 60 * 1000 
          ? state.dailyRewards.streak + 1 : 1;
        const reward = Math.floor(100 * Math.pow(2, Math.min(streak - 1, 6)));
        
        return {
          ...state,
          money: state.money + reward,
          dailyRewards: {
            lastClaim: today,
            streak: streak,
            canClaim: false,
          },
          stats: {
            ...state.stats,
            totalEarned: state.stats.totalEarned + reward,
          }
        };
      }
      return state;
      
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab };
      
    case 'SHOW_DAILY_REWARD':
      return { ...state, showDailyReward: action.show };
      
    case 'SHOW_ACHIEVEMENT':
      return { ...state, showAchievement: action.achievement };
      
    case 'LOAD_GAME':
      return { ...state, ...action.data };
      
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Auto-save game state
  useEffect(() => {
    const saveData = { ...state };
    delete saveData.showDailyReward;
    delete saveData.showAchievement;
    localStorage.setItem('tycoonGame', JSON.stringify(saveData));
  }, [state]);
  
  // Load game state on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('tycoonGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        dispatch({ type: 'LOAD_GAME', data: parsedGame });
      } catch (error) {
        console.error('Failed to load saved game:', error);
      }
    }
  }, []);
  
  // Passive income timer
  useEffect(() => {
    if (state.moneyPerSecond > 0) {
      const interval = setInterval(() => {
        dispatch({ type: 'PASSIVE_INCOME' });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.moneyPerSecond]);
  
  // Check daily reward availability
  useEffect(() => {
    const today = new Date().toDateString();
    const lastClaim = state.dailyRewards.lastClaim;
    const canClaim = !lastClaim || lastClaim !== today;
    
    if (canClaim && !state.showDailyReward) {
      setTimeout(() => {
        dispatch({ type: 'SHOW_DAILY_REWARD', show: true });
      }, 3000);
    }
  }, [state.dailyRewards.lastClaim, state.showDailyReward]);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};