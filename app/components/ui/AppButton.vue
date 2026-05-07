<script setup lang="ts">
    const props = withDefaults(
        defineProps<{
            variant?: 'primary' | 'secondary' | 'danger'
            loading?: boolean
            disabled?: boolean
            type?: 'button' | 'submit'
        }>(),
        { variant: 'primary', type: 'button' },
    )
</script>
<template>
    <button :type="type" :disabled="disabled || loading" class="btn" :class="`btn--${variant}`">
        <span v-if="loading">Carregando...</span><slot v-else />
    </button>
</template>
<style scoped>
    .btn {
        border: 0;
        border-radius: 10px;
        padding: 0.65rem 1rem;
        font-weight: 600;
        cursor: pointer;
    }
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .btn--primary {
        background: #2563eb;
        color: #fff;
    }
    .btn--secondary {
        background: #e2e8f0;
        color: #0f172a;
    }
    .btn--danger {
        background: #dc2626;
        color: #fff;
    }
</style>
