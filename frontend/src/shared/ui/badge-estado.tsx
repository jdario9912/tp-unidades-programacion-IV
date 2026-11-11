import { cn } from "@/shared/utils/cn";

type Props = {
  estado: string;
  className?: string;
};

// un color por cada estado de la máquina de estados del pedido
const COLORES: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  EN_PREPARACION: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  ENTREGADO: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  CANCELADO: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const BadgeEstado = ({ estado, className }: Props) => {
  return (
    <span
      className={cn(
        "inline-block rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        COLORES[estado] ?? "bg-placeholder text-muted",
        className,
      )}
    >
      {estado.replace("_", " ")}
    </span>
  );
};

export default BadgeEstado;
