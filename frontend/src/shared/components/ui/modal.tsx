import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

type ModalProps = {
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
} & ComponentPropsWithoutRef<"dialog">;

export const Modal = ({
  abierto,
  onCerrar,
  children,
  className,
  ...rest
}: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (abierto && !dialog.open) dialog.showModal();
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-xl rounded bg-background text-letters shadow border border-divider",
        className,
      )}
      {...rest}
    >
      {children}
    </dialog>
  );
};
