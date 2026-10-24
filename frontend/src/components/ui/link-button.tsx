import { Link, type LinkProps } from "react-router-dom";
import { cn, type Variants } from "../../utils/cn";

type Props = LinkProps & {
  variant?: Variants;
};

const LinkButton = ({ to, className, children, variant, ...rest }: Props) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded hover:underline",
        variant === "primary" && "bg-primary text-off-white",
        variant === "secondary" && "bg-secondary text-off-white",
        variant === "outline" && "bg-transparent",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
