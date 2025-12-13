# Navigation & Dashboard Implementation Guide
**Practical Code Examples for Dungeon Farmers**

**Last Updated**: 2025-11-22
**Phase**: Phase 1 MVP
**Prerequisite**: Read [UI_NAVIGATION_DASHBOARD.md](UI_NAVIGATION_DASHBOARD.md) first

---

## 🎯 Implementation Overview

This guide provides step-by-step code examples to implement the navigation and dashboard design.

**Tech Stack:**
- Nuxt 3 + Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Pinia stores

**File Structure:**
```
dungeon-farmers/
├── layouts/
│   ├── default.vue          # NEW - Main authenticated layout
│   ├── auth.vue             # NEW - Login/signup layout
│   └── fullwidth.vue        # FUTURE - Full viewport layout
├── pages/
│   ├── dashboard.vue        # NEW - HQ/Command Center
│   ├── index.vue            # UPDATE - Landing page (unauth only)
│   └── ... (existing pages)
├── components/
│   ├── Navigation.vue       # EXISTS - Update and integrate
│   ├── MobileNavDrawer.vue  # NEW - Mobile navigation
│   ├── UserMenu.vue         # NEW - User dropdown menu
│   └── dashboard/           # NEW - Dashboard widgets
│       ├── PlayerStatusWidget.vue
│       ├── ActiveOperationsWidget.vue
│       ├── NotificationsWidget.vue
│       ├── QuickActionsPanel.vue
│       ├── AvailableExpeditionsWidget.vue
│       ├── QuickStatsWidget.vue
│       └── Phase2PreviewWidget.vue
├── composables/
│   ├── useDashboard.ts      # NEW - Dashboard data aggregation
│   └── useNotifications.ts  # NEW - Notification system
└── middleware/
    └── auth.ts              # UPDATE - Add dashboard redirect
```

---

## 📁 Step 1: Create Layout System

### 1.1 Default Layout (`/layouts/default.vue`)

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Redirect to login if not authenticated
if (!authStore.isAuthenticated) {
  navigateTo('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Top Navigation -->
    <Navigation />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Global Toast Notifications -->
    <Toast />
  </div>
</template>
```

### 1.2 Auth Layout (`/layouts/auth.vue`)

```vue
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
    <!-- Centered content, no navigation -->
    <div class="w-full max-w-md p-6">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-purple-400">
          🏢 Dungeon Farmers Corp.
        </h1>
        <p class="text-gray-400 mt-2">Employee Portal</p>
      </div>

      <slot />
    </div>
  </div>
</template>
```

### 1.3 Apply Layouts to Pages

**Update existing pages to use default layout:**

```vue
<!-- pages/heroes/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
// ... rest of existing code
</script>
```

**Apply to auth pages:**

```vue
<!-- pages/auth/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})
// ... rest of existing code
</script>
```

---

## 🧭 Step 2: Update Navigation Component

### 2.1 Enhanced Navigation (`/components/Navigation.vue`)

**Update existing Navigation.vue:**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { usePlayerStore } from '~/stores/player'
import { useHeroStore } from '~/stores/heroStore'
import { useExpeditionStore } from '~/stores/expeditionStore'
import { useEquipmentStore } from '~/stores/equipmentStore'

const authStore = useAuthStore()
const playerStore = usePlayerStore()
const heroStore = useHeroStore()
const expeditionStore = useExpeditionStore()
const equipmentStore = useEquipmentStore()

const mobileMenuOpen = ref(false)

// Notification badges
const tavernBadge = computed(() => {
  // Show badge if tavern refresh is ready
  // TODO: Implement tavern refresh timer in heroStore
  return null // or '!' if ready
})

const activeExpeditionsCount = computed(() => {
  return expeditionStore.activeExpeditions.length
})

const equipmentCount = computed(() => {
  return equipmentStore.inventory.length
})

const isPremium = computed(() => {
  return playerStore.isPremium
})

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-gray-900 border-b border-gray-700 shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo + Primary Nav -->
        <div class="flex items-center gap-6">
          <!-- Logo -->
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-2 text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span class="text-2xl">🏢</span>
            <span class="hidden sm:inline">Dungeon Farmers</span>
            <span class="sm:hidden">DF</span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" icon="🏠" label="HQ" />
            <NavLink to="/heroes" icon="👥" label="Heroes" />
            <NavLink
              to="/tavern"
              icon="🍺"
              label="Tavern"
              :badge="tavernBadge"
            />
            <NavLink
              to="/expeditions"
              icon="🗺️"
              label="Expeditions"
              :badge="activeExpeditionsCount > 0 ? activeExpeditionsCount : null"
            />
            <NavLink
              to="/equipment"
              icon="⚔️"
              label="Equipment"
              :badge="equipmentCount > 0 ? equipmentCount : null"
            />
            <NavLink
              to="/dungeons"
              icon="🏰"
              label="Dungeons"
              :locked="!isPremium"
              tooltip="Premium Feature - Unlock for $9.99"
            />
          </div>
        </div>

        <!-- Right: User Menu -->
        <div class="flex items-center gap-3">
          <!-- Gold Display -->
          <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
            <span class="text-yellow-400 text-lg">💰</span>
            <span class="font-semibold font-mono">
              {{ playerStore.gold.toLocaleString() }}
            </span>
          </div>

          <!-- User Menu (Desktop) -->
          <div class="hidden md:block">
            <UserMenu />
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <MobileNavDrawer
      v-if="mobileMenuOpen"
      @close="closeMobileMenu"
    />
  </nav>
</template>
```

