// store/features/shop/shopSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/utils/api'
import { showErrorToast, showSuccessToast, showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'

export interface Transaction {
  id: string
  amount: number
  type: 'daily_checkin' | 'purchase_pot' | 'water_bonus' | 'stage_bonus' | 'level_up_bonus'
  createdAt: string
  userId: string
}

export interface ShopState {
  coins: number
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  successMessage: string | null
  lastCheckinDate: string | null
}

const initialState: ShopState = {
  coins: 0,
  transactions: [],
  isLoading: false,
  error: null,
  successMessage: null,
  lastCheckinDate: null,
}

export const POT_PRICES = {
  basic: 0,
  ceramic: 50,
  golden: 200,
} as const

export type PotType = keyof typeof POT_PRICES

// Async Thunks
export const getBalance = createAsyncThunk(
  'shop/getBalance',
  async () => {
    const response = await api.get('/shop/balance')
    return response.data
  }
)

// ====== FIX: Proper error handling with rejectWithValue ======
export const dailyCheckin = createAsyncThunk(
  'shop/dailyCheckin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/shop/checkin')
      console.log('Daily checkin response:', response.data)
      return response.data
    } catch (error: any) {
      console.log('Daily checkin error:', error)
      console.log('Error response:', error?.response)
      console.log('Error response data:', error?.response?.data)
      
      // Return the error with rejectWithValue to preserve the response data
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to check in',
        error: error?.message || 'Unknown error'
      })
    }
  }
)

export const buyPot = createAsyncThunk(
  'shop/buyPot',
  async (potType: PotType, { rejectWithValue }) => {
    try {
      const response = await api.post('/shop/buy-pot', { potType })
      return response.data
    } catch (error: any) {
      if (error?.response?.data) {
        return rejectWithValue(error.response.data)
      }
      return rejectWithValue({
        message: error?.message || 'Failed to purchase pot',
        error: error?.message || 'Unknown error'
      })
    }
  }
)

// export const getTransactions = createAsyncThunk(
//   'shop/getTransactions',
//   async () => {
//     const response = await api.get('/shop/transactions')
//     return response.data
//   }
// )

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    clearShopError: (state) => {
      state.error = null
    },
    clearShopSuccess: (state) => {
      state.successMessage = null
    },
    addCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload
    },
    deductCoins: (state, action: PayloadAction<number>) => {
      state.coins = Math.max(0, state.coins - action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Balance
      .addCase(getBalance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.coins = action.payload.coins || 0
        state.error = null
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch balance'
      })

      // ====== FIX: Daily Checkin with proper error handling ======
      .addCase(dailyCheckin.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(dailyCheckin.fulfilled, (state, action) => {
        state.isLoading = false
        state.coins += action.payload.coins || 0
        state.successMessage = action.payload.message
        state.lastCheckinDate = new Date().toISOString()
        state.error = null
        
        // Show success toast with the message from response
        if (action.payload.message) {
          showSuccessToast(action.payload.message)
        } else {
          showSuccessToast(`✅ Daily check-in complete! +${action.payload.coins || 0} coins`)
        }
      })
      .addCase(dailyCheckin.rejected, (state, action) => {
        state.isLoading = false
        
        // ====== FIX: Extract error message from payload ======
        const payload = action.payload as any
        let errorMessage = 'Failed to check in'
        
        if (payload) {
          // Priority: message > error > string
          if (payload.message) {
            errorMessage = payload.message
          } else if (payload.error) {
            errorMessage = payload.error
          } else if (typeof payload === 'string') {
            errorMessage = payload
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message
        }
        
        state.error = errorMessage
        
        // Show error toast with the extracted message
        showErrorToast(errorMessage)
        
        console.log('Daily checkin error state:', {
          error: action.error,
          payload: payload,
          message: errorMessage
        })
      })

      // Buy Pot
      .addCase(buyPot.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(buyPot.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload.message
        state.coins = action.payload.coins || state.coins
        showSuccessToast(`✨ ${action.payload.message}`)
      })
      .addCase(buyPot.rejected, (state, action) => {
        state.isLoading = false
        
        const payload = action.payload as any
        let errorMessage = 'Failed to purchase pot'
        
        if (payload) {
          if (payload.message) {
            errorMessage = payload.message
          } else if (payload.error) {
            errorMessage = payload.error
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message
        }
        
        state.error = errorMessage
        showErrorToast(errorMessage)
      })

      // Get Transactions
      // .addCase(getTransactions.fulfilled, (state, action) => {
      //   state.transactions = action.payload
      // })
      // .addCase(getTransactions.rejected, (state, action) => {
      //   state.error = action.error.message || 'Failed to fetch transactions'
      // })
  },
})

export const {
  clearShopError,
  clearShopSuccess,
  addCoins,
  deductCoins,
} = shopSlice.actions

export default shopSlice.reducer