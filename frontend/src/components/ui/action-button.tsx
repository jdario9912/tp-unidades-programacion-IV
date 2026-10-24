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
        "px-4 py-2 rounded outline-none",
        variant === "primary" &&
          "bg-primary text-off-white hover:bg-primary-hover focus:border-primary/80 focus:outline-primary/80",
        variant === "secondary" &&
          "bg-secondary text-off-white hover:bg-secondary-hover focus:border-secondary/80 focus:outline-secondary/80",
        variant === "outline" && "bg-transparent hover:bg-hover-muted",
        variant === "destructive" &&
          "bg-destructive text-off-white hover:bg-destructive-hover",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ActionButton;
