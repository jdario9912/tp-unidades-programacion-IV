import type { ChangeEvent, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useCrearPedido } from "@/features/pedidos/hooks/usePedidos";
import {
  FORMAS_PAGO,
  type FormaPago,
} from "@/features/pedidos/types/pedido";
import type { ItemCarrito } from "@/store/cartStore";
import Label from "@/shared/ui/label";
import Input from "@/shared/ui/input";
import Select from "@/shared/ui/select";
import Textarea from "@/shared/ui/textarea";
import FieldError from "@/shared/ui/field-error";
import CardError from "@/shared/ui/card-error";

type Props = {
  items: ItemCarrito[];
};

// los límites coinciden con PedidoCreate del backend (RN-06)
const validarDireccion = ({ value }: { value: string }) => {
  const direccion = value.trim();

  if (!direccion) return "La dirección es obligatoria";
  if (direccion.length < 5)
    return "La dirección debe tener al menos 5 caracteres";
  if (direccion.length > 200)
    return "La dirección no puede superar los 200 caracteres";

  return undefined;
};

const validarNotas = ({ value }: { value: string }) => {
  if (value.trim().length > 500)
    return "Las notas no pueden superar los 500 caracteres";

  return undefined;
};

const ETIQUETAS_PAGO: Record<FormaPago, string> = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
};

const CheckoutForm = ({ items }: Props) => {
  const navigate = useNavigate();
  const { submit, error: serverError } = useCrearPedido();

  const form = useForm({
    defaultValues: {
      direccion_entrega: "",
      forma_pago: "EFECTIVO" as FormaPago,
      notas: "",
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const ok = await submit({
        items: items.map(({ producto_id, cantidad }) => ({
          producto_id,
          cantidad,
        })),
        forma_pago: value.forma_pago,
        direccion_entrega: value.direccion_entrega.trim(),
        notas: value.notas.trim() || null,
      });

      // el hook ya vació el carrito
      if (ok) navigate("/mis-pedidos", { replace: true });
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
          <form.Field
            name="direccion_entrega"
            validators={{ onDynamic: validarDireccion }}
          >
            {(f) => (
              <>
                <Label htmlFor={f.name}>Dirección de entrega</Label>
                <Input
                  id={f.name}
                  name={f.name}
                  autoComplete="street-address"
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
          <form.Field name="forma_pago">
            {(f) => (
              <>
                <Label htmlFor={f.name}>Forma de pago</Label>
                <Select
                  id={f.name}
                  name={f.name}
                  className="w-full"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    f.handleChange(e.target.value as FormaPago)
                  }
                >
                  {FORMAS_PAGO.map((forma) => (
                    <option key={forma} value={forma}>
                      {ETIQUETAS_PAGO[forma]}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="notas" validators={{ onDynamic: validarNotas }}>
            {(f) => (
              <>
                <Label htmlFor={f.name}>Notas (opcional)</Label>
                <Textarea
                  id={f.name}
                  name={f.name}
                  placeholder="Ej.: tocar timbre 2B"
                  className="w-full"
                  value={f.state.value}
                  onBlur={f.handleBlur}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
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
      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Input
            type="submit"
            className="w-full py-2"
            value={isSubmitting ? "Confirmando…" : "Confirmar pedido"}
            disabled={!canSubmit || isSubmitting}
          />
        )}
      </form.Subscribe>
      {/* p. ej. stock insuficiente: el backend no crea nada y el carrito queda igual */}
      {serverError && <CardError className="mt-2">{serverError}</CardError>}
    </form>
  );
};

export default CheckoutForm;
