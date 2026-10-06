import type { ChargeStatusDetail } from './types';

export const STATUS_MESSAGES: Record<ChargeStatusDetail, string> = {
  accredited: 'Recarga aprobada.',
  invalid_data: 'Revisa los datos de la tarjeta e intenta de nuevo.',
  invalid_amount: 'El monto no es válido. Debe ser mayor a $0 y tener máximo 2 decimales.',
  bad_security_code: 'El CVV no es correcto.',
  bad_expiration_date: 'La fecha de vencimiento no es correcta.',
  insufficient_funds: 'La tarjeta no tiene fondos suficientes.',
  card_declined: 'La tarjeta fue rechazada. Intenta con otra.',
  processing_timeout: 'El pago tardó demasiado en procesarse. No se aplicó ninguna recarga.',
  service_unavailable:
    'SnailPay no está disponible en este momento. No se aplicó ninguna recarga; intenta más tarde.',
};

export const TIMEOUT_MESSAGE =
  'SnailPay no respondió a tiempo. No se aplicó ninguna recarga; intenta de nuevo en unos minutos.';

export const NETWORK_ERROR_MESSAGE =
  'No pudimos conectar con SnailPay. Revisa tu conexión e intenta de nuevo.';