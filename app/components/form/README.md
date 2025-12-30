# Form Components

Foundation form components for Dungeon Farmers UI. These components provide consistent styling, accessibility, and TypeScript support.

## Components

### BaseButton

Consistent button styling with variants, sizes, and loading states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `disabled`: boolean (default: false)
- `loading`: boolean (default: false)
- `type`: 'button' | 'submit' | 'reset' (default: 'button')

**Usage:**
```vue
<template>
  <BaseButton variant="primary" size="md" @click="handleClick">
    Click Me
  </BaseButton>

  <BaseButton variant="danger" :loading="isLoading">
    Delete
  </BaseButton>

  <BaseButton variant="ghost" size="sm" :disabled="true">
    Disabled
  </BaseButton>
</template>
```

---

### BaseInput

Form input with error display and accessible labels.

**Props:**
- `modelValue`: string | number (required)
- `type`: string (default: 'text')
- `placeholder`: string
- `disabled`: boolean (default: false)
- `error`: string
- `label`: string
- `hint`: string
- `id`: string
- `required`: boolean (default: false)

**Usage:**
```vue
<script setup lang="ts">
const username = ref('')
const email = ref('')
const emailError = ref('')
</script>

<template>
  <BaseInput
    v-model="username"
    label="Username"
    placeholder="Enter your username"
    hint="Must be unique"
    required
  />

  <BaseInput
    v-model="email"
    type="email"
    label="Email"
    :error="emailError"
  />
</template>
```

---

### BaseSelect

Select dropdown with v-model support.

**Props:**
- `modelValue`: string | number (required)
- `options`: Array<{value: string | number, label: string, disabled?: boolean}> (required)
- `placeholder`: string
- `disabled`: boolean (default: false)
- `error`: string
- `label`: string
- `id`: string
- `required`: boolean (default: false)

**Usage:**
```vue
<script setup lang="ts">
const selectedRarity = ref('')

const rarityOptions = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary', disabled: true }
]
</script>

<template>
  <BaseSelect
    v-model="selectedRarity"
    :options="rarityOptions"
    label="Rarity"
    placeholder="Select a rarity"
  />
</template>
```

---

### BaseCheckbox

Checkbox with v-model support.

**Props:**
- `modelValue`: boolean (required)
- `label`: string
- `disabled`: boolean (default: false)
- `id`: string
- `description`: string

**Usage:**
```vue
<script setup lang="ts">
const agreeToTerms = ref(false)
const enableNotifications = ref(true)
</script>

<template>
  <BaseCheckbox
    v-model="agreeToTerms"
    label="I agree to the terms and conditions"
  />

  <BaseCheckbox
    v-model="enableNotifications"
    label="Enable notifications"
    description="Receive updates about your expeditions"
  />
</template>
```

---

### BaseToggle

Toggle switch with v-model support and smooth animation.

**Props:**
- `modelValue`: boolean (required)
- `label`: string
- `disabled`: boolean (default: false)
- `id`: string
- `description`: string

**Usage:**
```vue
<script setup lang="ts">
const darkMode = ref(false)
const autoEquip = ref(true)
</script>

<template>
  <BaseToggle
    v-model="darkMode"
    label="Dark Mode"
    description="Enable dark theme"
  />

  <BaseToggle
    v-model="autoEquip"
    label="Auto-equip better items"
    :disabled="!hasFeatureAccess"
  />
</template>
```

---

## Styling

All components use:
- **Tailwind CSS** for styling
- **Custom colors** from `tailwind.config.js` (quest-blue, danger-red, success-green, etc.)
- **Dark theme** optimized (gray-800 backgrounds, white text)
- **Consistent focus states** with ring-2 and ring-offset-2
- **Smooth transitions** (200ms duration)

## Accessibility

All components include:
- **ARIA labels** and descriptions
- **Keyboard navigation** support
- **Focus management** with visible focus rings
- **Screen reader** friendly markup
- **Disabled states** properly handled

## Auto-Import

These components are auto-imported in Nuxt 4. No need to import them manually:

```vue
<template>
  <!-- This works without imports -->
  <FormBaseButton>Click Me</FormBaseButton>
  <FormBaseInput v-model="value" />
</template>
```

## TypeScript Support

All components have full TypeScript interfaces for props and emits. Your IDE will provide autocomplete and type checking.
