import { defineStore } from 'pinia'
export const useFiltersStore = defineStore('filters', {
  state: () => ({ routeFilters: {} as Record<string, Record<string, unknown>> }),
  actions: { setRouteFilter(route: string, filters: Record<string, unknown>) { this.routeFilters[route] = filters } }
})
