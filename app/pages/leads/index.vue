<script setup lang="ts">
definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:read' })

type LeadRow = {
    id: string
    _id?: string
    name: string
    company?: string
    email?: string
    phone?: string
    source?: string
    status?: string
    score?: number
    temperature?: string
    ownerName?: string
    lastInteractionAt?: string
}

const auth = useAuthStore()
const { request } = useApi()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const items = ref<LeadRow[]>([])
const showDeleteId = ref<string | null>(null)

const filters = reactive({
    search: String(route.query.search || ''),
    status: String(route.query.status || ''),
    source: String(route.query.source || ''),
    city: String(route.query.city || ''),
    state: String(route.query.state || ''),
    page: Number(route.query.page || 1),
    perPage: Number(route.query.perPage || 25),
})

const pagination = reactive({ page: 1, perPage: 25, total: 0, totalPages: 1 })

const sanitize = (value: string) => value.replace(/[<>$]/g, '').trim().slice(0, 120)
const debouncedSearch = ref(filters.search)
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(
    () => filters.search,
    (value) => {
        if (searchTimer) clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            debouncedSearch.value = sanitize(value)
        }, 400)
    },
)

const toQuery = () => {
    const query: Record<string, string | number> = { page: filters.page, perPage: filters.perPage }
    if (debouncedSearch.value) query.search = sanitize(debouncedSearch.value)
    if (filters.status) query.status = sanitize(filters.status)
    if (filters.source) query.source = sanitize(filters.source)
    if (filters.city) query.city = sanitize(filters.city)
    if (filters.state) query.state = sanitize(filters.state)
    return query
}

const can = (perm: string) => auth.hasPermission(perm)

const fetchLeads = async () => {
    loading.value = true
    errorMessage.value = ''
    try {
        const query = toQuery()
        await router.replace({ query: { ...query } })
        const res = await request<any>('/leads', { query })
        if (!res.success) {
            errorMessage.value = 'Não foi possível carregar os leads no momento.'
            items.value = []
            return
        }
        items.value = (res.data || []).map((lead: any) => ({ ...lead, id: lead.id || lead._id }))
        if (res.pagination) Object.assign(pagination, res.pagination)
    } catch {
        errorMessage.value = 'Erro ao carregar leads. Tente novamente.'
    } finally {
        loading.value = false
    }
}

watch([debouncedSearch, () => filters.status, () => filters.source, () => filters.city, () => filters.state], () => {
    filters.page = 1
    fetchLeads()
})
watch([() => filters.page, () => filters.perPage], fetchLeads)

const confirmDelete = async () => {
    if (!showDeleteId.value || !can('leads:delete')) return
    const id = showDeleteId.value
    showDeleteId.value = null
    const res = await request(`/leads/${id}`, { method: 'DELETE' })
    if (res.success) {
        successMessage.value = 'Lead excluído com sucesso.'
        fetchLeads()
    } else errorMessage.value = 'Não foi possível excluir o lead.'
}

onMounted(fetchLeads)
</script>

<template>
    <div>
        <header class="head">
            <div>
                <h1>Leads</h1>
                <p>Gerencie os leads capturados pelos formulários, campanhas e integrações.</p>
            </div>
            <AppPermissionGate permission="leads:create"><AppButton @click="navigateTo('/leads/create')">+ Novo Lead</AppButton></AppPermissionGate>
        </header>

        <AppCard>
            <div class="filters">
                <AppInput v-model="filters.search" placeholder="Buscar por nome, e-mail, telefone ou empresa" />
                <input v-model="filters.status" placeholder="Status" class="input" />
                <input v-model="filters.source" placeholder="Origem" class="input" />
                <input v-model="filters.city" placeholder="Cidade" class="input" />
                <input v-model="filters.state" placeholder="Estado" class="input" />
            </div>
        </AppCard>

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <AppCard>
            <div v-if="loading" class="skeleton">Carregando leads...</div>
            <p v-else-if="!items.length" class="empty">Nenhum lead encontrado para os filtros aplicados.</p>
            <div v-else style="overflow:auto;">
                <table class="table">
                    <thead>
                        <tr><th>Nome</th><th>Empresa</th><th>E-mail</th><th>Telefone</th><th>Origem</th><th>Status</th><th>Score</th><th>Temperatura</th><th>Responsável</th><th>Última interação</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                        <tr v-for="lead in items" :key="lead.id" @click="navigateTo(`/leads/${lead.id}`)">
                            <td>{{ lead.name }}</td><td>{{ lead.company || '-' }}</td><td>{{ lead.email || '-' }}</td><td>{{ lead.phone || '-' }}</td><td>{{ lead.source || '-' }}</td>
                            <td><AppBadge color="blue">{{ lead.status || '-' }}</AppBadge></td>
                            <td>{{ lead.score ?? '-' }}</td><td><AppBadge color="orange">{{ lead.temperature || '-' }}</AppBadge></td><td>{{ lead.ownerName || '-' }}</td><td>{{ lead.lastInteractionAt || '-' }}</td>
                            <td @click.stop>
                                <div class="actions">
                                    <AppButton variant="secondary" v-if="can('leads:read')" @click="navigateTo(`/leads/${lead.id}`)">Ver detalhes</AppButton>
                                    <AppButton variant="secondary" v-if="can('leads:update')" @click="navigateTo(`/leads/${lead.id}/edit`)">Editar</AppButton>
                                    <AppButton variant="secondary" v-if="can('leads:convert')">Converter</AppButton>
                                    <AppButton variant="danger" v-if="can('leads:delete')" @click="showDeleteId = lead.id">Excluir</AppButton>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <footer class="pagination">
                <span>Página {{ pagination.page }} de {{ pagination.totalPages }}</span>
                <div>
                    <AppButton variant="secondary" :disabled="filters.page <= 1" @click="filters.page--">Anterior</AppButton>
                    <AppButton variant="secondary" :disabled="filters.page >= pagination.totalPages" @click="filters.page++">Próxima</AppButton>
                </div>
            </footer>
        </AppCard>

        <div v-if="showDeleteId" class="confirm">
            <AppCard>
                <p>Deseja realmente excluir este lead?</p>
                <div class="actions">
                    <AppButton variant="danger" @click="confirmDelete">Confirmar</AppButton>
                    <AppButton variant="secondary" @click="showDeleteId = null">Cancelar</AppButton>
                </div>
            </AppCard>
        </div>
    </div>
</template>

<style scoped>
.head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}.filters{display:grid;grid-template-columns:2fr repeat(4,1fr);gap:.5rem}.input{padding:.6rem;border:1px solid #cbd5e1;border-radius:10px}.table{width:100%;border-collapse:collapse}th,td{padding:.6rem;border-bottom:1px solid #e2e8f0;text-align:left}tbody tr:hover{background:#f8fafc;cursor:pointer}.actions{display:flex;gap:.35rem;flex-wrap:wrap}.pagination{margin-top:.75rem;display:flex;justify-content:space-between}.error{color:#b91c1c}.success{color:#166534}.empty{color:#64748b}.confirm{position:fixed;inset:0;background:rgba(15,23,42,.35);display:grid;place-items:center;padding:1rem}.skeleton{color:#64748b}
</style>
