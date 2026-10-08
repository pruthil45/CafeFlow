import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  IndianRupee,
  FileText,
  Users,
  ShoppingCart,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Gift,
  Award,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { OWNER_ANALYTICS_DATA } from '../data/ownerMockData'

export default function OwnerAnalytics() {
  const [periodPreset, setPeriodPreset] = useState('This Month')
  const [startDate, setStartDate] = useState('01 Oct 2026')
  const [endDate, setEndDate] = useState('31 Oct 2026')
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false)
  const [revenueMetric, setRevenueMetric] = useState('Revenue')
  const [ordersMetric, setOrdersMetric] = useState('Orders')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Custom Tooltip for Revenue Trend
  const CustomRevenueTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="owner-chart-tooltip">
          <div className="owner-chart-tooltip__time">{data.date} 2026</div>
          <div className="owner-chart-tooltip__val">
            ₹ {data.value.toLocaleString('en-IN')}
          </div>
        </div>
      )
    }
    return null
  }

  // Custom Tooltip for Orders Trend
  const CustomOrdersTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="owner-chart-tooltip">
          <div className="owner-chart-tooltip__time">{data.date} 2026</div>
          <div className="owner-chart-tooltip__val">{data.total} orders</div>
          <div style={{ fontSize: '11px', color: '#8c7b6f' }}>
            Dine-in: {data.dineIn} • Takeaway: {data.takeaway}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="owner-module-container">
      {/* Toast Notification */}
      {toastMessage && <div className="owner-toast">{toastMessage}</div>}

      {/* ====================================================================
          PAGE HEADER: Title + Subtitle + Date Controls
          ==================================================================== */}
      <div className="owner-module-header">
        <div className="owner-module-title-wrap">
          <h1 className="owner-module-title">Analytics</h1>
          <p className="owner-module-subtitle">
            Understand your café&apos;s performance with insights and trends.
          </p>
        </div>

        <div className="owner-module-actions">
          {/* Preset Period Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={() => setIsPeriodMenuOpen(!isPeriodMenuOpen)}
            >
              <Calendar size={15} color="#c47d2e" />
              <span>{periodPreset}</span>
              <ChevronDown size={14} color="#8c7b6f" />
            </button>

            {isPeriodMenuOpen && (
              <div className="owner-export-dropdown" style={{ width: '160px' }}>
                {['This Month', 'Last Month', 'Last 90 Days', 'This Year'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="owner-export-dropdown-item"
                    onClick={() => {
                      setPeriodPreset(p)
                      setIsPeriodMenuOpen(false)
                      showToast(`Analytics updated for ${p}`)
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Inputs Box */}
          <div className="owner-date-range-box">
            <Calendar size={14} color="#8c7b6f" />
            <input
              type="text"
              className="owner-date-range-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start Date"
            />
            <span className="owner-date-range-separator">to</span>
            <Calendar size={14} color="#8c7b6f" />
            <input
              type="text"
              className="owner-date-range-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End Date"
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          ROW 1: 4 TOP KPI CARDS matching screenshot
          ==================================================================== */}
      <section className="owner-analytics-kpis-grid" aria-label="Analytics KPI metrics">
        {/* Total Revenue */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#fdf2e7', color: '#c47d2e' }}
            >
              <IndianRupee size={18} />
            </div>
            <span className="owner-kpi-card__title">Total Revenue</span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_ANALYTICS_DATA.kpis.totalRevenue.value}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_ANALYTICS_DATA.kpis.totalRevenue.growth} {OWNER_ANALYTICS_DATA.kpis.totalRevenue.growthSub}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_ANALYTICS_DATA.kpis.totalRevenue.sparkline.map((v, i) => (
                <div
                  key={i}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(v / 35) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#e0f2fe', color: '#0284c7' }}
            >
              <FileText size={18} />
            </div>
            <span className="owner-kpi-card__title">Total Orders</span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_ANALYTICS_DATA.kpis.totalOrders.value}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_ANALYTICS_DATA.kpis.totalOrders.growth} {OWNER_ANALYTICS_DATA.kpis.totalOrders.growthSub}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_ANALYTICS_DATA.kpis.totalOrders.sparkline.map((v, i) => (
                <div
                  key={i}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(v / 24) * 16 + 3}px`, background: '#93c5fd' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total Customers */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#ecfdf5', color: '#10b981' }}
            >
              <Users size={18} />
            </div>
            <span className="owner-kpi-card__title">Total Customers</span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_ANALYTICS_DATA.kpis.totalCustomers.value}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_ANALYTICS_DATA.kpis.totalCustomers.growth} {OWNER_ANALYTICS_DATA.kpis.totalCustomers.growthSub}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_ANALYTICS_DATA.kpis.totalCustomers.sparkline.map((v, i) => (
                <div
                  key={i}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(v / 25) * 16 + 3}px`, background: '#86efac' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#fdf2e7', color: '#c47d2e' }}
            >
              <ShoppingCart size={18} />
            </div>
            <span className="owner-kpi-card__title">Average Order Value</span>
          </div>
          <div className="owner-kpi-card__value">
            {OWNER_ANALYTICS_DATA.kpis.avgOrderValue.value}
          </div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              <ArrowUpRight size={13} />
              {OWNER_ANALYTICS_DATA.kpis.avgOrderValue.growth} {OWNER_ANALYTICS_DATA.kpis.avgOrderValue.growthSub}
            </span>
            <div className="owner-kpi-card__sparkbar" aria-hidden="true">
              {OWNER_ANALYTICS_DATA.kpis.avgOrderValue.sparkline.map((v, i) => (
                <div
                  key={i}
                  className="owner-kpi-card__sparkbar-col"
                  style={{ height: `${(v / 247) * 16 + 3}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ROW 2: REVENUE TREND (Line) + ORDERS TREND (Bar)
          ==================================================================== */}
      <section className="owner-middle-grid">
        {/* Revenue Trend */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Revenue Trend</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Daily revenue for the selected period
              </div>
            </div>

            <button
              type="button"
              className="owner-card__period-btn"
              onClick={() => showToast('Displaying revenue metric trend')}
            >
              <span>{revenueMetric}</span>
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="owner-chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={OWNER_ANALYTICS_DATA.revenueTrend}
                margin={{ top: 12, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8e1" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8e2d8' }}
                />
                <YAxis
                  tick={{ fontSize: 10.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val.toLocaleString()}`}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8c4a23"
                  strokeWidth={2.4}
                  dot={{ r: 3.5, fill: '#8c4a23' }}
                  activeDot={{ r: 6, fill: '#7a3a16', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Orders Trend</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Daily orders for the selected period
              </div>
            </div>

            <button
              type="button"
              className="owner-card__period-btn"
              onClick={() => showToast('Displaying daily orders trend')}
            >
              <span>{ordersMetric}</span>
              <ChevronDown size={13} />
            </button>
          </div>

          <div className="owner-chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={OWNER_ANALYTICS_DATA.ordersTrend}
                margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8e1" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8e2d8' }}
                />
                <YAxis
                  tick={{ fontSize: 10.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomOrdersTooltip />} />
                <Bar dataKey="dineIn" stackId="a" fill="#8c4a23" radius={[0, 0, 0, 0]} />
                <Bar dataKey="takeaway" stackId="a" fill="#e0a96d" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ROW 3: POPULAR ITEMS + CATEGORY PERFORMANCE + PEAK ORDERING HOURS
          ==================================================================== */}
      <section className="owner-trio-grid">
        {/* Popular Items */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Popular Items</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Top 5 best selling items
              </div>
            </div>
            <button
              type="button"
              className="owner-card__link"
              onClick={() => showToast('Viewing all popular items')}
            >
              View All
            </button>
          </div>

          <div className="owner-top-items-list">
            {OWNER_ANALYTICS_DATA.popularItems.map((item) => (
              <div key={item.rank} className="owner-top-item-row">
                <span className="owner-top-item-rank">{item.rank}</span>
                <div className="owner-top-item-thumb">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentNode.innerText = '🍽️'
                    }}
                  />
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
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', color: '#8c7b6f' }}>
                    {item.sold}
                  </div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a0e0a' }}>
                    {item.revenue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Donut */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Category Performance</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Revenue contribution by category
              </div>
            </div>
          </div>

          <div className="owner-donut-wrap">
            <div className="owner-donut-chart-box">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={OWNER_ANALYTICS_DATA.categoryPerformance}
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="percent"
                  >
                    {OWNER_ANALYTICS_DATA.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="owner-donut-center-text">
                <span className="owner-donut-center-number" style={{ fontSize: '17px' }}>
                  ₹84,520
                </span>
                <span className="owner-donut-center-label">Total Revenue</span>
              </div>
            </div>

            <div className="owner-donut-legend">
              {OWNER_ANALYTICS_DATA.categoryPerformance.map((item) => (
                <div key={item.name} className="owner-donut-legend__item">
                  <div className="owner-donut-legend__left">
                    <span
                      className="owner-donut-legend__dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="owner-donut-legend__value">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Ordering Hours Bar Chart */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Peak Ordering Hours</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Orders by time of day
              </div>
            </div>

            {/* Floating Peak Badge */}
            <span className="owner-peak-badge">67 orders peak</span>
          </div>

          <div className="owner-chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={OWNER_ANALYTICS_DATA.peakOrderingHours}
                margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8e1" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 9.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8e2d8' }}
                />
                <YAxis
                  tick={{ fontSize: 9.5, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [`${val} orders`, 'Volume']}
                  labelFormatter={(l) => `Time: ${l}`}
                />
                <Bar dataKey="orders" fill="#c47d2e" radius={[3, 3, 0, 0]}>
                  {OWNER_ANALYTICS_DATA.peakOrderingHours.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.isPeak ? '#7a3a16' : '#d4a04a'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ROW 4: CUSTOMER GROWTH + REPEAT VS NEW + PROMOTION & LOYALTY
          ==================================================================== */}
      <section className="owner-trio-grid">
        {/* Customer Growth Area Chart */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Customer Growth</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                New vs returning customers
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
              <span style={{ color: '#8c4a23', fontWeight: 600 }}>● New</span>
              <span style={{ color: '#e0a96d', fontWeight: 600 }}>● Returning</span>
            </div>
          </div>

          <div className="owner-chart-container" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={OWNER_ANALYTICS_DATA.customerGrowth}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede8e1" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e8e2d8' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8c7b6f' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  stroke="#8c4a23"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="returningCustomers"
                  stroke="#e0a96d"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repeat vs New Customers Donut */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Repeat vs New Customers</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Customer type distribution
              </div>
            </div>
          </div>

          <div className="owner-donut-wrap">
            <div className="owner-donut-chart-box">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={OWNER_ANALYTICS_DATA.repeatVsNew}
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="percent"
                  >
                    {OWNER_ANALYTICS_DATA.repeatVsNew.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="owner-donut-center-text">
                <span className="owner-donut-center-number" style={{ fontSize: '20px' }}>
                  72%
                </span>
                <span className="owner-donut-center-label">Repeat Customers</span>
              </div>
            </div>

            <div className="owner-donut-legend">
              {OWNER_ANALYTICS_DATA.repeatVsNew.map((item) => (
                <div key={item.name} className="owner-donut-legend__item">
                  <div className="owner-donut-legend__left">
                    <span
                      className="owner-donut-legend__dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="owner-donut-legend__value">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promotion & Loyalty Performance */}
        <div className="owner-card">
          <div className="owner-card__header">
            <div>
              <h2 className="owner-card__title">Promotion & Loyalty</h2>
              <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                Impact of promotions and loyalty program
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Promotions Used */}
            <div className="owner-loyalty-card-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="owner-loyalty-icon-box"
                  style={{ background: '#fef4eb', color: '#c47d2e' }}
                >
                  <Tag size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f' }}>Promotions Used</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a0e0a' }}>
                    {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.promotionsUsed.value}
                  </div>
                </div>
              </div>
              <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                <ArrowUpRight size={13} />
                {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.promotionsUsed.growth} vs last month
              </span>
            </div>

            {/* Rewards Redeemed */}
            <div className="owner-loyalty-card-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="owner-loyalty-icon-box"
                  style={{ background: '#fef2f2', color: '#ef4444' }}
                >
                  <Gift size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f' }}>Rewards Redeemed</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a0e0a' }}>
                    {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.rewardsRedeemed.value}
                  </div>
                </div>
              </div>
              <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                <ArrowUpRight size={13} />
                {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.rewardsRedeemed.growth} vs last month
              </span>
            </div>

            {/* Loyalty Members */}
            <div className="owner-loyalty-card-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  className="owner-loyalty-icon-box"
                  style={{ background: '#ecfdf5', color: '#10b981' }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f' }}>Loyalty Members</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a0e0a' }}>
                    {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.loyaltyMembers.value}
                  </div>
                </div>
              </div>
              <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                <ArrowUpRight size={13} />
                {OWNER_ANALYTICS_DATA.promotionsAndLoyalty.loyaltyMembers.growth} vs last month
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
