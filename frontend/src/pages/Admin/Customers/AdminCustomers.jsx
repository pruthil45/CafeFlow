import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserPlus,
  RotateCw,
  MoreHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit2,
  Trash2,
  Power,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Award,
  Crown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Coffee,
  Check,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CUSTOMERS,
  CUSTOMERS_KPI,
  CUSTOMER_GROWTH_SERIES,
  TOP_CAFES_BY_CUSTOMERS,
  CUSTOMER_DISTRIBUTION_DONUT,
  CAFES,
  formatINR,
  formatNumber,
} from '../../../data/adminMockData';
import '../Admin.css';

export default function AdminCustomers() {
  const navigate = useNavigate();

  // State
  const [customersList, setCustomersList] = useState(CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [cafeFilter, setCafeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Drawer & Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [drawerTab, setDrawerTab] = useState('overview');
  const [actionMenuId, setActionMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const actionMenuRef = useRef(null);

  // Close action menu when clicking outside
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

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return customersList.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term);

      const matchesCafe =
        cafeFilter === 'all' || c.cafeId === cafeFilter || c.cafeName === cafeFilter;

      const matchesStatus =
        statusFilter === 'all' || c.status === statusFilter;

      const matchesType =
        typeFilter === 'all' || c.type === typeFilter;

      return matchesSearch && matchesCafe && matchesStatus && matchesType;
    });
  }, [customersList, searchTerm, cafeFilter, statusFilter, typeFilter]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCafeFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  // Status toggle
  const handleToggleStatus = (cust) => {
    setCustomersList((prev) =>
      prev.map((item) => {
        if (item.id === cust.id) {
          const nextStatus = item.status === 'active' ? 'inactive' : 'active';
          setToastMessage(
            `Customer "${item.name}" marked as ${nextStatus.toUpperCase()}`
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    setActionMenuId(null);
  };

  // Delete customer
  const handleDeleteCustomer = (cust) => {
    setCustomersList((prev) => prev.filter((item) => item.id !== cust.id));
    if (selectedCustomer?.id === cust.id) {
      setSelectedCustomer(null);
    }
    setToastMessage(`Customer "${cust.name}" removed.`);
    setActionMenuId(null);
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setToastMessage(`Message sent to ${selectedCustomer?.name || 'Customer'}!`);
    setMessageText('');
    setShowMessageModal(false);
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
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">
            Manage and view customers across your café platform.
          </p>
        </div>
        <button
          className="admin-btn-primary"
          onClick={() => setShowAddModal(true)}
          id="btn-add-customer"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Total Customers</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--brand">
              <Users size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(CUSTOMERS_KPI.totalCustomers.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CUSTOMERS_KPI.totalCustomers.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Active Customers</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--success">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(CUSTOMERS_KPI.activeCustomers.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CUSTOMERS_KPI.activeCustomers.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">New Customers</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--info">
              <UserPlus size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(CUSTOMERS_KPI.newCustomers.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CUSTOMERS_KPI.newCustomers.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Returning Customers</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--warning">
              <RotateCw size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(CUSTOMERS_KPI.returningCustomers.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {CUSTOMERS_KPI.returningCustomers.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>
      </div>

      {/* Row 2: Customer Growth Chart + Top Café by Customers + Customer Distribution Donut */}
      <div className="admin-charts-grid-3col" style={{ marginTop: 24 }}>
        {/* Customer Growth Chart */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Customer Growth</h3>
            <span className="admin-pill-badge">Last 9 Months</span>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CUSTOMER_GROWTH_SERIES}>
                <defs>
                  <linearGradient id="custGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#983B16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#983B16" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="month" stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#983B16" strokeWidth={2.5} fill="url(#custGrowthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Café by Customers (Horizontal Bar Chart) */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Top Café by Customers</h3>
          </div>
          <div className="admin-peak-hours-list" style={{ marginTop: 10 }}>
            {TOP_CAFES_BY_CUSTOMERS.map((item) => (
              <div key={item.name} className="admin-peak-row">
                <span className="admin-peak-label" style={{ width: 110, fontSize: '0.8rem' }}>
                  {item.name}
                </span>
                <div className="admin-peak-bar-track">
                  <div
                    className="admin-peak-bar-fill"
                    style={{
                      width: `${(item.count / 3842) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
                <span className="admin-peak-val" style={{ width: 44 }}>
                  {formatNumber(item.count)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Distribution Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Customer Distribution</h3>
          </div>
          <div className="admin-donut-container">
            <div style={{ width: 160, height: 160, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CUSTOMER_DISTRIBUTION_DONUT}
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CUSTOMER_DISTRIBUTION_DONUT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatNumber(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-donut-center">
                <span className="admin-donut-center__val" style={{ fontSize: '0.95rem' }}>
                  12,842
                </span>
                <span className="admin-donut-center__label">Customers</span>
              </div>
            </div>

            <div className="admin-donut-legend">
              {CUSTOMER_DISTRIBUTION_DONUT.map((item) => (
                <div key={item.name} className="admin-donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: item.color,
                        display: 'inline-block',
                      }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <strong>{item.percent}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="admin-filter-bar" style={{ marginTop: 24 }}>
        <div className="admin-search-wrap">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by name, mobile, email or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-customers-input"
          />
        </div>

        <div className="admin-filters-group">
          <select
            className="admin-filter-select"
            value={cafeFilter}
            onChange={(e) => setCafeFilter(e.target.value)}
          >
            <option value="all">All Cafés</option>
            {CAFES.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Customer Type</option>
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
          </select>

          <button className="admin-btn-outline" onClick={handleResetFilters}>
            Reset
          </button>
        </div>

        <button
          className="admin-mobile-filter-btn"
          onClick={() => setMobileFilterOpen(true)}
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Split Layout: Table + Right Drawer */}
      <div className={`admin-split-layout ${selectedCustomer ? 'admin-split-layout--drawer-open' : ''}`}>
        <div className="admin-split-layout__main">
          {/* Desktop Table */}
          <div className="admin-table-container admin-table-desktop">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>#</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Café</th>
                  <th>Orders</th>
                  <th>Total Spending</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th style={{ width: 50, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="admin-table-empty">
                      No customers found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust, index) => {
                    const isSelected = selectedCustomer?.id === cust.id;
                    return (
                      <tr
                        key={cust.id}
                        className={isSelected ? 'admin-row--selected' : ''}
                        onClick={() => setSelectedCustomer(cust)}
                      >
                        <td className="admin-table-index">{index + 1}</td>
                        <td>
                          <div className="admin-entity-cell">
                            <div className="admin-avatar">
                              {cust.name.charAt(0)}
                            </div>
                            <div>
                              <div className="admin-entity-name">{cust.name}</div>
                              <div className="admin-entity-sub">{cust.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="admin-text-bold">{cust.phone}</div>
                            <div className="admin-text-muted">{cust.email}</div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-entity-cell">
                            <div className="admin-cafe-badge admin-cafe-badge--small">
                              {cust.cafeName.charAt(0)}
                            </div>
                            <span className="admin-text-bold">{cust.cafeName}</span>
                          </div>
                        </td>
                        <td>{cust.orders}</td>
                        <td className="admin-text-bold">{formatINR(cust.totalSpending)}</td>
                        <td className="admin-text-muted">{cust.lastVisit}</td>
                        <td>
                          <span
                            className={`admin-status-pill admin-status-pill--${cust.status}`}
                          >
                            <span className="admin-status-dot" />
                            {cust.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {cust.type === 'VIP' ? (
                            <span className="admin-type-pill admin-type-pill--vip">
                              <Crown size={12} /> VIP
                            </span>
                          ) : (
                            <span className="admin-type-pill admin-type-pill--regular">
                              Regular
                            </span>
                          )}
                        </td>
                        <td
                          style={{ textAlign: 'center' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="admin-action-wrap">
                            <button
                              className="admin-action-btn"
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === cust.id ? null : cust.id
                                )
                              }
                              aria-label="Actions"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {actionMenuId === cust.id && (
                              <div
                                className="admin-dropdown-menu"
                                ref={actionMenuRef}
                              >
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    setSelectedCustomer(cust);
                                    setDrawerTab('overview');
                                    setActionMenuId(null);
                                  }}
                                >
                                  <Eye size={15} /> View Customer
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    setSelectedCustomer(cust);
                                    setDrawerTab('orders');
                                    setActionMenuId(null);
                                  }}
                                >
                                  <ShoppingBag size={15} /> View Orders
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => {
                                    setSelectedCustomer(cust);
                                    setDrawerTab('loyalty');
                                    setActionMenuId(null);
                                  }}
                                >
                                  <Award size={15} /> View Loyalty
                                </button>
                                <button
                                  className="admin-dropdown-item"
                                  onClick={() => handleToggleStatus(cust)}
                                >
                                  <Power size={15} />
                                  {cust.status === 'active'
                                    ? 'Deactivate Customer'
                                    : 'Activate Customer'}
                                </button>
                                <div className="admin-dropdown-divider" />
                                <button
                                  className="admin-dropdown-item admin-dropdown-item--danger"
                                  onClick={() => handleDeleteCustomer(cust)}
                                >
                                  <Trash2 size={15} /> Delete Customer
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
          <div className="admin-cards-mobile">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="admin-card-item"
                onClick={() => setSelectedCustomer(cust)}
              >
                <div className="admin-card-item__top">
                  <div className="admin-entity-cell">
                    <div className="admin-avatar">{cust.name.charAt(0)}</div>
                    <div>
                      <div className="admin-entity-name">{cust.name}</div>
                      <div className="admin-entity-sub">
                        {cust.cafeName} • {cust.orders} orders
                      </div>
                    </div>
                  </div>
                  <span
                    className={`admin-status-pill admin-status-pill--${cust.status}`}
                  >
                    {cust.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-card-item__metrics">
                  <div>
                    <div className="admin-metric-label">Spending</div>
                    <div className="admin-metric-value">
                      {formatINR(cust.totalSpending)}
                    </div>
                  </div>
                  <div>
                    <div className="admin-metric-label">Last Visit</div>
                    <div className="admin-metric-value">{cust.lastVisit}</div>
                  </div>
                  <div>
                    <div className="admin-metric-label">Type</div>
                    <div className="admin-metric-value">{cust.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="admin-pagination">
            <span className="admin-pagination__info">
              Showing 1–{filteredCustomers.length} of {customersList.length} customers
            </span>
            <div className="admin-pagination__controls">
              <button className="admin-pagination__btn" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="admin-pagination__btn admin-pagination__btn--active">
                1
              </button>
              <button className="admin-pagination__btn">2</button>
              <button className="admin-pagination__btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Detail Panel / Drawer */}
        {selectedCustomer && (
          <aside className="admin-detail-drawer">
            {/* Header */}
            <div className="admin-detail-drawer__header">
              <div className="admin-entity-cell">
                <div className="admin-avatar admin-avatar--large">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="admin-drawer-title-row">
                    <h2 className="admin-drawer-title">
                      {selectedCustomer.name}
                    </h2>
                    <span
                      className={`admin-status-pill admin-status-pill--${selectedCustomer.status}`}
                    >
                      {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="admin-entity-sub">
                    Customer ID: {selectedCustomer.id} • Since {selectedCustomer.since}
                  </div>
                </div>
              </div>
              <button
                className="admin-drawer-close"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="admin-drawer-tabs">
              <button
                className={`admin-drawer-tab ${drawerTab === 'overview' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDrawerTab('overview')}
              >
                Overview
              </button>
              <button
                className={`admin-drawer-tab ${drawerTab === 'orders' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDrawerTab('orders')}
              >
                Orders
              </button>
              <button
                className={`admin-drawer-tab ${drawerTab === 'activity' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDrawerTab('activity')}
              >
                Activity
              </button>
              <button
                className={`admin-drawer-tab ${drawerTab === 'loyalty' ? 'admin-drawer-tab--active' : ''}`}
                onClick={() => setDrawerTab('loyalty')}
              >
                Loyalty
              </button>
            </div>

            {/* Body */}
            <div className="admin-drawer-body">
              {drawerTab === 'overview' && (
                <>
                  {/* Contact Info */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Contact Information
                      </span>
                      <button className="admin-link-btn">
                        <Edit2 size={13} /> Edit
                      </button>
                    </div>
                    <div className="admin-info-list">
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Phone size={14} /> Phone
                        </span>
                        <span className="admin-info-val">{selectedCustomer.phone}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <Mail size={14} /> Email
                        </span>
                        <span className="admin-info-val">{selectedCustomer.email}</span>
                      </div>
                      <div className="admin-info-row">
                        <span className="admin-info-label">
                          <MapPin size={14} /> Location
                        </span>
                        <span className="admin-info-val">{selectedCustomer.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Statistics */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">
                        Customer Statistics
                      </span>
                    </div>
                    <div className="admin-stat-tiles-grid">
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {selectedCustomer.orders}
                        </span>
                        <span className="admin-stat-tile__label">Total Orders</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {formatINR(selectedCustomer.totalSpending)}
                        </span>
                        <span className="admin-stat-tile__label">Total Spending</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          {selectedCustomer.totalVisits}
                        </span>
                        <span className="admin-stat-tile__label">Total Visits</span>
                      </div>
                      <div className="admin-stat-tile">
                        <span className="admin-stat-tile__value">
                          ₹{selectedCustomer.avgOrderValue}
                        </span>
                        <span className="admin-stat-tile__label">Avg Order Value</span>
                      </div>
                    </div>
                  </div>

                  {/* Café Activity */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">Café Activity</span>
                    </div>
                    <div className="admin-cafe-activity-list">
                      {selectedCustomer.cafeActivity?.map((act) => (
                        <div key={act.cafeName} className="admin-cafe-act-row">
                          <div className="admin-cafe-act-left">
                            <span className="admin-text-bold">{act.cafeName}</span>
                            <span className="admin-text-muted">
                              {act.orders} orders • {formatINR(act.spending)}
                            </span>
                          </div>
                          <div className="admin-cafe-act-bar-wrap">
                            <div
                              className="admin-cafe-act-bar-fill"
                              style={{ width: `${act.percent}%` }}
                            />
                            <span className="admin-cafe-act-percent">
                              {act.percent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="admin-drawer-section">
                    <div className="admin-drawer-section__header">
                      <span className="admin-drawer-section__title">Recent Orders</span>
                      <button
                        className="admin-link-btn"
                        onClick={() => setDrawerTab('orders')}
                      >
                        View All →
                      </button>
                    </div>
                    <div className="admin-orders-compact-list">
                      {selectedCustomer.recentOrders?.slice(0, 3).map((ord) => (
                        <div key={ord.id} className="admin-order-compact-item">
                          <div className="admin-order-compact-left">
                            <span className="admin-text-bold">{ord.id}</span>
                            <span className="admin-text-muted">{ord.date}</span>
                            <span className="admin-order-item-desc">{ord.item}</span>
                          </div>
                          <div className="admin-order-compact-right">
                            <span className="admin-text-bold">{formatINR(ord.amount)}</span>
                            <span
                              className={`admin-status-pill admin-status-pill--${ord.status === 'Completed' ? 'active' : 'inactive'}`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ORDERS TAB */}
              {drawerTab === 'orders' && (
                <div className="admin-drawer-section">
                  <div className="admin-drawer-section__header">
                    <span className="admin-drawer-section__title">All Orders History</span>
                    <span className="admin-text-muted">
                      {selectedCustomer.recentOrders?.length || 0} Orders
                    </span>
                  </div>
                  <div className="admin-orders-compact-list" style={{ marginTop: 12 }}>
                    {selectedCustomer.recentOrders?.map((ord) => (
                      <div key={ord.id} className="admin-order-compact-item">
                        <div className="admin-order-compact-left">
                          <span className="admin-text-bold">{ord.id}</span>
                          <span className="admin-text-muted">{ord.date}</span>
                          <span className="admin-order-item-desc">{ord.item}</span>
                        </div>
                        <div className="admin-order-compact-right">
                          <span className="admin-text-bold">{formatINR(ord.amount)}</span>
                          <span
                            className={`admin-status-pill admin-status-pill--${ord.status === 'Completed' ? 'active' : 'inactive'}`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVITY TAB */}
              {drawerTab === 'activity' && (
                <div className="admin-drawer-section">
                  <div className="admin-drawer-section__header">
                    <span className="admin-drawer-section__title">
                      Activity Timeline
                    </span>
                  </div>
                  <div className="admin-activity-timeline" style={{ marginTop: 12 }}>
                    {selectedCustomer.activityTimeline?.map((item) => (
                      <div key={item.id} className="admin-activity-item">
                        <div className="admin-activity-dot" />
                        <div>
                          <div className="admin-activity-title">{item.title}</div>
                          <div className="admin-text-muted" style={{ fontSize: '0.8rem' }}>
                            {item.desc}
                          </div>
                          <div className="admin-activity-time">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LOYALTY TAB */}
              {drawerTab === 'loyalty' && (
                <div className="admin-drawer-section">
                  <div className="admin-loyalty-card">
                    <div className="admin-loyalty-card__header">
                      <div className="admin-loyalty-icon-badge">
                        <Award size={20} />
                      </div>
                      <div>
                        <div className="admin-loyalty-tier">
                          {selectedCustomer.loyaltyTier}
                        </div>
                        <div className="admin-loyalty-points">
                          {formatNumber(selectedCustomer.loyaltyPoints)} Points
                        </div>
                      </div>
                    </div>

                    <div className="admin-loyalty-progress-wrap">
                      <div className="admin-loyalty-progress-bar">
                        <div
                          className="admin-loyalty-progress-fill"
                          style={{
                            width: `${(selectedCustomer.loyaltyPoints / selectedCustomer.loyaltyTarget) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="admin-loyalty-progress-meta">
                        <span>
                          {selectedCustomer.loyaltyPoints} / {selectedCustomer.loyaltyTarget}
                        </span>
                        <span>Next: {selectedCustomer.nextTier}</span>
                      </div>
                    </div>

                    <div className="admin-loyalty-benefits">
                      <div className="admin-loyalty-benefits-title">
                        Tier Benefits
                      </div>
                      <div className="admin-benefit-row">
                        <Check size={14} color="#22c55e" />
                        <span>Earn 1 point per ₹10 spent</span>
                      </div>
                      <div className="admin-benefit-row">
                        <Check size={14} color="#22c55e" />
                        <span>Special birthday complimentary drink</span>
                      </div>
                      <div className="admin-benefit-row">
                        <Check size={14} color="#22c55e" />
                        <span>Exclusive member discounts (10% off)</span>
                      </div>
                      <div className="admin-benefit-row">
                        <Check size={14} color="#22c55e" />
                        <span>Early access to seasonal promotional menus</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="admin-drawer-footer">
              <button
                className="admin-btn-primary"
                style={{ width: '100%' }}
                onClick={() => setShowMessageModal(true)}
              >
                <Send size={15} /> Message Customer
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* MESSAGE CUSTOMER MODAL */}
      {showMessageModal && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm-dialog" style={{ maxWidth: 440 }}>
            <h3 className="admin-confirm-dialog__title">
              Message {selectedCustomer?.name}
            </h3>
            <p className="admin-confirm-dialog__desc">
              Send an SMS / WhatsApp message to{' '}
              <strong>{selectedCustomer?.phone}</strong>.
            </p>
            <textarea
              className="admin-form-textarea"
              rows={3}
              placeholder="Type your message or promotional offer..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ width: '100%', marginTop: 12 }}
              autoFocus
            />
            <div className="admin-confirm-dialog__actions" style={{ marginTop: 16 }}>
              <button
                className="admin-btn-outline"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={handleSendMessage}>
                <Send size={15} /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newCust) => {
            setCustomersList([newCust, ...customersList]);
            setShowAddModal(false);
            setToastMessage(`Customer "${newCust.name}" added successfully.`);
          }}
        />
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
              <label className="admin-form-label">Café</label>
              <select
                className="admin-form-input"
                value={cafeFilter}
                onChange={(e) => setCafeFilter(e.target.value)}
              >
                <option value="all">All Cafés</option>
                {CAFES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label className="admin-form-label" style={{ marginTop: 12 }}>
                Status
              </label>
              <select
                className="admin-form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <label className="admin-form-label" style={{ marginTop: 12 }}>
                Customer Type
              </label>
              <select
                className="admin-form-input"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Customer Type</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
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
 * Add Customer Modal (Compatible with QR/Phone Auth model)
 */
function AddCustomerModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCafeId, setSelectedCafeId] = useState(CAFES[0].id);
  const [type, setType] = useState('Regular');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter Customer Name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const cafe = CAFES.find((c) => c.id === selectedCafeId) || CAFES[0];
    const newId = `CUST-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newCustomer = {
      id: newId,
      name,
      avatar: null,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      location: `${cafe.city}, ${cafe.state}, India`,
      cafeId: cafe.id,
      cafeName: cafe.name,
      orders: 0,
      totalSpending: 0,
      totalVisits: 1,
      avgOrderValue: 0,
      lastVisit: 'Just now',
      status: 'active',
      type,
      since: 'Today',
      loyaltyTier: type === 'VIP' ? 'Platinum Member' : 'Bronze Member',
      loyaltyPoints: type === 'VIP' ? 2500 : 100,
      loyaltyTarget: 5000,
      nextTier: type === 'VIP' ? 'Diamond' : 'Silver',
      cafeActivity: [{ cafeName: cafe.name, orders: 0, spending: 0, percent: 100 }],
      recentOrders: [],
      activityTimeline: [
        { id: 1, title: 'Profile Created', desc: 'Registered in system', time: 'Just now', icon: 'user' },
      ],
    };

    onAdd(newCustomer);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-confirm-dialog" style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-confirm-dialog__title" style={{ margin: 0 }}>
            Add Customer
          </h3>
          <button className="admin-drawer-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="admin-form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label className="admin-form-label">Full Name *</label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. Ananya Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">Mobile Number *</label>
            <input
              type="tel"
              className="admin-form-input"
              placeholder="10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">Email Address</label>
            <input
              type="email"
              className="admin-form-input"
              placeholder="ananya@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">Primary Café</label>
            <select
              className="admin-form-input"
              value={selectedCafeId}
              onChange={(e) => setSelectedCafeId(e.target.value)}
            >
              {CAFES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.location})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label">Customer Type</label>
            <select
              className="admin-form-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="admin-confirm-dialog__actions" style={{ marginTop: 20 }}>
            <button type="button" className="admin-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              <Check size={16} /> Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
