import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"button">;

const ActionButton = ({ children, className, ...rest }: Props) => {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
