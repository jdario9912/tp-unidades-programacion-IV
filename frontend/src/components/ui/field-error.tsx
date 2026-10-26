type Props = {
  errors: unknown[];
};

const FieldError = ({ errors }: Props) =>
  errors.map((err) => (
    <p key={String(err)} className="text-destructive text-xs mt-1.5">
      {String(err)}
    </p>
  ));

export default FieldError;
