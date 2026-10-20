// Nội dung lá thư + bảng màu bó hoa — dùng chung cho server và bản build tĩnh (GitHub Pages).
// Lưu ý: mỗi dòng nên ngắn gọn (≤ 57 ký tự) để vừa một dòng trên mặt thư.

export const LETTER_TEMPLATES = [
  {
    lines: [
      'Hôm nay 20/10 — ngày dành cho một nửa đẹp hơn của thế giới.',
      'Mình không giỏi nói lời hoa mỹ, nên gửi bó hoa này thay lời.',
      'Cảm ơn bạn vì đã luôn tử tế với mọi người xung quanh.',
      'Chúc bạn nhiều sức khoẻ và những ngày thật nhẹ nhàng.',
      '20/10 vui vẻ nhé!',
    ],
  },
  {
    lines: [
      'Nhân ngày 20/10, chúc bạn một ngày thật nhiều niềm vui.',
      'Chúc bạn luôn xinh đẹp, rạng rỡ và tự tin như bây giờ.',
      'Chúc công việc thuận lợi và mọi dự định đều thành công.',
      'Mong bạn luôn khoẻ, luôn vui và gặp nhiều điều may.',
      'Chúc bạn ngày 20/10 thật rạng rỡ và vui vẻ!',
    ],
  },
  {
    lines: [
      'Tháng 10 có những ngày rất đáng nhớ, và hôm nay là một ngày.',
      'Mình chọn bó hoa này vì nghĩ rằng nó hợp với bạn.',
      'Cảm ơn bạn vì đã luôn dễ thương và đáng tin như vậy.',
      'Chúc bạn mọi điều thuận lợi trong công việc và cuộc sống.',
      'Hẹn gặp bạn ở một bó hoa khác nhé.',
    ],
  },
  {
    lines: [
      'Hôm nay 20/10, mình gửi bạn bó hoa hồng phấn này.',
      'Không cần lý do gì lớn lao — chỉ là muốn bạn vui.',
      'Chúc bạn ngày làm việc nhẹ nhàng và nhiều tiếng cười.',
      'Cảm ơn bạn vì đã luôn nhiệt tình giúp đỡ mọi người.',
      'Chúc mừng ngày Phụ nữ Việt Nam!',
    ],
  },
  {
    lines: [
      '20/10 là ngày để nói những điều tốt đẹp.',
      'Nên mình nói: bạn là một người rất tuyệt.',
      'Cảm ơn bạn vì những điều nhỏ nhặt mà ấm áp.',
      'Mong bạn luôn mạnh khoẻ và giữ được nụ cười dễ mến ấy.',
      'Chúc bạn một ngày 20/10 thật vui vẻ!',
    ],
  },
]

export const BOUQUETS = [
  {
    name: 'Hồng ngọc',
    petals: ['#f7a8c4', '#fbcfe4', '#ee7fa8'],
    center: '#f2c14e',
    accent: '#ffd7e6',
    leaf: '#8fae86',
    paper: '#dcc3a0',
  },
  {
    name: 'Hồng phấn',
    petals: ['#fbc4d6', '#ffe3ec', '#f472b6'],
    center: '#f7d488',
    accent: '#ffd0e0',
    leaf: '#9bb98f',
    paper: '#e0c8ab',
  },
  {
    name: 'Trắng ngà',
    petals: ['#fff6ec', '#f7e6d4', '#f2c9b6'],
    center: '#e9b949',
    accent: '#ffe9f0',
    leaf: '#8fae86',
    paper: '#d8c2a2',
  },
  {
    name: 'Hồng đào',
    petals: ['#f9b4a8', '#fcd9cc', '#f4846f'],
    center: '#f3c14b',
    accent: '#ffd9cd',
    leaf: '#93b287',
    paper: '#d6bd9c',
  },
  {
    name: 'Tím hồng',
    petals: ['#e0a3c8', '#f0c8de', '#c98bb8'],
    center: '#f6cf5e',
    accent: '#f7d7ea',
    leaf: '#87a981',
    paper: '#d5bfa6',
  },
]

/** Băm tên thành số 32-bit (FNV-1a) — giống nhau ở server và client. */
export function hashName(name = '') {
  const text = String(name).trim().toLowerCase()
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

export function pickTemplate(name) {
  return LETTER_TEMPLATES[hashName(name) % LETTER_TEMPLATES.length]
}

export function pickBouquet(name) {
  const hash = hashName(name)
  const bouquet = BOUQUETS[Math.floor(hash / 7) % BOUQUETS.length]
  return { ...bouquet, flowers: 30 + (hash % 9) }
}

export function buildLetter({ name = 'bạn', sender = '' } = {}) {
  const template = pickTemplate(name)
  const bouquet = pickBouquet(name)
  const clean = (value, max) => String(value ?? '').trim().slice(0, max)
  const displayName = clean(name, 40) || 'bạn'
  const signOff = clean(sender, 40) || 'Người luôn nhớ đến bạn'
  return {
    name: displayName,
    subject: `Gửi ${displayName}`,
    lines: template.lines,
    signOff,
    date: '20/10',
    bouquet,
  }
}
