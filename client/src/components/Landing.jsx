import { useEffect, useRef, useState } from 'react'
import BouquetArt from './BouquetArt.jsx'
import EnvelopeCard from './EnvelopeCard.jsx'

/** Trang chính sau khi nhập tên: bó hoa ở trên, lá thư ở dưới. */
export default function Landing({ name, letter, soundOn, onToggleSound, onOpenLetter }) {
  const petals = useRef(null)

  // vài cánh hoa rơi nhẹ trong khung đầu trang
  useEffect(() => {
    const root = petals.current
    if (!root) return
    const items = Array.from(root.children)
    items.forEach((el, i) => {
      const delay = (i * 1.7) % 12
      const duration = 14 + ((i * 3) % 9)
      el.style.animationDelay = `-${delay}s`
      el.style.animationDuration = `${duration}s`
    })
  }, [])

  return (
    <div className="landing">
      <button
        type="button"
        className="sound-toggle"
        onClick={onToggleSound}
        aria-label={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
        title={soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        <span aria-hidden="true">{soundOn ? '🔊' : '🔇'}</span>
      </button>

      <main id="top">
        <section className="hero" id="hoa">
          <div className="hero__bg" aria-hidden="true">
            <span className="hero__glow" />
            <span className="hero__bokeh hero__bokeh--1" />
            <span className="hero__bokeh hero__bokeh--2" />
            <span className="hero__bokeh hero__bokeh--3" />
            <div className="petals" ref={petals}>
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="petal" style={{ left: `${(i * 8.3 + 4) % 96}%` }} />
              ))}
            </div>
          </div>

          <div className="hero__content">
            <p className="hero__eyebrow">Ngày 20 tháng 10</p>
            <h1 className="hero__title">
              Gửi <em>{name}</em>,
            </h1>
            <p className="hero__sub">Một bó hoa nhỏ — và một lá thư tay.</p>
          </div>

          <div className="hero__bouquet" aria-hidden="true">
            <BouquetArt palette={letter?.bouquet} />
          </div>

          <a className="scroll-cue" href="#letter" aria-label="Cuộn xuống để mở lá thư">
            <span>Cuộn xuống để mở lá thư</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>

        <section className="letter-section" id="letter">
          <div className="letter-section__inner">
            <p className="section__eyebrow">Lá thư</p>
            <h2 className="letter-section__title">Một lá thư đang chờ bạn mở</h2>
            <p className="letter-section__sub">
              Mình có đôi lời muốn gửi bạn — mở lá thư ra nhé?
            </p>

            <EnvelopeCard onOpen={onOpenLetter} />

            <p className="letter-section__note">
              Lá thư sẽ hiện ra trên nền tối để bạn đọc dễ hơn.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
