import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, RotateCw, Sparkles } from 'lucide-react';
import '../Admin.css';

/**
 * Admin Login — Phone Number + OTP Only (No Password Required).
 * Admin account is pre-provisioned in the system.
 * Flow:
 * 1. Enter Admin Phone Number -> Click "Get OTP"
 * 2. Receive 6-digit OTP -> Verify OTP -> Access Admin Dashboard
 */

// Registered mock admin phone numbers (accepts these or any 10-digit number in demo mode)
const DEMO_ADMIN_PHONES = [
  '9876543210',
  '9876500001',
  '9999988888',
];

const DEFAULT_OTP = '123456';

export default function AdminLogin() {
  const navigate = useNavigate();

  // Step: 'phone' | 'otp'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const otpRefs = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== 'otp' || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Format phone display (+91 98765 43210)
  const formatPhone = (raw) => {
    const cleaned = (raw || '').replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return `+91 ${cleaned}`;
  };

  // Step 1: Request OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    setError('');

    const raw = phone.replace(/\D/g, '');
    if (!raw || raw.length < 10) {
      setError('Please enter a valid 10-digit admin mobile number.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      // Focus first OTP field
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otp];
      next[index] = '';
      setOtp(next);
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    // Auto-advance
    if (index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && otpRefs.current[index - 1]) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...otp];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setOtp(next);

    const nextIdx = Math.min(pasted.length, 5);
    otpRefs.current[nextIdx]?.focus();
  };

  // Quick autofill demo OTP
  const handleAutofillDemo = () => {
    setOtp(DEFAULT_OTP.split(''));
    setError('');
  };

  // Resend OTP
  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    otpRefs.current[0]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // In mock/demo: accept default '123456' or any 6-digit entered
      setLoading(false);
      setVerifiedSuccess(true);

      // Save Admin Session (Role: Admin)
      sessionStorage.setItem(
        'cafeflow_admin_auth',
        JSON.stringify({
          authenticated: true,
          role: 'admin',
          name: 'Super Admin',
          phone: formatPhone(phone),
          email: 'admin@cafeflow.in',
          loginTime: new Date().toISOString(),
        })
      );

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 700);
    }, 700);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        {/* Brand */}
        <div className="admin-login__brand">
          <div className="admin-login__logo">
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="28" r="18" fill="#3d2518" />
              <ellipse cx="26" cy="24" rx="13" ry="10" fill="#5c3a28" />
              <path d="M38 24c4 0 6 3 6 6s-3 6-6 6" stroke="#d4a04a" strokeWidth="2.5" fill="none" />
              <path
                d="M18 18c2-5 4-8 8-8s7 3 8 8"
                stroke="#d4a04a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
            </svg>
          </div>
          <div className="admin-login__brand-name">
            Café<span>Flow</span>
          </div>
          <div className="admin-login__brand-tag">ADMIN PORTAL</div>
        </div>

        {/* Title & Subtitle */}
        {step === 'phone' ? (
          <>
            <h1 className="admin-login__title">Admin Verification</h1>
            <p className="admin-login__subtitle">
              Sign in with your registered mobile number using OTP
            </p>
          </>
        ) : (
          <>
            <div className="admin-login__back-row">
              <button
                type="button"
                className="admin-login__back-btn"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
              >
                <ArrowLeft size={16} />
                <span>Change Number</span>
              </button>
            </div>
            <h1 className="admin-login__title">Verify OTP</h1>
            <p className="admin-login__subtitle">
              Enter the 6-digit code sent to{' '}
              <strong style={{ color: '#d4a04a' }}>{formatPhone(phone)}</strong>
            </p>
          </>
        )}

        {/* Error message */}
        {error && <div className="admin-login__error">{error}</div>}

        {/* STEP 1: PHONE NUMBER FORM */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOtp}>
            <div className="admin-login__field">
              <label className="admin-login__label">
                <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Registered Mobile Number
              </label>
              <div className="admin-phone-input-wrap">
                <span className="admin-phone-prefix">
                  <span className="admin-flag">🇮🇳</span> +91
                </span>
                <input
                  type="tel"
                  className="admin-login__input admin-phone-input"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                  autoComplete="tel"
                  id="admin-phone"
                />
              </div>
            </div>

            {/* Quick demo chip */}
            <div className="admin-login__demo-badge" onClick={() => setPhone('9876543210')}>
              <Sparkles size={13} color="#d4a04a" />
              <span>Demo Admin: <strong>9876543210</strong> (Click to fill)</span>
            </div>

            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading || phone.length < 10}
              id="admin-get-otp-btn"
            >
              {loading ? (
                'Sending OTP...'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  Get OTP <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION FORM */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            {/* 6 Digit OTP inputs */}
            <div className="admin-otp-grid" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className={`admin-otp-box ${digit ? 'admin-otp-box--filled' : ''}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  aria-label={`OTP Digit ${idx + 1}`}
                  id={`admin-otp-${idx}`}
                />
              ))}
            </div>

            {/* Demo Auto-fill Helper */}
            <div className="admin-otp-helper">
              <button
                type="button"
                className="admin-otp-demo-fill"
                onClick={handleAutofillDemo}
              >
                <Sparkles size={12} /> Auto-fill Demo OTP ({DEFAULT_OTP})
              </button>
            </div>

            {/* Resend Timer */}
            <div className="admin-login__resend-row">
              {countdown > 0 ? (
                <span className="admin-resend-countdown">
                  Resend code in <strong>00:{countdown.toString().padStart(2, '0')}</strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="admin-resend-btn"
                  onClick={handleResend}
                >
                  <RotateCw size={14} /> Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading || verifiedSuccess || otp.join('').length < 6}
              id="admin-verify-btn"
            >
              {verifiedSuccess ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} color="#22c55e" /> Authenticated! Redirecting...
                </span>
              ) : loading ? (
                'Verifying OTP...'
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <ShieldCheck size={18} /> Verify & Enter Admin Panel
                </span>
              )}
            </button>
          </form>
        )}

        {/* Security Notice */}
        <p className="admin-login__note">
          <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#d4a04a' }} />
          Admin login is secured with one-time SMS/WhatsApp OTP.<br />
          No password is required.
        </p>
      </div>
    </div>
  );
}
