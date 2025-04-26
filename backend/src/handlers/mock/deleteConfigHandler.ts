import { Request, Response } from 'express';
import { ApiResponse } from '../../types';
import { fileRepository } from '../../repositories/mock/fileRepository';

export async function deleteConfigHandler(req: Request, res: Response<ApiResponse>) {
  const { filename } = req.params;

  try {
    if (!await fileRepository.configExists(filename)) {
      return res.status(404).json({ error: 'Configuration file not found' });
    }

    await fileRepository.deleteConfig(filename);
    res.json({ success: true, message: 'Configuration file deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting config:', error);
    res.status(500).json({ error: error.message });
  }
}
