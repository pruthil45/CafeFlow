import { Users, Coins, Gift } from 'lucide-react'

export default function LoyaltySummaryCards({ summary }) {
  const members = summary?.totalMembers?.toLocaleString('en-IN') || '1,248'
  const points = summary?.pointsEarnedThisMonth?.toLocaleString('en-IN') || '8,540'
  const redeemed = summary?.rewardsRedeemedThisMonth?.toLocaleString('en-IN') || '320'

  return (
    <div className="owner-loyalty-summary-grid">
      {/* 1. Loyalty Members */}
      <div className="owner-loyalty-kpi-card">
        <div className="owner-loyalty-kpi-icon owner-loyalty-kpi-icon--members">
          <Users size={24} />
        </div>
        <div>
          <div className="owner-loyalty-kpi-val">{members}</div>
          <div className="owner-loyalty-kpi-lbl">Loyalty Members</div>
          <div className="owner-loyalty-kpi-sub">Customers with points</div>
        </div>
      </div>

      {/* 2. Points Earned */}
      <div className="owner-loyalty-kpi-card">
        <div className="owner-loyalty-kpi-icon owner-loyalty-kpi-icon--points">
          <Coins size={24} />
        </div>
        <div>
          <div className="owner-loyalty-kpi-val">{points}</div>
          <div className="owner-loyalty-kpi-lbl">Points Earned</div>
          <div className="owner-loyalty-kpi-sub">This month</div>
        </div>
      </div>

      {/* 3. Rewards Redeemed */}
      <div className="owner-loyalty-kpi-card">
        <div className="owner-loyalty-kpi-icon owner-loyalty-kpi-icon--rewards">
          <Gift size={24} />
        </div>
        <div>
          <div className="owner-loyalty-kpi-val">{redeemed}</div>
          <div className="owner-loyalty-kpi-lbl">Rewards Redeemed</div>
          <div className="owner-loyalty-kpi-sub">This month</div>
        </div>
      </div>
    </div>
  )
}
