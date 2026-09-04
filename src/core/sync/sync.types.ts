import type { KametiId, SyncOperationId } from '../../types/common'

export type SyncStatus = 'queued' | 'syncing' | 'synced' | 'failed'
export interface SyncOperation { id: SyncOperationId; type: string; aggregateId: KametiId; dedupeKey: string; payload: unknown; localVersion: number; retryCount: number; status: SyncStatus; createdAt: string; nextRetryAt: string; error?: string }
export type SyncProcessor = (operation: SyncOperation) => Promise<void>
