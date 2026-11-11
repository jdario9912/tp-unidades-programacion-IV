# Frontend Food Store

Las instrucciones de instalación y ejecución están en el [README de la raíz](../README.md#frontend).

## Estructura del proyecto

```text
frontend/src/
├── features/                 # Un módulo por dominio; espejan los módulos del backend
│   ├── auth/                 # LoginPage, RegisterPage, UnauthorizedPage, useAuth
│   ├── categorias/           # AdminCategoriasPage, useCategorias
│   ├── productos/            # CatalogoPage, AdminProductosPage, ProductoCard, useProductos
│   ├── usuarios/             # AdminUsuariosPage, useUsuarios
│   └── pedidos/              # CarritoPage, CheckoutPage, MisPedidosPage, AdminPedidosPage, AdminResumenPage
│       ├── api/              # Actions: funciones que llaman a /pedidos con client.ts
│       ├── components/       # Presentación con props tipadas
│       ├── hooks/            # useQuery / useMutation con invalidación
│       ├── pages/            # Componen la pantalla de una ruta
│       ├── types/            # Mismos nombres de campo que los schemas del backend
│       └── index.ts          # Barrel: API pública de la feature
├── shared/                   # Transversal, sin lógica de negocio
│   ├── api/                  # axiosInstance (withCredentials + interceptor), client, handleApiError, queryClient
│   ├── ui/                   # Button (action-button), Card, Input, Select, Textarea, Modal, BadgeEstado...
│   ├── components/           # DataTable, Paginacion, Skeleton, EstadoVacio, EstadoError, Toast, ThemeToggle
│   ├── layout/               # Navbar, MainLayout, AppLayout, Footer
│   ├── hooks/                # useDebounce, useModal
│   └── utils/
├── store/                    # authStore y cartStore (persist), themeStore y notificationStore
├── routes/                   # AppRouter y ProtectedRoute
├── App.tsx                   # checkSession al montar y AppRouter
├── main.tsx                  # QueryClientProvider y BrowserRouter
└── index.css                 # @import "tailwindcss" y tema
```

### Reglas de la arquitectura

- Cada feature es autónoma: desde afuera solo se importa su barrel (`@/features/auth`), nunca sus subcarpetas internas.
- Flujo de datos: `client.ts` (HTTP sobre `axiosInstance`) → actions de la feature (`api/`) → hooks con TanStack Query → componentes. Las páginas no llaman a Axios ni a TanStack Query directamente.
- TanStack Query maneja el estado del servidor (catálogo, pedidos, usuarios, resumen); Zustand, el del cliente (sesión y carrito). Ningún componente hace fetch en un `useEffect`, salvo `checkSession` al montar la app.
- `authStore` persiste solo el usuario (`partialize`); el token vive en la cookie HttpOnly y el frontend nunca lo lee.
- `ProtectedRoute` muestra un spinner mientras `checkSession` confirma la sesión, redirige a `/login` sin sesión y a `/unauthorized` sin el rol.
- Errores HTTP: `axiosInstance.ts` es el único archivo que conoce Axios y convierte su error en `ApiError`; `handleApiError.ts` decide los efectos globales. Para cambiar de librería se reescriben `axiosInstance.ts` y los cuerpos de `client.ts`.
- Los formularios muestran el error de la API en su `CardError`; solo las acciones sin formulario (cambiar estado de un pedido, activar/desactivar usuario) usan toast.
- `handleApiError` limpia la sesión ante un 401 (salvo en `/auth/token` y `/auth/me`) o ante un 400 «Cuenta de usuario desactivada»; un 403 muestra «Acceso denegado».
- Alias `@/` → `src/`, configurado en `vite.config.ts` y `tsconfig.app.json`.
