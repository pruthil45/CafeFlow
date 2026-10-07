import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Calendar,
  Download,
  RotateCcw,
  Eye,
  Store,
  User,
  ExternalLink,
  X,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Shield,
  Laptop,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Check,
  PlusCircle,
  Edit3,
  Power,
  Image,
  Bell,
  Utensils,
} from 'lucide-react';
import { ADMIN_AUDIT_LOGS } from '../../../data/adminMockData';
import './AuditLogs.css';

export default function AdminAuditLogs() {
  const navigate = useNavigate();

  // State
  const [logsList] = useState(ADMIN_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [cafeFilter, setCafeFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('Sep 1, 2026 - Sep 30, 2026');

  // Drawer / Selection
  const [selectedLog, setSelectedLog] = useState(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [mobileFilterTab, setMobileFilterTab] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Distinct Filter Options
  const usersList = ['Admin', 'Rahul Patel', 'Priya Shah', 'Kunal Mehta', 'Neha Verma'];
  const cafesList = ['Café Aroma', 'Brew & Bites', 'The Daily Grind', 'Café Nova', 'Platform'];
  const actionsList = [
    'Created Café',
    'Changed Menu Price',
    'Added Staff',
    'Owner Account Created',
    'Edited Order',
    'Deactivated Café',
    'Changed Café Logo',
    'Activated Café',
    'Added Menu Item',
    'Notification Sent',
  ];

  // Action Icon Helper
  const getActionIcon = (action, size = 16) => {
    switch (action) {
      case 'Created Café':
        return <Store size={size} />;
      case 'Changed Menu Price':
        return <Edit3 size={size} />;
      case 'Added Staff':
        return <User size={size} />;
      case 'Owner Account Created':
        return <Shield size={size} />;
      case 'Edited Order':
        return <Utensils size={size} />;
      case 'Deactivated Café':
        return <Power size={size} />;
      case 'Changed Café Logo':
        return <Image size={size} />;
      case 'Activated Café':
        return <CheckCircle2 size={size} />;
      case 'Added Menu Item':
        return <PlusCircle size={size} />;
      case 'Notification Sent':
        return <Bell size={size} />;
      default:
        return <FileText size={size} />;
    }
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logsList.filter((log) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        log.user.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.cafe.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term);

      const matchesUser = userFilter === 'all' || log.user === userFilter;
      const matchesCafe = cafeFilter === 'all' || log.cafe === cafeFilter;
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      // Mobile filter chip quick filter
      let matchesChip = true;
      if (mobileFilterTab === 'users') {
        matchesChip = log.role !== 'Admin';
      } else if (mobileFilterTab === 'cafes') {
        matchesChip = log.cafe !== 'Platform';
      } else if (mobileFilterTab === 'actions') {
        matchesChip = log.action.includes('Café') || log.action.includes('Menu');
      }

      return matchesSearch && matchesUser && matchesCafe && matchesAction && matchesStatus && matchesChip;
    });
  }, [logsList, searchTerm, userFilter, cafeFilter, actionFilter, statusFilter, mobileFilterTab]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setUserFilter('all');
    setCafeFilter('all');
    setActionFilter('all');
    setStatusFilter('all');
    setMobileFilterTab('all');
    triggerToast('All filters reset.');
  };

  // Export Logs Simulation
  const handleExportLogs = () => {
    triggerToast('Preparing Audit Log Export (CSV / PDF)...');
    setTimeout(() => {
      triggerToast('Audit logs exported successfully! Check your downloads.');
    }, 1200);
  };

  // Select Log (Desktop & Mobile)
  const handleSelectLog = (log) => {
    setSelectedLog(log);
    setMobileDetailOpen(true);
  };

  return (
    <div className="admin-page admin-audit-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header (Matched to Image 1) */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Audit Logs</h1>
          <p className="admin-page-subtitle">
            Track all important activities and changes across the platform.
          </p>
        </div>

        <div className="admin-audit-header-right">
          {/* Date Range Selector */}
          <button className="admin-topbar__date-btn" id="audit-date-picker">
            <Calendar size={14} />
            {dateRange}
          </button>

          {/* Export Logs Button (Solid Reddish/Brown) */}
          <button
            className="admin-btn-primary admin-audit-export-btn"
            onClick={handleExportLogs}
            id="btn-export-audit"
          >
            <Download size={16} />
            Export Logs
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Matched to Image 1) */}
      <div className="admin-filter-bar admin-audit-filter-bar">
        {/* Search */}
        <div className="admin-search-wrap admin-audit-search">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search logs (user, action, café, details...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="audit-search-input"
          />
        </div>

        {/* Filter Dropdowns Group */}
        <div className="admin-filters-group">
          {/* User Filter */}
          <select
            className="admin-filter-select"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            id="filter-audit-user"
          >
            <option value="all">All Users</option>
            {usersList.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Café Filter */}
          <select
            className="admin-filter-select"
            value={cafeFilter}
            onChange={(e) => setCafeFilter(e.target.value)}
            id="filter-audit-cafe"
          >
            <option value="all">All Cafés</option>
            {cafesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            className="admin-filter-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            id="filter-audit-action"
          >
            <option value="all">All Actions</option>
            {actionsList.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="filter-audit-status"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Reset Button */}
          <button
            className="admin-btn-outline admin-audit-reset-btn"
            onClick={handleResetFilters}
            id="btn-reset-audit"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Mobile Filter Chips Row */}
      <div className="admin-audit-mobile-chips">
        <button
          className={`admin-audit-chip ${mobileFilterTab === 'all' ? 'admin-audit-chip--active' : ''}`}
          onClick={() => setMobileFilterTab('all')}
        >
          All
        </button>
        <button
          className={`admin-audit-chip ${mobileFilterTab === 'users' ? 'admin-audit-chip--active' : ''}`}
          onClick={() => setMobileFilterTab('users')}
        >
          Users
        </button>
        <button
          className={`admin-audit-chip ${mobileFilterTab === 'cafes' ? 'admin-audit-chip--active' : ''}`}
          onClick={() => setMobileFilterTab('cafes')}
        >
          Cafés
        </button>
        <button
          className={`admin-audit-chip ${mobileFilterTab === 'actions' ? 'admin-audit-chip--active' : ''}`}
          onClick={() => setMobileFilterTab('actions')}
        >
          Actions
        </button>
      </div>

      {/* Split Layout: Table on Left + Details Drawer on Right */}
      <div className={`admin-split-layout ${selectedLog ? 'admin-split-layout--drawer-open' : ''}`}>
        <div className="admin-split-layout__main">
          {/* Desktop Table View */}
          <div className="admin-table-container admin-table-desktop">
            <table className="admin-table admin-audit-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Date & Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Café</th>
                  <th>Status</th>
                  <th style={{ width: 50, textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-table-empty">
                      No audit logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isSelected = selectedLog?.id === log.id;
                    return (
                      <tr
                        key={log.id}
                        className={isSelected ? 'admin-row--selected' : ''}
                        onClick={() => handleSelectLog(log)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="admin-table-index">{log.index}</td>
                        <td>
                          <div className="admin-audit-datetime">
                            <span className="admin-audit-date">{log.date}</span>
                            <span className="admin-audit-time">{log.time}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-entity-cell">
                            <div className="admin-avatar admin-audit-user-avatar">
                              {log.user.charAt(0)}
                            </div>
                            <span className="admin-text-bold">{log.user}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`admin-audit-role-pill admin-audit-role-pill--${log.role.toLowerCase()}`}
                          >
                            {log.role}
                          </span>
                        </td>
                        <td>
                          <div className="admin-audit-action-cell">
                            <div className="admin-audit-action-icon-box">
                              {getActionIcon(log.action, 15)}
                            </div>
                            <span>{log.action}</span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-audit-cafe-cell">
                            <Store size={14} className="admin-audit-cafe-icon" />
                            <span>{log.cafe}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`admin-status-pill admin-status-pill--${log.status === 'Success' ? 'active' : 'inactive'}`}
                          >
                            <span className="admin-status-dot" />
                            {log.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="admin-action-btn admin-audit-view-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectLog(log);
                            }}
                            title="View log details"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List View */}
          <div className="admin-cards-mobile admin-audit-mobile-cards">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="admin-card-item admin-audit-mobile-card"
                onClick={() => handleSelectLog(log)}
              >
                <div className="admin-audit-mobile-card__top">
                  <div className="admin-audit-action-cell">
                    <div className="admin-audit-action-icon-box">
                      {getActionIcon(log.action, 16)}
                    </div>
                    <div>
                      <div className="admin-entity-name">{log.action}</div>
                      <div className="admin-entity-sub">
                        {log.cafe} • By {log.user}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`admin-status-pill admin-status-pill--${log.status === 'Success' ? 'active' : 'inactive'}`}
                  >
                    {log.status}
                  </span>
                </div>

                <div className="admin-audit-mobile-card__footer">
                  <span className="admin-audit-time">
                    {log.date} at {log.time}
                  </span>
                  <ChevronRight size={15} className="admin-audit-mobile-chevron" />
                </div>
              </div>
            ))}
          </div>

          {/* Table Pagination */}
          <div className="admin-pagination">
            <span className="admin-pagination__info">
              Showing 1–{filteredLogs.length} of {logsList.length} logs
            </span>
            <div className="admin-pagination__controls">
              <button className="admin-pagination__btn" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="admin-pagination__btn admin-pagination__btn--active">
                1
              </button>
              <button className="admin-pagination__btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Log Details Drawer (Matched to Image 1) */}
        {selectedLog && (
          <div className="admin-detail-drawer admin-audit-drawer">
            {/* Header */}
            <div className="admin-detail-drawer__header">
              <h3 className="admin-drawer-title">Log Details</h3>
              <button
                className="admin-notif-close-btn"
                onClick={() => setSelectedLog(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="admin-drawer-body">
              {/* Action Banner */}
              <div className="admin-audit-banner">
                <div className="admin-audit-banner__icon">
                  {getActionIcon(selectedLog.action, 22)}
                </div>
                <div>
                  <h4 className="admin-audit-banner__title">
                    {selectedLog.action}
                  </h4>
                  <p className="admin-audit-banner__desc">
                    {selectedLog.details}
                  </p>
                </div>
              </div>

              {/* Key-Value Details List */}
              <div className="admin-audit-detail-list">
                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <Calendar size={15} /> Date & Time
                  </span>
                  <span className="admin-audit-detail-val">
                    {selectedLog.date}, {selectedLog.time}
                  </span>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <User size={15} /> Performed By
                  </span>
                  <div className="admin-audit-performed-by">
                    <div className="admin-avatar admin-audit-user-avatar--small">
                      {selectedLog.user.charAt(0)}
                    </div>
                    <div>
                      <div className="admin-text-bold">{selectedLog.user}</div>
                      <div className="admin-text-muted">
                        {selectedLog.userRoleTitle || selectedLog.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <Shield size={15} /> Action
                  </span>
                  <span className="admin-audit-detail-val">
                    {selectedLog.action}
                  </span>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <Store size={15} /> Café
                  </span>
                  <span className="admin-audit-detail-val admin-audit-cafe-pill">
                    <Store size={13} /> {selectedLog.cafe}
                  </span>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <CheckCircle2 size={15} /> Status
                  </span>
                  <span
                    className={`admin-status-pill admin-status-pill--${selectedLog.status === 'Success' ? 'active' : 'inactive'}`}
                  >
                    <span className="admin-status-dot" />
                    {selectedLog.status === 'Success' ? 'Successful' : 'Failed'}
                  </span>
                </div>

                <div className="admin-audit-detail-row admin-audit-detail-row--stacked">
                  <span className="admin-audit-detail-label">
                    <FileText size={15} /> Description
                  </span>
                  <p className="admin-audit-detail-desc-box">
                    {selectedLog.description}
                  </p>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <Globe size={15} /> IP Address
                  </span>
                  <span className="admin-audit-detail-val font-mono">
                    {selectedLog.ip}
                  </span>
                </div>

                <div className="admin-audit-detail-row">
                  <span className="admin-audit-detail-label">
                    <Laptop size={15} /> User Agent
                  </span>
                  <span className="admin-audit-detail-val">
                    {selectedLog.userAgent}
                  </span>
                </div>

                <div className="admin-audit-detail-row admin-audit-detail-row--stacked">
                  <span className="admin-audit-detail-label">
                    <FileText size={15} /> Additional Info
                  </span>
                  <div className="admin-audit-additional-info">
                    <div>
                      <strong>Location:</strong> {selectedLog.location}
                    </div>
                    <div>
                      <strong>Owner:</strong> {selectedLog.owner}
                    </div>
                    <div>
                      <strong>Initial Plan:</strong> {selectedLog.plan}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="admin-drawer-footer">
              {selectedLog.cafeId && selectedLog.cafeId !== 'PLATFORM' && (
                <button
                  className="admin-btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => navigate('/admin/cafes')}
                >
                  <ExternalLink size={15} /> View Café
                </button>
              )}
              <button
                className="admin-btn-primary"
                style={{ flex: 1 }}
                onClick={() => setSelectedLog(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Mobile Audit Log Details Screen */}
      {mobileDetailOpen && selectedLog && (
        <div className="admin-mobile-notif-screen">
          <div className="admin-mobile-notif-screen__header">
            <button
              className="admin-mobile-back-btn"
              onClick={() => setMobileDetailOpen(false)}
            >
              <ArrowLeft size={18} />
            </button>
            <h3>Log Details</h3>
            <button
              className="admin-mobile-close-btn"
              onClick={() => setMobileDetailOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-mobile-notif-screen__body">
            <div className="admin-audit-banner">
              <div className="admin-audit-banner__icon">
                {getActionIcon(selectedLog.action, 24)}
              </div>
              <div>
                <h4 className="admin-audit-banner__title">
                  {selectedLog.action}
                </h4>
                <p className="admin-audit-banner__desc">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="admin-audit-detail-list">
              <div className="admin-audit-detail-row">
                <span className="admin-audit-detail-label">
                  <Calendar size={15} /> Date & Time
                </span>
                <span className="admin-audit-detail-val">
                  {selectedLog.date}, {selectedLog.time}
                </span>
              </div>

              <div className="admin-audit-detail-row">
                <span className="admin-audit-detail-label">
                  <User size={15} /> Performed By
                </span>
                <span className="admin-audit-detail-val">
                  {selectedLog.user} ({selectedLog.role})
                </span>
              </div>

              <div className="admin-audit-detail-row">
                <span className="admin-audit-detail-label">
                  <Store size={15} /> Café
                </span>
                <span className="admin-audit-detail-val">
                  {selectedLog.cafe}
                </span>
              </div>

              <div className="admin-audit-detail-row">
                <span className="admin-audit-detail-label">
                  <CheckCircle2 size={15} /> Status
                </span>
                <span
                  className={`admin-status-pill admin-status-pill--${selectedLog.status === 'Success' ? 'active' : 'inactive'}`}
                >
                  {selectedLog.status === 'Success' ? 'Successful' : 'Failed'}
                </span>
              </div>

              <div className="admin-audit-detail-row admin-audit-detail-row--stacked">
                <span className="admin-audit-detail-label">
                  <FileText size={15} /> Description
                </span>
                <p className="admin-audit-detail-desc-box">
                  {selectedLog.description}
                </p>
              </div>

              <div className="admin-audit-detail-row admin-audit-detail-row--stacked">
                <span className="admin-audit-detail-label">
                  <FileText size={15} /> Additional Info
                </span>
                <div className="admin-audit-additional-info">
                  <div>
                    <strong>Location:</strong> {selectedLog.location}
                  </div>
                  <div>
                    <strong>Owner:</strong> {selectedLog.owner}
                  </div>
                  <div>
                    <strong>Plan:</strong> {selectedLog.plan}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              {selectedLog.cafeId && selectedLog.cafeId !== 'PLATFORM' && (
                <button
                  className="admin-btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => navigate('/admin/cafes')}
                >
                  <ExternalLink size={16} /> View Café
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
