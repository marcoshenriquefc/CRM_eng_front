<script setup lang="ts">
import type { ApiResponse } from '~/types/api'

definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'dashboard:view' })

type DashboardPeriod = 'today' | 'last_7_days' | 'month' | 'quarter' | 'year'
type OverviewData = {
    metrics?: {
        newLeads?: number
        newLeadsDelta?: number
        openOpportunities?: number
        pipelineValue?: number
        proposalsSent?: number
        proposalApprovalRate?: number
        forecastRevenue?: number
        receivedRevenue?: number
    }
    funnel?: Array<{ stage: string; value: number }>
    leadsBySource?: Array<{ source: string; value: number }>
    recentLeads?: Array<{ id: string; name: string; source?: string; createdAt?: string }>
    pendingTasks?: Array<{ id: string; title: string; dueDate?: string }>
    stalledOpportunities?: Array<{ id: string; title: string; days?: number }>
    financialAlerts?: Array<{ id: string; title: string; level?: string }>
}

const auth = useAuthStore()
const { request } = useApi()
const period = ref<DashboardPeriod>('month')
const loading = ref(true)
const errorMessage = ref('')
const executive = ref<OverviewData | null>(null)
const marketing = ref<OverviewData | null>(null)
const sales = ref<OverviewData | null>(null)
const financial = ref<OverviewData | null>(null)

const canSeeFinancial = computed(() => auth.hasAnyPermissions(['reports:financial', 'billing:view_reports']))
const canSeeMarketing = computed(() => auth.hasAnyPermissions(['reports:marketing', 'campaigns:read']))
const canSeeSales = computed(() => auth.hasAnyPermissions(['reports:sales', 'opportunities:read']))
const canSeeFinancialAlerts = computed(() => auth.hasPermission('billing:read'))
const canOpenLeads = computed(() => auth.hasPermission('leads:read'))

const formatNumber = (value?: number) => (value ?? 0).toLocaleString('pt-BR')
const formatCurrency = (value?: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)

const metric = computed(() => ({
    newLeads: executive.value?.metrics?.newLeads ?? marketing.value?.metrics?.newLeads ?? 0,
    newLeadsDelta: executive.value?.metrics?.newLeadsDelta ?? 0,
    openOpportunities: executive.value?.metrics?.openOpportunities ?? sales.value?.metrics?.openOpportunities ?? 0,
    pipelineValue: executive.value?.metrics?.pipelineValue ?? sales.value?.metrics?.pipelineValue,
    proposalsSent: executive.value?.metrics?.proposalsSent ?? sales.value?.metrics?.proposalsSent ?? 0,
    proposalApprovalRate: executive.value?.metrics?.proposalApprovalRate,
    forecastRevenue: financial.value?.metrics?.forecastRevenue ?? executive.value?.metrics?.forecastRevenue,
    receivedRevenue: financial.value?.metrics?.receivedRevenue,
}))

const hasData = computed(() =>
    Boolean(
        executive.value ||
            marketing.value ||
            sales.value ||
            financial.value ||
            (metric.value.newLeads ?? 0) > 0 ||
            (metric.value.openOpportunities ?? 0) > 0,
    ),
)

const resetSensitiveData = () => {
    executive.value = null
    marketing.value = null
    sales.value = null
    financial.value = null
}

const loadDashboard = async () => {
    loading.value = true
    errorMessage.value = ''
    resetSensitiveData()

    try {
        const queries = { period: period.value }
        const jobs: Promise<void>[] = [
            request<OverviewData>('/reports/executive/overview', { query: queries }).then((res) => {
                if (res.success) executive.value = res.data
            }),
        ]

        if (canSeeMarketing.value) {
            jobs.push(
                request<OverviewData>('/reports/marketing/overview', { query: queries }).then((res) => {
                    if (res.success) marketing.value = res.data
                }),
            )
        }
        if (canSeeSales.value) {
            jobs.push(
                request<OverviewData>('/reports/sales/overview', { query: queries }).then((res) => {
                    if (res.success) sales.value = res.data
                }),
            )
        }
        if (canSeeFinancial.value) {
            jobs.push(
                request<OverviewData>('/reports/financial/overview', { query: queries }).then((res) => {
                    if (res.success) financial.value = res.data
                }),
            )
        }

        await Promise.all(jobs)
    } catch {
        errorMessage.value = 'Não foi possível carregar o dashboard. Tente novamente em instantes.'
    } finally {
        loading.value = false
    }
}

