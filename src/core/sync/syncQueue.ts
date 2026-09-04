import { database } from '../db/database'
import type { SyncOperation } from './sync.types'

export const enqueue = async (operation: SyncOperation): Promise<void> => {
	const normalized: SyncOperation = { ...operation, status: operation.status === 'synced' ? 'queued' : operation.status }
	await database.transaction('rw', database.syncOperations, async () => {
		await database.syncOperations.where('[type+aggregateId+dedupeKey+status]').equals([normalized.type, normalized.aggregateId, normalized.dedupeKey, 'queued']).delete()
		await database.syncOperations.put(normalized)
	})
}

export const claimOperation = async (id: SyncOperation['id'], now: string): Promise<SyncOperation | undefined> => database.transaction('rw', database.syncOperations, async () => {
	const operation = await database.syncOperations.get(id)
	if (!operation || operation.status !== 'queued' || operation.nextRetryAt > now) return undefined
	await database.syncOperations.update(id, { status: 'syncing' })
	return { ...operation, status: 'syncing' }
})

export const pendingOperations = async (now = new Date().toISOString()): Promise<SyncOperation[]> => {
	const operations = await database.syncOperations.where('status').equals('queued').toArray()
	return operations.filter((operation) => operation.nextRetryAt <= now)
}
