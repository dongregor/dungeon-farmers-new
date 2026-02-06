<template>
  <div
    class="recent-expedition bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
    @click="viewResults"
  >
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="font-semibold text-white">
          {{ zone?.name || expedition.zoneId }}
        </h3>
        <p class="text-sm text-gray-400">
          {{ subzone?.name || expedition.subzoneId }}
        </p>
      </div>
      <div
        :class="[
          'px-2 py-1 rounded text-xs font-semibold',
          efficiencyClass
        ]"
      >
        {{ expedition.efficiency || 100 }}%
      </div>
    </div>

    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-3 text-gray-400">
        <span class="flex items-center gap-1">
          <span class="text-yellow-400">{{ expedition.rewards?.gold || 0 }}</span> gold
        </span>
        <span class="flex items-center gap-1">
          <span class="text-blue-400">{{ expedition.rewards?.xp || 0 }}</span> xp
        </span>
      </div>
      <span class="text-gray-500 text-xs">
        {{ timeAgo }}
      </span>
    </div>

    <div class="mt-2 flex gap-1">
      <div
        v-for="heroId in expedition.heroIds.slice(0, 4)"
        :key="heroId"
        class="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-xs text-white"
        :title="getHeroName(heroId)"
      >
        {{ getHeroInitial(heroId) }}
      </div>
      <div
        v-if="expedition.heroIds.length > 4"
        class="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-400"
      >
        +{{ expedition.heroIds.length - 4 }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Expedition, Zone, Subzone } from '~~/types'
import { useHeroStore } from '~/stores/heroes'

interface Props {
  expedition: Expedition
  zone?: Zone | null
  subzone?: Subzone | null
}

const props = defineProps<Props>()
const router = useRouter()
const heroStore = useHeroStore()

const efficiencyClass = computed(() => {
  const eff = props.expedition.efficiency || 100
  if (eff >= 130) return 'bg-purple-900/50 text-purple-300'
  if (eff >= 110) return 'bg-green-900/50 text-green-300'
  if (eff >= 90) return 'bg-blue-900/50 text-blue-300'
  if (eff >= 70) return 'bg-yellow-900/50 text-yellow-300'
  return 'bg-red-900/50 text-red-300'
})

const timeAgo = computed(() => {
  if (!props.expedition.completesAt) return ''

  const completed = new Date(props.expedition.completesAt)
  const now = new Date()
  const diffMs = now.getTime() - completed.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays}d ago`
  if (diffHours > 0) return `${diffHours}h ago`
  if (diffMins > 0) return `${diffMins}m ago`
  return 'just now'
})

function getHeroName(heroId: string): string {
  const hero = heroStore.getHeroById(heroId)
  return hero?.name || 'Unknown'
}

function getHeroInitial(heroId: string): string {
  const hero = heroStore.getHeroById(heroId)
  return hero?.name?.charAt(0).toUpperCase() || '?'
}

function viewResults() {
  router.push(`/expeditions/results/${props.expedition.id}`)
}
</script>
