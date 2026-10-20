// Kiểm thử giao diện: mở trang bằng Chrome headless, chạy qua từng màn hình và chụp ảnh.
// Dùng: node scripts/visual-test.mjs [--url=http://localhost:5173] [--width=1280] [--height=800] [--name=flow]
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(here, '../dev-shots')

const args = Object.fromEntries(
  process.argv.slice(2).map((item) => {
    const [key, value = 'true'] = item.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

const URL = args.url || 'http://localhost:5173'
const WIDTH = Number(args.width) || 1280
const HEIGHT = Number(args.height) || 800
const NAME = args.name || 'flow'
const CHROME = args.chrome || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await mkdir(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--autoplay-policy=no-user-gesture-required',
    `--window-size=${WIDTH},${HEIGHT}`,
  ],
})

const page = await browser.newPage()
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 })

const messages = []
page.on('console', (msg) => messages.push(`[${msg.type()}] ${msg.text()}`))
page.on('pageerror', (err) => messages.push(`[pageerror] ${err.message}`))

const shot = async (label) => {
  const file = resolve(OUT_DIR, `${NAME}-${label}.png`)
  await page.screenshot({ path: file })
  console.log('  📸', file)
}

const report = () => {
  console.log('\n--- console trình duyệt ---')
  console.log(messages.length ? messages.join('\n') : '(không có tin nhắn nào)')
}

async function runFlow() {
  await page.waitForSelector('.field__input', { timeout: 20000 })
  await shot('01-welcome')

  await page.type('.field__input', 'Minh Anh')
  await sleep(200)
  await page.click('.welcome .btn--primary')

  // landing page
  await page.waitForSelector('.hero__bouquet', { timeout: 15000 })
  await sleep(1600)
  await shot('02-hero')

  // cuộn xuống phần lá thư
  await page.evaluate(() => document.querySelector('#letter')?.scrollIntoView({ behavior: 'smooth' }))
  await sleep(1400)
  await shot('03-letter-section')

  // mở lá thư bằng bó hoa
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await sleep(700)
  await page.click('.hero__bouquet')
  await sleep(900)
  await shot('04-envelope')

  const envFront = await page.$('.env-front')
  if (envFront) {
    await envFront.click()
    console.log('→ đã bấm mở phong bì')
  } else {
    console.log('⚠ không thấy phong bì')
  }
  await sleep(900)
  await shot('05-opening')
  await sleep(1200)
  await shot('06-sheet-out')
  await sleep(2000)
  await shot('07-typing')
  await sleep(6500)
  await shot('08-done')

  const state = await page.evaluate(() => ({
    sheet: document.querySelector('.letter-sheet')?.innerText.slice(0, 140) ?? null,
    modal: Boolean(document.querySelector('.letter-modal')),
    closeBtn: Boolean(document.querySelector('.letter-modal__actions')),
  }))
  console.log('\n--- trạng thái ---')
  console.log(JSON.stringify(state, null, 2))

  if (state.closeBtn) {
    await page.click('.letter-modal__actions .btn')
    await sleep(700)
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await sleep(600)
  await shot('09-closed')
}

console.log(`→ mở ${URL} (${WIDTH}x${HEIGHT})`)
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 })
await sleep(1600)

try {
  await runFlow()
} catch (err) {
  console.error('LỖI TRONG LUỒNG:', err.message)
  await shot('error')
  report()
  await browser.close()
  process.exit(1)
}

report()
await browser.close()
