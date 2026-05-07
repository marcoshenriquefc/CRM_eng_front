<script setup lang="ts">
    const props = withDefaults(defineProps<{ color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' }>(), {
        color: 'gray',
    })
</script>
<template>
    <span class="b" :class="`b--${color}`"><slot /></span>
</template>
<style scoped>
    .b {
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
        font-size: 0.75rem;
    }
    .b--blue {
        background: #dbeafe;
    }
    .b--green {
        background: #dcfce7;
    }
    .b--red {
        background: #fee2e2;
    }
    .b--yellow {
        background: #fef3c7;
    }
    .b--gray {
        background: #e2e8f0;
    }
</style>
