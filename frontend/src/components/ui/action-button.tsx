import type { ComponentPropsWithoutRef } from "react";
import { cn, type Variants } from "../../utils/cn";

type Props = ComponentPropsWithoutRef<"button"> & {
  variant?: Variants;
};

const ActionButton = ({
  children,
  className,
  variant = "primary",
  ...rest
}: Props) => {
  return (
    <button
      {...rest}
      className={cn(
        "px-4 py-2 rounded",
        variant === "primary" && "bg-primary text-off-white",
        variant === "secondary" && "bg-secondary text-off-white",
        variant === "outline" && "bg-transparent",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ActionButton;
