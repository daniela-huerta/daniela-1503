import { Router } from 'express';
import { createChargeHandler } from '../controllers/snailpay.controller';
import type { SnailPayConfig } from '../types/snailpay';

export function createSnailPayRouter(config: SnailPayConfig): Router {
  const router = Router();
  router.post('/charges', createChargeHandler(config));
  return router;
}