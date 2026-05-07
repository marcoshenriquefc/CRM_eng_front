<script setup lang="ts">
    definePageMeta({ layout: 'error' })
</script>
<template>
    <AppCard
        ><h1>Acesso negado</h1>
        <p>Você não tem permissão para acessar esta área.</p>
        <div style="display: flex; gap: 0.5rem">
            <AppButton variant="secondary" @click="$router.back()">Voltar</AppButton
            ><AppButton @click="navigateTo('/dashboard')">Ir para o dashboard</AppButton>
        </div></AppCard
    >
</template>
