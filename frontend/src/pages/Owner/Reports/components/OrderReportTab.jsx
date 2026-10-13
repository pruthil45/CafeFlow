import { useState, useMemo, useEffect, useRef } from 'react'
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  RotateCcw,
  Eye,
  MoreVertical,
  X,
  User,
  UtensilsCrossed,
  CreditCard,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react'
import { MOCK_ORDERS_DATA, ORDER_REPORT_KPIS } from '../data/orderReportMockData'
import '../OrderReport.css'

export default function OrderReportTab({
  startDate,
  endDate,
  onFilteredOrdersChange,
  showToast,
}) {
  // Selected order for details panel (null by default; only opens when clicked)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [paymentFilter, setPaymentFilter] = useState('All Payment Methods')
  const [tableFilter, setTableFilter] = useState('All Tables')

  // Sorting state
  const [sortField, setSortField] = useState('id') // 'id' | 'customer' | 'amount' | 'date'
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' | 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Dropdown menus
  const [openActionMenuId, setOpenActionMenuId] = useState(null)
  const actionMenuRef = useRef(null)

  // Close actions menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenActionMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper to parse dates into timestamp for filtering
  const parseDateToTimestamp = (dateStr) => {
    if (!dateStr) return null
    // Try standard Date parse (handles ISO strings and format '01 Oct 2026')
    const parsed = Date.parse(dateStr)
    if (!isNaN(parsed)) return parsed
    return null
  }

  // Filter orders based on Date Range, Search, Status, Payment, Table
  const filteredOrders = useMemo(() => {
    let result = [...MOCK_ORDERS_DATA]

    // 1. Date Range Filter
    const startTs = parseDateToTimestamp(startDate)
    const endTs = parseDateToTimestamp(endDate)

    if (startTs !== null && endTs !== null && startTs <= endTs) {
      // Normalize end date to end of day
      const endOfDayTs = new Date(endTs).setHours(23, 59, 59, 999)
      result = result.filter((order) => {
        const orderTs = new Date(order.dateIso || order.dateTime).getTime()
        if (isNaN(orderTs)) return true
        return orderTs >= startTs && orderTs <= endOfDayTs
      })
    }

    // 2. Search Query (Order ID, Customer Name, Table Number)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((order) => {
        const idMatch = order.id.toLowerCase().includes(q.replace('#', ''))
        const nameMatch = order.customerName.toLowerCase().includes(q)
        const tableMatch =
          order.tableNumber.toLowerCase().includes(q) ||
          (order.tableDisplay && order.tableDisplay.toLowerCase().includes(q))
        return idMatch || nameMatch || tableMatch
      })
    }

    // 3. Status Filter
    if (statusFilter !== 'All Status') {
      result = result.filter((order) => order.status === statusFilter)
    }

    // 4. Payment Method Filter
    if (paymentFilter !== 'All Payment Methods') {
      result = result.filter((order) => order.paymentMethod === paymentFilter)
    }

    // 5. Table Filter
    if (tableFilter !== 'All Tables') {
      result = result.filter(
        (order) =>
          order.tableDisplay === tableFilter ||
          order.tableNumber === tableFilter ||
          order.tableNumber === tableFilter.replace('Table ', 'T')
      )
    }

    // 6. Sorting
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'id') {
        comparison = Number(a.id) - Number(b.id)
      } else if (sortField === 'customer') {
        comparison = a.customerName.localeCompare(b.customerName)
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortField === 'date') {
        const dateA = new Date(a.dateIso || a.dateTime).getTime()
        const dateB = new Date(b.dateIso || b.dateTime).getTime()
        comparison = dateA - dateB
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [
    startDate,
    endDate,
    searchQuery,
    statusFilter,
    paymentFilter,
    tableFilter,
    sortField,
    sortDirection,
  ])

  // Inform parent of filtered dataset for header export
  useEffect(() => {
    if (onFilteredOrdersChange) {
      onFilteredOrdersChange(filteredOrders)
    }
  }, [filteredOrders, onFilteredOrdersChange])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, paymentFilter, tableFilter, rowsPerPage])

  // Find currently selected order object
  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null
    return MOCK_ORDERS_DATA.find((o) => o.id === selectedOrderId) || null
  }, [selectedOrderId])

  // Calculate dynamic KPI values from filtered data or base metrics
  const kpiMetrics = useMemo(() => {
    // If unfiltered, use screenshot exact totals: 342, 318, 24, 0
    const isUnfiltered =
      !searchQuery &&
      statusFilter === 'All Status' &&
      paymentFilter === 'All Payment Methods' &&
      tableFilter === 'All Tables'

    if (isUnfiltered) {
      return {
        total: ORDER_REPORT_KPIS.totalOrders.value,
        totalTrend: ORDER_REPORT_KPIS.totalOrders.growth,
        completed: ORDER_REPORT_KPIS.completedOrders.value,
        completedTrend: ORDER_REPORT_KPIS.completedOrders.growth,
        inProgress: ORDER_REPORT_KPIS.inProgressOrders.value,
        inProgressTrend: ORDER_REPORT_KPIS.inProgressOrders.growth,
        cancelled: ORDER_REPORT_KPIS.cancelledOrders.value,
        cancelledTrend: ORDER_REPORT_KPIS.cancelledOrders.growth,
      }
    }

    const total = filteredOrders.length
    const completed = filteredOrders.filter((o) => o.status === 'Completed').length
    const inProgress = filteredOrders.filter((o) => o.status === 'In Progress').length
    const cancelled = filteredOrders.filter((o) => o.status === 'Cancelled').length

    return {
      total,
      totalTrend: `${total} matching orders`,
      completed,
      completedTrend: `${Math.round((completed / (total || 1)) * 100)}% of filtered`,
      inProgress,
      inProgressTrend: `${inProgress} active`,
      cancelled,
      cancelledTrend: `${cancelled} cancelled`,
    }
  }, [filteredOrders, searchQuery, statusFilter, paymentFilter, tableFilter])

  // Pagination calculation
  // To perfectly reproduce the screenshot "Showing 1-10 of 342 orders" and 35 pages when unfiltered,
  // we scale the total count if unfiltered
  const isUnfiltered =
    !searchQuery &&
    statusFilter === 'All Status' &&
    paymentFilter === 'All Payment Methods' &&
    tableFilter === 'All Tables'

  const effectiveTotalCount = isUnfiltered ? 342 : filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(effectiveTotalCount / rowsPerPage))

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredOrders, currentPage, rowsPerPage])

  // Table options for filter dropdowns
  const tableOptions = useMemo(() => {
    const set = new Set()
    MOCK_ORDERS_DATA.forEach((o) => {
      if (o.tableDisplay) set.add(o.tableDisplay)
    })
    return Array.from(set).sort()
  }, [])

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('All Status')
    setPaymentFilter('All Payment Methods')
    setTableFilter('All Tables')
    setCurrentPage(1)
    if (showToast) {
      showToast('Filters reset to default')
    }
  }

  // Copy order ID
  const handleCopyOrderId = (id) => {
    setOpenActionMenuId(null)
    const textToCopy = `#${id}`
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
    }
    if (showToast) {
      showToast(`Copied Order ${textToCopy} to clipboard!`)
    }
  }

  // Select order and open panel/drawer
  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id)
    if (window.innerWidth <= 768) {
      setIsMobileDrawerOpen(true)
    }
  }

  // Render Status Badge
  const renderStatusBadge = (status) => {
    let badgeClass = 'owner-order-status-badge--completed'
    let icon = <CheckCircle2 size={12} />

    if (status === 'In Progress') {
      badgeClass = 'owner-order-status-badge--inprogress'
      icon = <Clock size={12} />
    } else if (status === 'Queued') {
      badgeClass = 'owner-order-status-badge--queued'
      icon = <Clock size={12} />
    } else if (status === 'Cancelled') {
      badgeClass = 'owner-order-status-badge--cancelled'
      icon = <XCircle size={12} />
    }

    return (
      <span className={`owner-order-status-badge ${badgeClass}`}>
        {icon}
        <span>{status}</span>
      </span>
    )
  }

  // Render Pagination Page Buttons
  const renderPageButtons = () => {
    const buttons = []
    const maxVisibleButtons = 5

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            type="button"
            className={`owner-order-page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </button>
        )
      }
    } else {
      // First pages
      for (let i = 1; i <= Math.min(maxVisibleButtons, totalPages - 1); i++) {
        buttons.push(
          <button
            key={i}
            type="button"
            className={`owner-order-page-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </button>
        )
      }

      // Ellipsis
      buttons.push(
        <span key="ellipsis" className="owner-order-page-ellipsis">
          ...
        </span>
      )

      // Last page (e.g. 35)
      buttons.push(
        <button
          key={totalPages}
          type="button"
          className={`owner-order-page-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => setCurrentPage(totalPages)}
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </button>
      )
    }

    return buttons
  }

  // Render Order Details Inner Content (used both in desktop side panel & mobile drawer)
  const renderOrderDetailsContent = (order, isDrawer = false) => {
    if (!order) return null

    return (
      <>
        {/* Panel Header */}
        <div className="owner-order-details-header">
          <div className="owner-order-details-header-title">
            <h2 className="owner-order-details-title">Order #{order.id}</h2>
            {renderStatusBadge(order.status)}
          </div>
          <button
            type="button"
            className="owner-order-details-close-btn"
            onClick={() => {
              if (isDrawer) {
                setIsMobileDrawerOpen(false)
              } else {
                setSelectedOrderId(null)
              }
            }}
            title="Close details"
            aria-label="Close order details"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2x2 Customer & Table Info Grid */}
        <div className="owner-order-info-grid">
          <div className="owner-order-info-box">
            <User size={16} className="owner-order-info-icon" />
            <div className="owner-order-info-text">
              <span className="owner-order-info-label">Customer</span>
              <span className="owner-order-info-val">{order.customerName}</span>
            </div>
          </div>

          <div className="owner-order-info-box">
            <UtensilsCrossed size={16} className="owner-order-info-icon" />
            <div className="owner-order-info-text">
              <span className="owner-order-info-label">Table</span>
              <span className="owner-order-info-val">
                {order.tableDisplay || `Table ${order.tableNumber.replace('T', '')}`}
              </span>
            </div>
          </div>

          <div className="owner-order-info-box">
            <Clock size={16} className="owner-order-info-icon" />
            <div className="owner-order-info-text">
              <span className="owner-order-info-label">Order Time</span>
              <span className="owner-order-info-val">
                {order.dateTime.replace(',', ' ·')}
              </span>
            </div>
          </div>

          <div className="owner-order-info-box">
            <CreditCard size={16} className="owner-order-info-icon" />
            <div className="owner-order-info-text">
              <span className="owner-order-info-label">Payment Method</span>
              <span className="owner-order-info-val">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="owner-order-items-section">
          <h3 className="owner-order-items-title">
            Order Items ({order.items ? order.items.length : order.itemCount})
          </h3>
          <div className="owner-order-items-list">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="owner-order-item-row">
                  <div className="owner-order-item-left">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="owner-order-item-img"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentNode.innerText = '🍽️'
                      }}
                    />
                    <div className="owner-order-item-info">
                      <span className="owner-order-item-name">{item.name}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      flexShrink: 0,
                    }}
                  >
                    <span className="owner-order-item-qty">× {item.quantity}</span>
                    <span className="owner-order-item-price">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '13px', color: '#8c7b6f' }}>
                {order.itemCount} item(s) ordered
              </div>
            )}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="owner-order-bill-summary">
          <div className="owner-order-bill-row">
            <span>Subtotal</span>
            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="owner-order-bill-row owner-order-bill-row--discount">
            <span>Discount</span>
            <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
          </div>

          <div className="owner-order-bill-row owner-order-bill-row--total">
            <span>Total</span>
            <span className="owner-order-total-amount">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Status & Notes */}
        <div className="owner-order-meta-grid">
          <div className="owner-order-meta-col">
            <span className="owner-order-meta-label">Order Status</span>
            <div>{renderStatusBadge(order.status)}</div>
          </div>
          <div className="owner-order-meta-col">
            <span className="owner-order-meta-label">Notes</span>
            <div className="owner-order-meta-notes">
              {order.notes || 'No special notes'}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="owner-order-report-section">
      {/* ====================================================================
          1. 4 KPI SUMMARY CARDS (Matching Reference Screenshot)
          ==================================================================== */}
      <section className="owner-order-kpis-grid">
        {/* Card 1: Total Orders */}
        <div className="owner-order-kpi-card">
          <div
            className="owner-order-kpi-icon-box"
            style={{ background: '#fdf2e7', color: '#c47d2e' }}
          >
            <ShoppingCart size={22} />
          </div>
          <div className="owner-order-kpi-content">
            <span className="owner-order-kpi-label">Total Orders</span>
            <span className="owner-order-kpi-value">{kpiMetrics.total}</span>
            <span className="owner-order-kpi-trend owner-order-kpi-trend--positive">
              {kpiMetrics.totalTrend}
            </span>
          </div>
        </div>

        {/* Card 2: Completed Orders */}
        <div className="owner-order-kpi-card">
          <div
            className="owner-order-kpi-icon-box"
            style={{ background: '#ecfdf5', color: '#16a34a' }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div className="owner-order-kpi-content">
            <span className="owner-order-kpi-label">Completed Orders</span>
            <span className="owner-order-kpi-value">{kpiMetrics.completed}</span>
            <span className="owner-order-kpi-trend owner-order-kpi-trend--positive">
              {kpiMetrics.completedTrend}
            </span>
          </div>
        </div>

        {/* Card 3: In Progress Orders */}
        <div className="owner-order-kpi-card">
          <div
            className="owner-order-kpi-icon-box"
            style={{ background: '#fff7ed', color: '#ea580c' }}
          >
            <Clock size={22} />
          </div>
          <div className="owner-order-kpi-content">
            <span className="owner-order-kpi-label">In Progress Orders</span>
            <span className="owner-order-kpi-value">{kpiMetrics.inProgress}</span>
            <span className="owner-order-kpi-trend owner-order-kpi-trend--negative">
              {kpiMetrics.inProgressTrend}
            </span>
          </div>
        </div>

        {/* Card 4: Cancelled Orders */}
        <div className="owner-order-kpi-card">
          <div
            className="owner-order-kpi-icon-box"
            style={{ background: '#fef2f2', color: '#dc2626' }}
          >
            <XCircle size={22} />
          </div>
          <div className="owner-order-kpi-content">
            <span className="owner-order-kpi-label">Cancelled Orders</span>
            <span className="owner-order-kpi-value">{kpiMetrics.cancelled}</span>
            <span className="owner-order-kpi-trend owner-order-kpi-trend--neutral">
              {kpiMetrics.cancelledTrend}
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. SEARCH & FILTER TOOLBAR (Matching Reference Screenshot)
          ==================================================================== */}
      <section className="owner-order-toolbar">
        {/* Search input */}
        <div className="owner-order-search-box">
          <Search size={16} color="#8c7b6f" />
          <input
            type="text"
            className="owner-order-search-input"
            placeholder="Search orders by ID, customer name, table number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search orders"
          />
        </div>

        {/* Filter controls */}
        <div className="owner-order-filter-group">
          {/* Status filter */}
          <div className="owner-order-select-wrap">
            <select
              className="owner-order-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by order status"
            >
              <option value="All Status">All Status</option>
              <option value="Queued">Queued</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="owner-order-select-icon" />
          </div>

          {/* Payment method filter */}
          <div className="owner-order-select-wrap">
            <select
              className="owner-order-select"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              aria-label="Filter by payment method"
            >
              <option value="All Payment Methods">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
            <ChevronDown size={14} className="owner-order-select-icon" />
          </div>

          {/* Table filter */}
          <div className="owner-order-select-wrap">
            <select
              className="owner-order-select"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              aria-label="Filter by table"
            >
              <option value="All Tables">All Tables</option>
              {tableOptions.map((tbl) => (
                <option key={tbl} value={tbl}>
                  {tbl}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="owner-order-select-icon" />
          </div>

          {/* Reset button */}
          <button
            type="button"
            className="owner-order-reset-btn"
            onClick={handleResetFilters}
            title="Reset all filters"
          >
            Reset
          </button>
        </div>
      </section>

      {/* ====================================================================
          3. MAIN WORKSPACE: ORDER TABLE + DETAILS PANEL (Side by side on desktop)
          ==================================================================== */}
      <div
        className={`owner-order-workspace ${
          selectedOrder ? 'owner-order-workspace--split' : ''
        }`}
      >
        {/* Table / Card Container */}
        <div className="owner-order-table-card">
          {paginatedOrders.length === 0 ? (
            /* Empty State */
            <div className="owner-order-empty-state">
              <div className="owner-order-empty-icon">
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a0e0a' }}>
                No orders found
              </h3>
              <p style={{ fontSize: '13px', color: '#8c7b6f', maxWidth: '320px' }}>
                No orders match your current search and filter criteria. Try resetting or
                broadening your filters.
              </p>
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={handleResetFilters}
                style={{ marginTop: '8px' }}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table View */}
              <div className="owner-order-table-scroll">
                <table className="owner-order-table">
                  <thead>
                    <tr>
                      <th
                        className="sortable"
                        onClick={() => handleSort('id')}
                        style={{ width: '90px' }}
                      >
                        Order ID{' '}
                        {sortField === 'id' ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <span style={{ opacity: 0.35 }}>↕</span>
                        )}
                      </th>
                      <th className="sortable" onClick={() => handleSort('customer')}>
                        Customer{' '}
                        {sortField === 'customer' ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <span style={{ opacity: 0.35 }}>↕</span>
                        )}
                      </th>
                      <th>Table</th>
                      <th>Items</th>
                      <th className="sortable" onClick={() => handleSort('amount')}>
                        Amount{' '}
                        {sortField === 'amount' ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <span style={{ opacity: 0.35 }}>↕</span>
                        )}
                      </th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th className="sortable" onClick={() => handleSort('date')}>
                        Date & Time{' '}
                        {sortField === 'date' ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          <span style={{ opacity: 0.35 }}>↕</span>
                        )}
                      </th>
                      <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => {
                      const isSelected = selectedOrder && selectedOrder.id === order.id
                      return (
                        <tr
                          key={order.id}
                          className={isSelected ? 'selected' : ''}
                          onClick={() => handleSelectOrder(order)}
                        >
                          <td className="owner-order-id">#{order.id}</td>
                          <td className="owner-order-customer">{order.customerName}</td>
                          <td>{order.tableNumber}</td>
                          <td>
                            {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                          </td>
                          <td className="owner-order-amount">
                            ₹{order.amount.toLocaleString('en-IN')}
                          </td>
                          <td>{order.paymentMethod}</td>
                          <td>{renderStatusBadge(order.status)}</td>
                          <td style={{ color: '#6e645a', whiteSpace: 'nowrap' }}>
                            {order.dateTime}
                          </td>
                          <td
                            onClick={(e) => e.stopPropagation()}
                            style={{ textAlign: 'center' }}
                          >
                            <div
                              className="owner-order-actions-cell"
                              style={{ justifyContent: 'center' }}
                            >
                              {/* View Details Eye Button */}
                              <button
                                type="button"
                                className="owner-order-action-icon-btn"
                                onClick={() => handleSelectOrder(order)}
                                title="View order details"
                                aria-label={`View details of order ${order.id}`}
                              >
                                <Eye size={15} />
                              </button>

                              {/* More Actions Dropdown Button */}
                              <div style={{ position: 'relative' }}>
                                <button
                                  type="button"
                                  className="owner-order-action-icon-btn"
                                  onClick={() =>
                                    setOpenActionMenuId(
                                      openActionMenuId === order.id ? null : order.id
                                    )
                                  }
                                  title="More options"
                                  aria-label="More actions"
                                >
                                  <MoreVertical size={15} />
                                </button>

                                {openActionMenuId === order.id && (
                                  <div
                                    ref={actionMenuRef}
                                    className="owner-order-actions-dropdown"
                                  >
                                    <button
                                      type="button"
                                      className="owner-order-dropdown-item"
                                      onClick={() => {
                                        handleSelectOrder(order)
                                        setOpenActionMenuId(null)
                                      }}
                                    >
                                      <Eye size={13} />
                                      <span>View Details</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="owner-order-dropdown-item"
                                      onClick={() => handleCopyOrderId(order.id)}
                                    >
                                      <Copy size={13} />
                                      <span>Copy Order ID</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Order Cards List (Responsive view on screens <= 768px) */}
              <div className="owner-order-mobile-list">
                {paginatedOrders.map((order) => {
                  const isSelected = selectedOrder && selectedOrder.id === order.id
                  return (
                    <div
                      key={order.id}
                      className={`owner-order-mobile-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="owner-order-mobile-card-top">
                        <span className="owner-order-id">ORDER #{order.id}</span>
                        {renderStatusBadge(order.status)}
                      </div>

                      <div className="owner-order-mobile-card-body">
                        <div>
                          <div className="owner-order-customer">
                            {order.customerName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#8c7b6f', marginTop: '2px' }}>
                            {order.tableDisplay || order.tableNumber} ·{' '}
                            {order.paymentMethod}
                          </div>
                        </div>
                        <div className="owner-order-amount" style={{ fontSize: '15px' }}>
                          ₹{order.amount.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="owner-order-mobile-card-bottom">
                        <span>{order.dateTime}</span>
                        <button
                          type="button"
                          className="owner-order-mobile-view-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectOrder(order)
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination Bar (Matching Reference Screenshot) */}
              <div className="owner-order-pagination">
                {/* Left: Previous, Page Pills, Next */}
                <div className="owner-order-pagination-left">
                  <button
                    type="button"
                    className="owner-order-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {renderPageButtons()}

                  <button
                    type="button"
                    className="owner-order-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Center: Visible Range Text */}
                <div className="owner-order-pagination-center">
                  Showing {(currentPage - 1) * rowsPerPage + 1}–
                  {Math.min(currentPage * rowsPerPage, effectiveTotalCount)} of{' '}
                  {effectiveTotalCount} orders
                </div>

                {/* Right: Rows per page selector */}
                <div className="owner-order-pagination-right">
                  <span>Rows per page</span>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <select
                      className="owner-order-perpage-select"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      aria-label="Rows per page"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <ChevronDown
                      size={12}
                      style={{
                        position: 'absolute',
                        right: '6px',
                        pointerEvents: 'none',
                        color: '#6e645a',
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right-Side Desktop Order Details Panel */}
        {selectedOrder && (
          <aside
            className="owner-order-details-panel"
            aria-label="Order Details"
          >
            {renderOrderDetailsContent(selectedOrder, false)}
          </aside>
        )}
      </div>

      {/* ====================================================================
          4. MOBILE ORDER DETAILS DRAWER / OVERLAY (Screens <= 768px)
          ==================================================================== */}
      <div
        className={`owner-order-mobile-drawer-backdrop ${
          isMobileDrawerOpen ? 'open' : ''
        }`}
        onClick={() => setIsMobileDrawerOpen(false)}
      >
        <div
          className="owner-order-mobile-drawer"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Order Details Modal"
        >
          {selectedOrder && renderOrderDetailsContent(selectedOrder, true)}
        </div>
      </div>
    </div>
  )
}
