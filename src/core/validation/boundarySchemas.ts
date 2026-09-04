import { z } from 'zod'
import { kametiSchema, paymentRecordSchema } from './domainSchemas'

export const persistedPaymentSchema = paymentRecordSchema
export const firestoreKametiSchema = kametiSchema
export const joinPayloadSchema = z.object({ kametiId: z.string().min(1), userId: z.string().min(1) })
