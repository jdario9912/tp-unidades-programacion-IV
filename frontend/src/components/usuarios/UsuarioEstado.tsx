import type { UsuarioAdmin } from "../../types/auth.types";
import { useCambiarEstadoUsuario } from "../../hooks/usuarios";
import ActionButton from "../ui/action-button";
import FieldError from "../ui/field-error";

type Props = {
  usuario: UsuarioAdmin;
};

const UsuarioEstado = ({ usuario }: Props) => {
  const { loading, error, submit } = useCambiarEstadoUsuario();

  return (
    <div className="flex flex-col items-end gap-y-1">
      <ActionButton
        onClick={() => submit(usuario)}
        disabled={loading}
        variant={usuario.activo ? "destructive" : "primary"}
      >
        {usuario.activo ? "Desactivar" : "Activar"}
      </ActionButton>
      {/* p. ej. el 409 al intentar desactivarse a sí mismo */}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
};

export default UsuarioEstado;
