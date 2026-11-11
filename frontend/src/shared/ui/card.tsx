import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"div">;

const Card = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn("rounded border border-divider bg-background", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
