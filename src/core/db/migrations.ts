import { database } from './database'

export async function runMigrations(): Promise<void> {
  await database.open()
}
