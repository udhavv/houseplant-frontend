// components/dashboard/PlantGrowthTimeline.tsx
'use client'

import { motion } from 'framer-motion'
import { Plant, PLANT_STAGES_CONFIG, PlantStage } from '@/types'

interface PlantGrowthTimelineProps {
  plant: Plant | null
}

// ====== Use actual stages from PLANT_STAGES ======
const stageMilestones = [
  { 
    stage: 'seed', 
    label: 'Seed', 
    icon: '🌰', 
    description: 'A tiny seed waiting to sprout',
    minDays: 0,
    experienceRequired: 0,
    healthRange: [0, 20]
  },
  { 
    stage: 'sprout', 
    label: 'Sprout', 
    icon: '🌱', 
    description: 'First signs of life emerging',
    minDays: 2,
    experienceRequired: 50,
    healthRange: [21, 40]
  },
  { 
    stage: 'seedling', 
    label: 'Seedling', 
    icon: '🌿', 
    description: 'Developing true leaves',
    minDays: 5,
    experienceRequired: 150,
    healthRange: [41, 60]
  },
  { 
    stage: 'young', 
    label: 'Young Plant', 
    icon: '🌳', 
    description: 'Growing taller and stronger',
    minDays: 10,
    experienceRequired: 350,
    healthRange: [61, 80]
  },
  { 
    stage: 'mature', 
    label: 'Mature Plant', 
    icon: '🌲', 
    description: 'Full growth achieved',
    minDays: 20,
    experienceRequired: 600,
    healthRange: [81, 95]
  },
  { 
    stage: 'flowering', 
    label: 'Flowering', 
    icon: '🌸', 
    description: 'Beautiful blooms appear',
    minDays: 30,
    experienceRequired: 900,
    healthRange: [81, 100]
  },
  { 
    stage: 'fruiting', 
    label: 'Fruiting', 
    icon: '🍎', 
    description: 'Fruits of your labor',
    minDays: 40,
    experienceRequired: 1200,
    healthRange: [81, 100]
  },
]

export function PlantGrowthTimeline({ plant }: PlantGrowthTimelineProps) {
  if (!plant) return null

  const daysOld = plant.daysOld || Math.floor((Date.now() - new Date(plant.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const currentStage = plant.growthStage as PlantStage
  const currentStageIndex = stageMilestones.findIndex(s => s.stage === currentStage)
  const isAlive = plant.isAlive
  const currentLevel = plant.level || 1
  const currentXP = plant.experience || 0
  const xpForNextLevel = currentLevel * 200

  // Calculate progress to next stage based on days and XP
  const nextStageIndex = currentStageIndex + 1
  let progressToNextStage = 0
  
  if (nextStageIndex < stageMilestones.length) {
    const nextStage = stageMilestones[nextStageIndex]
    const currentStageData = stageMilestones[currentStageIndex]
    
    // Progress based on days
    const dayProgress = Math.min(100, ((daysOld - currentStageData.minDays) / (nextStage.minDays - currentStageData.minDays)) * 100)
    
    // Progress based on XP
    const xpProgress = Math.min(100, ((currentXP - currentStageData.experienceRequired) / (nextStage.experienceRequired - currentStageData.experienceRequired)) * 100)
    
    // Average of both
    progressToNextStage = Math.min(100, Math.max(0, (dayProgress + xpProgress) / 2))
  } else {
    progressToNextStage = 100 // Max stage reached
  }

  // Calculate XP progress to next level
  const xpProgress = Math.min(100, (currentXP / xpForNextLevel) * 100)

  // Get stage config for current stage
  const currentStageConfig = PLANT_STAGES_CONFIG[currentStage]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">📈 Growth Timeline</h3>
          <p className="text-gray-600 text-sm">
            Day {daysOld} • Level {currentLevel} • {isAlive ? '🌱 Growing' : '💀 Deceased'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">XP Progress</div>
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm font-semibold text-purple-600">{currentXP}</span>
            <span className="text-xs text-gray-500">/ {xpForNextLevel}</span>
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Plant Status Summary */}
      {!isAlive && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          💀 Your plant has died. Reset to start a new journey!
        </div>
      )}

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2" />

        {/* Milestones */}
        <div className="space-y-8">
          {stageMilestones.map((milestone, index) => {
            const isReached = index <= currentStageIndex && isAlive
            const isCurrent = index === currentStageIndex && isAlive
            const isNext = index === currentStageIndex + 1 && isAlive
            const isLocked = index > currentStageIndex + 1 || !isAlive

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
                  isReached ? 'bg-green-500' : isNext ? 'bg-yellow-400' : 'bg-gray-300'
                }`}>
                  {isCurrent && isAlive && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-green-500 opacity-50"
                    />
                  )}
                  {isNext && isAlive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-yellow-400 opacity-40"
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
                        ? isAlive 
                          ? 'bg-green-50 border border-green-200 shadow-sm'
                          : 'bg-red-50 border border-red-200'
                        : isNext
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-50 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 md:justify-end">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-semibold ${
                            isReached ? 'text-gray-900' : isNext ? 'text-yellow-700' : 'text-gray-500'
                          }`}>
                            {milestone.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            Day {milestone.minDays}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isReached 
                              ? 'bg-green-100 text-green-700'
                              : isNext
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {milestone.healthRange[0]}-{milestone.healthRange[1]}% Health
                          </span>
                          {milestone.experienceRequired > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isReached 
                                ? 'bg-purple-100 text-purple-700'
                                : isNext
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {milestone.experienceRequired} XP
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isReached ? 'text-gray-600' : isNext ? 'text-yellow-600' : 'text-gray-500'
                        }`}>
                          {milestone.description}
                        </p>
                        {isNext && isAlive && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, progressToNextStage)}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
                                />
                              </div>
                              <span className="text-xs font-medium text-yellow-600">
                                {Math.min(100, Math.round(progressToNextStage))}%
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Health: {plant.health}%</span>
                              <span>XP: {plant.experience}</span>
                              <span>Days: {daysOld}</span>
                            </div>
                          </div>
                        )}
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
                      {isNext && isAlive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-yellow-500"
                        >
                          ⏳
                        </motion.div>
                      )}
                      {isLocked && (
                        <div className="text-gray-400">🔒</div>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Plant Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
          <div className="text-lg font-bold text-green-600">{plant.health}%</div>
          <div className="text-xs text-gray-500">Health</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
          <div className="text-lg font-bold text-blue-600">{plant.waterLevel}%</div>
          <div className="text-xs text-gray-500">Water</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
          <div className="text-lg font-bold text-purple-600">{plant.level}</div>
          <div className="text-xs text-gray-500">Level</div>
        </div>
        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center">
          <div className="text-lg font-bold text-orange-600">{plant.experience}</div>
          <div className="text-xs text-gray-500">XP</div>
        </div>
      </div>

      {/* Stage Info */}
      {isAlive && currentStageConfig && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center justify-between text-sm flex-wrap gap-2">
            <span className="text-gray-600">Current Stage:</span>
            <span className="font-semibold text-green-700">
              {currentStageConfig.icon} {currentStageConfig.label}
            </span>
            <span className="text-gray-600">
              {currentStageIndex + 1} / {stageMilestones.length}
            </span>
            <span className="text-xs text-gray-500">
              Health: {plant.health}% • XP: {plant.experience}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}