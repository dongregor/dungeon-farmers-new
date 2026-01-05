export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()

  // Wait for session restoration to complete
  const { data: { session } } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicPaths = ['/login', '/register', '/auth/']
  const isPublicRoute = publicPaths.some(path => to.path.startsWith(path))

  // If not authenticated and not on a public route, redirect to login
  if (!session && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Skip guild check for unauthenticated users or public routes
  if (!session) {
    return
  }

  // Check if guild is initialized (client-side only to avoid SSR complexity)
  // On server-side, we skip the check and let client-side handle it
  if (import.meta.server) {
    return
  }

  // Client-side: check localStorage first for fast response
  let hasGuild = localStorage.getItem('guild_initialized') === 'true'

  // If no local status, fetch from API
  if (!hasGuild) {
    try {
      const status = await $fetch<{ hasGuild: boolean }>('/api/guild-master/status')
      hasGuild = status.hasGuild
      if (hasGuild) {
        localStorage.setItem('guild_initialized', 'true')
      }
    } catch {
      // API failed, rely on localStorage value (false)
    }
  }

  // If authenticated but no guild, redirect to welcome (except if already there)
  if (!hasGuild && to.path !== '/welcome') {
    return navigateTo('/welcome')
  }

  // If authenticated with guild and on welcome page, redirect to home
  if (hasGuild && to.path === '/welcome') {
    return navigateTo('/')
  }

  // If authenticated and on auth pages, redirect appropriately
  if (to.path.startsWith('/login') || to.path.startsWith('/register')) {
    return navigateTo(hasGuild ? '/' : '/welcome')
  }
})
