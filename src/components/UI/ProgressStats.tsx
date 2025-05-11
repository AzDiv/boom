import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Target, Award } from 'lucide-react';
import { UserWithGroupDetails } from '../../types/database.types';

interface ProgressStatsProps {
  user: UserWithGroupDetails;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ user }) => {
  const packType = user.pack_type || 'starter';
  const maxLevel = packType === 'starter' ? 30 : 60;
  const currentLevel = user.current_level || 0;
  const levelProgress = (currentLevel / maxLevel) * 100;
  
  const nextLevelNeeded = 4 - (user.verified_members % 4);
  
  const stats = [
    {
      name: 'Total Members',
      value: user.members || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Verified Members',
      value: user.verified_members || 0,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Current Level',
      value: currentLevel,
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Next Level In',
      value: `${nextLevelNeeded} members`,
      icon: Award,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Your Progress</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track your growth and achievements
        </p>
      </div>
      
      <div className="px-6 py-5">
        <div className="flex items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Level Progress ({currentLevel}/{maxLevel})
          </span>
          <span className="ml-auto text-sm font-medium text-gray-500">
            {Math.round(levelProgress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-2.5 rounded-full bg-primary"
          ></motion.div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;