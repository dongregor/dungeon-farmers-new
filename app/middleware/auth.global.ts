export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()

  // Wait for session restoration to complete
  const { data: { session } } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  // Landing page (/) is public but authenticated users get redirected
  const publicPaths = ['/', '/login', '/register', '/auth/']
  const isPublicRoute = publicPaths.some(path =>
    path === '/' ? to.path === '/' : to.path.startsWith(path)
  )

  // If not authenticated and not on a public route, redirect to login
  if (!session && !isPublicRoute) {
    return navigateTo('/login')
  }

  // Skip guild check for unauthenticated users
  if (!session) {
    return
  }

  // Admin routes: require auth but skip guild check (admin access checked server-side)
  if (to.path.startsWith('/admin')) {
    return
  }

  // Check if guild is initialized (client-side only to avoid SSR complexity)
  // On server-side, we skip the check and let client-side handle it
  if (import.meta.server) {
    return
  }

  // Always check API for guild status (source of truth)
  // localStorage is only used as cache after API confirms
  let hasGuild = false

  try {
    const status = await $fetch<{ hasGuild: boolean }>('/api/guild-master/status')
    hasGuild = status.hasGuild

    // Update localStorage cache
    if (hasGuild) {
      localStorage.setItem('guild_initialized', 'true')
    } else {
      localStorage.removeItem('guild_initialized')
    }
  } catch {
    // API failed - fallback to localStorage but this should be rare
    hasGuild = localStorage.getItem('guild_initialized') === 'true'
  }

  // If authenticated but no guild, redirect to welcome (except if already there)
  if (!hasGuild && to.path !== '/welcome') {
    return navigateTo('/welcome')
  }

  // If authenticated with guild and on welcome page, redirect to dashboard
  if (hasGuild && to.path === '/welcome') {
    return navigateTo('/dashboard')
  }

  // If authenticated and on landing/auth pages, redirect to dashboard
  if (to.path === '/' || to.path.startsWith('/login') || to.path.startsWith('/register')) {
    return navigateTo(hasGuild ? '/dashboard' : '/welcome')
  }
})
