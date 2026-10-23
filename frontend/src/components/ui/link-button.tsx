import { Link, type LinkProps } from "react-router-dom";
import { cn, type Variants } from "../../utils/cn";

type Props = LinkProps & {
  variant: Variants;
};

const LinkButton = ({ to, className, children, variant, ...rest }: Props) => {
  return (
    <Link
      to={to}
      className={cn(
        variant === "primary" && "bg-primary",
        variant === "secondary" && "bg-secondary",
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
