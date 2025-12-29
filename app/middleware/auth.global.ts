export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/auth/']
  const isPublicRoute = publicRoutes.some(route => to.path === route || to.path.startsWith(route))

  // If not authenticated and not on a public route, redirect to login
  if (!user.value && !isPublicRoute) {
    return navigateTo('/login')
  }

  // If authenticated and on login/register page, redirect to home
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
})
