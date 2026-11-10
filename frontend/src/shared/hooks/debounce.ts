import { useEffect, useState } from "react";

export const useDebounce = <T>(valor: T, delay = 300) => {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);

    // si el valor cambia antes del delay, se cancela el anterior
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
};
