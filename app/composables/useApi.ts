import type { ApiResponse } from '~/types/api'

export const useApi = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const request = async <T>(url: string, opts: Parameters<typeof $fetch>[1] = {}) => {
    try {
      return await $fetch<ApiResponse<T>>(url, {
        baseURL: config.public.apiBaseUrl,
        ...opts,
        headers: { ...(opts.headers || {}), ...(auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}) },
        async onResponseError(ctx) {
          if (ctx.response.status === 401) auth.clearSession()
        }
      })
    } catch {
      throw createError({ statusCode: 500, statusMessage: 'Falha de rede. Tente novamente.' })
    }
  }

  return { request }
}
