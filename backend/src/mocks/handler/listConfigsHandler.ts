import { Request, Response } from 'express';
import { ApiResponse } from '@/types';
import {fileRepository} from "@/mocks/repositories/fileRepository";

export async function listConfigsHandler(req: Request, res: Response<ApiResponse<any[]>>) {
  try {
    const configs = await fileRepository.listConfigs();
    res.json({ data: configs });
  } catch (error: any) {
    console.error('Error listing configs:', error);
    res.status(500).json({ error: error.message });
  }
}
