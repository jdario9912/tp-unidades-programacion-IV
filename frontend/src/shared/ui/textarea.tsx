import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"textarea">;

const Textarea = ({ className, ...rest }: Props) => {
  return (
    <textarea
      className={cn(
        "border border-gray-400 dark:border-gray-600 bg-background px-1 rounded min-h-16 focus:outline-4 focus:outline-primary/60 focus:border-primary/80",
        className,
      )}
      {...rest}
    />
  );
};

export default Textarea;
