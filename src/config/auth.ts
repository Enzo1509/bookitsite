import { z } from 'zod';

const envSchema = z.object({});

const env = envSchema.parse({});

export const authConfig = {} as const;

export type AuthConfig = typeof authConfig;