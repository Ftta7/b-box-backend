import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-char
}

export async function hashApiKey(apiKey: string): Promise<string> {
  return bcrypt.hash(apiKey, 10);
}

export async function verifyApiKey(apiKey: string, hash: string): Promise<boolean> {
  return bcrypt.compare(apiKey, hash);
}