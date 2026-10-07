import { Link } from 'react-router-dom'
import './Footer.css'

const platformLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'For Owners', href: '/for-businesses/owners' },
  { label: 'For Staff', href: '/for-businesses/staff' },
]

const roleLinks = [
  { label: 'Café Owners', href: '/for-businesses/owners' },
  { label: 'Floor & Kitchen Staff', href: '/for-businesses/staff' },
  { label: 'Dine-In Customers', href: '/for-customers' },
]

const companyLinks = [
  { label: 'About Us', href: '/#about' },
  { label: 'Contact Sales / Setup', href: '/contact' },
  { label: 'Pricing Plans', href: '/pricing' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
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
  { icon: TwitterIcon, label: 'Twitter / X', href: 'https://twitter.com' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com' },
]

export default function Footer() {
  return (
    <footer className="global-footer" role="contentinfo">
      <div className="global-footer__container">
        <div className="global-footer__grid">
          <div>
            <Link to="/" className="global-footer__brand" aria-label="CaféFlow Home">
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="22" r="14" fill="#3d2518"/>
                <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
                <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#d4a04a" strokeWidth="2" fill="none"/>
                <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#d4a04a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
              </svg>
              <span className="global-footer__brand-name">Café<span>Flow</span></span>
            </Link>
            <p className="global-footer__brand-desc">
              The modern all-in-one café management platform for smoother operations, seamless orders, and happier customers.
            </p>
            <div className="global-footer__social">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="global-footer__social-icon"
                  aria-label={s.label}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="global-footer__column-title">Platform</h4>
            <nav className="global-footer__links" aria-label="Platform links">
              {platformLinks.map(l => (
                <Link key={l.label} to={l.href} className="global-footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="global-footer__column-title">Solutions</h4>
            <nav className="global-footer__links" aria-label="Role links">
              {roleLinks.map(l => (
                <Link key={l.label} to={l.href} className="global-footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="global-footer__column-title">Company</h4>
            <nav className="global-footer__links" aria-label="Company links">
              {companyLinks.map(l => (
                <Link key={l.label} to={l.href} className="global-footer__link">{l.label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="global-footer__bottom">
          <span className="global-footer__copy">© 2026 CaféFlow. All rights reserved. Crafted with care for cafés across India.</span>
          <div className="global-footer__bottom-links">
            <Link to="#" className="global-footer__bottom-link">Privacy Policy</Link>
            <Link to="#" className="global-footer__bottom-link">Terms of Service</Link>
            <Link to="/contact" className="global-footer__bottom-link">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
