<script setup lang='ts'>
definePageMeta({layout:'private',middleware:['permission'],permission:'leads:read'})
const route=useRoute(); const lead=ref<any>(null); const loading=ref(true)
onMounted(async()=>{const {request}=useApi(); const r=await request(`/leads/${route.params.id}`); if(r.success) lead.value=r.data; loading.value=false})
</script>
<template><div><div v-if='loading'>Carregando lead...</div><div v-else-if='lead'><h1>{{lead.name}}</h1><AppBadge color='blue'>{{lead.status}}</AppBadge><p>{{lead.email}}</p><div style='display:flex;gap:.5rem'><AppPermissionGate permission='leads:update'><AppButton @click='navigateTo(`/leads/${lead._id}/edit`)'>Editar</AppButton></AppPermissionGate><AppPermissionGate permission='leads:read'><AppButton variant='secondary' @click='navigateTo(`/leads/${lead._id}/timeline`)'>Timeline</AppButton></AppPermissionGate></div></div></div></template>
