import { promises as fs } from 'fs';
import path from 'path';

const TMP_DIR = '/tmp';

function getTmpPath(filename: string): string {
  return path.join(TMP_DIR, filename);
}

function getBundledPath(filename: string): string {
  return path.join(process.cwd(), 'src', 'data', filename);
}

export async function readDataFile<T>(filename: string): Promise<T> {
  const tmpPath = getTmpPath(filename);
  try {
    const data = await fs.readFile(tmpPath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    const bundledPath = getBundledPath(filename);
    const data = await fs.readFile(bundledPath, 'utf-8');
    return JSON.parse(data) as T;
  }
}

export async function writeDataFile<T>(filename: string, data: T): Promise<void> {
  const tmpPath = getTmpPath(filename);
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
}
