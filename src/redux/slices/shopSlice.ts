// store/features/shop/shopSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/utils/api'
import { showErrorToast, showSuccessToast, showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'

export interface Transaction {
  id: string
  amount: number
  type: 'daily_checkin' | 'purchase_pot' | 'water_bonus'
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

export const dailyCheckin = createAsyncThunk(
  'shop/dailyCheckin',
  async () => {
    const response = await api.post('/shop/checkin')
    return response.data
  }
)

export const buyPot = createAsyncThunk(
  'shop/buyPot',
  async (potType: PotType) => {
    const response = await api.post('/shop/buy-pot', { potType })
    return response.data
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
        state.coins = action.payload.coins
        state.error = null
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch balance'
      })

      // Daily Checkin
      .addCase(dailyCheckin.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(dailyCheckin.fulfilled, (state, action) => {
        state.isLoading = false
        state.coins += action.payload.coins
        state.successMessage = action.payload.message
        state.lastCheckinDate = new Date().toISOString()
        showSuccessToast(`✅ ${action.payload.message} (+${action.payload.coins} coins)`)
      })
      .addCase(dailyCheckin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to check in'
        showErrorToast(state.error || 'Failed to check in')
      })

      // Buy Pot
      .addCase(buyPot.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(buyPot.fulfilled, (state, action) => {
        state.isLoading = false
        state.successMessage = action.payload.message
        showSuccessToast(`✨ ${action.payload.message}`)
      })
      .addCase(buyPot.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to purchase pot'
        showErrorToast(state.error || 'Failed to purchase pot')
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