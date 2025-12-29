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

  // If authenticated and on auth pages, redirect to home
  if (session && (to.path.startsWith('/login') || to.path.startsWith('/register'))) {
    return navigateTo('/')
  }
})
