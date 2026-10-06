import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { formatCurrency } from '../../lib/format';
import { getFieldErrors, type FieldErrors } from '../../lib/formErrors';
import { topUpSchema, type TopUpFormValues } from './topUpSchema';
import { useTopUp } from './useTopUp';
import snailLogo from '../../assets/caracol.svg';

const INITIAL_VALUES: TopUpFormValues = {
  cardNumber: '',
  expirationDate: '',
  cvv: '',
  cardholderName: '',
  amount: '',
};

function formatFieldValue(name: string, value: string): string {
  if (name === 'cardNumber') return value.replace(/\D/g, '').slice(0, 16);
  if (name === 'cvv') return value.replace(/\D/g, '').slice(0, 3);
  if (name === 'expirationDate') {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }
  return value;
}

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TopUpModal({ isOpen, onClose }: TopUpModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { state, submit, reset } = useTopUp();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors<TopUpFormValues>>({});

  const isSubmitting = state.status === 'submitting';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function handleClose() {
    if (isSubmitting) return;
    setValues(INITIAL_VALUES);
    setErrors({});
    reset();
    onClose();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: formatFieldValue(name, value) }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = topUpSchema.safeParse(values);
    if (!result.success) {
      setErrors(getFieldErrors<TopUpFormValues>(result.error));
      return;
    }

    await submit(result.data);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="top-up-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-0 text-bark-900 shadow-2xl backdrop:bg-bark-900/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="top-up-title" className="text-xl font-extrabold">
              Cargar saldo
            </h2>
            <p className="mt-1 text-sm text-bark-600">Pago seguro simulado con SnailPay.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Cerrar"
            className="rounded-full p-2 text-bark-600 hover:bg-cream disabled:opacity-40"
          >
            ✕
          </button>
        </div>

        {state.status === 'approved' ? (
          <div role="status" className="mt-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-leaf-50 p-5 text-center">
              <p className="text-3xl" aria-hidden="true">
                <img src={snailLogo} alt="" className="mx-auto h-12 w-12" />
              </p>
              <p className="mt-2 text-lg font-extrabold text-leaf-700">¡Recarga aprobada!</p>
              <p className="mt-1 text-2xl font-extrabold">
                {formatCurrency(state.response.transaction_amount ?? 0)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-bark-600">Referencia</dt>
              <dd className="text-right font-semibold">{state.response.reference}</dd>
              <dt className="text-bark-600">Autorización</dt>
              <dd className="text-right font-semibold">{state.response.authorization_code}</dd>
            </dl>
            <Button type="button" onClick={handleClose}>
              Listo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6">
            <fieldset disabled={isSubmitting} className="flex flex-col gap-4">
              <FormField
                label="Número de tarjeta"
                name="cardNumber"
                value={values.cardNumber}
                error={errors.cardNumber}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234123412341234"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Vencimiento"
                  name="expirationDate"
                  value={values.expirationDate}
                  error={errors.expirationDate}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/AA"
                />
                <FormField
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={values.cvv}
                  error={errors.cvv}
                  onChange={handleChange}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                />
              </div>
              <FormField
                label="Nombre del titular"
                name="cardholderName"
                value={values.cardholderName}
                error={errors.cardholderName}
                onChange={handleChange}
                autoComplete="cc-name"
              />
              <FormField
                label="Monto a recargar (MXN)"
                name="amount"
                value={values.amount}
                error={errors.amount}
                onChange={handleChange}
                inputMode="decimal"
                placeholder="0.00"
              />

              {state.status === 'failed' && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.message}
                </p>
              )}

              <Button type="submit">{isSubmitting ? 'Procesando pago…' : 'Pagar'}</Button>
            </fieldset>
          </form>
        )}
      </div>
    </dialog>
  );
}