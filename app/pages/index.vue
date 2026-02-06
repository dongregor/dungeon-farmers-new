<script setup lang="ts">
definePageMeta({
  layout: false,
  title: 'Dungeon Farmers - Build Your Guild, Farm Your Dungeons',
})

const user = useSupabaseUser()

// Redirect logged-in users to dashboard
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <!-- Navigation -->
    <nav class="absolute top-0 left-0 right-0 z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⚔️</span>
          <span class="text-xl font-bold text-white">Dungeon Farmers</span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/login"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <!-- Background decorations -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div class="relative max-w-4xl mx-auto text-center">
        <div class="text-7xl mb-6">⚔️</div>
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Build Your Guild.
          <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Farm Your Dungeons.
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage quirky heroes, send them on expeditions, capture monsters,
          and build your own farmable dungeons in this idle RPG.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/register"
            class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            Start Your Adventure
          </NuxtLink>
          <NuxtLink
            to="/login"
            class="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            Sign In
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          What Awaits You
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1: Heroes -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div class="text-5xl mb-4">👥</div>
            <h3 class="text-xl font-bold text-white mb-3">Quirky Heroes</h3>
            <p class="text-gray-400">
              Randomly generated heroes with unique traits and personalities.
              Each hero tells their own story through expedition logs.
            </p>
          </div>

          <!-- Feature 2: Expeditions -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div class="text-5xl mb-4">🗺️</div>
            <h3 class="text-xl font-bold text-white mb-3">Epic Expeditions</h3>
            <p class="text-gray-400">
              Send heroes on adventures across diverse zones.
              Read their emergent stories and collect valuable loot.
            </p>
          </div>

          <!-- Feature 3: Dungeons -->
          <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
            <div class="text-5xl mb-4">🏰</div>
            <h3 class="text-xl font-bold text-white mb-3">Player-Built Dungeons</h3>
            <p class="text-gray-400">
              Capture monsters during expeditions and build your own dungeons.
              Farm the exact loot you need.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="relative py-24 px-6 bg-black/20">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          How It Works
        </h2>

        <div class="space-y-8">
          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Create Your Guild</h3>
              <p class="text-gray-400">
                Name your guild, design your tabard, and meet your first hero.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Recruit Heroes</h3>
              <p class="text-gray-400">
                Visit the tavern to recruit new heroes. Each has unique traits that affect gameplay and stories.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Send Expeditions</h3>
              <p class="text-gray-400">
                Choose a zone, assemble your party, and send them off. Return later to collect loot and read their adventure logs.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-6">
            <div class="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              4
            </div>
            <div>
              <h3 class="text-xl font-bold text-white mb-2">Build Dungeons</h3>
              <p class="text-gray-400">
                Capture monsters and collect schematics to build your own dungeons. Stock them with monsters to farm specific loot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-24 px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Begin?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Join thousands of guild masters building their dungeon farming empires.
        </p>
        <NuxtLink
          to="/register"
          class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
        >
          Create Your Guild - It's Free
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-8 px-6 border-t border-white/10">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚔️</span>
          <span class="text-gray-400">Dungeon Farmers</span>
        </div>
        <p class="text-gray-500 text-sm">
          A lighthearted idle RPG adventure
        </p>
      </div>
    </footer>
  </div>
</template>
