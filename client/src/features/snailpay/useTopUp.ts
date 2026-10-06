import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { requestCharge } from './snailpayClient';
import { NETWORK_ERROR_MESSAGE, STATUS_MESSAGES, TIMEOUT_MESSAGE } from './snailpayMessages';
import type { TopUpFormValues } from './topUpSchema';
import { hasTransaction, saveTransaction } from './transactionStore';
import type { ChargeResponse } from './types';

export type TopUpState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'approved'; response: ChargeResponse }
  | { status: 'failed'; message: string };

export function useTopUp() {
  const { user, creditBalance } = useAuth();
  const [state, setState] = useState<TopUpState>({ status: 'idle' });

  async function submit(values: TopUpFormValues) {
    if (!user || state.status === 'submitting') return;

    setState({ status: 'submitting' });

    const result = await requestCharge({
      card_number: values.cardNumber,
      expiration_date: values.expirationDate,
      cvv: values.cvv,
      cardholder_name: values.cardholderName,
      amount: Number(values.amount),
      payer_id: user.id,
      payer_email: user.email,
    });

    if (result.kind === 'timeout') {
      setState({ status: 'failed', message: TIMEOUT_MESSAGE });
      return;
    }

    if (result.kind === 'network_error') {
      setState({ status: 'failed', message: NETWORK_ERROR_MESSAGE });
      return;
    }

    const { response } = result;

    if (!hasTransaction(response.id)) {
      saveTransaction(response);

      if (response.status === 'approved' && response.transaction_amount !== null) {
        creditBalance(response.transaction_amount);
      }
    }

    setState(
      response.status === 'approved'
        ? { status: 'approved', response }
        : { status: 'failed', message: STATUS_MESSAGES[response.status_detail] },
    );
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { state, submit, reset };
}