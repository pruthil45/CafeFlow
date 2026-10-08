import { useState, useMemo } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import {
  Calendar,
  ChevronDown,
  ShoppingBag,
  FileText,
  Users,
  Armchair,
  TrendingUp,
  Bell,
  ChevronRight,
  User,
  AlertTriangle,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  UtensilsCrossed,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  OWNER_DASHBOARD_KPIS,
  SALES_OVERVIEW_DATA,
  ORDER_STATUS_BREAKDOWN,
  ACTIVE_TABLES,
  TOP_SELLING_ITEMS,
  NEW_CUSTOMERS,
  RECENT_ORDERS,
  OWNER_NOTIFICATIONS,
} from '../data/ownerMockData'

export default function OwnerDashboard({ selectedCafe: propCafe }) {
  const navigate = useNavigate()
  const outletCtx = useOutletContext() || {}
  const selectedCafe = propCafe || outletCtx.selectedCafe || { name: 'The Daily Bean' }

  // State controls
  const [salesTab, setSalesTab] = useState('revenue') // 'revenue' | 'orders' | 'customers'
  const [selectedDateRange, setSelectedDateRange] = useState('Today, Oct 1, 2026')
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false)
  const [salesPeriod, setSalesPeriod] = useState('Today')
  const [statusPeriod, setStatusPeriod] = useState('Today')
  const [itemsPeriod, setItemsPeriod] = useState('Today')

  // Available date filters
  const dateOptions = [
    'Today, Oct 1, 2026',
    'Yesterday, Sep 30, 2026',
    'Last 7 Days',
    'This Month (Oct 2026)',
  ]

  // Data for active sales tab
  const chartData = useMemo(() => {
    return SALES_OVERVIEW_DATA[salesTab] || SALES_OVERVIEW_DATA.revenue
  }, [salesTab])

  // Custom Tooltip for Area Chart
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className="owner-chart-tooltip">
          <div className="owner-chart-tooltip__time">{dataPoint.time}</div>
          <div className="owner-chart-tooltip__val">
            {salesTab === 'revenue'
              ? `₹ ${payload[0].value.toLocaleString('en-IN')}`
              : salesTab === 'orders'
              ? `${payload[0].value} orders`
              : `${payload[0].value} customers`}
          </div>
        </div>
      )
    }
    return null
  }

  // Get status badge class
  const getBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'owner-status-badge--inprogress'
      case 'completed':
        return 'owner-status-badge--completed'
      case 'queued':
        return 'owner-status-badge--queued'
      default:
        return ''
    }
  }

  return (
    <div className="owner-dashboard">
      {/* ====================================================================
          DASHBOARD HEADER: Title + Subtitle + Date Selector
          ==================================================================== */}
      <div className="owner-dashboard__header-row">
        <div className="owner-dashboard__title-wrap">
          <h1 className="owner-dashboard__title">Dashboard</h1>
          <p className="owner-dashboard__subtitle">
            Here&apos;s what&apos;s happening at{' '}
            <strong style={{ color: '#1a0e0a' }}>
              {selectedCafe?.name || 'The Daily Bean'}
            </strong>{' '}
            today.
          </p>
        </div>

        {/* Interactive Date Selector */}
        <div className="owner-dashboard__date-wrap">
          <button
            type="button"
            className="owner-dashboard__date-btn"
            onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
            aria-expanded={isDateMenuOpen}
            aria-label="Select Date Range"
          >
            <Calendar size={15} className="owner-dashboard__date-icon" />
            <span>{selectedDateRange}</span>
            <ChevronDown size={14} style={{ color: '#8c7b6f' }} />
          </button>

          {isDateMenuOpen && (
            <div className="owner-dashboard__date-menu">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`owner-dashboard__date-option ${
                    selectedDateRange === opt ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedDateRange(opt)
                    setIsDateMenuOpen(false)
                  }}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          ROW 1: 5 KPI CARDS
          ==================================================================== */}
      <section className="owner-kpis-grid" aria-label="Key Performance Indicators">
        {/* 1. Today's Revenue */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <ShoppingBag size={18} />
            </div>
            <span className="owner-kpi-card__title">
              {OWNER_DASHBOARD_KPIS.revenue.title}
            </span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_DASHBOARD_KPIS.revenue.formatted}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_DASHBOARD_KPIS.revenue.growthText}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_DASHBOARD_KPIS.revenue.sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(val / 90) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Today's Orders */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <FileText size={18} />
            </div>
            <span className="owner-kpi-card__title">
              {OWNER_DASHBOARD_KPIS.orders.title}
            </span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_DASHBOARD_KPIS.orders.formatted}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_DASHBOARD_KPIS.orders.growthText}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_DASHBOARD_KPIS.orders.sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(val / 65) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. Active Customers */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <Users size={18} />
            </div>
            <span className="owner-kpi-card__title">
              {OWNER_DASHBOARD_KPIS.customers.title}
            </span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_DASHBOARD_KPIS.customers.formatted}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--negative">
              <ArrowDownRight size={13} />
              {OWNER_DASHBOARD_KPIS.customers.growthText}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_DASHBOARD_KPIS.customers.sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(val / 45) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4. Active Tables */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <Armchair size={18} />
            </div>
            <span className="owner-kpi-card__title">
              {OWNER_DASHBOARD_KPIS.tables.title}
            </span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_DASHBOARD_KPIS.tables.formatted}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--neutral">
              {OWNER_DASHBOARD_KPIS.tables.percentText}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_DASHBOARD_KPIS.tables.sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(val / 8) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 5. Average Order Value */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <TrendingUp size={18} />
            </div>
            <span className="owner-kpi-card__title">
              {OWNER_DASHBOARD_KPIS.avgOrderValue.title}
            </span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_DASHBOARD_KPIS.avgOrderValue.formatted}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_DASHBOARD_KPIS.avgOrderValue.growthText}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_DASHBOARD_KPIS.avgOrderValue.sparkline.map((val, idx) => (
                <div
                  key={idx}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(val / 260) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ROW 2: SALES OVERVIEW + ORDER STATUS OVERVIEW
          ==================================================================== */}
      <section className="owner-middle-grid">
        {/* Sales Overview Card */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <h2 className="owner-card__title">Sales Overview</h2>

              {/* Functional Switch Tabs */}
              <div className="owner-sales-tabs">
                <button
                  type="button"
                  className={`owner-sales-tab ${salesTab === 'revenue' ? 'active' : ''}`}
                  onClick={() => setSalesTab('revenue')}
                >
                  Revenue
                </button>
                <button
                  type="button"
                  className={`owner-sales-tab ${salesTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setSalesTab('orders')}
                >
                  Orders
                </button>
                <button
                  type="button"
                  className={`owner-sales-tab ${salesTab === 'customers' ? 'active' : ''}`}
                  onClick={() => setSalesTab('customers')}
                >
                  Customers
                </button>
              </div>
            </div>

            <button
              type="button"
              className="owner-card__period-btn"
              onClick={() => setSalesPeriod(salesPeriod === 'Today' ? '7 Days' : 'Today')}
            >
              <span>{salesPeriod}</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Recharts Area Chart */}
          <div className="owner-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={chartData}
                margin={{ top: 12, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ownerSalesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c47d2e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c47d2e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8e1" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8e2d8' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    if (salesTab === 'revenue') {
                      return val >= 1000 ? `₹ ${(val / 1000).toFixed(0)}K` : `₹ ${val}`
                    }
                    return val
                  }}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#c47d2e"
                  strokeWidth={2.4}
                  fillOpacity={1}
                  fill="url(#ownerSalesFill)"
                  activeDot={{ r: 6, fill: '#8c4a23', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Overview Card */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">Order Status Overview</h2>
            <button
              type="button"
              className="owner-card__period-btn"
              onClick={() => setStatusPeriod(statusPeriod === 'Today' ? '7 Days' : 'Today')}
            >
              <span>{statusPeriod}</span>
              <ChevronDown size={13} />
            </button>
          </div>

          {/* Donut Chart + Legend */}
          <div className="owner-donut-wrap">
            <div className="owner-donut-chart-box">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={ORDER_STATUS_BREAKDOWN.segments}
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ORDER_STATUS_BREAKDOWN.segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Total Count */}
              <div className="owner-donut-center-text">
                <span className="owner-donut-center-number">
                  {ORDER_STATUS_BREAKDOWN.total}
                </span>
                <span className="owner-donut-center-label">Total Orders</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="owner-donut-legend">
              {ORDER_STATUS_BREAKDOWN.segments.map((item) => (
                <div key={item.name} className="owner-donut-legend__item">
                  <div className="owner-donut-legend__left">
                    <span
                      className="owner-donut-legend__dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="owner-donut-legend__value">
                    {item.value} ({item.percent}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Kitchen Alert Box */}
          <Link
            to={ORDER_STATUS_BREAKDOWN.operationalAlert.actionRoute}
            className="owner-operational-alert"
          >
            <div className="owner-operational-alert__icon">
              <Bell size={18} />
            </div>
            <div className="owner-operational-alert__content">
              <div className="owner-operational-alert__title">
                {ORDER_STATUS_BREAKDOWN.operationalAlert.title}
              </div>
              <div className="owner-operational-alert__time">
                {ORDER_STATUS_BREAKDOWN.operationalAlert.time}
              </div>
            </div>
            <ChevronRight size={18} className="owner-operational-alert__arrow" />
          </Link>
        </div>
      </section>

      {/* ====================================================================
          ROW 3: ACTIVE TABLES + TOP SELLING ITEMS + NEW CUSTOMERS
          ==================================================================== */}
      <section className="owner-trio-grid">
        {/* Card 1: Active Tables */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">Active Tables</h2>
            <Link to="/owner/tables" className="owner-card__link">
              View All
            </Link>
          </div>

          <div className="owner-tables-grid">
            {ACTIVE_TABLES.map((table) => {
              const isOccupied = table.status === 'occupied'
              return (
                <div
                  key={table.id}
                  className="owner-table-chip"
                  onClick={() => navigate('/owner/tables')}
                >
                  <span
                    className={`owner-table-chip__status-dot ${
                      isOccupied
                        ? 'owner-table-chip__status-dot--occupied'
                        : 'owner-table-chip__status-dot--empty'
                    }`}
                  />
                  <div className="owner-table-chip__content">
                    <span className="owner-table-chip__name">{table.name}</span>
                    <span
                      className={`owner-table-chip__meta ${
                        !isOccupied ? 'owner-table-chip__meta--empty' : ''
                      }`}
                    >
                      {isOccupied
                        ? `${table.customers} ${
                            table.customers === 1 ? 'customer' : 'customers'
                          } • ${table.orders} ${
                            table.orders === 1 ? 'order' : 'orders'
                          }`
                        : 'Empty'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card 2: Top Selling Items */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">Top Selling Items</h2>
            <button
              type="button"
              className="owner-card__period-btn"
              onClick={() => setItemsPeriod(itemsPeriod === 'Today' ? '7 Days' : 'Today')}
            >
              <span>{itemsPeriod}</span>
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="owner-top-items-list">
            {TOP_SELLING_ITEMS.map((item) => (
              <div key={item.rank} className="owner-top-item-row">
                <span className="owner-top-item-rank">{item.rank}</span>
                <div className="owner-top-item-thumb">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentNode.innerText = item.fallbackEmoji || '🍽️'
                      }}
                    />
                  ) : (
                    <span>{item.fallbackEmoji || '🍽️'}</span>
                  )}
                </div>
                <div className="owner-top-item-body">
                  <div className="owner-top-item-name">{item.name}</div>
                  <div className="owner-top-item-bar-bg">
                    <div
                      className="owner-top-item-bar-fill"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
                <span className="owner-top-item-count">{item.orders} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: New Customers */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">New Customers</h2>
            <Link to="/owner/customers" className="owner-card__link">
              View All
            </Link>
          </div>

          <div className="owner-customers-list">
            {NEW_CUSTOMERS.map((cust) => (
              <div key={cust.id} className="owner-customer-row">
                <div className="owner-customer-avatar">
                  <User size={16} />
                </div>
                <div className="owner-customer-info">
                  <div className="owner-customer-name">{cust.name}</div>
                  <div className="owner-customer-phone">{cust.phone}</div>
                </div>
                <span className="owner-customer-badge">{cust.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          ROW 4: RECENT ORDERS + NOTIFICATIONS & ALERTS
          ==================================================================== */}
      <section className="owner-bottom-grid">
        {/* Recent Orders Card */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">Recent Orders</h2>
            <Link to="/owner/orders" className="owner-card__link">
              View All
            </Link>
          </div>

          <div className="owner-orders-table-wrapper">
            <table className="owner-orders-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Time</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate('/owner/orders')}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="owner-order-id">{order.orderNo}</td>
                    <td style={{ color: '#6e645a' }}>{order.time}</td>
                    <td style={{ fontWeight: 600 }}>{order.customer}</td>
                    <td className="owner-order-table-tag">{order.table}</td>
                    <td style={{ color: '#4a3b32' }}>{order.items}</td>
                    <td className="owner-order-amount">{order.formattedAmount}</td>
                    <td>
                      <span
                        className={`owner-status-badge ${getBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Alerts Card */}
        <div className="owner-card">
          <div className="owner-card__header">
            <h2 className="owner-card__title">Notifications & Alerts</h2>
            <Link to="/owner/orders" className="owner-card__link">
              View All
            </Link>
          </div>

          <div className="owner-alerts-list">
            {OWNER_NOTIFICATIONS.map((alert) => (
              <div
                key={alert.id}
                className="owner-alert-item"
                onClick={() => navigate(alert.actionRoute || '/owner/orders')}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className={`owner-alert-icon-box ${
                    alert.isWarning
                      ? 'owner-alert-icon-box--red'
                      : 'owner-alert-icon-box--caramel'
                  }`}
                >
                  {alert.type === 'order' && <ShoppingBag size={16} />}
                  {alert.type === 'table' && <Armchair size={16} />}
                  {alert.type === 'stock' && <AlertTriangle size={16} />}
                  {alert.type === 'customer' && <UserPlus size={16} />}
                </div>

                <div className="owner-alert-content">
                  <div className="owner-alert-title">{alert.title}</div>
                  <div className="owner-alert-sub">{alert.description}</div>
                </div>

                <div className="owner-alert-time">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
