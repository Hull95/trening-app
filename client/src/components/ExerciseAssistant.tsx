import { useEffect, useState } from 'react'
import { explainExercise, suggestAlternatives } from '../api'
import type { AiVideo, AlternativeResult, Exercise, ExerciseOverride } from '../types'

type Mode = 'explain' | 'alternatives'

function YoutubeEmbed({ video }: { video: AiVideo | null }) {
  if (!video) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-4 text-sm text-zinc-400">
        Video trenutno nije dostupan. (Provjeri da je <code>YOUTUBE_API_KEY</code> postavljen na Vercel-u.)
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10">
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

  // Zatvaranje na Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const title = mode === 'explain' ? 'Kako se izvodi' : 'Zamjena vježbe'

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="card my-4 w-full max-w-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-zinc-500">{title}</div>
            <h2 className="m-0 text-lg font-semibold tracking-tight">{exercise.name}</h2>
          </div>
          <button className="btn-ghost shrink-0" onClick={onClose}>
            Zatvori ✕
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-3 py-8 text-sm text-zinc-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
            AI priprema odgovor…
          </div>
        )}

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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="m-0 text-base font-semibold tracking-tight">
                    <span className="text-zinc-500">{i + 1}.</span> {alt.name}
                  </h3>
                  <button
                    className="btn-ghost shrink-0 border-brand-emerald-400/30 bg-brand-emerald-400/10 text-brand-emerald-100"
                    onClick={() =>
                      onChoose({ name: alt.name, reason: alt.reason, video: alt.video })
                    }
                  >
                    Izaberi ovu
                  </button>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-zinc-300">{alt.reason}</p>
                <YoutubeEmbed video={alt.video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}