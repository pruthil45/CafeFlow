import { Link } from 'react-router-dom'

const platformLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Businesses', href: '/#roles' },
]

const roleLinks = [
  { label: 'Owner', href: '/for-businesses/owners' },
  { label: 'Staff', href: '/for-businesses/staff' },
  { label: 'Customer', href: '/for-customers' },
]

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: '/contact' },
  { label: 'Support', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms', href: '#' },
]

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const socials = [
  { icon: TwitterIcon, label: 'Twitter / X', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '#' },
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="22" r="14" fill="#3d2518"/>
                <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
                <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#d4a04a" strokeWidth="2" fill="none"/>
                <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#d4a04a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
              </svg>
              <span className="footer__brand-name">Café<span>Flow</span></span>
            </div>
            <p className="footer__brand-desc">
              The all-in-one café management platform for smarter operations and happier customers.
            </p>
            <div className="footer__social">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer__social-icon"
                  aria-label={s.label}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="footer__column-title">Platform</h4>
            <nav className="footer__links" aria-label="Platform links">
              {platformLinks.map(l => (
                <Link key={l.label} to={l.href} className="footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="footer__column-title">Roles</h4>
            <nav className="footer__links" aria-label="Role links">
              {roleLinks.map(l => (
                <Link key={l.label} to={l.href} className="footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="footer__column-title">Company</h4>
            <nav className="footer__links" aria-label="Company links">
              {companyLinks.map(l => (
                <Link key={l.label} to={l.href} className="footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">© 2026 CaféFlow. All rights reserved.</span>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
