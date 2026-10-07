export default function BottomShapes() {
  return (
    <div className="auth-card__bottom-shapes" aria-hidden="true">
      <svg
        viewBox="0 0 440 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Layer 1: Soft light cream curve */}
        <path
          d="M0 95V38C60 26 130 36 210 54C290 72 360 62 440 32V95H0Z"
          fill="#F5EDE4"
        />

        {/* Layer 2: Warm caramel-sand flowing wave */}
        <path
          d="M0 95V52C70 42 145 52 230 68C310 82 380 70 440 50V95H0Z"
          fill="#EADAC9"
        />

        {/* Layer 3: Accent terracotta sand wave (most prominent on bottom-left) */}
        <path
          d="M0 95V70C75 58 160 68 250 80C340 92 400 82 440 70V95H0Z"
          fill="#DCBA9E"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}
