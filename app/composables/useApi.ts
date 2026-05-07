import { apiRequest } from '~/services/api'
import type { ApiResponse } from '~/types/api'

export const useApi = () => {
    const auth = useAuthStore()

    const request = async <T>(url: string, opts: Parameters<typeof $fetch>[1] = {}) => {
        try {
            return await apiRequest<T>(url, { ...opts, accessToken: auth.accessToken })
        } catch {
            throw createError({ statusCode: 500, statusMessage: 'Falha de rede. Tente novamente.' })
        }
    }

    return { request }
}
