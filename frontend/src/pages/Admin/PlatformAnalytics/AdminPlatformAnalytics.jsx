import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  IndianRupee,
  ShoppingBag,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Store,
  Calendar,
  Filter,
  Check,
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
  PLATFORM_KPI,
  PLATFORM_GROWTH_SERIES,
  PLATFORM_REVENUE_CURVE,
  PLATFORM_ORDERS_BARS,
  PLATFORM_NEW_RETURNING_DONUT,
  PLATFORM_ORDER_DISTRIBUTION_DONUT,
  TOP_PERFORMING_CAFES,
  CAFE_PERFORMANCE_TABLE,
  TOP_CITIES_BREAKDOWN,
  CUSTOMER_GROWTH_SERIES,
  formatINR,
  formatNumber,
} from '../../../data/adminMockData';
import '../Admin.css';

export default function AdminPlatformAnalytics() {
  const navigate = useNavigate();

  // Filters state
  const [dateRange, setDateRange] = useState('30d');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic multiplier based on dateRange selection
  const multiplier = useMemo(() => {
    if (dateRange === '7d') return 0.28;
    if (dateRange === '3m') return 2.8;
    if (dateRange === '1y') return 11.2;
    return 1; // 30d
  }, [dateRange]);

  const displayKpi = useMemo(() => {
    return {
      revenue: Math.round(PLATFORM_KPI.totalRevenue.value * multiplier),
      orders: Math.round(PLATFORM_KPI.totalOrders.value * multiplier),
      customers: Math.round(PLATFORM_KPI.totalCustomers.value * (multiplier > 1 ? 1.4 : multiplier)),
      aov: PLATFORM_KPI.avgOrderValue.value,
    };
  }, [multiplier]);

  // Dynamic filtered tables by city
  const filteredTopCafes = useMemo(() => {
    if (selectedCityFilter === 'all') return TOP_PERFORMING_CAFES;
    return TOP_PERFORMING_CAFES.filter((c) =>
      c.location?.toLowerCase().includes(selectedCityFilter.toLowerCase())
    );
  }, [selectedCityFilter]);

  const filteredCafePerformance = useMemo(() => {
    if (selectedCityFilter === 'all') return CAFE_PERFORMANCE_TABLE;
    return CAFE_PERFORMANCE_TABLE.filter((c) =>
      c.location?.toLowerCase().includes(selectedCityFilter.toLowerCase())
    );
  }, [selectedCityFilter]);

  // Export mock report
  const handleExportReport = () => {
    setToastMessage('Exporting Platform Analytics Report (PDF / CSV)...');
    setTimeout(() => {
      setToastMessage('Report exported successfully! Check your downloads.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  return (
    <div className="admin-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header — Aligned exactly to Image 2 */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform Analytics</h1>
          <p className="admin-page-subtitle">
            Overview of all cafés across your platform
          </p>

          {/* Styled Pill Filter Dropdowns directly underneath subtitle */}
          <div className="admin-platform-filters">
            <select
              className="admin-filter-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              id="filter-date-range"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="1y">This Year</option>
            </select>

            <select
              className="admin-filter-select"
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              id="filter-city"
            >
              <option value="all">All Cities</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Rajkot">Rajkot</option>
            </select>
          </div>
        </div>

        <button
          className="admin-btn-outline"
          onClick={handleExportReport}
          id="btn-export-platform"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Top Section: KPI Grid + Platform Growth Card */}
      <div className="admin-analytics-top-grid">
        {/* 4 KPI Cards */}
        <div className="admin-kpi-grid admin-kpi-grid--2x2">
          <div className="admin-kpi-card">
            <div className="admin-kpi-card__header">
              <span className="admin-kpi-card__title">Total Revenue</span>
              <div className="admin-kpi-card__icon admin-kpi-card__icon--brand">
                <IndianRupee size={20} />
              </div>
            </div>
            <div className="admin-kpi-card__value">
              {formatINR(displayKpi.revenue)}
            </div>
            <div className="admin-kpi-card__footer">
              <span className="admin-growth-pill admin-growth-pill--up">
                ↑ {PLATFORM_KPI.totalRevenue.growth}%
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
              {formatNumber(displayKpi.orders)}
            </div>
            <div className="admin-kpi-card__footer">
              <span className="admin-growth-pill admin-growth-pill--up">
                ↑ {PLATFORM_KPI.totalOrders.growth}%
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
              {formatNumber(displayKpi.customers)}
            </div>
            <div className="admin-kpi-card__footer">
              <span className="admin-growth-pill admin-growth-pill--up">
                ↑ {PLATFORM_KPI.totalCustomers.growth}%
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
            <div className="admin-kpi-card__value">₹{displayKpi.aov}</div>
            <div className="admin-kpi-card__footer">
              <span className="admin-growth-pill admin-growth-pill--up">
                ↑ {PLATFORM_KPI.avgOrderValue.growth}%
              </span>
              <span className="admin-kpi-card__comparison">vs last month</span>
            </div>
          </div>
        </div>

        {/* Platform Growth Chart Card */}
        <div className="admin-chart-card admin-chart-card--growth">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Platform Growth</h3>
              <div className="admin-chart-legend">
                <span className="admin-chart-legend-item">
                  <span className="admin-legend-dot" style={{ background: '#983B16' }} />
                  Revenue
                </span>
                <span className="admin-chart-legend-item">
                  <span className="admin-legend-dot" style={{ background: '#D4A04A' }} />
                  Orders
                </span>
                <span className="admin-chart-legend-item">
                  <span className="admin-legend-dot" style={{ background: '#4A8FD4' }} />
                  Customers
                </span>
              </div>
            </div>
            <span className="admin-text-muted" style={{ fontSize: '0.8rem' }}>
              Last 6 Months
            </span>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_GROWTH_SERIES}>
                <defs>
                  <linearGradient id="growthRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#983B16" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#983B16" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="month" stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#983B16" strokeWidth={2.5} fill="url(#growthRev)" />
                <Area type="monotone" dataKey="orders" stroke="#D4A04A" strokeWidth={2} fill="transparent" />
                <Area type="monotone" dataKey="customers" stroke="#4A8FD4" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Section: Revenue Overview + Orders Overview */}
      <div className="admin-charts-grid-2col" style={{ marginTop: 24 }}>
        {/* Revenue Overview */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Revenue Overview</h3>
              <div className="admin-chart-card__hero-metric">
                {formatINR(displayKpi.revenue)}
                <span className="admin-growth-pill admin-growth-pill--up" style={{ marginLeft: 8 }}>
                  ↑ 28% from last month
                </span>
              </div>
            </div>
            <span className="admin-pill-badge">Last 30 Days</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PLATFORM_REVENUE_CURVE}>
                <defs>
                  <linearGradient id="revCurve" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A04A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#D4A04A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="date" stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(val) => formatINR(val)} />
                <Area type="monotone" dataKey="value" stroke="#983B16" strokeWidth={3} fill="url(#revCurve)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Overview */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Orders Overview</h3>
              <div className="admin-chart-card__hero-metric">
                {formatNumber(displayKpi.orders)}
                <span className="admin-growth-pill admin-growth-pill--up" style={{ marginLeft: 8 }}>
                  ↑ 22% from last month
                </span>
              </div>
            </div>
            <div className="admin-chart-legend">
              <span className="admin-chart-legend-item">
                <span className="admin-legend-dot" style={{ background: '#983B16' }} /> Dine-in
              </span>
              <span className="admin-chart-legend-item">
                <span className="admin-legend-dot" style={{ background: '#D4A04A' }} /> Takeaway
              </span>
              <span className="admin-chart-legend-item">
                <span className="admin-legend-dot" style={{ background: '#8B5E3C' }} /> Delivery
              </span>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLATFORM_ORDERS_BARS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="date" stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="dineIn" fill="#983B16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="takeaway" fill="#D4A04A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivery" fill="#8B5E3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: New vs Returning Customers + Top Performing Cafés */}
      <div className="admin-charts-grid-2col" style={{ marginTop: 24 }}>
        {/* New vs Returning Customers Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">New vs Returning Customers</h3>
          </div>
          <div className="admin-donut-container">
            <div style={{ width: 200, height: 200, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLATFORM_NEW_RETURNING_DONUT}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PLATFORM_NEW_RETURNING_DONUT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatNumber(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-donut-center">
                <span className="admin-donut-center__val">
                  {formatNumber(PLATFORM_KPI.totalCustomers.value)}
                </span>
                <span className="admin-donut-center__label">Customers</span>
              </div>
            </div>

            <div className="admin-donut-legend">
              {PLATFORM_NEW_RETURNING_DONUT.map((item) => (
                <div key={item.name} className="admin-donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: item.color,
                        display: 'inline-block',
                      }}
                    />
                    <span className="admin-text-bold">{item.name}</span>
                  </div>
                  <div>
                    <strong>{item.percent}%</strong>{' '}
                    <span className="admin-text-muted">({formatNumber(item.value)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Cafés */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Top Performing Cafés</h3>
            <button
              className="admin-link-btn"
              onClick={() => navigate('/admin/cafes')}
            >
              View All →
            </button>
          </div>
          <div className="admin-table-container">
            <table className="admin-table admin-table--compact">
              <thead>
                <tr>
                  <th style={{ width: 30 }}>#</th>
                  <th>Café Name</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopCafes.map((cafe) => (
                  <tr
                    key={cafe.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/cafe-analytics?cafe=${cafe.id}`)}
                  >
                    <td className="admin-table-index">{cafe.rank}</td>
                    <td>
                      <div className="admin-entity-cell">
                        <div className="admin-cafe-badge admin-cafe-badge--small">
                          {cafe.name.charAt(0)}
                        </div>
                        <span className="admin-text-bold">{cafe.name}</span>
                      </div>
                    </td>
                    <td className="admin-text-bold">{formatINR(cafe.revenue)}</td>
                    <td>{formatNumber(cafe.orders)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Café Performance Full Table */}
      <div className="admin-chart-card" style={{ marginTop: 24 }}>
        <div className="admin-chart-card__header">
          <h3 className="admin-chart-card__title">Café Performance</h3>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}>#</th>
                <th>Café Name</th>
                <th>Location</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Customers</th>
                <th>Avg. Order Value</th>
                <th>Growth</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCafePerformance.map((row) => (
                <tr
                  key={row.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/cafe-analytics?cafe=${row.id}`)}
                >
                  <td className="admin-table-index">{row.rank}</td>
                  <td>
                    <div className="admin-entity-cell">
                      <div className="admin-cafe-badge admin-cafe-badge--small">
                        {row.name.charAt(0)}
                      </div>
                      <span className="admin-text-bold">{row.name}</span>
                    </div>
                  </td>
                  <td>{row.location}</td>
                  <td className="admin-text-bold">{formatINR(row.revenue)}</td>
                  <td>{formatNumber(row.orders)}</td>
                  <td>{formatNumber(row.customers)}</td>
                  <td>₹{row.avgOrderValue}</td>
                  <td>
                    <span className="admin-growth-pill admin-growth-pill--up">
                      ↑ {row.growth}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-status-pill admin-status-pill--${row.status}`}
                    >
                      {row.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Customer Growth Trajectory + Order Distribution Donut + Top Cities */}
      <div className="admin-charts-grid-3col" style={{ marginTop: 24 }}>
        {/* Customer Growth */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Customer Growth</h3>
            <span className="admin-pill-badge">Last 30 Days</span>
          </div>
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CUSTOMER_GROWTH_SERIES}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ece6" />
                <XAxis dataKey="month" stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#94887c" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#983B16" strokeWidth={3} dot={{ fill: '#983B16', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Distribution Donut */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Order Distribution</h3>
          </div>
          <div className="admin-donut-container">
            <div style={{ width: 170, height: 170, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PLATFORM_ORDER_DISTRIBUTION_DONUT}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PLATFORM_ORDER_DISTRIBUTION_DONUT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatNumber(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="admin-donut-center">
                <span className="admin-donut-center__val" style={{ fontSize: '1rem' }}>
                  48,261
                </span>
                <span className="admin-donut-center__label">Orders</span>
              </div>
            </div>

            <div className="admin-donut-legend">
              {PLATFORM_ORDER_DISTRIBUTION_DONUT.map((item) => (
                <div key={item.name} className="admin-donut-legend-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
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

        {/* Top Cities */}
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <h3 className="admin-chart-card__title">Top Cities</h3>
          </div>
          <div className="admin-top-cities-list">
            {TOP_CITIES_BREAKDOWN.map((item, idx) => (
              <div key={item.city} className="admin-city-row">
                <div className="admin-city-left">
                  <span className="admin-city-rank">{idx + 1}</span>
                  <span className="admin-text-bold">{item.city}</span>
                </div>
                <div className="admin-city-bar-wrap">
                  <div
                    className="admin-city-bar"
                    style={{ width: `${item.percent * 2.5}%` }}
                  />
                  <span className="admin-city-percent">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
