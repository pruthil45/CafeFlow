import { Coins, Edit2 } from 'lucide-react'

export default function PointsRuleCard({ rule, onEditRule }) {
  const spend = rule?.spendAmount || 100
  const points = rule?.pointsEarned || 10

  return (
    <div className="owner-loyalty-card">
      <div
        className="owner-loyalty-card-header"
        style={{
          marginBottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div className="owner-loyalty-card-header-left">
          <div className="owner-loyalty-card-icon">
            <Coins size={20} />
          </div>
          <div>
            <h3 className="owner-loyalty-card-title">Points Earning Rule</h3>
            <p className="owner-loyalty-card-desc">
              Define how many points customers earn per spending.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div className="owner-points-rule-badge">
            ₹{spend} spent = {points} points
          </div>

          <button
            type="button"
            className="owner-btn-outline-warm"
            onClick={onEditRule}
            aria-label="Edit points earning rule"
          >
            <Edit2 size={13} /> Edit Rule
          </button>
        </div>
      </div>
    </div>
  )
}
