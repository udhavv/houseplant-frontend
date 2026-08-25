// src/utils/selectors.ts
import { RootState } from '@/redux/store'
import { PlantState } from '@/redux/slices/plantSlice'
import { PLANT_STAGES_CONFIG } from '@/types'

// Base selectors
export const selectPlant = (state: RootState) => state.plant.plant
export const selectPlantLoading = (state: RootState) => state.plant.isLoading
export const selectPlantError = (state: RootState) => state.plant.error
export const selectPlantSuccess = (state: RootState) => state.plant.successMessage
export const selectMilestones = (state: RootState) => state.plant.milestones
export const selectCareLogs = (state: RootState) => state.plant.careLogs

// Status selectors
export const selectHasPlant = (state: RootState) => state.plant.hasPlant
export const selectIsAlive = (state: RootState) => state.plant.isAlive
export const selectNeedsReset = (state: RootState) => state.plant.needsReset
export const selectStatusMessage = (state: RootState) => state.plant.statusMessage

// Action state selectors
export const selectIsWatering = (state: RootState) => state.plant.isWatering
export const selectIsFertilizing = (state: RootState) => state.plant.isFertilizing
export const selectIsPruning = (state: RootState) => state.plant.isPruning
export const selectIsRepotting = (state: RootState) => state.plant.isRepotting

// Bonus selectors
export const selectBonusCoins = (state: RootState) => state.plant.bonusCoins
export const selectBonusXP = (state: RootState) => state.plant.bonusXP
export const selectStageAdvanced = (state: RootState) => state.plant.stageAdvanced

// Derived selectors
export const selectPlantStageConfig = (state: RootState) => {
  const plant = selectPlant(state)
  if (!plant) return null
  return PLANT_STAGES_CONFIG[plant.growthStage as keyof typeof PLANT_STAGES_CONFIG] || null
}

export const selectPlantHealthStatus = (state: RootState) => {
  const plant = selectPlant(state)
  if (!plant) return 'unknown'
  if (plant.health > 70) return 'healthy'
  if (plant.health > 40) return 'moderate'
  return 'critical'
}

export const selectPlantWaterStatus = (state: RootState) => {
  const plant = selectPlant(state)
  if (!plant) return 'unknown'
  if (plant.waterLevel > 60) return 'good'
  if (plant.waterLevel > 30) return 'moderate'
  return 'critical'
}

export const selectIsPlantDead = (state: RootState) => {
  const plant = selectPlant(state)
  return !plant || !plant.isAlive || plant.health <= 0
}

export const selectCanWater = (state: RootState) => {
  const plant = selectPlant(state)
  return !!(plant && plant.isAlive && !selectIsWatering(state))
}

export const selectCanFertilize = (state: RootState) => {
  const plant = selectPlant(state)
  return !!(plant && plant.isAlive && !selectIsFertilizing(state))
}

export const selectCanPrune = (state: RootState) => {
  const plant = selectPlant(state)
  return !!(plant && plant.isAlive && !selectIsPruning(state))
}

export const selectCanRepot = (state: RootState) => {
  const plant = selectPlant(state)
  return !!(plant && plant.isAlive && !selectIsRepotting(state))
}