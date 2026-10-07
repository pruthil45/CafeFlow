import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Pencil, CheckCircle2 } from 'lucide-react'
import CenterBranding from './CenterBranding'

export default function OTPVerification({
  phone = '9876543210',
  onEditPhone = () => {},
  onVerifySuccess = () => {},
}) {
  const [otp, setOtp] = useState(['4', '8', '2', '9', '3', '1'])
  const [secondsLeft, setSecondsLeft] = useState(28)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const inputRefs = useRef([])

  // Format phone number: +91 98765 43210
  const formattedPhone = (() => {
    const raw = (phone || '9876543210').replace(/\D/g, '')
    if (raw.length === 10) {
      return `+91 ${raw.slice(0, 5)} ${raw.slice(5)}`
    }
    return `+91 ${raw}`
  })()

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleResend = () => {
    setSecondsLeft(30)
    setOtp(['', '', '', '', '', ''])
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '')
    if (!cleaned) {
      const next = [...otp]
      next[index] = ''
      setOtp(next)
      return
    }

    const digit = cleaned.slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)

    // Automatically move focus to next box
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const next = [...otp]
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || ''
    }
    setOtp(next)

    const nextIdx = Math.min(pasted.length, 5)
    if (inputRefs.current[nextIdx]) {
      inputRefs.current[nextIdx].focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setVerified(true)
      setTimeout(() => {
        onVerifySuccess(otp.join(''))
      }, 1000)
    }, 500)
  }

  return (
    <div className="auth-card__body">
      {/* Center Branding */}
      <CenterBranding />

      {/* Heading & Subtitle */}
      <div className="auth-heading">
        <h2 className="auth-heading__title">Verify Your Number</h2>
        <p className="auth-heading__subtitle">
          We've sent a 6-digit OTP to
        </p>
        <div className="auth-otp-phone-badge">
          <span>{formattedPhone}</span>
          <button
            type="button"
            className="auth-otp-edit-btn"
            onClick={onEditPhone}
            aria-label="Edit phone number"
            title="Edit phone number"
          >
            <Pencil size={15} />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className={`auth-otp-box ${digit ? 'auth-otp-box--filled' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        {/* Resend OTP */}
        <div className="auth-resend-block">
          Didn't receive the OTP?{' '}
          {secondsLeft > 0 ? (
            <span className="auth-resend-countdown">
              Resend in 00:{secondsLeft.toString().padStart(2, '0')}
            </span>
          ) : (
            <button
              type="button"
              className="auth-resend-btn"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="submit"
          className="auth-btn-primary"
          disabled={isVerifying || verified}
        >
          {verified ? (
            <>
              <CheckCircle2 size={18} /> Verified!
            </>
          ) : isVerifying ? (
            'Verifying...'
          ) : (
            <>
              Verify & Continue <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
