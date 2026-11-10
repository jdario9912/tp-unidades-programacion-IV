import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";
import ActionButton from "@/shared/components/ui/action-button";

const ThemeToggle = () => {
  const darkMode = useThemeStore((s) => s.darkMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  // la variante dark de Tailwind depende de la clase en <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <ActionButton
      variant="ghost"
      onClick={toggleTheme}
      aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
      title={darkMode ? "Modo claro" : "Modo oscuro"}
    >
      {darkMode ? "☀" : "☾"}
    </ActionButton>
  );
};

export default ThemeToggle;
