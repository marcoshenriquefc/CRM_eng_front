<script setup lang="ts">
import * as v from 'valibot'

definePageMeta({ layout: 'auth', middleware: ['guest'] })

type LoginForm = {
    email: string
    password: string
    remember: boolean
}

const auth = useAuth()
const form = reactive<LoginForm>({
    email: '',
    password: '',
    remember: false,
})

const showPassword = ref(false)
const loading = ref(false)
const formError = ref('')
const fieldErrors = reactive<Record<'email' | 'password', string>>({
    email: '',
    password: '',
})

const schema = v.object({
    email: v.pipe(
        v.string('Informe o e-mail.'),
        v.nonEmpty('Informe o e-mail.'),
        v.email('Digite um e-mail válido.'),
    ),
    password: v.pipe(v.string('Informe a senha.'), v.nonEmpty('Informe a senha.')),
})

const clearErrors = () => {
    formError.value = ''
    fieldErrors.email = ''
    fieldErrors.password = ''
}

const validateForm = () => {
    clearErrors()
    const result = v.safeParse(schema, { email: form.email, password: form.password })
    if (result.success) return true

    for (const issue of result.issues) {
        const field = issue.path?.[0]?.key
        if ((field === 'email' || field === 'password') && !fieldErrors[field]) {
            fieldErrors[field] = issue.message
        }
    }
    return false
}

const submit = async () => {
    if (loading.value) return
    if (!validateForm()) return

    loading.value = true
    formError.value = ''

    try {
        const loginResult = await auth.login({ email: form.email, password: form.password })

        if (!loginResult.success) {
            formError.value = 'Não foi possível entrar. Verifique suas credenciais e tente novamente.'
            return
        }

        await auth.fetchMe()
        await navigateTo('/dashboard')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-page">
        <AppCard class="login-card">
            <div class="brand-block">
                <div class="brand-logo" aria-hidden="true">ES</div>
                <div>
                    <p class="brand-name">Engenharia Soluções Inteligentes</p>
                    <h1>Bem-vindo de volta</h1>
                    <p class="subtitle">Acesse sua conta para continuar</p>
                </div>
            </div>

            <form class="form" @submit.prevent="submit" novalidate>
                <AppInput v-model="form.email" type="email" label="E-mail" placeholder="seu.email@empresa.com.br" :error="fieldErrors.email" />

                <div class="password-wrap">
                    <AppInput
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        label="Senha"
                        placeholder="Digite sua senha"
                        :error="fieldErrors.password"
                    />
                    <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                        {{ showPassword ? 'Ocultar senha' : 'Mostrar senha' }}
                    </button>
                </div>

                <div class="helper-row">
                    <label class="remember-me"><input v-model="form.remember" type="checkbox" /> Lembrar-me</label>
                    <NuxtLink to="/forgot-password" class="forgot-link">Esqueci minha senha</NuxtLink>
                </div>

                <p v-if="formError" class="error-message">{{ formError }}</p>

                <AppButton type="submit" :loading="loading" :disabled="loading">Entrar</AppButton>
            </form>

            <p class="footer-note">Não tem uma conta? Fale com o administrador.</p>
        </AppCard>
    </div>
</template>

<style scoped>
.login-page {
    width: min(460px, 100%);
}

.login-card {
    padding: 1.75rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.brand-block {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    margin-bottom: 1.4rem;
}

.brand-logo {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 0.75rem;
    display: grid;
    place-items: center;
    background: #1d4ed8;
    color: #fff;
    font-weight: 700;
}

.brand-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-bottom: 0.2rem;
}

h1 {
    font-size: 1.2rem;
    color: #0f172a;
}

.subtitle {
    margin-top: 0.2rem;
    color: #64748b;
    font-size: 0.9rem;
}

.form { display: grid; gap: 0.9rem; }
.password-wrap { display: grid; gap: 0.35rem; }
.toggle-password {
    justify-self: end;
    border: 0;
    background: transparent;
    color: #2563eb;
    font-size: 0.82rem;
    cursor: pointer;
}
.helper-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.85rem;
}
.remember-me { display: flex; align-items: center; gap: 0.35rem; color: #334155; }
.forgot-link { color: #2563eb; text-decoration: none; }
.forgot-link:hover { text-decoration: underline; }
.error-message { color: #dc2626; font-size: 0.85rem; }
.footer-note { margin-top: 1rem; text-align: center; color: #64748b; font-size: 0.85rem; }
</style>
