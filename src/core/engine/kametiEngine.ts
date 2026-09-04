import { addDays, addMonths, addWeeks, differenceInCalendarDays, getDaysInMonth, isLastDayOfMonth, isBefore, parseISO, setDate } from 'date-fns'
import type { Kameti, Period } from '../../types/kameti'
import type { PaymentMap } from '../../types/payment'
import type { UserId } from '../../types/common'

export type TurnState = 'upcoming' | 'current' | 'passed' | 'completed'

export interface TurnSummary {
  userId: UserId
  periodIndex: number
  startDate: string
  endDate: string
  state: TurnState
}

export interface Countdown { totalDays: number; label: 'before' | 'today' | 'passed' }

export function addFrequency(date: Date, value: number, unit: Kameti['frequencyUnit']): Date {
  if (unit === 'days') return addDays(date, value)
  if (unit === 'weeks') return addWeeks(date, value)
  const result = addMonths(date, value)
  return isLastDayOfMonth(date) ? setDate(result, getDaysInMonth(result)) : result
}

export function calculatePeriods(kameti: Pick<Kameti, 'memberOrder' | 'firstTurnDate' | 'frequencyValue' | 'frequencyUnit'>): TurnSummary[] {
  if (!kameti.firstTurnDate) return []
  const firstTurnDate = kameti.firstTurnDate
  return kameti.memberOrder.map((userId, periodIndex) => {
    const start = addFrequency(parseISO(firstTurnDate), periodIndex * kameti.frequencyValue, kameti.frequencyUnit)
    const end = addFrequency(start, kameti.frequencyValue, kameti.frequencyUnit)
    return { userId, periodIndex, startDate: start.toISOString(), endDate: end.toISOString(), state: 'upcoming' }
  })
}

export function getTurnTimeline(kameti: Pick<Kameti, 'memberOrder' | 'firstTurnDate' | 'frequencyValue' | 'frequencyUnit'>, referenceDate: Date): TurnSummary[] {
  return calculatePeriods(kameti).map((turn) => {
    const start = parseISO(turn.startDate)
    const end = parseISO(turn.endDate)
    const state: TurnState = isBefore(referenceDate, start) ? 'upcoming' : isBefore(referenceDate, end) ? 'current' : 'passed'
    return { ...turn, state }
  })
}

export function getCountdown(startDate: string, referenceDate: Date): Countdown {
  const days = differenceInCalendarDays(parseISO(startDate), referenceDate)
  return { totalDays: days, label: days > 0 ? 'before' : days === 0 ? 'today' : 'passed' }
}

export function countPayments(payments: PaymentMap): { paid: number; remaining: number } {
  const paid = Object.values(payments).filter((payment) => payment.status === 'paid').length
  return { paid, remaining: Object.keys(payments).length - paid }
}

export function getOwnTurn(timeline: TurnSummary[], userId: UserId): TurnSummary | undefined {
  return timeline.find((turn) => turn.userId === userId)
}

export function isComplete(kameti: Pick<Kameti, 'status' | 'memberOrder' | 'firstTurnDate' | 'frequencyValue' | 'frequencyUnit'>, referenceDate: Date): boolean {
  if (kameti.status === 'completed') return true
  const timeline = getTurnTimeline(kameti, referenceDate)
  return timeline.length > 0 && timeline.every((turn) => turn.state === 'passed')
}

export function canStart(kameti: Pick<Kameti, 'status' | 'memberIds' | 'memberCap'>, force = false): boolean {
  return kameti.status === 'processing' && kameti.memberIds.length > 0 && (force || kameti.memberIds.length >= kameti.memberCap)
}

export function periodFromTurn(kametiId: Kameti['id'], turn: TurnSummary, payments: PaymentMap): Period {
  return { id: `${kametiId}-${turn.periodIndex}` as Period['id'], kametiId, periodIndex: turn.periodIndex, turnHolderUid: turn.userId, startDate: turn.startDate, endDate: turn.endDate, payments }
}
