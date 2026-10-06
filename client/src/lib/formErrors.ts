import type { z } from 'zod';

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