import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const scheduleRouter = Router()

scheduleRouter.get('/schedule', async (_req, res) => {
  const schedule = await prisma.weekSchedule.findFirst({
    include: {
      days: {
        orderBy: { weekDay: 'asc' },
        include: {
          exercises: { orderBy: { order: 'asc' } },
        },
      },
    },
  })
  if (!schedule) {
    return res.status(404).json({ error: 'Raspored nije pronađen' })
  }
  res.json(schedule)
})

scheduleRouter.get('/days/:dayId', async (req, res) => {
  const day = await prisma.day.findUnique({
    where: { id: req.params.dayId },
    include: {
      exercises: { orderBy: { order: 'asc' } },
    },
  })
  if (!day) {
    return res.status(404).json({ error: 'Dan nije pronađen' })
  }
  res.json(day)
})
