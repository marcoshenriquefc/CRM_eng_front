import { defineStore } from 'pinia'
import type { AuthUser, Workspace } from '~/types/domain'

export type AuthStatus = 'unknown'|'checking'|'authenticated'|'unauthenticated'|'expired'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    workspace: null as Workspace | null,
    roles: [] as string[],
    permissions: [] as string[],
    status: 'unknown' as AuthStatus,
    accessToken: null as string | null,
    lastCheckedAt: null as string | null
  }),
  getters: {
    isAuthenticated: (s) => s.status === 'authenticated',
    hasRole: (s) => (r: string) => s.roles.includes(r),
    hasPermission: (s) => (p: string) => s.permissions.includes(p),
    hasAnyPermissions: (s) => (perms: string[]) => perms.some((p) => s.permissions.includes(p)),
    hasAllPermissions: (s) => (perms: string[]) => perms.every((p) => s.permissions.includes(p))
  },
  actions: {
    setSession(payload: { user: AuthUser; workspace?: Workspace | null; accessToken?: string | null }) {
      this.user = payload.user
      this.workspace = payload.workspace ?? null
      this.roles = payload.user.roles.map((r) => r.code)
      this.permissions = payload.user.permissions
      this.accessToken = payload.accessToken ?? null
      this.status = 'authenticated'
      this.lastCheckedAt = new Date().toISOString()
    },
    clearSession() {
      this.user = null
      this.workspace = null
      this.roles = []
      this.permissions = []
      this.accessToken = null
      this.status = 'unauthenticated'
    }
  }
})
