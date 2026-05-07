import { routePermissions } from '~/utils/routePermissions'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const required = (to.meta.permissions as string[] | undefined) || (to.meta.permission ? [to.meta.permission as string] : routePermissions[to.path] || [])
  if (!required.length) return
  const mode = (to.meta.permissionMode as 'all' | 'any' | undefined) ?? 'all'
  const ok = mode === 'all' ? auth.hasAllPermissions(required) : auth.hasAnyPermissions(required)
  if (!ok) return navigateTo('/403')
})
