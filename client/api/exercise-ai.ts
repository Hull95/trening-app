import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Serverless funkcija koja:
 *  1) zove Claude (Haiku 4.5) da generiše objašnjenje vježbe ILI 3 alternative,
 *  2) za svaki YouTube upit dohvati stvarni video preko YouTube Data API-ja.
 *
 * Ključevi (ANTHROPIC_API_KEY, YOUTUBE_API_KEY) ostaju na serveru — nikad u browseru.
 */

type Mode = 'explain' | 'alternatives'

interface Video {
  videoId: string
  title: string
}

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5'

async function callClaude(system: string, user: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'AI nije konfigurisan: nedostaje ANTHROPIC_API_KEY u Vercel env varijablama.',
    )
  }

  const resp = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  if (!resp.ok) {
    const detail = await resp.text()
    throw new Error(`Claude API greška (${resp.status}): ${detail.slice(0, 300)}`)
  }

  const data = (await resp.json()) as { content?: Array<{ type: string; text?: string }> }
  const text = data.content?.find((b) => b.type === 'text')?.text ?? ''
  return text
}

/** Robustno izvuče JSON objekat iz Claude odgovora (i ako ga obavije markdown-om). */
function parseJson<T>(text: string): T {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('AI nije vratio validan JSON.')
  }
  return JSON.parse(text.slice(start, end + 1)) as T
}

/** Dohvati jedan najrelevantniji, ugradiv YouTube video za dati upit. */
async function findVideo(query: string): Promise<Video | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey || !query) return null

  const url =
    'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video' +
    '&videoEmbeddable=true&maxResults=1&safeSearch=moderate' +
    `&q=${encodeURIComponent(query)}&key=${apiKey}`

  try {
    const resp = await fetch(url)
    if (!resp.ok) return null
    const data = (await resp.json()) as {
      items?: Array<{ id?: { videoId?: string }; snippet?: { title?: string } }>
    }
    const item = data.items?.[0]
    if (!item?.id?.videoId) return null
    return { videoId: item.id.videoId, title: item.snippet?.title ?? query }
  } catch {
    return null
  }
}

const EXPLAIN_SYSTEM =
  'Ti si iskusni fitness trener. Objasni kako se pravilno izvodi vježba, ' +
  'na jeziku na kojem je dat naziv/opis vježbe (bosanski/hrvatski/srpski). ' +
  'Budi konkretan i koristan. Vrati ISKLJUČIVO validan JSON, bez markdown-a.'

const ALT_SYSTEM =
  'Ti si iskusni fitness trener. Predloži alternativne vježbe koje ciljaju isti ' +
  'mišić i daju isti trenažni efekat. Piši na jeziku naziva vježbe ' +
  '(bosanski/hrvatski/srpski). Vrati ISKLJUČIVO validan JSON, bez markdown-a.'

function explainPrompt(name: string, description: string | null): string {
  return (
    `Vježba: "${name}".` +
    (description ? ` Postojeći opis: ${description}` : '') +
    `\n\nVrati JSON tačno ovog oblika:\n` +
    `{"explanation":"3-5 rečenica: kako se izvodi, disanje i najčešće greške",` +
    `"youtubeQuery":"kratak engleski YouTube upit za demonstraciju, npr. 'dumbbell bench press proper form'"}`
  )
}

function altPrompt(name: string, description: string | null): string {
  return (
    `Korisnik ne može ili ne želi raditi vježbu: "${name}".` +
    (description ? ` Opis: ${description}` : '') +
    `\n\nPredloži TAČNO 3 alternativne vježbe sa istim efektom (isti mišić).\n` +
    `Vrati JSON tačno ovog oblika:\n` +
    `{"alternatives":[` +
    `{"name":"naziv vježbe","reason":"zašto je dobra zamjena (1-2 rečenice)","youtubeQuery":"engleski YouTube upit"}` +
    `]} — niz mora imati tačno 3 elementa.`
  )
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Samo POST.' })
    return
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) ?? {}
    const name: string = (body.name ?? '').toString().trim()
    const description: string | null = body.description ?? null
    const mode: Mode = body.mode === 'alternatives' ? 'alternatives' : 'explain'

    if (!name) {
      res.status(400).json({ error: 'Nedostaje naziv vježbe.' })
      return
    }

    if (mode === 'explain') {
      const text = await callClaude(EXPLAIN_SYSTEM, explainPrompt(name, description))
      const parsed = parseJson<{ explanation: string; youtubeQuery: string }>(text)
      const video = await findVideo(parsed.youtubeQuery)
      res.status(200).json({ explanation: parsed.explanation, video })
      return
    }

    // mode === 'alternatives'
    const text = await callClaude(ALT_SYSTEM, altPrompt(name, description))
    const parsed = parseJson<{
      alternatives: Array<{ name: string; reason: string; youtubeQuery: string }>
    }>(text)

    const alternatives = await Promise.all(
      (parsed.alternatives ?? []).slice(0, 3).map(async (a) => ({
        name: a.name,
        reason: a.reason,
        video: await findVideo(a.youtubeQuery),
      })),
    )

    res.status(200).json({ alternatives })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nepoznata greška.'
    res.status(500).json({ error: message })
  }
}