import { useEffect, useState } from 'react'

/** Phong bì nhỏ dùng trong phần "Lá thư" của landing page. */
export default function EnvelopeCard({ onOpen }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      className={`env-card${hover ? ' is-hover' : ''}`}
      onClick={onOpen}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      aria-label="Mở lá thư"
    >
      <svg viewBox="0 0 320 220" className="env-card__svg" aria-hidden="true">
        <defs>
          <linearGradient id="ec-body" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#fdeef4" />
            <stop offset="100%" stopColor="#f8d6e3" />
          </linearGradient>
          <linearGradient id="ec-flap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9c2d8" />
            <stop offset="100%" stopColor="#ef9fc0" />
          </linearGradient>
        </defs>

        <rect x="16" y="20" width="288" height="184" rx="10" fill="url(#ec-body)" />
        {/* nắp phong bì */}
        <path d="M16 30 L160 132 L304 30 L304 20 L16 20 Z" fill="url(#ec-flap)" />
        <path d="M16 20 L160 128 L304 20 Z" fill="#f4b0cb" opacity="0.35" />
        {/* nếp gấp */}
        <path d="M16 196 L120 120" stroke="#e7b3c8" strokeWidth="2" opacity="0.6" />
        <path d="M304 196 L200 120" stroke="#e7b3c8" strokeWidth="2" opacity="0.6" />
        <path d="M16 30 L120 120" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
        <path d="M304 30 L200 120" stroke="#ffffff" strokeWidth="2" opacity="0.5" />

        {/* dấu hoa */}
        <g transform="translate(160 126)">
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-13"
              rx="7"
              ry="11"
              fill={i % 2 === 0 ? '#e05f90' : '#f283ab'}
              transform={`rotate(${(i / 8) * 360})`}
            />
          ))}
          <circle r="8" fill="#f0b45f" />
          <circle cx="-2" cy="-2" r="2.6" fill="#ffe1a8" />
        </g>
      </svg>

      <span className="env-card__label">Mở lá thư</span>
    </button>
  )
}
