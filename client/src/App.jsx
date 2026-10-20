import { useCallback, useEffect, useRef, useState } from 'react'
import Welcome from './components/Welcome.jsx'
import Landing from './components/Landing.jsx'
import LetterModal from './components/LetterModal.jsx'
import { fetchLetter } from './api.js'
import { audio } from './audio.js'
import { useReducedMotion } from './hooks/useReducedMotion.js'

const STORAGE_KEY = 'hai-muoi-mot-ten'

export default function App() {
  const [stage, setStage] = useState('welcome') // welcome | landing
  const [name, setName] = useState('')
  const [letter, setLetter] = useState(null)
  const [soundOn, setSoundOn] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [savedName, setSavedName] = useState('')

  const reducedMotion = useReducedMotion()
  const requestIdRef = useRef(0)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) setSavedName(stored)
    } catch {
      /* trình duyệt chặn localStorage */
    }
  }, [])

  const handleStart = useCallback(async (userName) => {
    const cleanName = String(userName || '').trim()
    if (!cleanName) return
    const requestId = ++requestIdRef.current
    audio.ensure()
    audio.bloom()
    setName(cleanName)
    setStage('landing')
    try {
      window.localStorage.setItem(STORAGE_KEY, cleanName)
      setSavedName(cleanName)
    } catch {
      /* bỏ qua */
    }
    const data = await fetchLetter(cleanName)
    if (requestId !== requestIdRef.current) return
    setLetter(data)
  }, [])

  const handleOpenLetter = useCallback(() => {
    if (!letter) return
    audio.ensure()
    setModalOpen(true)
    audio.bell()
  }, [letter])

  const handleCloseLetter = useCallback(() => setModalOpen(false), [])

  const handleToggleSound = useCallback(() => {
    const next = !soundOn
    setSoundOn(next)
    audio.setEnabled(next)
    if (next) {
      audio.ensure()
      audio.bell()
    }
  }, [soundOn])

  return (
    <div className="app">
      {stage === 'welcome' && <Welcome onStart={handleStart} savedName={savedName} />}

      {stage === 'landing' && (
        <Landing
          name={name}
          letter={letter}
          soundOn={soundOn}
          onToggleSound={handleToggleSound}
          onOpenLetter={handleOpenLetter}
        />
      )}

      <LetterModal
        open={modalOpen}
        letter={letter}
        onClose={handleCloseLetter}
        reducedMotion={reducedMotion}
      />

      <p className="sr-only" role="status" aria-live="polite">
        {stage === 'welcome'
          ? 'Trang chúc mừng ngày 20 tháng 10. Nhập tên của bạn để nhận bó hoa và lá thư.'
          : `Bó hoa và lá thư dành cho ${name}. Chạm vào bó hoa để mở lá thư.`}
      </p>
    </div>
  )
}
