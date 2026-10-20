import { useState } from 'react'

export default function Welcome({ onStart, savedName = '' }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Bạn nhập tên của mình nhé!')
      return
    }
    setError('')
    onStart(name.trim())
  }

  return (
    <div className="welcome">
      <form className="welcome__card" onSubmit={handleSubmit}>
        <span className="welcome__badge">20·10</span>
        <h1 className="welcome__title">
          Một bó hoa <em>chờ đợi</em> bạn
        </h1>
        <p className="welcome__subtitle">
          Cho mình biết tên bạn — mình sẽ cắm một bó hoa thật đẹp và gửi bạn một lá thư đầy yêu thương.
        </p>

        <label className="field">
          <span className="field__label">Bạn tên gì?</span>
          <input
            className="field__input"
            type="text"
            value={name}
            autoFocus
            maxLength={40}
            placeholder={savedName ? `${savedName}…` : 'Nhập tên của bạn...'}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'name-error' : undefined}
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
          />
        </label>

        {error && (
          <p className="welcome__error" role="alert" id="name-error">
            {error}
          </p>
        )}

        <button className="btn btn--primary btn--wide" type="submit">
          Cắm bó hoa cho bạn <span aria-hidden="true">💐</span>
        </button>
      </form>
    </div>
  )
}
