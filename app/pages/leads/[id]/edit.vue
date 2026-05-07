<script setup lang="ts">
    definePageMeta({ layout: 'private', middleware: ['permission'], permission: 'leads:update' })
    const route = useRoute()
    const form = reactive<any>({ name: '', email: '', phone: '' })
    const loading = ref(false)
    onMounted(async () => {
        const { request } = useApi()
        const r = await request(`/leads/${route.params.id}`)
        if (r.success) Object.assign(form, r.data)
    })
    const save = async () => {
        loading.value = true
        const { request } = useApi()
        await request(`/leads/${route.params.id}`, { method: 'PATCH', body: form })
        loading.value = false
        navigateTo(`/leads/${route.params.id}`)
    }
</script>
<template>
    <div>
        <h1>Editar Lead</h1>
        <AppCard
            ><AppInput v-model="form.name" label="Nome" /><AppInput v-model="form.email" label="E-mail" /><AppInput
                v-model="form.phone"
                label="Telefone"
            />
            <div style="margin-top: 0.6rem; display: flex; gap: 0.5rem">
                <AppButton :loading="loading" @click="save">Salvar alterações</AppButton
                ><AppButton variant="secondary" @click="navigateTo(`/leads/${route.params.id}`)">Cancelar</AppButton>
            </div></AppCard
        >
    </div>
</template>
