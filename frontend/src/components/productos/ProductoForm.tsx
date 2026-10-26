import type { ChangeEvent, SyntheticEvent } from "react";
import { useCreateProducto, useUpdateProducto } from "../../hooks/productos";
import { useGetCategorias } from "../../hooks/categorias";
import type { Producto, ProductoFormValues } from "../../types/producto";
import Label from "../ui/label";
import Input from "../ui/input";
import ActionButton from "../ui/action-button";
import FieldError from "../ui/field-error";
import { revalidateLogic, useForm } from "@tanstack/react-form";

type Props = {
  producto?: Producto;
  cerrar: () => void;
};

const validarNombre = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (nombre.length > 100)
    return "El nombre no puede superar los 100 caracteres";

  return undefined;
};

const validarDescripcion = ({ value }: { value: string }) => {
  const descripcion = value.trim();

  if (!descripcion) return "La descripción es obligatoria";
  if (descripcion.length < 3)
    return "La descripción debe tener al menos 3 caracteres";
  if (descripcion.length > 255)
    return "La descripción no puede superar los 255 caracteres";

  return undefined;
};

const validarPrecio = ({ value }: { value: string }) => {
  if (!value.trim()) return "El precio es obligatorio";

  const precio = Number(value);

  if (Number.isNaN(precio)) return "El precio debe ser un número";
  if (precio <= 0) return "El precio debe ser mayor a 0";

  return undefined;
};

const validarCategorias = ({ value }: { value: number[] }) => {
  if (value.length === 0) return "Seleccioná al menos una categoría";

  return undefined;
};

const ProductoForm = ({ producto, cerrar }: Props) => {
  const initialValues: ProductoFormValues = {
    nombre: producto ? producto.nombre : "",
    descripcion: producto ? producto.descripcion : "",
    precio_base: producto ? String(producto.precio_base) : "",
    disponible: producto ? producto.disponible : true,
    categorias_ids: producto ? producto.categorias.map((c) => c.id) : [],
  };

  const { categorias, loading: loadingCategorias } = useGetCategorias();
  const { submit: submitCreate, error: errorCreate } = useCreateProducto();
  const { submit: submitUpdate, error: errorUpdate } = useUpdateProducto();

  const serverError = producto ? errorUpdate : errorCreate;

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const input = {
        nombre: value.nombre.trim(),
        descripcion: value.descripcion.trim(),
        precio_base: Number(value.precio_base),
        disponible: value.disponible,
        imagenes_url: producto ? producto.imagenes_url : [],
      };

      try {
        if (producto) await submitUpdate(producto, input, value.categorias_ids);
        else await submitCreate(input, value.categorias_ids);
      } catch {
        return;
      }

      cerrar();
    },
  });

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="p-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-y-4 mb-4">
        <div>
          <form.Field name="nombre" validators={{ onDynamic: validarNombre }}>
            {(f) => (
              <>
                <Label htmlFor={f.name}>Nombre</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  className="w-full first-letter:capitalize"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
                <FieldError errors={f.state.meta.errors} />
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="descripcion"
            validators={{ onDynamic: validarDescripcion }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Descripción</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  className="w-full first-letter:capitalize"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
                <FieldError errors={f.state.meta.errors} />
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="precio_base"
            validators={{ onDynamic: validarPrecio }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Precio</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
                <FieldError errors={f.state.meta.errors} />
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="categorias_ids"
            validators={{ onDynamic: validarCategorias }}
          >
            {(f) => (
              <fieldset>
                <legend className="text-xs mb-1">Categorías</legend>
                {loadingCategorias ? (
                  <p className="text-xs">Cargando categorías...</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {(categorias ?? []).map((categoria) => (
                      <label
                        key={categoria.id}
                        className="flex items-center gap-x-2 text-sm first-letter:capitalize"
                      >
                        <input
                          type="checkbox"
                          checked={f.state.value.includes(categoria.id)}
                          onBlur={f.handleBlur}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            f.handleChange(
                              e.target.checked
                                ? [...f.state.value, categoria.id]
                                : f.state.value.filter(
                                    (id) => id !== categoria.id,
                                  ),
                            )
                          }
                        />
                        <span className="first-letter:capitalize">
                          {categoria.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                <FieldError errors={f.state.meta.errors} />
              </fieldset>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="disponible">
            {(f) => (
              <label className="flex items-center gap-x-2 text-sm">
                <input
                  type="checkbox"
                  name={f.name}
                  checked={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    f.handleChange(e.target.checked)
                  }
                />
                Disponible para la venta
              </label>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex gap-x-2 justify-end">
        <ActionButton onClick={cerrar} variant="secondary">
          Cancelar
        </ActionButton>
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Input
              type="submit"
              value={producto ? "Actualizar" : "Guardar"}
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && (
        <p className="text-destructive text-sm mt-2">{serverError}</p>
      )}
    </form>
  );
};

export default ProductoForm;
