import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDay, ASSET_ORIGIN } from '../api'
import type { Day } from '../types'

const DAY_NAMES = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja']

export default function DayView() {
  const { dayId } = useParams<{ dayId: string }>()
  const [day, setDay] = useState<Day | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dayId) return
    getDay(dayId)
      .then(setDay)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [dayId])

  if (loading) return <p className="text-sm text-zinc-400">Učitavanje...</p>
  if (error) return <p className="text-sm text-red-400">Greška: {error}</p>
  if (!day) return null

  const dayName = DAY_NAMES[day.weekDay] ?? `Dan ${day.weekDay + 1}`

  return (
    <div>
      <Link
        to="/"
        className="btn-ghost mb-4"
      >
        ← Nazad na raspored
      </Link>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-indigo">{dayName}</span>
          {day.exercises.length > 0 && (
            <span className="badge badge-emerald">{day.exercises.length} vežbi</span>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{day.name}</h1>
      </div>

      {day.exercises.length === 0 && (
        <div className="card overflow-hidden p-6 sm:p-8 text-center">
          <p className="text-lg font-medium text-zinc-200">Dan za odmor.</p>
          <p className="mt-2 text-sm text-zinc-400">Ništa specijalno — iskoristi ga za oporavak i budi spreman za sledeću nedelju.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {day.exercises.map((ex, i) => (
          <article
            key={ex.id}
            className="card overflow-hidden"
          >
            <div className="flex flex-wrap gap-5 p-4 sm:p-5">
              {ex.imageUrl && (
                <div className="shrink-0">
                  <div className="text-xs font-medium text-zinc-500 mb-1.5">Izvođenje</div>
                  <div
                    className="h-[180px] w-[220px] min-w-[220px] overflow-hidden rounded-xl bg-zinc-950/80 ring-1 ring-white/10 shadow-lg"
                  >
                    <img
                      src={ex.imageUrl ? `${ASSET_ORIGIN}${ex.imageUrl}` : undefined}
                      alt={`Kako raditi: ${ex.name}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="m-0 text-base font-semibold tracking-tight sm:text-lg">
                    <span className="text-zinc-400">{i + 1}.</span> {ex.name}
                  </h2>
                  {ex.setsReps && <span className="badge max-w-full whitespace-normal">{ex.setsReps}</span>}
                </div>
                {ex.setsReps && (
                  <p className="mt-2 text-sm text-emerald-400 sm:hidden">{ex.setsReps}</p>
                )}
                {ex.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">{ex.description}</p>
                )}
                {ex.videoUrl && (
                  <a
                    href={ex.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
                  >
                    Pogledaj video →
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {day.exercises.length > 0 && (
      <details className="card mt-6 p-4 sm:p-5">
        <summary className="cursor-pointer select-none text-sm font-semibold text-zinc-100">
          Posebne tehnike (podsetnik)
        </summary>
        <div className="mt-3 space-y-3 text-sm text-zinc-300">
          <div>
            <div className="font-semibold text-zinc-100">Drop set</div>
            <div className="text-zinc-300">
              Radiš seriju do otkaza, odmah smanjiš težinu i nastaviš bez odmora.
            </div>
          </div>
          <div>
            <div className="font-semibold text-zinc-100">Triple drop set</div>
            <div className="text-zinc-300">
              Isto kao drop set, ali smanjiš težinu 3 puta zaredom bez odmora.
            </div>
          </div>
          <div>
            <div className="font-semibold text-zinc-100">Cluster set</div>
            <div className="text-zinc-300">
              Npr. 5 ponavljanja → pauza 15 sekundi → 5 ponavljanja → pauza → 5 ponavljanja (sve se računa kao jedna serija).
            </div>
          </div>
        </div>
      </details>
      )}
    </div>
  )
}
