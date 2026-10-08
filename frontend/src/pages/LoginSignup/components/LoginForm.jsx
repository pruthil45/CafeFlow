import { useState } from 'react'
import { ArrowRight, ShieldCheck, Sparkles, Store } from 'lucide-react'
import CenterBranding from './CenterBranding'
import PhoneInput from './PhoneInput'

export default function LoginForm({
  phone = '',
  setPhone = () => {},
  onContinue = () => {},
  onSwitchToSignup = () => {},
  onDemoAdminLogin = () => {},
  onDemoOwnerLogin = () => {},
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
          Login with your mobile number via OTP. No password needed.
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

        <button type="submit" className="auth-btn-primary" id="login-continue-btn">
          Continue with OTP <ArrowRight size={17} />
        </button>
      </form>

      {/* Demo Portals Section */}
      <div className="auth-admin-demo-card">
        <div className="auth-admin-demo-card__header">
          <ShieldCheck size={16} className="auth-admin-demo-card__icon" />
          <span>Quick Demo Access</span>
        </div>
        <p className="auth-admin-demo-card__sub">
          Instant one-click access to test CaféFlow portals without waiting for OTP:
        </p>
        <div className="auth-admin-demo-card__actions">
          <button
            type="button"
            className="auth-btn-admin-demo"
            onClick={onDemoOwnerLogin}
            id="demo-owner-login-btn"
            style={{
              background: 'linear-gradient(135deg, #c47d2e, #8c4a23)',
              color: '#fff',
              borderColor: '#fae0cd',
              marginBottom: '6px',
            }}
          >
            <Store size={14} />
            <span>☕ Demo Café Owner Portal (The Daily Bean)</span>
          </button>
          <button
            type="button"
            className="auth-btn-admin-demo"
            onClick={onDemoAdminLogin}
            id="demo-admin-login-btn"
          >
            <Sparkles size={14} />
            <span>⚡ Demo Admin Portal (Super Admin)</span>
          </button>
        </div>
      </div>

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
