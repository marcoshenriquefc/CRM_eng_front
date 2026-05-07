import type { LoginCredentials, LoginResponse, AuthMeResponse } from '~/types/auth'

export const useAuth = () => {
    const store = useAuthStore()
    const { request } = useApi()

    const fetchMe = async () => {
        store.status = 'checking'
        const res = await request<AuthMeResponse>('/auth/me')
        if (res.success) store.setSession({ user: res.data.user, workspace: res.data.workspace })
        else store.clearSession()
    }

    const login = async (credentials: LoginCredentials) => {
        const res = await request<LoginResponse>('/auth/login', { method: 'POST', body: credentials })
        if (res.success)
            store.setSession({
                user: res.data.user,
                workspace: res.data.workspace,
                accessToken: res.data.accessToken ?? null,
            })
        return res
    }

    const logout = async () => {
        await request('/auth/logout', { method: 'POST' })
        store.clearSession()
        await navigateTo('/login')
    }

    return {
        login,
        logout,
        refresh: () => request('/auth/refresh', { method: 'POST' }),
        fetchMe,
        hasRole: (r: string) => store.hasRole(r),
        hasPermission: (p: string) => store.hasPermission(p),
        can: (p: string) => store.hasPermission(p),
        isAuthenticated: computed(() => store.isAuthenticated),
        user: computed(() => store.user),
        roles: computed(() => store.roles),
        permissions: computed(() => store.permissions),
        workspace: computed(() => store.workspace),
    }
}
