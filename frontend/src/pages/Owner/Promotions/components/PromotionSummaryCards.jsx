import { Megaphone, Navigation, Clock, Pause } from 'lucide-react'

export default function PromotionSummaryCards({ counts }) {
  const { total = 8, active = 5, scheduled = 2, inactive = 1 } = counts || {}

  return (
    <div className="owner-promotions-summary-grid">
      {/* 1. Total Promotions */}
      <div className="owner-promotions-kpi-card">
        <div className="owner-promotions-kpi-icon owner-promotions-kpi-icon--total">
          <Megaphone size={22} />
        </div>
        <div>
          <div className="owner-promotions-kpi-val">{total}</div>
          <div className="owner-promotions-kpi-lbl">Total Promotions</div>
        </div>
      </div>

      {/* 2. Active */}
      <div className="owner-promotions-kpi-card">
        <div className="owner-promotions-kpi-icon owner-promotions-kpi-icon--active">
          <Navigation size={22} style={{ transform: 'rotate(45deg)' }} />
        </div>
        <div>
          <div className="owner-promotions-kpi-val">{active}</div>
          <div className="owner-promotions-kpi-lbl">Active</div>
        </div>
      </div>

      {/* 3. Scheduled */}
      <div className="owner-promotions-kpi-card">
        <div className="owner-promotions-kpi-icon owner-promotions-kpi-icon--scheduled">
          <Clock size={22} />
        </div>
        <div>
          <div className="owner-promotions-kpi-val">{scheduled}</div>
          <div className="owner-promotions-kpi-lbl">Scheduled</div>
        </div>
      </div>

      {/* 4. Inactive */}
      <div className="owner-promotions-kpi-card">
        <div className="owner-promotions-kpi-icon owner-promotions-kpi-icon--inactive">
          <Pause size={22} />
        </div>
        <div>
          <div className="owner-promotions-kpi-val">{inactive}</div>
          <div className="owner-promotions-kpi-lbl">Inactive</div>
        </div>
      </div>
    </div>
  )
}
