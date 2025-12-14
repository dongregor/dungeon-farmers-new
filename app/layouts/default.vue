<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppHeader />
    <main class="container mx-auto px-4 py-6 pb-20">
      <slot />
    </main>
    <AppNav />
  </div>
</template>