export default function CenterBranding() {
  return (
    <div className="auth-center-brand">
      <div className="auth-center-brand__cup" aria-hidden="true">
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Steam wisps */}
          <path
            d="M32 20C32 15 36 13 36 8C36 5 34 3 32 2"
            stroke="#983B16"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M44 20C44 14 48 12 48 7C48 4 46 2.5 44 2"
            stroke="#983B16"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Saucer */}
          <ellipse cx="38" cy="68" rx="26" ry="5" fill="#3D1D11" />
          <ellipse cx="38" cy="67.5" rx="25" ry="4" fill="#582C1A" />

          {/* Cup Handle */}
          <path
            d="M50 36C59 36 65 42 63 50C61 57 52 58 48 57"
            stroke="#5A2E1C"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cup Body */}
          <path
            d="M18 30C18 48 24 64 38 64C52 64 58 48 58 30H18Z"
            fill="url(#brandCupGrad)"
          />

          {/* Rim & Surface */}
          <ellipse cx="38" cy="30" rx="20" ry="7.5" fill="#3D1D11" />
          <ellipse cx="38" cy="30" rx="17" ry="5.5" fill="#753C22" />
          <ellipse cx="38" cy="30.5" rx="14" ry="4" fill="#2B140B" />

          <defs>
            <linearGradient id="brandCupGrad" x1="18" y1="30" x2="58" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6C3721" />
              <stop offset="0.6" stopColor="#4F2616" />
              <stop offset="1" stopColor="#38190E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <h1 className="auth-center-brand__title">
        Café<span>Flow</span>
      </h1>
      <span className="auth-center-brand__tagline">
        GOOD FOOD BETTER MOMENTS
      </span>
    </div>
  )
}
