// components/dashboard/PlantLifeCycle.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plant, PLANT_STAGES_CONFIG, PlantStage } from '@/types'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { 
  waterPlant, 
  fertilizePlant, 
  prunePlant, 
  repotPlant, 
  clearBonus, 
  resetPlant,
  fetchPlant
} from '@/redux/slices/plantSlice'
import { 
  showLoadingToast, 
  showSuccessToast, 
  showErrorToast, 
  dismissToast 
} from '@/utils/toast'

interface PlantLifeCycleProps {
  plant: Plant
  onActionComplete?: () => void
  onResetComplete?: () => void
}

const stageOrder: PlantStage[] = ['seed', 'sprout', 'seedling', 'young', 'mature', 'flowering', 'fruiting']

export function PlantLifeCycle({ plant, onActionComplete, onResetComplete }: PlantLifeCycleProps) {
  const dispatch = useAppDispatch()
  
  const isWatering = useAppSelector((state) => state.plant.isWatering)
  const isFertilizing = useAppSelector((state) => state.plant.isFertilizing)
  const isPruning = useAppSelector((state) => state.plant.isPruning)
  const isRepotting = useAppSelector((state) => state.plant.isRepotting)
  const bonusCoins = useAppSelector((state) => state.plant.bonusCoins)
  const bonusXP = useAppSelector((state) => state.plant.bonusXP)
  const stageAdvanced = useAppSelector((state) => state.plant.stageAdvanced)
  
  const [activeStage, setActiveStage] = useState<PlantStage>('seed')
  const [progress, setProgress] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [showBonus, setShowBonus] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [isDead, setIsDead] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Determine if plant is dead
  useEffect(() => {
    const isPlantDead = !plant?.isAlive || (plant?.health !== undefined && plant.health <= 0)
    setIsDead(isPlantDead)
  }, [plant])

  // Update active stage and progress
  useEffect(() => {
    if (plant && plant.growthStage) {
      const stage = plant.growthStage as PlantStage
      if (stage in PLANT_STAGES_CONFIG) {
        setActiveStage(stage)
      } else {
        setActiveStage('seed')
      }
    } else {
      setActiveStage('seed')
    }

    // ====== FIX: Calculate progress for current stage ======
    if (plant && !isDead) {
      const currentStageIndex = stageOrder.indexOf(plant.growthStage as PlantStage || 'seed')
      const nextStage = stageOrder[currentStageIndex + 1]
      
      if (nextStage && PLANT_STAGES_CONFIG[nextStage]) {
        const nextStageConfig = PLANT_STAGES_CONFIG[nextStage]
        const currentStageConfig = PLANT_STAGES_CONFIG[plant.growthStage as PlantStage || 'seed']
        
        if (currentStageConfig && nextStageConfig) {
          const healthProgress = Math.max(0, Math.min(1, 
            (plant.health - currentStageConfig.healthRange[0]) / 
            (nextStageConfig.healthRange[0] - currentStageConfig.healthRange[0])
          ))
          const expProgress = Math.max(0, Math.min(1,
            (plant.experience - currentStageConfig.experienceRequired) / 
            (nextStageConfig.experienceRequired - currentStageConfig.experienceRequired)
          ))
          
          const avgProgress = (healthProgress + expProgress) / 2
          setProgress(Math.min(100, Math.max(0, avgProgress * 100)))
        }
      } else {
        setProgress(100)
      }

      // ====== FIX: Calculate overall progress across all stages ======
      const totalStages = stageOrder.length
      const currentIndex = stageOrder.indexOf(plant.growthStage as PlantStage || 'seed')
      
      // Base progress: stages completed / total stages
      const stageBaseProgress = (currentIndex / (totalStages - 1)) * 100
      
      // Progress within current stage
      let withinStageProgress = 0
      const nextStageIndex = currentIndex + 1
      
      if (nextStageIndex < totalStages) {
        const nextStageConfig = PLANT_STAGES_CONFIG[stageOrder[nextStageIndex]]
        const currentStageConfig = PLANT_STAGES_CONFIG[stageOrder[currentIndex]]
        
        if (currentStageConfig && nextStageConfig) {
          const healthProgress = Math.max(0, Math.min(1, 
            (plant.health - currentStageConfig.healthRange[0]) / 
            (nextStageConfig.healthRange[0] - currentStageConfig.healthRange[0])
          ))
          const expProgress = Math.max(0, Math.min(1,
            (plant.experience - currentStageConfig.experienceRequired) / 
            (nextStageConfig.experienceRequired - currentStageConfig.experienceRequired)
          ))
          withinStageProgress = ((healthProgress + expProgress) / 2) * (100 / (totalStages - 1))
        }
      } else {
        withinStageProgress = 100 / (totalStages - 1)
      }
      
      // Total overall progress
      const totalProgress = Math.min(100, stageBaseProgress + withinStageProgress)
      setOverallProgress(Math.min(100, Math.max(0, totalProgress)))
    } else {
      setProgress(0)
      setOverallProgress(0)
    }
  }, [plant, isDead])

  // Show bonus notification
  useEffect(() => {
    if (bonusCoins > 0 || bonusXP > 0 || stageAdvanced) {
      setShowBonus(true)
      const timer = setTimeout(() => {
        setShowBonus(false)
        dispatch(clearBonus())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [bonusCoins, bonusXP, stageAdvanced, dispatch])

  const currentStageConfig = PLANT_STAGES_CONFIG[activeStage] || PLANT_STAGES_CONFIG.seed
  const currentStageIndex = stageOrder.indexOf(activeStage)
  
  const healthStatus = plant?.health > 70 ? 'healthy' : plant?.health > 40 ? 'moderate' : 'critical'
  const waterStatus = plant?.waterLevel > 60 ? 'good' : plant?.waterLevel > 30 ? 'moderate' : 'critical'

  const getHealthColor = () => {
    if (!plant) return 'text-gray-600'
    if (plant.health > 70) return 'text-green-600'
    if (plant.health > 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleAction = async (action: 'water' | 'fertilize' | 'prune' | 'repot') => {
    if (!plant) {
      showErrorToast('Plant data not available')
      return
    }

    if (isDead) {
      showErrorToast('💀 Your plant is dead! Please reset it to start a new one.')
      return
    }

    setSelectedAction(action)
    const loadingToast = showLoadingToast('Processing...')

    try {
      let result
      switch (action) {
        case 'water':
          result = await dispatch(waterPlant()).unwrap()
          break
        case 'fertilize':
          result = await dispatch(fertilizePlant()).unwrap()
          break
        case 'prune':
          result = await dispatch(prunePlant()).unwrap()
          break
        case 'repot':
          result = await dispatch(repotPlant()).unwrap()
          break
      }
      
      dismissToast(loadingToast)
      
      if (result?.message) {
        showSuccessToast(result.message)
      }
      
      if (onActionComplete) {
        onActionComplete()
      }
    } catch (error: any) {
      dismissToast(loadingToast)
      
      let errorMessage = `Failed to ${action} plant`
      
      if (error?.response?.data) {
        const data = error.response.data
        if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = data.error
        }
      } else if (error?.payload) {
        if (error.payload.message) {
          errorMessage = error.payload.message
        } else if (error.payload.error) {
          errorMessage = error.payload.error
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      showErrorToast(errorMessage)
      
      console.error('Action error:', {
        action,
        error,
        message: errorMessage
      })
    } finally {
      setSelectedAction(null)
    }
  }

  const handleResetPlant = async () => {
    if (isResetting) return
    
    setIsResetting(true)
    const loadingToast = showLoadingToast('🔄 Resetting plant...')
    
    try {
      const result = await dispatch(resetPlant()).unwrap()
      dismissToast(loadingToast)
      
      if (result?.message) {
        showSuccessToast(result.message)
      } else {
        showSuccessToast('🌱 Plant reset successfully!')
      }
      
      await dispatch(fetchPlant())
      
      if (onResetComplete) {
        onResetComplete()
      }
    } catch (error: any) {
      dismissToast(loadingToast)
      
      let errorMessage = 'Failed to reset plant'
      
      if (error?.response?.data) {
        const data = error.response.data
        if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = data.error
        }
      } else if (error?.payload?.message) {
        errorMessage = error.payload.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      showErrorToast(errorMessage)
    } finally {
      setIsResetting(false)
    }
  }

  const getStageIcon = (stage: PlantStage) => {
    return PLANT_STAGES_CONFIG[stage]?.icon || '🌱'
  }

  const getStageLabel = (stage: PlantStage) => {
    return PLANT_STAGES_CONFIG[stage]?.label || stage
  }

  const isStageReached = (stage: PlantStage) => {
    return stageOrder.indexOf(stage) <= currentStageIndex
  }

  const isStageCurrent = (stage: PlantStage) => {
    return stage === activeStage
  }

  const getStageColor = (stage: PlantStage) => {
    return PLANT_STAGES_CONFIG[stage]?.color || 'from-green-200 to-green-400'
  }

  // If plant is dead, show death message
  if (isDead || !plant) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8"
      >
        <div className="text-center py-12">
          <div className="text-8xl mb-6">💀</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Your Plant Has Died
          </h2>
          <p className="text-gray-600 mb-2">
            Health reached 0. Don't worry! You can reset your plant and start fresh.
          </p>
          {plant && (
            <div className="text-sm text-gray-500 mb-6 space-y-1">
              <p>🌱 Lived for {plant.daysOld || 0} days</p>
              <p>⭐ Reached level {plant.level || 1}</p>
              <p>🏷️ {plant.name || 'Sprout'}</p>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetPlant}
            disabled={isResetting}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Resetting...
              </span>
            ) : (
              '🌱 Reset Plant'
            )}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8"
    >
      {/* Header with Plant Info */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{currentStageConfig.icon || '🌱'}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {plant?.name || 'Sprout'}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              <span>Level {plant?.level || 1}</span>
              <span>•</span>
              <span>Day {plant?.daysOld || 0}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                plant?.isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {plant?.isAlive ? 'Alive' : 'Deceased'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Experience Progress */}
        <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-xl">
          <span className="text-xl">⭐</span>
          <div>
            <div className="text-sm font-medium text-gray-700">Experience</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-purple-600">{plant?.experience || 0}</span>
              <span className="text-xs text-gray-500">/ {(plant?.level || 1) * 200}</span>
              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((plant?.experience || 0) / ((plant?.level || 1) * 200)) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonus Notification */}
      <AnimatePresence>
        {showBonus && (bonusCoins > 0 || bonusXP > 0 || stageAdvanced) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 shadow-lg"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  {stageAdvanced && (
                    <p className="text-sm font-semibold text-green-700">
                      🌱 Stage Advanced! You're now in the {getStageLabel(activeStage)} stage!
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    {bonusCoins > 0 && (
                      <span className="text-yellow-600 font-medium">🪙 +{bonusCoins} coins</span>
                    )}
                    {bonusXP > 0 && (
                      <span className="text-purple-600 font-medium">⭐ +{bonusXP} XP</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBonus(false)
                  dispatch(clearBonus())
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Visualization */}
      <div className="relative">
        {/* Central Plant Display */}
        <motion.div
          key={activeStage}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex justify-center items-center mb-8"
        >
          <div className="relative">
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
              className={`absolute inset-0 bg-gradient-to-r ${currentStageConfig.color || 'from-green-200 to-green-400'} rounded-full blur-3xl opacity-20`}
            />
            
            <motion.div
              animate={{
                y: plant?.isAlive ? [0, -5, 0] : [0, 2, 0],
                rotate: plant?.isAlive ? [0, 2, -2, 0] : [0, -5, 5, 0],
              }}
              transition={{
                duration: plant?.isAlive ? 3 : 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-8xl relative z-10"
            >
              {currentStageConfig.icon || '🌱'}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4"
            >
              <span className="text-lg font-semibold text-gray-900">
                {currentStageConfig.label || 'Seed'}
              </span>
              {currentStageConfig.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentStageConfig.description}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* ====== FIX: Overall Progress Bar - Full Lifecycle ====== */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>🌰 Seed</span>
            <span className="font-medium text-green-600">
              {Math.round(overallProgress)}% Complete
            </span>
            <span>🍎 Fruiting</span>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-300 via-green-500 to-green-700 rounded-full"
            >
              {/* Progress Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
            </motion.div>
            
            {/* Stage Markers on Progress Bar */}
            {stageOrder.map((stage, index) => {
              const position = (index / (stageOrder.length - 1)) * 100
              const isReached = index <= currentStageIndex
              return (
                <div
                  key={stage}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div className={`w-2 h-2 rounded-full ${isReached ? 'bg-white' : 'bg-gray-400'} border-2 ${isReached ? 'border-green-600' : 'border-gray-300'}`} />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Stage {currentStageIndex + 1} of {stageOrder.length}</span>
            <span>{getStageLabel(activeStage)}</span>
          </div>
        </div>

        {/* Current Stage Progress (To Next Stage) */}
        <div className="mb-4 p-2 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress to next stage</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${currentStageConfig.color || 'from-green-200 to-green-400'} rounded-full`}
            />
          </div>
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3 mb-6">
          {stageOrder.map((stageId) => {
            const isReached = isStageReached(stageId)
            const isCurrent = isStageCurrent(stageId)
            const stageConfig = PLANT_STAGES_CONFIG[stageId]

            if (!stageConfig) return null

            return (
              <motion.div
                key={stageId}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 md:p-3 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                  isCurrent
                    ? `bg-gradient-to-r ${stageConfig.color} shadow-lg scale-105`
                    : isReached
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-50 hover:bg-gray-100 opacity-50'
                }`}
              >
                {isCurrent && (
                  <motion.div
                    layoutId="activeStage"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <div className="relative z-10">
                  <div className="text-xl md:text-2xl mb-1">{stageConfig.icon}</div>
                  <div className="text-[10px] md:text-xs font-medium text-gray-700">{stageConfig.label}</div>
                  {isCurrent && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full mx-auto"
                    />
                  )}
                  {isReached && !isCurrent && (
                    <div className="mt-1 text-green-500 text-[10px]">✓</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('water')}
            disabled={!plant?.isAlive || isWatering}
            className="relative p-3 rounded-xl text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWatering ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <div className="text-2xl mb-1">💧</div>
                <div className="text-sm font-medium">Water</div>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('fertilize')}
            disabled={!plant?.isAlive || isFertilizing}
            className="relative p-3 rounded-xl text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFertilizing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <div className="text-2xl mb-1">🌿</div>
                <div className="text-sm font-medium">Fertilize</div>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('prune')}
            disabled={!plant?.isAlive || isPruning}
            className="relative p-3 rounded-xl text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPruning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <div className="text-2xl mb-1">✂️</div>
                <div className="text-sm font-medium">Prune</div>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAction('repot')}
            disabled={!plant?.isAlive || isRepotting}
            className="relative p-3 rounded-xl text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRepotting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <div className="text-2xl mb-1">🏺</div>
                <div className="text-sm font-medium">Repot</div>
              </>
            )}
          </motion.button>
        </div>

        {/* Health & Water Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
          >
            <div className="text-2xl">💚</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Health</div>
                <div className={`text-sm font-semibold ${getHealthColor()}`}>
                  {plant?.health || 0}%
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${plant?.health || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    (plant?.health || 0) > 70 ? 'bg-green-500' : 
                    (plant?.health || 0) > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div className="text-xs capitalize text-gray-500 mt-0.5">
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
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">Water</div>
                <div className="text-sm font-semibold text-blue-600">
                  {plant?.waterLevel || 0}%
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${plant?.waterLevel || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${
                    (plant?.waterLevel || 0) > 60 ? 'bg-blue-500' : 
                    (plant?.waterLevel || 0) > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div className="text-xs capitalize text-gray-500 mt-0.5">
                {waterStatus}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pot Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>🏺 Pot:</span>
          <span className="font-medium capitalize">{plant?.potType || 'basic'}</span>
          <span className="text-gray-300">|</span>
          <span>⭐ Level {plant?.level || 1}</span>
          <span className="text-gray-300">|</span>
          <span>🌱 Stage {currentStageConfig.label || 'Seed'}</span>
        </div>
      </div>
    </motion.div>
  )
}