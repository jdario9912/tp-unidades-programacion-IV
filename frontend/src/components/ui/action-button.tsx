import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

type Props = ComponentPropsWithoutRef<"button">;

const ActionButton = ({ children, className, ...rest }: Props) => {
  return (
    <button {...rest} className={cn("px-4 py-2 rounded", className)}>
      {children}
    </button>
  );
};

export default ActionButton;
