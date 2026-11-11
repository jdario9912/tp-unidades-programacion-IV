import type { ReactNode } from "react";

type Props = {
  mensaje: string;
  children?: ReactNode;
};

const EstadoVacio = ({ mensaje, children }: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-4 p-8 text-center">
      <p className="text-muted">{mensaje}</p>
      {children}
    </div>
  );
};

export default EstadoVacio;
