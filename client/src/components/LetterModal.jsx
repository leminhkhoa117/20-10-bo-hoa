import { useCallback, useEffect, useRef, useState } from 'react'
import { useSequentialTypewriter } from '../hooks/useSequentialTypewriter.js'
import { audio } from '../audio.js'

/** Dấu hoa nhỏ trên nắp phong bì. */
function FlowerSeal() {
  return (
    <svg viewBox="0 0 40 40" className="env-seal__svg" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="20"
          cy="11"
          rx="4.6"
          ry="7.2"
          fill={i % 2 === 0 ? '#e05f90' : '#f283ab'}
          transform={`rotate(${(i / 8) * 360} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.6" fill="#f0b45f" />
      <circle cx="18.4" cy="18.4" r="1.5" fill="#ffe1a8" />
    </svg>
  )
}

/**
 * Lá thư dạng modal: nền tối đi, phong bì mở ra, tờ thư trồi lên rồi mới hiện chữ.
 * Kỹ thuật dựng phong bì theo repo tham khảo leminhkhoa117/memory.
 */
export default function LetterModal({ open, letter, onClose, onComplete, reducedMotion = false }) {
  const [phase, setPhase] = useState('idle') // idle | closed | opening | reading | done
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => {
    clearTimers()
    if (!open) {
      setPhase('idle')
      return
    }
    setPhase('closed')
    const timer = window.setTimeout(() => setPhase('closed'), 60)
    timers.current.push(timer)
    return clearTimers
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleOpenEnvelope = useCallback(() => {
    if (phase !== 'closed') return
    audio.openLetter()
    setPhase('opening')
    timers.current.push(window.setTimeout(() => setPhase('reading'), reducedMotion ? 700 : 2500))
  }, [phase, reducedMotion])

  const lines = letter?.lines ?? []
  const { typedLines, activeLineIndex, isComplete } = useSequentialTypewriter(lines, phase === 'reading', {
    characterDelay: 16,
    linePause: 420,
    startDelay: 500,
    reducedMotion,
  })

  useEffect(() => {
    if (isComplete && phase === 'reading') {
      setPhase('done')
      audio.complete()
      onComplete?.()
    }
  }, [isComplete, phase, onComplete])

  if (!open) return null

  const opened = phase === 'opening' || phase === 'reading' || phase === 'done'

  return (
    <div
      className={`letter-modal${opened ? ' is-opened' : ''}${phase === 'done' ? ' is-done' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Lá thư gửi ${letter?.name ?? 'bạn'}`}
    >
      <button className="letter-modal__backdrop" onClick={onClose} aria-label="Đóng lá thư" />

      <button className="letter-modal__close" onClick={onClose} aria-label="Đóng lá thư">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className={`letter-stage${opened ? ' is-opening' : ''}${phase === 'done' ? ' is-complete' : ''}`}>
        {/* thân sau của phong bì */}
        <div className="env-back" aria-hidden="true">
          <span className="env-back__lining" />
        </div>

        {/* tờ thư nằm giữa thân và mặt trước */}
        <article className="letter-sheet">
          <p className="letter-sheet__chapter">Ngày 20 tháng 10</p>
          <h2 className="letter-sheet__subject">{letter?.subject}</h2>

          <div className="letter-sheet__body">
            {lines.map((line, index) => (
              <p className="letter-sheet__line" key={`${index}-${line}`}>
                <span className="letter-sheet__ghost" aria-hidden="true">
                  {line}
                </span>
                <span className="letter-sheet__typed" aria-hidden="true">
                  {typedLines[index] ?? ''}
                  {activeLineIndex === index && <span className="letter-sheet__caret" />}
                </span>
              </p>
            ))}
          </div>

          <p className={`letter-sheet__closing${isComplete ? ' is-visible' : ''}`}>
            {letter?.signOff}
          </p>

          <div className={`letter-sheet__actions${isComplete ? ' is-visible' : ''}`}>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Đóng lá thư
            </button>
          </div>

          <p className="sr-only" aria-live="polite">
            {letter?.name} ơi, {letter?.subject}. {lines.join(' ')} — {letter?.signOff}
          </p>
        </article>

        {/* mặt trước phong bì */}
        <button
          type="button"
          className="env-front"
          onClick={handleOpenEnvelope}
          disabled={opened}
          aria-label={opened ? 'Lá thư đã mở' : 'Mở lá thư'}
        >
          <span className="env-wing env-wing--left" aria-hidden="true" />
          <span className="env-wing env-wing--right" aria-hidden="true" />
          <span className="env-pocket" aria-hidden="true" />
          <span className="env-flap" aria-hidden="true">
            <span className="env-seal">
              <FlowerSeal />
            </span>
          </span>
          <span className="env-hint" aria-hidden="true">
            Chạm để mở lá thư
          </span>
        </button>
      </div>
    </div>
  )
}