### 2.2 NavLink Component (`/components/NavLink.vue`)

**Create new component:**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  to: string
  icon: string
  label: string
  badge?: string | number | null
  locked?: boolean
  tooltip?: string
}>()

const emit = defineEmits<{
  click: []
}>()

const route = useRoute()

const isActive = computed(() => {
  return route.path === props.to || route.path.startsWith(props.to + '/')
})

function handleClick(e: MouseEvent) {
  if (props.locked) {
    e.preventDefault()
    emit('click')
    // TODO: Show upgrade modal
    console.log('Locked feature clicked:', props.label)
  }
}
</script>

<template>
  <NuxtLink
    :to="to"
    :class="[
      'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
      'text-sm font-medium',
      isActive
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        : locked
          ? 'text-gray-500 hover:text-gray-400 cursor-not-allowed'
          : 'text-gray-300 hover:text-white hover:bg-gray-800'
    ]"
    :title="tooltip"
    @click="handleClick"
  >
    <!-- Icon -->
    <span class="text-lg" :class="{ 'opacity-50': locked }">
      {{ icon }}
    </span>

    <!-- Label -->
    <span :class="{ 'opacity-50': locked }">
      {{ label }}
    </span>

    <!-- Lock Icon -->
    <span v-if="locked" class="text-xs">🔒</span>

    <!-- Badge -->
    <span
      v-if="badge && !locked"
      class="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
    >
      {{ badge }}
    </span>

    <!-- Active Indicator -->
    <span
      v-if="isActive && !locked"
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
    />
  </NuxtLink>
</template>
```

### 2.3 Mobile Navigation Drawer (`/components/MobileNavDrawer.vue`)

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { usePlayerStore } from '~/stores/player'

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const playerStore = usePlayerStore()

function handleSignOut() {
  authStore.signOut()
  emit('close')
}
</script>

<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 bg-black/50 z-40 md:hidden"
    @click="emit('close')"
  />

  <!-- Drawer -->
  <div class="fixed top-16 left-0 right-0 bottom-0 bg-gray-900 z-50 md:hidden overflow-y-auto border-t border-gray-700">
    <div class="p-4">
      <!-- User Info -->
      <div class="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <div class="font-semibold">{{ authStore.user?.email }}</div>
            <div class="text-sm text-gray-400">Level {{ playerStore.level }}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-2">
        <MobileNavLink to="/dashboard" icon="🏠" label="HQ" @click="emit('close')" />
        <MobileNavLink to="/heroes" icon="👥" label="Heroes" @click="emit('close')" />
        <MobileNavLink to="/tavern" icon="🍺" label="Tavern" badge="NEW" @click="emit('close')" />
        <MobileNavLink to="/expeditions" icon="🗺️" label="Expeditions" :badge="2" @click="emit('close')" />
        <MobileNavLink to="/equipment" icon="⚔️" label="Equipment" :badge="42" @click="emit('close')" />
        <MobileNavLink
          to="/dungeons"
          icon="🏰"
          label="Dungeons"
          :locked="!playerStore.isPremium"
          @click="emit('close')"
        />

        <div class="my-4 border-t border-gray-700" />

        <MobileNavLink to="/profile" icon="👤" label="Profile" @click="emit('close')" />
        <MobileNavLink to="/settings" icon="⚙️" label="Settings" @click="emit('close')" />

        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span class="text-lg">🚪</span>
          <span class="font-medium">Sign Out</span>
        </button>
      </nav>
    </div>
  </div>
</template>
```

