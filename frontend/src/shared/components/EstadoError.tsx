import CardError from "@/shared/ui/card-error";

type Props = {
  mensaje: string;
  error?: string;
};

const EstadoError = ({ mensaje, error }: Props) => {
  return (
    <CardError className="m-4">
      {mensaje}
      {error && `: ${error}`}
    </CardError>
  );
};

export default EstadoError;
