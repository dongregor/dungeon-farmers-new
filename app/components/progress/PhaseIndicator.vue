<script setup lang="ts">
interface Phase {
  name: string
  status: 'completed' | 'current' | 'pending'
}

interface Props {
  currentPhase: number
  totalPhases: number
  phases?: Phase[]
}

const props = defineProps<Props>()

// Validate currentPhase is within bounds
watchEffect(() => {
  if (props.currentPhase < 0 || props.currentPhase >= props.totalPhases) {
    console.warn(
      `PhaseIndicator: currentPhase (${props.currentPhase}) is out of bounds [0, ${props.totalPhases - 1}]`
    )
  }
})

const displayPhases = computed(() => {
  if (props.phases && props.phases.length > 0) {
    return props.phases
  }

  // Generate default phases if not provided
  return Array.from({ length: props.totalPhases }, (_, i) => ({
    name: `Phase ${i + 1}`,
    status: (i < props.currentPhase ? 'completed' : i === props.currentPhase ? 'current' : 'pending') as Phase['status'],
  }))
})

const getPhaseClasses = (status: Phase['status']) => {
  switch (status) {
    case 'completed':
      return {
        dot: 'bg-green-500 border-green-500',
        line: 'bg-green-500',
        text: 'text-green-700 font-medium',
      }
    case 'current':
      return {
        dot: 'bg-blue-500 border-blue-500 ring-4 ring-blue-100',
        line: 'bg-gray-300',
        text: 'text-blue-700 font-bold',
      }
    case 'pending':
      return {
        dot: 'bg-white border-gray-300',
        line: 'bg-gray-300',
        text: 'text-gray-400',
      }
  }
}

const getPhaseIcon = (status: Phase['status']) => {
  switch (status) {
    case 'completed':
      return '✓'
    case 'current':
      return ''
    case 'pending':
      return ''
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Phase stepper -->
    <ol
      role="list"
      aria-label="Expedition phases"
      class="flex items-center justify-between"
    >
      <template v-for="(phase, index) in displayPhases" :key="index">
        <!-- Phase dot and label -->
        <li
          role="listitem"
          :aria-current="phase.status === 'current' ? 'step' : undefined"
          class="flex flex-col items-center flex-1"
        >
          <!-- Dot -->
          <div class="relative">
            <div
              class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              :class="getPhaseClasses(phase.status).dot"
              :aria-label="`${phase.name}: ${phase.status}`"
            >
              <span
                v-if="getPhaseIcon(phase.status)"
                class="text-white text-sm font-bold"
                aria-hidden="true"
              >
                {{ getPhaseIcon(phase.status) }}
              </span>
              <span
                v-else-if="phase.status === 'current'"
                class="w-3 h-3 bg-white rounded-full animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>

          <!-- Label -->
          <div class="mt-2 text-xs text-center transition-colors duration-300" :class="getPhaseClasses(phase.status).text">
            {{ phase.name }}
          </div>
        </li>

        <!-- Connecting line (except after last phase) -->
        <div
          v-if="index < displayPhases.length - 1"
          class="flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300"
          :class="getPhaseClasses(phase.status).line"
          aria-hidden="true"
        />
      </template>
    </ol>

    <!-- Progress summary -->
    <div
      class="mt-4 text-center text-sm text-gray-600"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      Phase {{ currentPhase + 1 }} of {{ totalPhases }}
    </div>
  </div>
</template>
