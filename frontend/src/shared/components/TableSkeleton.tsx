import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";
import Skeleton from "./Skeleton";

type Props = ComponentPropsWithoutRef<"div"> & {
  rows?: number;
};

const TableSkeleton = ({ className, rows = 5, ...rest }: Props) => {
  return (
    <div
      aria-busy="true"
      className={cn("flex flex-col gap-y-2", className)}
      {...rest}
    >
      <Skeleton className="h-10" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-8" />
      ))}
    </div>
  );
};

export default TableSkeleton;
