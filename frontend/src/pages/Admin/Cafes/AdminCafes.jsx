import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Store,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MoreHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit2,
  Trash2,
  Power,
  Users,
  BarChart3,
  Palette,
  Phone,
  Mail,
  Globe,
  MapPin,
  Utensils,
  Clock,
  ArrowRight,
  Check,
  QrCode,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import {
  CAFES,
  OWNERS,
  CAFES_KPI,
  formatINR,
  formatNumber,
  getOwnerById,
} from '../../../data/adminMockData';
import '../Admin.css';

export default function AdminCafes() {
  const navigate = useNavigate();

  // State
  const [cafesList, setCafesList] = useState(CAFES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Drawer & Modals
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [actionMenuId, setActionMenuId] = useState(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [deleteConfirmCafe, setDeleteConfirmCafe] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const actionMenuRef = useRef(null);

  // Close action menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Unique cities from data
  const cities = useMemo(() => {
    const set = new Set(cafesList.map((c) => c.city));
    return Array.from(set);
  }, [cafesList]);

  // Filtered & Sorted Cafés
  const filteredCafes = useMemo(() => {
    return cafesList
      .filter((cafe) => {
        const owner = getOwnerById(cafe.ownerId);
        const matchesSearch =
          cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cafe.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (owner && owner.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
          statusFilter === 'all' || cafe.status === statusFilter;

        const matchesCity =
          cityFilter === 'all' || cafe.city === cityFilter;

        return matchesSearch && matchesStatus && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdDate || b.createdAt) - new Date(a.createdDate || a.createdAt);
        if (sortBy === 'oldest') return new Date(a.createdDate || a.createdAt) - new Date(b.createdDate || b.createdAt);
        if (sortBy === 'highest_revenue') return b.revenue - a.revenue;
        if (sortBy === 'most_orders') return b.orders - a.orders;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [cafesList, searchTerm, statusFilter, cityFilter, sortBy]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCityFilter('all');
    setSortBy('newest');
  };

  // Status Toggle
  const handleToggleStatus = (cafeId) => {
    setCafesList((prev) =>
      prev.map((c) => {
        if (c.id === cafeId) {
          const nextStatus = c.status === 'active' ? 'inactive' : 'active';
          setToastMessage(
            `Café "${c.name}" marked as ${nextStatus.toUpperCase()}`
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    setActionMenuId(null);
  };

  // Delete Café
  const handleDeleteCafe = () => {
    if (!deleteConfirmCafe) return;
    setCafesList((prev) => prev.filter((c) => c.id !== deleteConfirmCafe.id));
    if (selectedCafe?.id === deleteConfirmCafe.id) {
      setSelectedCafe(null);
    }
    setToastMessage(`Café "${deleteConfirmCafe.name}" deleted successfully.`);
    setDeleteConfirmCafe(null);
  };

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cafés</h1>
          <p className="admin-page-subtitle">
            Manage all cafés on your platform
          </p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={() => setShowCreateWizard(true)}
          id="btn-create-cafe"
        >
          <Plus size={18} />
          Create New Café
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Total Cafés</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--brand">
              <Store size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{CAFES_KPI.totalCafes.value}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CAFES_KPI.totalCafes.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Active Cafés</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--success">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{CAFES_KPI.activeCafes.value}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CAFES_KPI.activeCafes.percent}%
            </span>
            <span className="admin-kpi-card__comparison">of total cafés</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Inactive Cafés</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--danger">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{CAFES_KPI.inactiveCafes.value}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--down">
              ↓ {CAFES_KPI.inactiveCafes.percent}%
            </span>
            <span className="admin-kpi-card__comparison">of total cafés</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">New This Month</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--info">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">{CAFES_KPI.newThisMonth.value}</div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CAFES_KPI.newThisMonth.growth}
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search café name, owner or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-cafes-input"
          />
        </div>

        {/* Desktop Filter Selects */}
        <div className="admin-filters-group">
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="admin-filter-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            className="admin-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort By: Newest</option>
            <option value="oldest">Sort By: Oldest</option>
            <option value="highest_revenue">Highest Revenue</option>
            <option value="most_orders">Most Orders</option>
            <option value="name">Name A-Z</option>
          </select>

          <button className="admin-btn-outline" onClick={handleResetFilters}>
            Reset
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="admin-mobile-filter-btn"
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Main Content Layout with optional Right Drawer */}
      <div className={`admin-split-layout ${selectedCafe ? 'admin-split-layout--drawer-open' : ''}`}>
        <div className="admin-split-layout__main">
          {/* Desktop Table View */}
          <div className="admin-table-container admin-table-desktop">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Café</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Tables</th>
                  <th>Staff</th>
                  <th>Orders (30d)</th>
                  <th>Revenue (30d)</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th style={{ width: 50, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCafes.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="admin-table-empty">
                      No cafés found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCafes.map((cafe, index) => {
                    const owner = getOwnerById(cafe.ownerId);
                    const isSelected = selectedCafe?.id === cafe.id;
                    return (
                      <tr
                        key={cafe.id}
                        className={isSelected ? 'admin-row--selected' : ''}
                        onClick={() => setSelectedCafe(cafe)}
                      >
                        <td className="admin-table-index">{index + 1}</td>
                        <td>
                          <div className="admin-entity-cell">
                            <div
                              className="admin-cafe-badge"
                              style={{ backgroundColor: cafe.color || '#D4A04A' }}
                            >
                              {cafe.name.charAt(0)}
                            </div>
                            <div>
                              <div className="admin-entity-name">{cafe.name}</div>
                              <div className="admin-entity-sub">{cafe.cuisine}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {owner ? (
                            <div>
                              <div className="admin-text-bold">{owner.name}</div>
                              <div className="admin-text-muted">{owner.phone}</div>
                            </div>
                          ) : (
                            <span className="admin-text-muted">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <div className="admin-text-bold">{cafe.city}</div>
                          <div className="admin-text-muted">{cafe.state}</div>
                        </td>
                        <td>{cafe.tables}</td>
                        <td>{cafe.staff}</td>
                        <td>{formatNumber(cafe.orders)}</td>
                        <td className="admin-text-bold">{formatINR(cafe.revenue)}</td>
                        <td>
                          <span
                            className={`admin-status-pill admin-status-pill--${cafe.status}`}
                          >
                            <span className="admin-status-dot" />
                            {cafe.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="admin-text-muted">{cafe.createdAt}</td>
                        <td
                          style={{ textAlign: 'center' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="admin-action-wrap">
                            <button
                              className="admin-action-btn"
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === cafe.id ? null : cafe.id
                                )
                              }
                              aria-label="Actions"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {actionMenuId === cafe.id && (
                              <div
                                className="admin-dropdown-menu"
                                ref={actionMenuRef}
                              >
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    setSelectedCafe(cafe);
                                    setActionMenuId(null);
                                  }}
                                >
                                  <Eye size={15} /> View Café Details
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    navigate(
                                      `/admin/cafe-analytics?cafe=${cafe.id}`
                                    );
                                    setActionMenuId(null);
                                  }}
                                >
                                  <BarChart3 size={15} /> View Analytics
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    navigate(
                                      `/admin/owners?owner=${cafe.ownerId}`
                                    );
                                    setActionMenuId(null);
                                  }}
                                >
                                  <Users size={15} /> View Owner
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    handleToggleStatus(cafe.id);
                                  }}
                                >
                                  <Power size={15} />
                                  {cafe.status === 'active'
                                    ? 'Deactivate Café'
                                    : 'Activate Café'}
                                </button>
                                <div className="admin-dropdown-divider" />
                                <button
                                  className="admin-dropdown-item admin-dropdown-item--danger"
                                  onClick={() => {
                                    setDeleteConfirmCafe(cafe);
                                    setActionMenuId(null);
                                  }}
                                >
                                  <Trash2 size={15} /> Delete Café
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="admin-cards-mobile">
            {filteredCafes.map((cafe) => {
              const owner = getOwnerById(cafe.ownerId);
              return (
                <div
                  key={cafe.id}
                  className="admin-card-item"
                  onClick={() => setSelectedCafe(cafe)}
                >
                  <div className="admin-card-item__top">
                    <div className="admin-entity-cell">
                      <div
                        className="admin-cafe-badge"
                        style={{ backgroundColor: cafe.color || '#D4A04A' }}
                      >
                        {cafe.name.charAt(0)}
                      </div>
                      <div>
                        <div className="admin-entity-name">{cafe.name}</div>
                        <div className="admin-entity-sub">
                          {cafe.location} • {cafe.tables} tables • {cafe.staff} staff
                        </div>
                      </div>
                    </div>
                    <span
                      className={`admin-status-pill admin-status-pill--${cafe.status}`}
                    >
                      {cafe.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="admin-card-item__metrics">
                    <div>
                      <div className="admin-metric-label">Revenue (30d)</div>
                      <div className="admin-metric-value">{formatINR(cafe.revenue)}</div>
                    </div>
                    <div>
                      <div className="admin-metric-label">Orders</div>
                      <div className="admin-metric-value">{formatNumber(cafe.orders)}</div>
                    </div>
                    <div>
                      <div className="admin-metric-label">Owner</div>
                      <div className="admin-metric-value">{owner?.name || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Pagination Footer */}
          <div className="admin-pagination">
            <span className="admin-pagination__info">
              Showing 1–{filteredCafes.length} of {cafesList.length} cafés
            </span>
            <div className="admin-pagination__controls">
              <button className="admin-pagination__btn" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="admin-pagination__btn admin-pagination__btn--active">
                1
              </button>
              <button className="admin-pagination__btn">2</button>
              <button className="admin-pagination__btn">3</button>
              <button className="admin-pagination__btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Panel / Drawer */}
        {selectedCafe && (
          <aside className="admin-detail-drawer">
            <div className="admin-detail-drawer__header">
              <div className="admin-entity-cell">
                <div
                  className="admin-cafe-badge admin-cafe-badge--large"
                  style={{ backgroundColor: selectedCafe.color || '#D4A04A' }}
                >
                  {selectedCafe.name.charAt(0)}
                </div>
                <div>
                  <div className="admin-drawer-title-row">
                    <h2 className="admin-drawer-title">{selectedCafe.name}</h2>
                    <span
                      className={`admin-status-pill admin-status-pill--${selectedCafe.status}`}
                    >
                      {selectedCafe.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="admin-entity-sub">
                    {selectedCafe.cuisine} • {selectedCafe.id}
                  </div>
                </div>
              </div>
              <button
                className="admin-drawer-close"
                onClick={() => setSelectedCafe(null)}
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="admin-drawer-tabs">
              <button
                className={`admin-drawer-tab ${detailTab === 'overview' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDetailTab('overview')}
              >
                Overview
              </button>
              <button
                className={`admin-drawer-tab ${detailTab === 'analytics' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDetailTab('analytics')}
              >
                Analytics
              </button>
              <button
                className={`admin-drawer-tab ${detailTab === 'branding' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDetailTab('branding')}
              >
                Branding
              </button>
              <button
                className={`admin-drawer-tab ${detailTab === 'settings' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDetailTab('settings')}
              >
                Settings
              </button>
            </div>

            {/* Drawer Body */}
            <div className="admin-drawer-body">
              {detailTab === 'overview' && (
                <>
                  {/* Café Information Section */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Café Information
                      </span>
                      <button className="admin-link-btn">
                        <Edit2 size={13} /> Edit
                      </button>
                    </div>
                    <div className="admin-info-list">
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Store size={14} /> Café Name
                        </span>
                        <span className="admin-info-val">{selectedCafe.name}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <MapPin size={14} /> Location
                        </span>
                        <span className="admin-info-val">{selectedCafe.location}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Utensils size={14} /> Cuisine Type
                        </span>
                        <span className="admin-info-val">{selectedCafe.cuisine}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Phone size={14} /> Phone
                        </span>
                        <span className="admin-info-val">{selectedCafe.phone}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Mail size={14} /> Email
                        </span>
                        <span className="admin-info-val">{selectedCafe.email}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Globe size={14} /> Website
                        </span>
                        <a
                          href={selectedCafe.website}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-link-accent"
                        >
                          {selectedCafe.website}
                        </a>
                      </div>
                      <div className="admin-info-desc">
                        {selectedCafe.description}
                      </div>
                    </div>
                  </div>

                  {/* Owner Information Section */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Owner Information
                      </span>
                      <button
                        className="admin-link-btn"
                        onClick={() =>
                          navigate(`/admin/owners?owner=${selectedCafe.ownerId}`)
                        }
                      >
                        View Owner
                      </button>
                    </div>
                    {(() => {
                      const owner = getOwnerById(selectedCafe.ownerId);
                      return owner ? (
                        <div className="admin-owner-card-mini">
                          <div className="admin-owner-avatar">
                            {owner.name.charAt(0)}
                          </div>
                          <div className="admin-owner-details">
                            <div className="admin-owner-name-row">
                              <span className="admin-text-bold">{owner.name}</span>
                              <span className="admin-status-pill admin-status-pill--active">
                                Active
                              </span>
                            </div>
                            <div className="admin-text-muted">{owner.phone}</div>
                            <div className="admin-text-muted">{owner.email}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-text-muted">No owner assigned</div>
                      );
                    })()}
                  </div>

                  {/* Café Statistics (Last 30 Days) */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Café Statistics (Last 30 Days)
                      </span>
                    </div>
                    <div className="admin-stat-tiles-grid">
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {formatNumber(selectedCafe.orders)}
                        </span>
                        <span className="admin-stat-tile__label">Total Orders</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {formatINR(selectedCafe.revenue)}
                        </span>
                        <span className="admin-stat-tile__label">Revenue</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {selectedCafe.tables}
                        </span>
                        <span className="admin-stat-tile__label">Tables</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {selectedCafe.staff}
                        </span>
                        <span className="admin-stat-tile__label">Staff</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Recent Activity
                      </span>
                      <button className="admin-link-btn">View All</button>
                    </div>
                    <div className="admin-activity-timeline">
                      <div className="admin-activity-item">
                        <div className="admin-activity-dot" />
                        <div>
                          <div className="admin-activity-title">Menu updated</div>
                          <div className="admin-activity-time">2 hours ago</div>
                        </div>
                      </div>
                      <div className="admin-activity-item">
                        <div className="admin-activity-dot" />
                        <div>
                          <div className="admin-activity-title">
                            Staff member added - Priya Sharma
                          </div>
                          <div className="admin-activity-time">5 hours ago</div>
                        </div>
                      </div>
                      <div className="admin-activity-item">
                        <div className="admin-activity-dot" />
                        <div>
                          <div className="admin-activity-title">
                            Café branding updated
                          </div>
                          <div className="admin-activity-time">1 day ago</div>
                        </div>
                      </div>
                      <div className="admin-activity-item">
                        <div className="admin-activity-dot" />
                        <div>
                          <div className="admin-activity-title">Owner login</div>
                          <div className="admin-activity-time">2 days ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {detailTab === 'analytics' && (
                <div className="admin-drawer-section">
                  <span className="admin-drawer-section__title">Quick Analytics</span>
                  <p className="admin-text-muted" style={{ margin: '8px 0 16px' }}>
                    View full in-depth metrics and reports for {selectedCafe.name}.
                  </p>
                  <button
                    className="admin-btn-primary"
                    style={{ width: '100%' }}
                    onClick={() =>
                      navigate(`/admin/cafe-analytics?cafe=${selectedCafe.id}`)
                    }
                  >
                    <BarChart3 size={16} /> Open Full Café Analytics
                  </button>
                </div>
              )}

              {detailTab === 'branding' && (
                <div className="admin-drawer-section">
                  <span className="admin-drawer-section__title">Brand & Theme</span>
                  <div className="admin-info-list" style={{ marginTop: 12 }}>
                    <div className="admin-info-row">
                      <span className="admin-info-label">Brand Color</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: selectedCafe.color || '#D4A04A',
                            display: 'inline-block',
                          }}
                        />
                        <span className="admin-info-val">
                          {selectedCafe.color || '#D4A04A'}
                        </span>
                      </div>
                    </div>
                    <div className="admin-info-row">
                      <span className="admin-info-label">Logo Format</span>
                      <span className="admin-info-val">SVG / High-Res PNG</span>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'settings' && (
                <div className="admin-drawer-section">
                  <span className="admin-drawer-section__title">
                    Café Operations
                  </span>
                  <div className="admin-info-list" style={{ marginTop: 12 }}>
                    <div className="admin-info-row">
                      <span className="admin-info-label">QR Ordering</span>
                      <span className="admin-status-pill admin-status-pill--active">
                        Enabled
                      </span>
                    </div>
                    <div className="admin-info-row">
                      <span className="admin-info-label">Tax Rate</span>
                      <span className="admin-info-val">5% GST</span>
                    </div>
                    <div className="admin-info-row">
                      <span className="admin-info-label">Status</span>
                      <button
                        className="admin-btn-outline"
                        style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        onClick={() => handleToggleStatus(selectedCafe.id)}
                      >
                        Toggle ({selectedCafe.status})
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="admin-drawer-footer">
              <button
                className="admin-btn-outline"
                onClick={() =>
                  navigate(`/admin/cafe-analytics?cafe=${selectedCafe.id}`)
                }
              >
                <BarChart3 size={16} /> View Analytics
              </button>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  setToastMessage(
                    `Opening configuration panel for ${selectedCafe.name}...`
                  );
                }}
              >
                Manage Café
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* CREATE NEW CAFÉ WIZARD (4 Steps Modal) */}
      {showCreateWizard && (
        <CreateCafeWizard
          onClose={() => setShowCreateWizard(false)}
          onSuccess={(newCafe) => {
            setCafesList([newCafe, ...cafesList]);
            setShowCreateWizard(false);
            setToastMessage(`Café "${newCafe.name}" created successfully!`);
          }}
        />
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmCafe && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm-dialog">
            <div className="admin-confirm-dialog__icon">
              <ShieldAlert size={28} color="#ef4444" />
            </div>
            <h3 className="admin-confirm-dialog__title">Delete Café?</h3>
            <p className="admin-confirm-dialog__desc">
              Are you sure you want to delete <strong>{deleteConfirmCafe.name}</strong>?
              This will remove all associated tables, menus, and unlink staff.
              This action cannot be undone.
            </p>
            <div className="admin-confirm-dialog__actions">
              <button
                className="admin-btn-outline"
                onClick={() => setDeleteConfirmCafe(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-danger"
                onClick={handleDeleteCafe}
              >
                Delete Café
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="admin-modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="admin-mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="admin-mobile-sheet__header">
              <h3>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-mobile-sheet__body">
              <label className="admin-form-label">Status</label>
              <select
                className="admin-form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <label className="admin-form-label" style={{ marginTop: 14 }}>
                City
              </label>
              <select
                className="admin-form-input"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <button
                className="admin-btn-primary"
                style={{ width: '100%', marginTop: 24 }}
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Multi-Step Create New Café Wizard (Steps 1-4)
 */
function CreateCafeWizard({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);

  // Step 1: Café Information
  const [cafeName, setCafeName] = useState('');
  const [cuisine, setCuisine] = useState('Café & Bakery');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Vadodara');
  const [state, setState] = useState('Gujarat');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // Step 2: Owner Information
  const [ownerMode, setOwnerMode] = useState('create'); // 'create' | 'assign'
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [assignedOwnerId, setAssignedOwnerId] = useState('OWN-001');

  // Step 3: Initial Setup (Tables & QR)
  const [tablesList, setTablesList] = useState([
    { number: 1, type: 'Indoor (2 Seater)', capacity: 2, status: 'Active' },
    { number: 2, type: 'Indoor (4 Seater)', capacity: 4, status: 'Active' },
    { number: 3, type: 'Outdoor Terrace', capacity: 4, status: 'Active' },
  ]);
  const [newTableNum, setNewTableNum] = useState(4);
  const [newTableType, setNewTableType] = useState('Indoor (4 Seater)');

  // Form Validation
  const [error, setError] = useState('');

  const handleNextStep1 = () => {
    if (!cafeName.trim()) {
      setError('Please enter the Café Name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter the Address.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (ownerMode === 'create') {
      if (!ownerName.trim() || !ownerPhone.trim()) {
        setError('Please enter Owner Name and Phone Number.');
        return;
      }
    }
    setError('');
    setStep(3);
  };

  const handleAddTable = () => {
    setTablesList([
      ...tablesList,
      {
        number: newTableNum,
        type: newTableType,
        capacity: newTableType.includes('2') ? 2 : 4,
        status: 'Active',
      },
    ]);
    setNewTableNum((prev) => prev + 1);
  };

  const handleRemoveTable = (idx) => {
    setTablesList(tablesList.filter((_, i) => i !== idx));
  };

  const handleFinalSubmit = () => {
    const newId = `CAF-${String(Math.floor(Math.random() * 900) + 100)}`;
    const createdCafe = {
      id: newId,
      name: cafeName,
      logo: null,
      location: `${city}, ${state}`,
      city,
      state,
      address,
      cuisine,
      description: description || 'Artisanal coffee and fresh gourmet eats.',
      phone: phone || '+91 98765 00000',
      email: email || `${cafeName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      website: website || `https://${cafeName.toLowerCase().replace(/\s+/g, '')}.in`,
      tables: tablesList.length,
      status: 'active',
      orders: 0,
      revenue: 0,
      staff: 2,
      createdAt: 'Just now',
      createdDate: new Date().toISOString(),
      color: '#D4A04A',
      ownerId: ownerMode === 'create' ? 'OWN-NEW' : assignedOwnerId,
    };

    onSuccess(createdCafe);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-wizard-card">
        {/* Wizard Header */}
        <div className="admin-wizard-header">
          <div>
            <h2 className="admin-wizard-title">Create New Café</h2>
            <p className="admin-wizard-sub">
              Step {step} of 4 —{' '}
              {step === 1 && 'Café Information'}
              {step === 2 && 'Owner Information'}
              {step === 3 && 'Initial Setup'}
              {step === 4 && 'Review & Create'}
            </p>
          </div>
          <button className="admin-drawer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="admin-wizard-stepper">
          {[
            { num: 1, label: 'Café Info' },
            { num: 2, label: 'Owner' },
            { num: 3, label: 'Setup' },
            { num: 4, label: 'Review' },
          ].map(({ num, label }) => (
            <div
              key={num}
              className={`admin-wizard-step ${step >= num ? 'admin-wizard-step--active' : ''}`}
            >
              <div className="admin-wizard-step__circle">
                {step > num ? <Check size={14} /> : num}
              </div>
              <span className="admin-wizard-step__label">{label}</span>
            </div>
          ))}
        </div>

        {error && <div className="admin-form-error">{error}</div>}

        {/* Body */}
        <div className="admin-wizard-body">
          {/* STEP 1: CAFÉ INFO */}
          {step === 1 && (
            <div className="admin-wizard-form-grid">
              <div className="admin-form-field admin-form-field--full">
                <label className="admin-form-label">Café Name *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Café Velvet"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Cuisine / Type</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Specialty Coffee & Bistro"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Contact Phone</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="admin-form-field admin-form-field--full">
                <label className="admin-form-label">Address *</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Street address, building, landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">City</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">State</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Email Address</label>
                <input
                  type="email"
                  className="admin-form-input"
                  placeholder="contact@cafe.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Website</label>
                <input
                  type="url"
                  className="admin-form-input"
                  placeholder="https://mycafe.in"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="admin-form-field admin-form-field--full">
                <label className="admin-form-label">Short Description</label>
                <textarea
                  className="admin-form-textarea"
                  rows={2}
                  placeholder="Highlight key ambience, roasts, or specialties..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: OWNER INFO */}
          {step === 2 && (
            <div>
              <div className="admin-toggle-group" style={{ marginBottom: 20 }}>
                <button
                  type="button"
                  className={`admin-toggle-btn ${ownerMode === 'create' ? 'admin-toggle-btn--active' : ''}`}
                  onClick={() => setOwnerMode('create')}
                >
                  Create New Owner
                </button>
                <button
                  type="button"
                  className={`admin-toggle-btn ${ownerMode === 'assign' ? 'admin-toggle-btn--active' : ''}`}
                  onClick={() => setOwnerMode('assign')}
                >
                  Assign Existing Owner
                </button>
              </div>

              {ownerMode === 'create' ? (
                <div className="admin-wizard-form-grid">
                  <div className="admin-form-field admin-form-field--full">
                    <label className="admin-form-label">Owner Full Name *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Vikram Joshi"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="admin-form-field">
                    <label className="admin-form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="admin-form-input"
                      placeholder="+91 98765 00000"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-field">
                    <label className="admin-form-label">Email Address</label>
                    <input
                      type="email"
                      className="admin-form-input"
                      placeholder="owner@gmail.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                    />
                  </div>
                  <div className="admin-form-field admin-form-field--full">
                    <div className="admin-callout-info">
                      <CheckCircle2 size={16} />
                      <span>
                        Owner credentials will be provisioned directly in the system.
                        Owner can sign in with this mobile number via OTP.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="admin-form-field admin-form-field--full">
                  <label className="admin-form-label">Select Existing Owner</label>
                  <select
                    className="admin-form-input"
                    value={assignedOwnerId}
                    onChange={(e) => setAssignedOwnerId(e.target.value)}
                  >
                    {OWNERS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.phone}) — {o.location}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: INITIAL SETUP */}
          {step === 3 && (
            <div>
              <div className="admin-wizard-section-title">
                Table &amp; QR Setup
              </div>
              <p className="admin-text-muted" style={{ marginBottom: 14 }}>
                Configure seating arrangement and QR code endpoints for this café.
              </p>

              <div className="admin-table-setup-row">
                <input
                  type="number"
                  className="admin-form-input"
                  style={{ width: 100 }}
                  placeholder="Table #"
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(Number(e.target.value))}
                />
                <select
                  className="admin-form-input"
                  style={{ flex: 1 }}
                  value={newTableType}
                  onChange={(e) => setNewTableType(e.target.value)}
                >
                  <option value="Indoor (2 Seater)">Indoor (2 Seater)</option>
                  <option value="Indoor (4 Seater)">Indoor (4 Seater)</option>
                  <option value="Outdoor Terrace">Outdoor Terrace</option>
                  <option value="VIP Booth">VIP Booth (6 Seater)</option>
                </select>
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={handleAddTable}
                >
                  <Plus size={16} /> Add Table
                </button>
              </div>

              <div className="admin-tables-list-chips">
                {tablesList.map((t, idx) => (
                  <div key={idx} className="admin-table-chip">
                    <QrCode size={14} />
                    <span>
                      Table {t.number}: {t.type}
                    </span>
                    <button
                      type="button"
                      className="admin-chip-delete"
                      onClick={() => handleRemoveTable(idx)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="admin-wizard-section-title" style={{ marginTop: 24 }}>
                Platform Configurations
              </div>
              <div className="admin-checkbox-list">
                <label className="admin-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Generate unique printable QR sheets for all tables</span>
                </label>
                <label className="admin-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Enable direct customer digital ordering via web app</span>
                </label>
                <label className="admin-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Enable standard GST tax rules (5% Restaurant GST)</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CREATE */}
          {step === 4 && (
            <div className="admin-review-summary">
              <div className="admin-review-card">
                <h4 className="admin-review-card__title">
                  <Store size={16} /> Café Information
                </h4>
                <div className="admin-review-row">
                  <span>Name:</span> <strong>{cafeName}</strong>
                </div>
                <div className="admin-review-row">
                  <span>Location:</span> <strong>{city}, {state}</strong>
                </div>
                <div className="admin-review-row">
                  <span>Cuisine:</span> <strong>{cuisine}</strong>
                </div>
                <div className="admin-review-row">
                  <span>Contact:</span> <strong>{phone || 'Not provided'}</strong>
                </div>
              </div>

              <div className="admin-review-card">
                <h4 className="admin-review-card__title">
                  <Users size={16} /> Owner Assignment
                </h4>
                {ownerMode === 'create' ? (
                  <>
                    <div className="admin-review-row">
                      <span>Owner:</span> <strong>{ownerName} (New Account)</strong>
                    </div>
                    <div className="admin-review-row">
                      <span>Phone:</span> <strong>{ownerPhone}</strong>
                    </div>
                  </>
                ) : (
                  <div className="admin-review-row">
                    <span>Owner:</span>{' '}
                    <strong>{getOwnerById(assignedOwnerId)?.name}</strong>
                  </div>
                )}
              </div>

              <div className="admin-review-card">
                <h4 className="admin-review-card__title">
                  <QrCode size={16} /> Initial Configuration
                </h4>
                <div className="admin-review-row">
                  <span>Tables:</span> <strong>{tablesList.length} configured</strong>
                </div>
                <div className="admin-review-row">
                  <span>Status on creation:</span>{' '}
                  <span className="admin-status-pill admin-status-pill--active">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="admin-wizard-footer">
          {step > 1 ? (
            <button
              type="button"
              className="admin-btn-outline"
              onClick={() => {
                setError('');
                setStep(step - 1);
              }}
            >
              Back
            </button>
          ) : (
            <button type="button" className="admin-btn-outline" onClick={onClose}>
              Cancel
            </button>
          )}

          {step === 1 && (
            <button type="button" className="admin-btn-primary" onClick={handleNextStep1}>
              Continue to Owner <ArrowRight size={16} />
            </button>
          )}

          {step === 2 && (
            <button type="button" className="admin-btn-primary" onClick={handleNextStep2}>
              Continue to Setup <ArrowRight size={16} />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => setStep(4)}
            >
              Review Details <ArrowRight size={16} />
            </button>
          )}

          {step === 4 && (
            <button
              type="button"
              className="admin-btn-primary"
              onClick={handleFinalSubmit}
            >
              <Check size={16} /> Create Café
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
