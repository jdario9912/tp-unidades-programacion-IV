import { type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"label">;

const Label = ({ className, children, htmlFor, ...rest }: Props) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-xs block mb-1 ${className}`}
      {...rest}
    >
      {children}
    </label>
  );
};

export default Label;
