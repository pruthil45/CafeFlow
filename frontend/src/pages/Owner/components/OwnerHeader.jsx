import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  Store,
  LogOut,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react'
import OwnerSearchModal from './OwnerSearchModal'
import cafeDarkBg from '../../../assets/cafe_dark_bg.jpg'
import { OWNER_NOTIFICATIONS } from '../data/ownerMockData'

export default function OwnerHeader({ selectedCafe, onToggleMobileSidebar }) {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotifPopupOpen, setIsNotifPopupOpen] = useState(false)
  const [notifications, setNotifications] = useState(OWNER_NOTIFICATIONS)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // Global Ctrl + K shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  const location = useLocation()
  let searchPlaceholder = 'Search orders, menu items, customers...'
  if (location.pathname.includes('/owner/menu/combos')) {
    searchPlaceholder = 'Search items, categories, combos...'
  } else if (location.pathname.includes('/owner/menu')) {
    searchPlaceholder = 'Search items, categories, add-ons...'
  }

  return (
    <>
      <header
        className="owner-header-banner"
        style={{ backgroundImage: `url(${cafeDarkBg})` }}
        role="banner"
      >
        {/* Dark warm overlay */}
        <div className="owner-header-banner__overlay" aria-hidden="true" />

        {/* Left Side: Mobile Menu Button & Glowing Amber Script */}
        <div className="owner-header-banner__left">
          <button
            type="button"
            className="owner-header-banner__menu-toggle"
            onClick={onToggleMobileSidebar}
            aria-label="Open mobile navigation"
          >
            <Menu size={22} />
          </button>

          {/* Golden Amber Script matching reference screenshot */}
          <div className="owner-header-banner__neon-script" aria-label="Good Food, Better Moments">
            <span>Good Food,</span>
            <span>Better Moments</span>
          </div>
        </div>

        {/* Right Side: Search + Notifications + Owner Profile */}
        <div className="owner-header-banner__right">
          {/* Search Pill */}
          <button
            type="button"
            className="owner-header-banner__search-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search orders, menu items, customers"
          >
            <Search size={16} className="owner-header-banner__search-icon" />
            <span className="owner-header-banner__search-text">
              {searchPlaceholder}
            </span>
            <span className="owner-header-banner__search-kbd">Ctrl K</span>
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="owner-header-banner__action-btn"
              onClick={() => setIsNotifPopupOpen(!isNotifPopupOpen)}
              aria-label="View notifications"
              aria-expanded={isNotifPopupOpen}
            >
              <Bell size={18} />
              <span className="owner-header-banner__badge">
                {unreadCount > 0 ? 12 : 0}
              </span>
            </button>

            {/* Notifications Popup */}
            {isNotifPopupOpen && (
              <div className="owner-header-notifications-popup">
                <div className="owner-header-notifications-popup__title">
                  <span>Notifications (12)</span>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#c47d2e',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                </div>

                <div className="owner-header-notifications-popup__list">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="owner-header-notifications-popup__item"
                      onClick={() => {
                        setIsNotifPopupOpen(false)
                        navigate(item.actionRoute || '/owner/orders')
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="owner-header-notifications-popup__icon">
                        <Bell size={14} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#1a0e0a' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6e645a', marginTop: '2px' }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '10px', color: '#9c9186', marginTop: '3px' }}>
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="owner-header-banner__profile-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              aria-label="Café Owner profile menu"
            >
              <div className="owner-header-banner__avatar">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Café Owner"
                />
              </div>
              <span className="owner-header-banner__profile-name">
                Café Owner
              </span>
              <ChevronDown
                size={15}
                className="owner-header-banner__profile-chevron"
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="owner-header-menu">
                <div className="owner-header-menu__header">
                  <div className="owner-header-menu__name">
                    {selectedCafe?.ownerName || 'Café Owner'}
                  </div>
                  <div className="owner-header-menu__role">
                    Owner • {selectedCafe?.name || 'The Daily Bean'}
                  </div>
                </div>

                <Link
                  to="/owner/my-cafe"
                  className="owner-header-menu__item"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Store size={15} color="#c47d2e" />
                  <span>My Café Profile</span>
                </Link>

                <Link
                  to="/owner/settings"
                  className="owner-header-menu__item"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <Settings size={15} color="#c47d2e" />
                  <span>Café Settings</span>
                </Link>

                <div className="owner-header-menu__divider" />

                <Link
                  to="/admin/dashboard"
                  className="owner-header-menu__item"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <ShieldCheck size={15} color="#d4a04a" />
                  <span>Switch to Admin Panel</span>
                </Link>

                <div className="owner-header-menu__divider" />

                <button
                  type="button"
                  className="owner-header-menu__item owner-header-menu__item--danger"
                  onClick={() => {
                    setIsProfileMenuOpen(false)
                    sessionStorage.removeItem('cafeflow_owner_auth')
                    navigate('/login')
                  }}
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Interactive Search Modal */}
      <OwnerSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
