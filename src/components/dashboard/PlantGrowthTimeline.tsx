// components/dashboard/PlantGrowthTimeline.tsx
'use client'

import { motion } from 'framer-motion'
import { Plant } from '@/redux/slices/plantSlice'

interface PlantGrowthTimelineProps {
  plant: Plant | null
}

const milestones = [
  { day: 0, label: 'Seed Planted', icon: '🌰', description: 'Your journey begins' },
  { day: 20, label: 'First Sprout', icon: '🌱', description: 'Life emerges from the soil' },
  { day: 40, label: 'First Leaves', icon: '🌿', description: 'Photosynthesis begins' },
  { day: 60, label: 'Strong Stem', icon: '🌳', description: 'Growing taller every day' },
  { day: 80, label: 'Mature Plant', icon: '🌲', description: 'Full growth achieved' },
]

export function PlantGrowthTimeline({ plant }: PlantGrowthTimelineProps) {
  if (!plant) return null

  const daysOld = Math.floor((Date.now() - new Date(plant.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const currentDay = Math.min(daysOld, 80)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Growth Timeline</h3>
      <p className="text-gray-600 text-sm mb-6">Day {currentDay} of growth</p>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2" />

        {/* Milestones */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const isReached = milestone.day <= currentDay
            const isCurrent = milestone.day <= currentDay && 
              (index === milestones.length - 1 || milestones[index + 1].day > currentDay)

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 z-10 ${
                  isReached ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {isCurrent && plant.isAlive && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-green-500 opacity-50"
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 flex-1 ${
                  index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      isReached
                        ? plant.isAlive 
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                        : 'bg-gray-50 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:justify-end">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            isReached ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {milestone.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            Day {milestone.day}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                      {isReached && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-500"
                        >
                          ✅
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}