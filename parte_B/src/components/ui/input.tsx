import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"input">;

const Input = ({ className, type }: Props) => {
  return (
    <input
      type={type ?? "text"}
      className={`border border-gray-400 px-1 rounded w-full min-h-8 focus:outline-4 focus:outline-blue-300/60 focus:border-blue-400 ${className}`}
    />
  );
};

export default Input;
