import { Store } from '@tanstack/store'
import { toast } from 'sonner'

// 1. Create a toast service using TanStack Store
// This is a thin wrapper around Sonner's API but allows us to
// maintain the pattern and potentially add app-specific functionality
const toastStore = new Store({
  // We don't need to store toast state since Sonner handles that internally
  state: {},
  actions: {
    // Toast actions that wrap Sonner's API
    success: (message: string, options = {}) => {
      toast.success(message, options)
    },
    error: (message: string, options = {}) => {
      toast.error(message, options)
    },
    info: (message: string, options = {}) => {
      toast.info(message, options)
    },
    warning: (message: string, options = {}) => {
      toast.warning(message, options)
    },
    custom: (message: string, options = {}) => {
      toast(message, options)
    },
    dismiss: (toastId: string) => {
      toast.dismiss(toastId)
    },
    // Add any app-specific toast functionality here
  },
})

// Custom hook to use the toast store
export function useToast() {
  return toastStore.state.actions
}
