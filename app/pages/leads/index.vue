<script setup lang="ts">
    definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:read' })
    const auth = useAuthStore()
    const q = ref('')
    const status = ref('')
    const leads = ref<any[]>([])
    const loading = ref(false)
    let t: ReturnType<typeof setTimeout> | null = null
    const load = () => {
        if (!auth.hasPermission('leads:read')) return
        loading.value = true
        const { request } = useApi()
        request<any[]>('/leads', { query: { email: q.value, status: status.value } })
            .then((r) => {
                leads.value = r.success ? r.data : []
            })
            .finally(() => (loading.value = false))
    }
    watch([q, status], () => {
        if (t) clearTimeout(t)
        t = setTimeout(load, 400)
    })
    onMounted(load)
</script>
<template>
    <div>
        <div style="display: flex; justify-content: space-between">
            <h1>Leads</h1>
            <AppPermissionGate permission="leads:create"
                ><AppButton @click="navigateTo('/leads/create')">Novo Lead</AppButton></AppPermissionGate
            >
        </div>
        <div style="display: flex; gap: 0.5rem">
            <AppInput v-model="q" placeholder="Buscar por e-mail" /><select v-model="status">
                <option value="">Todos status</option>
                <option>new</option></select
            ><AppPermissionGate permission="leads:export"
                ><AppButton variant="secondary">Exportar</AppButton></AppPermissionGate
            >
        </div>
        <AppCard
            ><div v-if="loading">Carregando...</div>
            <table v-else style="width: 100%">
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                <tr v-for="l in leads" :key="l._id" @click="navigateTo(`/leads/${l._id}`)" style="cursor: pointer">
                    <td>{{ l.name }}</td>
                    <td>{{ l.email }}</td>
                    <td>
                        <AppBadge color="blue">{{ l.status }}</AppBadge>
                    </td>
                    <td>
                        <AppPermissionGate permission="leads:update"
                            ><AppButton variant="secondary">Editar</AppButton></AppPermissionGate
                        >
                    </td>
                </tr>
            </table></AppCard
        >
    </div>
</template>
