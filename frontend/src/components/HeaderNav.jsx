import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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

export default function HeaderNav({ activePage }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isLinkActive = (link) => {
    if (activePage) {
      return activePage.toLowerCase() === link.id || activePage.toLowerCase() === link.label.toLowerCase()
    }
    if (link.href === '/contact' && location.pathname === '/contact') return true
    if (link.href === '/pricing' && location.pathname === '/pricing') return true
    if (link.href === '/for-customers' && location.pathname === '/for-customers') return true
    if (link.href === '/for-businesses/owners' && location.pathname === '/for-businesses/owners') return true
    if (link.href === '/for-businesses/staff' && location.pathname === '/for-businesses/staff') return true
    if (link.href === '/' && location.pathname === '/' && !location.hash) return true
    return false
  }

  const handleLinkClick = (e, link) => {
    setMobileOpen(false)
    if (link.href.startsWith('/#')) {
      const hash = link.href.replace('/', '')
      if (location.pathname === '/') {
        e.preventDefault()
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <nav
      className={`header-nav ${scrolled ? 'header-nav--scrolled' : 'header-nav--transparent'}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" className="header-nav__brand" aria-label="CaféFlow Home">
        <div className="header-nav__logo-cup">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="22" r="14" fill="#3d2518"/>
            <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
            <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#d4a04a" strokeWidth="2" fill="none"/>
            <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#d4a04a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
            <path d="M12 12c1-3 2-5 4-5" stroke="#d4a04a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
            <path d="M28 12c-1-3-2-5-4-5" stroke="#d4a04a" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
        </div>
        <div className="header-nav__brand-info">
          <span className="header-nav__brand-name">Café<span>Flow</span></span>
          <span className="header-nav__brand-tag">CAFÉ MANAGEMENT PLATFORM</span>
        </div>
      </Link>

      <div className="header-nav__menu">
        {navLinks.map((link) => {
          const active = isLinkActive(link)
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`header-nav__link ${active ? 'header-nav__link--active' : ''}`}
              onClick={(e) => handleLinkClick(e, link)}
            >
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="header-nav__actions">
        <button
          type="button"
          className="header-nav__login-btn"
          onClick={() => navigate('/login')}
          aria-label="Login"
        >
          Login
        </button>
        <button
          type="button"
          className="header-nav__cta-btn"
          onClick={() => navigate('/login')}
          aria-label="Get Started"
        >
          Get Started <ArrowRight size={15} />
        </button>
        <button
          type="button"
          className="header-nav__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`header-nav__mobile-drawer ${mobileOpen ? 'header-nav__mobile-drawer--open' : ''}`}>
        {navLinks.map((link) => {
          const active = isLinkActive(link)
          return (
            <Link
              key={link.label}
              to={link.href}
              className={`header-nav__mobile-link ${active ? 'header-nav__mobile-link--active' : ''}`}
              onClick={(e) => handleLinkClick(e, link)}
            >
              {link.label}
            </Link>
          )
        })}
        <div className="header-nav__mobile-actions">
          <button
            type="button"
            className="header-nav__mobile-login"
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
          >
            Login
          </button>
          <button
            type="button"
            className="header-nav__mobile-cta"
            onClick={() => { setMobileOpen(false); navigate('/login'); }}
          >
            Get Started →
          </button>
        </div>
      </div>
    </nav>
  )
}
