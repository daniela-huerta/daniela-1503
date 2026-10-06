import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { createSnailPayRouter } from './routes/snailpay.routes';
import type { SnailPayConfig } from './types/snailpay';

export function createApp(config: SnailPayConfig) {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/snailpay', createSnailPayRouter(config));

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error);
    res.status(500).json({ status: 'error', status_detail: 'internal_error' });
  });

  return app;
}