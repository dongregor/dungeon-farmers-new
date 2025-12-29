export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // If not authenticated and not on login page, redirect to login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If authenticated and on login page, redirect to home
  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})
