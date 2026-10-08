import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import './Admin.css';

/**
 * Admin Layout — wraps all admin pages with sidebar + topbar.
 * Checks for existing admin auth state on mount.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Seed demo admin session if missing so direct URLs and page refreshes work smoothly
  useEffect(() => {
    const auth = sessionStorage.getItem('cafeflow_admin_auth');
    if (!auth) {
      sessionStorage.setItem(
        'cafeflow_admin_auth',
        JSON.stringify({
          authenticated: true,
          role: 'admin',
          name: 'Super Admin',
          phone: '+91 98765 43210',
          email: 'admin@cafeflow.in',
        })
      );
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="admin-layout__main">
        <AdminTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
