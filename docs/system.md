# Documentação do Sistema (Frontend)

## Arquitetura

- `app/services/api.ts`: cliente HTTP central, com chaveamento mock/real.
- `app/services/mock/*`: mocks temporários com contrato de resposta padrão.
- `app/composables/useApi.ts`: ponto de consumo para componentes/stores.
- `app/composables/useAuth.ts`: autenticação, sessão e helpers de permissão.
- `app/stores/auth.store.ts`: estado de autenticação com status (`unknown`, `checking`, etc.).
- `app/middleware/*`: bloqueios de rota por sessão/permissão.
- `app/utils/routePermissions.ts`: mapa central de permissões por rota.

## Segurança de experiência

- Sem token em `localStorage`.
- Sem renderizar área privada antes de validar sessão.
- Sem renderizar ação sensível sem permissão.
- Sem lógica de autorização crítica no frontend.

## Fluxo de autenticação

1. Usuário entra em rota privada.
2. `auth.global` verifica sessão (`fetchMe` quando `unknown`).
3. Se não autenticado: `/login`.
4. `permission` valida permissões da rota.
5. Sem permissão: `/403`.

## Critérios de aceite (guia)

- Rodar `npm run dev`.
- Build com `npm run build`.
- Sem erros TypeScript.
- Login/logout e proteção de rotas funcionando.
- Sem flash de conteúdo privado.

## Portas de execução

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

## Erro `Cannot find module 'vue-tsc/package.json'`

Se ocorrer, instale dependências novamente após atualização:

```bash
npm install
```

O pacote `vue-tsc` está listado em `devDependencies` para compatibilidade com verificadores de tipo do Vite/Nuxt.
