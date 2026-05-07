export const publicRoutes = new Set(['/login', '/forgot-password', '/reset-password', '/session-expired', '/403', '/404'])
export const routePermissions: Record<string, string[]> = {
  '/dashboard': ['dashboard:view'],
  '/leads': ['leads:read'],
  '/leads/create': ['leads:create'],
  '/forms': ['forms:read'],
  '/forms/create': ['forms:create'],
  '/forms/[id]/builder': ['forms:update'],
  '/forms/[id]/submissions': ['forms:view_submissions'],
  '/emails/templates': ['emails:templates_read'],
  '/emails/campaigns': ['emails:campaigns_read'],
  '/opportunities': ['opportunities:read'],
  '/billing/documents': ['billing:read'],
  '/reports/financial': ['reports:financial'],
  '/settings/users': ['settings:users'],
  '/settings/roles': ['settings:roles'],
  '/settings/audit': ['settings:audit']
}
