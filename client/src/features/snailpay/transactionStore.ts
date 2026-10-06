import { readJSON, writeJSON, STORAGE_KEYS } from '../../lib/storage';
import type { ChargeResponse } from './types';

export function getTransactions(): ChargeResponse[] {
  return readJSON<ChargeResponse[]>(STORAGE_KEYS.transactions, []);
}

export function hasTransaction(id: string): boolean {
  return getTransactions().some((transaction) => transaction.id === id);
}

export function saveTransaction(response: ChargeResponse): void {
  writeJSON(STORAGE_KEYS.transactions, [...getTransactions(), response]);
}