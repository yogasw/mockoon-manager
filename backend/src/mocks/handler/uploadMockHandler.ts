import { Request, Response } from 'express';
import {ApiResponse, UploadResponse} from "@/types";
import {fileRepository} from "@/mocks/repositories/fileRepository";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function uploadMockHandler(req: MulterRequest, res: Response<ApiResponse<UploadResponse>>) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const existingFiles = await fileRepository.listConfigs();
    let isIcloudFile = false;
    for (const file of existingFiles) {
        if (file.name === req.file.filename) {
            isIcloudFile = true;
            break;
        }
    }
    if (isIcloudFile) {
      return res.status(409).json({
        error: 'A configuration with this name already exists. Please upload with a different filename.'
      });
    }

    await fileRepository.moveUploadedFile(req.file.path, req.file.filename);

    const response: UploadResponse = {
      success: true,
      filename: req.file.filename,
      message: 'Configuration file uploaded successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
}
