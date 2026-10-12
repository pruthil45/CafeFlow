import { useState } from 'react'
import { X, Gift } from 'lucide-react'

export default function CreateEditRewardModal({
  reward,
  menuItems = [],
  onClose,
  onSave,
}) {
  const isEditing = !!reward

  const [name, setName] = useState(reward?.name || '')
  const [description, setDescription] = useState(reward?.description || '')
  const [pointsRequired, setPointsRequired] = useState(reward?.pointsRequired || 300)
  const [minimumSpend, setMinimumSpend] = useState(reward?.minimumSpend ?? 0)
  const [type, setType] = useState(reward?.type || 'fixed_discount')
  const [discountValue, setDiscountValue] = useState(reward?.discountValue || 100)
  const [freeItemName, setFreeItemName] = useState(reward?.freeItemName || 'Cappuccino')
  const [status, setStatus] = useState(reward?.status || 'Active')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Reward Name is required.')
      return
    }
    const pts = parseInt(pointsRequired, 10)
    if (isNaN(pts) || pts <= 0) {
      setError('Points Required must be a positive number.')
      return
    }

    const rewardData = {
      id: reward?.id || `rew-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      pointsRequired: pts,
      minimumSpend: parseFloat(minimumSpend) || 0,
      type,
      discountValue: type !== 'free_item' ? parseFloat(discountValue) || 0 : undefined,
      freeItemName: type === 'free_item' ? freeItemName : undefined,
      status,
    }

    onSave(rewardData)
  }

  return (
    <div className="owner-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="owner-modal-card"
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="owner-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f0eae1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gift size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#2a1911' }}>
              {isEditing ? 'Edit Reward' : 'Create New Reward'}
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
          <div className="owner-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '12px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div>
              <label className="owner-field-label">
                Reward Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                className="owner-form-input"
                placeholder="e.g. ₹100 OFF or Free Coffee"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                required
              />
            </div>

            <div>
              <label className="owner-field-label">Description</label>
              <textarea
                className="owner-form-textarea"
                rows={2}
                placeholder="e.g. Get ₹100 discount on total bill"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <div>
                <label className="owner-field-label">Reward Type *</label>
                <select
                  className="owner-form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="fixed_discount">Fixed Amount Discount</option>
                  <option value="percentage_discount">Percentage Discount</option>
                  <option value="free_item">Free Menu Item</option>
                </select>
              </div>

              {type === 'fixed_discount' && (
                <div>
                  <label className="owner-field-label">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    className="owner-form-input"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>
              )}

              {type === 'percentage_discount' && (
                <div>
                  <label className="owner-field-label">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="owner-form-input"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>
              )}

              {type === 'free_item' && (
                <div>
                  <label className="owner-field-label">Free Menu Item</label>
                  <select
                    className="owner-form-select"
                    value={freeItemName}
                    onChange={(e) => setFreeItemName(e.target.value)}
                  >
                    <option value="Cappuccino">Cappuccino</option>
                    <option value="French Fries">French Fries</option>
                    <option value="Choco Lava Cake">Choco Lava Cake</option>
                    <option value="Garlic Bread">Garlic Bread</option>
                    <option value="Cold Coffee">Cold Coffee</option>
                    {menuItems.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="owner-field-label">
                  Points Required <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  className="owner-form-input"
                  value={pointsRequired}
                  onChange={(e) => setPointsRequired(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="owner-field-label">Minimum Spend (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="owner-form-input"
                  placeholder="0 for no min spend"
                  value={minimumSpend}
                  onChange={(e) => setMinimumSpend(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#faf8f5', borderRadius: '8px', border: '1px solid #ede5da' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso, #2a1911)' }}>Reward Status</div>
                <div style={{ fontSize: '11.5px', color: '#8c7b6f' }}>Make this reward available for customer redemption</div>
              </div>
              <label className="owner-toggle-switch">
                <input
                  type="checkbox"
                  checked={status === 'Active'}
                  onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                />
                <span className="owner-toggle-slider" />
              </label>
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
              {isEditing ? 'Save Changes' : 'Create Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
