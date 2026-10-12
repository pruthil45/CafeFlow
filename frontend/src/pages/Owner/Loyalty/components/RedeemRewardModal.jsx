import { useState, useMemo } from 'react'
import { X, Gift, AlertCircle, CheckCircle2, User, ArrowRight } from 'lucide-react'

export default function RedeemRewardModal({
  customer,
  allCustomers = [],
  rewards = [],
  initialReward = null,
  onClose,
  onConfirmRedeem,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customer?.id || allCustomers[0]?.id || '')
  const [selectedRewardId, setSelectedRewardId] = useState(initialReward?.id || rewards[0]?.id || '')
  const [orderNumber, setOrderNumber] = useState('')
  const [simulatedOrderSpend, setSimulatedOrderSpend] = useState('')
  const [error, setError] = useState('')

  const activeRewards = useMemo(() => rewards.filter((r) => r.status === 'Active'), [rewards])

  const selectedCustomer = useMemo(() => {
    if (customer && customer.id === selectedCustomerId) return customer
    return allCustomers.find((c) => c.id === selectedCustomerId) || customer
  }, [customer, allCustomers, selectedCustomerId])

  const selectedReward = useMemo(() => {
    return rewards.find((r) => r.id === selectedRewardId) || activeRewards[0]
  }, [rewards, activeRewards, selectedRewardId])

  const customerPoints = selectedCustomer?.loyaltyPoints ?? 0
  const rewardPoints = selectedReward?.pointsRequired ?? 0
  const hasEnoughPoints = customerPoints >= rewardPoints

  // Check min spend if entered
  const minSpend = selectedReward?.minSpend ?? 0
  const enteredSpend = parseFloat(simulatedOrderSpend) || 0
  const minSpendMet = minSpend === 0 || enteredSpend >= minSpend || simulatedOrderSpend === ''

  const handleRedeem = (e) => {
    e.preventDefault()
    setError('')

    if (!selectedCustomer) {
      setError('Please select a valid customer.')
      return
    }

    if (!selectedReward) {
      setError('Please select an active reward to redeem.')
      return
    }

    if (!hasEnoughPoints) {
      setError(
        `Insufficient points: ${selectedCustomer.name} has ${customerPoints} points, but this reward requires ${rewardPoints} points.`
      )
      return
    }

    if (simulatedOrderSpend !== '' && enteredSpend < minSpend) {
      setError(`Minimum order spend requirement of ₹${minSpend} is not met (entered: ₹${enteredSpend}).`)
      return
    }

    onConfirmRedeem({
      customer: selectedCustomer,
      reward: selectedReward,
      orderNumber: orderNumber.trim() ? `#${orderNumber.replace('#', '')}` : `#${Math.floor(100 + Math.random() * 900)}`,
      simulatedSpend: enteredSpend,
    })
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
              <Gift size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#2a1911' }}>
                Redeem Loyalty Reward
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: '#8c7b6f' }}>
                Verify customer balance and confirm redemption voucher
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

        <form onSubmit={handleRedeem}>
          <div className="owner-modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Customer Selector / Info */}
            <div className="owner-form-group">
              <label className="owner-form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} color="#8c4a23" />
                Customer
              </label>
              {customer ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#faf8f5',
                    border: '1px solid #ede6dc',
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#2a1911' }}>{customer.name}</div>
                    <div style={{ fontSize: '12px', color: '#8c7b6f' }}>{customer.phone || customer.email || 'Loyalty Member'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Current Balance</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#8c4a23' }}>
                      {customerPoints} pts
                    </div>
                  </div>
                </div>
              ) : (
                <select
                  className="owner-form-input"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
                >
                  {allCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.loyaltyPoints ?? 0} points
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Reward Selector */}
            <div className="owner-form-group">
              <label className="owner-form-label">Select Reward to Redeem *</label>
              <select
                className="owner-form-input"
                value={selectedRewardId}
                onChange={(e) => setSelectedRewardId(e.target.value)}
                required
              >
                {activeRewards.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — ({r.pointsRequired} pts, Min Spend: ₹{r.minSpend})
                  </option>
                ))}
              </select>
            </div>

            {/* Reward Summary Card */}
            {selectedReward && (
              <div
                style={{
                  background: '#faf8f5',
                  border: '1px solid #ede6dc',
                  borderRadius: 10,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#2a1911' }}>
                    {selectedReward.name}
                  </div>
                  <span
                    style={{
                      background: '#faf5ee',
                      border: '1px solid #ebd5c1',
                      color: '#8c4a23',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 12,
                    }}
                  >
                    {selectedReward.rewardType || 'Reward'}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#6d5b4f' }}>{selectedReward.description}</div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    marginTop: 4,
                    paddingTop: 8,
                    borderTop: '1px dashed #e2d9cd',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#8c7b6f' }}>Points Required</span>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#8c4a23' }}>
                      {rewardPoints} pts
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#8c7b6f' }}>Min. Spend</span>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#2a1911' }}>
                      ₹{minSpend}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#8c7b6f' }}>Remaining Bal.</span>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: '13px',
                        color: customerPoints - rewardPoints >= 0 ? '#1b7a43' : '#b91c1c',
                      }}
                    >
                      {customerPoints - rewardPoints >= 0 ? `${customerPoints - rewardPoints} pts` : 'Short!'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optional order spend / order number context */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="owner-form-group">
                <label className="owner-form-label" style={{ fontSize: '12px' }}>
                  Order # (Optional)
                </label>
                <input
                  type="text"
                  className="owner-form-input"
                  placeholder="e.g. 108"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <div className="owner-form-group">
                <label className="owner-form-label" style={{ fontSize: '12px' }}>
                  Current Bill ₹ (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="owner-form-input"
                  placeholder={minSpend > 0 ? `Min ₹${minSpend}` : '₹0'}
                  value={simulatedOrderSpend}
                  onChange={(e) => setSimulatedOrderSpend(e.target.value)}
                />
              </div>
            </div>

            {/* Validation / Notice */}
            {!hasEnoughPoints && (
              <div
                style={{
                  padding: '10px 12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  color: '#b91c1c',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>
                  Customer has <strong>{customerPoints} points</strong>, but needs <strong>{rewardPoints} points</strong> (needs {rewardPoints - customerPoints} more).
                </span>
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: '10px 12px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  color: '#b91c1c',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Important Rule Notice */}
            <div
              style={{
                padding: '10px 12px',
                background: '#faf5ee',
                border: '1px solid #ebd5c1',
                borderRadius: 8,
                fontSize: '12px',
                color: '#6d5b4f',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: '#8c4a23' }}>Note:</strong> Redeeming deducts points from the customer’s balance and logs the redemption voucher. It does <em>not</em> automatically settle bills or process payments. Staff will apply the redeemed reward during POS checkout.
            </div>
          </div>

          <div
            className="owner-modal-footer"
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #f0eae1',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              background: '#faf8f5',
            }}
          >
            <button type="button" className="owner-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="owner-btn-primary"
              style={{
                background: '#8c4a23',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: 8,
                fontWeight: 700,
                opacity: !hasEnoughPoints ? 0.6 : 1,
                cursor: !hasEnoughPoints ? 'not-allowed' : 'pointer',
              }}
              disabled={!hasEnoughPoints}
            >
              Confirm Redemption
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
