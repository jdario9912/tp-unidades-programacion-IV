import { Link, type LinkProps } from "react-router-dom";
import { cn } from "../../utils/cn";

type Props = LinkProps;

const LinkButton = ({ to, className, children, ...rest }: Props) => {
  return (
    <Link to={to} className={cn("", className)} {...rest}>
      {children}
    </Link>
  );
};

export default LinkButton;
