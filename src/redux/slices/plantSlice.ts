// store/features/plant/plantSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/utils/api'
import { showErrorToast, showSuccessToast, showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'

export interface Plant {
  id: string
  name: string
  health: number
  waterLevel: number
  lastWateredAt: string
  isAlive: boolean
  potType: 'basic' | 'ceramic' | 'golden'
  createdAt: string
  userId: string
}

export interface PlantState {
  plant: Plant | null
  isLoading: boolean
  error: string | null
  successMessage: string | null
  bonusCoins: number
}

const initialState: PlantState = {
  plant: null,
  isLoading: false,
  error: null,
  successMessage: null,
  bonusCoins: 0,
}

// Async Thunks
export const fetchPlant = createAsyncThunk(
  'plant/fetchPlant',
  async () => {
    const response = await api.get('/plant')
    return response.data
  }
)

export const waterPlant = createAsyncThunk(
  'plant/waterPlant',
  async () => {
    const response = await api.post('/plant/water')
    return response.data
  }
)

export const resetPlant = createAsyncThunk(
  'plant/resetPlant',
  async () => {
    const response = await api.post('/plant/reset')
    return response.data
  }
)

// export const updatePlantName = createAsyncThunk(
//   'plant/updatePlantName',
//   async (name: string) => {
//     const response = await api.put('/plant/name', { name })
//     return response.data
//   }
// )

const plantSlice = createSlice({
  name: 'plant',
  initialState,
  reducers: {
    clearPlantError: (state) => {
      state.error = null
    },
    clearPlantSuccess: (state) => {
      state.successMessage = null
    },
    clearBonusCoins: (state) => {
      state.bonusCoins = 0
    },
    updatePlantHealth: (state, action: PayloadAction<number>) => {
      if (state.plant) {
        state.plant.health = Math.min(100, Math.max(0, action.payload))
      }
    },
    updatePlantWaterLevel: (state, action: PayloadAction<number>) => {
      if (state.plant) {
        state.plant.waterLevel = Math.min(100, Math.max(0, action.payload))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plant
      .addCase(fetchPlant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlant.fulfilled, (state, action) => {
        state.isLoading = false
        state.plant = action.payload
        state.error = null
      })
      .addCase(fetchPlant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch plant data'
      })

      // Water Plant
      .addCase(waterPlant.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.bonusCoins = 0
      })
      .addCase(waterPlant.fulfilled, (state, action) => {
        state.isLoading = false
        state.plant = action.payload.plant
        state.bonusCoins = action.payload.bonusCoins || 0
        state.successMessage = action.payload.message
        if (action.payload.bonusCoins > 0) {
          showSuccessToast(`🌿 Bonus +${action.payload.bonusCoins} coins for consistent watering!`)
        } else {
          showSuccessToast('💧 Plant watered!')
        }
      })
      .addCase(waterPlant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to water plant'
        showErrorToast(state.error || 'Failed to water plant')
      })

      // Reset Plant
      .addCase(resetPlant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPlant.fulfilled, (state, action) => {
        state.isLoading = false
        state.plant = action.payload.plant
        state.successMessage = action.payload.message
        showSuccessToast('🌱 New plant sprouted!')
      })
      .addCase(resetPlant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to reset plant'
        showErrorToast(state.error || 'Failed to reset plant')
      })

      // Update Plant Name
      // .addCase(updatePlantName.fulfilled, (state, action) => {
      //   if (state.plant) {
      //     state.plant.name = action.payload.name
      //   }
      //   state.successMessage = 'Plant name updated successfully!'
      //   showSuccessToast('🌿 Plant name updated!')
      // })
      // .addCase(updatePlantName.rejected, (state, action) => {
      //   state.error = action.error.message || 'Failed to update plant name'
      //   showErrorToast(state.error || 'Failed to update plant name')
      // })
  },
})

export const {
  clearPlantError,
  clearPlantSuccess,
  clearBonusCoins,
  updatePlantHealth,
  updatePlantWaterLevel,
} = plantSlice.actions

export default plantSlice.reducer