// Lưu trữ lời chúc đơn giản bằng file JSON (ghi atomically để không mất dữ liệu)
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(here, '../data')
const DATA_FILE = resolve(DATA_DIR, 'wishes.json')

let cache = null
let writing = null
let dirty = false

async function load() {
  if (cache) return cache
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    // bỏ BOM nếu file được ghi bằng công cụ của Windows
    const parsed = JSON.parse(raw.replace(/^﻿/, ''))
    cache = Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('[store] không đọc được file lời chúc:', err.message)
    cache = []
  }
  return cache
}

async function persist() {
  await mkdir(DATA_DIR, { recursive: true })
  const snapshot = JSON.stringify(cache, null, 2)
  const tmp = `${DATA_FILE}.${process.pid}.tmp`
  await writeFile(tmp, snapshot, 'utf8')
  await rename(tmp, DATA_FILE)
}

function queuePersist() {
  dirty = true
  if (writing) return writing
  writing = (async () => {
    while (dirty) {
      dirty = false
      await persist()
    }
  })()
    .catch((err) => console.error('[store] không ghi được file lời chúc:', err.message))
    .finally(() => {
      writing = null
    })
  return writing
}

export async function addWish({ name, message }) {
  const list = await load()
  const cleanName = String(name || '').trim().slice(0, 40)
  const cleanMessage = String(message || '').trim().slice(0, 500)
  if (!cleanMessage) throw new Error('Lời chúc không được để trống')

  const wish = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName || 'Ẩn danh',
    message: cleanMessage,
    createdAt: new Date().toISOString(),
  }
  list.unshift(wish)
  if (list.length > 500) list.length = 500
  queuePersist()
  return wish
}

export async function listWishes(limit = 24) {
  const list = await load()
  return list.slice(0, Math.max(1, Math.min(limit, 100)))
}
