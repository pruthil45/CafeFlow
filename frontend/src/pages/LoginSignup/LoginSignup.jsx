import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LoginSignup.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import OTPVerification from './components/OTPVerification'
import LanguageSelector from './components/LanguageSelector'
import BottomShapes from './components/BottomShapes'

export default function LoginSignup() {
  const navigate = useNavigate()

  // Authentication State: 'login' | 'signup' | 'otp'
  const [authState, setAuthState] = useState('login')
  const [prevState, setPrevState] = useState('login')

  // User input states
  const [phone, setPhone] = useState('9876543210')
  const [userProfile, setUserProfile] = useState(null)
  const [verifiedSuccess, setVerifiedSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState('Login successful! Welcome to CaféFlow.')

  // Transition handlers
  const handleContinueFromLogin = (phoneNumber) => {
    setPhone(phoneNumber)
    setPrevState('login')
    setAuthState('otp')
  }

  const handleSignupSubmit = (profileData) => {
    setUserProfile(profileData)
    setPhone(profileData.phone)
    setPrevState('signup')
    setAuthState('otp')
  }

  const handleBackFromOTP = () => {
    setAuthState(prevState || 'login')
  }

  // One-click Demo Admin Login
  const handleDemoAdminLogin = () => {
    const adminPhone = '9876543210'
    sessionStorage.setItem(
      'cafeflow_admin_auth',
      JSON.stringify({
        authenticated: true,
        role: 'admin',
        name: 'Super Admin',
        phone: '+91 98765 43210',
        email: 'admin@cafeflow.in',
        loginTime: new Date().toISOString(),
      })
    )
    setToastMessage('Admin verified! Welcome to CaféFlow Admin Portal.')
    setVerifiedSuccess(true)
    setTimeout(() => {
      navigate('/admin/dashboard')
    }, 800)
  }

  // Verification handler (shared for Admin and regular users)
  const handleVerifySuccess = () => {
    const raw = (phone || '').replace(/\D/g, '')
    const isAdmin = raw === '9876543210' || raw === '9876500001' || raw === '9999988888'

    if (isAdmin) {
      sessionStorage.setItem(
        'cafeflow_admin_auth',
        JSON.stringify({
          authenticated: true,
          role: 'admin',
          name: 'Super Admin',
          phone: `+91 ${raw.slice(0, 5)} ${raw.slice(5)}`,
          email: 'admin@cafeflow.in',
          loginTime: new Date().toISOString(),
        })
      )
      setToastMessage('Admin OTP verified! Entering Admin Portal...')
      setVerifiedSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 900)
    } else {
      setToastMessage('Login successful! Welcome to CaféFlow.')
      setVerifiedSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1400)
    }
  }

  return (
    <div className="auth-page">
      {/* Return to Landing Page Link */}
      <Link to="/" className="auth-page__home-link" aria-label="Back to Website">
        <ArrowLeft size={15} />
        <span>Back to Website</span>
      </Link>

      {/* Main Centered Authentication Card */}
      <main className="auth-card" role="main" aria-label="CaféFlow Authentication">
        {/* Top Area */}
        <div className="auth-card__top">
          {authState === 'login' ? (
            /* Left Corner CaféFlow Logo */
            <Link to="/" className="auth-card__corner-logo" aria-label="CaféFlow Home">
              <div className="auth-card__corner-logo-cup">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="22" r="14" fill="#3d2518"/>
                  <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
                  <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#983b16" strokeWidth="2" fill="none"/>
                  <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#983b16" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
                </svg>
              </div>
              <div className="auth-card__corner-logo-text">
                <span className="auth-card__corner-brand">
                  Café<span>Flow</span>
                </span>
                <span className="auth-card__corner-tagline">
                  GOOD FOOD BETTER MOMENTS
                </span>
              </div>
            </Link>
          ) : authState === 'signup' ? (
            /* Left Back to Login */
            <button
              type="button"
              className="auth-card__back-btn"
              onClick={() => setAuthState('login')}
              aria-label="Back to Login"
            >
              <ArrowLeft size={18} />
              <span>Back to Login</span>
            </button>
          ) : (
            /* Left Back */
            <button
              type="button"
              className="auth-card__back-btn"
              onClick={handleBackFromOTP}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
          )}

          {/* Right Language Selector */}
          <LanguageSelector />
        </div>

        {/* Center Content based on Active State */}
        {authState === 'login' && (
          <LoginForm
            phone={phone}
            setPhone={setPhone}
            onContinue={handleContinueFromLogin}
            onSwitchToSignup={() => {
              setPrevState('login')
              setAuthState('signup')
            }}
            onDemoAdminLogin={handleDemoAdminLogin}
          />
        )}

        {authState === 'signup' && (
          <SignupForm
            phone={phone}
            setPhone={setPhone}
            onSubmit={handleSignupSubmit}
            onSwitchToLogin={() => setAuthState('login')}
          />
        )}

        {authState === 'otp' && (
          <OTPVerification
            phone={phone}
            onEditPhone={() => setAuthState(prevState || 'login')}
            onVerifySuccess={handleVerifySuccess}
          />
        )}

        {/* Bottom Flowing Abstract Shapes */}
        <BottomShapes />
      </main>

      {/* Verification Success Toast */}
      {verifiedSuccess && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#141c28',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#4ade80' }}>✓</span> {toastMessage}
        </div>
      )}
    </div>
  )
}
