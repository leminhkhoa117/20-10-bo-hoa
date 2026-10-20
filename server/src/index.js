import express from 'express'
import cors from 'cors'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildLetter } from './messages.js'
import { addWish, listWishes } from './store.js'

const here = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT) || 5174

// Bọc handler bất đồng bộ để lỗi luôn được trả về thay vì treo request
const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
])

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.has(origin)) return callback(null, true)
      return callback(null, false)
    },
  }),
)

if (process.env.ENABLE_DEV_CAPTURE === '1') {
  const { mountDevCapture } = await import('./devCapture.js')
  mountDevCapture(app)
}

app.use(express.json({ limit: '64kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// Sinh lá thư riêng cho từng tên người dùng + bó hoa đi kèm
app.post('/api/letter', (req, res) => {
  const { name, sender } = req.body ?? {}
  if (name !== undefined && typeof name !== 'string') {
    res.status(400).json({ ok: false, error: 'Tên phải là chuỗi ký tự' })
    return
  }
  res.json({ ok: true, letter: buildLetter({ name, sender }) })
})

// Người dùng gửi lời chúc của mình
app.post(
  '/api/wishes',
  asyncRoute(async (req, res) => {
    const { name, message } = req.body ?? {}
    const wish = await addWish({ name, message })
    res.json({ ok: true, wish })
  }),
)

app.get(
  '/api/wishes',
  asyncRoute(async (req, res) => {
    const limit = Number(req.query.limit) || 24
    res.json({ ok: true, wishes: await listWishes(limit) })
  }),
)

// Phục vụ bản build của client (chạy `npm run build` trước)
const dist = resolve(here, '../../client/dist')
app.use(express.static(dist))
app.get(/^\/(?!api).*/, (_req, res, next) => {
  res.sendFile(resolve(dist, 'index.html'), (err) => (err ? next() : undefined))
})

// Xử lý lỗi chung
app.use((err, _req, res, _next) => {
  console.error('[server] lỗi:', err.message)
  res.status(500).json({ ok: false, error: 'Máy chủ gặp sự cố, thử lại sau nhé' })
})

app.listen(PORT, () => {
  console.log(`[server] API chạy tại http://localhost:${PORT}`)
})
