import { useState, useMemo } from 'react'
import { X, Search, Filter, History, Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react'

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
        className="owner-modal-card"
        style={{ maxWidth: 840, width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="owner-modal-header"
          style={{ padding: '16px 24px', borderBottom: '1px solid #f0eae1' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#faf5ee',
                color: '#8c4a23',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <History size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#2a1911' }}>
                All Loyalty Activity History
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#8c7b6f' }}>
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
        <div
          style={{
            padding: '16px 24px',
            background: '#faf8f5',
            borderBottom: '1px solid #ede6dc',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c8e82' }}
            />
            <input
              type="text"
              className="owner-form-input"
              placeholder="Search customer, order, details..."
              style={{ paddingLeft: 34, height: 38, fontSize: '13px' }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Customer Filter */}
            <select
              className="owner-form-input"
              style={{ height: 38, fontSize: '13px', width: 'auto', minWidth: 150 }}
              value={customerFilter}
              onChange={(e) => {
                setCustomerFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="ALL">All Customers</option>
              {customerNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              className="owner-form-input"
              style={{ height: 38, fontSize: '13px', width: 'auto' }}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="ALL">All Activity</option>
              <option value="Earned">Earned Points</option>
              <option value="Redeemed">Redeemed Rewards</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
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
                    <td style={{ fontSize: '12px', color: '#6d5b4f' }}>{act.dateTime}</td>
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

        {/* Footer with Pagination */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #f0eae1',
            background: '#faf8f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#8c7b6f' }}>
            Showing <strong>{filteredActivities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredActivities.length)}</strong> of{' '}
            <strong>{filteredActivities.length}</strong> activity records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
