import { X, Tag, Calendar, Users, ShoppingBag, ShieldCheck } from 'lucide-react'

export default function PromotionDetailsModal({ promotion, onClose, onEdit }) {
  if (!promotion) return null

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
    <div className="owner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="owner-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="owner-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f0eae1' }}>
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
              <Tag size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#2a1911' }}>
                {promotion.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span className={getStatusBadgeClass(promotion.status)}>{promotion.status}</span>
                <span style={{ fontSize: '12px', color: '#8c7b6f' }}>{promotion.type}</span>
              </div>
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

        {/* Modal Body */}
        <div className="owner-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Details Overview */}
          <div style={{ background: '#faf8f5', border: '1px solid #ede6dc', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911', marginBottom: 4 }}>
              Offer Details
            </div>
            <div style={{ fontSize: '13px', color: '#4a3f35', lineHeight: 1.45 }}>
              {promotion.details}
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div style={{ background: '#ffffff', border: '1px solid #ede8e1', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Total Redemptions</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#8c4a23', marginTop: 2 }}>
                {promotion.usage ?? 0}
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #ede8e1', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Usage Limit</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2a1911', marginTop: 2 }}>
                {promotion.usageLimit ?? 'Unlimited'}
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #ede8e1', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Min. Order</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2a1911', marginTop: 2 }}>
                {promotion.minOrderAmount ? `₹${promotion.minOrderAmount}` : 'None'}
              </div>
            </div>
          </div>

          {/* Details List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={16} color="#8c7b6f" />
              <span style={{ color: '#8c7b6f', width: 110 }}>Validity:</span>
              <span style={{ fontWeight: 700, color: '#2a1911' }}>{promotion.validity}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShoppingBag size={16} color="#8c7b6f" />
              <span style={{ color: '#8c7b6f', width: 110 }}>Applies To:</span>
              <span style={{ fontWeight: 700, color: '#2a1911' }}>
                {promotion.applyTo === 'Category' ? `Category: ${promotion.category}` : promotion.applyTo}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users size={16} color="#8c7b6f" />
              <span style={{ color: '#8c7b6f', width: 110 }}>Eligibility:</span>
              <span style={{ fontWeight: 700, color: '#2a1911' }}>
                {promotion.customerEligibility || 'All Customers'}
              </span>
            </div>
          </div>

          {/* Terms & Conditions */}
          {promotion.terms && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6d5b4f', marginBottom: 4 }}>
                Terms & Conditions:
              </div>
              <div
                style={{
                  background: '#faf8f5',
                  border: '1px solid #ede6dc',
                  borderRadius: 8,
                  padding: 10,
                  fontSize: '12px',
                  color: '#4d3b31',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.45,
                }}
              >
                {promotion.terms}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="owner-modal-footer"
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #f0eae1',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            background: '#faf8f5',
          }}
        >
          <button type="button" className="owner-btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="owner-btn-primary"
            style={{
              background: '#8c4a23',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: 8,
              fontWeight: 700,
            }}
            onClick={() => {
              onClose()
              if (onEdit) onEdit(promotion)
            }}
          >
            Edit Promotion
          </button>
        </div>
      </div>
    </div>
  )
}
