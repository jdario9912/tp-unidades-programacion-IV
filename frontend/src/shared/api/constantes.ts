// VITE_API_URL ya incluye el prefijo /api/v1; las rutas son relativas a ella
export const paths = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  auth: "auth",
  usuarios: "admin/usuarios",
  categorias: "categorias",
  productos: "productos",
  pedidos: "pedidos",
} as const;
