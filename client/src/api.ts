import type { WeekSchedule, Day, ExplainResult, AlternativeResult } from './types'

import { SCHEDULE } from './data/schedule'

export async function getWeekSchedule(): Promise<WeekSchedule> {
  return SCHEDULE
}

export async function getDay(dayId: string): Promise<Day> {
  const day = SCHEDULE.days.find((d) => d.id === dayId)
  if (!day) throw new Error('Dan nije pronađen')
  return day
}

interface AiPayload {
  name: string
  description: string | null
  mode: 'explain' | 'alternatives'
}

async function postAi<T>(payload: AiPayload): Promise<T> {
  const resp = await fetch('/api/exercise-ai', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    throw new Error((data as { error?: string }).error ?? 'Greška pri pozivu AI servisa.')
  }
  return data as T
}

export function explainExercise(name: string, description: string | null): Promise<ExplainResult> {
  return postAi<ExplainResult>({ name, description, mode: 'explain' })
}

export function suggestAlternatives(
  name: string,
  description: string | null,
): Promise<{ alternatives: AlternativeResult[] }> {
  return postAi<{ alternatives: AlternativeResult[] }>({ name, description, mode: 'alternatives' })
}
