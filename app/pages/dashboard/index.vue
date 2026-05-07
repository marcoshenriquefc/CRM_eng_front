<script setup lang="ts">
    definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'dashboard:view' })
    const auth = useAuthStore()
    const period = ref('month')
    const loading = ref(true)
    const data = ref<any>(null)
    onMounted(async () => {
        loading.value = true
        const { request } = useApi()
        if (auth.hasPermission('dashboard:view')) data.value = await request('/reports/executive/overview')
        loading.value = false
    })
</script>
<template>
    <div class="page">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {{ auth.user?.name || 'usuário' }}</p>
        <select v-model="period">
            <option value="today">Hoje</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Ano</option>
        </select>
        <div v-if="loading">Carregando indicadores...</div>
        <div v-else class="grid">
            <AppCard>Novos leads</AppCard><AppCard>Oportunidades abertas</AppCard><AppCard>Propostas enviadas</AppCard
            ><AppPermissionGate permissions="['reports:financial','billing:view_reports']" mode="any"
                ><AppCard>Faturamento previsto</AppCard></AppPermissionGate
            ><AppCard>Funil comercial</AppCard><AppCard>Leads por origem</AppCard>
        </div>
    </div>
</template>
<style scoped>
    .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }
</style>
