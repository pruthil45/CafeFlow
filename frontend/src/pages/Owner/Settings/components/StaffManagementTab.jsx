import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  Shield,
  Utensils,
  Edit3,
  Receipt,
  Clock,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react'
import { INITIAL_STAFF_MEMBERS } from '../data/settingsMockData'

export default function StaffManagementTab({ onShowToast }) {
  const navigate = useNavigate()

  // Staff dataset with LocalStorage persistence
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('cafeflow_staff_members')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.map((s) =>
          s.id === 'staff-1' && s.name === 'Rahul Mehta'
            ? { ...s, name: 'Aarav Sharma', initials: 'AS', email: 'aarav.sharma@example.com' }
            : s
        )
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_STAFF_MEMBERS
  })

  // Selected staff for details drawer (null by default; only opens when clicked)
  const [selectedStaffId, setSelectedStaffId] = useState(null)

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null) // null = creating, object = editing

  // Details panel tab
  const [detailsTab, setDetailsTab] = useState('overview') // 'overview', 'activity', 'account'

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles') // 'All Roles', 'Waiter', 'Cashier', 'Staff'

  // Menu popover state
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  // Deactivate confirmation modal
  const [staffToDeactivate, setStaffToDeactivate] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    role: 'Staff',
    status: 'Active',
  })
  const [formErrors, setFormErrors] = useState({})

  // Persist staffList
  useEffect(() => {
    localStorage.setItem('cafeflow_staff_members', JSON.stringify(staffList))
  }, [staffList])

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // KPI counts dynamically calculated
  const summaryCounts = useMemo(() => {
    const total = staffList.length
    const active = staffList.filter((s) => s.status === 'Active').length
    const inactive = staffList.filter((s) => s.status === 'Inactive').length
    return { total, active, inactive }
  }, [staffList])

  // Filtered staff records
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      // Role filter
      if (roleFilter !== 'All Roles' && s.role !== roleFilter) {
        return false
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchName = s.name.toLowerCase().includes(query)
        const matchMobile = s.mobile.toLowerCase().includes(query)
        const matchEmail = s.email?.toLowerCase().includes(query)
        if (!matchName && !matchMobile && !matchEmail) return false
      }
      return true
    })
  }, [staffList, roleFilter, searchTerm])

  // Active selected staff object
  const selectedStaff = useMemo(() => {
    return staffList.find((s) => s.id === selectedStaffId) || null
  }, [staffList, selectedStaffId])

  // Handlers for Add / Edit
  const handleOpenAddDrawer = () => {
    setEditingStaff(null)
    setFormData({
      name: '',
      mobile: '',
      email: '',
      role: 'Staff',
      status: 'Active',
    })
    setFormErrors({})
    setIsDrawerOpen(true)
  }

  const handleOpenEditDrawer = (staff) => {
    setEditingStaff(staff)
    // Extract 10 digits without +91 prefix for the input
    const cleanMobile = staff.mobile.replace('+91', '').trim()
    setFormData({
      name: staff.name,
      mobile: cleanMobile,
      email: staff.email || '',
      role: staff.role,
      status: staff.status,
    })
    setFormErrors({})
    setIsDrawerOpen(true)
    setOpenMenuId(null)
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    }

    const cleanNumber = formData.mobile.replace(/\D/g, '')
    if (!cleanNumber) {
      errors.mobile = 'Mobile number is required'
    } else if (cleanNumber.length !== 10) {
      errors.mobile = 'Enter a valid 10-digit mobile number'
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Enter a valid email address'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save handler
  const handleSaveStaff = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const formattedMobile = `+91 ${formData.mobile.replace(/\D/g, '').replace(/(\d{5})(\d{5})/, '$1 $2')}`
    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    if (editingStaff) {
      // Update existing
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                name: formData.name.trim(),
                mobile: formattedMobile,
                email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: formData.role,
                status: formData.status,
                initials,
              }
            : s
        )
      )
      if (onShowToast) onShowToast(`Staff member "${formData.name}" updated successfully!`)
    } else {
      // Create new
      const now = new Date()
      const joinFormatted = `${now.getDate().toString().padStart(2, '0')} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`
      const newStaff = {
        id: `staff-${Date.now()}`,
        name: formData.name.trim(),
        mobile: formattedMobile,
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        role: formData.role,
        status: formData.status,
        joined: joinFormatted,
        avatar: null,
        initials,
        activitySummary: {
          ordersHandled: 0,
          ordersEdited: 0,
          billsGenerated: 0,
          lastActive: 'Just added',
        },
        roleDescription:
          formData.role === 'Waiter'
            ? 'Can manage orders, update status and handle tables.'
            : formData.role === 'Cashier'
            ? 'Can process bills, apply discounts and manage checkout payments.'
            : 'General café floor assistance and customer support.',
        recentActivities: [{ id: `act-${Date.now()}`, text: 'Account created', time: 'Just now' }],
      }

      setStaffList((prev) => [newStaff, ...prev])
      setSelectedStaffId(newStaff.id)
      if (onShowToast) onShowToast(`Staff member "${formData.name}" added successfully!`)
    }

    setIsDrawerOpen(false)
  }

  // Toggle status / Deactivate
  const handleToggleStatus = (staff) => {
    const nextStatus = staff.status === 'Active' ? 'Inactive' : 'Active'
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: nextStatus } : s))
    )
    setStaffToDeactivate(null)
    setOpenMenuId(null)
    if (onShowToast) {
      onShowToast(
        `Staff member "${staff.name}" is now ${nextStatus}.`,
        nextStatus === 'Active' ? 'success' : 'info'
      )
    }
  }

  // Role Badge Styling
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Waiter':
        return 'owner-role-badge--waiter'
      case 'Cashier':
        return 'owner-role-badge--cashier'
      case 'Staff':
      default:
        return 'owner-role-badge--staff'
    }
  }

  return (
    <div className="owner-staff-page">
      {/* Header with Breadcrumb & Add Button */}
      <div className="owner-settings-header-block">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
              <button
                type="button"
                className="owner-breadcrumb-link"
                onClick={() => navigate('/owner/settings')}
              >
                Settings
              </button>
              <span className="owner-breadcrumb-sep">/</span>
              <span className="owner-breadcrumb-current">Staff</span>
            </nav>

            <h1 className="owner-settings-main-title">Staff</h1>
            <p className="owner-settings-main-subtitle">
              Manage your café staff members. Add, edit or deactivate staff accounts.
            </p>
          </div>

          <button
            type="button"
            className="owner-btn-primary"
            onClick={handleOpenAddDrawer}
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      {/* 3 Summary KPI Cards (matching Screenshot 3) */}
      <div className="owner-staff-kpis-grid">
        {/* Total Staff */}
        <div className="owner-staff-kpi-card">
          <div className="owner-staff-kpi-icon-box owner-staff-kpi-icon--total">
            <Users size={20} />
          </div>
          <div>
            <div className="owner-staff-kpi-value">{summaryCounts.total}</div>
            <div className="owner-staff-kpi-label">Total Staff</div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="owner-staff-kpi-card">
          <div className="owner-staff-kpi-icon-box owner-staff-kpi-icon--active">
            <UserCheck size={20} />
          </div>
          <div>
            <div className="owner-staff-kpi-value">{summaryCounts.active}</div>
            <div className="owner-staff-kpi-label">Active Staff</div>
          </div>
        </div>

        {/* Inactive Staff */}
        <div className="owner-staff-kpi-card">
          <div className="owner-staff-kpi-icon-box owner-staff-kpi-icon--inactive">
            <UserX size={20} />
          </div>
          <div>
            <div className="owner-staff-kpi-value">{summaryCounts.inactive}</div>
            <div className="owner-staff-kpi-label">Inactive Staff</div>
          </div>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="owner-staff-toolbar">
        <div className="owner-staff-search-wrap">
          <Search size={15} className="owner-staff-search-icon" />
          <input
            type="text"
            className="owner-staff-search-input"
            placeholder="Search staff by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="owner-staff-select-wrap">
          <select
            className="owner-staff-role-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by staff role"
          >
            <option value="All Roles">All Roles</option>
            <option value="Waiter">Waiter</option>
            <option value="Cashier">Cashier</option>
            <option value="Staff">Staff</option>
          </select>
          <ChevronDown size={14} className="owner-staff-select-chevron" />
        </div>
      </div>

      {/* Staff Table Card (Desktop) */}
      <div className="owner-staff-table-card">
        <div className="owner-staff-table-wrap">
          <table className="owner-staff-table">
            <thead>
              <tr>
                <th>Staff</th>
                <th>Mobile Number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: 'center', width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px 16px', color: '#8c7b6f' }}>
                    No staff members match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const isSelected = selectedStaffId === staff.id

                  return (
                    <tr
                      key={staff.id}
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedStaffId(staff.id)}
                    >
                      {/* Avatar & Name */}
                      <td>
                        <div className="owner-staff-profile-cell">
                          {staff.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={staff.name}
                              className="owner-staff-avatar"
                            />
                          ) : (
                            <div className="owner-staff-avatar-initials">
                              {staff.initials}
                            </div>
                          )}
                          <span className="owner-staff-name">{staff.name}</span>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td style={{ color: '#4a3f35', fontWeight: 500 }}>{staff.mobile}</td>

                      {/* Role */}
                      <td>
                        <span className={`owner-role-badge ${getRoleBadgeClass(staff.role)}`}>
                          {staff.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`owner-status-pill ${
                            staff.status === 'Active' ? 'active' : 'inactive'
                          }`}
                        >
                          <span className="owner-status-dot" />
                          {staff.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td style={{ color: '#7a6a5e', fontSize: '13px' }}>{staff.joined}</td>

                      {/* Actions Menu */}
                      <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="owner-staff-more-btn"
                            onClick={() =>
                              setOpenMenuId(openMenuId === staff.id ? null : staff.id)
                            }
                            aria-label={`More actions for ${staff.name}`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenuId === staff.id && (
                            <div className="owner-staff-dropdown-menu" ref={menuRef}>
                              <button
                                type="button"
                                className="owner-staff-dropdown-item"
                                onClick={() => handleOpenEditDrawer(staff)}
                              >
                                <Edit2 size={13} /> Edit Staff
                              </button>
                              <button
                                type="button"
                                className="owner-staff-dropdown-item"
                                onClick={() => handleToggleStatus(staff)}
                              >
                                {staff.status === 'Active' ? (
                                  <>
                                    <UserX size={13} color="#dc2626" /> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck size={13} color="#16a34a" /> Activate
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Staff Cards List (screens <= 768px) */}
        <div className="owner-staff-mobile-list">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className={`owner-staff-mobile-card ${selectedStaffId === staff.id ? 'selected' : ''}`}
              onClick={() => setSelectedStaffId(staff.id)}
            >
              <div className="owner-staff-mobile-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {staff.avatar ? (
                    <img src={staff.avatar} alt={staff.name} className="owner-staff-avatar" />
                  ) : (
                    <div className="owner-staff-avatar-initials">{staff.initials}</div>
                  )}
                  <div>
                    <div className="owner-staff-name">{staff.name}</div>
                    <div style={{ fontSize: '12px', color: '#7a6a5e', marginTop: 2 }}>
                      {staff.mobile}
                    </div>
                  </div>
                </div>

                <span
                  className={`owner-status-pill ${
                    staff.status === 'Active' ? 'active' : 'inactive'
                  }`}
                >
                  <span className="owner-status-dot" />
                  {staff.status}
                </span>
              </div>

              <div className="owner-staff-mobile-card-meta">
                <span className={`owner-role-badge ${getRoleBadgeClass(staff.role)}`}>
                  {staff.role}
                </span>
                <span style={{ fontSize: '12px', color: '#8c7b6f' }}>
                  Joined: {staff.joined}
                </span>
              </div>

              <div className="owner-staff-mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="owner-btn-secondary"
                  style={{ flex: 1, padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleOpenEditDrawer(staff)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  className={staff.status === 'Active' ? 'owner-btn-outline-danger' : 'owner-btn-secondary'}
                  style={{ flex: 1, padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleToggleStatus(staff)}
                >
                  {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in Staff Details Preview Drawer */}
      {selectedStaff && (
        <>
          <div
            className="owner-drawer-overlay open"
            onClick={() => setSelectedStaffId(null)}
            aria-hidden="true"
          />

          <aside className="owner-drawer-panel owner-staff-preview-drawer open" aria-label="Staff Details Preview">
            <div className="owner-staff-details-panel">
              {/* Mobile Back Header Bar */}
              <div className="owner-staff-drawer-mobile-bar">
                <button
                  type="button"
                  className="owner-customer-mobile-back-btn"
                  onClick={() => setSelectedStaffId(null)}
                >
                  ← Back to Staff
                </button>
              </div>

              {/* Header */}
              <div className="owner-staff-details-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {selectedStaff.avatar ? (
                <img
                  src={selectedStaff.avatar}
                  alt={selectedStaff.name}
                  className="owner-staff-details-avatar"
                />
              ) : (
                <div className="owner-staff-details-initials">
                  {selectedStaff.initials}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 className="owner-staff-details-name">{selectedStaff.name}</h3>
                  <span className={`owner-role-badge ${getRoleBadgeClass(selectedStaff.role)}`}>
                    {selectedStaff.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="owner-modal-close-btn"
              onClick={() => setSelectedStaffId(null)}
              aria-label="Close details"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="owner-staff-details-tabs">
            <button
              type="button"
              className={`owner-staff-tab-btn ${detailsTab === 'overview' ? 'active' : ''}`}
              onClick={() => setDetailsTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`owner-staff-tab-btn ${detailsTab === 'activity' ? 'active' : ''}`}
              onClick={() => setDetailsTab('activity')}
            >
              Activity
            </button>
            <button
              type="button"
              className={`owner-staff-tab-btn ${detailsTab === 'account' ? 'active' : ''}`}
              onClick={() => setDetailsTab('account')}
            >
              Account
            </button>
          </div>

          {/* Tab 1: Overview */}
          {detailsTab === 'overview' && (
            <div className="owner-staff-overview-content">
              {/* 3 Info Columns Grid */}
              <div className="owner-staff-info-columns-grid">
                {/* Contact Info */}
                <div className="owner-staff-info-col">
                  <div className="owner-staff-info-col-title">Contact Information</div>
                  <div className="owner-staff-info-item">
                    <Phone size={14} className="owner-staff-info-icon" />
                    <span>{selectedStaff.mobile}</span>
                  </div>
                  <div className="owner-staff-info-item">
                    <Mail size={14} className="owner-staff-info-icon" />
                    <span>{selectedStaff.email}</span>
                  </div>
                </div>

                {/* Account Status */}
                <div className="owner-staff-info-col">
                  <div className="owner-staff-info-col-title">Account Status</div>
                  <div className="owner-staff-info-item">
                    <span
                      className={`owner-status-pill ${
                        selectedStaff.status === 'Active' ? 'active' : 'inactive'
                      }`}
                    >
                      <span className="owner-status-dot" />
                      {selectedStaff.status}
                    </span>
                  </div>
                  <div className="owner-staff-info-item" style={{ marginTop: 6 }}>
                    <Calendar size={14} className="owner-staff-info-icon" />
                    <span>Joined on {selectedStaff.joined}</span>
                  </div>
                </div>

                {/* Role & Permissions */}
                <div className="owner-staff-info-col">
                  <div className="owner-staff-info-col-title">Role</div>
                  <div className="owner-staff-info-item" style={{ fontWeight: 700, color: '#2a1911' }}>
                    <Shield size={14} className="owner-staff-info-icon" />
                    <span>{selectedStaff.role}</span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#7a6a5e', lineHeight: 1.4 }}>
                    {selectedStaff.roleDescription}
                  </p>
                </div>
              </div>

              {/* Activity Summary Boxes (matching Screenshot 3) */}
              <div className="owner-staff-activity-summary-section">
                <div className="owner-staff-activity-heading">Activity Summary</div>
                <div className="owner-staff-activity-grid">
                  {/* Orders Handled */}
                  <div className="owner-staff-act-box">
                    <div className="owner-staff-act-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                      <Utensils size={18} />
                    </div>
                    <div>
                      <div className="owner-staff-act-val">
                        {selectedStaff.activitySummary?.ordersHandled || 248}
                      </div>
                      <div className="owner-staff-act-lbl">Orders Handled</div>
                    </div>
                  </div>

                  {/* Orders Edited */}
                  <div className="owner-staff-act-box">
                    <div className="owner-staff-act-icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <div className="owner-staff-act-val">
                        {selectedStaff.activitySummary?.ordersEdited || 32}
                      </div>
                      <div className="owner-staff-act-lbl">Orders Edited</div>
                    </div>
                  </div>

                  {/* Bills Generated */}
                  <div className="owner-staff-act-box">
                    <div className="owner-staff-act-icon-box" style={{ background: '#ecfdf5', color: '#16a34a' }}>
                      <Receipt size={18} />
                    </div>
                    <div>
                      <div className="owner-staff-act-val">
                        {selectedStaff.activitySummary?.billsGenerated || 198}
                      </div>
                      <div className="owner-staff-act-lbl">Bills Generated</div>
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="owner-staff-act-box">
                    <div className="owner-staff-act-icon-box" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="owner-staff-act-val" style={{ fontSize: '13px' }}>
                        {selectedStaff.activitySummary?.lastActive || 'Today, 11:24 AM'}
                      </div>
                      <div className="owner-staff-act-lbl">Last Active</div>
                    </div>
                  </div>

                  {/* Deactivate Action Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="owner-btn-outline-danger"
                      onClick={() => setStaffToDeactivate(selectedStaff)}
                      style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 8 }}
                    >
                      {selectedStaff.status === 'Active' ? 'Deactivate Staff' : 'Activate Staff'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Activity Log */}
          {detailsTab === 'activity' && (
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911', marginBottom: 10 }}>
                Recent Operational Log
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedStaff.recentActivities?.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      background: '#faf8f5',
                      border: '1px solid #ede6dc',
                      borderRadius: 8,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12.5px',
                    }}
                  >
                    <span style={{ color: '#3e2f24', fontWeight: 500 }}>{act.text}</span>
                    <span style={{ color: '#8c7b6f', fontSize: '11.5px' }}>{act.time}</span>
                  </div>
                )) || <div style={{ color: '#8c7b6f' }}>No recorded activities today.</div>}
              </div>
            </div>
          )}

          {/* Tab 3: Account */}
          {detailsTab === 'account' && (
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: '13px', color: '#6d5b4f' }}>
                Account ID: <strong>{selectedStaff.id}</strong> · Created on {selectedStaff.joined}
              </div>
              <button
                type="button"
                className="owner-btn-secondary"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => handleOpenEditDrawer(selectedStaff)}
              >
                <Edit2 size={13} /> Edit Account Details
              </button>
            </div>
          )}
            </div>
          </aside>
        </>
      )}

      {/* ============================================================== */}
      {/* ADD / EDIT STAFF DRAWER (Right Side matching Screenshot 3)     */}
      {/* ============================================================== */}
      {isDrawerOpen && (
        <>
          <div
            className="owner-drawer-overlay open"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          <aside className="owner-drawer-panel open" aria-label={editingStaff ? 'Edit Staff' : 'Add Staff'}>
            {/* Drawer Header */}
            <div className="owner-drawer-header">
              <h2 className="owner-drawer-title">
                {editingStaff ? 'Edit Staff' : 'Add Staff'}
              </h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Form */}
            <form onSubmit={handleSaveStaff} className="owner-drawer-body">
              {/* Full Name */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Full Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`owner-form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && (
                  <span className="owner-input-error-msg">{formErrors.name}</span>
                )}
              </div>

              {/* Mobile Number */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="owner-phone-prefix">+91</div>
                  <input
                    type="tel"
                    className={`owner-form-input ${formErrors.mobile ? 'error' : ''}`}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })
                    }
                  />
                </div>
                {formErrors.mobile && (
                  <span className="owner-input-error-msg">{formErrors.mobile}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="owner-form-group">
                <label className="owner-form-label">Email Address</label>
                <input
                  type="email"
                  className={`owner-form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="Enter email address (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && (
                  <span className="owner-input-error-msg">{formErrors.email}</span>
                )}
              </div>

              {/* Role */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Role <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div className="owner-staff-select-wrap" style={{ width: '100%' }}>
                  <select
                    className="owner-staff-role-select"
                    style={{ width: '100%' }}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Staff">Staff</option>
                  </select>
                  <ChevronDown size={14} className="owner-staff-select-chevron" />
                </div>
              </div>

              {/* Status */}
              <div className="owner-form-group">
                <label className="owner-form-label">Status</label>
                <div className="owner-radio-group">
                  <label className="owner-radio-item">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData({ ...formData, status: 'Active' })}
                    />
                    <span>Active</span>
                  </label>
                  <label className="owner-radio-item">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Inactive'}
                      onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Drawer Buttons */}
              <div className="owner-drawer-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="owner-btn-primary">
                  {editingStaff ? 'Save Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </aside>
        </>
      )}

      {/* Confirmation Modal for Deactivate / Activate */}
      {staffToDeactivate && (
        <div className="owner-modal-overlay" onClick={() => setStaffToDeactivate(null)} role="dialog">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 420, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: 17, fontWeight: 800, color: '#2a1911' }}>
              {staffToDeactivate.status === 'Active' ? 'Deactivate Account?' : 'Activate Account?'}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: '#6d5b4f', lineHeight: 1.5 }}>
              Are you sure you want to {staffToDeactivate.status === 'Active' ? 'deactivate' : 'activate'}{' '}
              <strong>{staffToDeactivate.name}</strong>?{' '}
              {staffToDeactivate.status === 'Active'
                ? 'They will no longer be able to log in or take orders until reactivated.'
                : 'They will be able to take orders and access their staff role.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setStaffToDeactivate(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                style={{
                  background: staffToDeactivate.status === 'Active' ? '#dc2626' : '#16a34a',
                }}
                onClick={() => handleToggleStatus(staffToDeactivate)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
