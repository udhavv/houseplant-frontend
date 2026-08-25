// components/dashboard/PlantStats.tsx
'use client'

import { motion } from 'framer-motion'
import { Plant } from '@/types'

interface PlantStatsProps {
  plant: Plant | null
  coins: number
}

const stats = [
  { key: 'health', label: 'Health', icon: '💚', color: 'from-green-400 to-green-600', bgColor: 'bg-green-50' },
  { key: 'waterLevel', label: 'Water', icon: '💧', color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-50' },
  { key: 'coins', label: 'Coins', icon: '🪙', color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-yellow-50' },
  // { key: 'level', label: 'Level', icon: '⭐', color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-50' },
  // { key: 'daysOld', label: 'Days Old', icon: '📅', color: 'from-indigo-400 to-indigo-600', bgColor: 'bg-indigo-50' },
  { key: 'growthStage', label: 'Stage', icon: '🌱', color: 'from-emerald-400 to-teal-600', bgColor: 'bg-emerald-50' },
]

export function PlantStats({ plant, coins }: PlantStatsProps) {
  const getPotDisplay = (potType: string) => {
    const potNames = { basic: 'Basic', ceramic: 'Ceramic', golden: 'Golden' }
    return potNames[potType as keyof typeof potNames] || potType
  }

  const getValue = (key: string) => {
    if (!plant) return 0
    if (key === 'coins') return coins
    if (key === 'growthStage') {
      const stageLabels = {
        seed: '🌰 Seed',
        sprout: '🌱 Sprout',
        seedling: '🌿 Seedling',
        young: '🌳 Young',
        mature: '🌲 Mature',
        flowering: '🌸 Flowering',
        fruiting: '🍎 Fruiting',
      }
      return stageLabels[plant.growthStage as keyof typeof stageLabels] || plant.growthStage
    }
    return plant[key as keyof Plant] ?? 0
  }

  const getSuffix = (key: string) => {
    if (key === 'health' || key === 'waterLevel') return '%'
    if (key === 'level') return ''
    if (key === 'daysOld') return ' days'
    return ''
  }

  return (
    <>
      {stats.map((stat, index) => {
        const value = getValue(stat.key)
        const suffix = getSuffix(stat.key)
        const isPercentage = stat.key === 'health' || stat.key === 'waterLevel'
        const isStage = stat.key === 'growthStage'
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          >

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' ? value : value}
                    {suffix}
                  </span>
                </div>
                {isPercentage && typeof value === 'number' && (
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        value > 70 ? 'bg-green-500' : value > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}