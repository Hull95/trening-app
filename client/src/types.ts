export interface Exercise {
  id: string
  name: string
  description: string | null
  setsReps: string | null
  imageUrl: string | null
  videoUrl: string | null
  order: number
}

export interface Day {
  id: string
  name: string
  weekDay: number
  exercises: Exercise[]
}

export interface WeekSchedule {
  id: string
  name: string
  days: Day[]
}

export interface AiVideo {
  videoId: string
  title: string
}

export interface ExplainResult {
  explanation: string
  video: AiVideo | null
}

export interface AlternativeResult {
  name: string
  reason: string
  video: AiVideo | null
}

/** Zamjena vježbe koju je korisnik izabrao (čuva se u localStorage). */
export interface ExerciseOverride {
  name: string
  reason: string
  video: AiVideo | null
}
