import React from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  User, 
  Users, 
  Crown, 
  Briefcase,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

const EmployeeComponent = () => {
  const { state, dispatch } = useGame();
  
  const formatMoney = (amount) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
  };
  
  const getEmployeeIcon = (employeeId) => {
    switch (employeeId) {
      case 'intern': return <User className="w-6 h-6" />;
      case 'manager': return <Briefcase className="w-6 h-6" />;
      case 'director': return <Users className="w-6 h-6" />;
      case 'ceo': return <Crown className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };
  
  const getEmployeeTitle = (employeeId) => {
    switch (employeeId) {
      case 'intern': return 'Intern';
      case 'manager': return 'Manager';
      case 'director': return 'Director';
      case 'ceo': return 'CEO';
      default: return employeeId;
    }
  };
  
  const getEmployeeColor = (employeeId) => {
    switch (employeeId) {
      case 'intern': return 'text-green-400 bg-green-500/20';
      case 'manager': return 'text-blue-400 bg-blue-500/20';
      case 'director': return 'text-purple-400 bg-purple-500/20';
      case 'ceo': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };
  
  const canAfford = (cost) => state.money >= cost;
  
  const handleHire = (employeeId) => {
    dispatch({ type: 'HIRE_EMPLOYEE', employeeId });
  };
  
  const totalEmployees = Object.values(state.employees).reduce((sum, emp) => sum + emp.count, 0);
  const totalEmployeeIncome = Object.values(state.employees).reduce((sum, emp) => sum + (emp.count * emp.income), 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Employee Management</h2>
        <p className="text-gray-400">Build your team for passive income</p>
      </div>
      
      {/* Employee Summary */}
      <Card className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border-indigo-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-300 mb-2">
                {totalEmployees}
              </div>
              <div className="text-sm text-gray-300">Total Employees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300 mb-2">
                {formatMoney(totalEmployeeIncome)}
              </div>
              <div className="text-sm text-gray-300">Employee Income/sec</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                {((totalEmployeeIncome / (state.moneyPerSecond || 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-300">Of Total Income</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(state.employees).map(([employeeId, employee]) => {
          const affordable = canAfford(employee.cost);
          const totalIncome = employee.count * employee.income;
          
          return (
            <Card 
              key={employeeId} 
              className={`bg-gray-800/50 backdrop-blur-sm border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${affordable ? 'hover:border-green-500' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${getEmployeeColor(employeeId)}`}>
                      {getEmployeeIcon(employeeId)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {getEmployeeTitle(employeeId)}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {employee.count} Hired
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-400">
                  {employee.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Income per employee:
                    </span>
                    <span className="text-sm font-semibold text-green-400">
                      ${employee.income.toFixed(2)}/sec
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Total Income:
                    </span>
                    <span className="text-sm font-semibold text-blue-400">
                      ${totalIncome.toFixed(2)}/sec
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Payback Time:
                    </span>
                    <span className="text-sm font-semibold text-purple-400">
                      {employee.income > 0 ? `${(employee.cost / employee.income).toFixed(0)}s` : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {employee.count > 0 && (
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-300 mb-2">Productivity</div>
                    <Progress 
                      value={Math.min((employee.count / 10) * 100, 100)} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {employee.count}/10 for maximum efficiency
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold">
                      {formatMoney(employee.cost)}
                    </span>
                    <div className="text-sm text-gray-400">
                      Next Cost: {formatMoney(employee.cost * 1.5)}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleHire(employeeId)}
                    disabled={!affordable}
                    className={`w-full transition-all duration-300 ${
                      affordable 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
                        : 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? 'Hire Employee' : 'Insufficient Funds'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="bg-gradient-to-r from-green-900/50 to-teal-900/50 backdrop-blur-sm border-green-500/30">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2 text-green-300">Management Tip</h3>
            <p className="text-gray-300">
              Hire multiple employees of the same type to increase efficiency. Each employee type has different strengths!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeComponent;