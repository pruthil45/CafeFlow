import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Smartphone, Zap, Users, Bell, Store, User, ShieldCheck } from 'lucide-react'
import heroBg from '../assets/hero-bg.jpg'

const rolePills = [
  { key: 'admin', icon: ShieldCheck, label: 'Admin', desc: 'Manage all cafés', path: '/admin' },
  { key: 'owner', icon: Store, label: 'Owner', desc: 'Run your café', path: '/for-businesses/owners' },
  { key: 'staff', icon: Users, label: 'Staff', desc: 'Daily operations', path: '/for-businesses/staff' },
  { key: 'customer', icon: User, label: 'Customer', desc: 'Scan, order, enjoy', path: '/for-customers' },
]

const badges = [
  { icon: Smartphone, text: 'No App Download' },
  { icon: Zap, text: 'Quick and Easy' },
  { icon: Users, text: 'Individual Orders & Bills' },
  { icon: Bell, text: 'Call Waiter Anytime' },
]

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero" id="hero" aria-label="CaféFlow Hero">
      {/* Desktop Background Artwork */}
      <div className="hero__bg" aria-hidden="true">
        <img
          src={heroBg}
          alt="CaféFlow all-in-one café management on laptop, tablet, and mobile"
          loading="eager"
          className="hero__bg-img"
        />
      </div>

      {/* Subtle Vignette Overlay for Desktop Typography Readability */}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__container">
        {/* Top Floating Role Pills */}
        <div className="hero__role-bar">
          <div className="hero__role-pills" role="navigation" aria-label="Quick Role Access">
            {rolePills.map(r => (
              <button
                key={r.label}
                onClick={() => navigate(r.path)}
                className={`hero__role-pill hero__role-pill--${r.key}`}
                aria-label={`${r.label}: ${r.desc}`}
              >
                <div className={`hero__role-pill-icon hero__role-pill-icon--${r.key}`}>
                  <r.icon size={16} />
                </div>
                <div className="hero__role-pill-text">
                  <span className="hero__role-pill-title">{r.label}</span>
                  <span className="hero__role-pill-desc">{r.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Content Grid: Real HTML typography on left, showcase on right */}
        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__eyebrow">All-in-One Café Management Platform</span>
            <h1 className="hero__title">
              Smarter <span className="gold">Cafés.</span><br />
              Happier Customers.<br />
              Higher <span className="gold">Growth.</span>
            </h1>
            <p className="hero__description">
              Manage orders, tables, menus, staff, customers, loyalty,
              promotions and analytics — all in one powerful platform.
            </p>

            <div className="hero__buttons">
              <button
                className="hero__primary-btn"
                onClick={() => navigate('/login')}
                aria-label="Get Started"
              >
                Get Started <ArrowRight size={18} />
              </button>
              <button
                className="hero__secondary-btn"
                onClick={() => {
                  const el = document.getElementById('how-it-works')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                aria-label="Watch Demo"
              >
                <span className="hero__play-icon">
                  <Play size={15} fill="#ffffff" />
                </span>
                Watch Demo
              </button>
            </div>

            <div className="hero__badges">
              {badges.map(b => (
                <div className="hero__badge" key={b.text}>
                  <div className="hero__badge-icon">
                    <b.icon size={16} />
                  </div>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Showcase: Dedicated mobile/tablet frame so text never covers the laptop/phone artwork */}
          <div className="hero__showcase-frame" aria-label="CaféFlow Device Showcase">
            <img
              src={heroBg}
              alt="CaféFlow dashboard on laptop, table management on tablet, and digital menu on mobile"
              className="hero__mobile-artwork"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
