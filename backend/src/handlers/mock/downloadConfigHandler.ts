import { Request, Response } from 'express';
import { ApiResponse } from '../../types';
import { fileRepository } from '../../repositories/mock/fileRepository';

export async function downloadConfigHandler(req: Request, res: Response<ApiResponse>) {
  const { filename } = req.params;

  try {
    if (!await fileRepository.configExists(filename)) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }

    const configPath = await fileRepository.getConfigPath(filename);
    res.download(configPath);
  } catch (error: any) {
    console.error('Error downloading config:', error);
    res.status(500).json({ error: error.message });
  }
}
