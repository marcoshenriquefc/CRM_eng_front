<script setup lang="ts">
import * as v from 'valibot'

definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:update' })
const route = useRoute()
const { request } = useApi()

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const initialState = ref('')

const form = reactive({
    name: '', email: '', phone: '', whatsapp: '', jobTitle: '', company: '', document: '', segment: '', size: '', city: '',
    state: '', serviceInterest: '', status: '', temperature: '', notes: '', source: '', campaign: '', formName: '', utmSource: '',
    utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '', ownerId: '', tags: '', consent: false,
})
const fieldErrors = reactive<Record<string, string>>({})

const schema = v.object({
    name: v.pipe(v.string(), v.nonEmpty('Nome é obrigatório.')),
    email: v.pipe(v.string(), v.nonEmpty('E-mail é obrigatório.'), v.email('E-mail inválido.')),
})

const normalizePhone = (value: string) => value.replace(/[^\d]/g, '').slice(0, 11)

const loadLead = async () => {
    loading.value = true
    const res = await request<any>(`/leads/${route.params.id}`)
    if (!res.success) {
        errorMessage.value = 'Não foi possível carregar o lead.'
        loading.value = false
        return
    }
    Object.assign(form, res.data)
    initialState.value = JSON.stringify(form)
    loading.value = false
}

const validate = () => {
    Object.keys(fieldErrors).forEach((k) => (fieldErrors[k] = ''))
    const parsed = v.safeParse(schema, { name: form.name, email: form.email })
    if (parsed.success) return true
    for (const issue of parsed.issues) {
        const key = String(issue.path?.[0]?.key || '')
        if (key) fieldErrors[key] = issue.message
    }
    return false
}

const save = async () => {
    if (!validate()) return
    saving.value = true
    const payload = {
        name: form.name, email: form.email, phone: normalizePhone(form.phone), whatsapp: normalizePhone(form.whatsapp), jobTitle: form.jobTitle,
        company: form.company, document: form.document, segment: form.segment, size: form.size, city: form.city, state: form.state,
        serviceInterest: form.serviceInterest, status: form.status, temperature: form.temperature, notes: form.notes, source: form.source,
        campaign: form.campaign, formName: form.formName, utmSource: form.utmSource, utmMedium: form.utmMedium, utmCampaign: form.utmCampaign,
        utmContent: form.utmContent, utmTerm: form.utmTerm, ownerId: form.ownerId, tags: form.tags, consent: form.consent,
    }
    const res = await request(`/leads/${route.params.id}`, { method: 'PATCH', body: payload })
    saving.value = false
    if (!res.success) {
        errorMessage.value = 'Não foi possível salvar as alterações.'
        return
    }
    navigateTo(`/leads/${route.params.id}`)
}

const cancel = async () => {
    if (JSON.stringify(form) !== initialState.value && !window.confirm('Existem alterações não salvas. Deseja sair mesmo assim?')) return
    await navigateTo(`/leads/${route.params.id}`)
}

onMounted(loadLead)
</script>

<template>
<div>
    <p class="crumb">Dashboard > Leads > Detalhe do Lead > Editar</p>
    <h1>Editar Lead</h1>
    <AppCard v-if="loading">Carregando dados do lead...</AppCard>
    <AppCard v-else>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <h3>Dados pessoais</h3>
        <div class="grid"><AppInput v-model="form.name" label="Nome" :error="fieldErrors.name" /><AppInput v-model="form.email" label="E-mail" :error="fieldErrors.email" /><AppInput v-model="form.phone" label="Telefone" /><AppInput v-model="form.whatsapp" label="WhatsApp" /><AppInput v-model="form.jobTitle" label="Cargo" /></div>
        <h3>Dados da empresa</h3>
        <div class="grid"><AppInput v-model="form.company" label="Empresa" /><AppInput v-model="form.document" label="CNPJ/CPF" /><AppInput v-model="form.segment" label="Segmento" /><AppInput v-model="form.size" label="Porte" /><AppInput v-model="form.city" label="Cidade" /><AppInput v-model="form.state" label="Estado" /></div>
        <h3>Interesse comercial</h3>
        <div class="grid"><AppInput v-model="form.serviceInterest" label="Serviço de interesse" /><AppInput v-model="form.status" label="Status do lead" /><AppInput v-model="form.temperature" label="Temperatura" /><AppInput v-model="form.notes" label="Observações" /></div>
        <div class="actions"><AppButton variant="secondary" @click="cancel">Cancelar</AppButton><AppButton :loading="saving" :disabled="saving" @click="save">Salvar alterações</AppButton></div>
    </AppCard>
</div>
</template>
<style scoped>.crumb{color:#64748b;margin-bottom:.5rem}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem;margin-bottom:1rem}.actions{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1rem}.error{color:#b91c1c}</style>