### 2.4 Mobile NavLink Component (`/components/MobileNavLink.vue`)

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  to: string
  icon: string
  label: string
  badge?: string | number | null
  locked?: boolean
}>()

const route = useRoute()

const isActive = computed(() => {
  return route.path === props.to || route.path.startsWith(props.to + '/')
})
</script>

<template>
  <NuxtLink
    :to="to"
    :class="[
      'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
      isActive
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
        : locked
          ? 'text-gray-500 cursor-not-allowed'
          : 'text-gray-300 hover:bg-gray-800'
    ]"
  >
    <div class="flex items-center gap-3">
      <span class="text-xl" :class="{ 'opacity-50': locked }">{{ icon }}</span>
      <span class="font-medium" :class="{ 'opacity-50': locked }">{{ label }}</span>
      <span v-if="locked" class="text-sm">🔒</span>
    </div>

    <span
      v-if="badge && !locked"
      class="min-w-[24px] h-6 px-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full"
    >
      {{ badge }}
    </span>
  </NuxtLink>
</template>
```

### 2.5 User Menu Component (`/components/UserMenu.vue`)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

onClickOutside(menuRef, () => {
  menuOpen.value = false
})

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleSignOut() {
  authStore.signOut()
  menuOpen.value = false
}
</script>

<template>
  <div class="relative" ref="menuRef">
    <!-- User Button -->
    <button
      @click="toggleMenu"
      class="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
    >
      <span class="text-lg">👤</span>
      <span class="hidden lg:inline text-sm">
        {{ authStore.user?.email?.split('@')[0] }}
      </span>
      <span class="text-xs">{{ menuOpen ? '▲' : '▼' }}</span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="menuOpen"
      class="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
    >
      <div class="p-4 border-b border-gray-700">
        <div class="text-sm text-gray-400">Signed in as</div>
        <div class="font-semibold truncate">{{ authStore.user?.email }}</div>
      </div>

      <div class="py-2">
        <NuxtLink
          to="/profile"
          class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors"
          @click="menuOpen = false"
        >
          <span>👤</span>
          <span>Profile</span>
        </NuxtLink>

        <NuxtLink
          to="/settings"
          class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition-colors"
          @click="menuOpen = false"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NuxtLink>

        <div class="my-2 border-t border-gray-700" />

        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-2 px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>
```

---

## 🏠 Step 3: Create Dashboard Page

### 3.1 Dashboard Page (`/pages/dashboard.vue`)

```vue
<script setup lang="ts">
import { useDashboard } from '~/composables/useDashboard'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const {
  playerStatus,
  activeOperations,
  notifications,
  availableExpeditions,
  quickStats,
  loading,
  refresh
} = useDashboard()

// Auto-refresh every 30 seconds
const { pause, resume } = useIntervalFn(() => {
  refresh()
}, 30000)

onUnmounted(() => {
  pause()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Command Center</h1>
        <p class="text-gray-400 mt-1">Your operational headquarters</p>
      </div>

      <button
        @click="refresh"
        class="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        :disabled="loading"
      >
        <span :class="{ 'animate-spin': loading }">🔄</span>
        <span>Refresh</span>
      </button>
    </div>

    <!-- Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-1 space-y-6">
        <PlayerStatusWidget :data="playerStatus" />
        <NotificationsWidget :notifications="notifications" />
        <Phase2PreviewWidget />
      </div>

      <!-- Center Column -->
      <div class="lg:col-span-1 space-y-6">
        <ActiveOperationsWidget :operations="activeOperations" />
        <AvailableExpeditionsWidget :expeditions="availableExpeditions" />
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-1 space-y-6">
        <QuickStatsWidget :stats="quickStats" />
        <QuickActionsPanel />
      </div>
    </div>
  </div>
</template>
```

