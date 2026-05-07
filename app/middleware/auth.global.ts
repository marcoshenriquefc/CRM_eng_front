import { publicRoutes } from '~/utils/routePermissions'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()
    if (publicRoutes.has(to.path)) return
    if (auth.status === 'unknown') {
        const { fetchMe } = useAuth()
        await fetchMe()
    }
    if (!auth.isAuthenticated) return navigateTo('/login')
})
