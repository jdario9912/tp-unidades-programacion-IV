export const paths = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  categorias: "categorias",
  ingredientes: "ingredientes",
  productos: "productos",
} as const;
