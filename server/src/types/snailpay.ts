export type ChargeStatus = 'approved' | 'rejected' | 'error';

export type ChargeStatusDetail =
  | 'accredited'
  | 'invalid_data'
  | 'invalid_amount'
  | 'bad_security_code'
  | 'bad_expiration_date'
  | 'insufficient_funds'
  | 'card_declined'
  | 'processing_timeout'
  | 'service_unavailable';

export interface ChargeResponse {
  id: string;
  status: ChargeStatus;
  status_detail: ChargeStatusDetail;
  transaction_amount: number | null;
  date_created: string;
  authorization_code: string | null;
  reference: string;
  payer_id: string | null;
  payer_email: string | null;
  card_number: string | null;
  cvv: string | null;
}

export interface SnailPayConfig {
  simulateOutage: boolean;
  slowResponseDelayMs: number;
}