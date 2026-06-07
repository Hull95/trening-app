import { useEffect, useState } from 'react'
import { explainExercise, suggestAlternatives } from '../api'
import type { AiVideo, AlternativeResult, Exercise, ExerciseOverride } from '../types'

type Mode = 'explain' | 'alternatives'

function YoutubeEmbed({ video }: { video: AiVideo | null }) {
  if (!video) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-sm text-zinc-400">
        🎬 Video trenutno nije dostupan. (Provjeri da je <code className="text-zinc-300">YOUTUBE_API_KEY</code>{' '}
        postavljen na Vercel-u.)
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function Skeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="h-3 w-5/6 rounded bg-white/10" />
      <div className="h-3 w-full rounded bg-white/10" />
      <div className="h-3 w-4/6 rounded bg-white/10" />
      <div className="mt-2 aspect-video w-full rounded-xl bg-white/10" />
    </div>
  )
}

export default function ExerciseAssistant({
  exercise,
  mode,
  onClose,
  onChoose,
}: {
  exercise: Exercise
  mode: Mode
  onClose: () => void
  onChoose: (override: ExerciseOverride) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [video, setVideo] = useState<AiVideo | null>(null)
  const [alternatives, setAlternatives] = useState<AlternativeResult[]>([])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const run =
      mode === 'explain'
        ? explainExercise(exercise.name, exercise.description).then((r) => {
            if (!active) return
            setExplanation(r.explanation)
            setVideo(r.video)
          })
        : suggestAlternatives(exercise.name, exercise.description).then((r) => {
            if (!active) return
            setAlternatives(r.alternatives ?? [])
          })

    run
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : 'Greška.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [exercise.name, exercise.description, mode])

  // Zatvaranje na Escape + zaključavanje scroll-a pozadine
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const title = mode === 'explain' ? '🎥 Kako se izvodi' : '🔄 Zamjena vježbe'

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-sheet-up flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-white/10 bg-zinc-900/95 shadow-2xl sm:animate-pop-in sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-white/10 bg-zinc-900/95 px-4 pb-3 pt-3 backdrop-blur sm:px-6">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/15 sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-zinc-500">{title}</div>
              <h2 className="m-0 truncate text-base font-semibold tracking-tight sm:text-lg">
                {exercise.name}
              </h2>
            </div>
            <button className="btn-ghost shrink-0" onClick={onClose} aria-label="Zatvori">
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {loading && <Skeleton />}

          {error && !loading && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && mode === 'explain' && (
            <div className="flex flex-col gap-4">
              {explanation && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{explanation}</p>
              )}
              <YoutubeEmbed video={video} />
            </div>
          )}

          {!loading && !error && mode === 'alternatives' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-400">
                Izaberi jednu od 3 alternative — zamijeniće ovu vježbu u tvom rasporedu.
              </p>
              {alternatives.length === 0 && (
                <p className="text-sm text-zinc-400">AI nije vratio prijedloge. Pokušaj ponovo.</p>
              )}
              {alternatives.map((alt, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="m-0 text-sm font-semibold tracking-tight sm:text-base">
                      <span className="text-zinc-500">{i + 1}.</span> {alt.name}
                    </h3>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-zinc-300">{alt.reason}</p>
                  <YoutubeEmbed video={alt.video} />
                  <button
                    className="btn-primary mt-3 w-full"
                    onClick={() => onChoose({ name: alt.name, reason: alt.reason, video: alt.video })}
                  >
                    ✓ Izaberi ovu vježbu
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}