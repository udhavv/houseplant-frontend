// types/index.ts
export interface User {
  id: string
  email: string
  username: string
  isEmailVerified: boolean
  createdAt?: string
  updatedAt?: string
  message?: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  password: string
}

export interface ApiError {
  error: string
  code?: string
  field?: string
  message?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  isEmailVerificationSent: boolean
  isEmailVerified: boolean
  successMessage: string | null
}





// types/index.ts
export interface Plant {
  id: string
  name: string
  health: number
  waterLevel: number
  lastWateredAt: string
  isAlive: boolean
  potType: 'basic' | 'ceramic' | 'golden'
  
  // New fields
  growthStage: 'seed' | 'sprout' | 'seedling' | 'young' | 'mature' | 'flowering' | 'fruiting'
  experience: number
  level: number
  daysOld: number
  lastStageUpdate: string
  
  createdAt: string
  updatedAt: string
  userId: string
}



export interface PlantMilestone {
  id: string
  type: string
  name: string
  description: string
  icon: string
  achievedAt: string
  plantId: string
  userId: string
}

export interface PlantCareLog {
  id: string
  action: 'water' | 'fertilize' | 'prune' | 'repot'
  details: string
  timestamp: string
  plantId: string
  userId: string
}

export const PLANT_STAGES_CONFIG = {
  seed: {
    id: 'seed',
    label: 'Seed',
    icon: '🌰',
    healthRange: [0, 20],
    minDays: 0,
    experienceRequired: 0,
    color: 'from-amber-200 to-amber-400',
    description: 'A tiny seed waiting to sprout'
  },
  sprout: {
    id: 'sprout',
    label: 'Sprout',
    icon: '🌱',
    healthRange: [21, 40],
    minDays: 2,
    experienceRequired: 50,
    color: 'from-green-200 to-green-400',
    description: 'First signs of life emerging'
  },
  seedling: {
    id: 'seedling',
    label: 'Seedling',
    icon: '🌿',
    healthRange: [41, 60],
    minDays: 5,
    experienceRequired: 150,
    color: 'from-green-300 to-green-500',
    description: 'Developing true leaves'
  },
  young: {
    id: 'young',
    label: 'Young Plant',
    icon: '🌳',
    healthRange: [61, 80],
    minDays: 10,
    experienceRequired: 350,
    color: 'from-green-400 to-emerald-500',
    description: 'Growing taller and stronger'
  },
  mature: {
    id: 'mature',
    label: 'Mature Plant',
    icon: '🌲',
    healthRange: [81, 95],
    minDays: 20,
    experienceRequired: 600,
    color: 'from-emerald-400 to-teal-500',
    description: 'Full growth achieved'
  },
  flowering: {
    id: 'flowering',
    label: 'Flowering',
    icon: '🌸',
    healthRange: [81, 100],
    minDays: 30,
    experienceRequired: 900,
    color: 'from-pink-400 to-rose-500',
    description: 'Beautiful blooms appear'
  },
  fruiting: {
    id: 'fruiting',
    label: 'Fruiting',
    icon: '🍎',
    healthRange: [81, 100],
    minDays: 40,
    experienceRequired: 1200,
    color: 'from-red-400 to-orange-500',
    description: 'Fruits of your labor'
  }
}

export type PlantStage = keyof typeof PLANT_STAGES_CONFIG