import type { ChangeEvent, SyntheticEvent } from "react";
import {
  useCreateProducto,
  useUpdateProducto,
} from "@/features/productos/hooks/useProductos";
import { useGetCategorias } from "@/features/categorias";
import type {
  Producto,
  ProductoFormValues,
} from "@/features/productos/types/producto";
import Label from "@/shared/ui/label";
import Input from "@/shared/ui/input";
import Select from "@/shared/ui/select";
import Textarea from "@/shared/ui/textarea";
import ActionButton from "@/shared/ui/action-button";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";
import ImagenPreview from "./ImagenPreview";
import { esUrlValida } from "@/shared/utils/url";
import { revalidateLogic, useForm } from "@tanstack/react-form";

type Props = {
  producto?: Producto;
  cerrar: () => void;
};

// los límites coinciden con ProductoCreate del backend
const validarNombre = ({ value }: { value: string }) => {
  const nombre = value.trim();

  if (!nombre) return "El nombre es obligatorio";
  if (nombre.length > 150)
    return "El nombre no puede superar los 150 caracteres";

  return undefined;
};

const validarPrecio = ({ value }: { value: string }) => {
  if (!value.trim()) return "El precio es obligatorio";

  const precio = Number(value);

  if (Number.isNaN(precio)) return "El precio debe ser un número";
  if (precio < 0) return "El precio no puede ser negativo";

  return undefined;
};

const validarStock = ({ value }: { value: string }) => {
  if (!value.trim()) return "El stock es obligatorio";

  const stock = Number(value);

  if (!Number.isInteger(stock)) return "El stock debe ser un número entero";
  if (stock < 0) return "El stock no puede ser negativo";

  return undefined;
};

const validarCategoria = ({ value }: { value: string }) => {
  if (!value) return "Elegí una categoría";

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
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    precio_base: producto ? String(producto.precio_base) : "",
    imagen_url: producto?.imagen_url ?? "",
    stock: producto ? String(producto.stock) : "0",
    disponible: producto?.disponible ?? true,
    categoria_id: producto ? String(producto.categoria_id) : "",
  };

  const { categorias } = useGetCategorias();
  const { submit: submitCreate, error: errorCreate } = useCreateProducto();
  const { submit: submitUpdate, error: errorUpdate } = useUpdateProducto();

  const serverError = producto ? errorUpdate : errorCreate;

  const form = useForm({
    defaultValues: initialValues,
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const input = {
        nombre: value.nombre.trim(),
        // los opcionales vacíos se guardan como null
        descripcion: value.descripcion.trim() || null,
        precio_base: Number(value.precio_base),
        imagen_url: value.imagen_url.trim() || null,
        stock: Number(value.stock),
        disponible: value.disponible,
        categoria_id: Number(value.categoria_id),
      };

      const ok = producto
        ? await submitUpdate(producto.id, input)
        : await submitCreate(input);

      if (ok) cerrar();
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
          <form.Field name="descripcion">
            {(f) => (
              <>
                <Label htmlFor={f.name}>Descripción (opcional)</Label>
                <Textarea
                  id={f.name}
                  name={f.name}
                  className="w-full"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    f.handleChange(e.target.value)
                  }
                />
              </>
            )}
          </form.Field>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
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
                    min={0}
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
            <form.Field name="stock" validators={{ onDynamic: validarStock }}>
              {(f) => (
                <>
                  <Label htmlFor={f.name}>Stock</Label>
                  <Input
                    id={f.name}
                    name={f.name}
                    type="number"
                    min={0}
                    step={1}
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
        </div>

        <div>
          <form.Field
            name="categoria_id"
            validators={{ onDynamic: validarCategoria }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Categoría</Label>
                <Select
                  id={f.name}
                  name={f.name}
                  className="w-full"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    f.handleChange(e.target.value)
                  }
                >
                  <option value="">Elegí una categoría</option>
                  {categorias?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Select>
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
          <form.Field name="imagen_url" validators={{ onDynamic: validarUrl }}>
            {(f) => (
              <>
                <Label htmlFor={f.name}>URL de la imagen (opcional)</Label>
                <div className="flex items-center gap-x-2">
                  <ImagenPreview url={f.state.value} />
                  <Input
                    id={f.name}
                    name={f.name}
                    type="url"
                    placeholder="https://"
                    className="w-full"
                    value={f.state.value}
                    onBlur={f.handleBlur}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      f.handleChange(e.target.value)
                    }
                  />
                </div>
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
          <form.Field name="disponible">
            {(f) => (
              <label className="flex items-center gap-x-2 text-sm">
                <input
                  type="checkbox"
                  name={f.name}
                  checked={f.state.value}
                  onChange={(e) => f.handleChange(e.target.checked)}
                />
                Disponible para la venta
              </label>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex gap-x-2 justify-end">
        <ActionButton type="button" onClick={cerrar} variant="secondary">
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
