import type { AuthUser, Workspace } from '~/types/domain'

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthMeResponse {
    user: AuthUser
    workspace: Workspace | null
}

export interface LoginResponse extends AuthMeResponse {
    accessToken?: string
}
