import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/utils/cn";

type Props = ComponentPropsWithoutRef<"main">;

const MainLayout = ({ children, className, ...rest }: Props) => (
  <main className={cn("container mx-auto min-h-screen", className)} {...rest}>
    {children}
  </main>
);

export default MainLayout;