### 3.2 Dashboard Composable (`/composables/useDashboard.ts`)

```typescript
import { ref, computed } from 'vue'
import { usePlayerStore } from '~/stores/player'
import { useHeroStore } from '~/stores/heroStore'
import { useExpeditionStore } from '~/stores/expeditionStore'
import { useEquipmentStore } from '~/stores/equipmentStore'

export function useDashboard() {
  const playerStore = usePlayerStore()
  const heroStore = useHeroStore()
  const expeditionStore = useExpeditionStore()
  const equipmentStore = useEquipmentStore()

  const loading = ref(false)

  // Player Status Data
  const playerStatus = computed(() => ({
    level: playerStore.level,
    xp: playerStore.xp,
    xpToNext: playerStore.xpToNextLevel,
    xpProgress: (playerStore.xp / playerStore.xpToNextLevel) * 100,
    gold: playerStore.gold,
    alliancePoints: playerStore.alliancePoints,
    isPremium: playerStore.isPremium,
    demoWarning: !playerStore.isPremium && playerStore.level >= 14
  }))

  // Active Operations (Expeditions)
  const activeOperations = computed(() => {
    return expeditionStore.activeExpeditions.map(exp => ({
      id: exp.id,
      zoneName: exp.zone.name,
      heroCount: exp.heroIds.length,
      completedAt: exp.completedAt,
      remainingTime: exp.completedAt ? Math.max(0, new Date(exp.completedAt).getTime() - Date.now()) : 0,
      isComplete: exp.completedAt ? new Date(exp.completedAt).getTime() <= Date.now() : false
    }))
  })

  // Notifications (Placeholder - implement full notification system later)
  const notifications = computed(() => {
    const notifs = []

    // Check for heroes at max XP
    const maxXpHeroes = heroStore.heroes.filter(h => {
      const maxXp = h.level * 100 // Simplified
      return h.xp >= maxXp
    })

    maxXpHeroes.forEach(hero => {
      notifs.push({
        id: `max-xp-${hero.id}`,
        type: 'urgent',
        icon: '⚠️',
        message: `${hero.name} reached max XP for their level`,
        action: {
          label: 'Level Up',
          to: `/heroes/${hero.id}`
        },
        timestamp: Date.now()
      })
    })

    // Check for completed expeditions
    const completedExpeditions = activeOperations.value.filter(op => op.isComplete)
    completedExpeditions.forEach(exp => {
      notifs.push({
        id: `exp-complete-${exp.id}`,
        type: 'info',
        icon: '✅',
        message: `Expedition to ${exp.zoneName} complete!`,
        action: {
          label: 'Claim Rewards',
          callback: () => expeditionStore.claimExpedition(exp.id)
        },
        timestamp: Date.now()
      })
    })

    // Demo cap warning
    if (!playerStore.isPremium && playerStore.level >= 14) {
      notifs.push({
        id: 'demo-cap',
        type: 'warning',
        icon: '🔒',
        message: 'Approaching demo level cap (15). Unlock full game to continue!',
        action: {
          label: 'Unlock Premium',
          callback: () => {
            // TODO: Show upgrade modal
            console.log('Show upgrade modal')
          }
        },
        timestamp: Date.now()
      })
    }

    return notifs.slice(0, 5) // Max 5 notifications
  })

  // Available Expeditions
  const availableExpeditions = computed(() => {
    return expeditionStore.zones
      .filter(zone => !zone.isLocked)
      .slice(0, 5)
      .map(zone => ({
        id: zone.id,
        name: zone.name,
        difficulty: zone.recommendedLevel,
        cost: zone.cost,
        duration: zone.duration,
        rewards: zone.rewards
      }))
  })

  // Quick Stats
  const quickStats = computed(() => ({
    heroes: {
      current: heroStore.heroes.length,
      max: playerStore.heroRosterCap,
      label: 'Heroes',
      icon: '👥',
      to: '/heroes'
    },
    equipment: {
      current: equipmentStore.inventory.length,
      max: null,
      label: 'Equipment',
      icon: '⚔️',
      to: '/equipment'
    },
    tavern: {
      // TODO: Implement tavern refresh timer
      ready: false,
      label: 'Tavern',
      icon: '🍺',
      to: '/tavern'
    },
    dungeons: {
      current: 0,
      max: 3,
      locked: !playerStore.isPremium,
      label: 'Dungeons',
      icon: '🏰',
      to: '/dungeons'
    }
  }))

  // Refresh all dashboard data
  async function refresh() {
    loading.value = true
    try {
      await Promise.all([
        playerStore.fetchPlayer(),
        heroStore.fetchHeroes(),
        expeditionStore.fetchActiveExpeditions(),
        equipmentStore.fetchInventory()
      ])
    } catch (error) {
      console.error('Dashboard refresh failed:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    playerStatus,
    activeOperations,
    notifications,
    availableExpeditions,
    quickStats,
    loading,
    refresh
  }
}
```

