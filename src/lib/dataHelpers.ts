import { kvSet, kvGetOrSeed } from '@/lib/kv';
import { promises as fs } from 'fs';
import path from 'path';

function getBundledPath(filename: string): string {
  return path.join(process.cwd(), 'src', 'data', filename);
}

function stripExtension(filename: string): string {
  return filename.replace(/\.json$/, '');
}

export async function readDataFile<T>(filename: string): Promise<T> {
  const kvKey = stripExtension(filename);
  const kvData = await kvGetOrSeed<T>(kvKey);
  if (kvData !== null && kvData !== undefined) return kvData;

  const bundledPath = getBundledPath(filename);
  const data = await fs.readFile(bundledPath, 'utf-8');
  return JSON.parse(data) as T;
}

export async function writeDataFile<T>(filename: string, data: T): Promise<void> {
  const kvKey = stripExtension(filename);
  await kvSet(kvKey, data);
}
