import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  UserCheck,
  BarChart3,
  PieChart,
  UsersRound,
  Palette,
  Bell,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Platform Management',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { label: 'Cafés', icon: Store, path: '/admin/cafes', chevron: true },
      { label: 'Owners', icon: Users, path: '/admin/owners' },
      { label: 'Customers', icon: UserCheck, path: '/admin/customers', chevron: true },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Platform Analytics', icon: BarChart3, path: '/admin/platform-analytics', chevron: true },
      { label: 'Café Analytics', icon: PieChart, path: '/admin/cafe-analytics', chevron: true },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Staff Overview', icon: UsersRound, path: '/admin/staff-overview' },
      { label: 'Café Branding', icon: Palette, path: '/admin/cafe-branding', chevron: true },
    ],
  },
  {
    title: 'Communication',
    items: [
      { label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: 12, chevron: true },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs', chevron: true },
      { label: 'Settings', icon: Settings, path: '/admin/settings', chevron: true },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('cafeflow_admin_auth');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="admin-sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="22" r="14" fill="#3d2518"/>
              <ellipse cx="20" cy="18" rx="10" ry="8" fill="#5c3a28"/>
              <path d="M30 18c3 0 5 2 5 5s-2 5-5 5" stroke="#d4a04a" strokeWidth="2" fill="none"/>
              <path d="M14 14c1-4 3-6 6-6s5 2 6 6" stroke="#d4a04a" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8"/>
            </svg>
          </div>
          <div className="admin-sidebar__brand-info">
            <span className="admin-sidebar__brand-name">
              Café<span>Flow</span>
            </span>
            <span className="admin-sidebar__brand-tag">ADMIN PANEL</span>
          </div>
          <button className="admin-sidebar__collapse-btn" onClick={onClose} aria-label="Close sidebar">
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div className="admin-sidebar__section" key={section.title}>
              <div className="admin-sidebar__section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="admin-sidebar__link-icon">
                    <item.icon size={18} />
                  </span>
                  <span className="admin-sidebar__link-text">{item.label}</span>
                  {item.badge && (
                    <span className="admin-sidebar__link-badge">{item.badge}</span>
                  )}
                  {item.chevron && (
                    <ChevronRight size={14} className="admin-sidebar__link-chevron" />
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__bottom-card">
            <div className="admin-sidebar__bottom-card-title">Good Food</div>
            <div className="admin-sidebar__bottom-card-text">Better Moments</div>
          </div>

          <NavLink
            to="/admin/account"
            className="admin-sidebar__link"
            onClick={onClose}
          >
            <span className="admin-sidebar__link-icon">
              <User size={18} />
            </span>
            <span className="admin-sidebar__link-text">My Account</span>
          </NavLink>

          <button className="admin-sidebar__link" onClick={handleLogout}>
            <span className="admin-sidebar__link-icon">
              <LogOut size={18} />
            </span>
            <span className="admin-sidebar__link-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
