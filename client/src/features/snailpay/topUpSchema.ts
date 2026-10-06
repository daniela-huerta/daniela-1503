import { z } from 'zod';

export const MAX_TOP_UP_AMOUNT = 50_000;

export const topUpSchema = z.object({
  cardNumber: z.string().trim().regex(/^\d{16}$/, 'El número debe tener 16 dígitos.'),
  expirationDate: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Usa el formato MM/AA.'),
  cvv: z.string().trim().regex(/^\d{3}$/, 'El CVV debe tener 3 dígitos.'),
  cardholderName: z.string().trim().min(1, 'Ingresa el nombre como aparece en la tarjeta.'),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, 'Ingresa un monto válido, con máximo 2 decimales.')
    .refine((value) => Number(value) > 0, 'El monto debe ser mayor a $0.')
    .refine(
      (value) => Number(value) <= MAX_TOP_UP_AMOUNT,
      `El monto máximo es $${MAX_TOP_UP_AMOUNT.toLocaleString('es-MX')}.`,
    ),
});

export type TopUpFormValues = z.infer<typeof topUpSchema>;