<script setup lang="ts">
definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:read' })
const route = useRoute()
const auth = useAuthStore()
const { request } = useApi()

const loading = ref(true)
const timelineLoading = ref(false)
const errorMessage = ref('')
const lead = ref<any>(null)
const timeline = ref<any[]>([])
const activeTab = ref('timeline')

const tabs = computed(() => {
    const base = ['timeline', 'notas', 'atividades', 'formularios', 'arquivos']
    if (auth.hasAnyPermissions(['emails:view_metrics', 'emails:campaigns_read'])) base.push('emails')
    if (auth.hasPermission('opportunities:read')) base.push('oportunidades')
    if (auth.hasPermission('billing:read')) base.push('boletos')
    return base
})

const actions = computed(() => ({
    edit: auth.hasPermission('leads:update'),
    task: auth.hasPermission('tasks:create'),
    opportunity: auth.hasPermission('opportunities:create'),
    note: auth.hasPermission('leads:update'),
    tag: auth.hasPermission('leads:update'),
    convert: auth.hasPermission('leads:convert'),
    delete: auth.hasPermission('leads:delete'),
}))

const fetchLead = async () => {
    loading.value = true
    errorMessage.value = ''
    const res = await request(`/leads/${route.params.id}`)
    if (!res.success) {
        errorMessage.value = 'Lead não encontrado ou indisponível.'
        loading.value = false
        return
    }
    lead.value = res.data
    loading.value = false
}

const fetchTimeline = async () => {
    if (activeTab.value !== 'timeline') return
    timelineLoading.value = true
    const res = await request<any[]>(`/leads/${route.params.id}/timeline`)
    timeline.value = res.success ? res.data : []
    timelineLoading.value = false
}

watch(activeTab, () => {
    if (activeTab.value === 'timeline') fetchTimeline()
})
onMounted(async () => {
    await fetchLead()
    await fetchTimeline()
})
</script>

<template>
<div>
    <p class="crumb">Dashboard > Leads > Detalhe do Lead</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <div v-else-if="loading">Carregando lead...</div>
    <template v-else>
        <header class="header">
            <div><h1>{{ lead.name }}</h1><p>{{ lead.company || '-' }}</p></div>
            <div class="actions">
                <AppButton v-if="actions.edit" @click="navigateTo(`/leads/${lead.id || lead._id}/edit`)">Editar Lead</AppButton>
                <AppButton v-if="actions.task" variant="secondary">Criar tarefa</AppButton>
                <AppButton v-if="actions.opportunity" variant="secondary">Criar oportunidade</AppButton>
                <AppButton v-if="actions.note" variant="secondary">Adicionar nota</AppButton>
                <AppButton v-if="actions.tag" variant="secondary">Adicionar tag</AppButton>
                <AppButton v-if="actions.convert" variant="secondary">Converter</AppButton>
                <AppButton v-if="actions.delete" variant="danger">Excluir</AppButton>
            </div>
        </header>

        <div class="layout">
            <AppCard>
                <p><strong>E-mail:</strong> {{ lead.email || '-' }}</p>
                <p><strong>Telefone:</strong> {{ lead.phone || '-' }}</p>
                <p><strong>WhatsApp:</strong> {{ lead.whatsapp || '-' }}</p>
                <p><strong>Cidade/UF:</strong> {{ lead.city || '-' }} / {{ lead.state || '-' }}</p>
                <p><strong>Origem:</strong> {{ lead.source || '-' }}</p>
                <p><strong>Campanha:</strong> {{ lead.campaign || '-' }}</p>
                <p><strong>Formulário:</strong> {{ lead.formName || '-' }}</p>
                <p><strong>Responsável:</strong> {{ lead.ownerName || '-' }}</p>
                <p><strong>LGPD:</strong> {{ lead.consent ? 'Aceito' : 'Não informado' }}</p>
            </AppCard>
            <AppCard>
                <div class="tabs">
                    <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="{active: activeTab === tab}">{{ tab }}</button>
                </div>
                <div v-if="activeTab === 'timeline'">
                    <p v-if="timelineLoading">Carregando timeline...</p>
                    <p v-else-if="!timeline.length" class="empty">Sem eventos na timeline.</p>
                    <ul v-else><li v-for="ev in timeline" :key="ev.id || ev.createdAt">{{ ev.title || ev.type }} - {{ ev.createdAt }}</li></ul>
                </div>
                <p v-else>Conteúdo da aba {{ activeTab }} será carregado sob demanda conforme permissões.</p>
            </AppCard>
        </div>
    </template>
</div>
</template>
<style scoped>.crumb{color:#64748b;margin-bottom:.8rem}.header{display:flex;justify-content:space-between;gap:1rem}.actions{display:flex;gap:.4rem;flex-wrap:wrap}.layout{display:grid;grid-template-columns:330px 1fr;gap:1rem;margin-top:1rem}.tabs{display:flex;gap:.35rem;flex-wrap:wrap;margin-bottom:.8rem}.tabs button{border:1px solid #cbd5e1;background:#fff;padding:.35rem .55rem;border-radius:8px}.tabs button.active{background:#2563eb;color:#fff}.empty,.error{color:#64748b}.error{color:#b91c1c}</style>
