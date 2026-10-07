import { useState } from 'react'
import { ArrowRight, User, Phone, Mail } from 'lucide-react'
import CenterBranding from './CenterBranding'
import PhoneInput from './PhoneInput'

export default function SignupForm({
  phone = '',
  setPhone = () => {},
  onSubmit = () => {},
  onSwitchToLogin = () => {},
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handlePhoneChange = (val) => {
    setPhone(val)
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    onSubmit({ fullName, phone, email })
  }

  return (
    <div className="auth-card__body">
      {/* Center Branding */}
      <CenterBranding />

      {/* Heading & Subtitle */}
      <div className="auth-heading">
        <h2 className="auth-heading__title">Create Your Account</h2>
        <p className="auth-heading__subtitle">
          Join CaféFlow to order, track your orders and enjoy a better dining experience.
        </p>
      </div>

      {/* Form with Icon Containers Beside Inputs */}
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Full Name */}
        <div className="auth-field-with-icon">
          <div className="auth-icon-box" aria-hidden="true">
            <User size={19} strokeWidth={1.8} />
          </div>
          <div className="auth-field-with-icon__content">
            <label className="auth-label" htmlFor="signup-name">
              Full Name
            </label>
            <div className="auth-input-box">
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value)
                  if (error) setError('')
                }}
                autoFocus
                autoComplete="name"
              />
            </div>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="auth-field-with-icon">
          <div className="auth-icon-box" aria-hidden="true">
            <Phone size={19} strokeWidth={1.8} />
          </div>
          <div className="auth-field-with-icon__content">
            <label className="auth-label" htmlFor="signup-phone">
              Mobile Number
            </label>
            <PhoneInput
              id="signup-phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        {/* Email Address (Optional) */}
        <div className="auth-field-with-icon">
          <div className="auth-icon-box" aria-hidden="true">
            <Mail size={19} strokeWidth={1.8} />
          </div>
          <div className="auth-field-with-icon__content">
            <label className="auth-label" htmlFor="signup-email">
              Email Address <span className="auth-label__optional">(Optional)</span>
            </label>
            <div className="auth-input-box">
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        {error && <span className="auth-error">{error}</span>}

        <button type="submit" className="auth-btn-primary">
          Create Account <ArrowRight size={17} />
        </button>
      </form>

      {/* Switch to Login */}
      <div className="auth-footer-text">
        Already have an account?
        <button
          type="button"
          className="auth-footer-link"
          onClick={onSwitchToLogin}
        >
          Login
        </button>
      </div>
    </div>
  )
}
