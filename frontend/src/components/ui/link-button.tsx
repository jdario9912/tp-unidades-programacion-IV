import { Link, type LinkProps } from "react-router-dom";
import { cn, type Variants } from "../../utils/cn";

type Props = LinkProps & {
  variant?: Variants;
};

const LinkButton = ({
  to,
  className,
  children,
  variant = "ghost",
  ...rest
}: Props) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded hover:underline focus:outline-4",
        variant === "primary" &&
          "bg-primary text-off-white hover:bg-primary-hover focus:outline-primary/60",
        variant === "secondary" &&
          "bg-secondary text-off-white hover:bg-secondary-hover focus:outline-secondary/60",
        variant === "ghost" && "bg-transparent focus:outline-hover-muted/60",
        variant === "destructive" &&
          "bg-destructive text-off-white hover:bg-destructive-hover focus:outline-destructive/60",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
