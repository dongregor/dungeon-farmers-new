<script setup lang="ts">
interface ZoneData {
  id: string
  name: string
  type: string
  familiarity: number
  isUnlocked: boolean
  isMastered: boolean
  unlockRequirement: {
    minPower?: number
    previousZoneId?: string
    questComplete?: string
  }
}

interface Props {
  zones: ZoneData[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', zoneId: string): void
}>()

// Tooltip state
const hoveredZone = ref<ZoneData | null>(null)
const tooltipPosition = ref({ x: 0, y: 0 })

// Zone positions and shapes on the map
const zoneConfig: Record<string, { x: number; y: number; width: number; height: number; path: string }> = {
  verdant_woods: {
    x: 80,
    y: 150,
    width: 200,
    height: 180,
    path: 'M80,200 Q100,150 180,160 Q260,170 280,220 Q290,280 250,320 Q180,340 120,310 Q70,280 80,200 Z',
  },
  goblin_caves: {
    x: 320,
    y: 200,
    width: 160,
    height: 160,
    path: 'M350,220 Q380,180 430,190 Q480,200 490,260 Q495,320 450,350 Q390,370 340,340 Q310,300 320,250 Q330,210 350,220 Z',
  },
  misty_swamp: {
    x: 540,
    y: 180,
    width: 200,
    height: 200,
    path: 'M560,250 Q580,180 660,190 Q740,200 750,280 Q755,360 700,390 Q620,410 560,370 Q520,330 530,270 Q540,220 560,250 Z',
  },
}

// Get zone by ID
function getZone(id: string): ZoneData | undefined {
  return props.zones.find(z => z.id === id)
}

// Get visual state class for a zone
function getZoneClass(zone: ZoneData): string {
  if (!zone.isUnlocked) return 'zone-locked'
  if (zone.isMastered) return 'zone-mastered'
  return 'zone-unlocked'
}

// Get fill color based on zone type and state
function getZoneFill(zone: ZoneData): string {
  if (!zone.isUnlocked) return 'url(#fog-pattern)'

  const colors: Record<string, string> = {
    forest: '#22543d',
    cave: '#374151',
    swamp: '#064e3b',
    ruins: '#78350f',
    mountain: '#334155',
    desert: '#854d0e',
  }
  return colors[zone.type] || '#374151'
}

// Get stroke color
function getZoneStroke(zone: ZoneData): string {
  if (!zone.isUnlocked) return '#4b5563'
  if (zone.isMastered) return '#a855f7'
  return '#6b7280'
}

// Handle zone click
function handleZoneClick(zone: ZoneData) {
  if (zone.isUnlocked) {
    emit('select', zone.id)
  }
}

// Handle mouse enter for tooltip
function handleMouseEnter(event: MouseEvent, zone: ZoneData) {
  hoveredZone.value = zone
  updateTooltipPosition(event)
}

// Handle mouse move for tooltip
function handleMouseMove(event: MouseEvent) {
  if (hoveredZone.value) {
    updateTooltipPosition(event)
  }
}

// Handle mouse leave
function handleMouseLeave() {
  hoveredZone.value = null
}

// Update tooltip position
function updateTooltipPosition(event: MouseEvent) {
  tooltipPosition.value = {
    x: event.clientX + 15,
    y: event.clientY + 15,
  }
}

// Get unlock requirement text
function getUnlockText(zone: ZoneData): string {
  const req = zone.unlockRequirement
  if (req.minPower) return `Requires ${req.minPower} power`
  if (req.previousZoneId) return `Complete previous zone first`
  if (req.questComplete) return `Complete quest: ${req.questComplete}`
  return 'Locked'
}
</script>

<template>
  <div class="world-map-container relative">
    <!-- SVG Map -->
    <svg
      viewBox="0 0 900 500"
      class="w-full h-auto rounded-lg"
      style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);"
      @mousemove="handleMouseMove"
    >
      <!-- Definitions -->
      <defs>
        <!-- Fog pattern for locked zones -->
        <pattern id="fog-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
          <rect width="20" height="20" fill="#1f2937" />
          <circle cx="10" cy="10" r="8" fill="#374151" opacity="0.5" />
        </pattern>

        <!-- Glow filter for mastered zones -->
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Hover glow -->
        <filter id="glow-hover" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Map background decoration -->
      <rect x="0" y="0" width="900" height="500" fill="transparent" />

      <!-- Grid lines for parchment effect -->
      <g opacity="0.1">
        <line v-for="i in 9" :key="'v'+i" :x1="i * 100" y1="0" :x2="i * 100" y2="500" stroke="#4b5563" />
        <line v-for="i in 5" :key="'h'+i" x1="0" :y1="i * 100" x2="900" :y2="i * 100" stroke="#4b5563" />
      </g>

      <!-- Compass decoration -->
      <g transform="translate(820, 60)">
        <circle cx="0" cy="0" r="30" fill="none" stroke="#4b5563" stroke-width="2" />
        <text x="0" y="-38" text-anchor="middle" fill="#6b7280" font-size="12">N</text>
        <text x="0" y="48" text-anchor="middle" fill="#6b7280" font-size="12">S</text>
        <text x="-40" y="4" text-anchor="middle" fill="#6b7280" font-size="12">W</text>
        <text x="40" y="4" text-anchor="middle" fill="#6b7280" font-size="12">E</text>
        <line x1="0" y1="-25" x2="0" y2="25" stroke="#6b7280" stroke-width="2" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke="#6b7280" stroke-width="2" />
      </g>

      <!-- Zone Regions -->
      <g v-for="(config, zoneId) in zoneConfig" :key="zoneId">
        <template v-if="getZone(zoneId)">
          <path
            :d="config.path"
            :fill="getZoneFill(getZone(zoneId)!)"
            :stroke="getZoneStroke(getZone(zoneId)!)"
            stroke-width="3"
            :class="[
              'zone-region',
              getZoneClass(getZone(zoneId)!),
              { 'cursor-pointer': getZone(zoneId)?.isUnlocked }
            ]"
            :filter="getZone(zoneId)?.isMastered ? 'url(#glow-purple)' : ''"
            @click="handleZoneClick(getZone(zoneId)!)"
            @mouseenter="handleMouseEnter($event, getZone(zoneId)!)"
            @mouseleave="handleMouseLeave"
          />

          <!-- Zone Label -->
          <text
            :x="config.x + config.width / 2"
            :y="config.y + config.height / 2"
            text-anchor="middle"
            :fill="getZone(zoneId)?.isUnlocked ? '#ffffff' : '#6b7280'"
            font-size="16"
            font-weight="bold"
            class="pointer-events-none select-none"
            style="text-shadow: 2px 2px 4px rgba(0,0,0,0.8);"
          >
            {{ getZone(zoneId)?.isUnlocked ? getZone(zoneId)?.name : '???' }}
          </text>

          <!-- Lock icon for locked zones -->
          <text
            v-if="!getZone(zoneId)?.isUnlocked"
            :x="config.x + config.width / 2"
            :y="config.y + config.height / 2 + 30"
            text-anchor="middle"
            fill="#6b7280"
            font-size="24"
            class="pointer-events-none"
          >
            🔒
          </text>

          <!-- Mastery star for mastered zones -->
          <text
            v-if="getZone(zoneId)?.isMastered"
            :x="config.x + config.width / 2"
            :y="config.y + 40"
            text-anchor="middle"
            fill="#a855f7"
            font-size="20"
            class="pointer-events-none"
          >
            ⭐
          </text>

          <!-- Familiarity indicator for unlocked zones -->
          <g
            v-if="getZone(zoneId)?.isUnlocked && !getZone(zoneId)?.isMastered"
            :transform="`translate(${config.x + config.width / 2 - 30}, ${config.y + config.height / 2 + 25})`"
          >
            <rect
              x="0" y="0" width="60" height="8" rx="4"
              fill="#1f2937"
              stroke="#4b5563"
            />
            <rect
              x="0" y="0"
              :width="60 * (getZone(zoneId)!.familiarity / 100)"
              height="8" rx="4"
              fill="#3b82f6"
            />
          </g>
        </template>
      </g>

      <!-- Map title -->
      <text x="450" y="40" text-anchor="middle" fill="#9ca3af" font-size="24" font-weight="bold">
        World Map
      </text>

      <!-- Legend -->
      <g transform="translate(30, 420)">
        <text fill="#9ca3af" font-size="12" font-weight="bold">Legend</text>
        <g transform="translate(0, 20)">
          <rect width="16" height="16" fill="#22543d" stroke="#6b7280" rx="2" />
          <text x="24" y="13" fill="#9ca3af" font-size="11">Unlocked</text>
        </g>
        <g transform="translate(0, 42)">
          <rect width="16" height="16" fill="url(#fog-pattern)" stroke="#4b5563" rx="2" />
          <text x="24" y="13" fill="#6b7280" font-size="11">Locked</text>
        </g>
        <g transform="translate(100, 20)">
          <rect width="16" height="16" fill="#22543d" stroke="#a855f7" stroke-width="2" rx="2" />
          <text x="24" y="13" fill="#a855f7" font-size="11">Mastered</text>
        </g>
      </g>
    </svg>

    <!-- Tooltip -->
    <Teleport to="body">
      <div
        v-if="hoveredZone"
        class="fixed z-50 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg pointer-events-none"
        :style="{
          left: tooltipPosition.x + 'px',
          top: tooltipPosition.y + 'px',
        }"
      >
        <div class="font-semibold text-white mb-1">
          {{ hoveredZone.isUnlocked ? hoveredZone.name : 'Unknown Zone' }}
        </div>

        <template v-if="hoveredZone.isUnlocked">
          <div class="text-sm text-gray-400 mb-2">
            Type: {{ hoveredZone.type }}
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">Familiarity:</span>
            <div class="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500"
                :style="{ width: hoveredZone.familiarity + '%' }"
              />
            </div>
            <span class="text-gray-400">{{ hoveredZone.familiarity }}%</span>
          </div>
          <div v-if="hoveredZone.isMastered" class="text-purple-400 text-sm mt-1">
            ⭐ Mastered
          </div>
          <div class="text-xs text-blue-400 mt-2">
            Click to view details
          </div>
        </template>

        <template v-else>
          <div class="text-sm text-red-400">
            🔒 {{ getUnlockText(hoveredZone) }}
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.zone-region {
  transition: all 0.2s ease;
}

.zone-unlocked:hover {
  filter: url(#glow-hover);
  transform-origin: center;
}

.zone-mastered:hover {
  filter: url(#glow-purple) brightness(1.2);
}

.zone-locked {
  opacity: 0.6;
}
</style>
