<script setup lang='ts'>definePageMeta({layout:'auth'}); const auth=useAuthStore(); auth.clearSession()</script>
<template><AppCard><h1>Sessão expirada</h1><p>Por segurança, sua sessão foi encerrada. Faça login novamente para continuar.</p><AppButton @click='navigateTo("/login")'>Fazer login</AppButton></AppCard></template>
