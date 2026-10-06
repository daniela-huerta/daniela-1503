import type { SnailPayConfig } from './types/snailpay';

export function loadConfig(): SnailPayConfig {
  return {
    simulateOutage: process.env.SNAILPAY_SIMULATE_OUTAGE === 'true',
    slowResponseDelayMs: Number(process.env.SNAILPAY_SLOW_DELAY_MS) || 15_000,
  };
}