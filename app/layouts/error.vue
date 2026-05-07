<template>
    <main class="err"><slot /></main>
</template>
<style scoped>
    .err {
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f8fafc;
    }
</style>