watch(period, loadDashboard)
onMounted(loadDashboard)
watch(
    () => auth.status,
    (status) => {
        if (status !== 'authenticated') resetSensitiveData()
    },
)
</script>

<template>
    <div class="dashboard-page">
        <header class="page-header">
            <div>
                <h1>Dashboard</h1>
                <p>Bem-vindo, {{ auth.user?.name || 'usuário' }}</p>
            </div>
            <select v-model="period" class="period-select">
                <option value="today">Hoje</option>
                <option value="last_7_days">Últimos 7 dias</option>
                <option value="month">Este mês</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este ano</option>
            </select>
        </header>

        <div v-if="loading" class="skeleton-grid">
            <div v-for="n in 6" :key="n" class="skeleton-card" />
        </div>

        <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-else-if="!hasData" class="empty">Ainda não há dados para o período selecionado.</p>

        <template v-else>
            <section class="cards-grid">
                <AppCard>
                    <p class="label">Novos Leads</p>
                    <p class="value">{{ formatNumber(metric.newLeads) }}</p>
                    <p class="meta">Variação: {{ metric.newLeadsDelta || 0 }}%</p>
                    <NuxtLink v-if="canOpenLeads" to="/leads" class="card-link">Ver leads</NuxtLink>
                </AppCard>

                <AppCard>
                    <p class="label">Oportunidades abertas</p>
                    <p class="value">{{ formatNumber(metric.openOpportunities) }}</p>
                    <p class="meta" v-if="canSeeSales">Pipeline: {{ formatCurrency(metric.pipelineValue) }}</p>
                </AppCard>

                <AppCard>
                    <p class="label">Propostas enviadas</p>
                    <p class="value">{{ formatNumber(metric.proposalsSent) }}</p>
                    <p class="meta">Aprovação: {{ metric.proposalApprovalRate ?? 0 }}%</p>
                </AppCard>

                <AppCard v-if="canSeeFinancial">
                    <p class="label">Faturamento previsto</p>
                    <p class="value">{{ formatCurrency(metric.forecastRevenue) }}</p>
                    <p class="meta">Recebido: {{ formatCurrency(metric.receivedRevenue) }}</p>
                </AppCard>
            </section>

            <section class="charts-grid">
                <AppCard>
                    <h2>Funil de oportunidades</h2>
                    <ul>
                        <li v-for="item in sales?.funnel || executive?.funnel || []" :key="item.stage">
                            {{ item.stage }} — {{ item.value }}
                        </li>
                    </ul>
                </AppCard>
                <AppCard>
                    <h2>Leads por origem</h2>
                    <ul>
                        <li v-for="item in marketing?.leadsBySource || executive?.leadsBySource || []" :key="item.source">
                            {{ item.source }} — {{ item.value }}
                        </li>
                    </ul>
                </AppCard>
            </section>

            <section class="lists-grid">
                <AppCard>
                    <h3>Leads recentes</h3>
                    <ul><li v-for="lead in executive?.recentLeads || []" :key="lead.id">{{ lead.name }}</li></ul>
                </AppCard>
                <AppCard>
                    <h3>Tarefas pendentes</h3>
                    <ul><li v-for="task in sales?.pendingTasks || executive?.pendingTasks || []" :key="task.id">{{ task.title }}</li></ul>
                </AppCard>
                <AppCard>
                    <h3>Oportunidades paradas</h3>
                    <ul><li v-for="op in sales?.stalledOpportunities || []" :key="op.id">{{ op.title }}</li></ul>
                </AppCard>
                <AppCard v-if="canSeeFinancialAlerts">
                    <h3>Alertas financeiros</h3>
                    <ul><li v-for="alert in financial?.financialAlerts || []" :key="alert.id">{{ alert.title }}</li></ul>
                </AppCard>
            </section>
        </template>
    </div>
</template>

<style scoped>
.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}.period-select{border:1px solid #cbd5e1;border-radius:10px;padding:.5rem .65rem}.cards-grid,.charts-grid,.lists-grid{display:grid;gap:1rem;margin-bottom:1rem}.cards-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.charts-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lists-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.label{color:#64748b;font-size:.85rem}.value{font-size:1.45rem;font-weight:700}.meta{color:#334155;font-size:.85rem}.card-link{display:inline-block;margin-top:.5rem;color:#2563eb}.skeleton-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.skeleton-card{height:120px;border-radius:12px;background:linear-gradient(90deg,#e2e8f0,#f1f5f9,#e2e8f0)}.error{color:#b91c1c}.empty{color:#64748b}
</style>
