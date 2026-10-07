import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export default function AdminTopBar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('cafeflow_admin_auth');
    navigate('/login');
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="admin-topbar">
      {/* Mobile menu trigger */}
      <button className="admin-topbar__mobile-trigger" onClick={onMenuToggle} aria-label="Open menu">
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="admin-topbar__search">
        <Search size={16} className="admin-topbar__search-icon" />
        <input
          type="text"
          className="admin-topbar__search-input"
          placeholder="Search cafés, owners, orders, customers..."
          id="admin-global-search"
        />
      </div>

      {/* Right side */}
      <div className="admin-topbar__right">
        {/* Date */}
        <button className="admin-topbar__date-btn" id="admin-date-picker">
          <Calendar size={15} />
          {dateStr}
        </button>

        {/* Notifications */}
        <button
          className="admin-topbar__notification-btn"
          id="admin-notifications-btn"
          aria-label="Notifications"
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell size={18} />
          <span className="admin-topbar__notification-badge">12</span>
        </button>

        {/* Profile */}
        <div className="admin-topbar__profile" ref={profileRef} onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <div className="admin-topbar__profile-avatar">A</div>
          <div className="admin-topbar__profile-info">
            <span className="admin-topbar__profile-name">Admin</span>
            <span className="admin-topbar__profile-role">Super Administrator</span>
          </div>
          <ChevronDown size={14} className="admin-topbar__profile-chevron" />

          {/* Dropdown */}
          {showProfileMenu && (
            <div className="admin-topbar__profile-dropdown">
              <button className="admin-topbar__dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/admin/account'); }}>
                <User size={16} />
                My Account
              </button>
              <button className="admin-topbar__dropdown-item" onClick={() => { setShowProfileMenu(false); navigate('/admin/settings'); }}>
                <Settings size={16} />
                Settings
              </button>
              <div className="admin-topbar__dropdown-divider" />
              <button className="admin-topbar__dropdown-item admin-topbar__dropdown-item--danger" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
