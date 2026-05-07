<script setup lang="ts">
    definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:create' })
    const form = reactive({ name: '', email: '', phone: '', source: 'landing_page', campaign: '', notes: '' })
    const loading = ref(false)
    const err = ref('')
    const save = async () => {
        loading.value = true
        err.value = ''
        const { request } = useApi()
        const res = await request('/leads', { method: 'POST', body: form })
        loading.value = false
        if (res.success && (res.data as any)._id) return navigateTo(`/leads/${(res.data as any)._id}`)
        err.value = 'Não foi possível salvar lead'
    }
</script>
<template>
    <div>
        <h1>Novo Lead</h1>
        <AppCard
            ><div style="display: grid; gap: 0.7rem">
                <AppInput v-model="form.name" label="Nome" /><AppInput v-model="form.email" label="E-mail" /><AppInput
                    v-model="form.phone"
                    label="Telefone"
                /><AppInput v-model="form.source" label="Origem" /><AppInput
                    v-model="form.campaign"
                    label="Campanha"
                /><textarea v-model="form.notes" placeholder="Observações" />
                <p v-if="err" style="color: red">{{ err }}</p>
                <div style="display: flex; gap: 0.5rem">
                    <AppButton :loading="loading" @click="save">Salvar</AppButton
                    ><AppButton variant="secondary" @click="navigateTo('/leads')">Cancelar</AppButton>
                </div>
            </div></AppCard
        >
    </div>
</template>
