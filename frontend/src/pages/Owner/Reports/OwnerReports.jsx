import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Download,
  BarChart2,
  FileText,
  Package,
  IndianRupee,
  ShoppingCart,
  Tag,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
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
  BarChart,
  Bar,
} from 'recharts'
import { OWNER_REPORTS_DATA } from '../data/ownerMockData'
import { useChartWidth } from '../hooks/useChartWidth'
import OrderReportTab from './components/OrderReportTab'

export default function OwnerReports() {
  const [salesTrendRef, salesTrendWidth] = useChartWidth(340)

  // State
  const [activeReportTab, setActiveReportTab] = useState('orders') // 'sales' | 'orders' | 'items' (Order Report default matching screenshot)
  const [periodPreset, setPeriodPreset] = useState('This Month')
  const [startDate, setStartDate] = useState('01 Oct 2026')
  const [endDate, setEndDate] = useState('31 Oct 2026')
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false)
  const [salesTrendMetric, setSalesTrendMetric] = useState('Revenue')
  const [toastMessage, setToastMessage] = useState('')
  const [filteredOrdersForExport, setFilteredOrdersForExport] = useState([])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Handle preset date range selection
  const handleSelectPreset = (preset) => {
    setPeriodPreset(preset)
    setIsPeriodMenuOpen(false)

    if (preset === 'Today') {
      setStartDate('02 Oct 2026')
      setEndDate('02 Oct 2026')
    } else if (preset === 'Yesterday') {
      setStartDate('01 Oct 2026')
      setEndDate('01 Oct 2026')
    } else if (preset === 'This Week') {
      setStartDate('01 Oct 2026')
      setEndDate('07 Oct 2026')
    } else if (preset === 'This Month') {
      setStartDate('01 Oct 2026')
      setEndDate('31 Oct 2026')
    } else if (preset === 'Last Month') {
      setStartDate('01 Sep 2026')
      setEndDate('30 Sep 2026')
    } else if (preset === 'This Year') {
      setStartDate('01 Jan 2026')
      setEndDate('31 Dec 2026')
    } else if (preset === 'Custom Range') {
      // User can manually enter start and end date
    }

    showToast(`Date range set to ${preset}`)
  }

  // Handle custom date edits with validation
  const handleStartDateChange = (val) => {
    setStartDate(val)
    setPeriodPreset('Custom Range')
    const s = Date.parse(val)
    const e = Date.parse(endDate)
    if (!isNaN(s) && !isNaN(e) && s > e) {
      showToast('Validation Warning: Start date cannot be after end date')
    }
  }

  const handleEndDateChange = (val) => {
    setEndDate(val)
    setPeriodPreset('Custom Range')
    const s = Date.parse(startDate)
    const e = Date.parse(val)
    if (!isNaN(s) && !isNaN(e) && s > e) {
      showToast('Validation Warning: Start date cannot be after end date')
    }
  }

  // Export handler supporting CSV & JSON from active filtered data
  const handleExport = (format) => {
    setIsExportMenuOpen(false)
    const timestamp = new Date().toISOString().slice(0, 10)
    const filename = `CafeFlow_${activeReportTab}_report_${timestamp}.${format.toLowerCase()}`

    let blob
    if (activeReportTab === 'orders' && filteredOrdersForExport?.length > 0) {
      if (format === 'CSV') {
        const headers = [
          'Order ID',
          'Customer Name',
          'Table',
          'Item Count',
          'Amount (INR)',
          'Payment Method',
          'Status',
          'Date & Time',
          'Subtotal',
          'Discount',
          'Notes',
        ]
        const rows = filteredOrdersForExport.map((o) => [
          `#${o.id}`,
          `"${(o.customerName || '').replace(/"/g, '""')}"`,
          o.tableDisplay || o.tableNumber,
          o.itemCount,
          o.amount,
          o.paymentMethod,
          o.status,
          `"${o.dateTime}"`,
          o.subtotal,
          o.discount,
          `"${(o.notes || '').replace(/"/g, '""')}"`,
        ])
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      } else {
        // JSON format
        const jsonContent = JSON.stringify(filteredOrdersForExport, null, 2)
        blob = new Blob([jsonContent], { type: 'application/json' })
      }
    } else {
      // General fallback export
      if (format === 'CSV') {
        const csvContent = `CaféFlow Owner Portal - ${activeReportTab.toUpperCase()} REPORT\nDate Range: ${startDate} to ${endDate}\nGenerated: ${new Date().toLocaleString()}\n\nDate,Orders,Revenue\n01 Oct 2026,42,9230\n02 Oct 2026,51,11490\n03 Oct 2026,38,8580\n`
        blob = new Blob([csvContent], { type: 'text/csv' })
      } else {
        const jsonData = {
          report: activeReportTab,
          startDate,
          endDate,
          exportedAt: new Date().toISOString(),
          status: 'success',
        }
        blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast(`Exported ${filename} successfully!`)
  }

  // Custom Chart Tooltip
  const CustomSalesTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="owner-chart-tooltip">
          <div className="owner-chart-tooltip__time">{data.label || data.date}</div>
          <div className="owner-chart-tooltip__val">
            ₹ {data.revenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#8c7b6f', marginTop: '2px' }}>
            {data.orders} orders
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
          PAGE HEADER: Title + Subtitle + Date Controls + Export Button
          ==================================================================== */}
      <div className="owner-module-header">
        <div className="owner-module-title-wrap">
          <h1 className="owner-module-title">Reports</h1>
          <p className="owner-module-subtitle">
            View and export detailed reports about your business.
          </p>
        </div>

        <div className="owner-module-actions">
          {/* Period Preset Dropdown */}
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
                {[
                  'Today',
                  'Yesterday',
                  'This Week',
                  'This Month',
                  'Last Month',
                  'This Year',
                  'Custom Range',
                ].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="owner-export-dropdown-item"
                    onClick={() => handleSelectPreset(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Inputs Box matching reference */}
          <div className="owner-date-range-box">
            <Calendar size={14} color="#8c7b6f" />
            <input
              type="text"
              className="owner-date-range-input"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              aria-label="Start Date"
            />
            <span className="owner-date-range-separator">to</span>
            <Calendar size={14} color="#8c7b6f" />
            <input
              type="text"
              className="owner-date-range-input"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              aria-label="End Date"
            />
          </div>

          {/* Export Dropdown Button matching screenshot */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="owner-btn-primary"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              aria-expanded={isExportMenuOpen}
            >
              <Download size={15} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>

            {isExportMenuOpen && (
              <div className="owner-export-dropdown">
                <button
                  type="button"
                  className="owner-export-dropdown-item"
                  onClick={() => handleExport('CSV')}
                >
                  <FileSpreadsheet size={15} color="#10b981" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  className="owner-export-dropdown-item"
                  onClick={() => handleExport('JSON')}
                >
                  <FileCode size={15} color="#c47d2e" />
                  <span>Export JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          REPORT TABS: Sales Report | Order Report | Item Report
          ==================================================================== */}
      <div className="owner-report-tabs">
        <button
          type="button"
          className={`owner-report-tab-btn ${activeReportTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('sales')}
        >
          <BarChart2 size={16} />
          <span>Sales Report</span>
        </button>

        <button
          type="button"
          className={`owner-report-tab-btn ${activeReportTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('orders')}
        >
          <FileText size={16} />
          <span>Order Report</span>
        </button>

        <button
          type="button"
          className={`owner-report-tab-btn ${activeReportTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('items')}
        >
          <Package size={16} />
          <span>Item Report</span>
        </button>
      </div>

      {/* ====================================================================
          TAB 1: SALES REPORT (Default matching screenshot)
          ==================================================================== */}
      {activeReportTab === 'sales' && (
        <>
          {/* Sales KPI Cards (4 cards) */}
          <section className="owner-kpis-grid">
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
                {OWNER_REPORTS_DATA.salesKpis.totalRevenue.formatted}
              </div>
              <div className="owner-kpi-card__bottom">
                <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                  <ArrowUpRight size={13} />
                  {OWNER_REPORTS_DATA.salesKpis.totalRevenue.growth}
                </span>
                <div className="owner-kpi-card__sparkbar" aria-hidden="true">
                  {[20, 35, 45, 60, 50, 75, 90].map((val, idx) => (
                    <div
                      key={idx}
                      className="owner-kpi-card__sparkbar-col"
                      style={{ height: `${(val / 90) * 16 + 3}px` }}
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
                {OWNER_REPORTS_DATA.salesKpis.totalOrders.formatted}
              </div>
              <div className="owner-kpi-card__bottom">
                <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                  <ArrowUpRight size={13} />
                  {OWNER_REPORTS_DATA.salesKpis.totalOrders.growth}
                </span>
                <div className="owner-kpi-card__sparkbar" aria-hidden="true">
                  {[15, 25, 30, 42, 38, 55, 65].map((val, idx) => (
                    <div
                      key={idx}
                      className="owner-kpi-card__sparkbar-col"
                      style={{ height: `${(val / 65) * 16 + 3}px`, background: '#93c5fd' }}
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
                  style={{ background: '#ecfdf5', color: '#10b981' }}
                >
                  <ShoppingCart size={18} />
                </div>
                <span className="owner-kpi-card__title">Average Order Value</span>
              </div>
              <div className="owner-kpi-card__value">
                {OWNER_REPORTS_DATA.salesKpis.avgOrderValue.formatted}
              </div>
              <div className="owner-kpi-card__bottom">
                <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                  <ArrowUpRight size={13} />
                  {OWNER_REPORTS_DATA.salesKpis.avgOrderValue.growth}
                </span>
                <div className="owner-kpi-card__sparkbar" aria-hidden="true">
                  {[22, 24, 25, 24, 26, 27, 28].map((val, idx) => (
                    <div
                      key={idx}
                      className="owner-kpi-card__sparkbar-col"
                      style={{ height: `${(val / 28) * 16 + 3}px`, background: '#86efac' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Total Discounts */}
            <div className="owner-kpi-card">
              <div className="owner-kpi-card__top">
                <div
                  className="owner-kpi-card__icon-box"
                  style={{ background: '#fffbeb', color: '#d97706' }}
                >
                  <Tag size={18} />
                </div>
                <span className="owner-kpi-card__title">Total Discounts</span>
              </div>
              <div className="owner-kpi-card__value">
                {OWNER_REPORTS_DATA.salesKpis.totalDiscounts.formatted}
              </div>
              <div className="owner-kpi-card__bottom">
                <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
                  <ArrowUpRight size={13} />
                  {OWNER_REPORTS_DATA.salesKpis.totalDiscounts.growth}
                </span>
                <div className="owner-kpi-card__sparkbar" aria-hidden="true">
                  {[12, 14, 18, 16, 22, 24, 26].map((val, idx) => (
                    <div
                      key={idx}
                      className="owner-kpi-card__sparkbar-col"
                      style={{ height: `${(val / 26) * 16 + 3}px`, background: '#fde68a' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Middle Row: Sales Trend (Area Chart) + Revenue Breakdown (Donut) */}
          <section className="owner-middle-grid">
            {/* Sales Trend Card */}
            <div className="owner-card">
              <div className="owner-card__header">
                <div>
                  <h2 className="owner-card__title">Sales Trend</h2>
                  <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                    Daily revenue for the selected period
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="owner-card__period-btn"
                    onClick={() =>
                      setSalesTrendMetric(
                        salesTrendMetric === 'Revenue' ? 'Orders' : 'Revenue'
                      )
                    }
                  >
                    <span>{salesTrendMetric}</span>
                    <ChevronDown size={13} />
                  </button>
                </div>
              </div>

              {/* Area Chart matching screenshot */}
              <div ref={salesTrendRef} className="owner-chart-container">
                <AreaChart
                  width={salesTrendWidth}
                  height={250}
                  data={OWNER_REPORTS_DATA.salesTrendDaily}
                  margin={{ top: 12, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="reportsSalesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c47d2e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#c47d2e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
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
                    tickFormatter={(val) => `₹ ${(val / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomSalesTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8c4a23"
                    strokeWidth={2.4}
                    fillOpacity={1}
                    fill="url(#reportsSalesFill)"
                    dot={{ r: 3, fill: '#8c4a23' }}
                    activeDot={{ r: 6, fill: '#7a3a16', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </div>
            </div>

            {/* Revenue Breakdown Donut Card */}
            <div className="owner-card">
              <div className="owner-card__header">
                <div>
                  <h2 className="owner-card__title">Revenue Breakdown</h2>
                  <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                    Category contribution
                  </div>
                </div>
              </div>

              <div className="owner-donut-wrap">
                <div className="owner-donut-chart-box">
                  <PieChart width={170} height={170}>
                    <Pie
                      data={OWNER_REPORTS_DATA.revenueBreakdown}
                      innerRadius={50}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {OWNER_REPORTS_DATA.revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>

                  {/* Centered Total */}
                  <div className="owner-donut-center-text">
                    <span className="owner-donut-center-number" style={{ fontSize: '17px' }}>
                      ₹84,520
                    </span>
                    <span className="owner-donut-center-label">Total Revenue</span>
                  </div>
                </div>

                {/* Legend matching screenshot */}
                <div className="owner-donut-legend">
                  {OWNER_REPORTS_DATA.revenueBreakdown.map((item) => (
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
          </section>

          {/* Bottom Row: Daily Sales Details Table + Top Selling Items */}
          <section className="owner-bottom-grid">
            {/* Daily Sales Details Table */}
            <div className="owner-card">
              <div className="owner-card__header">
                <h2 className="owner-card__title">Daily Sales Details</h2>
              </div>

              <div className="owner-table-responsive">
                <table className="owner-daily-sales-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Orders</th>
                      <th>Items Sold</th>
                      <th>Gross Sales</th>
                      <th>Discount</th>
                      <th>Net Revenue</th>
                      <th>Avg. Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OWNER_REPORTS_DATA.dailySalesDetails.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#1a0e0a' }}>{row.date}</td>
                        <td>{row.orders}</td>
                        <td>{row.itemsSold}</td>
                        <td style={{ color: '#6e645a' }}>{row.grossSales}</td>
                        <td style={{ color: '#d97706' }}>{row.discount}</td>
                        <td style={{ fontWeight: 700, color: '#1a0e0a' }}>{row.netRevenue}</td>
                        <td style={{ color: '#10b981', fontWeight: 600 }}>{row.aov}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Selling Items matching screenshot */}
            <div className="owner-card">
              <div className="owner-card__header">
                <h2 className="owner-card__title">Top Selling Items</h2>
                <button
                  type="button"
                  className="owner-card__link"
                  onClick={() => showToast('Showing top 5 best-selling menu items.')}
                >
                  View All
                </button>
              </div>

              <div className="owner-top-items-list">
                {OWNER_REPORTS_DATA.topSellingItems.map((item) => (
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
          </section>
        </>
      )}

      {/* ====================================================================
          TAB 2: ORDER REPORT
          ==================================================================== */}
      {activeReportTab === 'orders' && (
        <OrderReportTab
          startDate={startDate}
          endDate={endDate}
          onFilteredOrdersChange={setFilteredOrdersForExport}
          showToast={showToast}
        />
      )}

      {/* ====================================================================
          TAB 3: ITEM REPORT
          ==================================================================== */}
      {activeReportTab === 'items' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Item Performance Table */}
          <div className="owner-card">
            <div className="owner-card__header">
              <div>
                <h2 className="owner-card__title">Menu Items Performance Table</h2>
                <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                  Analyzed across 1,480 units sold this period
                </div>
              </div>
            </div>

            <div className="owner-table-responsive">
              <table className="owner-daily-sales-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Gross Revenue</th>
                    <th>Food Cost %</th>
                    <th>Performance Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {OWNER_REPORTS_DATA.itemReport.itemsDetailedList.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: '#1a0e0a' }}>{it.name}</td>
                      <td>
                        <span className="owner-table-tag-badge">{it.category}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{it.sold}</td>
                      <td style={{ fontWeight: 700, color: '#1a0e0a' }}>{it.gross}</td>
                      <td style={{ color: '#d97706' }}>{it.cost}</td>
                      <td>
                        <span
                          className={`owner-status-badge ${
                            it.status === 'Best Seller'
                              ? 'owner-status-badge--completed'
                              : it.status === 'High Margin'
                              ? 'owner-status-badge--inprogress'
                              : 'owner-status-badge--queued'
                          }`}
                        >
                          {it.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
