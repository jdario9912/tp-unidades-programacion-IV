import type { ComponentPropsWithoutRef } from "react";
import { cn, type Variants } from "@/shared/utils/cn";

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
        "px-4 py-2 rounded border border-transparent focus:outline-4",
        variant === "primary" &&
          "bg-primary text-off-white hover:bg-primary-hover focus:outline-primary/60",
        variant === "secondary" &&
          "bg-secondary text-off-white hover:bg-secondary-hover focus:outline-secondary/60",
        variant === "outline" &&
          "border-primary text-primary hover:bg-primary/10 focus:outline-primary/60",
        variant === "ghost" &&
          "bg-transparent hover:bg-hover-muted focus:outline-hover-muted/60",
        variant === "destructive" &&
          "bg-destructive text-off-white hover:bg-destructive-hover focus:outline-destructive/60",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ActionButton;
