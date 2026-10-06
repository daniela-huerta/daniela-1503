import type { RequestHandler } from 'express';
import { processCharge } from '../services/snailpay.service';
import type { ChargeStatusDetail, SnailPayConfig } from '../types/snailpay';

const HTTP_STATUS_BY_DETAIL: Record<ChargeStatusDetail, number> = {
  accredited: 201,
  invalid_data: 400,
  invalid_amount: 400,
  bad_security_code: 402,
  bad_expiration_date: 402,
  insufficient_funds: 402,
  card_declined: 402,
  processing_timeout: 504,
  service_unavailable: 503,
};

export function createChargeHandler(config: SnailPayConfig): RequestHandler {
  return async (req, res) => {
    const response = await processCharge(req.body, config);
    res.status(HTTP_STATUS_BY_DETAIL[response.status_detail]).json(response);
  };
}