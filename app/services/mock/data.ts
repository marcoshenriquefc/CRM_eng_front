import type { AuthUser, Workspace } from '~/types/domain'

export const mockWorkspace: Workspace = { id: 'wk_1', name: 'CRM Engenharia' }
export const mockUser: AuthUser = {
  id: 'usr_1',
  name: 'Usuário Demo',
  email: 'admin@crm.local',
  roles: [{ id: 'role_1', code: 'ADMIN', name: 'Administrador' }],
  permissions: ['dashboard:view', 'leads:read', 'leads:create', 'settings:users']
}
