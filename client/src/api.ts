import type { WeekSchedule, Day } from './types'

const isDev = typeof import.meta.env.DEV !== 'undefined' && import.meta.env.DEV
const apiUrl = import.meta.env.VITE_API_URL as string | undefined
const assetOrigin = import.meta.env.VITE_ASSET_ORIGIN as string | undefined

const API_BASE = isDev ? 'http://localhost:3001/api' : (apiUrl ?? '/api')
export const ASSET_ORIGIN = isDev
  ? 'http://localhost:3001'
  : typeof window !== 'undefined' && window.location?.protocol === 'file:'
    ? 'http://localhost:3001'
    : (assetOrigin ?? '')

async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url)
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${msg || res.statusText}`)
  }
  return res.json()
}

export async function getWeekSchedule(): Promise<WeekSchedule> {
  return fetchApi<WeekSchedule>('/schedule')
}

export async function getDay(dayId: string): Promise<Day> {
  return fetchApi<Day>(`/days/${dayId}`)
}
