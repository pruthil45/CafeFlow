import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  MoreHorizontal,
  MoreVertical,
  X,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Edit,
  Store,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  OWNERS as INITIAL_OWNERS,
  CAFES,
  getCafeById,
  formatINR,
  formatNumber,
} from '../../../data/adminMockData';

export default function AdminOwners() {
  // --- State ---
  const [owners, setOwners] = useState(INITIAL_OWNERS);
  const [search, setSearch] = useState('');
  const [filterCafe, setFilterCafe] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);

  const actionMenuRef = useRef(null);

  // Close action menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- Computed ---
  const kpis = useMemo(() => {
    const total = owners.length;
    const active = owners.filter((o) => o.status === 'active').length;
    const inactive = owners.filter((o) => o.status === 'inactive').length;
    const unassigned = owners.filter((o) => !o.cafeId).length;
    return { total, active, inactive, unassigned };
  }, [owners]);

  const filteredOwners = useMemo(() => {
    let result = [...owners];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phone.includes(q)
      );
    }

    // Café filter
    if (filterCafe !== 'all') {
      result = result.filter((o) => o.cafeId === filterCafe);
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((o) => o.status === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'oldest':
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [owners, search, filterCafe, filterStatus, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setFilterCafe('all');
    setFilterStatus('all');
    setSortBy('newest');
  };

  // --- Actions ---
  const handleToggleStatus = (owner) => {
    const newStatus = owner.status === 'active' ? 'inactive' : 'active';
    setConfirmDialog({
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} Owner`,
      text: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${owner.name}?`,
      type: newStatus === 'active' ? 'success' : 'warning',
      onConfirm: () => {
        setOwners((prev) =>
          prev.map((o) => (o.id === owner.id ? { ...o, status: newStatus } : o))
        );
        if (selectedOwner?.id === owner.id) {
          setSelectedOwner((prev) => ({ ...prev, status: newStatus }));
        }
        setConfirmDialog(null);
        setActionMenuId(null);
        setToast({ type: 'success', message: `${owner.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.` });
      },
    });
  };

  const handleDeleteOwner = (owner) => {
    setConfirmDialog({
      title: 'Delete Owner',
      text: `Are you sure you want to permanently delete ${owner.name}? This action cannot be undone.`,
      type: 'danger',
      onConfirm: () => {
        setOwners((prev) => prev.filter((o) => o.id !== owner.id));
        if (selectedOwner?.id === owner.id) setSelectedOwner(null);
        setConfirmDialog(null);
        setActionMenuId(null);
        setToast({ type: 'success', message: `${owner.name} has been deleted.` });
      },
    });
  };

  const handleOwnerCreated = (newOwner) => {
    setOwners((prev) => [...prev, newOwner]);
    setShowCreateModal(false);
    setToast({ type: 'success', message: `Owner "${newOwner.name}" created successfully!` });
  };

  // Generate avatar color
  const getAvatarColor = (name) => {
    const colors = ['#D4A04A', '#8B5E3C', '#5C8A4A', '#6A4FA0', '#C75B2A', '#3b82f6', '#e87a30', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="admin-owners">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__top">
          <div>
            <h1 className="admin-page-header__title">Owners</h1>
            <p className="admin-page-header__subtitle">Manage all café owner accounts across the platform.</p>
          </div>
          <button className="admin-btn-primary" onClick={() => setShowCreateModal(true)} id="create-owner-btn">
            <Plus size={18} />
            Create Owner
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--brown">
              <Users size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Total Owners</div>
          <div className="admin-kpi-card__value">{kpis.total}</div>
          <div className="admin-kpi-card__growth admin-kpi-card__growth--positive">
            <TrendingUp size={14} /> ↑ 14% <span className="admin-kpi-card__growth-text">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--green">
              <UserCheck size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Active Owners</div>
          <div className="admin-kpi-card__value">{kpis.active}</div>
          <div className="admin-kpi-card__growth admin-kpi-card__growth--positive">
            <TrendingUp size={14} /> ↑ 10% <span className="admin-kpi-card__growth-text">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--red">
              <UserX size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Inactive Owners</div>
          <div className="admin-kpi-card__value">{kpis.inactive}</div>
          <div className="admin-kpi-card__growth admin-kpi-card__growth--negative">
            <TrendingDown size={14} /> ↓ 33% <span className="admin-kpi-card__growth-text">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--blue">
              <UserMinus size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Unassigned Owners</div>
          <div className="admin-kpi-card__value">{kpis.unassigned}</div>
          <div className="admin-kpi-card__growth" style={{ color: '#9a9088', fontSize: '0.78rem' }}>
            {kpis.unassigned === 0 ? 'All owners assigned' : `${kpis.unassigned} need assignment`}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-bar__search">
          <Search size={16} className="admin-filter-bar__search-icon" />
          <input
            type="text"
            className="admin-filter-bar__search-input"
            placeholder="Search owner name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="owner-search"
          />
        </div>
        <select className="admin-filter-bar__select" value={filterCafe} onChange={(e) => setFilterCafe(e.target.value)} id="owner-cafe-filter">
          <option value="all">All Cafés</option>
          {CAFES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="admin-filter-bar__select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} id="owner-status-filter">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select className="admin-filter-bar__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} id="owner-sort">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name-az">Name A-Z</option>
          <option value="name-za">Name Z-A</option>
        </select>
        <button className="admin-filter-bar__reset" onClick={resetFilters}>Reset</button>
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper admin-table-wrapper--desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Owner</th>
              <th>Contact</th>
              <th>Assigned Café</th>
              <th>Location</th>
              <th>Joined On</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="admin-empty-state">
                    <Users size={40} className="admin-empty-state__icon" />
                    <div className="admin-empty-state__title">No owners found</div>
                    <div className="admin-empty-state__text">Try adjusting your search or filters.</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOwners.map((owner, i) => {
                const cafe = getCafeById(owner.cafeId);
                return (
                  <tr key={owner.id} onClick={() => { setSelectedOwner(owner); setDetailTab('overview'); }}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="admin-table__user-cell">
                        <div className="admin-table__avatar" style={{ background: getAvatarColor(owner.name) }}>
                          {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="admin-table__user-info">
                          <span className="admin-table__user-name">{owner.name}</span>
                          <span className="admin-table__user-sub">{cafe ? cafe.name : 'Unassigned'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__contact">
                        <span className="admin-table__contact-phone">{owner.phone}</span>
                        <span className="admin-table__contact-email">{owner.email}</span>
                      </div>
                    </td>
                    <td>
                      {cafe ? (
                        <div className="admin-table__cafe-cell">
                          <div className="admin-table__cafe-logo" style={{ background: cafe.color }}>
                            {cafe.name.charAt(0)}
                          </div>
                          {cafe.name}
                        </div>
                      ) : (
                        <span style={{ color: '#9a9088' }}>—</span>
                      )}
                    </td>
                    <td>{owner.location.split(', ').slice(0, 2).join(', ')}</td>
                    <td>{owner.joinedOn}</td>
                    <td style={{ fontSize: '0.8rem' }}>{owner.lastLogin}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${owner.status}`}>
                        <span className="admin-badge__dot" />
                        {owner.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ position: 'relative' }} ref={actionMenuId === owner.id ? actionMenuRef : null}>
                        <button
                          className="admin-table__action-btn"
                          onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === owner.id ? null : owner.id); }}
                          aria-label="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {actionMenuId === owner.id && (
                          <div className="admin-action-menu">
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setSelectedOwner(owner); setDetailTab('overview'); setActionMenuId(null); }}>
                              <Eye size={15} /> View Owner
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }}>
                              <Edit size={15} /> Edit Owner
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }}>
                              <Store size={15} /> View Assigned Café
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }}>
                              <ChevronRight size={15} /> Reassign Café
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }}>
                              <Shield size={15} /> Manage Access
                            </button>
                            <div className="admin-action-menu__divider" />
                            <button
                              className={`admin-action-menu__item ${owner.status === 'active' ? 'admin-action-menu__item--danger' : 'admin-action-menu__item--success'}`}
                              onClick={(e) => { e.stopPropagation(); handleToggleStatus(owner); }}
                            >
                              {owner.status === 'active' ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
                              {owner.status === 'active' ? 'Deactivate Owner' : 'Activate Owner'}
                            </button>
                            <button className="admin-action-menu__item admin-action-menu__item--danger" onClick={(e) => { e.stopPropagation(); handleDeleteOwner(owner); }}>
                              <Trash2 size={15} /> Delete Owner
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

      {/* Mobile Cards */}
      <div className="admin-mobile-list">
        {filteredOwners.length === 0 ? (
          <div className="admin-empty-state">
            <Users size={40} className="admin-empty-state__icon" />
            <div className="admin-empty-state__title">No owners found</div>
            <div className="admin-empty-state__text">Try adjusting your search or filters.</div>
          </div>
        ) : (
          filteredOwners.map((owner) => {
            const cafe = getCafeById(owner.cafeId);
            return (
              <div className="admin-mobile-card" key={owner.id} onClick={() => { setSelectedOwner(owner); setDetailTab('overview'); }}>
                <div className="admin-mobile-card__top">
                  <div className="admin-mobile-card__avatar" style={{ background: getAvatarColor(owner.name) }}>
                    {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="admin-mobile-card__info">
                    <div className="admin-mobile-card__name">{owner.name}</div>
                    <div className="admin-mobile-card__sub">{cafe ? cafe.name : 'Unassigned'}</div>
                  </div>
                  <span className={`admin-badge admin-badge--${owner.status}`}>
                    <span className="admin-badge__dot" />
                    {owner.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-mobile-card__meta">
                  {owner.phone} • {owner.email}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Owner Detail Panel */}
      {selectedOwner && (
        <OwnerDetailPanel
          owner={selectedOwner}
          tab={detailTab}
          onTabChange={setDetailTab}
          onClose={() => setSelectedOwner(null)}
          onToggleStatus={handleToggleStatus}
          getAvatarColor={getAvatarColor}
        />
      )}

      {/* Create Owner Modal */}
      {showCreateModal && (
        <CreateOwnerModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleOwnerCreated}
          existingOwnersCount={owners.length}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="admin-modal-overlay" onClick={() => setConfirmDialog(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__body">
              <div className="admin-confirm-dialog">
                <div className="admin-confirm-dialog__icon" style={{
                  background: confirmDialog.type === 'danger' ? 'rgba(239,68,68,0.1)' : confirmDialog.type === 'warning' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                  color: confirmDialog.type === 'danger' ? '#ef4444' : confirmDialog.type === 'warning' ? '#f59e0b' : '#22c55e',
                }}>
                  {confirmDialog.type === 'danger' ? <Trash2 size={24} /> : confirmDialog.type === 'warning' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </div>
                <div className="admin-confirm-dialog__title">{confirmDialog.title}</div>
                <div className="admin-confirm-dialog__text">{confirmDialog.text}</div>
                <div className="admin-confirm-dialog__actions">
                  <button className="admin-btn-secondary" onClick={() => setConfirmDialog(null)}>Cancel</button>
                  <button
                    className="admin-btn-primary"
                    style={confirmDialog.type === 'danger' ? { background: '#ef4444', boxShadow: '0 4px 12px rgba(239,68,68,0.25)' } : {}}
                    onClick={confirmDialog.onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="admin-toast">
          <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
          {toast.message}
        </div>
      )}
    </div>
  );
}

/* ==================== Owner Detail Panel ==================== */
function OwnerDetailPanel({ owner, tab, onTabChange, onClose, onToggleStatus, getAvatarColor }) {
  const cafe = getCafeById(owner.cafeId);

  return (
    <div className="admin-detail-panel">
      <button className="admin-detail-panel__close" onClick={onClose} aria-label="Close">
        <X size={18} />
      </button>

      <div className="admin-detail-panel__header">
        <div className="admin-detail-panel__header-title">Owner Details</div>
        <div className="admin-detail-panel__profile">
          <div className="admin-detail-panel__avatar" style={{ background: getAvatarColor(owner.name) }}>
            {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="admin-detail-panel__profile-info">
            <div className="admin-detail-panel__profile-name">
              {owner.name}
              <span className={`admin-badge admin-badge--${owner.status}`} style={{ marginLeft: 4 }}>
                <span className="admin-badge__dot" />
                {owner.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="admin-detail-panel__profile-sub">Café Owner</div>
            <div className="admin-detail-panel__profile-id">Owner ID: {owner.id}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['Overview', 'Café', 'Activity', 'Settings'].map((t) => (
          <button
            key={t}
            className={`admin-tab ${tab === t.toLowerCase() ? 'admin-tab--active' : ''}`}
            onClick={() => onTabChange(t.toLowerCase())}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="admin-detail-panel__body">
        {tab === 'overview' && (
          <>
            {/* Contact Information */}
            <div className="admin-detail-section">
              <div className="admin-detail-section__title">Contact Information</div>
              <div className="admin-detail-row">
                <Phone size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__value">{owner.phone}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Mail size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__value">{owner.email}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <MapPin size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__value">{owner.location}</div>
                </div>
              </div>
            </div>

            {/* Assigned Café */}
            {cafe && (
              <div className="admin-detail-section">
                <div className="admin-detail-section__title">Assigned Café</div>
                <div className="admin-detail-cafe-card">
                  <div className="admin-detail-cafe-card__logo" style={{ background: cafe.color }}>
                    {cafe.name.charAt(0)}
                  </div>
                  <div className="admin-detail-cafe-card__info">
                    <div className="admin-detail-cafe-card__name">
                      {cafe.name}
                      <span className={`admin-badge admin-badge--${cafe.status}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        <span className="admin-badge__dot" />
                        {cafe.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="admin-detail-cafe-card__meta">{cafe.tables} tables • {cafe.staff} staff</div>
                    <div className="admin-detail-cafe-card__location">{cafe.location}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="admin-detail-section">
              <div className="admin-detail-section__title">Account Information</div>
              <div className="admin-detail-row">
                <Calendar size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Joined On</div>
                  <div className="admin-detail-row__value">{owner.joinedOn}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Clock size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Last Login</div>
                  <div className="admin-detail-row__value">{owner.lastLogin}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Shield size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Status</div>
                  <div className="admin-detail-row__value">
                    <span className={`admin-badge admin-badge--${owner.status}`}>
                      <span className="admin-badge__dot" />
                      {owner.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Lock size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Login Access</div>
                  <div className="admin-detail-row__value" style={{ color: owner.loginAccess ? '#22c55e' : '#ef4444' }}>
                    {owner.loginAccess ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>

            {/* Café Overview Stats */}
            {cafe && (
              <div className="admin-detail-section">
                <div className="admin-detail-section__title">Café Overview</div>
                <div className="admin-detail-stats">
                  <div className="admin-detail-stat">
                    <div className="admin-detail-stat__value">{formatNumber(cafe.orders)}</div>
                    <div className="admin-detail-stat__label">Total Orders</div>
                  </div>
                  <div className="admin-detail-stat">
                    <div className="admin-detail-stat__value">{formatINR(cafe.revenue)}</div>
                    <div className="admin-detail-stat__label">Revenue</div>
                  </div>
                  <div className="admin-detail-stat">
                    <div className="admin-detail-stat__value">{cafe.tables}</div>
                    <div className="admin-detail-stat__label">Tables</div>
                  </div>
                  <div className="admin-detail-stat">
                    <div className="admin-detail-stat__value">{cafe.staff}</div>
                    <div className="admin-detail-stat__label">Staff</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'café' && cafe && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Café Details</div>
            <div className="admin-detail-cafe-card" style={{ marginBottom: 16 }}>
              <div className="admin-detail-cafe-card__logo" style={{ background: cafe.color }}>{cafe.name.charAt(0)}</div>
              <div className="admin-detail-cafe-card__info">
                <div className="admin-detail-cafe-card__name">{cafe.name}</div>
                <div className="admin-detail-cafe-card__location">{cafe.location}</div>
              </div>
            </div>
            <div className="admin-detail-row">
              <Store size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Café ID</div>
                <div className="admin-detail-row__value">{cafe.id}</div>
              </div>
            </div>
            <div className="admin-detail-row">
              <MapPin size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Location</div>
                <div className="admin-detail-row__value">{cafe.location}</div>
              </div>
            </div>
            <div className="admin-detail-stats" style={{ marginTop: 16 }}>
              <div className="admin-detail-stat">
                <div className="admin-detail-stat__value">{cafe.tables}</div>
                <div className="admin-detail-stat__label">Tables</div>
              </div>
              <div className="admin-detail-stat">
                <div className="admin-detail-stat__value">{cafe.staff}</div>
                <div className="admin-detail-stat__label">Staff</div>
              </div>
              <div className="admin-detail-stat">
                <div className="admin-detail-stat__value">{formatNumber(cafe.orders)}</div>
                <div className="admin-detail-stat__label">Orders</div>
              </div>
              <div className="admin-detail-stat">
                <div className="admin-detail-stat__value">{formatINR(cafe.revenue)}</div>
                <div className="admin-detail-stat__label">Revenue</div>
              </div>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Recent Activity</div>
            <div className="admin-activity-list">
              <div className="admin-activity-item">
                <div className="admin-activity-item__icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  <CheckCircle2 size={16} />
                </div>
                <div className="admin-activity-item__content">
                  <div className="admin-activity-item__desc">Logged in to the platform</div>
                  <div className="admin-activity-item__time">{owner.lastLogin}</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-item__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                  <Edit size={16} />
                </div>
                <div className="admin-activity-item__content">
                  <div className="admin-activity-item__desc">Updated café menu</div>
                  <div className="admin-activity-item__time">2 days ago</div>
                </div>
              </div>
              <div className="admin-activity-item">
                <div className="admin-activity-item__icon" style={{ background: 'rgba(154,106,212,0.1)', color: '#9a6ad4' }}>
                  <Users size={16} />
                </div>
                <div className="admin-activity-item__content">
                  <div className="admin-activity-item__desc">Added new staff member</div>
                  <div className="admin-activity-item__time">5 days ago</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Account Settings</div>
            <div className="admin-detail-row">
              <Shield size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Login Access</div>
                <div className="admin-detail-row__value" style={{ color: owner.loginAccess ? '#22c55e' : '#ef4444' }}>
                  {owner.loginAccess ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <div className="admin-detail-row">
              <Calendar size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Account Created</div>
                <div className="admin-detail-row__value">{owner.joinedOn}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="admin-detail-panel__actions">
        <button className="admin-btn-primary" style={{ flex: 1 }}>
          <Edit size={16} /> Edit Owner
        </button>
        <button className="admin-btn-secondary" style={{ flex: 1 }}>
          <Shield size={16} /> Manage Access
        </button>
      </div>
    </div>
  );
}

/* ==================== Create Owner Modal ==================== */
function CreateOwnerModal({ onClose, onCreated, existingOwnersCount }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cafeId: '',
    loginAccess: true,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim()) errs.phone = 'Mobile number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.cafeId) errs.cafeId = 'Please select a café';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleCreate = () => {
    const cafe = getCafeById(formData.cafeId);
    const newOwner = {
      id: `OWN-${String(existingOwnersCount + 1).padStart(3, '0')}`,
      name: formData.name,
      phone: `+91 ${formData.phone}`,
      email: formData.email,
      location: cafe ? cafe.location.replace(', ', ', ') + ', India' : 'India',
      cafeId: formData.cafeId,
      joinedOn: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastLogin: 'Never',
      status: 'active',
      loginAccess: formData.loginAccess,
      avatar: null,
    };
    setShowSuccess(true);
    setTimeout(() => {
      onCreated(newOwner);
    }, 2000);
  };

  const selectedCafe = getCafeById(formData.cafeId);

  if (showSuccess) {
    return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
          <div className="admin-modal__body">
            <div className="admin-success">
              <div className="admin-success__icon">
                <CheckCircle2 size={32} />
              </div>
              <div className="admin-success__title">Owner Created Successfully</div>
              <div className="admin-success__text">
                {formData.name} has been assigned to {selectedCafe?.name || 'a café'}.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">Create New Owner</h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Wizard Steps */}
        <div style={{ padding: '20px 28px 0' }}>
          <div className="admin-wizard-steps">
            <div className={`admin-wizard-step ${step >= 1 ? (step > 1 ? 'admin-wizard-step--done' : 'admin-wizard-step--active') : ''}`}>
              <div className="admin-wizard-step__circle">
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className="admin-wizard-step__label">Info</span>
            </div>
            <div className={`admin-wizard-step__line ${step > 1 ? 'admin-wizard-step__line--done' : ''}`} />
            <div className={`admin-wizard-step ${step >= 2 ? (step > 2 ? 'admin-wizard-step--done' : 'admin-wizard-step--active') : ''}`}>
              <div className="admin-wizard-step__circle">
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span className="admin-wizard-step__label">Assign</span>
            </div>
            <div className={`admin-wizard-step__line ${step > 2 ? 'admin-wizard-step__line--done' : ''}`} />
            <div className={`admin-wizard-step ${step >= 3 ? 'admin-wizard-step--active' : ''}`}>
              <div className="admin-wizard-step__circle">3</div>
              <span className="admin-wizard-step__label">Review</span>
            </div>
          </div>
        </div>

        <div className="admin-modal__body">
          {/* Step 1: Owner Information */}
          {step === 1 && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: '#1a0e0a' }}>Owner Information</h3>
              <p style={{ fontSize: '0.82rem', color: '#6b625a', marginBottom: 20 }}>Enter the owner's basic information.</p>

              <div className="admin-form-field">
                <label className="admin-form-field__label">Full Name <span>*</span></label>
                <input
                  className="admin-form-field__input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <div className="admin-form-field__error">{errors.name}</div>}
              </div>

              <div className="admin-form-field">
                <label className="admin-form-field__label">Mobile Number <span>*</span></label>
                <div className="admin-form-field__phone">
                  <div className="admin-form-field__phone-prefix">+91</div>
                  <input
                    className="admin-form-field__input"
                    placeholder="Enter mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>
                {errors.phone && <div className="admin-form-field__error">{errors.phone}</div>}
              </div>

              <div className="admin-form-field">
                <label className="admin-form-field__label">Email Address <span>*</span></label>
                <input
                  type="email"
                  className="admin-form-field__input"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <div className="admin-form-field__error">{errors.email}</div>}
              </div>

              <div className="admin-form-field">
                <label className="admin-form-field__label">Profile Photo (Optional)</label>
                <div className="admin-form-field__upload">
                  <Upload size={24} style={{ color: '#9a9088', margin: '0 auto' }} />
                  <div className="admin-form-field__upload-text">Upload Photo</div>
                  <div className="admin-form-field__upload-hint">JPG, PNG (Max 2MB)</div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Assign to Café */}
          {step === 2 && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: '#1a0e0a' }}>Assign to Café</h3>
              <p style={{ fontSize: '0.82rem', color: '#6b625a', marginBottom: 20 }}>Assign this owner to a café.</p>

              <div className="admin-form-field">
                <label className="admin-form-field__label">Select Café <span>*</span></label>
                <select
                  className="admin-form-field__select"
                  value={formData.cafeId}
                  onChange={(e) => setFormData({ ...formData, cafeId: e.target.value })}
                >
                  <option value="">Choose a café</option>
                  {CAFES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.location.split(',')[0]})</option>
                  ))}
                </select>
                {errors.cafeId && <div className="admin-form-field__error">{errors.cafeId}</div>}
              </div>

              {/* Café Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {CAFES.map((c) => (
                  <div
                    key={c.id}
                    className="admin-detail-cafe-card"
                    style={{
                      cursor: 'pointer',
                      borderColor: formData.cafeId === c.id ? '#e87a30' : '#e8e5e1',
                      background: formData.cafeId === c.id ? 'rgba(232,122,48,0.04)' : '#faf9f8',
                    }}
                    onClick={() => setFormData({ ...formData, cafeId: c.id })}
                  >
                    <div className="admin-detail-cafe-card__logo" style={{ background: c.color }}>
                      {c.name.charAt(0)}
                    </div>
                    <div className="admin-detail-cafe-card__info">
                      <div className="admin-detail-cafe-card__name">{c.name}</div>
                      <div className="admin-detail-cafe-card__location">{c.location}</div>
                    </div>
                    {formData.cafeId === c.id && <Check size={18} style={{ color: '#e87a30' }} />}
                  </div>
                ))}
              </div>

              {/* Login Access Toggle */}
              <div style={{ marginTop: 24 }}>
                <div
                  className="admin-toggle"
                  onClick={() => setFormData({ ...formData, loginAccess: !formData.loginAccess })}
                >
                  <div className={`admin-toggle__switch ${formData.loginAccess ? 'admin-toggle__switch--on' : ''}`} />
                  <div className="admin-toggle__content">
                    <div className="admin-toggle__label">Enable owner login for this café</div>
                    <div className="admin-toggle__desc">Owner will receive SMS code to set their password.</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: '#1a0e0a' }}>Review & Create</h3>
              <p style={{ fontSize: '0.82rem', color: '#6b625a', marginBottom: 20 }}>Review owner information before creating.</p>

              <div className="admin-review-section">
                <div className="admin-review-section__title">Owner Information</div>
                <div className="admin-review-row">
                  <span className="admin-review-row__label">Full Name</span>
                  <span className="admin-review-row__value">{formData.name}</span>
                </div>
                <div className="admin-review-row">
                  <span className="admin-review-row__label">Mobile Number</span>
                  <span className="admin-review-row__value">+91 {formData.phone}</span>
                </div>
                <div className="admin-review-row">
                  <span className="admin-review-row__label">Email</span>
                  <span className="admin-review-row__value">{formData.email}</span>
                </div>
              </div>

              <div className="admin-review-section">
                <div className="admin-review-section__title">Assigned Café</div>
                {selectedCafe && (
                  <div className="admin-detail-cafe-card" style={{ marginTop: 8 }}>
                    <div className="admin-detail-cafe-card__logo" style={{ background: selectedCafe.color }}>
                      {selectedCafe.name.charAt(0)}
                    </div>
                    <div className="admin-detail-cafe-card__info">
                      <div className="admin-detail-cafe-card__name">{selectedCafe.name}</div>
                      <div className="admin-detail-cafe-card__meta">{selectedCafe.tables} tables • {selectedCafe.staff} staff</div>
                      <div className="admin-detail-cafe-card__location">{selectedCafe.location}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="admin-review-section">
                <div className="admin-review-section__title">Account Settings</div>
                <div className="admin-review-row">
                  <span className="admin-review-row__label">Login Access</span>
                  <span className="admin-review-row__value" style={{ color: formData.loginAccess ? '#22c55e' : '#ef4444' }}>
                    {formData.loginAccess ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="admin-review-row">
                  <span className="admin-review-row__label">Status</span>
                  <span className="admin-review-row__value" style={{ color: '#22c55e' }}>Active</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="admin-modal__footer">
          {step > 1 ? (
            <button className="admin-btn-secondary" onClick={handleBack}>
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button className="admin-btn-primary" onClick={handleNext}>
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button className="admin-btn-primary" onClick={handleCreate}>
              Create Owner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
