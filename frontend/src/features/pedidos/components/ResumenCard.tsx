import Card from "@/shared/ui/card";
import { cn } from "@/shared/utils/cn";

type Props = {
  titulo: string;
  valor: string | number;
  className?: string;
};

const ResumenCard = ({ titulo, valor, className }: Props) => (
  <Card className={cn("p-4", className)}>
    <p className="text-sm text-muted">{titulo}</p>
    <p className="mt-1 text-3xl font-bold">{valor}</p>
  </Card>
);

export default ResumenCard;
