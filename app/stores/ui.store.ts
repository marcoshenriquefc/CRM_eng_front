import { defineStore } from 'pinia'
export const useUiStore = defineStore('ui', {
    state: () => ({
        sidebarCollapsed: false,
        theme: 'light',
        loadingGlobal: false,
        breadcrumbs: [] as string[],
        modals: {} as Record<string, boolean>,
    }),
})
