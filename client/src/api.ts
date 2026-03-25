import type { WeekSchedule, Day } from './types'

import { SCHEDULE } from './data/schedule'

export async function getWeekSchedule(): Promise<WeekSchedule> {
  return SCHEDULE
}

export async function getDay(dayId: string): Promise<Day> {
  const day = SCHEDULE.days.find((d) => d.id === dayId)
  if (!day) throw new Error('Dan nije pronađen')
  return day
}
