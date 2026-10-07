import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'Features', href: '/#features', id: 'features' },
  { label: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
  { label: 'For Owners', href: '/for-businesses/owners', id: 'owners' },
  { label: 'For Staff', href: '/for-businesses/staff', id: 'staff' },
  { label: 'For Customers', href: '/for-customers', id: 'customers' },
  { label: 'Pricing', href: '/pricing', id: 'pricing' },
  { label: 'Contact', href: '/contact', id: 'contact' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLinkClick = (e, link) => {
    setMobileOpen(false)
    if (link.href.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault()
        const hash = link.href.replace('/', '')
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const isLinkActive = (link) => {
    if (link.href === '/' && location.pathname === '/' && !location.hash) return true
    if (link.href === '/pricing' && location.pathname === '/pricing') return true
    if (link.href === '/contact' && location.pathname === '/contact') return true
    return false
  }

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar--solid' : 'navbar--transparent'}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" className="navbar__brand" aria-label="CaféFlow Home">
        <div className="navbar__logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="22" r="14" fill="#3d2518"/>
            <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
            <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#d4a04a" strokeWidth="2" fill="none"/>
            <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#d4a04a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
            <path d="M12 12c1-3 2-5 4-5" stroke="#d4a04a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
            <path d="M28 12c-1-3-2-5-4-5" stroke="#d4a04a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
        </div>
        <div className="navbar__brand-text">
          <span className="navbar__brand-name">Café<span>Flow</span></span>
          <span className="navbar__brand-tagline">Café Management Platform</span>
        </div>
      </Link>

      <div className="navbar__links">
        {navLinks.map(link => {
          const active = isLinkActive(link)
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`navbar__link ${active ? 'navbar__link--active' : ''}`}
              onClick={(e) => handleLinkClick(e, link)}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="navbar__actions">
        <button className="navbar__login-btn" onClick={() => navigate('/login')} aria-label="Login">Login</button>
        <button className="navbar__cta-btn" onClick={() => navigate('/login')} aria-label="Get Started">
          Get Started <ArrowRight size={16} />
        </button>
        <button
          className="navbar__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        {navLinks.map(link => (
          <Link
            key={link.label}
            to={link.href}
            className="navbar__mobile-link"
            onClick={(e) => handleLinkClick(e, link)}
          >
            {link.label}
          </Link>
        ))}
        <div className="navbar__mobile-actions">
          <button className="navbar__mobile-login" onClick={() => { setMobileOpen(false); navigate('/login'); }}>Login</button>
          <button className="navbar__mobile-cta" onClick={() => { setMobileOpen(false); navigate('/login'); }}>Get Started →</button>
        </div>
      </div>
    </nav>
  )
}
