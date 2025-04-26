import { Request, Response } from 'express';
import { ApiResponse } from '../../types';

export function healthCheckHandler(req: Request, res: Response<ApiResponse>) {
  res.json({ status: 'healthy' });
} 