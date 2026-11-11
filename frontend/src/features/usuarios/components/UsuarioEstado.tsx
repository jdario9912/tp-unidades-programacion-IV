import type { Usuario } from "@/features/usuarios/types/usuario";
import { useCambiarEstadoUsuario } from "@/features/usuarios/hooks/useUsuarios";
import { useUsuario } from "@/features/auth";
import ActionButton from "@/shared/ui/action-button";

type Props = {
  usuario: Usuario;
};

const UsuarioEstado = ({ usuario }: Props) => {
  const sesion = useUsuario();
  // el error lo avisa el toast de useCambiarEstadoUsuario
  const { loading, submit } = useCambiarEstadoUsuario();

  // el admin no puede desactivarse a sí mismo: en su fila no hay botón
  if (sesion?.id === usuario.id) return null;

  return (
    <ActionButton
      onClick={() => submit(usuario)}
      disabled={loading}
      variant={usuario.disabled ? "primary" : "destructive"}
    >
      {usuario.disabled ? "Activar" : "Desactivar"}
    </ActionButton>
  );
};

export default UsuarioEstado;
