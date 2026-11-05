## Estructura del proyecto

```text
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── api/                # Llamadas al backend (categorías, ingredientes, productos)
│   ├── components/
│   │   ├── categorias/     # Listado, formulario, modal y eliminación de categorías
│   │   ├── ingredientes/   # Listado, formulario, modal y eliminación de ingredientes
│   │   ├── productos/      # Listado, formulario, modal, eliminación y preview de imagen
│   │   ├── ui/             # Componentes reutilizables (botones, inputs, modal, etc.)
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── RoutesApp.tsx
│   ├── hooks/              # Hooks de datos y utilidades
│   ├── pages/              # Páginas de la aplicación
│   ├── types/              # Tipos de datos
│   ├── utils/              # Funciones auxiliares
│   ├── App.tsx
│   ├── main.tsx
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

### Instalar dependencias

```sh
pnpm i
```

### Ejecutar el servidor

```sh
pnpm dev
```

Visitar [http://localhost:5173](http://localhost:5173)
