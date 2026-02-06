<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <AppSidebar />
    <main class="ml-64 min-h-screen">
      <div class="container mx-auto px-6 py-6">
        <slot />
      </div>
    </main>

    <!-- Toast Notifications -->
    <UtilityToastContainer />
  </div>
</template>