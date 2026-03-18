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
