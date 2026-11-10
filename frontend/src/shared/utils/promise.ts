// el error queda disponible en mutation.error; el componente solo necesita
// saber si la operación terminó bien para continuar (por ejemplo, cerrar un modal)
export const succeeded = (promesa: Promise<unknown>): Promise<boolean> =>
  promesa.then(
    () => true,
    () => false,
  );
