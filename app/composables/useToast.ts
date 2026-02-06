export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

interface ToastOptions {
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

const toasts = ref<Toast[]>([])

let toastId = 0

function generateId(): string {
  return `toast-${++toastId}-${Date.now()}`
}

function addToast(type: ToastType, options: ToastOptions): string {
  const id = generateId()
  const toast: Toast = {
    id,
    type,
    title: options.title,
    message: options.message,
    duration: options.duration ?? 5000,
    dismissible: options.dismissible ?? true,
  }

  toasts.value.push(toast)

  // Auto-dismiss after duration (unless duration is 0)
  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration)
  }

  return id
}

function removeToast(id: string) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

function clearAllToasts() {
  toasts.value = []
}

export function useToast() {
  return {
    toasts: readonly(toasts),

    // Add typed toast methods
    success(options: ToastOptions | string) {
      const opts = typeof options === 'string' ? { title: options } : options
      return addToast('success', opts)
    },

    error(options: ToastOptions | string) {
      const opts = typeof options === 'string' ? { title: options } : options
      // Errors stay longer by default
      if (typeof options !== 'string' && !options.duration) {
        opts.duration = 8000
      }
      return addToast('error', opts)
    },

    warning(options: ToastOptions | string) {
      const opts = typeof options === 'string' ? { title: options } : options
      return addToast('warning', opts)
    },

    info(options: ToastOptions | string) {
      const opts = typeof options === 'string' ? { title: options } : options
      return addToast('info', opts)
    },

    // Remove a specific toast
    dismiss: removeToast,

    // Clear all toasts
    clear: clearAllToasts,
  }
}
