import { z } from 'zod';

export const chargeRequestSchema = z.object({
  card_number: z.string().regex(/^\d{16}$/),
  expiration_date: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
  cvv: z.string().regex(/^\d{3}$/),
  cardholder_name: z.string().trim().min(1),
  amount: z.number(),
  payer_id: z.string().min(1),
  payer_email: z.string().min(1),
});

export type ChargeRequest = z.infer<typeof chargeRequestSchema>;