import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Download,
  IndianRupee,
  ShoppingBag,
  Users,
  ShoppingCart,
  Store,
  MapPin,
  Calendar,
  Edit2,
  Check,
  ChevronDown,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CAFES,
  getCafeAnalyticsData,
  formatINR,
  formatNumber,
} from '../../../data/adminMockData';
import '../Admin.css';

export default function AdminCafeAnalytics() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read selected cafe from query param or default to 'CAF-001'
  const cafeParam = searchParams.get('cafe') || 'CAF-001';
  const [selectedCafeId, setSelectedCafeId] = useState(cafeParam);
  const [dateRangeTab, setDateRangeTab] = useState('30D');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state with URL parameter
  useEffect(() => {
    if (cafeParam && cafeParam !== selectedCafeId) {
      setSelectedCafeId(cafeParam);
    }
  }, [cafeParam, selectedCafeId]);

  const handleSelectCafe = (id) => {
    setSelectedCafeId(id);
    setSearchParams({ cafe: id });
  };

  // Find café entity and analytics data
  const currentCafe = useMemo(() => {
    return CAFES.find((c) => c.id === selectedCafeId) || CAFES[0];
  }, [selectedCafeId]);

  const analytics = useMemo(() => {
    return getCafeAnalyticsData(currentCafe.id);
  }, [currentCafe.id]);

  // Export mock report
  const handleExport = () => {
    setToastMessage(`Exporting Performance Report for ${currentCafe.name}...`);
    setTimeout(() => {
      setToastMessage('Report exported successfully! Check your downloads.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 900);
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
          <h1 className="admin-page-title">Café Analytics</h1>
          <p className="admin-page-subtitle">
            Detailed analytics and performance for each café
          </p>
        </div>
        <button
          className="admin-btn-outline"
          onClick={handleExport}
          id="btn-export-cafe"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Café Selector & Date Range Toolbar */}
      <div className="admin-filter-bar admin-cafe-analytics-toolbar">
        {/* Café Selector Dropdown with Logo Preview */}
        <div className="admin-cafe-selector-wrap">
          <div
            className="admin-cafe-badge admin-cafe-badge--small"
            style={{ backgroundColor: currentCafe.color || '#D4A04A' }}
          >
            {currentCafe.name.charAt(0)}
          </div>
          <div className="admin-cafe-selector-info">
            <select
              className="admin-cafe-select"
              value={currentCafe.id}
              onChange={(e) => handleSelectCafe(e.target.value)}
              id="cafe-selector-dropdown"
            >
              {CAFES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.location}
                </option>
              ))}
            </select>
          </div>
          <ChevronDown size={14} className="admin-cafe-selector-chevron" />
        </div>

        {/* Date Filter Pills */}
        <div className="admin-date-pills">
          {['7D', '30D', '3M', '6M', '1Y'].map((tab) => (
            <button
              key={tab}
              className={`admin-date-pill ${dateRangeTab === tab ? 'admin-date-pill--active' : ''}`}
              onClick={() => setDateRangeTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner: Café Information Card */}
      <div className="admin-cafe-info-card">
        <div className="admin-cafe-info-card__left">
          <div
            className="admin-cafe-badge admin-cafe-badge--hero"
            style={{ backgroundColor: currentCafe.color || '#D4A04A' }}
          >
            {currentCafe.name.charAt(0)}
          </div>
          <div>
            <div className="admin-drawer-title-row">
              <h2 className="admin-drawer-title" style={{ fontSize: '1.25rem' }}>
                {currentCafe.name}
              </h2>
              <span
                className={`admin-status-pill admin-status-pill--${currentCafe.status}`}
              >
                {currentCafe.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="admin-cafe-info-meta">
              <span>{currentCafe.tables} tables</span>
              <span>•</span>
              <span>{currentCafe.staff} staff</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} /> {currentCafe.location}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={13} /> Joined {currentCafe.createdAt}
              </span>
            </div>
          </div>
        </div>
        <button
          className="admin-btn-outline"
          onClick={() => navigate(`/admin/cafes`)}
        >
          <Edit2 size={14} /> Edit Café
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="admin-kpi-grid" style={{ marginTop: 20 }}>
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Total Revenue</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--brand">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatINR(analytics.kpis.totalRevenue.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {analytics.kpis.totalRevenue.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Total Orders</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--info">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(analytics.kpis.totalOrders.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {analytics.kpis.totalOrders.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Total Customers</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--success">
              <Users size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            {formatNumber(analytics.kpis.totalCustomers.value)}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {analytics.kpis.totalCustomers.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-card__header">
            <span className="admin-kpi-card__title">Avg. Order Value</span>
            <div className="admin-kpi-card__icon admin-kpi-card__icon--warning">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="admin-kpi-card__value">
            ₹{analytics.kpis.avgOrderValue.value}
          </div>
          <div className="admin-kpi-card__footer">
            <span className="admin-growth-pill admin-growth-pill--up">
              ↑ {analytics.kpis.avgOrderValue.growth}%
            </span>
            <span className="admin-kpi-card__comparison">vs last month</span>
          </div>
        </div>
      </div>

      {/* Row 2: Revenue Trend + Orders Trend + Customer Growth */}
      <div className="admin-charts-grid-3col" style={{ marginTop: 24 }}>
        {/* Revenue Trend */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Revenue Trend</h3>
              <div className="admin-chart-card__hero-metric" style={{ fontSize: '1.25rem' }}>
                {formatINR(analytics.kpis.totalRevenue.value)}
                <span className="admin-growth-pill admin-growth-pill--up" style={{ marginLeft: 6 }}>
                  ↑ 18%
                </span>
              </div>
            </div>
            <span className="admin-pill-badge">{dateRangeTab}</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueTrend}>
                <defs>
                  <linearGradient id="cafeRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#983B16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#983B16" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="date" stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(val) => formatINR(val)} />
                <Area type="monotone" dataKey="value" stroke="#983B16" strokeWidth={2.5} fill="url(#cafeRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Orders Trend</h3>
              <div className="admin-chart-card__hero-metric" style={{ fontSize: '1.25rem' }}>
                {formatNumber(analytics.kpis.totalOrders.value)}
                <span className="admin-growth-pill admin-growth-pill--up" style={{ marginLeft: 6 }}>
                  ↑ 12%
                </span>
              </div>
            </div>
            <span className="admin-pill-badge">{dateRangeTab}</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="date" stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#D4A04A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Customer Growth</h3>
              <div className="admin-chart-card__hero-metric" style={{ fontSize: '1.25rem' }}>
                {formatNumber(analytics.kpis.totalCustomers.value)}
                <span className="admin-growth-pill admin-growth-pill--up" style={{ marginLeft: 6 }}>
                  ↑ 14%
                </span>
              </div>
            </div>
            <div className="admin-chart-legend">
              <span className="admin-chart-legend-item">
                <span className="admin-legend-dot" style={{ background: '#983B16' }} /> New
              </span>
              <span className="admin-chart-legend-item">
                <span className="admin-legend-dot" style={{ background: '#D4A04A' }} /> Returning
              </span>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="date" stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip />
                <Bar dataKey="new" fill="#983B16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returning" fill="#D4A04A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Popular Items + Orders by Category + Peak Ordering Hours + Growth Comparison */}
      <div className="admin-charts-grid-4col" style={{ marginTop: 24 }}>
        {/* Popular Items */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Popular Items</h3>
            <button className="admin-link-btn">View All →</button>
          </div>
          <table className="admin-table admin-table--compact">
            <thead>
              <tr>
                <th style={{ width: 28 }}>#</th>
                <th>Item</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.popularItems.map((item) => (
                <tr key={item.name}>
                  <td className="admin-table-index">{item.rank}</td>
                  <td>
                    <span className="admin-text-bold">{item.name}</span>
                  </td>
                  <td>{formatNumber(item.orders)}</td>
                  <td className="admin-text-bold">{formatINR(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders by Category Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Orders by Category</h3>
          </div>
          <div className="admin-donut-container">
            <div style={{ width: 150, height: 150, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.ordersByCategory}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.ordersByCategory.map((entry, index) => (
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
                <span className="admin-donut-center__label">Total Orders</span>
              </div>
            </div>

            <div className="admin-donut-legend">
              {analytics.ordersByCategory.map((item) => (
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

        {/* Peak Ordering Hours */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Peak Ordering Hours</h3>
          </div>
          <div className="admin-peak-hours-list">
            {analytics.peakHours.map((slot) => {
              const maxVal = 754;
              const barWidth = Math.round((slot.orders / maxVal) * 100);
              return (
                <div key={slot.hour} className="admin-peak-row">
                  <span className="admin-peak-label">{slot.hour}</span>
                  <div className="admin-peak-bar-track">
                    <div
                      className="admin-peak-bar-fill"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="admin-peak-val">{slot.orders}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Comparison Mini Cards */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Growth Comparison</h3>
          </div>
          <div className="admin-growth-comp-list">
            <div className="admin-growth-comp-item">
              <div>
                <span className="admin-metric-label">Revenue</span>
                <span className="admin-growth-pill admin-growth-pill--up" style={{ display: 'inline-block', marginTop: 4 }}>
                  ↑ {analytics.growthComparison.revenue.growth}%
                </span>
              </div>
              <div style={{ width: 70, height: 30 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.growthComparison.revenue.trend.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="admin-growth-comp-item">
              <div>
                <span className="admin-metric-label">Orders</span>
                <span className="admin-growth-pill admin-growth-pill--up" style={{ display: 'inline-block', marginTop: 4 }}>
                  ↑ {analytics.growthComparison.orders.growth}%
                </span>
              </div>
              <div style={{ width: 70, height: 30 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.growthComparison.orders.trend.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="admin-growth-comp-item">
              <div>
                <span className="admin-metric-label">Customers</span>
                <span className="admin-growth-pill admin-growth-pill--up" style={{ display: 'inline-block', marginTop: 4 }}>
                  ↑ {analytics.growthComparison.customers.growth}%
                </span>
              </div>
              <div style={{ width: 70, height: 30 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.growthComparison.customers.trend.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#e87a30" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="admin-growth-comp-item">
              <div>
                <span className="admin-metric-label">Avg. Order Value</span>
                <span className="admin-growth-pill admin-growth-pill--up" style={{ display: 'inline-block', marginTop: 4 }}>
                  ↑ {analytics.growthComparison.avgOrderValue.growth}%
                </span>
              </div>
              <div style={{ width: 70, height: 30 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.growthComparison.avgOrderValue.trend.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke="#983b16" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
