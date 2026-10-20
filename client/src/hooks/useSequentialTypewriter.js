import { useEffect, useRef, useState } from 'react'

/**
 * Viết lời chúc từng dòng một, giống bộ gõ chữ trong lá thư.
 * Cảm hứng từ repo tham khảo (useSequentialTypewriter).
 *
 * - Khi nội dung đổi: xoá sạch và bắt đầu phiên mới.
 * - Khi tạm ngưng (ví dụ chuyển sang màn hình "xong"): giữ nguyên phần đã viết.
 */
export function useSequentialTypewriter(
  lines = [],
  isActive = false,
  {
    characterDelay = 27,
    linePause = 1100,
    startDelay = 1400,
    onCharacter,
    reducedMotion = false,
    sessionKey = '',
    skip = false,
  } = {},
) {
  const [typedLines, setTypedLines] = useState(() => lines.map(() => ''))
  const [activeLineIndex, setActiveLineIndex] = useState(-1)
  const [isComplete, setIsComplete] = useState(false)

  const sessionRef = useRef(null)
  const linesKey = `${sessionKey}|${lines.join('\n')}`

  // Người dùng chọn "xem nhanh": hiện toàn bộ lá thư ngay lập tức
  useEffect(() => {
    if (!skip || lines.length === 0) return
    setTypedLines(lines)
    setActiveLineIndex(-1)
    setIsComplete(true)
  }, [skip, lines])

  // Nội dung đổi -> xoá trắng phiên cũ
  useEffect(() => {
    sessionRef.current = null
    setTypedLines(lines.map(() => ''))
    setActiveLineIndex(-1)
    setIsComplete(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linesKey])

  useEffect(() => {
    if (!isActive || lines.length === 0) return undefined
    if (sessionRef.current === linesKey) return undefined
    sessionRef.current = linesKey

    if (reducedMotion) {
      setTypedLines(lines)
      setIsComplete(true)
      return undefined
    }

    let timeout
    let lineIndex = 0
    let characterIndex = 0

    const typeCharacter = () => {
      characterIndex += 1
      const currentLine = lineIndex
      const currentChar = characterIndex
      setActiveLineIndex(currentLine)
      setTypedLines((current) => {
        const next = [...current]
        next[currentLine] = lines[currentLine].slice(0, currentChar)
        return next
      })
      onCharacter?.()

      if (currentChar < lines[currentLine].length) {
        timeout = window.setTimeout(typeCharacter, characterDelay)
        return
      }

      setTypedLines((current) => {
        const next = [...current]
        next[currentLine] = lines[currentLine]
        return next
      })

      if (currentLine < lines.length - 1) {
        lineIndex += 1
        characterIndex = 0
        timeout = window.setTimeout(typeCharacter, linePause)
        return
      }

      setActiveLineIndex(-1)
      timeout = window.setTimeout(() => setIsComplete(true), linePause)
    }

    timeout = window.setTimeout(typeCharacter, startDelay)
    return () => window.clearTimeout(timeout)
  }, [characterDelay, isActive, linePause, lines, linesKey, onCharacter, reducedMotion, startDelay])

  return { typedLines, activeLineIndex, isComplete }
}
