import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"p">;

const FieldError = ({ className, children, ...rest }: Props) => {
  return (
    <p className={cn("text-destructive text-xs", className)} {...rest}>
      {children}
    </p>
  );
};

export default FieldError;
