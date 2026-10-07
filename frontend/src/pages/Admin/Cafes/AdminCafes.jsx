import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  getStoredCafes,
} from '../../../data/adminMockData';
import '../Admin.css';

export default function AdminCafes() {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [cafesList, setCafesList] = useState(getStoredCafes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Drawer & Modals
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [actionMenuId, setActionMenuId] = useState(null);
  const [deleteConfirmCafe, setDeleteConfirmCafe] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const actionMenuRef = useRef(null);

  // Sync latest cafes from storage on mount or navigation
  useEffect(() => {
    const list = getStoredCafes();
    setCafesList(list);
    if (location.state?.newCafe) {
      setSelectedCafe(location.state.newCafe);
      setToastMessage(location.state.message || `Café "${location.state.newCafe.name}" created successfully!`);
    }
  }, [location.state]);

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

      {/* Header — Button on Left underneath subtitle matching Image 1 */}
      <div className="admin-cafes-header">
        <div>
          <h1 className="admin-page-title">Cafés</h1>
          <p className="admin-page-subtitle">
            Manage all cafés registered on the CaféFlow platform.
          </p>
        </div>
        <button
          className="admin-btn-primary admin-btn-create-cafe"
          onClick={() => navigate('/admin/cafes/create')}
          id="btn-create-cafe"
        >
          <Plus size={18} />
          Create Café
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

