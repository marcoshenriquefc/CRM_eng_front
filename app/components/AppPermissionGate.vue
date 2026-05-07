<script setup lang="ts">
    const props = withDefaults(defineProps<{ permission?: string; permissions?: string[]; mode?: 'all' | 'any' }>(), {
        mode: 'all',
    })
    const auth = useAuthStore()
    const allowed = computed(() => {
        const list = props.permissions ?? (props.permission ? [props.permission] : [])
        if (!list.length) return true
        return props.mode === 'all' ? auth.hasAllPermissions(list) : auth.hasAnyPermissions(list)
    })
</script>
<template>
    <slot v-if="allowed" />
    <slot v-else name="fallback" />
</template>
