import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  UsersRound,
  UserCheck,
  UserX,
  Store,
  MoreHorizontal,
  MoreVertical,
  X,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Lock,
  Clock,
  CheckCircle2,
  LogIn,
  LogOut,
  Coffee,
  ChevronDown,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  STAFF as INITIAL_STAFF,
  CAFES,
  getCafeById,
  STAFF_ACTIVITIES,
  formatNumber,
} from '../../../data/adminMockData';

// Role colors
const ROLE_COLORS = {
  Waiter: '#e87a30',
  Kitchen: '#d4a04a',
  'Kitchen Staff': '#d4a04a',
  Cashier: '#8B5E3C',
  Manager: '#3b82f6',
  Others: '#9a9088',
  Other: '#9a9088',
};

export default function AdminStaffOverview() {
  const [staff] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [filterCafe, setFilterCafe] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileFilters, setMobileFilters] = useState({ cafe: 'all', role: 'all', status: 'all' });
  const [actionMenuId, setActionMenuId] = useState(null);
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

  // --- Computed KPIs ---
  const kpis = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 'active').length;
    const inactive = staff.filter((s) => s.status === 'inactive').length;
    const cafesWithStaff = new Set(staff.map((s) => s.cafeId)).size;
    return { total, active, inactive, cafesWithStaff };
  }, [staff]);

  // --- Role Distribution ---
  const roleDistribution = useMemo(() => {
    const roleCounts = {};
    staff.forEach((s) => {
      const role = s.role === 'Kitchen Staff' ? 'Kitchen' : s.role;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    return Object.entries(roleCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / staff.length) * 100),
        color: ROLE_COLORS[name] || ROLE_COLORS.Others,
      }))
      .sort((a, b) => b.value - a.value);
  }, [staff]);

  // --- Staff by Café ---
  const staffByCafe = useMemo(() => {
    const cafeCounts = {};
    staff.forEach((s) => {
      if (!cafeCounts[s.cafeId]) {
        const cafe = getCafeById(s.cafeId);
        cafeCounts[s.cafeId] = { name: cafe ? cafe.name : 'Unknown', value: 0, color: cafe ? cafe.color : '#9a9088' };
      }
      cafeCounts[s.cafeId].value++;
    });
    return Object.values(cafeCounts).sort((a, b) => b.value - a.value);
  }, [staff]);

  // --- Status Distribution ---
  const statusDistribution = useMemo(() => [
    { name: 'Active', value: kpis.active, percentage: Math.round((kpis.active / kpis.total) * 100), color: '#22c55e' },
    { name: 'Inactive', value: kpis.inactive, percentage: Math.round((kpis.inactive / kpis.total) * 100), color: '#ef4444' },
  ], [kpis]);

  // --- Filtered Staff ---
  const filteredStaff = useMemo(() => {
    let result = [...staff];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.includes(q)
      );
    }

    if (filterCafe !== 'all') {
      result = result.filter((s) => s.cafeId === filterCafe);
    }

    if (filterRole !== 'all') {
      result = result.filter((s) => s.role === filterRole);
    }

    if (filterStatus !== 'all') {
      result = result.filter((s) => s.status === filterStatus);
    }

    return result;
  }, [staff, search, filterCafe, filterRole, filterStatus]);

  const resetFilters = () => {
    setSearch('');
    setFilterCafe('all');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const applyMobileFilters = () => {
    setFilterCafe(mobileFilters.cafe);
    setFilterRole(mobileFilters.role);
    setFilterStatus(mobileFilters.status);
    setShowMobileFilters(false);
  };

  const clearMobileFilters = () => {
    setMobileFilters({ cafe: 'all', role: 'all', status: 'all' });
    setFilterCafe('all');
    setFilterRole('all');
    setFilterStatus('all');
    setShowMobileFilters(false);
  };

  const getAvatarColor = (name) => {
    const colors = ['#D4A04A', '#8B5E3C', '#5C8A4A', '#6A4FA0', '#C75B2A', '#3b82f6', '#e87a30', '#14b8a6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const allRoles = useMemo(() => [...new Set(staff.map((s) => s.role))], [staff]);

  return (
    <div className="admin-staff-overview">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__top">
          <div>
            <h1 className="admin-page-header__title">Staff Overview</h1>
            <p className="admin-page-header__subtitle">View all staff members across your café platform.</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--purple">
              <UsersRound size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Total Staff</div>
          <div className="admin-kpi-card__value">{kpis.total}</div>
          <div className="admin-kpi-card__growth admin-kpi-card__growth--positive">
            <TrendingUp size={14} /> ↑ 12% <span className="admin-kpi-card__growth-text">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--green">
              <UserCheck size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Active Staff</div>
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
          <div className="admin-kpi-card__label">Inactive Staff</div>
          <div className="admin-kpi-card__value">{kpis.inactive}</div>
          <div className="admin-kpi-card__growth admin-kpi-card__growth--negative">
            <TrendingDown size={14} /> ↓ 25% <span className="admin-kpi-card__growth-text">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <div className="admin-kpi-card__icon admin-kpi-card__icon--brown">
              <Store size={22} />
            </div>
            <button className="admin-kpi-card__more" aria-label="More"><MoreHorizontal size={16} /></button>
          </div>
          <div className="admin-kpi-card__label">Total Cafés</div>
          <div className="admin-kpi-card__value">{kpis.cafesWithStaff}</div>
          <div className="admin-kpi-card__growth" style={{ color: '#9a9088', fontSize: '0.78rem' }}>
            with staff
          </div>
        </div>
      </div>

      {/* Staff Analytics */}
      <div className="admin-staff-analytics">
        {/* Staff by Role — Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Staff by Role</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
            <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [val, name]}
                    contentStyle={{ borderRadius: 8, fontSize: '0.78rem', border: '1px solid #e8e5e1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-donut-center">
                <div className="admin-donut-center__value">{kpis.total}</div>
                <div className="admin-donut-center__label">Total Staff</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roleDistribution.map((role) => (
                <div key={role.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: '#3a3530' }}>{role.name}</span>
                  <span style={{ color: '#6b625a', fontWeight: 500 }}>{role.percentage}% ({role.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff by Café — Horizontal Bars */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Staff by Café</div>
            <button className="admin-card__view-all">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ width: '100%', height: 220, marginTop: 12 }}>
            <ResponsiveContainer>
              <BarChart data={staffByCafe} layout="vertical" barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0eeeb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9a9088' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#3a3530' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: '0.78rem', border: '1px solid #e8e5e1' }}
                  formatter={(val) => [`${val} staff`, 'Staff']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {staffByCafe.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Status — Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div className="admin-chart-card__title">Staff Status</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>
            <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: '0.78rem', border: '1px solid #e8e5e1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-donut-center">
                <div className="admin-donut-center__value">{kpis.total}</div>
                <div className="admin-donut-center__label">Total Staff</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {statusDistribution.map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a0e0a' }}>{s.name}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b625a' }}>{s.value} ({s.percentage}%)</div>
                </div>
              ))}
            </div>
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
            placeholder="Search staff name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="staff-search"
          />
        </div>
        <select className="admin-filter-bar__select" value={filterCafe} onChange={(e) => setFilterCafe(e.target.value)} id="staff-cafe-filter">
          <option value="all">All Cafés</option>
          {CAFES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="admin-filter-bar__select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} id="staff-role-filter">
          <option value="all">All Roles</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select className="admin-filter-bar__select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} id="staff-status-filter">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="admin-filter-bar__reset" onClick={resetFilters}>Reset</button>
      </div>

      {/* Desktop Table */}
      <div className="admin-table-wrapper admin-table-wrapper--desktop">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Staff</th>
              <th>Contact</th>
              <th>Café</th>
              <th>Role</th>
              <th>Joined On</th>
              <th>Last Active</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="admin-empty-state">
                    <UsersRound size={40} className="admin-empty-state__icon" />
                    <div className="admin-empty-state__title">No staff members found</div>
                    <div className="admin-empty-state__text">Try adjusting your search or filters.</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStaff.map((member, i) => {
                const cafe = getCafeById(member.cafeId);
                return (
                  <tr key={member.id} onClick={() => { setSelectedStaff(member); setDetailTab('overview'); }}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="admin-table__user-cell">
                        <div className="admin-table__avatar" style={{ background: getAvatarColor(member.name) }}>
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="admin-table__user-info">
                          <span className="admin-table__user-name">{member.name}</span>
                          <span className="admin-table__user-sub">{cafe ? cafe.name : ''} • {member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table__contact">
                        <span className="admin-table__contact-phone">{member.phone}</span>
                        <span className="admin-table__contact-email">{member.email}</span>
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
                      ) : '—'}
                    </td>
                    <td>{member.role}</td>
                    <td>{member.joinedOn}</td>
                    <td style={{ fontSize: '0.8rem' }}>{member.lastActive}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${member.status}`}>
                        <span className="admin-badge__dot" />
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ position: 'relative' }} ref={actionMenuId === member.id ? actionMenuRef : null}>
                        <button
                          className="admin-table__action-btn"
                          onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === member.id ? null : member.id); }}
                          aria-label="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {actionMenuId === member.id && (
                          <div className="admin-action-menu">
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setSelectedStaff(member); setDetailTab('overview'); setActionMenuId(null); }}>
                              <Eye size={15} /> View Details
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setSelectedStaff(member); setDetailTab('activity'); setActionMenuId(null); }}>
                              <Clock size={15} /> View Activity
                            </button>
                            <button className="admin-action-menu__item" onClick={(e) => { e.stopPropagation(); setActionMenuId(null); }}>
                              <Store size={15} /> View Café
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
        {filteredStaff.length === 0 ? (
          <div className="admin-empty-state">
            <UsersRound size={40} className="admin-empty-state__icon" />
            <div className="admin-empty-state__title">No staff found</div>
            <div className="admin-empty-state__text">Try adjusting your search or filters.</div>
          </div>
        ) : (
          filteredStaff.map((member) => {
            const cafe = getCafeById(member.cafeId);
            return (
              <div className="admin-mobile-card" key={member.id} onClick={() => { setSelectedStaff(member); setDetailTab('overview'); }}>
                <div className="admin-mobile-card__top">
                  <div className="admin-mobile-card__avatar" style={{ background: getAvatarColor(member.name) }}>
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="admin-mobile-card__info">
                    <div className="admin-mobile-card__name">{member.name}</div>
                    <div className="admin-mobile-card__sub">{cafe ? cafe.name : ''} • {member.role}</div>
                  </div>
                  <span className={`admin-badge admin-badge--${member.status}`}>
                    <span className="admin-badge__dot" />
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-mobile-card__meta">
                  {member.phone} • {member.email}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Staff Detail Panel */}
      {selectedStaff && (
        <StaffDetailPanel
          staff={selectedStaff}
          tab={detailTab}
          onTabChange={setDetailTab}
          onClose={() => setSelectedStaff(null)}
          getAvatarColor={getAvatarColor}
        />
      )}

      {/* Mobile Filter Sheet */}
      {showMobileFilters && (
        <>
          <div className="admin-sidebar-overlay" onClick={() => setShowMobileFilters(false)} />
          <div className="admin-filter-sheet">
            <div className="admin-filter-sheet__header">
              <div className="admin-filter-sheet__title">Filter</div>
              <button className="admin-filter-sheet__clear" onClick={clearMobileFilters}>Clear All</button>
            </div>

            <div className="admin-filter-sheet__field">
              <label className="admin-filter-sheet__label">Café</label>
              <select
                className="admin-form-field__select"
                value={mobileFilters.cafe}
                onChange={(e) => setMobileFilters({ ...mobileFilters, cafe: e.target.value })}
              >
                <option value="all">All Cafés</option>
                {CAFES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="admin-filter-sheet__field">
              <label className="admin-filter-sheet__label">Role</label>
              <select
                className="admin-form-field__select"
                value={mobileFilters.role}
                onChange={(e) => setMobileFilters({ ...mobileFilters, role: e.target.value })}
              >
                <option value="all">All Roles</option>
                {allRoles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="admin-filter-sheet__field">
              <label className="admin-filter-sheet__label">Status</label>
              <div className="admin-filter-sheet__radio-group">
                {['all', 'active', 'inactive'].map((s) => (
                  <div
                    key={s}
                    className={`admin-filter-sheet__radio ${mobileFilters.status === s ? 'admin-filter-sheet__radio--active' : ''}`}
                    onClick={() => setMobileFilters({ ...mobileFilters, status: s })}
                  >
                    {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            <button className="admin-filter-sheet__apply" onClick={applyMobileFilters}>
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ==================== Staff Detail Panel ==================== */
function StaffDetailPanel({ staff, tab, onTabChange, onClose, getAvatarColor }) {
  const cafe = getCafeById(staff.cafeId);

  return (
    <div className="admin-detail-panel">
      <button className="admin-detail-panel__close" onClick={onClose} aria-label="Close">
        <X size={18} />
      </button>

      <div className="admin-detail-panel__header">
        <div className="admin-detail-panel__header-title">Staff Details</div>
        <div className="admin-detail-panel__profile">
          <div className="admin-detail-panel__avatar" style={{ background: getAvatarColor(staff.name) }}>
            {staff.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="admin-detail-panel__profile-info">
            <div className="admin-detail-panel__profile-name">
              {staff.name}
              <span className={`admin-badge admin-badge--${staff.status}`} style={{ marginLeft: 4 }}>
                <span className="admin-badge__dot" />
                {staff.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="admin-detail-panel__profile-sub">{staff.role} • {cafe ? cafe.name : ''}</div>
            <div className="admin-detail-panel__profile-id">Staff ID: {staff.id}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['Overview', 'Activity', 'Café', 'Account'].map((t) => (
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
            <div className="admin-detail-section">
              <div className="admin-detail-section__title">Personal Information</div>
              <div className="admin-detail-row">
                <UsersRound size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Full Name</div>
                  <div className="admin-detail-row__value">{staff.name}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Phone size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Phone</div>
                  <div className="admin-detail-row__value">{staff.phone}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Mail size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Email</div>
                  <div className="admin-detail-row__value">{staff.email}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <MapPin size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Location</div>
                  <div className="admin-detail-row__value">{staff.location}</div>
                </div>
              </div>
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-section__title">Employment Information</div>
              {cafe && (
                <div className="admin-detail-cafe-card" style={{ marginBottom: 12 }}>
                  <div className="admin-detail-cafe-card__logo" style={{ background: cafe.color }}>
                    {cafe.name.charAt(0)}
                  </div>
                  <div className="admin-detail-cafe-card__info">
                    <div className="admin-detail-cafe-card__name">{cafe.name}</div>
                    <div className="admin-detail-cafe-card__location">{cafe.location}</div>
                  </div>
                </div>
              )}
              <div className="admin-detail-row">
                <Shield size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Role</div>
                  <div className="admin-detail-row__value">{staff.role}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Calendar size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Joined On</div>
                  <div className="admin-detail-row__value">{staff.joinedOn}</div>
                </div>
              </div>
              <div className="admin-detail-row">
                <Shield size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__label">Status</div>
                  <div className="admin-detail-row__value">
                    <span className={`admin-badge admin-badge--${staff.status}`}>
                      <span className="admin-badge__dot" />
                      {staff.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-detail-section">
              <div className="admin-detail-section__title">Last Activity</div>
              <div className="admin-detail-row">
                <Clock size={16} className="admin-detail-row__icon" />
                <div className="admin-detail-row__content">
                  <div className="admin-detail-row__value">{staff.lastActive}</div>
                  <div className="admin-detail-row__label">Last active on the system</div>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'activity' && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Activity Timeline</div>
            <div className="admin-activity-list">
              {STAFF_ACTIVITIES.map((activity) => {
                let icon, color;
                switch (activity.type) {
                  case 'login':
                    icon = <LogIn size={16} />;
                    color = '#3b82f6';
                    break;
                  case 'logout':
                    icon = <LogOut size={16} />;
                    color = '#9a9088';
                    break;
                  case 'order':
                    icon = <Coffee size={16} />;
                    color = '#e87a30';
                    break;
                  default:
                    icon = <CheckCircle2 size={16} />;
                    color = '#22c55e';
                }
                return (
                  <div className="admin-activity-item" key={activity.id}>
                    <div className="admin-activity-item__icon" style={{ background: `${color}15`, color }}>
                      {icon}
                    </div>
                    <div className="admin-activity-item__content">
                      <div className="admin-activity-item__desc">{activity.description}</div>
                      <div className="admin-activity-item__time">{activity.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'café' && cafe && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Café Information</div>
            <div className="admin-detail-cafe-card" style={{ marginBottom: 16 }}>
              <div className="admin-detail-cafe-card__logo" style={{ background: cafe.color }}>
                {cafe.name.charAt(0)}
              </div>
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
          </div>
        )}

        {tab === 'account' && (
          <div className="admin-detail-section">
            <div className="admin-detail-section__title">Account Information</div>
            <div className="admin-detail-row">
              <Lock size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Login Access</div>
                <div className="admin-detail-row__value" style={{ color: staff.loginAccess ? '#22c55e' : '#ef4444' }}>
                  {staff.loginAccess ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <div className="admin-detail-row">
              <Calendar size={16} className="admin-detail-row__icon" />
              <div className="admin-detail-row__content">
                <div className="admin-detail-row__label">Account Created</div>
                <div className="admin-detail-row__value">{staff.joinedOn}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
