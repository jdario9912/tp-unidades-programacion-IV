import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

type Props = ComponentPropsWithoutRef<"div">;

const Skeleton = ({ className, ...rest }: Props) => {
  return (
    <div
      className={cn("animate-pulse rounded bg-skeleton", className)}
      {...rest}
    />
  );
};

export default Skeleton;
