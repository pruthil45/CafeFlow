import { useState, useMemo } from 'react'
import { X, Search, History, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

export default function LoyaltyHistoryModal({
  activities = [],
  onClose,
  onSelectCustomer,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL') // ALL, Earned, Redeemed
  const [customerFilter, setCustomerFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Unique customers for dropdown
  const customerNames = useMemo(() => {
    const names = new Set(activities.map((a) => a.customerName).filter(Boolean))
    return Array.from(names).sort()
  }, [activities])

  // Filtered list
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Search
      const search = searchTerm.toLowerCase().trim()
      const matchSearch =
        !search ||
        act.customerName?.toLowerCase().includes(search) ||
        act.details?.toLowerCase().includes(search) ||
        act.orderNumber?.toLowerCase().includes(search)

      // Type
      const matchType = typeFilter === 'ALL' || act.type === typeFilter

      // Customer
      const matchCustomer = customerFilter === 'ALL' || act.customerName === customerFilter

      return matchSearch && matchType && matchCustomer
    })
  }, [activities, searchTerm, typeFilter, customerFilter])

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage) || 1
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredActivities.slice(start, start + itemsPerPage)
  }, [filteredActivities, currentPage, itemsPerPage])

  return (
    <div className="owner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="owner-modal-card owner-history-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="owner-history-modal-header">
          <div className="owner-history-modal-header-left">
            <div className="owner-history-modal-icon">
              <History size={20} />
            </div>
            <div>
              <h3 className="owner-history-modal-title">
                All Loyalty Activity History
              </h3>
              <p className="owner-history-modal-sub">
                Complete audit trail of earned and redeemed loyalty points
              </p>
            </div>
          </div>
          <button
            type="button"
            className="owner-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="owner-history-modal-filters">
          {/* Search box */}
          <div className="owner-history-search-wrap">
            <Search size={15} className="owner-history-search-icon" />
            <input
              type="text"
              className="owner-history-search-input"
              placeholder="Search customer, order, details..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="owner-history-selects-row">
            {/* Customer Filter */}
            <div className="owner-history-select-wrap">
              <select
                className="owner-history-select"
                value={customerFilter}
                onChange={(e) => {
                  setCustomerFilter(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by customer"
              >
                <option value="ALL">All Customers</option>
                {customerNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="owner-history-select-chevron" />
            </div>

            {/* Type Filter */}
            <div className="owner-history-select-wrap">
              <select
                className="owner-history-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by activity type"
              >
                <option value="ALL">All Activity</option>
                <option value="Earned">Earned Points</option>
                <option value="Redeemed">Redeemed Rewards</option>
              </select>
              <ChevronDown size={14} className="owner-history-select-chevron" />
            </div>
          </div>
        </div>

        {/* Desktop Table View (screens > 768px) */}
        <div className="owner-history-modal-table-wrap">
          <table className="owner-loyalty-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Details</th>
                <th>Points</th>
                <th>Order #</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px 16px', color: '#8c7b6f' }}>
                    No loyalty activities found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((act) => (
                  <tr key={act.id}>
                    <td style={{ fontSize: '12px', color: '#6d5b4f', whiteSpace: 'nowrap' }}>{act.dateTime}</td>
                    <td>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontWeight: 700,
                          color: '#2a1911',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                          textDecorationColor: '#d6c4b2',
                        }}
                        onClick={() => {
                          if (onSelectCustomer && act.customerId) {
                            onSelectCustomer(act.customerId)
                            onClose()
                          }
                        }}
                      >
                        {act.customerName}
                      </button>
                    </td>
                    <td>
                      <span className={`owner-loyalty-badge ${act.type.toLowerCase()}`}>
                        {act.type}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px', color: '#4d3b31' }}>{act.details}</td>
                    <td
                      style={{
                        fontWeight: 800,
                        fontSize: '13px',
                        color: act.points > 0 ? '#1b7a43' : '#b91c1c',
                      }}
                    >
                      {act.points > 0 ? `+${act.points}` : act.points}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#6d5b4f', fontSize: '12.5px' }}>
                        {act.orderNumber}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Activity Card List (screens <= 768px) */}
        <div className="owner-history-modal-mobile-list">
          {paginatedActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#8c7b6f', fontSize: '13px' }}>
              No loyalty activities found matching the filters.
            </div>
          ) : (
            paginatedActivities.map((act) => {
              const isEarned = act.type === 'Earned'
              return (
                <div key={act.id} className="owner-history-mobile-card">
                  <div className="owner-history-mobile-card-top">
                    <button
                      type="button"
                      className="owner-customer-link"
                      style={{ fontWeight: 800, fontSize: '13.5px', textAlign: 'left' }}
                      onClick={() => {
                        if (onSelectCustomer && act.customerId) {
                          onSelectCustomer(act.customerId)
                          onClose()
                        }
                      }}
                    >
                      {act.customerName}
                    </button>
                    <span className={`owner-loyalty-badge ${act.type.toLowerCase()}`}>
                      {act.type}
                    </span>
                  </div>

                  <div className="owner-history-mobile-details">
                    {act.details}
                  </div>

                  <div className="owner-history-mobile-card-bottom">
                    <span style={{ fontSize: '11.5px', color: '#8c7b6f' }}>
                      {act.dateTime} · {act.orderNumber}
                    </span>
                    <span
                      className={isEarned ? 'owner-points-val-positive' : 'owner-points-val-negative'}
                      style={{ fontWeight: 800, fontSize: '13px' }}
                    >
                      {act.points > 0 ? `+${act.points}` : act.points} pts
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="owner-history-modal-footer">
          <div className="owner-history-pagination-info">
            Showing <strong>{filteredActivities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</strong> of{' '}
            <strong>{filteredActivities.length}</strong> activity records
          </div>

          <div className="owner-history-pagination-controls">
            <button
              type="button"
              className="owner-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4d3b31', minWidth: 44, textAlign: 'center' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="owner-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
