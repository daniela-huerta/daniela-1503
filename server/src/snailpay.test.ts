import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app';
import { TEST_CARDS } from './services/snailpay.service';
import type { SnailPayConfig } from './types/snailpay';

const defaultConfig: SnailPayConfig = {
  simulateOutage: false,
  slowResponseDelayMs: 0,
};

const validCharge = {
  card_number: TEST_CARDS.approved.number,
  expiration_date: TEST_CARDS.approved.expirationDate,
  cvv: TEST_CARDS.approved.cvv,
  cardholder_name: 'Ana Pruebas',
  amount: 150,
  payer_id: 'user-1',
  payer_email: 'ana@mail.com',
};

function postCharge(body: object, config: Partial<SnailPayConfig> = {}) {
  const app = createApp({ ...defaultConfig, ...config });
  return request(app).post('/api/snailpay/charges').send(body);
}

describe('POST /api/snailpay/charges', () => {
  it('approves a charge with the test card', async () => {
    const response = await postCharge(validCharge);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 150,
      payer_id: 'user-1',
      payer_email: 'ana@mail.com',
      card_number: validCharge.card_number,
      cvv: validCharge.cvv,
    });
    expect(response.body.authorization_code).toMatch(/^\d{6}$/);
  });

  it('rejects the test card when the CVV does not match', async () => {
    const response = await postCharge({ ...validCharge, cvv: '000' });

    expect(response.status).toBe(402);
    expect(response.body).toMatchObject({
      status: 'rejected',
      status_detail: 'bad_security_code',
      authorization_code: null,
    });
  });

  it('rejects malformed card data', async () => {
    const response = await postCharge({ ...validCharge, card_number: '1234' });

    expect(response.status).toBe(400);
    expect(response.body.status_detail).toBe('invalid_data');
  });

  it('never approves a charge while the service is down', async () => {
    const response = await postCharge(validCharge, { simulateOutage: true });

    expect(response.status).toBe(503);
    expect(response.body).toMatchObject({
      status: 'error',
      status_detail: 'service_unavailable',
      authorization_code: null,
    });
  });
});