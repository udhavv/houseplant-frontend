// src/config.ts
interface Config {
  API_URL: string
  NODE_ENV: string
    VERSION: string
}

export const config: Config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.BACKEND_APP_VERSION || 'V1'
}

export const API_URL = config.API_URL
export const NODE_ENV = config.NODE_ENV
export const VERSION = config.VERSION
