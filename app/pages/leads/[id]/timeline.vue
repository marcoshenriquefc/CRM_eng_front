<script setup lang='ts'>
definePageMeta({layout:'private',middleware:['permission'],permission:'leads:read'})
const filter=ref('all'); const events=ref<any[]>([])
onMounted(async()=>{const {request}=useApi(); const r=await request('/leads/'+useRoute().params.id+'/timeline'); if(r.success) events.value=r.data as any[]})
</script>
<template><div><h1>Timeline do Lead</h1><select v-model='filter'><option value='all'>Todos</option><option>notes</option><option>emails</option></select><AppCard><ul><li v-for='(e,i) in events' :key='i'>{{e.type || 'Evento'}} - {{e.createdAt||''}}</li></ul></AppCard></div></template>
