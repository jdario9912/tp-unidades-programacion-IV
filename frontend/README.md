## Estructura del proyecto

```text
frontend/
├── public/                     # Archivos estáticos
├── src/
│   ├── features/               # Un módulo por dominio
│   │   ├── auth/
│   │   │   ├── api/            # Actions: login, logout, /me, registro y admin de usuarios
│   │   │   ├── components/     # LoginForm, RegisterForm, UsuarioList, UsuarioEstado
│   │   │   ├── hooks/          # useAuth, useRegister, useGetUsuarios...
│   │   │   ├── pages/          # LoginPage, RegisterPage, AdminUsersPage
│   │   │   ├── store/          # authStore (Zustand, sin persist)
│   │   │   ├── types/
│   │   │   └── index.ts        # Barrel: API pública de la feature
│   │   ├── categories/         # api/, components/, hooks/ (useCategories), pages/, types/, index.ts
│   │   ├── ingredients/        # api/, components/, hooks/ (useIngredients), pages/, types/, index.ts
│   │   └── products/           # api/, components/, hooks/ (useProducts), pages/, types/, index.ts
│   ├── shared/                 # Lo que usan varias features
│   │   ├── api/                # api.ts (Axios), client.ts, setupInterceptors.ts, queryClient.ts, errores
│   │   ├── components/         # Navbar, AppLayout, Toast, ThemeToggle, UnauthorizedPage, NotFound, ui/
│   │   ├── hooks/              # useDebounce, useModal
│   │   └── utils/
│   ├── store/                  # Stores de interfaz: themeStore (persist) y notificationStore
│   ├── routes/                 # AppRouter y ProtectedRoute
│   ├── App.tsx                 # Verifica la sesión y monta el router y el Toast
│   ├── main.tsx                # Providers e interceptores
│   └── styles.css
├── index.html
├── package.json
├── pnpm-lock.yaml
├── eslint.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

### Reglas de la arquitectura

- Cada feature es autónoma: desde afuera solo se importa su barrel (`@/features/auth`), nunca sus subcarpetas internas.
- Lo que comparten varias features va en `shared/` (componentes, Axios, utilidades) o en `store/` (estado de interfaz).
- Flujo de datos: `client.ts` (HTTP) → actions de la feature (`api/`) → hooks con TanStack Query → componentes. Las páginas no llaman a Axios ni a TanStack Query.
- Alias `@/` → `src/`, configurado en `vite.config.ts` y `tsconfig.app.json`. Dentro de una misma carpeta se usan imports relativos cortos.
- Rutas protegidas con `ProtectedRoute` + `<Outlet />`: muestra un spinner mientras se verifica la sesión con `/auth/me`, sin sesión redirige a `/login` y con un rol no permitido a `/unauthorized`.
- Un 401 limpia la sesión (salvo en `/auth/token` y `/auth/me`); un 403 muestra «Acceso denegado» sin cerrar la sesión.
- La sesión no se guarda en `localStorage`; solo se persiste el tema (`theme-storage`).

### Instalar dependencias

```sh
pnpm i
```

### Ejecutar el servidor

```sh
pnpm dev
```

Visitar [http://localhost:5173](http://localhost:5173)
