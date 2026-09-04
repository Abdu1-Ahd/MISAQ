import { z } from 'zod'

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().trim().min(1).optional(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().trim().min(1).optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().trim().min(1).optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().trim().min(1).optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().trim().min(1).optional(),
  VITE_FIREBASE_APP_ID: z.string().trim().min(1).optional(),
  VITE_MOCK_MODE: z.enum(['true', 'false']).default('true'),
}).superRefine((config, context) => {
  if (config.VITE_MOCK_MODE === 'false') {
    for (const key of ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID'] as const) {
      if (!config[key]) context.addIssue({ code: 'custom', path: [key], message: `${key} is required when mock mode is disabled` })
    }
  }
})

export const env = envSchema.parse(import.meta.env)
export const isFirebaseConfigured = Boolean(
  env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_AUTH_DOMAIN && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_APP_ID,
)
