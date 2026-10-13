import { Clock } from 'lucide-react'

export default function RecentLoyaltyActivityCard({
  activities = [],
  onSelectCustomer,
  onViewAll,
}) {
  const displayActivities = activities.slice(0, 5)

  return (
    <div className="owner-loyalty-card">
      <div className="owner-loyalty-card-header">
        <div className="owner-loyalty-card-header-left">
          <div className="owner-loyalty-card-icon" style={{ background: '#fdf6ee', color: '#c2410c' }}>
            <Clock size={20} />
          </div>
          <div>
            <h3 className="owner-loyalty-card-title">Recent Loyalty Activity</h3>
            <p className="owner-loyalty-card-desc">
              Latest points earned and rewards redeemed across all customer orders.
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: '#8c4a23',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          onClick={onViewAll}
        >
          View All
        </button>
      </div>

      {/* Activity Table View */}
      <div className="owner-loyalty-table-wrap">
        <table className="owner-loyalty-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Customer</th>
              <th style={{ textAlign: 'center' }}>Type</th>
              <th>Details</th>
              <th style={{ textAlign: 'center' }}>Points</th>
              <th style={{ textAlign: 'center' }}>Order #</th>
            </tr>
          </thead>
          <tbody>
            {displayActivities.map((act) => {
              const isEarned = act.type === 'Earned'

              return (
                <tr key={act.id}>
                  <td style={{ color: '#6d5b4f', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                    {act.dateTime}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="owner-customer-link"
                      onClick={() => onSelectCustomer && onSelectCustomer(act.customerId, act.customerName)}
                      title={`View loyalty details for ${act.customerName}`}
                    >
                      {act.customerName}
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={isEarned ? 'owner-badge-earned' : 'owner-badge-redeemed'}>
                      {act.type}
                    </span>
                  </td>
                  <td style={{ color: '#4a3f35', fontWeight: 500 }}>
                    {act.details}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={isEarned ? 'owner-points-val-positive' : 'owner-points-val-negative'}>
                      {act.points > 0 ? `+${act.points}` : act.points}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="owner-order-link">
                      {act.orderNumber}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Activity Card List (Screens <= 768px) */}
      <div className="owner-activity-mobile-list">
        {displayActivities.map((act) => {
          const isEarned = act.type === 'Earned'
          return (
            <div key={act.id} className="owner-activity-mobile-card">
              <div className="owner-activity-mobile-card-top">
                <button
                  type="button"
                  className="owner-customer-link"
                  style={{ fontWeight: 800, fontSize: '13.5px' }}
                  onClick={() => onSelectCustomer && onSelectCustomer(act.customerId, act.customerName)}
                >
                  {act.customerName}
                </button>
                <span className={isEarned ? 'owner-badge-earned' : 'owner-badge-redeemed'}>
                  {act.type}
                </span>
              </div>

              <div className="owner-activity-mobile-details">
                {act.details}
              </div>

              <div className="owner-activity-mobile-card-bottom">
                <span style={{ fontSize: '12px', color: '#8c7b6f' }}>
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
        })}
      </div>
    </div>
  )
}
