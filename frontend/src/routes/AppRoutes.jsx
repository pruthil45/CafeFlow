import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home'
import LoginSignup from '../pages/LoginSignup/LoginSignup'
import CustomerLearnMore from '../pages/CustomerLearnMore/CustomerLearnMore'
import OwnerLearnMore from '../pages/OwnerLearnMore/OwnerLearnMore'
import StaffLearnMore from '../pages/StaffLearnMore/StaffLearnMore'
import Contact from '../pages/Contact/Contact'
import Pricing from '../pages/Pricing/Pricing'

// Admin Modules
import AdminLayout from '../pages/Admin/AdminLayout'
import AdminDashboard from '../pages/Admin/Dashboard/AdminDashboard'
import AdminCafes from '../pages/Admin/Cafes/AdminCafes'
import CreateCafeWizard from '../pages/Admin/Cafes/CreateCafeWizard/CreateCafeWizard'
import AdminOwners from '../pages/Admin/Owners/AdminOwners'
import AdminCustomers from '../pages/Admin/Customers/AdminCustomers'
import AdminPlatformAnalytics from '../pages/Admin/PlatformAnalytics/AdminPlatformAnalytics'
import AdminCafeAnalytics from '../pages/Admin/CafeAnalytics/AdminCafeAnalytics'
import AdminStaffOverview from '../pages/Admin/StaffOverview/AdminStaffOverview'
import AdminNotifications from '../pages/Admin/Notifications/Notifications'
import AdminAuditLogs from '../pages/Admin/AuditLogs/AuditLogs'
import AdminSettings from '../pages/Admin/Settings/Settings'

// Owner Portal Modules
import OwnerLayout from '../pages/Owner/OwnerLayout'
import OwnerDashboard from '../pages/Owner/Dashboard/OwnerDashboard'
import OwnerPlaceholderView from '../pages/Owner/modules/OwnerPlaceholderView'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/for-customers" element={<CustomerLearnMore />} />
      <Route path="/for-businesses/owners" element={<OwnerLearnMore />} />
      <Route path="/for-businesses/staff" element={<StaffLearnMore />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Admin Login redirects to common login */}
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      {/* Admin Modules (Protected via AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="cafes" element={<AdminCafes />} />
        <Route path="cafes/create" element={<CreateCafeWizard />} />
        <Route path="owners" element={<AdminOwners />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="platform-analytics" element={<AdminPlatformAnalytics />} />
        <Route path="cafe-analytics" element={<AdminCafeAnalytics />} />
        <Route path="staff-overview" element={<AdminStaffOverview />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="settings" element={<AdminSettings />} />
        {/* Placeholder fallbacks to Dashboard */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Owner Login redirects to common login */}
      <Route path="/owner/login" element={<Navigate to="/login" replace />} />

      {/* Owner Portal Modules (OwnerLayout) */}
      <Route path="/owner" element={<OwnerLayout />}>
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="orders" element={<OwnerPlaceholderView title="Orders Management" description="Real-time order queue, processing status, and table-assigned orders." />} />
        <Route path="kitchen" element={<OwnerPlaceholderView title="Kitchen Display System (KDS)" description="Live order tickets, preparation timers, and fulfillment controls for kitchen chefs." />} />
        <Route path="menu" element={<OwnerPlaceholderView title="Menu Management" description="Manage dishes, drinks, categories, prices, variants, add-ons, and stock availability." />} />
        <Route path="tables" element={<OwnerPlaceholderView title="Tables & QR Codes" description="Floor map, table occupancy, dynamic QR ordering codes, and party seating." />} />
        <Route path="customers" element={<OwnerPlaceholderView title="Customer Profiles" description="Customer directory, contact numbers, order frequency, and visit timelines." />} />
        <Route path="loyalty" element={<OwnerPlaceholderView title="Loyalty & Rewards" description="Point multipliers, stamp cards, redeemable rewards, and customer tiers." />} />
        <Route path="promotions" element={<OwnerPlaceholderView title="Promotions & Offers" description="Discount codes, festive combos, happy hour deals, and marketing campaigns." />} />
        <Route path="reports" element={<OwnerPlaceholderView title="Business Reports" description="Exportable sales summaries, tax filings, inventory consumption, and staff logs." />} />
        <Route path="analytics" element={<OwnerPlaceholderView title="Café Analytics" description="Deep dive revenue analytics, customer lifetime value, and peak hour trends." />} />
        <Route path="settings" element={<OwnerPlaceholderView title="Café Settings" description="Café operating hours, printer configuration, tax rates, and staff permissions." />} />
        <Route path="my-cafe" element={<OwnerPlaceholderView title="My Café Overview" description="Public café profile, bio, address, social links, and cover branding." />} />
        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/owner/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
