import type { ApiResponse } from '~/types/api'
import { mockUser, mockWorkspace } from './data'

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data, meta: { requestId: crypto.randomUUID(), timestamp: new Date().toISOString() } })

export async function mockApi<T>(url: string, opts: { method?: string; body?: unknown }): Promise<ApiResponse<T>> {
  await new Promise((r) => setTimeout(r, 120))
  const method = opts.method ?? 'GET'

  if (url === '/auth/me' && method === 'GET') return ok({ user: mockUser, workspace: mockWorkspace } as T)
  if (url === '/auth/login' && method === 'POST') return ok({ user: mockUser, workspace: mockWorkspace, accessToken: 'mock_access_token' } as T)
  if (url === '/auth/refresh' && method === 'POST') return ok({ user: mockUser, workspace: mockWorkspace, accessToken: 'mock_access_token_refreshed' } as T)
  if (url === '/auth/logout' && method === 'POST') return ok({ done: true } as T)

  return ok({} as T)
}
