// utils/toast.ts
import toast from 'react-hot-toast'

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: '✅',
    style: {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #86efac',
    },
  })
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: '❌',
    style: {
      background: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
    },
  })
}

export const showWarningToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#fffbeb',
      color: '#92400e',
      border: '1px solid #fcd34d',
    },
  })
}

export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #93c5fd',
    },
  })
}

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    style: {
      background: '#f3f4f6',
      color: '#1f2937',
    },
  })
}