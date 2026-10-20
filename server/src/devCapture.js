// Chỉ dùng khi phát triển: nhận ảnh chụp màn hình từ trình duyệt để lưu lại file.
import express from 'express'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(here, '../dev-shots')

export function mountDevCapture(app) {
  app.post('/api/dev/shot', express.json({ limit: '12mb' }), async (req, res) => {
    try {
      const { image, label = 'shot' } = req.body ?? {}
      const base64 = String(image || '').replace(/^data:image\/\w+;base64,/, '')
      if (!base64) {
        res.status(400).json({ ok: false, error: 'thiếu ảnh' })
        return
      }
      await mkdir(OUT_DIR, { recursive: true })
      const name = `${String(label).replace(/[^\w.-]/g, '_')}.png`
      const file = resolve(OUT_DIR, name)
      await writeFile(file, Buffer.from(base64, 'base64'))
      res.json({ ok: true, file })
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message })
    }
  })
}
