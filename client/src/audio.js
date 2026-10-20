// Nhạc nền & hiệu ứng âm thanh tổng hợp bằng WebAudio (không cần file nhạc).
class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.enabled = true
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return this.ctx
    }
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.5
    this.master.connect(this.ctx.destination)
    return this.ctx
  }

  setEnabled(value) {
    this.enabled = value
    if (this.master) this.master.gain.value = value ? 0.5 : 0
  }

  tone({ freq = 440, start = 0, duration = 0.6, type = 'sine', gain = 0.2, detune = 0 }) {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const t0 = ctx.currentTime + start
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t0)
    osc.detune.value = detune
    env.gain.setValueAtTime(0.0001, t0)
    env.gain.exponentialRampToValueAtTime(gain, t0 + 0.03)
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    osc.connect(env)
    env.connect(this.master)
    osc.start(t0)
    osc.stop(t0 + duration + 0.05)
  }

  noise({ start = 0, duration = 0.7, gain = 0.08, from = 700, to = 3200 }) {
    const ctx = this.ensure()
    if (!ctx || !this.enabled) return
    const t0 = ctx.currentTime + start
    const frames = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.2
    filter.frequency.setValueAtTime(from, t0)
    filter.frequency.exponentialRampToValueAtTime(to, t0 + duration)
    const env = ctx.createGain()
    env.gain.setValueAtTime(gain, t0)
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    src.connect(filter)
    filter.connect(env)
    env.connect(this.master)
    src.start(t0)
  }

  // tiếng chuông nhẹ khi lá thư xuất hiện
  bell() {
    ;[880, 1174.66, 1318.51].forEach((f, i) =>
      this.tone({ freq: f, start: i * 0.09, duration: 1.1, type: 'sine', gain: 0.16 }),
    )
  }

  // tiếng "gieo hoa" khi vườn mọc lên
  bloom() {
    ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      this.tone({ freq: f, start: i * 0.14, duration: 1.4, type: 'triangle', gain: 0.1 }),
    )
  }

  // tiếng mở phong bì + tiếng giấy trồi ra
  openLetter() {
    this.noise({ duration: 0.55, gain: 0.1, from: 900, to: 2600 })
    this.tone({ freq: 392, start: 0.02, duration: 0.9, type: 'sine', gain: 0.12 })
    this.tone({ freq: 587.33, start: 0.12, duration: 1.1, type: 'sine', gain: 0.1 })
    this.tone({ freq: 880, start: 0.26, duration: 1.4, type: 'sine', gain: 0.08 })
  }

  // tiếng gõ phím khi đang viết lời chúc
  type() {
    this.tone({ freq: 1500 + Math.random() * 400, duration: 0.035, type: 'square', gain: 0.018 })
  }

  // tiếng kết thúc lá thư
  complete() {
    ;[659.25, 783.99, 987.77, 1318.51].forEach((f, i) =>
      this.tone({ freq: f, start: i * 0.12, duration: 1.6, type: 'sine', gain: 0.12 }),
    )
  }
}

export const audio = new AudioEngine()
