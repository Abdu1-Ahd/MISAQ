import { z } from 'zod'
import { MAX_MEMBER_CAP, MIN_MEMBER_CAP } from '../config/constants'

export const frequencyUnitSchema = z.enum(['days', 'weeks', 'months'])
export const kametiStatusSchema = z.enum(['processing', 'active', 'completed'])
export const paymentStatusSchema = z.enum(['paid', 'pending'])
export const paymentRecordSchema = z.object({ status: paymentStatusSchema, updatedAt: z.string().datetime().optional(), updatedBy: z.string().optional() })
export const kametiSchema = z.object({
  id: z.string().min(1), name: z.string().trim().min(2).max(80), managerId: z.string().min(1), amount: z.number().positive(),
  frequencyValue: z.number().int().positive(), frequencyUnit: frequencyUnitSchema, memberCap: z.number().int().min(MIN_MEMBER_CAP).max(MAX_MEMBER_CAP),
  memberIds: z.array(z.string()), memberOrder: z.array(z.string()), status: kametiStatusSchema,
  startedAt: z.string().datetime().optional(), firstTurnDate: z.string().datetime().optional(), updatedAt: z.string().datetime(),
  version: z.number().int().nonnegative(), schemaVersion: z.number().int().positive(), createdAt: z.string().datetime(),
})
export const kametiInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  amount: z.number().positive(),
  frequencyValue: z.number().int().positive(),
  frequencyUnit: frequencyUnitSchema,
  memberCap: z.number().int().min(MIN_MEMBER_CAP).max(MAX_MEMBER_CAP),
})
