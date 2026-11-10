import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"label">;

const Label = ({ className, children, htmlFor, ...rest }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-xs block mb-1", className)}
      {...rest}
    >
      {children}
    </label>
  );
};

export default Label;
