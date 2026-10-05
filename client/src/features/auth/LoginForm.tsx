import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FormField } from '../../components/ui/FormField';
import {
  getFieldErrors,
  loginSchema,
  type FieldErrors,
  type LoginFormValues,
} from './authSchemas';
import { AuthError } from './types';
import { useAuth } from './useAuth';
import { Button } from '../../components/ui/Button';

const INITIAL_VALUES: LoginFormValues = { email: '', password: '' };

export function LoginForm() {
  const { login } = useAuth();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setErrors(getFieldErrors<LoginFormValues>(result.error));
      return;
    }

    setIsSubmitting(true);

    try {
      await login(result.data);
    } catch (error) {
      setSubmitError(
        error instanceof AuthError
          ? error.message
          : 'Ocurrió un error inesperado. Intenta de nuevo.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="Correo electrónico"
        name="email"
        type="email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        onChange={handleChange}
      />
      <FormField
        label="Contraseña"
        name="password"
        type="password"
        value={values.password}
        error={errors.password}
        autoComplete="current-password"
        onChange={handleChange}
      />

      {submitError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}