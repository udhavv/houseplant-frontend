// // store/features/plant/plantSlice.ts
// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// import { api } from '@/utils/api'
// import { showErrorToast, showSuccessToast, showLoadingToast } from '@/utils/toast'
// import toast from 'react-hot-toast'

// export interface Plant {
//   id: string
//   name: string
//   health: number
//   waterLevel: number
//   lastWateredAt: string
//   isAlive: boolean
//   potType: 'basic' | 'ceramic' | 'golden'
//   createdAt: string
//   userId: string
// }

// export interface PlantState {
//   plant: Plant | null
//   isLoading: boolean
//   error: string | null
//   successMessage: string | null
//   bonusCoins: number
// }

// const initialState: PlantState = {
//   plant: null,
//   isLoading: false,
//   error: null,
//   successMessage: null,
//   bonusCoins: 0,
// }

// // Async Thunks
// export const fetchPlant = createAsyncThunk(
//   'plant/fetchPlant',
//   async () => {
//     const response = await api.get('/plant')
//     return response.data
//   }
// )

// export const waterPlant = createAsyncThunk(
//   'plant/waterPlant',
//   async () => {
//     const response = await api.post('/plant/water')
//     return response.data
//   }
// )

// export const resetPlant = createAsyncThunk(
//   'plant/resetPlant',
//   async () => {
//     const response = await api.post('/plant/reset')
//     return response.data
//   }
// )

// // export const updatePlantName = createAsyncThunk(
// //   'plant/updatePlantName',
// //   async (name: string) => {
// //     const response = await api.put('/plant/name', { name })
// //     return response.data
// //   }
// // )

// const plantSlice = createSlice({
//   name: 'plant',
//   initialState,
//   reducers: {
//     clearPlantError: (state) => {
//       state.error = null
//     },
//     clearPlantSuccess: (state) => {
//       state.successMessage = null
//     },
//     clearBonusCoins: (state) => {
//       state.bonusCoins = 0
//     },
//     updatePlantHealth: (state, action: PayloadAction<number>) => {
//       if (state.plant) {
//         state.plant.health = Math.min(100, Math.max(0, action.payload))
//       }
//     },
//     updatePlantWaterLevel: (state, action: PayloadAction<number>) => {
//       if (state.plant) {
//         state.plant.waterLevel = Math.min(100, Math.max(0, action.payload))
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Plant
//       .addCase(fetchPlant.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchPlant.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.plant = action.payload
//         state.error = null
//       })
//       .addCase(fetchPlant.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.error.message || 'Failed to fetch plant data'
//       })

//       // Water Plant
//       .addCase(waterPlant.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//         state.bonusCoins = 0
//       })
//       .addCase(waterPlant.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.plant = action.payload.plant
//         state.bonusCoins = action.payload.bonusCoins || 0
//         state.successMessage = action.payload.message
//         if (action.payload.bonusCoins > 0) {
//           showSuccessToast(`🌿 Bonus +${action.payload.bonusCoins} coins for consistent watering!`)
//         } else {
//           showSuccessToast('💧 Plant watered!')
//         }
//       })
//       .addCase(waterPlant.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.error.message || 'Failed to water plant'
//         showErrorToast(state.error || 'Failed to water plant')
//       })

//       // Reset Plant
//       .addCase(resetPlant.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(resetPlant.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.plant = action.payload.plant
//         state.successMessage = action.payload.message
//         showSuccessToast('🌱 New plant sprouted!')
//       })
//       .addCase(resetPlant.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.error.message || 'Failed to reset plant'
//         showErrorToast(state.error || 'Failed to reset plant')
//       })

//       // Update Plant Name
//       // .addCase(updatePlantName.fulfilled, (state, action) => {
//       //   if (state.plant) {
//       //     state.plant.name = action.payload.name
//       //   }
//       //   state.successMessage = 'Plant name updated successfully!'
//       //   showSuccessToast('🌿 Plant name updated!')
//       // })
//       // .addCase(updatePlantName.rejected, (state, action) => {
//       //   state.error = action.error.message || 'Failed to update plant name'
//       //   showErrorToast(state.error || 'Failed to update plant name')
//       // })
//   },
// })

// export const {
//   clearPlantError,
//   clearPlantSuccess,
//   clearBonusCoins,
//   updatePlantHealth,
//   updatePlantWaterLevel,
// } = plantSlice.actions

// export default plantSlice.reducer









// store/features/plant/plantSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/utils/api'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import { Plant, PlantMilestone, PlantCareLog } from '@/types'

