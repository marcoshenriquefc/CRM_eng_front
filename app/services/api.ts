import { mockApi } from './mock/apiMock'
import type { ApiResponse } from '~/types/api'

export async function apiRequest<T>(
    url: string,
    opts: Parameters<typeof $fetch>[1] & { accessToken?: string | null } = {},
): Promise<ApiResponse<T>> {
    const config = useRuntimeConfig()
    const useMock = config.public.useMockApi === 'true' || config.public.useMockApi === true

    if (useMock) {
        return mockApi<T>(url, { method: (opts.method as string | undefined) ?? 'GET', body: opts.body })
    }

    return $fetch<ApiResponse<T>>(url, {
        baseURL: config.public.apiBaseUrl,
        ...opts,
        headers: {
            ...(opts.headers || {}),
            ...(opts.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : {}),
        },
    })
}
