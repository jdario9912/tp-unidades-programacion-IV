import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

type Props = ComponentPropsWithoutRef<"span">;

const Spinner = ({ className, ...rest }: Props) => {
  return (
    <span
      role="status"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      {...rest}
    >
      <span className="sr-only">Cargando</span>
    </span>
  );
};

export default Spinner;
