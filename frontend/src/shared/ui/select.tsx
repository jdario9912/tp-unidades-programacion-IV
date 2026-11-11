import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"select">;

const Select = ({ className, children, ...rest }: Props) => {
  return (
    <select
      className={cn(
        "border border-gray-400 dark:border-gray-600 bg-background px-1 rounded min-h-8 focus:outline-4 focus:outline-primary/60 focus:border-primary/80",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
};

export default Select;