---

## 🧩 Step 4: Dashboard Widget Components

### 4.1 Player Status Widget (`/components/dashboard/PlayerStatusWidget.vue`)

```vue
<script setup lang="ts">
const props = defineProps<{
  data: {
    level: number
    xp: number
    xpToNext: number
    xpProgress: number
    gold: number
    alliancePoints: number
    isPremium: boolean
    demoWarning: boolean
  }
}>()
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <span>📊</span>
      <span>Player Status</span>
    </h2>

    <!-- Demo Warning -->
    <div
      v-if="data.demoWarning"
      class="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm"
    >
      ⚠️ Approaching demo limit (Level 15)
    </div>

    <!-- Level Progress -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-400">Level</span>
        <span class="text-2xl font-bold">{{ data.level }}</span>
      </div>

      <div class="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
          :style="{ width: `${data.xpProgress}%` }"
        />
      </div>

      <div class="text-xs text-gray-400 mt-1 text-right">
        {{ data.xp.toLocaleString() }} / {{ data.xpToNext.toLocaleString() }} XP ({{ Math.floor(data.xpProgress) }}%)
      </div>
    </div>

    <!-- Resources -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-gray-300">
          <span class="text-xl">💰</span>
          <span>Gold</span>
        </div>
        <span class="text-xl font-bold font-mono text-yellow-400">
          {{ data.gold.toLocaleString() }}
        </span>
      </div>

      <div
        v-if="data.alliancePoints > 0"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2 text-gray-300">
          <span class="text-xl">🔷</span>
          <span>Alliance Points</span>
        </div>
        <span class="text-xl font-bold font-mono text-blue-400">
          {{ data.alliancePoints.toLocaleString() }}
        </span>
      </div>
    </div>

    <!-- View Profile CTA -->
    <NuxtLink
      to="/profile"
      class="mt-4 block w-full text-center py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
    >
      View Full Profile
    </NuxtLink>
  </div>
</template>
```

### 4.2 Active Operations Widget (`/components/dashboard/ActiveOperationsWidget.vue`)

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  operations: Array<{
    id: string
    zoneName: string
    heroCount: number
    completedAt: string
    remainingTime: number
    isComplete: boolean
  }>
}>()

// Update timers every second
const timers = ref<Record<string, number>>({})

let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    props.operations.forEach(op => {
      if (!op.isComplete) {
        timers.value[op.id] = Math.max(0, new Date(op.completedAt).getTime() - Date.now())
      }
    })
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

