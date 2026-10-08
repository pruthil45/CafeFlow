import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  UtensilsCrossed,
  LayoutGrid,
  Users,
  Heart,
  Tag,
  BarChart2,
  TrendingUp,
  Settings,
  Store,
  LogOut,
  ChevronDown,
  Check,
  Coffee,
  X,
} from 'lucide-react'
import { OWNER_CAFES } from '../data/ownerMockData'

export default function OwnerSidebar({
  selectedCafe,
  onSelectCafe,
  isMobileOpen,
  onCloseMobile,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isCafeDropdownOpen, setIsCafeDropdownOpen] = useState(false)
  const cafeDropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cafeDropdownRef.current &&
        !cafeDropdownRef.current.contains(event.target)
      ) {
        setIsCafeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile()
    }
  }, [location.pathname])

  const handleLogout = () => {
    // Clear any mock owner session and redirect to /login
    sessionStorage.removeItem('cafeflow_owner_auth')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`owner-sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      {/* Main Solid Espresso Sidebar */}
      <aside
        className={`owner-sidebar ${isMobileOpen ? 'open' : ''}`}
        aria-label="Owner Navigation"
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '12px' }}>
          <Link to="/owner/dashboard" className="owner-sidebar__brand">
            <div className="owner-sidebar__logo-cup" aria-hidden="true">
              <Coffee size={20} strokeWidth={2.4} />
            </div>
            <div className="owner-sidebar__brand-text">
              <div className="owner-sidebar__brand-title">
                Café<span>Flow</span>
              </div>
              <div className="owner-sidebar__brand-subtitle">OWNER PORTAL</div>
            </div>
          </Link>

          {/* Close button for mobile screens */}
          {isMobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Café Selector Box */}
        <div className="owner-sidebar__cafe-selector-wrap" ref={cafeDropdownRef}>
          <button
            type="button"
            className="owner-sidebar__cafe-selector"
            onClick={() => setIsCafeDropdownOpen(!isCafeDropdownOpen)}
            aria-expanded={isCafeDropdownOpen}
            aria-label="Select Café"
          >
            <div className="owner-sidebar__cafe-thumb">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=80&auto=format&fit=crop&q=80"
                alt={selectedCafe?.name || 'The Daily Bean'}
              />
            </div>
            <div className="owner-sidebar__cafe-info">
              <span className="owner-sidebar__cafe-name">
                {selectedCafe?.name || 'The Daily Bean'}
              </span>
              <span className="owner-sidebar__cafe-tagline">
                {selectedCafe?.tagline || 'Café & Kitchen'}
              </span>
            </div>
            <ChevronDown size={16} className="owner-sidebar__cafe-chevron" />
          </button>

          {/* Café Selector Dropdown List */}
          {isCafeDropdownOpen && (
            <div className="owner-sidebar__cafe-menu">
              {OWNER_CAFES.map((cafe) => (
                <button
                  key={cafe.id}
                  type="button"
                  className={`owner-sidebar__cafe-menu-item ${
                    selectedCafe?.id === cafe.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    onSelectCafe(cafe)
                    setIsCafeDropdownOpen(false)
                  }}
                >
                  <div>
                    <span className="owner-sidebar__cafe-menu-item-name">
                      {cafe.name}
                    </span>
                    <span className="owner-sidebar__cafe-menu-item-sub">
                      {cafe.location}
                    </span>
                  </div>
                  {selectedCafe?.id === cafe.id && (
                    <Check size={14} color="#d4a04a" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="owner-sidebar__nav">
          {/* MAIN */}
          <div className="owner-sidebar__group">
            <span className="owner-sidebar__group-label">MAIN</span>

            <NavLink
              to="/owner/dashboard"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <LayoutDashboard size={18} />
              </span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/owner/orders"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <ShoppingCart size={18} />
              </span>
              <span>Orders</span>
              <span className="owner-sidebar__badge owner-sidebar__badge--red">
                8
              </span>
            </NavLink>

            <NavLink
              to="/owner/kitchen"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <ChefHat size={18} />
              </span>
              <span>Kitchen Display</span>
            </NavLink>

            <NavLink
              to="/owner/menu"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <UtensilsCrossed size={18} />
              </span>
              <span>Menu</span>
            </NavLink>

            <NavLink
              to="/owner/tables"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <LayoutGrid size={18} />
              </span>
              <span>Tables</span>
            </NavLink>

            <NavLink
              to="/owner/customers"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <Users size={18} />
              </span>
              <span>Customers</span>
            </NavLink>
          </div>

          {/* GROW */}
          <div className="owner-sidebar__group">
            <span className="owner-sidebar__group-label">GROW</span>

            <NavLink
              to="/owner/loyalty"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <Heart size={18} />
              </span>
              <span>Loyalty</span>
            </NavLink>

            <NavLink
              to="/owner/promotions"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <Tag size={18} />
              </span>
              <span>Promotions</span>
            </NavLink>
          </div>

          {/* ANALYTICS */}
          <div className="owner-sidebar__group">
            <span className="owner-sidebar__group-label">ANALYTICS</span>

            <NavLink
              to="/owner/reports"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <BarChart2 size={18} />
              </span>
              <span>Reports</span>
            </NavLink>

            <NavLink
              to="/owner/analytics"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <TrendingUp size={18} />
              </span>
              <span>Analytics</span>
            </NavLink>
          </div>

          {/* SETTINGS */}
          <div className="owner-sidebar__group">
            <span className="owner-sidebar__group-label">SETTINGS</span>

            <NavLink
              to="/owner/settings"
              className={({ isActive }) =>
                `owner-sidebar__link ${isActive ? 'active' : ''}`
              }
            >
              <span className="owner-sidebar__link-icon">
                <Settings size={18} />
              </span>
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="owner-sidebar__bottom">
          <NavLink
            to="/owner/my-cafe"
            className={({ isActive }) =>
              `owner-sidebar__link ${isActive ? 'active' : ''}`
            }
          >
            <span className="owner-sidebar__link-icon">
              <Store size={18} />
            </span>
            <span>My Café</span>
          </NavLink>

          <button
            type="button"
            className="owner-sidebar__logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
