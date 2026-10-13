import { useState, useRef, useEffect } from 'react'
import {
  Search,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Eye,
  Power,
  ChevronDown,
} from 'lucide-react'

export default function PromotionTable({
  promotions = [],
  activeTab = 'All',
  onTabChange,
  counts = {},
  searchTerm = '',
  onSearchChange,
  selectedType = 'ALL',
  onTypeChange,
  onEditPromotion,
  onViewDetails,
  onToggleStatus,
  onDuplicatePromotion,
  onDeletePromotion,
}) {
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Discount':
        return 'owner-promo-badge-discount'
      case 'Buy X Get Y':
        return 'owner-promo-badge-buyxgety'
      case 'Free Item':
        return 'owner-promo-badge-freeitem'
      case 'Combo Offer':
        return 'owner-promo-badge-combo'
      case 'Time Based':
        return 'owner-promo-badge-timebased'
      default:
        return 'owner-promo-badge-discount'
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'owner-status-badge--active'
      case 'Scheduled':
        return 'owner-status-badge--scheduled'
      case 'Inactive':
        return 'owner-status-badge--inactive'
      default:
        return 'owner-status-badge--active'
    }
  }

  return (
    <div className="owner-promotions-main-col">
      {/* 4.2 & 4.3 Toolbar: Status Tabs on left, Search & Filter on right */}
      <div className="owner-promotions-toolbar">
        {/* Status Tabs */}
        <div className="owner-promotions-tabs-nav" role="tablist">
          <button
            type="button"
            className={`owner-promotions-tab-btn ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => onTabChange('All')}
          >
            All ({counts.total ?? promotions.length})
          </button>
          <button
            type="button"
            className={`owner-promotions-tab-btn ${activeTab === 'Active' ? 'active' : ''}`}
            onClick={() => onTabChange('Active')}
          >
            Active ({counts.active ?? 0})
          </button>
          <button
            type="button"
            className={`owner-promotions-tab-btn ${activeTab === 'Scheduled' ? 'active' : ''}`}
            onClick={() => onTabChange('Scheduled')}
          >
            Scheduled ({counts.scheduled ?? 0})
          </button>
          <button
            type="button"
            className={`owner-promotions-tab-btn ${activeTab === 'Inactive' ? 'active' : ''}`}
            onClick={() => onTabChange('Inactive')}
          >
            Inactive ({counts.inactive ?? 0})
          </button>
        </div>

        {/* Search & Type dropdown */}
        <div className="owner-promotions-filters-right">
          <div className="owner-promotions-search-wrap">
            <Search size={15} className="owner-promotions-search-icon" />
            <input
              type="text"
              className="owner-promotions-search-input"
              placeholder="Search promotions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <select
              className="owner-promotions-type-select"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              aria-label="Filter by promotion type"
            >
              <option value="ALL">All Types</option>
              <option value="Discount">Discount</option>
              <option value="Buy X Get Y">Buy X Get Y</option>
              <option value="Free Item">Free Item</option>
              <option value="Combo Offer">Combo Offer</option>
              <option value="Time Based">Time Based</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4.4 Promotions Table Card */}
      <div className="owner-promotions-table-card">
        {/* Responsive Table View */}
        <div className="owner-promotions-table-wrap">
          <table className="owner-promotions-table">
            <thead>
              <tr>
                <th style={{ width: 44, textAlign: 'center' }}>#</th>
                <th>Promotion Name</th>
                <th>Type</th>
                <th>Details</th>
                <th>Validity</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Usage</th>
                <th style={{ textAlign: 'center', width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px 16px', color: '#8c7b6f' }}>
                    No promotions found matching the current filters.
                  </td>
                </tr>
              ) : (
                promotions.map((promo, idx) => (
                  <tr key={promo.id}>
                    {/* Index */}
                    <td style={{ textAlign: 'center', color: '#8c7b6f', fontWeight: 600 }}>
                      {idx + 1}
                    </td>

                    {/* Promotion Name */}
                    <td>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '13.5px',
                          color: '#2a1911',
                          cursor: 'pointer',
                        }}
                        onClick={() => onViewDetails && onViewDetails(promo)}
                      >
                        {promo.name}
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td>
                      <span className={getTypeBadgeClass(promo.type)}>
                        {promo.type}
                      </span>
                    </td>

                    {/* Details */}
                    <td>
                      <div style={{ fontSize: '12.5px', color: '#4d3b31', maxWidth: 280, lineHeight: 1.35 }}>
                        {promo.details}
                      </div>
                    </td>

                    {/* Validity */}
                    <td>
                      <div style={{ fontSize: '12.5px', color: '#4d3b31', whiteSpace: 'nowrap' }}>
                        {promo.validity}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span className={getStatusBadgeClass(promo.status)}>
                        {promo.status}
                      </span>
                    </td>

                    {/* Usage */}
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#4d3b31' }}>
                      {promo.usage ?? 0}
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
                        {/* Edit Button */}
                        <button
                          type="button"
                          className="owner-btn-secondary"
                          style={{
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: 6,
                            height: 28,
                          }}
                          onClick={() => onEditPromotion(promo)}
                        >
                          Edit
                        </button>

                        {/* More Actions Menu Button */}
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            style={{
                              background: '#ffffff',
                              border: '1px solid #ddd5c9',
                              borderRadius: 6,
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#6d5b4f',
                              cursor: 'pointer',
                            }}
                            onClick={() => setOpenMenuId(openMenuId === promo.id ? null : promo.id)}
                            aria-label="More actions"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === promo.id && (
                            <div
                              ref={menuRef}
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: 32,
                                background: '#ffffff',
                                border: '1px solid #ede6dc',
                                borderRadius: 8,
                                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                                zIndex: 100,
                                minWidth: 160,
                                padding: '4px 0',
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12.5px',
                                  color: '#2a1911',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  onViewDetails(promo)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Eye size={14} color="#8c4a23" />
                                View Details
                              </button>

                              <button
                                type="button"
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12.5px',
                                  color: '#2a1911',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  onToggleStatus(promo.id)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Power size={14} color={promo.status === 'Active' ? '#dc2626' : '#16a34a'} />
                                {promo.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>

                              <button
                                type="button"
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12.5px',
                                  color: '#2a1911',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  onDuplicatePromotion(promo)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Copy size={14} color="#6d5b4f" />
                                Duplicate
                              </button>

                              <div style={{ height: 1, background: '#f0eae1', margin: '4px 0' }} />

                              <button
                                type="button"
                                style={{
                                  width: '100%',
                                  padding: '8px 14px',
                                  textAlign: 'left',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12.5px',
                                  color: '#dc2626',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  onDeletePromotion(promo)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
