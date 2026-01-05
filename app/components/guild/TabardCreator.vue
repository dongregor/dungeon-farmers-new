<script setup lang="ts">
import type { Tabard } from '~~/types'

const props = withDefaults(defineProps<{
  modelValue: Tabard
  theme?: 'light' | 'dark'
  showEmblem?: boolean
  showCustomColors?: boolean
}>(), {
  theme: 'light',
  showEmblem: true,
  showCustomColors: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: Tabard]
}>()

const tabard = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const colorOptions = [
  { value: '#ef4444', label: 'Crimson', class: 'bg-red-500' },
  { value: '#f97316', label: 'Orange', class: 'bg-orange-500' },
  { value: '#fbbf24', label: 'Gold', class: 'bg-amber-400' },
  { value: '#22c55e', label: 'Emerald', class: 'bg-green-500' },
  { value: '#06b6d4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#3b82f6', label: 'Royal Blue', class: 'bg-blue-500' },
  { value: '#6366f1', label: 'Indigo', class: 'bg-indigo-500' },
  { value: '#a855f7', label: 'Purple', class: 'bg-purple-500' },
  { value: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#64748b', label: 'Slate', class: 'bg-slate-500' },
  { value: '#1e293b', label: 'Dark', class: 'bg-slate-800' },
  { value: '#f8fafc', label: 'White', class: 'bg-slate-50 border border-gray-300' },
]

const patternOptions: Array<{ value: Tabard['pattern']; label: string; icon: string }> = [
  { value: 'solid', label: 'Solid', icon: '▮' },
  { value: 'divided', label: 'Divided', icon: '◧' },
  { value: 'quartered', label: 'Quartered', icon: '▦' },
  { value: 'striped', label: 'Striped', icon: '▤' },
  { value: 'diagonal', label: 'Diagonal', icon: '◩' },
  { value: 'bordered', label: 'Bordered', icon: '▣' },
]

const emblemOptions = [
  { value: 'sword', label: 'Sword', icon: '⚔️' },
  { value: 'shield', label: 'Shield', icon: '🛡️' },
  { value: 'crown', label: 'Crown', icon: '👑' },
  { value: 'dragon', label: 'Dragon', icon: '🐉' },
  { value: 'wolf', label: 'Wolf', icon: '🐺' },
  { value: 'eagle', label: 'Eagle', icon: '🦅' },
  { value: 'lion', label: 'Lion', icon: '🦁' },
  { value: 'star', label: 'Star', icon: '⭐' },
  { value: 'moon', label: 'Moon', icon: '🌙' },
  { value: 'skull', label: 'Skull', icon: '💀' },
  { value: 'flame', label: 'Flame', icon: '🔥' },
  { value: 'tree', label: 'Tree', icon: '🌳' },
]

const updatePrimaryColor = (color: string) => {
  emit('update:modelValue', { ...tabard.value, primaryColor: color })
}

const updateSecondaryColor = (color: string) => {
  emit('update:modelValue', { ...tabard.value, secondaryColor: color })
}

const updatePattern = (pattern: Tabard['pattern']) => {
  emit('update:modelValue', { ...tabard.value, pattern })
}

const updateEmblem = (emblem: string) => {
  emit('update:modelValue', { ...tabard.value, emblem })
}

// Theme-aware classes
const labelClass = computed(() =>
  props.theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
)

const sublabelClass = computed(() =>
  props.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
)

const buttonBaseClass = computed(() =>
  props.theme === 'dark'
    ? 'border-gray-600 hover:bg-gray-700'
    : 'border-gray-300 hover:bg-gray-100'
)

const buttonActiveClass = computed(() =>
  props.theme === 'dark'
    ? 'border-purple-500 bg-purple-900/30'
    : 'border-blue-500 bg-blue-50'
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex gap-8">
      <!-- Preview -->
      <div class="flex flex-col items-center">
        <p class="text-sm mb-2" :class="sublabelClass">Preview</p>
        <GuildTabardPreview :tabard="tabard" size="xl" :show-emblem="showEmblem" />
      </div>

      <!-- Controls -->
      <div class="flex-1 space-y-4">
        <!-- Primary Color -->
        <div>
          <label class="block font-medium mb-2" :class="labelClass">Primary Color</label>
          <div class="flex flex-wrap gap-2 items-center">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              class="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
              :class="[
                color.class,
                tabard.primaryColor === color.value
                  ? 'ring-2 ring-offset-2 ' + (theme === 'dark' ? 'ring-white ring-offset-gray-800 border-white' : 'ring-blue-500 ring-offset-white border-blue-500')
                  : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')
              ]"
              :title="color.label"
              @click="updatePrimaryColor(color.value)"
            />
            <input
              v-if="showCustomColors"
              type="color"
              :value="tabard.primaryColor"
              class="w-7 h-7 rounded cursor-pointer border-2"
              :class="theme === 'dark' ? 'border-gray-600' : 'border-gray-300'"
              title="Custom color"
              @input="updatePrimaryColor(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Secondary Color -->
        <div>
          <label class="block font-medium mb-2" :class="labelClass">Secondary Color</label>
          <div class="flex flex-wrap gap-2 items-center">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              type="button"
              class="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
              :class="[
                color.class,
                tabard.secondaryColor === color.value
                  ? 'ring-2 ring-offset-2 ' + (theme === 'dark' ? 'ring-white ring-offset-gray-800 border-white' : 'ring-blue-500 ring-offset-white border-blue-500')
                  : (theme === 'dark' ? 'border-gray-600' : 'border-gray-300')
              ]"
              :title="color.label"
              @click="updateSecondaryColor(color.value)"
            />
            <input
              v-if="showCustomColors"
              type="color"
              :value="tabard.secondaryColor"
              class="w-7 h-7 rounded cursor-pointer border-2"
              :class="theme === 'dark' ? 'border-gray-600' : 'border-gray-300'"
              title="Custom color"
              @input="updateSecondaryColor(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <!-- Pattern -->
        <div>
          <label class="block font-medium mb-2" :class="labelClass">Pattern</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pattern in patternOptions"
              :key="pattern.value"
              type="button"
              class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all"
              :class="tabard.pattern === pattern.value ? buttonActiveClass : buttonBaseClass"
              @click="updatePattern(pattern.value)"
            >
              <span class="text-lg">{{ pattern.icon }}</span>
              <span class="text-xs" :class="sublabelClass">{{ pattern.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Emblem (optional) -->
    <div v-if="showEmblem">
      <label class="block font-medium mb-2" :class="labelClass">Emblem</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="emblem in emblemOptions"
          :key="emblem.value"
          type="button"
          class="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all"
          :class="tabard.emblem === emblem.value ? buttonActiveClass : buttonBaseClass"
          @click="updateEmblem(emblem.value)"
        >
          <span class="text-xl">{{ emblem.icon }}</span>
          <span class="text-xs" :class="sublabelClass">{{ emblem.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
