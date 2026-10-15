## Estructura del proyecto

```text
parte_B/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes de la interfaz
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoForm.tsx
│   │   └── ProductoList.tsx
│   ├── types/
│   │   └── producto.ts     # Tipo de datos Producto
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
