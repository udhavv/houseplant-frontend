// // types/index.ts
// export interface User {
//   id: string
//   email: string
//   username: string
//   isEmailVerified: boolean
//   createdAt?: string
//   updatedAt?: string
//   message?: string
//   coins: number
// }

// export interface AuthResponse {
//   message: string
//   user: User
// }

// export interface LoginCredentials {
//   email: string
//   password: string
// }

// export interface RegisterCredentials {
//   email: string
//   username: string
//   password: string
// }

// export interface ApiError {
//   error: string
//   code?: string
//   field?: string
//   message?: string
// }

// export interface ValidationError {
//   field: string
//   message: string
// }

// export interface AuthState {
//   user: User | null
//   isLoading: boolean
//   isAuthenticated: boolean
//   error: string | null
//   isEmailVerificationSent: boolean
//   isEmailVerified: boolean
//   successMessage: string | null
// }





// // types/index.ts
// export interface Plant {
//   id: string
//   name: string
//   health: number
//   waterLevel: number
//   lastWateredAt: string
//   isAlive: boolean
//   potType: 'basic' | 'ceramic' | 'golden'
  
//   // New fields
//   growthStage: 'seed' | 'sprout' | 'seedling' | 'young' | 'mature' | 'flowering' | 'fruiting'
//   experience: number
//   level: number
//   daysOld: number
//   lastStageUpdate: string
  
//   createdAt: string
//   updatedAt: string
//   userId: string
// }



// export interface PlantMilestone {
//   id: string
//   type: string
//   name: string
//   description: string
//   icon: string
//   achievedAt: string
//   plantId: string
//   userId: string
// }

// export interface PlantCareLog {
//   id: string
//   action: 'water' | 'fertilize' | 'prune' | 'repot'
//   details: string
//   timestamp: string
//   plantId: string
//   userId: string
// }

// export const PLANT_STAGES_CONFIG = {
//   seed: {
//     id: 'seed',
//     label: 'Seed',
//     icon: '🌰',
//     healthRange: [0, 20],
//     minDays: 0,
//     experienceRequired: 0,
//     color: 'from-amber-200 to-amber-400',
//     description: 'A tiny seed waiting to sprout'
//   },
//   sprout: {
//     id: 'sprout',
//     label: 'Sprout',
//     icon: '🌱',
//     healthRange: [21, 40],
//     minDays: 2,
//     experienceRequired: 50,
//     color: 'from-green-200 to-green-400',
//     description: 'First signs of life emerging'
//   },
//   seedling: {
//     id: 'seedling',
//     label: 'Seedling',
//     icon: '🌿',
//     healthRange: [41, 60],
//     minDays: 5,
//     experienceRequired: 150,
//     color: 'from-green-300 to-green-500',
//     description: 'Developing true leaves'
//   },
//   young: {
//     id: 'young',
//     label: 'Young Plant',
//     icon: '🌳',
//     healthRange: [61, 80],
//     minDays: 10,
//     experienceRequired: 350,
//     color: 'from-green-400 to-emerald-500',
//     description: 'Growing taller and stronger'
//   },
//   mature: {
//     id: 'mature',
//     label: 'Mature Plant',
//     icon: '🌲',
//     healthRange: [81, 95],
//     minDays: 20,
//     experienceRequired: 600,
//     color: 'from-emerald-400 to-teal-500',
//     description: 'Full growth achieved'
//   },
//   flowering: {
//     id: 'flowering',
//     label: 'Flowering',
//     icon: '🌸',
//     healthRange: [81, 100],
//     minDays: 30,
//     experienceRequired: 900,
//     color: 'from-pink-400 to-rose-500',
//     description: 'Beautiful blooms appear'
//   },
//   fruiting: {
//     id: 'fruiting',
//     label: 'Fruiting',
//     icon: '🍎',
//     healthRange: [81, 100],
//     minDays: 40,
//     experienceRequired: 1200,
//     color: 'from-red-400 to-orange-500',
//     description: 'Fruits of your labor'
//   }
// }

// export type PlantStage = keyof typeof PLANT_STAGES_CONFIG





// types/index.ts

// ====== AUTH ======
export interface User {
  id: string
  email: string
  username: string
  isEmailVerified: boolean
  coins: number
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  success: boolean
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

// ====== PLANT ======
export type PlantStageId =
  | 'seed'
  | 'sprout'
  | 'seedling'
  | 'young'
  | 'mature'
  | 'flowering'
  | 'fruiting'


export type PotType= 'basic' | 'ceramic' | 'golden'

export interface Plant {
  id: string
  name: string
  health: number
  waterLevel: number
  lastWateredAt: string
  isAlive: boolean
  potType: PotType

  // Life cycle fields
  growthStage: PlantStageId
  experience: number
  level: number
  daysOld: number
  lastStageUpdate: string

