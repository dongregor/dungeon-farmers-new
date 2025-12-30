<script setup lang="ts">
// Demo page showcasing all form components
const username = ref('')
const email = ref('')
const password = ref('')
const emailError = ref('')
const selectedRarity = ref('')
const selectedRole = ref('')
const agreeToTerms = ref(false)
const subscribe = ref(false)
const darkMode = ref(false)
const autoEquip = ref(true)
const notifications = ref(true)
const isLoading = ref(false)
const submitLoading = ref(false)

const rarityOptions = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' }
]

const roleOptions = [
  { value: 'warrior', label: 'Warrior' },
  { value: 'mage', label: 'Mage' },
  { value: 'rogue', label: 'Rogue' },
  { value: 'healer', label: 'Healer' }
]

const handleSubmit = () => {
  submitLoading.value = true
  setTimeout(() => {
    submitLoading.value = false
    alert('Form submitted!')
  }, 2000)
}

const handleTestError = () => {
  emailError.value = email.value ? '' : 'Email is required'
}

const handleTestLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-guild-gold mb-8">Form Components Demo</h1>

      <!-- Buttons Section -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">BaseButton</h2>

        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-2">Variants</h3>
            <div class="flex flex-wrap gap-2">
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-2">Sizes</h3>
            <div class="flex flex-wrap items-center gap-2">
              <BaseButton size="sm">Small</BaseButton>
              <BaseButton size="md">Medium</BaseButton>
              <BaseButton size="lg">Large</BaseButton>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-400 mb-2">States</h3>
            <div class="flex flex-wrap gap-2">
              <BaseButton :loading="isLoading" @click="handleTestLoading">
                {{ isLoading ? 'Loading...' : 'Click to Load' }}
              </BaseButton>
              <BaseButton :disabled="true">Disabled</BaseButton>
              <BaseButton variant="danger" :loading="true">Processing</BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Inputs Section -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">BaseInput</h2>

        <div class="space-y-4 max-w-md">
          <BaseInput
            v-model="username"
            label="Username"
            placeholder="Enter your username"
            hint="Must be unique and 3-20 characters"
            required
          />

          <BaseInput
            v-model="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            :error="emailError"
            required
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            hint="At least 8 characters"
          />

          <BaseInput
            model-value="Disabled input"
            label="Disabled Input"
            :disabled="true"
          />

          <div class="flex gap-2">
            <BaseButton size="sm" @click="handleTestError">
              Test Error
            </BaseButton>
            <BaseButton size="sm" variant="secondary" @click="emailError = ''">
              Clear Error
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- Select Section -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">BaseSelect</h2>

        <div class="space-y-4 max-w-md">
          <BaseSelect
            v-model="selectedRarity"
            :options="rarityOptions"
            label="Hero Rarity"
            placeholder="Select a rarity"
          />

          <BaseSelect
            v-model="selectedRole"
            :options="roleOptions"
            label="Preferred Role"
            required
          />

          <div class="text-sm text-gray-400">
            <p v-if="selectedRarity">Selected Rarity: <span class="text-white">{{ selectedRarity }}</span></p>
            <p v-if="selectedRole">Selected Role: <span class="text-white">{{ selectedRole }}</span></p>
          </div>
        </div>
      </section>

      <!-- Checkbox Section -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">BaseCheckbox</h2>

        <div class="space-y-4">
          <BaseCheckbox
            v-model="agreeToTerms"
            label="I agree to the terms and conditions"
          />

          <BaseCheckbox
            v-model="subscribe"
            label="Subscribe to newsletter"
            description="Receive updates about new features and events"
          />

          <BaseCheckbox
            :model-value="true"
            label="Disabled checkbox (checked)"
            :disabled="true"
          />

          <BaseCheckbox
            :model-value="false"
            label="Disabled checkbox (unchecked)"
            :disabled="true"
          />

          <div class="text-sm text-gray-400">
            <p>Terms accepted: <span class="text-white">{{ agreeToTerms }}</span></p>
            <p>Newsletter: <span class="text-white">{{ subscribe }}</span></p>
          </div>
        </div>
      </section>

      <!-- Toggle Section -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">BaseToggle</h2>

        <div class="space-y-4">
          <BaseToggle
            v-model="darkMode"
            label="Dark Mode"
            description="Enable dark theme for the application"
          />

          <BaseToggle
            v-model="autoEquip"
            label="Auto-equip better items"
            description="Automatically equip items with higher stats"
          />

          <BaseToggle
            v-model="notifications"
            label="Push Notifications"
            description="Receive notifications when expeditions complete"
          />

          <BaseToggle
            :model-value="false"
            label="Disabled toggle"
            :disabled="true"
          />

          <div class="text-sm text-gray-400">
            <p>Dark Mode: <span class="text-white">{{ darkMode }}</span></p>
            <p>Auto-equip: <span class="text-white">{{ autoEquip }}</span></p>
            <p>Notifications: <span class="text-white">{{ notifications }}</span></p>
          </div>
        </div>
      </section>

      <!-- Form Example -->
      <section class="mb-12 bg-gray-800 rounded-lg p-6">
        <h2 class="text-2xl font-semibold text-white mb-4">Complete Form Example</h2>

        <form class="space-y-4 max-w-md" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="username"
            label="Guild Name"
            placeholder="Enter your guild name"
            required
          />

          <BaseSelect
            v-model="selectedRole"
            :options="roleOptions"
            label="Main Role"
            placeholder="Choose your role"
            required
          />

          <BaseCheckbox
            v-model="agreeToTerms"
            label="I agree to the terms of service"
          />

          <BaseToggle
            v-model="notifications"
            label="Enable notifications"
          />

          <div class="flex gap-2 pt-4">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="submitLoading"
              :disabled="!agreeToTerms"
            >
              {{ submitLoading ? 'Creating...' : 'Create Account' }}
            </BaseButton>
            <BaseButton type="button" variant="ghost">
              Cancel
            </BaseButton>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>
