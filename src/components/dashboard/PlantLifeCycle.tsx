// components/dashboard/PlantLifeCycle.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plant, waterPlant} from '@/redux/slices/plantSlice'
import { useAppDispatch } from '@/lib/hooks'
import { showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'

interface PlantLifeCycleProps {
  plant: Plant
  coins: number
}

const stages = [
  { id: 'seed', label: 'Seed', icon: '🌰', healthRange: [0, 20], color: 'from-amber-200 to-amber-400' },
  { id: 'sprout', label: 'Sprout', icon: '🌱', healthRange: [21, 40], color: 'from-green-200 to-green-400' },
  { id: 'seedling', label: 'Seedling', icon: '🌿', healthRange: [41, 60], color: 'from-green-300 to-green-500' },
  { id: 'young', label: 'Young Plant', icon: '🌳', healthRange: [61, 80], color: 'from-green-400 to-emerald-500' },
  { id: 'mature', label: 'Mature Plant', icon: '🌲', healthRange: [81, 100], color: 'from-emerald-400 to-teal-500' },
]

export function PlantLifeCycle({ plant, coins }: PlantLifeCycleProps) {
  const dispatch = useAppDispatch()
  const [activeStage, setActiveStage] = useState('seed')
  const [progress, setProgress] = useState(0)
  const [isWatering, setIsWatering] = useState(false)

  useEffect(() => {
    // Determine current stage based on health
    const currentStage = stages.find(s => 
      plant.health >= s.healthRange[0] && plant.health <= s.healthRange[1]
    ) || stages[0]
    setActiveStage(currentStage.id)

    // Calculate progress based on health
    const progressPercentage = (plant.health / 100) * 100
    setProgress(progressPercentage)
  }, [plant.health])

  const handleWater = async () => {
    if (isWatering) return
    setIsWatering(true)
    const loadingToast = showLoadingToast('Watering your plant...')

    try {
      await dispatch(waterPlant()).unwrap()
      toast.dismiss(loadingToast)
    } catch (error) {
      toast.dismiss(loadingToast)
    } finally {
      setIsWatering(false)
    }
  }

  const currentIndex = stages.findIndex(s => s.id === activeStage)
  const healthStatus = plant.health > 70 ? 'healthy' : plant.health > 40 ? 'moderate' : 'critical'
  const waterStatus = plant.waterLevel > 60 ? 'good' : plant.waterLevel > 30 ? 'moderate' : 'critical'

  const getHealthColor = () => {
    if (plant.health > 70) return 'text-green-600'
    if (plant.health > 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">🌱 Plant Life Cycle</h2>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {plant.isAlive ? 'Alive' : 'Needs Revival'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {plant.name} • {Math.floor((Date.now() - new Date(plant.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days old
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Health:</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${plant.health}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  plant.health > 70 ? 'bg-green-500' : plant.health > 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <span className={`text-sm font-medium ${getHealthColor()}`}>{plant.health}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Water:</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${plant.waterLevel}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className={`h-full rounded-full ${
                  plant.waterLevel > 60 ? 'bg-blue-500' : plant.waterLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-blue-600">{plant.waterLevel}%</span>
          </div>
          <button
            onClick={handleWater}
            disabled={isWatering || !plant.isAlive}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {isWatering ? '⏳' : '💧'}
            Water
          </button>
        </div>
      </div>

      {/* Stage Visualization */}
      <div className="relative">
        {/* Central Plant Display */}
        <motion.div
          key={activeStage}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex justify-center items-center mb-12"
        >
          <div className="relative">
            {/* Glow Effect */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute inset-0 bg-gradient-to-r ${stages[currentIndex].color} rounded-full blur-3xl opacity-20`}
            />
            
            {/* Plant Icon */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-8xl relative z-10"
            >
              {plant.isAlive ? stages[currentIndex].icon : '💀'}
            </motion.div>

            {/* Stage Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <span className="text-lg font-semibold text-gray-900">
                {plant.isAlive ? stages[currentIndex].label : 'Dead Plant'}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Seed</span>
            <span>Mature</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${stages[currentIndex].color} rounded-full`}
            />
            <motion.div
              animate={{
                x: [0, 10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-green-500 shadow-lg"
              style={{ left: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-5 gap-3">
          {stages.map((stage, index) => {
            const isActive = stage.id === activeStage
            const isPast = stages.findIndex(s => s.id === activeStage) > index
            const isFuture = stages.findIndex(s => s.id === activeStage) < index

            return (
              <motion.div
                key={stage.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-3 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${stage.color} shadow-lg scale-105`
                    : isPast
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-50 hover:bg-gray-100 opacity-60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeStage"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <div className="relative z-10">
                  <div className="text-2xl mb-1">{stage.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{stage.label}</div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-1 w-2 h-2 bg-green-500 rounded-full mx-auto"
                    />
                  )}
                  {isPast && !isActive && (
                    <div className="mt-1 text-green-500 text-xs">✓</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Health Indicators */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
          >
            <div className="text-2xl">💚</div>
            <div>
              <div className="text-sm font-medium text-gray-700">Health Status</div>
              <div className={`text-sm font-semibold capitalize ${getHealthColor()}`}>
                {healthStatus}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl"
          >
            <div className="text-2xl">💧</div>
            <div>
              <div className="text-sm font-medium text-gray-700">Water Status</div>
              <div className={`text-sm font-semibold capitalize ${
                waterStatus === 'good' ? 'text-blue-600' : 
                waterStatus === 'moderate' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {waterStatus}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}