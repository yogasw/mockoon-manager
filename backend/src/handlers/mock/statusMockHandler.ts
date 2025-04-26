import { Request, Response } from 'express';
import { MockStatus, ApiResponse } from '../../types';
import { mockInstanceRepository } from '../../repositories/mock/mockInstanceRepository';
import { formatUptime } from '../../utils/fileUtils';

export function statusMockHandler(req: Request, res: Response<ApiResponse<MockStatus[]>>) {
  try {
    const status = Array.from(mockInstanceRepository.getAll().entries()).map(
      ([port, instance]) => ({
        port: parseInt(port.toString()),
        configFile: instance.configFile,
        uptime: Date.now() - instance.startTime.getTime(),
        uptimeFormatted: formatUptime(Date.now() - instance.startTime.getTime())
      })
    );

    res.json({ data: status });
  } catch (error: any) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: error.message });
  }
}