function getProgressColor(remainingTime: number, totalTime: number) {
  const progress = (totalTime - remainingTime) / totalTime
  if (progress > 0.8) return 'text-green-400'
  if (progress > 0.5) return 'text-yellow-400'
  return 'text-blue-400'
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <span>🗺️</span>
      <span>Active Operations</span>
    </h2>

    <!-- Operations List -->
    <div v-if="operations.length > 0" class="space-y-3">
      <div
        v-for="op in operations"
        :key="op.id"
        :class="[
          'p-4 rounded-lg border transition-all',
          op.isComplete
            ? 'bg-green-500/10 border-green-500/30 animate-pulse'
            : 'bg-gray-900 border-gray-700'
        ]"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="font-semibold">{{ op.zoneName }}</div>
            <div class="text-xs text-gray-400">{{ op.heroCount }} heroes deployed</div>
          </div>

          <div
            v-if="op.isComplete"
            class="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded"
          >
            COMPLETE
          </div>
          <div
            v-else
            class="text-right"
          >
            <div :class="['font-mono font-semibold', getProgressColor(timers[op.id] || op.remainingTime, 3600000)]">
              ⏰ {{ formatTime(timers[op.id] || op.remainingTime) }}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="!op.isComplete" class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            :style="{
              width: `${Math.max(0, 100 - ((timers[op.id] || op.remainingTime) / 3600000) * 100)}%`
            }"
          />
        </div>

        <!-- Actions -->
        <div class="mt-2 flex gap-2">
          <button
            v-if="op.isComplete"
            class="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition-colors"
          >
            Claim Rewards
          </button>
          <button
            v-else
            class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-gray-400">
      <div class="text-4xl mb-2">🌍</div>
      <div class="text-sm">No active operations</div>
      <div class="text-xs text-gray-500 mt-1">Deploy your team to start earning!</div>

      <NuxtLink
        to="/expeditions"
        class="mt-4 inline-block px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
      >
        Start New Expedition
      </NuxtLink>
    </div>
  </div>
</template>
```

### 4.3 Quick Actions Panel (`/components/dashboard/QuickActionsPanel.vue`)

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  {
    icon: '🗺️',
    label: 'Deploy Expedition',
    description: 'Send heroes on missions',
    to: '/expeditions',
    color: 'from-blue-500 to-purple-500'
  },
  {
    icon: '🍺',
    label: 'Visit Tavern',
    description: 'Recruit new heroes',
    to: '/tavern',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: '👥',
    label: 'Manage Heroes',
    description: 'Level up and equip',
    to: '/heroes',
    color: 'from-green-500 to-blue-500'
  },
  {
    icon: '⚔️',
    label: 'Sort Equipment',
    description: 'Organize your gear',
    to: '/equipment',
    color: 'from-purple-500 to-pink-500'
  }
]
</script>

<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
      <span>⚡</span>
      <span>Quick Actions</span>
    </h2>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="action in actions"
        :key="action.to"
        @click="router.push(action.to)"
        class="group p-4 bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg transition-all text-left"
      >
        <div class="text-3xl mb-2">{{ action.icon }}</div>
        <div class="font-semibold text-sm mb-1 group-hover:text-purple-400 transition-colors">
          {{ action.label }}
        </div>
        <div class="text-xs text-gray-500">
          {{ action.description }}
        </div>
      </button>
    </div>
  </div>
</template>
```

### 4.4 Phase 2 Preview Widget (`/components/dashboard/Phase2PreviewWidget.vue`)

```vue
<script setup lang="ts">
import { ref } from 'vue'

const showUpgradeModal = ref(false)

function handleUnlock() {
  showUpgradeModal.value = true
  // TODO: Integrate with existing UpgradeModal component
  console.log('Show upgrade modal')
}
</script>

<template>
  <div class="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg border-2 border-purple-500/30 p-6 relative overflow-hidden">
    <!-- Lock Overlay -->
    <div class="absolute top-4 right-4 text-4xl opacity-20">🔒</div>

    <h2 class="text-xl font-bold mb-3 flex items-center gap-2 text-purple-300">
      <span>🏰</span>
      <span>Personal Dungeons</span>
    </h2>

    <div class="text-sm text-gray-300 space-y-2 mb-4">
      <p>
        <strong>Premium Feature</strong> - Build custom dungeons with captured monsters!
      </p>
      <ul class="text-xs text-gray-400 space-y-1 ml-4">
        <li>✨ Capture monsters during expeditions</li>
        <li>🎯 Farm optimized resources</li>
        <li>🏗️ Your dungeon, your rules</li>
      </ul>
    </div>

    <button
      @click="handleUnlock"
      class="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
    >
      Unlock Full Game - $9.99
    </button>

    <div class="text-xs text-center text-gray-500 mt-2">
      One-time purchase • All features • No subscriptions
    </div>
  </div>
</template>
```

---

## 🔄 Step 5: Update Routing & Middleware

### 5.1 Update Index Page (`/pages/index.vue`)

