import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { scheduleRouter } from './routes/schedule.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const possiblePaths = [
  path.resolve(__dirname, '../../client/public/exercises'),
  path.resolve(process.cwd(), 'client/public/exercises'),
]
const exercisesPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0]

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use('/exercises', express.static(exercisesPath))
app.use('/api', scheduleRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server na http://localhost:${PORT}`)
})
