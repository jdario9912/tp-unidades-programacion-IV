import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"input"> & {
  value?: string;
};

const Input = ({ className, type, value, ...rest }: Props) => {
  return (
    <input
      type={type ?? "text"}
      className={`border border-gray-400 px-1 rounded min-h-8 focus:outline-4 focus:outline-blue-300/60 focus:border-blue-400 ${className}`}
      value={value ?? ""}
      {...rest}
    />
  );
};

export default Input;
