import type { ChangeEvent, SyntheticEvent } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useUpdateStock } from "@/features/productos/hooks/useProductos";
import type { Producto } from "@/features/productos/types/producto";
import { useModal } from "@/shared/hooks/modal";
import { Modal } from "@/shared/ui/modal";
import ActionButton from "@/shared/ui/action-button";
import Input from "@/shared/ui/input";
import Label from "@/shared/ui/label";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";

type Props = {
  producto: Producto;
};

const validarStock = ({ value }: { value: string }) => {
  if (!value.trim()) return "El stock es obligatorio";

  const stock = Number(value);

  if (!Number.isInteger(stock)) return "El stock debe ser un número entero";
  if (stock < 0) return "El stock no puede ser negativo";

  return undefined;
};

type FormProps = Props & { cerrar: () => void };

const ProductoStockForm = ({ producto, cerrar }: FormProps) => {
  const { submit, error } = useUpdateStock();

  const form = useForm({
    defaultValues: {
      stock: String(producto.stock),
      disponible: producto.disponible,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const ok = await submit(producto.id, {
        stock: Number(value.stock),
        disponible: value.disponible,
      });

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
          <form.Field name="stock" validators={{ onDynamic: validarStock }}>
            {(f) => (
              <>
                <Label htmlFor={`stock-${producto.id}`}>Stock</Label>
                <Input
                  id={`stock-${producto.id}`}
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
              value={isSubmitting ? "Guardando…" : "Guardar"}
              disabled={!canSubmit || isSubmitting}
            />
          )}
        </form.Subscribe>
      </div>
      {error && <CardError className="mt-2">{error}</CardError>}
    </form>
  );
};

const ProductoStockModal = ({ producto }: Props) => {
  const { abierto, abrir, cerrar } = useModal();

  return (
    <>
      <ActionButton onClick={abrir} variant="outline">
        Stock
      </ActionButton>

      <Modal abierto={abierto} onCerrar={cerrar} className="max-w-sm">
        <div className="flex justify-between p-2 px-4">
          <h2 className="font-bold">Stock de {producto.nombre}</h2>

          <ActionButton onClick={cerrar} variant="ghost">
            X
          </ActionButton>
        </div>
        {/* se monta sólo abierto para que cada apertura arranque con los valores actuales */}
        {abierto && <ProductoStockForm producto={producto} cerrar={cerrar} />}
      </Modal>
    </>
  );
};

export default ProductoStockModal;
