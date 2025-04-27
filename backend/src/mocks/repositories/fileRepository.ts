import fs from 'fs';
import path from 'path';
import {ensureDirectoryExists, formatFileSize} from "@/utils/fileUtils";

const mockInstances = new Map();

class FileRepository {
    private configsDir: string;
    private uploadsDir: string;

    constructor() {
        this.configsDir = path.join(process.cwd(), process.env.CONFIGS_DIR || 'configs');
        this.uploadsDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
        ensureDirectoryExists(this.configsDir);
        ensureDirectoryExists(this.uploadsDir);
    }

    async listConfigs(): Promise<{ name: string; size: string; modified: Date; inUse: boolean }[]> {
        try {
            const configsDir = this.configsDir
            if (!fs.existsSync(this.configsDir)) {
                fs.mkdirSync(configsDir, {recursive: true});
            }
            return fs
                .readdirSync(configsDir)
                .filter((file) => file.endsWith(".json"))
                .map((file) => {
                    const stats = fs.statSync(path.join(configsDir, file));
                    return {
                        name: file,
                        size: formatFileSize(stats.size),
                        modified: stats.mtime,
                        inUse: Array.from(mockInstances.values()).some(
                            (instance) => instance.configFile === file
                        ),
                    };
                })
        } catch (error) {
            return []
        }
    }

    async getConfigPath(filename: string): Promise<string> {
        return path.join(this.configsDir, filename);
    }

    async configExists(filename: string): Promise<boolean> {
        try {
            await fs.promises.access(path.join(this.configsDir, filename));
            return true;
        } catch {
            return false;
        }
    }

    async deleteConfig(filename: string): Promise<void> {
        await fs.promises.unlink(path.join(this.configsDir, filename));
    }

    async moveUploadedFile(sourcePath: string, filename: string): Promise<void> {
        const targetPath = path.join(this.configsDir, filename);
        await fs.promises.rename(sourcePath, targetPath);
    }
}

export const fileRepository = new FileRepository();
