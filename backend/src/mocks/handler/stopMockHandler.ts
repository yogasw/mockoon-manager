import { Request, Response } from 'express';
import {mockInstanceRepository} from "@/mocks/repositories/mockInstanceRepository";
import {ApiResponse, StopMockResponse} from "@/types";

export function stopMockHandler(req: Request, res: Response<ApiResponse<StopMockResponse>>) {
  const { port } = req.body;

  if (!mockInstanceRepository.has(port)) {
    return res.status(404).json({ error: 'Instance not found' });
  }

  try {
    const instance = mockInstanceRepository.get(port);
    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }

    instance.process.kill();
    instance.logFile.end();
    mockInstanceRepository.delete(port);

    const response: StopMockResponse = {
      success: true,
      port,
      message: `Mock server on port ${port} stopped`
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error stopping mock server:', error);
    res.status(500).json({ error: error.message });
  }
}
