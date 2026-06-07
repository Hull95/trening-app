import { useState } from 'react'
import type { Exercise, ExerciseOverride } from '../types'
import ExerciseAssistant from './ExerciseAssistant'

const overrideKey = (id: string) => `trening-override-${id}`

function loadOverride(id: string): ExerciseOverride | null {
  try {
    const raw = localStorage.getItem(overrideKey(id))
    return raw ? (JSON.parse(raw) as ExerciseOverride) : null
  } catch {
    return null
  }
}

export default function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [override, setOverride] = useState<ExerciseOverride | null>(() => loadOverride(exercise.id))
  const [assistant, setAssistant] = useState<'explain' | 'alternatives' | null>(null)

  function applyOverride(o: ExerciseOverride) {
    try {
      localStorage.setItem(overrideKey(exercise.id), JSON.stringify(o))
    } catch {
      /* localStorage možda nedostupan — svejedno prikaži u sesiji */
    }
    setOverride(o)
    setAssistant(null)
  }

  function clearOverride() {
    try {
      localStorage.removeItem(overrideKey(exercise.id))
    } catch {
      /* ignore */
    }
    setOverride(null)
  }

  const ex = exercise

  return (
    <article className="card overflow-hidden">
      {override ? (
        // ---------- Prikaz zamijenjene vježbe ----------
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="badge badge-emerald">Zamijenjeno</span>
            <span className="text-xs text-zinc-500 line-through">{ex.name}</span>
          </div>
          <h2 className="m-0 text-base font-semibold tracking-tight sm:text-lg">
            <span className="text-zinc-400">{index + 1}.</span> {override.name}
          </h2>
          {ex.setsReps && (
            <span className="badge mt-3 w-fit max-w-full whitespace-normal">{ex.setsReps}</span>
          )}
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{override.reason}</p>

          {override.video && (
            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${override.video.videoId}`}
                title={override.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={() => setAssistant('alternatives')}>
              🔄 Druga zamjena
            </button>
            <button className="btn-ghost" onClick={clearOverride}>
              ↩︎ Vrati originalnu
            </button>
          </div>
        </div>
      ) : (
        // ---------- Prikaz originalne vježbe ----------
        <>
          <div className="flex flex-col gap-4 p-4 sm:p-5 md:flex-row md:gap-5">
            <div className="order-2 w-full md:order-1 md:w-[260px] md:min-w-[260px] md:shrink-0">
              {ex.imageUrl && (
                <div className="w-full">
                  <div className="mb-1.5 text-xs font-medium text-zinc-500">Izvođenje</div>
                  <div className="aspect-[11/8] w-full overflow-hidden rounded-xl bg-zinc-950/80 ring-1 ring-white/10 shadow-lg md:h-[180px] md:aspect-auto">
                    <img
                      src={ex.imageUrl ?? undefined}
                      alt={`Kako raditi: ${ex.name}`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="order-1 min-w-0 flex-1 md:order-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-4">
                <h2 className="m-0 text-base font-semibold tracking-tight sm:text-lg md:pr-2">
                  <span className="text-zinc-400">{index + 1}.</span> {ex.name}
                </h2>
                {ex.setsReps && (
                  <span className="badge hidden max-w-full whitespace-normal md:inline-flex md:shrink-0">
                    {ex.setsReps}
                  </span>
                )}
              </div>

              {ex.description && (
                <p className="mt-3 hidden whitespace-pre-wrap text-sm leading-relaxed text-zinc-300 md:block">
                  {ex.description}
                </p>
              )}

              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300 md:mt-3"
                >
                  Pogledaj video →
                </a>
              )}

              <div className="mt-4 hidden flex-wrap gap-2 md:flex">
                <button className="btn-ghost" onClick={() => setAssistant('explain')}>
                  🎥 Objasni mi vježbu
                </button>
                <button className="btn-ghost" onClick={() => setAssistant('alternatives')}>
                  🔄 Zamijeni vježbu
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:hidden">
            {ex.setsReps && <span className="badge w-fit max-w-full whitespace-normal">{ex.setsReps}</span>}
            {ex.description && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {ex.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-ghost" onClick={() => setAssistant('explain')}>
                🎥 Objasni mi vježbu
              </button>
              <button className="btn-ghost" onClick={() => setAssistant('alternatives')}>
                🔄 Zamijeni vježbu
              </button>
            </div>
          </div>
        </>
      )}

      {assistant && (
        <ExerciseAssistant
          exercise={ex}
          mode={assistant}
          onClose={() => setAssistant(null)}
          onChoose={applyOverride}
        />
      )}
    </article>
  )
}