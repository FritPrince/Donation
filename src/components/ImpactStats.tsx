import React from 'react';
import { Users, TreePine, Droplets, Home } from 'lucide-react';

interface ImpactStatsProps {
  stats: {
    peopleHelped: number;
    treesPlanted: number;
    waterProvided: number;
    homesBuilt: number;
  };
}

const ImpactStats: React.FC<ImpactStatsProps> = ({ stats }) => {
  const impactItems = [
    {
      icon: Users,
      value: stats.peopleHelped,
      label: 'Personnes aidées',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: TreePine,
      value: stats.treesPlanted,
      label: 'Arbres plantés',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Droplets,
      value: stats.waterProvided,
      label: 'Litres d\'eau fournis',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200'
    },
    {
      icon: Home,
      value: stats.homesBuilt,
      label: 'Maisons construites',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {impactItems.map((item, index) => (
        <div
          key={index}
          className={`${item.bgColor} border ${item.borderColor} p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`text-3xl font-bold ${item.color}`}>
              {item.value.toLocaleString()}
            </div>
            <div className="text-gray-700 font-medium">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImpactStats;