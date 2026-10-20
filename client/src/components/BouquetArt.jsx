import { useId } from 'react'

/* ------------------------------------------------------------------ */
/*  Hình học cánh hoa (hướng ra ngoài theo trục -y)                     */
/* ------------------------------------------------------------------ */
const petalPath = (l, w) =>
  `M0,0 C${w},${-l * 0.18} ${w * 1.08},${-l * 0.62} ${w * 0.52},${-l * 0.9} ` +
  `C${w * 0.24},${-l} ${-w * 0.24},${-l} ${-w * 0.52},${-l * 0.9} ` +
  `C${-w * 1.08},${-l * 0.62} ${-w},${-l * 0.18} 0,0 Z`

const thinPetalPath = (l, w) =>
  `M0,0 C${w * 0.9},${-l * 0.22} ${w * 0.72},${-l * 0.72} ${w * 0.14},${-l} ` +
  `C${-w * 0.14},${-l} ${-w * 0.72},${-l * 0.72} ${-w * 0.9},${-l * 0.22} Z`

/* ------------------------------------------------------------------ */
/*  Hoa hồng — các vòng cánh xếp lớp, có viền mảnh để tách cánh          */
/* ------------------------------------------------------------------ */
function Rose({ cx, cy, r, tones, stroke, rotate = 0, id }) {
  const rings = [
    { count: 8, len: 0.78, off: 0, tone: 0 },
    { count: 7, len: 0.62, off: 24, tone: 1 },
    { count: 6, len: 0.48, off: 12, tone: 2 },
    { count: 5, len: 0.34, off: 40, tone: 2 },
    { count: 4, len: 0.22, off: 8, tone: 3 },
  ]

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <circle r={r * 1.02} fill="#b9738f" opacity="0.16" filter={`url(#${id}-blur)`} />
      <circle r={r * 0.94} fill={tones[0]} />
      {rings.map((ring, ri) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = (i / ring.count) * 360 + ring.off
          const len = r * ring.len
          return (
            <g key={`${ri}-${i}`} transform={`rotate(${angle})`}>
              <path
                d={petalPath(len, len * 0.66)}
                transform={`translate(0 ${-r * 0.12})`}
                fill={tones[ring.tone]}
                stroke={stroke}
                strokeWidth={0.7}
                strokeOpacity="0.35"
              />
            </g>
          )
        }),
      )}
      <circle r={r * 0.1} fill={tones[0]} stroke={stroke} strokeWidth="0.7" strokeOpacity="0.4" />
      <ellipse cx={-r * 0.2} cy={-r * 0.28} rx={r * 0.34} ry={r * 0.24} fill={`url(#${id}-gloss)`} opacity="0.5" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Hoa cúc                                                             */
/* ------------------------------------------------------------------ */
function Chrysanthemum({ cx, cy, r, tones, stroke = '#e8cbb8', rotate = 0, id }) {
  const rings = [
    { count: 22, len: 1, off: 0, tone: 0 },
    { count: 18, len: 0.72, off: 8, tone: 1 },
    { count: 13, len: 0.46, off: 4, tone: 2 },
  ]
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <circle r={r * 1.02} fill="#b9738f" opacity="0.14" filter={`url(#${id}-blur)`} />
      <circle r={r * 0.92} fill={tones[0]} />
      {rings.map((ring, ri) =>
        Array.from({ length: ring.count }, (_, i) => {
          const angle = (i / ring.count) * 360 + ring.off
          const len = r * ring.len
          return (
            <g key={`${ri}-${i}`} transform={`rotate(${angle})`}>
              <path
                d={thinPetalPath(len, len * 0.26)}
                transform={`translate(0 ${-r * 0.08})`}
                fill={tones[ring.tone]}
                stroke={stroke}
                strokeWidth={0.5}
                strokeOpacity="0.4"
              />
            </g>
          )
        }),
      )}
      <circle r={r * 0.16} fill="#f2cd6b" />
      <circle r={r * 0.09} fill="#e0a63c" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Hoa nhỏ lấp đầy                                                     */
/* ------------------------------------------------------------------ */
function Filler({ cx, cy, r, tone = '#fffdfa', rotate = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-r * 0.7}
          rx={r * 0.38}
          ry={r * 0.62}
          fill={tone}
          stroke="#f3ddcf"
          strokeWidth="0.5"
          transform={`rotate(${(i / 5) * 360})`}
        />
      ))}
      <circle r={r * 0.22} fill="#f4d78d" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Cành lá                                                             */