  createdAt: string
  updatedAt?: string
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


export interface PlantStageConfig {
  id: PlantStageId
  label: string
  icon: string
  minDays: number
  level: number       // required level to reach this stage
  color: string
  description: string
  growthRate: number
}


export const PLANT_STAGES_CONFIG: Record<PlantStageId, PlantStageConfig> = {
  seed: {
    id: 'seed',
    label: 'Seed',
    icon: '🌰',
    minDays: 0,
    level: 0,
    color: 'from-amber-200 to-amber-400',
    description: 'A tiny seed waiting to sprout',
    growthRate: 0.5,
  },
  sprout: {
    id: 'sprout',
    label: 'Sprout',
    icon: '🌱',
    minDays: 2,
    level: 1,
    color: 'from-green-200 to-green-400',
    description: 'First signs of life emerging',
    growthRate: 1.0,
  },
  seedling: {
    id: 'seedling',
    label: 'Seedling',
    icon: '🌿',
    minDays: 5,
    level: 3,
    color: 'from-green-300 to-green-500',
    description: 'Developing true leaves',
    growthRate: 1.5,
  },
  young: {
    id: 'young',
    label: 'Young Plant',
    icon: '🌳',
    minDays: 10,
    level: 5,
    color: 'from-green-400 to-emerald-500',
    description: 'Growing taller and stronger',
    growthRate: 2.0,
  },
  mature: {
    id: 'mature',
    label: 'Mature Plant',
    icon: '🌲',
    minDays: 20,
    level: 9,
    color: 'from-emerald-400 to-teal-500',
    description: 'Full growth achieved',
    growthRate: 2.5,
  },
  flowering: {
    id: 'flowering',
    label: 'Flowering',
    icon: '🌸',
    minDays: 30,
    level: 13,
    color: 'from-pink-400 to-rose-500',
    description: 'Beautiful blooms appear',
    growthRate: 3.0,
  },
  fruiting: {
    id: 'fruiting',
    label: 'Fruiting',
    icon: '🍎',
    minDays: 40,
    level: 17,
    color: 'from-red-400 to-orange-500',
    description: 'Fruits of your labor',
    growthRate: 3.5,
  },
}



export type PlantStage = keyof typeof PLANT_STAGES_CONFIG

// // ====== SHOP / TRANSACTIONS ======
// export type TransactionType =
//   | 'daily_checkin'
//   | 'purchase_pot'
//   | 'water_bonus'
//   | 'stage_bonus'
//   | 'level_up_bonus'
//   | 'fertilize'
//   | 'repot'
//   | 'signup_bonus'
//   | 'email_verified_bonus'

// export interface Transaction {
//   id: string
//   amount: number
//   type: TransactionType
//   description?: string | null
//   createdAt: string
//   userId: string
// }


// // ⚠️ Must match backend `POT_PRICES` in shopController.js
// export const POT_PRICES: Record<PotType, number> = {
//   basic: 0,
//   ceramic: 100,
//   golden: 300,
// }











export const STAGE_ORDER: PlantStageId[] = [
  'seed',
  'sprout',
  'seedling',
  'young',
  'mature',
  'flowering',
  'fruiting',
]

// ====== HEALTH / REWARDS (mirrors backend) ======
export const HEALTH_THRESHOLDS = {
  CRITICAL: 20,
  POOR: 40,
  MODERATE: 60,
  GOOD: 80,
  EXCELLENT: 95,
}

export const EXPERIENCE_REWARDS = {
  WATER: 10,
  FERTILIZE: 15,
  PRUNE: 20,
  REPOT: 25,
  DAILY_CHECKIN: 30,
  STAGE_ADVANCE: 50,
  LEVEL_UP: 100,   // ⚠️ Not granted by newPlantController anymore
}

export const COIN_REWARDS = {
  WATER: 5,
  WATER_BONUS: 5,
  FERTILIZE: 10,
  DAILY_CHECKIN: 20,
  STAGE_ADVANCE: 25,
  LEVEL_UP: 30,
}

// ====== LEVEL REQUIREMENTS (cumulative XP, mirrors backend) ======
/**
 * Cumulative XP required to *reach* each level.
 *
 * Level 1 = 0 XP
 * Level 2 = 100 XP
 * Level 3 = 250 XP
 * ...
 *
 * The XP required to go from level N to N+1 is:
 *   LEVEL_REQUIREMENTS[N + 1] - LEVEL_REQUIREMENTS[N]
 *
 * No entry for level 11 → level 10 is the max.
 */
export const LEVEL_REQUIREMENTS: Record<number, number> = {
   1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 4000,
  11: 5200,
  12: 6600,
  13: 8200,
  14: 10000,
  15: 12000,
  16: 14300,
  17: 17000,
}

export const MAX_LEVEL = 17

/**
 * XP required to advance from `level` to `level + 1`.
 * Returns `null` if already at max level.
 */
export const getXPRequiredForLevel = (level: number): number | null => {
  const nextLevel = level + 1
  const currentReq = LEVEL_REQUIREMENTS[level] ?? 0
  const nextReq = LEVEL_REQUIREMENTS[nextLevel]
  if (nextReq === undefined) return null
  return nextReq 
}

// ====== SHOP / TRANSACTIONS ======
export type TransactionType =
  | 'daily_checkin'
  | 'purchase_pot'
  | 'water_bonus'
  | 'stage_bonus'
  | 'level_up_bonus'
  | 'fertilize'
  | 'repot'
  | 'signup_bonus'
  | 'email_verified_bonus'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  description?: string | null
  createdAt: string
  userId: string
}

// ⚠️ Must match backend `POT_PRICES` in shopController.js
export const POT_PRICES: Record<PotType, number> = {
  basic: 0,
  ceramic: 100,
  golden: 300,
}