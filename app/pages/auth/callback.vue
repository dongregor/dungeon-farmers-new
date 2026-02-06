<script setup lang="ts">
definePageMeta({
  layout: false,
})

const user = useSupabaseUser()
const { fetchStatus, status: guildStatus } = useGuildStatus()

// Wait for auth to complete then redirect
const timeoutId = ref<ReturnType<typeof setTimeout> | null>(null)

watch(user, async (newUser) => {
  if (newUser) {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    await fetchStatus(true) // Force fresh check from API
    navigateTo(guildStatus.value.hasGuild ? '/dashboard' : '/welcome')
  }
}, { immediate: true })

// Fallback redirect after timeout
onMounted(() => {
  timeoutId.value = setTimeout(() => {
    if (!user.value) {
      navigateTo('/login')
    }
  }, 5000)
})

onUnmounted(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
      <p class="text-gray-400">
        Completing sign in...
      </p>
    </div>
  </div>
</template>
