export const useAuth = () => {
  const store = useAuthStore()
  const { request } = useApi()

  const fetchMe = async () => {
    store.status = 'checking'
    const res = await request<{ user: any; workspace: any }>('/auth/me')
    if (res.success) store.setSession({ user: res.data.user, workspace: res.data.workspace })
    else store.clearSession()
  }

  return {
    login: (credentials: { email: string; password: string }) => request('/auth/login', { method: 'POST', body: credentials }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    refresh: () => request('/auth/refresh', { method: 'POST' }),
    fetchMe,
    hasRole: (r: string) => store.hasRole(r),
    hasPermission: (p: string) => store.hasPermission(p),
    can: (p: string) => store.hasPermission(p),
    isAuthenticated: computed(() => store.isAuthenticated),
    user: computed(() => store.user),
    roles: computed(() => store.roles),
    permissions: computed(() => store.permissions),
    workspace: computed(() => store.workspace)
  }
}
