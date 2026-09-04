import { database } from '../db/database'
import { MAX_SYNC_RETRIES } from '../config/constants'
import { claimOperation, pendingOperations } from './syncQueue'
import type { SyncProcessor } from './sync.types'

const retryableCodes = new Set(['unavailable', 'deadline-exceeded', 'network-error'])
const isRetryable = (error: unknown): boolean => error instanceof Error && retryableCodes.has(error.name)

export async function processQueue(processor: SyncProcessor, now = new Date()): Promise<{ synced: number; failed: number }> {
  const operations = await pendingOperations(now.toISOString())
  let synced = 0
  let failed = 0
  for (const queuedOperation of operations) {
    const operation = await claimOperation(queuedOperation.id, now.toISOString())
    if (!operation) continue
    try {
      await processor(operation)
      await database.syncOperations.update(operation.id, { status: 'synced', error: undefined })
      synced += 1
    } catch (error) {
      const retryCount = operation.retryCount + 1
      const retry = isRetryable(error) && retryCount <= MAX_SYNC_RETRIES
      await database.syncOperations.update(operation.id, { status: retry ? 'queued' : 'failed', retryCount, nextRetryAt: new Date(now.getTime() + Math.min(2 ** retryCount * 1000, 300000)).toISOString(), error: error instanceof Error ? error.message : 'Unknown sync error' })
      failed += 1
    }
  }
  return { synced, failed }
}
