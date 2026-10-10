import { useEffect, useRef, type ReactNode } from "react";

type ModalProps = {
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
};

export const Modal = ({ abierto, onCerrar, children }: ModalProps) => {
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
      className="m-auto rounded bg-white shadow border border-gray-300"
    >
      {children}
    </dialog>
  );
};
