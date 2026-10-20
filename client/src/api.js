// Gọi API của server Node; nếu không có (bản tĩnh trên GitHub Pages) thì tự sinh lá thư.
import { buildLetter } from '../../shared/letters.js'

const BASE = import.meta.env.VITE_API_BASE || ''
const STATIC_MODE = import.meta.env.VITE_STATIC === '1'

export async function fetchLetter(name) {
  if (STATIC_MODE) return buildLetter({ name })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(`${BASE}/api/letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data?.letter) throw new Error('Dữ liệu lá thư không hợp lệ')
    return data.letter
  } catch (err) {
    console.warn('[api] không gọi được server, tự sinh lá thư:', err.message)
    return buildLetter({ name })
  } finally {
    clearTimeout(timer)
  }
}
