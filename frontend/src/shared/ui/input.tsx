import type { ComponentPropsWithoutRef } from "react";
import { cn, type Variants } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"input"> & {
  value?: string;
  variant?: Variants;
};

const Input = ({ className, type, value, variant, ...rest }: Props) => {
  return (
    <input
      type={type ?? "text"}
      className={cn(
        "border border-gray-400 dark:border-gray-600 px-1 rounded min-h-8 focus:outline-4 focus:outline-primary/60 focus:border-primary/80",
        type === "submit" &&
          "bg-primary text-off-white px-4 border-none hover:bg-primary-hover",
        type === "submit" &&
          variant === "destructive" &&
          "px-4 py-2 bg-destructive text-off-white hover:bg-destructive-hover focus:outline-destructive/60",
        className,
      )}
      value={value ?? ""}
      {...rest}
    />
  );
};

export default Input;
