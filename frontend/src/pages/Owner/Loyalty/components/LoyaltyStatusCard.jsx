import { Award } from 'lucide-react'

export default function LoyaltyStatusCard({ isEnabled, onToggle }) {
  return (
    <div className="owner-loyalty-card">
      <div className="owner-loyalty-card-header" style={{ marginBottom: 0 }}>
        <div className="owner-loyalty-card-header-left">
          <div className="owner-loyalty-card-icon">
            <Award size={20} />
          </div>
          <div>
            <h3 className="owner-loyalty-card-title">Loyalty Program Status</h3>
            <p className="owner-loyalty-card-desc">
              Enable or disable the loyalty program for your café.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label className="owner-toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onToggle(e.target.checked)}
              aria-label="Toggle loyalty program"
            />
            <span className="owner-toggle-slider" />
          </label>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: isEnabled ? '#15803d' : '#8c7b6f',
              minWidth: '60px',
            }}
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid #f4eee6',
          fontSize: '12px',
          color: isEnabled ? '#6b5d52' : '#b91c1c',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: isEnabled ? '#16a34a' : '#dc2626',
            display: 'inline-block',
          }}
        />
        {isEnabled
          ? 'Customers earn points on every order'
          : 'Loyalty points currently paused. Existing balances and redeem history remain preserved.'}
      </div>
    </div>
  )
}
