// Tải font chữ (hỗ trợ đầy đủ dấu tiếng Việt) về client/public/fonts
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'client/public/fonts')
await mkdir(outDir, { recursive: true })

// Ưu tiên bản variable font gốc trên GitHub (đủ bộ glyph tiếng Việt)
const targets = [
  {
    file: 'Quicksand.ttf',
    urls: [
      'https://github.com/google/fonts/raw/main/ofl/quicksand/Quicksand%5Bwght%5D.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/quicksand/Quicksand%5Bwght%5D.ttf',
    ],
  },
  {
    file: 'DancingScript.ttf',
    urls: [
      'https://github.com/google/fonts/raw/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf',
    ],
  },
  {
    file: 'PlayfairDisplay.ttf',
    urls: [
      'https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf',
    ],
  },
  {
    file: 'BeVietnamPro.ttf',
    urls: [
      'https://github.com/google/fonts/raw/main/ofl/bevietnampro/BeVietnamPro%5Bwght%5D.ttf',
      'https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro%5Bwght%5D.ttf',
    ],
  },
]

for (const t of targets) {
  let saved = false
  for (const url of t.urls) {
    try {
      const res = await fetch(url, { redirect: 'follow' })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      // kiểm tra chữ ký ttf/otf (0x00010000 hoặc 'OTTO' hoặc 'true')
      const sig = buf.subarray(0, 4).toString('hex')
      if (!['00010000', '4f54544f', '74727565'].includes(sig)) continue
      if (buf.length < 20000) continue
      await writeFile(resolve(outDir, t.file), buf)
      console.log('OK  ', t.file, (buf.length / 1024).toFixed(1) + ' KB')
      saved = true
      break
    } catch {
      /* thử URL tiếp theo */
    }
  }
  if (!saved) console.log('FAIL', t.file)
}
