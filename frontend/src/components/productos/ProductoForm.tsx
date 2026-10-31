import type { ChangeEvent, SyntheticEvent } from "react";
import { useCreateProducto, useUpdateProducto } from "../../hooks/productos";
import { useGetCategorias } from "../../hooks/categorias";
import { useGetIngredientes } from "../../hooks/ingredientes";
import type { Producto, ProductoFormValues } from "../../types/producto";
import Label from "../ui/label";
import Input from "../ui/input";
import ActionButton from "../ui/action-button";
import FieldError from "../ui/field-error";
import CardError from "../ui/card-error";
import Spinner from "../ui/spinner";
import ImagenPreview from "./ImagenPreview";
import { esUrlValida } from "../../utils/url";
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

const validarUrl = ({ value }: { value: string }) => {
  const url = value.trim();

  if (!url) return undefined;
  if (!esUrlValida(url)) return "Ingresá una URL válida";

  return undefined;
};

const ProductoForm = ({ producto, cerrar }: Props) => {
  const initialValues: ProductoFormValues = {
    nombre: producto ? producto.nombre : "",
    descripcion: producto ? producto.descripcion : "",
    precio_base: producto ? String(producto.precio_base) : "",
    imagenes_url: producto?.imagenes_url.length ? producto.imagenes_url : [""],
    disponible: producto ? producto.disponible : true,
    categorias_ids: producto ? producto.categorias.map((c) => c.id) : [],
    ingredientes_ids: producto ? producto.ingredientes.map((i) => i.id) : [],
  };

  const { categorias, loading: loadingCategorias } = useGetCategorias();
  const { ingredientes, loading: loadingIngredientes } = useGetIngredientes();
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
        imagenes_url: value.imagenes_url
          .map((url) => url.trim())
          .filter(Boolean),
      };

      try {
        if (producto)
          await submitUpdate(
            producto,
            input,
            value.categorias_ids,
            value.ingredientes_ids,
          );
        else
          await submitCreate(
            input,
            value.categorias_ids,
            value.ingredientes_ids,
          );
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
                {f.state.meta.errors.map((err) => (
                  <FieldError key={String(err)} className="mt-1.5">
                    {String(err)}
                  </FieldError>
                ))}
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
                {f.state.meta.errors.map((err) => (
                  <FieldError key={String(err)} className="mt-1.5">
                    {String(err)}
                  </FieldError>
                ))}
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
                {f.state.meta.errors.map((err) => (
                  <FieldError key={String(err)} className="mt-1.5">
                    {String(err)}
                  </FieldError>
                ))}
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="imagenes_url" mode="array">
            {(field) => (
              <fieldset>
                <legend className="text-xs mb-1">Imágenes (URL)</legend>
                {field.state.value.map((_, i) => (
                  <form.Field
                    key={i}
                    name={`imagenes_url[${i}]`}
                    validators={{ onDynamic: validarUrl }}
                  >
                    {(f) => (
                      <div className="flex items-start gap-x-2 mb-2">
                        <div className="flex-1">
                          <Input
                            id={f.name}
                            name={f.name}
                            type="url"
                            placeholder="https://..."
                            aria-label={`URL de la imagen ${i + 1}`}
                            className="w-full"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              f.handleChange(e.target.value)
                            }
                          />
                          {f.state.meta.errors.map((err) => (
                            <FieldError key={String(err)} className="mt-1.5">
                              {String(err)}
                            </FieldError>
                          ))}
                        </div>
                        <ImagenPreview
                          key={f.state.value}
                          url={f.state.value}
                        />
                        <ActionButton
                          type="button"
                          variant="ghost"
                          aria-label={`Quitar imagen ${i + 1}`}
                          onClick={() =>
                            field.state.value.length > 1
                              ? field.removeValue(i)
                              : field.handleChange([""])
                          }
                        >
                          X
                        </ActionButton>
                      </div>
                    )}
                  </form.Field>
                ))}
                <ActionButton
                  type="button"
                  variant="outline"
                  className="py-1 text-sm"
                  onClick={() => field.pushValue("")}
                >
                  + Agregar imagen
                </ActionButton>
              </fieldset>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="categorias_ids">
            {(f) => (
              <fieldset>
                <legend className="mb-1">Categorías</legend>
                {loadingCategorias ? (
                  <p className="flex items-center gap-x-2 text-xs">
                    <Spinner className="size-3" />
                    Cargando categorías...
                  </p>
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
              </fieldset>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="ingredientes_ids">
            {(f) => (
              <fieldset>
                <legend className="mb-1">Ingredientes</legend>
                {loadingIngredientes ? (
                  <p className="flex items-center gap-x-2 text-xs">
                    <Spinner className="size-3" />
                    Cargando ingredientes...
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-1">
                    {(ingredientes ?? []).map((ingrediente) => (
                      <label
                        key={ingrediente.id}
                        className="flex items-center gap-x-2 text-sm first-letter:capitalize"
                      >
                        <input
                          type="checkbox"
                          checked={f.state.value.includes(ingrediente.id)}
                          onBlur={f.handleBlur}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            f.handleChange(
                              e.target.checked
                                ? [...f.state.value, ingrediente.id]
                                : f.state.value.filter(
                                    (id) => id !== ingrediente.id,
                                  ),
                            )
                          }
                        />
                        <span className="first-letter:capitalize">
                          {ingrediente.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
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
              value={
                isSubmitting
                  ? "Guardando…"
                  : producto
                    ? "Actualizar"
                    : "Guardar"
              }
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {serverError && <CardError className="mt-2">{serverError}</CardError>}
    </form>
  );
};

export default ProductoForm;
