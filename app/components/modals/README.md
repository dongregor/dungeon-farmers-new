# Modal Components

Foundation modal components for Dungeon Farmers UI.

## Components

### BaseModal

A reusable modal wrapper component with full accessibility support.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | - | Controls modal visibility (v-model) |
| `title` | `string` | `''` | Modal title (optional) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal width |
| `closable` | `boolean` | `true` | Show close button |
| `closeOnOverlay` | `boolean` | `true` | Close when clicking backdrop |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when modal should close |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Modal content |
| `header` | Custom header (optional, overrides title) |
| `footer` | Modal footer with actions |

#### Features

- **Focus Trap**: Keeps keyboard focus within the modal
- **ESC to Close**: Press ESC key to close modal
- **Backdrop Click**: Click outside to close (when `closeOnOverlay` is true)
- **Scroll Lock**: Prevents body scrolling when modal is open
- **Animations**: Smooth fade + scale transitions
- **Accessibility**: Full ARIA attributes and keyboard navigation
- **Teleport**: Renders in `<body>` for proper stacking context

#### Usage Example

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <button @click="isOpen = true">
    Open Modal
  </button>

  <BaseModal
    v-model="isOpen"
    title="Example Modal"
    size="md"
  >
    <p>This is the modal content.</p>

    <template #footer>
      <div class="flex gap-3">
        <button
          class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
          @click="isOpen = false"
        >
          Cancel
        </button>
        <button
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          @click="handleSave"
        >
          Save
        </button>
      </div>
    </template>
  </BaseModal>
</template>
```

---

### ConfirmationDialog

A confirmation dialog built on top of `BaseModal` with styled variants.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | - | Controls dialog visibility (v-model) |
| `title` | `string` | `'Confirm'` | Dialog title |
| `message` | `string` | - | Confirmation message (required) |
| `confirmText` | `string` | `'Confirm'` | Confirm button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text |
| `variant` | `'danger' \| 'warning' \| 'info'` | `'info'` | Visual style variant |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted when dialog should close |
| `confirm` | - | Emitted when user confirms |
| `cancel` | - | Emitted when user cancels |

#### Variants

- **`danger`**: Red styling for destructive actions (delete, remove, etc.)
- **`warning`**: Yellow styling for cautionary actions
- **`info`**: Blue styling for informational confirmations

#### Usage Example

```vue
<script setup lang="ts">
const showConfirm = ref(false)

const handleDelete = () => {
  showConfirm.value = true
}

const onConfirm = () => {
  // Perform deletion
  console.log('Deleting item...')
}

const onCancel = () => {
  console.log('Cancelled')
}
</script>

<template>
  <button @click="handleDelete">
    Delete Item
  </button>

  <ConfirmationDialog
    v-model="showConfirm"
    title="Delete Item"
    message="Are you sure you want to delete this item? This action cannot be undone."
    confirm-text="Delete"
    cancel-text="Keep It"
    variant="danger"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
```

---

## Design Decisions

### Auto-Import Support

Both components are auto-imported by Nuxt 4, so no manual imports are needed:

```vue
<!-- ✅ No import needed -->
<template>
  <BaseModal v-model="isOpen" title="Hello">
    Content here
  </BaseModal>
</template>
```

### Accessibility

- **ARIA attributes**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Focus management**: Auto-focus first focusable element on open
- **Focus trap**: Tab navigation stays within modal
- **Keyboard support**: ESC to close
- **Screen reader support**: Proper semantic structure

### Z-Index Strategy

- Modal overlay: `z-50`
- Multiple modals stack properly via Teleport to body
- Future: Could add `z-index` prop if nested modals are needed

### Performance

- Uses Teleport to avoid CSS stacking context issues
- Smooth transitions without layout shifts
- Scroll lock prevents body scrolling without jumps

---

## Migration Guide

### Replacing Inline Modals

**Before** (inline modal):
```vue
<div
  v-if="show"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  @click.self="handleClose"
>
  <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    <div>{{ content }}</div>
    <button @click="handleClose">Close</button>
  </div>
</div>
```

**After** (using BaseModal):
```vue
<BaseModal v-model="show" :title="title">
  {{ content }}

  <template #footer>
    <button @click="show = false">Close</button>
  </template>
</BaseModal>
```

### Replacing browser confirm()

**Before**:
```vue
<script setup lang="ts">
const deleteItem = () => {
  if (confirm('Are you sure?')) {
    // Delete logic
  }
}
</script>
```

**After**:
```vue
<script setup lang="ts">
const showConfirm = ref(false)

const deleteItem = () => {
  showConfirm.value = true
}

const onConfirm = () => {
  // Delete logic
}
</script>

<template>
  <ConfirmationDialog
    v-model="showConfirm"
    message="Are you sure?"
    variant="danger"
    @confirm="onConfirm"
  />
</template>
```

---

## Future Enhancements

Potential additions based on UI Implementation Plan:

1. **RewardModal**: Animated loot reveal modal
2. **ComparisonModal**: Side-by-side item/hero comparison
3. **TutorialOverlay**: Spotlight + tooltip system for tutorials
4. **ModalStack**: Manage multiple modals with a stack service

---

## Testing

Both components should be tested for:

- [ ] Opening and closing behavior
- [ ] ESC key closing
- [ ] Overlay click closing
- [ ] Focus trap functionality
- [ ] Scroll lock behavior
- [ ] Accessibility (ARIA, keyboard navigation)
- [ ] Different size variants
- [ ] Different confirmation variants
- [ ] Multiple modals stacking

---

*Created: 2025-12-30*
*Based on: UI Implementation Plan - Sprint 1: Foundation*
