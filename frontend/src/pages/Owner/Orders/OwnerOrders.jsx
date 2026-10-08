import { useState, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  Calendar,
  ChevronDown,
  Plus,
  Search,
  SlidersHorizontal,
  FileText,
  Clock,
  ChefHat,
  CheckCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  LayoutGrid,
  CreditCard,
  X,
  Check,
  ShoppingBag,
} from 'lucide-react'
import {
  OWNER_ORDER_KPIS,
  OWNER_ALL_ORDERS,
} from '../data/ownerMockData'

export default function OwnerOrders() {
  const outletCtx = useOutletContext() || {}
  const selectedCafe = outletCtx.selectedCafe || { name: 'The Daily Bean' }
  const navigate = useNavigate()

  // Orders State (allows adding and updating orders dynamically)
  const [orders, setOrders] = useState(OWNER_ALL_ORDERS)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [activeTab, setActiveTab] = useState('All Orders') // 'All Orders' | 'Queued' | 'In Progress' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState('All')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All')
  const [dateRange, setDateRange] = useState('Today, Oct 1, 2026')
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modals & Popups
  const [actionMenuOrderId, setActionMenuOrderId] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')
  const [newTable, setNewTable] = useState('T1')
  const [newSelectedItem, setNewSelectedItem] = useState('Classic Burger')
  const [newPaymentStatus, setNewPaymentStatus] = useState('Pending')
  const [newNotes, setNewNotes] = useState('')

  // Show Toast helper
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tab filter
      if (activeTab === 'Queued' && order.orderStatus !== 'Queued') return false
      if (activeTab === 'In Progress' && order.orderStatus !== 'In Progress') return false
      if (activeTab === 'Completed' && order.orderStatus !== 'Completed') return false

      // Table filter
      if (selectedTable !== 'All' && order.table !== selectedTable) return false

      // Payment Status filter
      if (selectedPaymentStatus !== 'All' && order.paymentStatus !== selectedPaymentStatus) return false

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = order.id.toLowerCase().includes(q)
        const matchesName = order.customer.name.toLowerCase().includes(q)
        const matchesTable = order.table.toLowerCase().includes(q)
        const matchesItems = order.itemsSummary.toLowerCase().includes(q)
        if (!matchesId && !matchesName && !matchesTable && !matchesItems) return false
      }

      return true
    })
  }, [orders, activeTab, selectedTable, selectedPaymentStatus, searchQuery])

  // Paginated Orders
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1
  const displayedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, currentPage, pageSize])

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: orders.length,
      queued: orders.filter((o) => o.orderStatus === 'Queued').length,
      inProgress: orders.filter((o) => o.orderStatus === 'In Progress').length,
      completed: orders.filter((o) => o.orderStatus === 'Completed').length,
    }
  }, [orders])

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(displayedOrders.map((o) => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOne = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Update Status
  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    )
    if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
      setSelectedOrderDetail((prev) => ({ ...prev, orderStatus: newStatus }))
    }
    setActionMenuOrderId(null)
    showToast(`Order ${orderId} updated to ${newStatus}`)
  }

  // Add Order Submit
  const handleCreateOrder = (e) => {
    e.preventDefault()
    if (!newCustomerName) return

    const newIdNum = orders.length + 106
    const newId = `#${newIdNum}`

    const itemPriceMap = {
      'Classic Burger': 220,
      'Margherita Pizza': 350,
      'Cold Coffee': 180,
      'French Fries': 140,
      'Cappuccino': 160,
    }

    const price = itemPriceMap[newSelectedItem] || 220

    const newOrderObj = {
      id: newId,
      orderNum: String(newIdNum),
      time: 'Just now',
      customer: {
        name: newCustomerName,
        phone: newCustomerPhone || '+91 98765 00000',
        initials: newCustomerName.slice(0, 2).toUpperCase(),
      },
      table: newTable,
      itemsSummary: newSelectedItem,
      itemsCount: 1,
      items: [
        {
          name: newSelectedItem,
          qty: 1,
          price: price,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&auto=format&fit=crop&q=80',
        },
      ],
      amount: price,
      formattedAmount: `₹ ${price}`,
      orderStatus: 'Queued',
      paymentStatus: newPaymentStatus,
      paymentMethod: 'UPI',
      notes: newNotes,
    }

    setOrders([newOrderObj, ...orders])
    setIsAddModalOpen(false)
    setNewCustomerName('')
    setNewCustomerPhone('')
    setNewNotes('')
    showToast(`Order ${newId} created successfully!`)
  }

  return (
    <div className="owner-module-container">
      {/* Toast Notification */}
      {toastMessage && <div className="owner-toast">{toastMessage}</div>}

      {/* ====================================================================
          PAGE HEADER: Title + Subtitle + Date Selector + Add Order Button
          ==================================================================== */}
      <div className="owner-module-header">
        <div className="owner-module-title-wrap">
          <h1 className="owner-module-title">Orders</h1>
          <p className="owner-module-subtitle">
            View and manage all customer orders for {selectedCafe?.name || 'The Daily Bean'}.
          </p>
        </div>

        <div className="owner-module-actions">
          {/* Interactive Date Range Button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
              aria-expanded={isDateMenuOpen}
            >
              <Calendar size={15} color="#c47d2e" />
              <span>{dateRange}</span>
              <ChevronDown size={14} color="#8c7b6f" />
            </button>

            {isDateMenuOpen && (
              <div className="owner-export-dropdown" style={{ width: '190px' }}>
                {['Today, Oct 1, 2026', 'Yesterday, Sep 30, 2026', 'Last 7 Days', 'This Month'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="owner-export-dropdown-item"
                    onClick={() => {
                      setDateRange(d)
                      setIsDateMenuOpen(false)
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Add Order Button */}
          <button
            type="button"
            className="owner-btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>+ Add Order</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          STATUS TABS BAR (All Orders 48, Queued 12, In Progress 14, Completed 18)
          ==================================================================== */}
      <div className="owner-orders-tabs-bar">
        <button
          type="button"
          className={`owner-orders-tab ${activeTab === 'All Orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('All Orders')
            setCurrentPage(1)
          }}
        >
          <span>All Orders</span>
          <span className="owner-orders-tab-count">{tabCounts.all}</span>
        </button>

        <button
          type="button"
          className={`owner-orders-tab ${activeTab === 'Queued' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Queued')
            setCurrentPage(1)
          }}
        >
          <span>Queued</span>
          <span className="owner-orders-tab-count">{tabCounts.queued}</span>
        </button>

        <button
          type="button"
          className={`owner-orders-tab ${activeTab === 'In Progress' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('In Progress')
            setCurrentPage(1)
          }}
        >
          <span>In Progress</span>
          <span className="owner-orders-tab-count">{tabCounts.inProgress}</span>
        </button>

        <button
          type="button"
          className={`owner-orders-tab ${activeTab === 'Completed' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Completed')
            setCurrentPage(1)
          }}
        >
          <span>Completed</span>
          <span className="owner-orders-tab-count">{tabCounts.completed}</span>
        </button>
      </div>

      {/* ====================================================================
          FILTER BAR: Search, Table Dropdown, Payment Dropdown, More Filters
          ==================================================================== */}
      <div className="owner-orders-filter-bar">
        <div className="owner-orders-search-input-wrap">
          <Search size={16} color="#8c7b6f" />
          <input
            type="text"
            className="owner-orders-search-input"
            placeholder="Search order ID, customer, table..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c7b6f', display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Table Selector Dropdown */}
        <select
          className="owner-select-field"
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by Table"
        >
          <option value="All">Table (All)</option>
          {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map((t) => (
            <option key={t} value={t}>
              Table {t}
            </option>
          ))}
        </select>

        {/* Payment Status Dropdown */}
        <select
          className="owner-select-field"
          value={selectedPaymentStatus}
          onChange={(e) => {
            setSelectedPaymentStatus(e.target.value)
            setCurrentPage(1)
          }}
          aria-label="Filter by Payment Status"
        >
          <option value="All">Payment Status (All)</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        {/* More Filters / Reset */}
        {(selectedTable !== 'All' || selectedPaymentStatus !== 'All' || searchQuery) ? (
          <button
            type="button"
            className="owner-btn-secondary"
            onClick={() => {
              setSelectedTable('All')
              setSelectedPaymentStatus('All')
              setSearchQuery('')
              setCurrentPage(1)
            }}
            style={{ color: '#c47d2e', fontSize: '12px' }}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        ) : (
          <button
            type="button"
            className="owner-btn-secondary"
            onClick={() => showToast('Filters are up to date.')}
          >
            <SlidersHorizontal size={14} color="#8c7b6f" />
            <span>More Filters</span>
          </button>
        )}
      </div>

      {/* ====================================================================
          ORDERS 5 KPI CARDS
          ==================================================================== */}
      <section className="owner-kpis-grid" aria-label="Orders Summary Metrics">
        {/* Total Orders */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <ShoppingBag size={18} />
            </div>
            <span className="owner-kpi-card__title">Total Orders</span>
          </div>
          <div className="owner-kpi-card__value">48</div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              {OWNER_ORDER_KPIS.totalOrders.growth}
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div className="owner-kpi-card__icon-box">
              <FileText size={18} />
            </div>
            <span className="owner-kpi-card__title">Total Revenue</span>
          </div>
          <div className="owner-kpi-card__value">₹ 12,430</div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              {OWNER_ORDER_KPIS.totalRevenue.growth}
            </span>
          </div>
        </div>

        {/* Queued */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#fef3c7', color: '#d97706' }}
            >
              <Clock size={18} />
            </div>
            <span className="owner-kpi-card__title">Queued</span>
          </div>
          <div className="owner-kpi-card__value">12</div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--neutral">
              3 waiting &gt;10m
            </span>
          </div>
        </div>

        {/* In Progress */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#e0f2fe', color: '#0284c7' }}
            >
              <ChefHat size={18} />
            </div>
            <span className="owner-kpi-card__title">In Progress</span>
          </div>
          <div className="owner-kpi-card__value">14</div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              Avg 8m in prep
            </span>
          </div>
        </div>

        {/* Completed */}
        <div className="owner-kpi-card">
          <div className="owner-kpi-card__top">
            <div
              className="owner-kpi-card__icon-box"
              style={{ background: '#ecfdf5', color: '#10b981' }}
            >
              <CheckCircle size={18} />
            </div>
            <span className="owner-kpi-card__title">Completed</span>
          </div>
          <div className="owner-kpi-card__value">18</div>
          <div className="owner-kpi-card__bottom">
            <span className="owner-kpi-card__trend owner-kpi-card__trend--positive">
              32 items served
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          DESKTOP ORDERS TABLE CARD
          ==================================================================== */}
      <div className="owner-orders-table-card">
        <div className="owner-table-responsive">
          <table className="owner-orders-full-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={
                      displayedOrders.length > 0 &&
                      selectedOrders.length === displayedOrders.length
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all orders"
                  />
                </th>
                <th>#</th>
                <th>Order Time ↓</th>
                <th>Customer</th>
                <th>Table</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px', color: '#8c7b6f' }}>
                    No orders match your current filters.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => {
                  const isChecked = selectedOrders.includes(order.id)
                  const isMenuOpen = actionMenuOrderId === order.id

                  return (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor: isChecked ? '#fffaf4' : undefined,
                      }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </td>

                      {/* # ID */}
                      <td style={{ fontWeight: 700, color: '#1a0e0a' }}>
                        {order.id}
                      </td>

                      {/* Time */}
                      <td style={{ color: '#6e645a', whiteSpace: 'nowrap' }}>
                        {order.time}
                      </td>

                      {/* Customer */}
                      <td>
                        <div className="owner-customer-cell">
                          <div className="owner-customer-avatar-sm">
                            {order.customer.initials}
                          </div>
                          <div>
                            <div className="owner-customer-name-text">
                              {order.customer.name}
                            </div>
                            <div className="owner-customer-phone-text">
                              {order.customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Table */}
                      <td>
                        <span className="owner-table-tag-badge">
                          {order.table}
                        </span>
                      </td>

                      {/* Items */}
                      <td>
                        <div className="owner-items-cell">
                          {order.items.slice(0, 2).map((it, idx) => (
                            <img
                              key={idx}
                              src={it.image}
                              alt={it.name}
                              className="owner-item-thumbnail"
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          ))}
                          {order.itemsCount > 2 && (
                            <span className="owner-items-more-badge">
                              +{order.itemsCount - 2} more
                            </span>
                          )}
                          <span style={{ fontSize: '12px', color: '#4a3b32', marginLeft: '4px' }}>
                            {order.itemsSummary}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ fontWeight: 800, color: '#1a0e0a' }}>
                        {order.formattedAmount}
                      </td>

                      {/* Order Status */}
                      <td>
                        <span
                          className={`owner-status-badge ${
                            order.orderStatus === 'Completed'
                              ? 'owner-status-badge--completed'
                              : order.orderStatus === 'In Progress'
                              ? 'owner-status-badge--inprogress'
                              : 'owner-status-badge--queued'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td>
                        <span
                          className={`owner-payment-badge ${
                            order.paymentStatus === 'Paid'
                              ? 'owner-payment-badge--paid'
                              : 'owner-payment-badge--pending'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Action Menu */}
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        <button
                          type="button"
                          className="owner-action-menu-btn"
                          onClick={() =>
                            setActionMenuOrderId(isMenuOpen ? null : order.id)
                          }
                          aria-label="Order actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Action Popup */}
                        {isMenuOpen && (
                          <div className="owner-action-popup">
                            <button
                              type="button"
                              className="owner-action-popup-item"
                              onClick={() => {
                                setSelectedOrderDetail(order)
                                setActionMenuOrderId(null)
                              }}
                            >
                              <Eye size={14} color="#c47d2e" />
                              <span>View Order</span>
                            </button>
                            <button
                              type="button"
                              className="owner-action-popup-item"
                              onClick={() => {
                                const nextStatus =
                                  order.orderStatus === 'Queued'
                                    ? 'In Progress'
                                    : order.orderStatus === 'In Progress'
                                    ? 'Completed'
                                    : 'Queued'
                                handleUpdateStatus(order.id, nextStatus)
                              }}
                            >
                              <ChefHat size={14} color="#c47d2e" />
                              <span>Next Status</span>
                            </button>
                            <button
                              type="button"
                              className="owner-action-popup-item"
                              onClick={() => {
                                navigate('/owner/customers')
                                setActionMenuOrderId(null)
                              }}
                            >
                              <User size={14} color="#c47d2e" />
                              <span>View Customer</span>
                            </button>
                            <button
                              type="button"
                              className="owner-action-popup-item"
                              onClick={() => {
                                navigate('/owner/tables')
                                setActionMenuOrderId(null)
                              }}
                            >
                              <LayoutGrid size={14} color="#c47d2e" />
                              <span>View Table</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="owner-pagination-bar">
          <span className="owner-pagination-text">
            Showing {filteredOrders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Page Size Select */}
            <select
              className="owner-select-field"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              aria-label="Orders per page"
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>

            {/* Navigation buttons */}
            <div className="owner-pagination-nav">
              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={`owner-pagination-btn ${
                    currentPage === pg ? 'active' : ''
                  }`}
                  onClick={() => setCurrentPage(pg)}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MOBILE ORDERS VIEW (Reflows into clean cards matching screenshot!)
          ==================================================================== */}
      <div className="owner-mobile-orders-list">
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            className="owner-mobile-order-card"
            onClick={() => setSelectedOrderDetail(order)}
          >
            <div className="owner-mobile-order-card__top">
              <div className="owner-mobile-order-card__id-time">
                <span>{order.id}</span>
                <span style={{ color: '#8c7b6f', fontWeight: 500, fontSize: '12px' }}>
                  {order.time}
                </span>
                <span className="owner-table-tag-badge">{order.table}</span>
              </div>
              <div className="owner-mobile-order-card__amount">
                {order.formattedAmount}
              </div>
            </div>

            <div className="owner-mobile-order-card__body">
              {order.items[0]?.image && (
                <img
                  src={order.items[0].image}
                  alt={order.customer.name}
                  className="owner-mobile-order-card__img"
                />
              )}
              <div className="owner-mobile-order-card__details">
                <div className="owner-mobile-order-card__customer">
                  {order.customer.name}
                </div>
                <div className="owner-mobile-order-card__items">
                  {order.itemsSummary}
                </div>
              </div>
            </div>

            <div className="owner-mobile-order-card__bottom">
              <span
                className={`owner-status-badge ${
                  order.orderStatus === 'Completed'
                    ? 'owner-status-badge--completed'
                    : order.orderStatus === 'In Progress'
                    ? 'owner-status-badge--inprogress'
                    : 'owner-status-badge--queued'
                }`}
              >
                {order.orderStatus}
              </span>

              <span
                className={`owner-payment-badge ${
                  order.paymentStatus === 'Paid'
                    ? 'owner-payment-badge--paid'
                    : 'owner-payment-badge--pending'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          MODAL 1: ADD NEW ORDER
          ==================================================================== */}
      {isAddModalOpen && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="owner-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">Create New Order</h3>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="owner-modal-body">
                <div className="owner-modal-field">
                  <label className="owner-modal-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="owner-modal-input"
                    placeholder="e.g. Varun Dhawan"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="owner-modal-input"
                    placeholder="+91 98765 43210"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="owner-modal-field">
                    <label className="owner-modal-label">Select Table *</label>
                    <select
                      className="owner-modal-input"
                      value={newTable}
                      onChange={(e) => setNewTable(e.target.value)}
                    >
                      {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'].map((tbl) => (
                        <option key={tbl} value={tbl}>
                          Table {tbl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="owner-modal-field">
                    <label className="owner-modal-label">Payment Status</label>
                    <select
                      className="owner-modal-input"
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Menu Item *</label>
                  <select
                    className="owner-modal-input"
                    value={newSelectedItem}
                    onChange={(e) => setNewSelectedItem(e.target.value)}
                  >
                    <option value="Classic Burger">Classic Burger — ₹220</option>
                    <option value="Margherita Pizza">Margherita Pizza — ₹350</option>
                    <option value="Cold Coffee">Cold Coffee — ₹180</option>
                    <option value="French Fries">French Fries — ₹140</option>
                    <option value="Cappuccino">Cappuccino — ₹160</option>
                  </select>
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Kitchen Notes</label>
                  <input
                    type="text"
                    className="owner-modal-input"
                    placeholder="e.g. Less spicy, extra cheese"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="owner-btn-primary">
                  <Check size={16} />
                  <span>Confirm Order</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: ORDER DETAILS VIEW & STATUS UPDATE
          ==================================================================== */}
      {selectedOrderDetail && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setSelectedOrderDetail(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="owner-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <div>
                <h3 className="owner-modal-title">
                  Order Details {selectedOrderDetail.id}
                </h3>
                <span style={{ fontSize: '12px', color: '#8c7b6f' }}>
                  {selectedOrderDetail.time} • Table {selectedOrderDetail.table}
                </span>
              </div>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setSelectedOrderDetail(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="owner-modal-body">
              {/* Customer Box */}
              <div
                style={{
                  background: '#faf8f5',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div className="owner-customer-avatar-sm">
                  {selectedOrderDetail.customer.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#1a0e0a' }}>
                    {selectedOrderDetail.customer.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#8c7b6f' }}>
                    {selectedOrderDetail.customer.phone}
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="owner-modal-label">Ordered Items</span>
                {selectedOrderDetail.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: '#fcfbf9',
                      border: '1px solid #f2ede4',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#1a0e0a' }}>
                          {it.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8c7b6f' }}>
                          Qty: {it.qty}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1a0e0a' }}>
                      ₹ {it.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Update Options */}
              <div className="owner-modal-field">
                <label className="owner-modal-label">Update Order Status</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Queued', 'In Progress', 'Completed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`owner-orders-tab ${
                        selectedOrderDetail.orderStatus === st ? 'active' : ''
                      }`}
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => handleUpdateStatus(selectedOrderDetail.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrderDetail.notes && (
                <div style={{ fontSize: '12px', color: '#7a6e64', background: '#fef7ee', padding: '8px 12px', borderRadius: '8px' }}>
                  <strong>Special Notes:</strong> {selectedOrderDetail.notes}
                </div>
              )}
            </div>

            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setSelectedOrderDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
