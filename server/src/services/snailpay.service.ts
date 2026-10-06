import { randomInt, randomUUID } from 'node:crypto';
import { chargeRequestSchema, type ChargeRequest } from '../schemas/charge.schema';
import type {
  ChargeResponse,
  ChargeStatus,
  ChargeStatusDetail,
  SnailPayConfig,
} from '../types/snailpay';

export const TEST_CARDS = {
  approved: { number: '1234123412341234', expirationDate: '12/26', cvv: '543' },
  insufficientFunds: '4444444444444444',
  slowResponse: '0101010101010101',
} as const;

interface ChargeOutcome {
  status: ChargeStatus;
  detail: ChargeStatusDetail;
}

type EchoFields = Pick<
  ChargeResponse,
  'transaction_amount' | 'payer_id' | 'payer_email' | 'card_number' | 'cvv'
>;

function readField(body: unknown, key: string): unknown {
  if (typeof body === 'object' && body !== null && key in body) {
    return (body as Record<string, unknown>)[key];
  }
  return undefined;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function getEchoFields(body: unknown): EchoFields {
  const amount = readField(body, 'amount');

  return {
    transaction_amount: typeof amount === 'number' ? amount : null,
    payer_id: asString(readField(body, 'payer_id')),
    payer_email: asString(readField(body, 'payer_email')),
    card_number: asString(readField(body, 'card_number')),
    cvv: asString(readField(body, 'cvv')),
  };
}

function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0 && Number(amount.toFixed(2)) === amount;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decideOutcome(request: ChargeRequest): ChargeOutcome {
  if (!isValidAmount(request.amount)) {
    return { status: 'rejected', detail: 'invalid_amount' };
  }

  if (request.card_number === TEST_CARDS.approved.number) {
    if (request.expiration_date !== TEST_CARDS.approved.expirationDate) {
      return { status: 'rejected', detail: 'bad_expiration_date' };
    }
    if (request.cvv !== TEST_CARDS.approved.cvv) {
      return { status: 'rejected', detail: 'bad_security_code' };
    }
    return { status: 'approved', detail: 'accredited' };
  }

  if (request.card_number === TEST_CARDS.insufficientFunds) {
    return { status: 'rejected', detail: 'insufficient_funds' };
  }

  return { status: 'rejected', detail: 'card_declined' };
}

function buildResponse(outcome: ChargeOutcome, echo: EchoFields): ChargeResponse {
  return {
    id: `chg_${randomUUID()}`,
    status: outcome.status,
    status_detail: outcome.detail,
    date_created: new Date().toISOString(),
    authorization_code: outcome.status === 'approved' ? String(randomInt(100_000, 1_000_000)) : null,
    reference: `SNP-${randomUUID().slice(0, 8).toUpperCase()}`,
    ...echo,
  };
}

export async function processCharge(
  body: unknown,
  config: SnailPayConfig,
): Promise<ChargeResponse> {
  const echo = getEchoFields(body);

  if (config.simulateOutage) {
    return buildResponse({ status: 'error', detail: 'service_unavailable' }, echo);
  }

  const parsed = chargeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return buildResponse({ status: 'rejected', detail: 'invalid_data' }, echo);
  }

  if (parsed.data.card_number === TEST_CARDS.slowResponse) {
    await wait(config.slowResponseDelayMs);
    return buildResponse({ status: 'error', detail: 'processing_timeout' }, echo);
  }

  return buildResponse(decideOutcome(parsed.data), echo);
}