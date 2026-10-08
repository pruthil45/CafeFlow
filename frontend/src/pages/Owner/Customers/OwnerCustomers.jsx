import { useState, useMemo } from 'react'
import {
  Search,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  ChevronRight as ChevronRightIcon,
  Phone,
  Gift,
  Clock,
  ShoppingBag,
  Award,
} from 'lucide-react'
import { OWNER_CUSTOMERS_DATA } from '../data/ownerMockData'
import '../Owner.css'

export default function OwnerCustomers() {
  const [activeTab, setActiveTab] = useState('all') // 'all', 'new', 'returning'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' or 'desc'

  // Selected customer for slide-in drawer (default to Rahul Mehta for instant preview)
  const [selectedCustomer, setSelectedCustomer] = useState(
    OWNER_CUSTOMERS_DATA.customers[0]
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerTab, setDrawerTab] = useState('overview') // 'overview', 'orders', 'loyalty', 'promotions'

  // Filter customers by tab and search
  const filteredCustomers = useMemo(() => {
    return OWNER_CUSTOMERS_DATA.customers.filter((c) => {
      // Tab filter
      if (activeTab === 'new' && c.type !== 'new') return false
      if (activeTab === 'returning' && c.type !== 'returning') return false

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchName = c.name.toLowerCase().includes(query)
        const matchPhone = c.phone.toLowerCase().includes(query)
        if (!matchName && !matchPhone) return false
      }

      return true
    })
  }, [activeTab, searchQuery])

  // Sort customers
  const sortedCustomers = useMemo(() => {
    if (!sortField) return filteredCustomers
    return [...filteredCustomers].sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredCustomers, sortField, sortDirection])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / rowsPerPage))
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedCustomers.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedCustomers, currentPage, rowsPerPage])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleOpenDrawer = (customer) => {
    setSelectedCustomer(customer)
    setDrawerTab('overview')
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  // Calculate counts for tabs
  const allCount = OWNER_CUSTOMERS_DATA.customers.length
  const newCount = OWNER_CUSTOMERS_DATA.customers.filter((c) => c.type === 'new').length
  const returningCount = OWNER_CUSTOMERS_DATA.customers.filter((c) => c.type === 'returning').length

  const startIdx = (currentPage - 1) * rowsPerPage + 1
  const endIdx = Math.min(currentPage * rowsPerPage, sortedCustomers.length)

  return (
    <div className="owner-module-container owner-customers-page">
      {/* Page Header */}
      <div className="owner-module-header">
        <div>
          <h1 className="owner-module-title">Customers</h1>
          <p className="owner-module-subtitle">
            View and manage your café customers, their order history, loyalty points and more.
          </p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="owner-customers-header-bar">
        <div className="owner-customers-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`owner-customers-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all')
              setCurrentPage(1)
            }}
          >
            All ({allCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'new'}
            className={`owner-customers-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('new')
              setCurrentPage(1)
            }}
          >
            New ({newCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'returning'}
            className={`owner-customers-tab-btn ${activeTab === 'returning' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('returning')
              setCurrentPage(1)
            }}
          >
            Returning ({returningCount})
          </button>
        </div>

        {/* Search */}
        <div className="owner-customers-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Search customers"
          />
        </div>
      </div>

      {/* Desktop Customers Table */}
      <div className="owner-customers-table-card">
        <div className="owner-customers-table-wrap">
          <table className="owner-customers-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  <span className="owner-customers-th-sortable">
                    Name <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th>Mobile Number</th>
                <th onClick={() => handleSort('visits')}>
                  <span className="owner-customers-th-sortable">
                    Visits <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th onClick={() => handleSort('totalSpent')}>
                  <span className="owner-customers-th-sortable">
                    Total Spent <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th onClick={() => handleSort('lastVisit')}>
                  <span className="owner-customers-th-sortable">
                    Last Visit <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th onClick={() => handleSort('loyaltyPoints')}>
                  <span className="owner-customers-th-sortable">
                    Loyalty Points <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th onClick={() => handleSort('totalOrders')}>
                  <span className="owner-customers-th-sortable">
                    Total Orders <ChevronsUpDown size={14} />
                  </span>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className={selectedCustomer?.id === customer.id && isDrawerOpen ? 'selected' : ''}
                >
                  <td className="owner-customers-name-cell">{customer.name}</td>
                  <td style={{ color: '#55473d' }}>{customer.phone}</td>
                  <td>{customer.visits}</td>
                  <td style={{ fontWeight: 600 }}>{customer.formattedSpent}</td>
                  <td style={{ color: '#7a6a5e' }}>{customer.lastVisit}</td>
                  <td style={{ fontWeight: 600 }}>{customer.loyaltyPoints}</td>
                  <td>{customer.totalOrders}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="owner-customers-view-btn"
                      onClick={() => handleOpenDrawer(customer)}
                      aria-label={`View details for ${customer.name}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#8c7b6f' }}>
                    No customers found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="owner-customers-pagination-bar">
          <div>
            Showing {sortedCustomers.length > 0 ? startIdx : 0} to {endIdx} of{' '}
            {sortedCustomers.length} customers
          </div>

          <div className="owner-pagination-controls">
            <button
              type="button"
              className="owner-pagination-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dynamic page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`owner-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}

            {totalPages > 5 && (
              <>
                <span style={{ padding: '0 4px', color: '#9c8e82' }}>...</span>
                <button
                  type="button"
                  className={`owner-pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              type="button"
              className="owner-pagination-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="owner-pagination-rows-select">
            <span>Rows per page</span>
            <select
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
          </div>
        </div>
      </div>

      {/* Mobile Customer Cards (visible on mobile screens <= 768px) */}
      <div className="owner-mobile-customer-cards">
        {paginatedCustomers.map((customer) => (
          <div key={customer.id} className="owner-mobile-customer-card">
            <div className="owner-mobile-customer-top">
              <div>
                <div className="owner-mobile-customer-name">{customer.name}</div>
                <div className="owner-mobile-customer-phone">{customer.phone}</div>
              </div>
              <button
                type="button"
                className="owner-customers-view-btn"
                onClick={() => handleOpenDrawer(customer)}
              >
                View
              </button>
            </div>

            <div className="owner-mobile-customer-stats">
              <div>
                <div className="owner-mobile-customer-stat-val">{customer.visits}</div>
                <div className="owner-mobile-customer-stat-lbl">Visits</div>
              </div>
              <div>
                <div className="owner-mobile-customer-stat-val">{customer.formattedSpent}</div>
                <div className="owner-mobile-customer-stat-lbl">Spent</div>
              </div>
              <div>
                <div className="owner-mobile-customer-stat-val">{customer.loyaltyPoints}</div>
                <div className="owner-mobile-customer-stat-lbl">Points</div>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
          }}
        >
          <button
            type="button"
            className="owner-pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d5b4f' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="owner-pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slide-in Customer Details Drawer */}
      <div
        className={`owner-customer-drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      <aside
        className={`owner-customer-drawer ${isDrawerOpen ? 'open' : ''}`}
        aria-label="Customer Details Drawer"
      >
        {selectedCustomer && (
          <>
            {/* Drawer Header */}
            <div className="owner-customer-drawer-header">
              <div>
                <h2 className="owner-customer-drawer-title">{selectedCustomer.name}</h2>
                <div className="owner-customer-drawer-subtitle">
                  Customer since {selectedCustomer.memberSince || 'Jan 2026'}
                </div>
              </div>
              <button
                type="button"
                className="owner-customer-drawer-close"
                onClick={handleCloseDrawer}
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Tabs Navigation */}
            <div className="owner-customer-drawer-nav">
              <button
                type="button"
                className={`owner-customer-drawer-tab ${drawerTab === 'overview' ? 'active' : ''}`}
                onClick={() => setDrawerTab('overview')}
              >
                Overview
              </button>
              <button
                type="button"
                className={`owner-customer-drawer-tab ${drawerTab === 'orders' ? 'active' : ''}`}
                onClick={() => setDrawerTab('orders')}
              >
                Orders
              </button>
              <button
                type="button"
                className={`owner-customer-drawer-tab ${drawerTab === 'loyalty' ? 'active' : ''}`}
                onClick={() => setDrawerTab('loyalty')}
              >
                Loyalty
              </button>
              <button
                type="button"
                className={`owner-customer-drawer-tab ${drawerTab === 'promotions' ? 'active' : ''}`}
                onClick={() => setDrawerTab('promotions')}
              >
                Promotions
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="owner-customer-drawer-body">
              {drawerTab === 'overview' && (
                <>
                  {/* 6 Summary Metrics Grid */}
                  <div className="owner-customer-metrics-grid">
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.visits}</div>
                      <div className="owner-customer-metric-lbl">Total Visits</div>
                    </div>
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.formattedSpent}</div>
                      <div className="owner-customer-metric-lbl">Total Spent</div>
                    </div>
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.formattedAvgSpend}</div>
                      <div className="owner-customer-metric-lbl">Avg. Spend</div>
                    </div>
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.loyaltyPoints}</div>
                      <div className="owner-customer-metric-lbl">Loyalty Points</div>
                    </div>
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.totalOrders}</div>
                      <div className="owner-customer-metric-lbl">Total Orders</div>
                    </div>
                    <div className="owner-customer-metric-box">
                      <div className="owner-customer-metric-val">{selectedCustomer.lastVisit}</div>
                      <div className="owner-customer-metric-lbl">Last Visit</div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="owner-customer-section-card">
                    <div className="owner-customer-section-title">
                      <span>Contact Details</span>
                    </div>
                    <div className="owner-customer-contact-row">
                      <span className="owner-customer-contact-label">Mobile Number</span>
                      <span className="owner-customer-contact-val">{selectedCustomer.phone}</span>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="owner-customer-section-card">
                    <div className="owner-customer-section-title">
                      <span>Recent Orders</span>
                      <button type="button" onClick={() => setDrawerTab('orders')}>
                        View All
                      </button>
                    </div>

                    {selectedCustomer.recentOrders && selectedCustomer.recentOrders.length > 0 ? (
                      selectedCustomer.recentOrders.map((order) => (
                        <div key={order.id} className="owner-customer-order-item">
                          <div>
                            <div className="owner-customer-order-num">{order.id}</div>
                            <div className="owner-customer-order-sub">
                              {order.date} · {order.itemsCount} items
                            </div>
                          </div>
                          <div className="owner-customer-order-right">
                            <span className="owner-customer-order-amount">{order.amount}</span>
                            <span className="owner-customer-order-badge">{order.status}</span>
                            <ChevronRightIcon size={14} color="#a89b90" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: '#8c7b6f' }}>No recent orders.</div>
                    )}
                  </div>

                  {/* Loyalty Points Progress */}
                  <div className="owner-loyalty-box">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <div className="owner-loyalty-pts">{selectedCustomer.loyaltyPoints}</div>
                        <div className="owner-loyalty-pts-label">Current Points</div>
                      </div>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8c4a23',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        onClick={() => setDrawerTab('loyalty')}
                      >
                        View Details
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', color: '#6d5b4f', fontWeight: 600 }}>
                      {selectedCustomer.loyaltyNextReward} points to next reward
                    </div>

                    <div className="owner-loyalty-progress-track">
                      <div
                        className="owner-loyalty-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedCustomer.loyaltyPoints / selectedCustomer.loyaltyTarget) * 100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="owner-loyalty-progress-sub">
                      <span>{selectedCustomer.loyaltyPoints}</span>
                      <span>{selectedCustomer.loyaltyTarget}</span>
                    </div>
                  </div>

                  {/* Used Promotions */}
                  <div className="owner-customer-section-card">
                    <div className="owner-customer-section-title">
                      <span>Used Promotions</span>
                      <button type="button" onClick={() => setDrawerTab('promotions')}>
                        View All
                      </button>
                    </div>

                    {selectedCustomer.usedPromotions && selectedCustomer.usedPromotions.length > 0 ? (
                      selectedCustomer.usedPromotions.map((promo) => (
                        <div key={promo.id || promo.title} className="owner-customer-promo-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: '#f5ede4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#8c4a23',
                              }}
                            >
                              <Tag size={14} />
                            </div>
                            <div>
                              <div className="owner-customer-promo-title">{promo.title}</div>
                              <div className="owner-customer-promo-sub">{promo.date}</div>
                            </div>
                          </div>
                          <span className="owner-customer-promo-badge">{promo.status}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '12px', color: '#8c7b6f' }}>
                        No promotions used yet.
                      </div>
                    )}
                  </div>
                </>
              )}

              {drawerTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911' }}>
                    Order History ({selectedCustomer.recentOrders?.length || 0} recent)
                  </div>
                  {selectedCustomer.recentOrders?.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: '#faf8f5',
                        border: '1px solid #eee8df',
                        borderRadius: '10px',
                        padding: '12px 14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <span style={{ fontWeight: 800, color: '#2a1911' }}>{order.id}</span>
                        <span className="owner-customer-order-badge">{order.status}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', marginBottom: '8px' }}>
                        {order.date}
                      </div>
                      <div
                        style={{
                          borderTop: '1px dashed #e8e2d7',
                          paddingTop: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '12.5px',
                            }}
                          >
                            <span>
                              {item.qty} × {item.name}
                            </span>
                            <span style={{ fontWeight: 600 }}>₹{item.price}</span>
                          </div>
                        ))}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            fontWeight: 800,
                            marginTop: '4px',
                            color: '#2a1911',
                          }}
                        >
                          <span>Total</span>
                          <span>{order.amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'loyalty' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="owner-loyalty-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={24} color="#c47d2e" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '16px' }}>Gold Loyalty Member</div>
                        <div style={{ fontSize: '12px', color: '#7a6a5e' }}>
                          Earns 10 points per ₹100 spent
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="owner-customer-section-card">
                    <div className="owner-customer-section-title">
                      <span>Reward Milestones</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Free Specialty Coffee</span>
                        <span style={{ fontWeight: 700, color: '#0d8a55' }}>Unlocked (200 pts)</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>20% OFF Meal Combo</span>
                        <span style={{ fontWeight: 700, color: '#8c4a23' }}>Next at 500 pts</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Free Chef Dessert</span>
                        <span style={{ color: '#8c7b6f' }}>At 800 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'promotions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911' }}>
                    Available & Used Discounts
                  </div>
                  {selectedCustomer.usedPromotions?.map((promo) => (
                    <div key={promo.id || promo.title} className="owner-customer-promo-item">
                      <div>
                        <div className="owner-customer-promo-title">{promo.title}</div>
                        <div className="owner-customer-promo-sub">{promo.date}</div>
                      </div>
                      <span className="owner-customer-promo-badge">{promo.status}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      border: '1px dashed #d9d1c5',
                      padding: '12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#7a6a5e',
                    }}
                  >
                    Send exclusive SMS promotion from Promotions module.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
