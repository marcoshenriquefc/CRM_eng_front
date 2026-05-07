# CRM Engenharia Frontend

Frontend profissional do CRM da empresa de engenharia, construído com Nuxt 4.

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Composition API (`<script setup lang="ts">`)
- Pinia
- File-based routing + route middleware
- Camada centralizada de API com suporte a mocks temporários

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

`.env.example`:

- `NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1`
- `NUXT_PUBLIC_APP_NAME=CRM Engenharia`
- `NUXT_PUBLIC_USE_MOCK_API=false`

> Nunca coloque secrets no frontend.

## Rodar projeto

```bash
npm run dev
```

Aplicação frontend em `http://localhost:3001`.

## Build

```bash
npm run build
npm run preview
```

## Conectar no backend

1. Garanta backend em `http://localhost:3000` (backend).
2. Frontend roda em `http://localhost:3001`.
3. Configure `NUXT_PUBLIC_API_BASE_URL`.
4. Mantenha `NUXT_PUBLIC_USE_MOCK_API=false` para usar API real.

## Mocks temporários

- Ative com `NUXT_PUBLIC_USE_MOCK_API=true`.
- Mocks ficam isolados em `app/services/mock`.
- Componentes não devem conter lógica de mock.

## Testes

```bash
npm run lint
npm run test
```

## Roles

`ADMIN`, `MARKETING`, `COMERCIAL`, `FINANCEIRO`, `ENGENHARIA`, `GESTOR`, `SUPORTE`.

## Permissões

Permissões são a fonte para liberar ações/telas no frontend (controle visual). O backend segue como fonte da verdade.

## Proteção de rotas

- `auth.global.ts`: valida sessão antes da área privada.
- `permission.ts`: valida permissão por meta/rota.
- `guest.ts`: impede acesso de usuário autenticado nas rotas de convidado.

## Regra essencial

Frontend **não é** fonte da verdade de segurança. Toda autorização real deve ocorrer no backend.

## Nova página protegida

```vue
<script setup lang="ts">
    definePageMeta({
        layout: 'private',
        middleware: ['permission'],
        permission: 'leads:read',
    })
</script>
```

## Menu com permissão

Use `useAuthStore().hasPermission('x:y')` para decidir renderização.

## AppPermissionGate

```vue
<AppPermissionGate permission="leads:create">
  <AppButton>Criar lead</AppButton>
</AppPermissionGate>
```

## useApi

Use `const { request } = useApi()` para chamadas padronizadas (real/mock via flag).

## useAuth

Use `const { login, logout, fetchMe, can } = useAuth()` para ciclo de sessão e checks de acesso.
