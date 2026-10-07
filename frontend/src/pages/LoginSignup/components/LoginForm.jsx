import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CenterBranding from './CenterBranding'
import PhoneInput from './PhoneInput'

export default function LoginForm({
  phone = '',
  setPhone = () => {},
  onContinue = () => {},
  onSwitchToSignup = () => {},
}) {
  const [error, setError] = useState('')

  const handlePhoneChange = (val) => {
    setPhone(val)
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    onContinue(phone)
  }

  return (
    <div className="auth-card__body">
      {/* Center Branding */}
      <CenterBranding />

      {/* Heading & Subtitle */}
      <div className="auth-heading">
        <h2 className="auth-heading__title">Welcome Back</h2>
        <p className="auth-heading__subtitle">
          Login to continue and enjoy a seamless dining experience.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-phone">
            Mobile Number
          </label>
          <PhoneInput
            id="login-phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter your mobile number"
            autoFocus
          />
          {error && <span className="auth-error">{error}</span>}
        </div>

        <button type="submit" className="auth-btn-primary">
          Continue <ArrowRight size={17} />
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">
        <span>OR</span>
      </div>

      {/* New to CaféFlow? */}
      <div className="auth-new-label">New to CaféFlow?</div>
      <button
        type="button"
        className="auth-btn-secondary"
        onClick={onSwitchToSignup}
      >
        Create an Account
      </button>
    </div>
  )
}
