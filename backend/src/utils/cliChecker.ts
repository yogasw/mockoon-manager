import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkMockoonCli(): Promise<boolean> {
  try {
    await execAsync('mockoon-cli --version');
    return true;
  } catch (error) {
    console.error('Error checking mockoon-cli:', error);
    return false;
  }
} 