import { z } from 'zod';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailSchema = z
  .string()
  .trim()
  .min(1, 'El correo es obligatorio.')
  .regex(EMAIL_PATTERN, 'Ingresa un correo válido.');

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Ingresa tu nombre completo.'),
    email: emailSchema,
    password: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres.')
      .regex(/[A-Za-z]/, 'Debe incluir al menos una letra.')
      .regex(/\d/, 'Debe incluir al menos un número.'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Las contraseñas no coinciden.',
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function getFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: FieldErrors<T> = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof T;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}