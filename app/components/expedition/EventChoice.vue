<script setup lang="ts">
import type { ExpeditionEvent, ExpeditionChoiceOption } from '~~/types'

interface Props {
  event: ExpeditionEvent
  show: boolean
}

interface Emits {
  (e: 'select', optionIndex: number): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedOption = ref<number | null>(null)

const handleSelect = (index: number) => {
  selectedOption.value = index
}

const handleConfirm = () => {
  if (selectedOption.value !== null) {
    emit('select', selectedOption.value)
    selectedOption.value = null
  }
}

const handleClose = () => {
  selectedOption.value = null
  emit('close')
}

// Reset selection when event changes
watch(() => props.event, () => {
  selectedOption.value = null
})

const getOptionIcon = (option: ExpeditionChoiceOption): string => {
  if (option.requiresStat) return '⚔️'
  if (option.risk === 'high') return '⚠️'
  if (option.risk === 'medium') return '⚡'
  return '✓'
}

const getOptionBorderColor = (index: number): string => {
  if (selectedOption.value === index) {
    return 'border-blue-500 bg-blue-50'
  }
  return 'border-gray-300 hover:border-blue-300'
}

const getRiskColor = (risk?: 'low' | 'medium' | 'high'): string => {
  switch (risk) {
    case 'high':
      return 'text-red-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-green-600'
    default:
      return 'text-gray-600'
  }
}
</script>

<template>
  <div
    v-if="show && event.choice"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="text-4xl text-center mb-3">🔀</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">
          A Choice Appears
        </h2>
        <p class="text-gray-600 text-center">
          Your party must make a decision...
        </p>
      </div>

      <!-- Event narrative -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <p class="text-gray-700 leading-relaxed">
          {{ event.narrative }}
        </p>

        <!-- Trait reactions -->
        <div v-if="event.traitReactions && event.traitReactions.length > 0" class="mt-3 space-y-2">
          <div
            v-for="(reaction, index) in event.traitReactions"
            :key="index"
            class="text-sm italic text-blue-600 pl-4 border-l-2 border-blue-200"
          >
            {{ reaction }}
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-3 mb-6">
        <div
          v-for="(option, index) in event.choice?.options"
          :key="index"
          class="border-2 rounded-lg p-4 cursor-pointer transition-all"
          :class="getOptionBorderColor(index)"
          @click="handleSelect(index)"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <span class="text-2xl">{{ getOptionIcon(option) }}</span>

            <div class="flex-1">
              <!-- Option text -->
              <div class="font-medium text-gray-800 mb-1">
                {{ option.text }}
              </div>

              <!-- Stat requirement -->
              <div v-if="option.requiresStat" class="text-sm text-blue-600 mb-1">
                Requires: {{ option.requiresStat.stat }} {{ option.requiresStat.value }}+
              </div>

              <!-- Risk level -->
              <div v-if="option.risk" class="text-sm" :class="getRiskColor(option.risk)">
                Risk: {{ option.risk.charAt(0).toUpperCase() + option.risk.slice(1) }}
              </div>

              <!-- Potential rewards/consequences hint -->
              <div v-if="option.hint" class="text-sm text-gray-500 italic mt-2">
                {{ option.hint }}
              </div>
            </div>

            <!-- Selection indicator -->
            <div
              v-if="selectedOption === index"
              class="text-blue-500 text-2xl"
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      <!-- Warning message -->
      <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-6">
        <p class="text-sm text-yellow-800">
          ⚠️ This choice will affect the outcome of your expedition. Choose wisely!
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-3">
        <button
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          :disabled="selectedOption === null"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleConfirm"
        >
          Confirm Choice
        </button>
      </div>

      <!-- Info note -->
      <div class="mt-4 text-xs text-gray-500 text-center">
        Some choices may require specific stats or traits to succeed.
      </div>
    </div>
  </div>
</template>
