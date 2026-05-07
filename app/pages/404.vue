<script setup lang="ts">
    definePageMeta({ layout: 'error' })
</script>
<template>
    <AppCard
        ><h1>Página não encontrada</h1>
        <p>A página solicitada não existe ou não está disponível.</p>
        <AppButton @click="navigateTo('/dashboard')">Ir para o dashboard</AppButton></AppCard
    >
</template>
