<script setup lang="ts">
definePageMeta({
  layout: false,
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')

// Redirect if already logged in
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/')
  }
}, { immediate: true })

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (isSignUp.value) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (signUpError) throw signUpError
      error.value = 'Check your email to confirm your account!'
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (signInError) throw signInError
      navigateTo('/')
    }
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">
          Dungeon Farmers
        </h1>
        <p class="text-gray-400">
          {{ isSignUp ? 'Create your account' : 'Welcome back, Guild Master' }}
        </p>
      </div>

      <!-- Form -->
      <form
        class="bg-gray-800 rounded-lg shadow-xl p-8"
        @submit.prevent="handleSubmit"
      >
        <!-- Error message -->
        <div
          v-if="error"
          class="mb-4 p-3 rounded-lg text-sm"
          :class="error.includes('Check your email') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'"
        >
          {{ error }}
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          >
        </div>

        <!-- Password -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          >
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>{{ isSignUp ? 'Create Account' : 'Sign In' }}</span>
        </button>

        <!-- Toggle sign up/sign in -->
        <div class="mt-6 text-center">
          <button
            type="button"
            class="text-blue-400 hover:text-blue-300 text-sm"
            @click="isSignUp = !isSignUp; error = ''"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
