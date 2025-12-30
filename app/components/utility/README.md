# Utility Components

Foundation utility components for Dungeon Farmers UI.

## Components

### LoadingSpinner

Animated loading indicator for async operations.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `color`: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange' | 'white' (default: 'blue')

**Usage:**
```vue
<template>
  <!-- Default spinner -->
  <UtilityLoadingSpinner />

  <!-- Large green spinner -->
  <UtilityLoadingSpinner size="lg" color="green" />

  <!-- Centered in a container -->
  <div class="flex justify-center items-center h-64">
    <UtilityLoadingSpinner size="md" color="blue" />
  </div>
</template>
```

**Accessibility:**
- Uses `role="status"` and `aria-live="polite"`
- Includes screen reader text "Loading..."

---

### EmptyState

Display message when a collection or view has no content.

**Props:**
- `title`: string (required) - Main heading
- `description`: string (optional) - Explanatory text

**Slots:**
- `icon`: Optional icon/illustration to display above title
- `action`: Optional action button or link

**Usage:**
```vue
<template>
  <!-- Basic empty state -->
  <UtilityEmptyState
    title="No heroes yet"
    description="Visit the tavern to recruit your first hero!"
  />

  <!-- With icon and action -->
  <UtilityEmptyState
    title="No expeditions available"
    description="Complete more zones to unlock new expeditions."
  >
    <template #icon>
      <svg class="w-16 h-16" viewBox="0 0 24 24">
        <!-- Icon SVG -->
      </svg>
    </template>
    <template #action>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Explore Zones
      </button>
    </template>
  </UtilityEmptyState>
</template>
```

---

### Toast

Toast notification for user feedback messages.

**Props:**
- `message`: string (required) - Notification text
- `type`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `duration`: number (default: 3000) - Auto-dismiss duration in ms (0 = no auto-dismiss)
- `dismissible`: boolean (default: true) - Show close button

**Events:**
- `close`: Emitted when toast is dismissed

**Usage:**
```vue
<script setup lang="ts">
const showToast = ref(false)

const handleSuccess = () => {
  showToast.value = true
}
</script>

<template>
  <button @click="handleSuccess">Show Success</button>

  <!-- Success toast -->
  <UtilityToast
    v-if="showToast"
    message="Hero successfully recruited!"
    type="success"
    @close="showToast = false"
  />

  <!-- Error toast (non-dismissible, longer duration) -->
  <UtilityToast
    message="Failed to connect to server"
    type="error"
    :duration="5000"
    :dismissible="false"
  />

  <!-- Warning toast -->
  <UtilityToast
    message="Your expedition will expire soon"
    type="warning"
  />

  <!-- Info toast -->
  <UtilityToast
    message="New content available!"
    type="info"
  />
</template>
```

**Accessibility:**
- Uses `role="alert"` and `aria-live="polite"`
- Includes proper focus management for close button
- Animated entrance/exit transitions

**Note:** For a full toast notification system, consider creating a composable or store to manage multiple toasts in a toast container.

---

### SkeletonLoader

Loading placeholder with shimmer animation.

**Props:**
- `variant`: 'text' | 'card' | 'avatar' | 'button' (default: 'text')
- `lines`: number (default: 3) - Number of text lines (text variant only)
- `width`: string (optional) - Custom width
- `height`: string (optional) - Custom height

**Usage:**
```vue
<template>
  <!-- Text skeleton (3 lines by default) -->
  <UtilitySkeletonLoader variant="text" />

  <!-- Text with custom lines -->
  <UtilitySkeletonLoader variant="text" :lines="5" />

  <!-- Card skeleton -->
  <UtilitySkeletonLoader variant="card" />

  <!-- Avatar skeleton -->
  <UtilitySkeletonLoader variant="avatar" />

  <!-- Button skeleton -->
  <UtilitySkeletonLoader variant="button" />

  <!-- Custom dimensions -->
  <UtilitySkeletonLoader variant="card" width="300px" height="200px" />

  <!-- Hero card skeleton -->
  <div class="bg-white rounded-lg p-4 shadow">
    <div class="flex items-center gap-4 mb-4">
      <UtilitySkeletonLoader variant="avatar" />
      <div class="flex-1">
        <UtilitySkeletonLoader variant="text" :lines="2" />
      </div>
    </div>
    <UtilitySkeletonLoader variant="card" height="100px" />
  </div>
</template>
```

**Accessibility:**
- Uses `role="status"` and `aria-busy="true"`
- Includes screen reader text "Loading..."

---

## Design System Integration

All components follow the existing Dungeon Farmers design system:

- **Colors**: Match ProgressBar color variants (blue, green, purple, yellow, red, orange)
- **Sizes**: Consistent sm/md/lg sizing system
- **Spacing**: Uses Tailwind spacing scale
- **Animations**: Smooth transitions with Tailwind animation utilities
- **Accessibility**: ARIA attributes and screen reader support

## Auto-Import

These components are automatically imported in Nuxt 4. Use them with the `Utility` prefix:

```vue
<template>
  <UtilityLoadingSpinner />
  <UtilityEmptyState title="No content" />
  <UtilityToast message="Success!" type="success" />
  <UtilitySkeletonLoader variant="card" />
</template>
```

No imports required!
