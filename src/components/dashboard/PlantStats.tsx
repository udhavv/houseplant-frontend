// components/dashboard/PlantStats.tsx
'use client'

import { motion } from 'framer-motion'

interface PlantStatsProps {
  plantData: {
    health: number
    waterLevel: number
    growthStage: string
    daysOld: number
    experience: number
    level: number
    nextLevelXP: number
  }
}

const stats = [
  { 
    key: 'level', 
    label: 'Level', 
    icon: '⭐', 
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  { 
    key: 'experience', 
    label: 'Experience', 
    icon: '✨', 
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  { 
    key: 'daysOld', 
    label: 'Days Growing', 
    icon: '📅', 
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50'
  },
]

export function PlantStats({ plantData }: PlantStatsProps) {
  return (
    <>
      {stats.map((stat, index) => {
        const value: any = plantData[stat.key as keyof typeof plantData]
        const isExperience = stat.key === 'experience'
        const isLevel = stat.key === 'level'
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index }}
            whileHover={{ scale: 1.02 }}
            className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                {isLevel ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    <span className="text-sm text-gray-500">/ 10</span>
                  </div>
                ) : isExperience ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{value}</span>
                      <span className="text-sm text-gray-500">/ {plantData.nextLevelXP}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(value / plantData.nextLevelXP) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">{value}</span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}