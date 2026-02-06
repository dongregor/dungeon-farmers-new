<script setup lang="ts">
const toast = useToast()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <TransitionGroup
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
        move-class="transition-all duration-300"
      >
        <div
          v-for="t in toast.toasts.value"
          :key="t.id"
          class="pointer-events-auto"
        >
          <UtilityToast
            :id="t.id"
            :title="t.title"
            :message="t.message"
            :type="t.type"
            :dismissible="t.dismissible"
            @close="toast.dismiss"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
