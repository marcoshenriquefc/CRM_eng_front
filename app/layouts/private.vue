<template>
    <div class="l">
        <AppSidebar />
        <div class="c">
            <AppTopbar />
            <main class="m"><slot /></main>
        </div>
    </div>
</template>
<style scoped>
    .l {
        display: flex;
        min-height: 100vh;
        background: #f8fafc;
    }
    .c {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .m {
        padding: 1rem;
    }
</style>
