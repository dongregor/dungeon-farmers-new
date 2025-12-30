/**
 * Modal component types
 * Shared types for BaseModal and ConfirmationDialog components
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export type ConfirmationVariant = 'danger' | 'warning' | 'info'

export interface BaseModalProps {
  modelValue: boolean
  title?: string
  size?: ModalSize
  closable?: boolean
  closeOnOverlay?: boolean
}

export interface BaseModalEmits {
  (e: 'update:modelValue', value: boolean): void
}

export interface ConfirmationDialogProps {
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: ConfirmationVariant
}

export interface ConfirmationDialogEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

/**
 * Variant styling configuration
 */
export interface VariantStyle {
  icon: string
  iconBg: string
  iconColor: string
  buttonBg: string
  buttonText: string
  borderColor: string
}