export interface PlantState {
  plant: Plant | null
  milestones: PlantMilestone[]
  careLogs: PlantCareLog[]
  isLoading: boolean
  error: string | null
  successMessage: string | null
  bonusCoins: number
  bonusXP: number
  stageAdvanced: boolean
  isWatering: boolean
  isFertilizing: boolean
  isPruning: boolean
  isRepotting: boolean
  hasPlant: boolean
  isAlive: boolean
  needsReset: boolean
  statusMessage: string | null
}

const initialState: PlantState = {
  plant: null,
  milestones: [],
  careLogs: [],
  isLoading: false,
  error: null,
  successMessage: null,
  bonusCoins: 0,
  bonusXP: 0,
  stageAdvanced: false,
  isWatering: false,
  isFertilizing: false,
  isPruning: false,
  isRepotting: false,
  hasPlant: false,
  isAlive: false,
  needsReset: false,
  statusMessage: null,
}

// ====== ALL THUNKS WITH rejectWithValue ======

export const fetchPlant = createAsyncThunk(
  'plant/fetchPlant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/plant/state')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to fetch plant',
      })
    }
  }
)

export const checkPlantStatus = createAsyncThunk(
  'plant/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/plant/status')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to check plant status',
      })
    }
  }
)

export const waterPlant = createAsyncThunk(
  'plant/waterPlant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/plant/water')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to water plant',
      })
    }
  }
)

export const fertilizePlant = createAsyncThunk(
  'plant/fertilizePlant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/plant/fertilize')
      return response.data
    } catch (error: any) {
      // ====== FIX: Preserve the error response ======
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to fertilize plant',
      })
    }
  }
)

export const prunePlant = createAsyncThunk(
  'plant/prunePlant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/plant/prune')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to prune plant',
      })
    }
  }
)

export const repotPlant = createAsyncThunk(
  'plant/repotPlant',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/plant/repot')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to repot plant',
      })
    }
  }
)

export const resetPlant = createAsyncThunk(
  'plant/resetPlant',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/plant/reset')
      // After reset, fetch the updated plant state
      await dispatch(fetchPlant())
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to reset plant',
      })
    }
  }
)

export const updatePlantName = createAsyncThunk(
  'plant/updatePlantName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await api.put('/plant/name', { name })
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to update plant name',
      })
    }
  }
)

export const fetchPlantMilestones = createAsyncThunk(
  'plant/fetchPlantMilestones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/plant/milestones')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to fetch milestones',
      })
    }
  }
)

