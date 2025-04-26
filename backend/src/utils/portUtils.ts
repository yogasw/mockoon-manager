import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function isPortSafe(port: number): boolean {
  return port >= 9001 && port <= 9999;
}

export async function isPortInUse(port: number): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`netstat -tln | grep ":${port}"`);
    return stdout.length > 0;
  } catch (error) {
    return false;
  }
} 