/* ------------------------------------------------------------------ */
function Sprig({ x, y, length, angle, tone = '#93b189', scale = 1 }) {
  const leaves = [0.28, 0.44, 0.6, 0.74, 0.87]
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path d={`M0,0 L0,${-length}`} stroke="#6f9268" strokeWidth="2.2" strokeLinecap="round" />
      {leaves.map((t, i) => (
        <ellipse
          key={i}
          cx={i % 2 === 0 ? 5 : -5}
          cy={-length * t}
          rx="4.2"
          ry="8.2"
          fill={tone}
          transform={`rotate(${i % 2 === 0 ? 40 : -40} ${i % 2 === 0 ? 5 : -5} ${-length * t})`}
        />
      ))}
      <ellipse cx="0" cy={-length} rx="3" ry="6.6" fill={tone} />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Bó hoa                                                              */
/* ------------------------------------------------------------------ */
export default function BouquetArt({ palette, className = '' }) {
  const raw = useId().replace(/[:]/g, '')
  const id = `bq${raw}`
  const tones = palette?.petals ?? ['#f7a8c4', '#fbcfe4', '#ee7fa8']
  const dark = '#c97a97'

  const rose = (cx, cy, r, rotate, offset = 0) => ({
    cx,
    cy,
    r,
    rotate,
    tones: [
      ['#f2a0c2', '#f9c2d8', '#fde0eb', '#fff2f7'],
      ['#f5aecb', '#f9c7db', '#fde2ed', '#fff4f9'],
      ['#ec93b8', '#f6b3cd', '#fcd4e4', '#ffeaf3'],
      ['#f0a0bf', '#f8bed4', '#fcdcea', '#fff1f7'],
    ][offset],
  })

  const chrys = (cx, cy, r, rotate, offset = 0) => ({
    cx,
    cy,
    r,
    rotate,
    tones: [
      ['#fffdf8', '#fff4e9', '#ffe6d9'],
      ['#fff9f1', '#ffeedf', '#ffded0'],
      ['#fffcf6', '#fff3e7', '#ffe4d6'],
    ][offset],
  })

  return (
    <svg viewBox="68 44 504 712" className={className} role="img" aria-label="Bó hoa hồng và cúc hồng bọc giấy kraft, thắt nơ hồng">
      <defs>
        <linearGradient id={`${id}-kraft`} x1="0.15" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#f6ead8" />
          <stop offset="45%" stopColor="#e8d6b8" />
          <stop offset="100%" stopColor="#c9aa83" />
        </linearGradient>
        <linearGradient id={`${id}-cell`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffd9e6" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`${id}-ribbon`} x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#ffc9db" />
          <stop offset="45%" stopColor="#f495b9" />
          <stop offset="100%" stopColor="#d96d98" />
        </linearGradient>
        <radialGradient id={`${id}-gloss`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* lá xanh phía sau */}
      <g>
        <Sprig x={320} y={340} length={172} angle={-4} scale={1.08} />
        <Sprig x={344} y={340} length={150} angle={7} tone="#a3c096" />
        <Sprig x={252} y={344} length={130} angle={-24} />
        <Sprig x={396} y={340} length={136} angle={20} tone="#a3c096" />
        <Sprig x={176} y={352} length={100} angle={-44} />
        <Sprig x={470} y={346} length={104} angle={40} tone="#a3c096" />
        <Sprig x={298} y={348} length={112} angle={-14} tone="#aec9a0" scale={0.9} />
        <Sprig x={356} y={352} length={96} angle={12} tone="#aec9a0" scale={0.86} />
      </g>

      {/* lớp hoa phía sau */}
      <Chrysanthemum {...chrys(320, 148, 64, -6, 0)} id={id} stroke="#e6c6b1" />
      <Chrysanthemum {...chrys(198, 186, 56, 14, 1)} id={id} stroke="#e6c6b1" />
      <Chrysanthemum {...chrys(444, 172, 54, -18, 2)} id={id} stroke="#e6c6b1" />
      <Rose {...rose(126, 258, 46, 18, 2)} id={id} stroke={dark} />
      <Rose {...rose(516, 250, 46, -14, 2)} id={id} stroke={dark} />

      {/* lớp hoa giữa */}
      <Rose {...rose(268, 258, 62, -6, 0)} id={id} stroke={dark} />
      <Rose {...rose(388, 262, 58, 12, 1)} id={id} stroke={dark} />
      <Rose {...rose(320, 336, 54, -10, 3)} id={id} stroke={dark} />
      <Chrysanthemum {...chrys(212, 330, 46, 8, 2)} id={id} stroke="#e6c6b1" />
      <Chrysanthemum {...chrys(436, 330, 44, -12, 0)} id={id} stroke="#e6c6b1" />

      {/* lớp hoa trước */}
      <Rose {...rose(146, 340, 38, 22, 1)} id={id} stroke={dark} />
      <Rose {...rose(496, 338, 36, -20, 3)} id={id} stroke={dark} />
      <Rose {...rose(276, 388, 34, 6, 0)} id={id} stroke={dark} />
      <Rose {...rose(376, 390, 32, -8, 1)} id={id} stroke={dark} />

      {/* hoa nhỏ lấp đầy */}
      <Filler cx={352} cy={214} r={16} rotate={12} />
      <Filler cx={232} cy={266} r={14} rotate={-20} tone="#fff4f8" />
      <Filler cx={444} cy={256} r={14} rotate={30} />
      <Filler cx={170} cy={196} r={13} rotate={8} tone="#fff6fa" />
      <Filler cx={500} cy={196} r={12} rotate={-14} />
      <Filler cx={320} cy={84} r={13} rotate={22} tone="#fff4f8" />
      <Filler cx={330} cy={300} r={12} rotate={6} />
      <Filler cx={214} cy={388} r={12} rotate={-6} tone="#fff6fa" />
      <Filler cx={436} cy={388} r={11} rotate={14} />

      {/* giấy gói kraft */}
      <path
        d="M148,392 C228,442 412,442 492,392 C468,472 424,532 386,572 L254,572 C216,532 172,472 148,392 Z"
        fill={`url(#${id}-kraft)`}
      />
      <g stroke="#b1906a" strokeOpacity="0.38" strokeWidth="2" fill="none">
        <path d="M196,412 C232,478 268,530 300,570" />
        <path d="M268,432 C286,490 308,536 320,570" />
        <path d="M372,428 C354,488 332,536 322,570" />
        <path d="M444,404 C408,474 366,530 332,570" />
      </g>
      <path
        d="M148,392 C228,442 412,442 492,392 C462,434 404,458 320,460 C236,458 178,434 148,392 Z"
        fill="#f9efdd"
      />
      <path d="M148,392 C228,442 412,442 492,392" stroke="#dcc5a2" strokeWidth="2" fill="none" opacity="0.85" />

      {/* cellophane */}
      <path
        d="M162,444 C180,536 222,612 252,688 L388,688 C420,612 462,534 478,442 C450,532 400,588 320,590 C240,588 190,532 162,444 Z"
        fill={`url(#${id}-cell)`}
        stroke="#ffffff"
        strokeOpacity="0.7"
        strokeWidth="2.5"
      />
      <path d="M232,592 C262,646 288,676 306,712" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="3" fill="none" />
      <path d="M418,586 C388,642 358,674 340,712" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="3" fill="none" />

      {/* nơ ruy băng */}
      <g transform="translate(320 552)">
        <path d="M-9,2 C-28,58 -40,118 -22,176 C-15,146 -5,122 0,102 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M9,2 C32,56 46,116 26,178 C19,146 9,122 3,102 Z" fill={`url(#${id}-ribbon)`} opacity="0.94" />
        <path d="M0,0 C-34,-40 -98,-34 -106,2 C-114,38 -46,44 2,10 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M-10,-2 C-40,-26 -84,-22 -90,2 C-94,26 -46,28 -8,8 Z" fill="#ffd4e2" opacity="0.5" />
        <path d="M0,0 C34,-40 98,-34 106,2 C114,38 46,44 -2,10 Z" fill={`url(#${id}-ribbon)`} />
        <path d="M10,-2 C40,-26 84,-22 90,2 C94,26 46,28 8,8 Z" fill="#ffd4e2" opacity="0.5" />
        <ellipse rx="19" ry="16" fill="#e0729d" />
        <ellipse cx="-5" cy="-5" rx="7" ry="5.6" fill="#ffb3cc" opacity="0.9" />
      </g>

      {/* hạt sương */}
      <g fill="#ffffff" opacity="0.9">
        <circle cx="286" cy="344" r="3.2" />
        <circle cx="358" cy="340" r="2.6" />
        <circle cx="412" cy="366" r="3" />
        <circle cx="240" cy="366" r="2.4" />
        <circle cx="330" cy="308" r="2.2" />
        <circle cx="190" cy="300" r="2.6" />
        <circle cx="470" cy="344" r="2.4" />
        <circle cx="300" cy="400" r="2.2" />
      </g>
    </svg>
  )
}
