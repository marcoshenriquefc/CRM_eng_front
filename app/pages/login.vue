<script setup lang="ts">
    import * as v from 'valibot'
    definePageMeta({ layout: 'auth', middleware: ['guest'] })
    const email = ref('')
    const password = ref('')
    const remember = ref(false)
    const loading = ref(false)
    const show = ref(false)
    const err = ref('')
    const schema = v.object({
        email: v.pipe(v.string(), v.email('E-mail inválido')),
        password: v.pipe(v.string(), v.minLength(6, 'Senha obrigatória')),
    })
    const auth = useAuth()
    const submit = async () => {
        err.value = ''
        const parsed = v.safeParse(schema, { email: email.value, password: password.value })
        if (!parsed.success) {
            err.value = parsed.issues[0]?.message || 'Dados inválidos'
            return
        }
        loading.value = true
        const res = await auth.login(parsed.output)
        loading.value = false
        if (res.success) {
            await auth.fetchMe()
            await navigateTo('/dashboard')
            return
        }
        err.value = 'Credenciais inválidas'
    }
</script>
<template>
    <div style="width: min(460px, 100%)">
        <AppCard
            ><div style="text-align: center">
                <h1>Bem-vindo de volta</h1>
                <p>Acesse sua conta para continuar</p>
            </div>
            <form @submit.prevent="submit" style="display: grid; gap: 0.8rem">
                <AppInput v-model="email" label="E-mail" type="email" /><AppInput
                    v-model="password"
                    label="Senha"
                    :type="show ? 'text' : 'password'"
                /><label><input type="checkbox" v-model="remember" /> Lembrar-me</label
                ><button type="button" @click="show = !show">{{ show ? 'Ocultar' : 'Mostrar' }} senha</button
                ><NuxtLink to="/forgot-password">Esqueci minha senha</NuxtLink>
                <p v-if="err" style="color: #dc2626">{{ err }}</p>
                <AppButton type="submit" :loading="loading">Entrar</AppButton>
            </form></AppCard
        >
        <p style="text-align: center; margin-top: 1rem">© {{ new Date().getFullYear() }} CRM Engenharia</p>
    </div>
</template>
