// components/dashboard/ShopPanel.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { buyPot, POT_PRICES, PotType } from '@/redux/slices/shopSlice'
import { showLoadingToast } from '@/utils/toast'
import toast from 'react-hot-toast'
import {showWarningToast, showErrorToast} from "@/utils/toast";

const pots = [
  { type: 'basic' as PotType, label: 'Basic Pot', icon: '🏺', price: 0, color: 'from-amber-200 to-amber-400' },
  { type: 'ceramic' as PotType, label: 'Ceramic Pot', icon: '🏺', price: 50, color: 'from-blue-200 to-blue-400' },
  { type: 'golden' as PotType, label: 'Golden Pot', icon: '🏆', price: 200, color: 'from-yellow-200 to-yellow-400' },
]

export function ShopPanel() {
  const dispatch = useAppDispatch()
  const { coins } = useAppSelector((state) => state.shop)
  const { plant } = useAppSelector((state) => state.plant)
  const [isPurchasing, setIsPurchasing] = useState<PotType | null>(null)

  const handleBuyPot = async (potType: PotType) => {
    const price = POT_PRICES[potType]
    
    if (coins < price) {
      toast.error('❌ Not enough coins!')
      return
    }

    if (plant?.potType === potType) {
      showWarningToast('⚠️ You already have this pot!')
      return
    }

    setIsPurchasing(potType)
    const loadingToast = showLoadingToast(`Purchasing ${potType} pot...`)

    try {
      await dispatch(buyPot(potType)).unwrap()
      toast.dismiss(loadingToast)
    } catch (error) {
      toast.dismiss(loadingToast)
    } finally {
      setIsPurchasing(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">🏪 Shop</h3>
          <p className="text-gray-600 text-sm mt-1">Upgrade your plant with new pots</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
          <span className="text-2xl">🪙</span>
          <span className="text-xl font-bold text-yellow-600">{coins}</span>
          <span className="text-sm text-gray-500">coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pots.map((pot, index) => {
          const isOwned = plant?.potType === pot.type
          const canAfford = coins >= pot.price
          const isActive = isPurchasing === pot.type

          return (
            <motion.div
              key={pot.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`relative p-6 rounded-2xl transition-all duration-300 ${
                isOwned
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-500'
                  : canAfford
                  ? 'bg-white hover:shadow-xl border-2 border-gray-200 hover:border-green-300'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60'
              }`}
            >
              {/* Current Pot Badge */}
              {isOwned && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  ✓ Current
                </div>
              )}

              <div className="text-center">
                <div className={`text-4xl mb-3 ${isOwned ? 'animate-bounce-slow' : ''}`}>
                  {pot.icon}
                </div>
                <h4 className="font-semibold text-gray-900">{pot.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{pot.price} coins</p>
                
                <button
                  onClick={() => handleBuyPot(pot.type)}
                  disabled={isOwned || !canAfford || isActive}
                  className={`mt-4 w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                    isOwned
                      ? 'bg-green-500 text-white cursor-default'
                      : canAfford && !isActive
                      ? `bg-gradient-to-r ${pot.color} text-gray-800 hover:shadow-lg hover:scale-105`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.div>
                  ) : isOwned ? (
                    '✓ Equipped'
                  ) : !canAfford ? (
                    'Need more coins'
                  ) : (
                    'Buy Now'
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}