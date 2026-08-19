// components/dashboard/PlantActions.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { showSuccessToast, showErrorToast, showLoadingToast } from '@/utils/toast'

const actions = [
  { 
    id: 'water', 
    label: 'Water Plant', 
    icon: '💧', 
    color: 'from-blue-500 to-blue-600',
    description: 'Give your plant a drink'
  },
  { 
    id: 'fertilize', 
    label: 'Fertilize', 
    icon: '🌿', 
    color: 'from-green-500 to-emerald-600',
    description: 'Boost growth and health'
  },
  { 
    id: 'prune', 
    label: 'Prune', 
    icon: '✂️', 
    color: 'from-purple-500 to-pink-500',
    description: 'Shape and maintain'
  },
  { 
    id: 'repot', 
    label: 'Repot', 
    icon: '🏺', 
    color: 'from-amber-500 to-orange-500',
    description: 'Give more room to grow'
  },
]

export function PlantActions() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handleAction = async (actionId: string) => {
    setIsProcessing(actionId)
    const loadingToast = showLoadingToast('Processing...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.dismiss(loadingToast)
      
      const actionMessages = {
        water: 'Plant watered successfully! 💧',
        fertilize: 'Plant fertilized! 🌿',
        prune: 'Plant pruned successfully! ✂️',
        repot: 'Plant repotted! 🏺',
      }
      
      showSuccessToast(actionMessages[actionId as keyof typeof actionMessages] || 'Action completed!')
    } catch (error) {
      toast.dismiss(loadingToast)
      showErrorToast('Failed to complete action. Please try again.')
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">🌻 Plant Care</h3>
      <p className="text-gray-600 text-sm mb-6">Take care of your plant with these actions</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction(action.id)}
            disabled={isProcessing !== null}
            className={`relative p-4 rounded-2xl text-center transition-all duration-300 ${
              isProcessing === action.id
                ? 'opacity-50 cursor-wait'
                : 'hover:shadow-lg'
            } bg-gradient-to-br ${action.color} text-white`}
          >
            {isProcessing === action.id ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-3xl"
              >
                ⏳
              </motion.div>
            ) : (
              <>
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs opacity-80 mt-1">{action.description}</div>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}