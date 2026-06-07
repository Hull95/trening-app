import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Privremeni dijagnostički endpoint. Vraća SAMO da li su ključevi prisutni
 * (true/false) i imena env varijabli koja sadrže API/KEY/ANTHROPIC/YOUTUBE
 * — nikad same vrijednosti. Obrisati nakon dijagnostike.
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const names = Object.keys(process.env)
    .filter((k) => /api|key|anthropic|youtube/i.test(k))
    .sort()

  res.status(200).json({
    hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
    hasYoutube: !!process.env.YOUTUBE_API_KEY,
    relevantEnvNames: names,
  })
}