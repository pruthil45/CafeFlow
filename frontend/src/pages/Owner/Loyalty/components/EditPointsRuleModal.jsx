import { useState } from 'react'
import { X, Coins } from 'lucide-react'

export default function EditPointsRuleModal({ rule, onClose, onSave }) {
  const [spendAmount, setSpendAmount] = useState(rule?.spendAmount || 100)
  const [pointsEarned, setPointsEarned] = useState(rule?.pointsEarned || 10)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const spend = parseFloat(spendAmount)
    const points = parseInt(pointsEarned, 10)

    if (isNaN(spend) || spend <= 0) {
      setError('Spending amount must be a valid number greater than 0.')
      return
    }
    if (isNaN(points) || points < 0) {
      setError('Points awarded must be a non-negative whole number.')
      return
    }

    onSave({ spendAmount: spend, pointsEarned: points })
  }

  return (
    <div className="owner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="owner-modal-card"
        style={{ maxWidth: 460 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="owner-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f0eae1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#faf5ee', color: '#8c4a23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#2a1911' }}>
              Edit Points Earning Rule
            </h3>
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

        <form onSubmit={handleSubmit}>
          <div className="owner-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#7a6a5e' }}>
              Define the baseline calculation used to award loyalty points to customers based on their eligible order bill amount.
            </p>

            {error && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '12px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label className="owner-field-label">
                  Spending Amount (₹) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="owner-form-input"
                  value={spendAmount}
                  onChange={(e) => {
                    setSpendAmount(e.target.value)
                    setError('')
                  }}
                  required
                />
              </div>

              <div>
                <label className="owner-field-label">
                  Points Awarded <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="owner-form-input"
                  value={pointsEarned}
                  onChange={(e) => {
                    setPointsEarned(e.target.value)
                    setError('')
                  }}
                  required
                />
              </div>
            </div>

            {/* Preview Box */}
            <div style={{ background: '#faf8f5', border: '1px solid #eee8df', borderRadius: '10px', padding: '12px 14px' }}>
              <div style={{ fontSize: '11.5px', color: '#8c7b6f', fontWeight: 600, marginBottom: 4 }}>
                RULE PREVIEW
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                ₹{spendAmount || 0} spent = {pointsEarned || 0} points
              </div>
              <div style={{ fontSize: '11px', color: '#7a6a5e', marginTop: 4 }}>
                Example: An order of ₹1,000 will award{' '}
                <strong>
                  {spendAmount > 0 ? Math.floor((1000 / spendAmount) * (pointsEarned || 0)) : 0} points
                </strong>.
              </div>
            </div>
          </div>

          <div className="owner-modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid #f0eae1', background: '#faf8f5', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="owner-btn-primary"
              style={{ background: '#8c4a23', color: '#fff' }}
            >
              Save Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
