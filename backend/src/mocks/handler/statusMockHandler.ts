import { Request, Response } from 'express';
import {mockInstanceRepository} from "@/mocks/repositories/mockInstanceRepository";
import {ApiResponse, MockStatus} from "@/types";
import {formatUptime} from "@/utils/fileUtils";

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
