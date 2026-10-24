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
        "px-4 py-2 rounded hover:underline focus:outline-none",
        variant === "primary" &&
          "bg-primary text-off-white hover:bg-primary-hover focus:border-primary/80 focus:outline-primary/80",
        variant === "secondary" &&
          "bg-secondary text-off-white hover:bg-secondary-hover focus:border-secondary/80 focus:outline-secondary/80",
        variant === "outline" && "bg-transparent hover:bg-hover-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
