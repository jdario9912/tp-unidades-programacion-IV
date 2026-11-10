const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarEmail = ({ value }: { value: string }) => {
  const email = value.trim();

  if (!email) return "El email es obligatorio";
  if (!EMAIL_REGEX.test(email)) return "El email no es válido";
  if (email.length > 254) return "El email no puede superar los 254 caracteres";

  return undefined;
};
