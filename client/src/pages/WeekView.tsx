import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWeekSchedule } from '../api'
import type { WeekSchedule } from '../types'

const DAY_NAMES = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja']

export default function WeekView() {
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getWeekSchedule()
      .then(setSchedule)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-zinc-400">Učitavanje...</p>
  if (error) return <p className="text-sm text-red-400">Greška: {error}</p>
  if (!schedule) return null

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{schedule.name}</h1>
          <p className="mt-1 text-sm text-zinc-400">Klikni dan da vidiš vežbe, serije i opis.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-emerald">{schedule.days.length} dana</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schedule.days.map((day) => {
          const rest = day.name.toLowerCase().includes('odmor') || day.exercises.length === 0
          return (
            <Link
              key={day.id}
              to={`/dan/${day.id}`}
              className="card card-hover group relative overflow-hidden p-4 sm:p-5"
            >
              <span
                className={`absolute inset-y-0 left-0 w-1 ${
                  rest ? 'bg-brand-indigo-400/40' : 'bg-brand-emerald-400/50'
                }`}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    {DAY_NAMES[day.weekDay] ?? `Dan ${day.weekDay + 1}`}
                  </div>
                  <div className="mt-1 truncate text-lg font-semibold tracking-tight text-zinc-100 group-hover:text-white">
                    {day.name}
                  </div>
                </div>
                <div className={`badge shrink-0 ${rest ? 'badge-indigo' : 'badge-emerald'}`}>
                  {rest ? 'Odmor' : `${day.exercises.length} vježbi`}
                </div>
              </div>

              <div className="mt-3 h-px w-full bg-white/10" />

              {rest ? (
                <p className="mt-3 text-sm text-zinc-400">Dan za oporavak 💤</p>
              ) : (
                <ul className="mt-3 space-y-1 text-sm text-zinc-400">
                  {day.exercises.slice(0, 3).map((ex) => (
                    <li key={ex.id} className="truncate">
                      • {ex.name}
                    </li>
                  ))}
                  {day.exercises.length > 3 && (
                    <li className="text-zinc-500">+ još {day.exercises.length - 3}…</li>
                  )}
                </ul>
              )}

              <div className="mt-4 text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
                Otvori detalje →
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
