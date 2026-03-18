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
          <p className="mt-1 text-sm text-zinc-400">Klikni dan da vidiš vježbe, serije i opis.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-emerald">{schedule.days.length} dana</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schedule.days.map((day) => (
          <Link
            key={day.id}
            to={`/dan/${day.id}`}
            className="card card-hover group p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-zinc-300">
                  {DAY_NAMES[day.weekDay] ?? `Dan ${day.weekDay + 1}`}
                </div>
                <div className="mt-1 truncate text-lg font-semibold tracking-tight text-zinc-100 group-hover:text-white">
                  {day.name}
                </div>
              </div>
              <div className="badge shrink-0">{day.exercises.length} vežbi</div>
            </div>

            <div className="mt-3 h-px w-full bg-white/10" />

            <div className="mt-3 text-sm text-zinc-400">
              Otvori detalje <span className="text-zinc-200">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