```vue
<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

definePageMeta({
  layout: false // Use no layout for landing page
})

// Redirect authenticated users to dashboard
if (authStore.isAuthenticated) {
  navigateTo('/dashboard')
}
</script>

<template>
  <!-- Keep existing landing page content for unauthenticated users -->
  <div class="min-h-screen bg-gray-900">
    <!-- Your existing landing page code -->
  </div>
</template>
```

### 5.2 Auth Middleware (`/middleware/auth.ts`)

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // If authenticated and visiting root, redirect to dashboard
  if (to.path === '/' && authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
```

---

## ✅ Implementation Checklist

### Week 1: Layout & Navigation

- [ ] Create `/layouts/default.vue`
- [ ] Create `/layouts/auth.vue`
- [ ] Update `/components/Navigation.vue` with badges and locked states
- [ ] Create `/components/NavLink.vue`
- [ ] Create `/components/MobileNavDrawer.vue`
- [ ] Create `/components/MobileNavLink.vue`
- [ ] Create `/components/UserMenu.vue`
- [ ] Apply `layout: 'default'` to all authenticated pages
- [ ] Apply `layout: 'auth'` to login/signup pages
- [ ] Test navigation on desktop
- [ ] Test mobile navigation drawer

### Week 2: Dashboard Core

- [ ] Create `/pages/dashboard.vue`
- [ ] Create `/composables/useDashboard.ts`
- [ ] Update auth redirect logic (root → dashboard for authenticated users)
- [ ] Create dashboard grid layout (responsive)
- [ ] Test auto-refresh functionality
- [ ] Test loading states

### Week 3: Dashboard Widgets

- [ ] Create `/components/dashboard/PlayerStatusWidget.vue`
- [ ] Create `/components/dashboard/ActiveOperationsWidget.vue`
- [ ] Create `/components/dashboard/NotificationsWidget.vue` (basic version)
- [ ] Create `/components/dashboard/QuickActionsPanel.vue`
- [ ] Create `/components/dashboard/AvailableExpeditionsWidget.vue`
- [ ] Create `/components/dashboard/QuickStatsWidget.vue`
- [ ] Create `/components/dashboard/Phase2PreviewWidget.vue`
- [ ] Test all widgets with real data
- [ ] Test empty states
- [ ] Test mobile responsive layout

### Week 4: Polish & QA

- [ ] Add loading skeletons for dashboard widgets
- [ ] Implement real-time timer updates (Active Operations)
- [ ] Add page transitions
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Lighthouse audit (Performance, Accessibility, Best Practices)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile device testing (iOS, Android)
- [ ] Fix any bugs
- [ ] Code review

---

## 🎨 Styling Guidelines

**Use Tailwind utility classes for consistency:**

```vue
<!-- Cards -->
<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">

<!-- Buttons - Primary -->
<button class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors">

<!-- Buttons - Secondary -->
<button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors">

<!-- Text Heading -->
<h2 class="text-xl font-bold text-white">

<!-- Text Body -->
<p class="text-sm text-gray-300">

<!-- Text Muted -->
<span class="text-xs text-gray-400">

<!-- Progress Bar Container -->
<div class="w-full h-2 bg-gray-900 rounded-full overflow-hidden">

<!-- Progress Bar Fill -->
<div class="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all" :style="{ width: '75%' }">

<!-- Badge -->
<span class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">

<!-- Border Accent -->
<div class="border-l-4 border-purple-500">
```

---

## 🚀 Deployment Notes

**Environment Variables** (`.env`):
```bash
# Supabase
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App Config
NUXT_PUBLIC_APP_URL=https://dungeonfarmers.com
```

**Build Command:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

**Deploy to Vercel:**
```bash
vercel --prod
```

---

## 📚 Additional Resources

**Documentation:**
- [Nuxt 3 Layouts](https://nuxt.com/docs/guide/directory-structure/layouts)
- [Nuxt 3 Middleware](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

**Testing:**
- [Vitest](https://vitest.dev/) - Unit tests
- [Playwright](https://playwright.dev/) - E2E tests
- [Vue Test Utils](https://test-utils.vuejs.org/) - Component tests

---

**Implementation Guide Owner**: Development Team
**Last Updated**: 2025-11-22
**Status**: ✅ Ready for Implementation
**Estimated Timeline**: 3-4 weeks (4 sprints)