export const fetchPlantCareLogs = createAsyncThunk(
  'plant/fetchPlantCareLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/plant/care-logs')
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to fetch care logs',
      })
    }
  }
)

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
    clearBonus: (state) => {
      state.bonusCoins = 0
      state.bonusXP = 0
      state.stageAdvanced = false
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
    resetActionStates: (state) => {
      state.isWatering = false
      state.isFertilizing = false
      state.isPruning = false
      state.isRepotting = false
    },
    clearStatus: (state) => {
      state.statusMessage = null
      state.needsReset = false
    },
    setPlant: (state, action: PayloadAction<Plant | null>) => {
      state.plant = action.payload
      if (action.payload) {
        state.hasPlant = true
        state.isAlive = action.payload.isAlive
        state.needsReset = !action.payload.isAlive
      } else {
        state.hasPlant = false
        state.isAlive = false
        state.needsReset = false
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ====== Check Plant Status ======
      .addCase(checkPlantStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(checkPlantStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.hasPlant = action.payload.hasPlant
        state.isAlive = action.payload.isAlive
        state.needsReset = !action.payload.isAlive && action.payload.hasPlant
        state.statusMessage = action.payload.message
        
        if (action.payload.plant) {
          state.plant = action.payload.plant
        }
        state.error = null
      })
      .addCase(checkPlantStatus.rejected, (state, action) => {
        state.isLoading = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to check plant status'
      })

      // ====== Fetch Plant ======
      .addCase(fetchPlant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlant.fulfilled, (state, action) => {
        state.isLoading = false
        const plantData = action.payload.plant || action.payload
        state.plant = plantData
        state.hasPlant = true
        state.isAlive = plantData.isAlive
        state.needsReset = !plantData.isAlive
        state.error = null
        
        if (action.payload.stageAdvancement) {
          state.stageAdvanced = true
          state.bonusCoins = action.payload.rewards?.coins || 0
          state.bonusXP = action.payload.rewards?.experience || 0
        }
        
        if (action.payload.message && !action.payload.stageAdvancement) {
          state.statusMessage = action.payload.message
        }
      })
      .addCase(fetchPlant.rejected, (state, action) => {
        state.isLoading = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to fetch plant data'
      })

      // ====== Water Plant ======
      .addCase(waterPlant.pending, (state) => {
        state.isWatering = true
        state.error = null
        state.bonusCoins = 0
        state.bonusXP = 0
        state.stageAdvanced = false
      })
      .addCase(waterPlant.fulfilled, (state, action) => {
        state.isWatering = false
        state.plant = action.payload.plant
        state.hasPlant = true
        state.isAlive = action.payload.plant.isAlive
        state.needsReset = !action.payload.plant.isAlive
        state.bonusCoins = action.payload.bonusCoins || 0
        state.bonusXP = action.payload.bonusXP || 0
        state.stageAdvanced = action.payload.stageAdvanced || false
        state.successMessage = action.payload.message
      })
      .addCase(waterPlant.rejected, (state, action) => {
        state.isWatering = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to water plant'
      })

      // ====== Fertilize Plant ======
      .addCase(fertilizePlant.pending, (state) => {
        state.isFertilizing = true
        state.error = null
      })
      .addCase(fertilizePlant.fulfilled, (state, action) => {
        state.isFertilizing = false
        state.plant = action.payload.plant
        state.hasPlant = true
        state.isAlive = action.payload.plant.isAlive
        state.needsReset = !action.payload.plant.isAlive
        state.successMessage = action.payload.message
      })
      .addCase(fertilizePlant.rejected, (state, action) => {
        state.isFertilizing = false
        // ====== FIX: Extract error message from payload ======
        const payload = action.payload as any
        if (payload?.message) {
          state.error = payload.message
        } else if (payload?.error) {
          state.error = payload.error
        } else {
          state.error = action.error.message || 'Failed to fertilize plant'
        }
      })

      // ====== Prune Plant ======
      .addCase(prunePlant.pending, (state) => {
        state.isPruning = true
        state.error = null
      })
      .addCase(prunePlant.fulfilled, (state, action) => {
        state.isPruning = false
        state.plant = action.payload.plant
        state.hasPlant = true
        state.isAlive = action.payload.plant.isAlive
        state.needsReset = !action.payload.plant.isAlive
        state.successMessage = action.payload.message
      })
      .addCase(prunePlant.rejected, (state, action) => {
        state.isPruning = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to prune plant'
      })

      // ====== Repot Plant ======
      .addCase(repotPlant.pending, (state) => {
        state.isRepotting = true
        state.error = null
      })
      .addCase(repotPlant.fulfilled, (state, action) => {
        state.isRepotting = false
        state.plant = action.payload.plant
        state.hasPlant = true
        state.isAlive = action.payload.plant.isAlive
        state.needsReset = !action.payload.plant.isAlive
        state.successMessage = action.payload.message
      })
      .addCase(repotPlant.rejected, (state, action) => {
        state.isRepotting = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to repot plant'
      })

      // ====== Reset Plant ======
      .addCase(resetPlant.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.needsReset = false
      })
      .addCase(resetPlant.fulfilled, (state, action) => {
        state.isLoading = false
        state.plant = action.payload.plant
        state.hasPlant = true
        state.isAlive = true
        state.needsReset = false
        state.successMessage = action.payload.message
        state.milestones = []
        state.careLogs = []
        state.bonusCoins = 0
        state.bonusXP = 0
        state.stageAdvanced = false
      })
      .addCase(resetPlant.rejected, (state, action) => {
        state.isLoading = false
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to reset plant'
      })

      // ====== Update Plant Name ======
      .addCase(updatePlantName.fulfilled, (state, action) => {
        if (state.plant) {
          state.plant.name = action.payload.plant.name
        }
        state.successMessage = 'Plant name updated successfully!'
      })
      .addCase(updatePlantName.rejected, (state, action) => {
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to update plant name'
      })

      // ====== Fetch Milestones ======
      .addCase(fetchPlantMilestones.fulfilled, (state, action) => {
        state.milestones = action.payload.milestones || []
      })
      .addCase(fetchPlantMilestones.rejected, (state, action) => {
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to fetch milestones'
      })

      // ====== Fetch Care Logs ======
      .addCase(fetchPlantCareLogs.fulfilled, (state, action) => {
        state.careLogs = action.payload.logs || []
      })
      .addCase(fetchPlantCareLogs.rejected, (state, action) => {
        const payload = action.payload as any
        state.error = payload?.message || action.error.message || 'Failed to fetch care logs'
      })
  },
})

export const {
  clearPlantError,
  clearPlantSuccess,
  clearBonus,
  updatePlantHealth,
  updatePlantWaterLevel,
  resetActionStates,
  clearStatus,
  setPlant,
} = plantSlice.actions

export default plantSlice.reducer