import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"p">;

const CardError = ({ className, children, ...rest }: Props) => {
  return (
    <p
      role="alert"
      className={cn(
        "bg-destructive/10 text-destructive text-sm rounded px-3 py-2",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
};

export default CardError;
