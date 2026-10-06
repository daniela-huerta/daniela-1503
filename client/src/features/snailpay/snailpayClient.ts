import type { ChargeRequest, ChargeResponse, ChargeResult } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
export const CHARGE_TIMEOUT_MS = 8_000;

function isChargeResponse(data: unknown): data is ChargeResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'status' in data &&
    'status_detail' in data
  );
}

export async function requestCharge(
  request: ChargeRequest,
  timeoutMs = CHARGE_TIMEOUT_MS,
): Promise<ChargeResult> {
  try {
    const response = await fetch(`${API_URL}/api/snailpay/charges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const data: unknown = await response.json();

    return isChargeResponse(data)
      ? { kind: 'completed', response: data }
      : { kind: 'network_error' };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      return { kind: 'timeout' };
    }
    return { kind: 'network_error' };
  }
}