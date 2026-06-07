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

function VideoFrame({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
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
    <article className="card card-hover overflow-hidden">
      <div className="p-4 sm:p-5">
        {override ? (
          /* ---------- Zamijenjena vježba ---------- */
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-emerald">Zamijenjeno</span>
              <span className="text-xs text-zinc-500 line-through">{ex.name}</span>
            </div>
            <h2 className="m-0 text-base font-semibold tracking-tight sm:text-lg">
              <span className="text-zinc-400">{index + 1}.</span> {override.name}
            </h2>
            {ex.setsReps && (
              <span className="badge w-fit max-w-full whitespace-normal">{ex.setsReps}</span>
            )}
            <p className="text-sm leading-relaxed text-zinc-300">{override.reason}</p>
            {override.video && <VideoFrame videoId={override.video.videoId} title={override.video.title} />}
          </div>
        ) : (
          /* ---------- Originalna vježba ---------- */
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
            {ex.imageUrl && (
              <div className="w-full sm:w-[240px] sm:min-w-[240px] sm:shrink-0">
                <div className="mb-1.5 text-xs font-medium text-zinc-500">Izvođenje</div>
                <div className="aspect-[11/8] w-full overflow-hidden rounded-xl bg-zinc-950/80 shadow-lg ring-1 ring-white/10">
                  <img
                    src={ex.imageUrl ?? undefined}
                    alt={`Kako raditi: ${ex.name}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <h2 className="m-0 text-base font-semibold tracking-tight sm:text-lg sm:pr-2">
                  <span className="text-zinc-400">{index + 1}.</span> {ex.name}
                </h2>
                {ex.setsReps && (
                  <span className="badge w-fit max-w-full shrink-0 whitespace-normal">{ex.setsReps}</span>
                )}
              </div>

              {ex.description && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                  {ex.description}
                </p>
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
        )}

        {/* ---------- Akcije (uvijek dostupne, responsivne) ---------- */}
        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-white/5 pt-4 sm:grid-cols-2">
          {override ? (
            <>
              <button className="btn-ghost" onClick={() => setAssistant('alternatives')}>
                🔄 Druga zamjena
              </button>
              <button className="btn-ghost" onClick={clearOverride}>
                ↩︎ Vrati originalnu
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => setAssistant('explain')}>
                🎥 Objasni mi vježbu
              </button>
              <button className="btn-ghost" onClick={() => setAssistant('alternatives')}>
                🔄 Zamijeni vježbu
              </button>
            </>
          )}
        </div>
      </div>

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