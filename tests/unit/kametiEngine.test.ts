import { describe, expect, it } from 'vitest'
import { addFrequency, canStart, countPayments, getCountdown, getTurnTimeline } from '../../src/core/engine/kametiEngine'
import { formatPakistanDate } from '../../src/core/dates/dateUtils'
import type { UserId } from '../../src/types/common'

const id = (value: string) => value as UserId
const kameti = { memberOrder: [id('a'), id('b'), id('c')], firstTurnDate: '2026-01-01T00:00:00.000Z', frequencyValue: 1, frequencyUnit: 'months' as const }

describe('kametiEngine', () => {
  it('calculates current and upcoming turns deterministically', () => {
    const turns = getTurnTimeline(kameti, new Date('2026-01-15T00:00:00.000Z'))
    expect(turns.map((turn) => turn.state)).toEqual(['current', 'upcoming', 'upcoming'])
  })
  it('calculates countdown and payment totals', () => {
    expect(getCountdown('2026-01-10T00:00:00.000Z', new Date('2026-01-01T00:00:00.000Z')).totalDays).toBe(9)
    expect(countPayments({ a: { status: 'paid' }, b: { status: 'pending' } })).toEqual({ paid: 1, remaining: 1 })
  })
  it('supports full-cap and force starts', () => {
    expect(canStart({ status: 'processing', memberIds: [id('a')], memberCap: 2 })).toBe(false)
    expect(canStart({ status: 'processing', memberIds: [id('a')], memberCap: 2 }, true)).toBe(true)
  })
  it('formats dates in Pakistan time at UTC day boundaries', () => {
    expect(formatPakistanDate('2026-01-01T22:00:00.000Z')).toContain('2')
  })
  it('preserves month-end cycles and treats period end as exclusive', () => {
    expect(addFrequency(new Date('2026-01-31T00:00:00.000Z'), 2, 'months').toISOString()).toContain('2026-03-31')
    expect(getTurnTimeline(kameti, new Date('2026-02-01T00:00:00.000Z'))[0].state).toBe('passed')
  })
})
