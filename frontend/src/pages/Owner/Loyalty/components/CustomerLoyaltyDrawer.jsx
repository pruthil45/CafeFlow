import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  X,
  Award,
  Gift,
  Tag,
  ShoppingBag,
  ChevronRight,
  Clock,
} from 'lucide-react'

export default function CustomerLoyaltyDrawer({
  customer,
  onClose,
  rewards = [],
  customerLoyaltyHistory = [],
  onOpenRedeemModal,
  isLoyaltyProgramEnabled = true,
  onViewAllHistory,
}) {
  const [activeTab, setActiveTab] = useState('loyalty') // 'overview', 'orders', 'loyalty', 'promotions'

  if (!customer) return null

  const currentPoints = customer.loyaltyPoints ?? 320
  const totalEarned = customer.totalEarnedPoints ?? 520
  const totalRedeemed = customer.totalRedeemedPoints ?? 200
  const targetPoints = customer.loyaltyTarget || 500
  const pointsToNext = Math.max(0, targetPoints - currentPoints)
  const progressPercent = Math.min(100, Math.round((currentPoints / targetPoints) * 100))

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1200) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [])

  return (
    <>
      <div
        className="owner-loyalty-drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="owner-loyalty-detail-panel open animate-fade-in" aria-label="Customer Loyalty Details">
      {/* Header */}
      <div className="owner-loyalty-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className="owner-loyalty-detail-back-btn"
            onClick={onClose}
          >
            <ArrowLeft size={14} /> Back to Customers
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#8c7b6f',
              cursor: 'pointer',
              padding: 2,
            }}
            onClick={onClose}
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <h2 className="owner-loyalty-detail-customer-name">{customer.name}</h2>
          <p className="owner-loyalty-detail-customer-sub">
            Customer since {customer.memberSince || 'Jan 2026'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="owner-loyalty-detail-tabs">
          <button
            type="button"
            className={`owner-loyalty-detail-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`owner-loyalty-detail-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            type="button"
            className={`owner-loyalty-detail-tab-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
            onClick={() => setActiveTab('loyalty')}
          >
            Loyalty
          </button>
          <button
            type="button"
            className={`owner-loyalty-detail-tab-btn ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            Promotions
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="owner-loyalty-detail-body">
        {/* ============================================================== */}
        {/* LOYALTY TAB (Primary View matching reference screenshot)       */}
        {/* ============================================================== */}
        {activeTab === 'loyalty' && (
          <>
            {/* Loyalty Balance Card */}
            <div className="owner-customer-balance-box">
              <div className="owner-customer-balance-top">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8c4a23', fontSize: '12px', fontWeight: 700 }}>
                    <Award size={16} />
                    <span>Loyalty Balance</span>
                  </div>
                  <div className="owner-customer-balance-val">
                    {currentPoints} <span style={{ fontSize: '16px', fontWeight: 700, color: '#6d5b4f' }}>Points</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="owner-btn-primary"
                  style={{
                    background: '#8c4a23',
                    color: '#ffffff',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: !isLoyaltyProgramEnabled || currentPoints < 300 ? 'not-allowed' : 'pointer',
                    opacity: !isLoyaltyProgramEnabled || currentPoints < 300 ? 0.6 : 1,
                  }}
                  onClick={() => onOpenRedeemModal && onOpenRedeemModal(customer)}
                  disabled={!isLoyaltyProgramEnabled || currentPoints < 300}
                >
                  Redeem Reward
                </button>
              </div>

              {/* Sub-stats: Total Earned & Total Redeemed */}
              <div className="owner-customer-balance-stats">
                <div>
                  <div className="owner-customer-balance-substat-num">{totalEarned}</div>
                  <div className="owner-customer-balance-substat-lbl">Total Earned</div>
                </div>
                <div>
                  <div className="owner-customer-balance-substat-num">{totalRedeemed}</div>
                  <div className="owner-customer-balance-substat-lbl">Total Redeemed</div>
                </div>
              </div>
            </div>

            {/* Points Progress */}
            <div style={{ background: '#faf8f5', border: '1px solid #ede6dc', borderRadius: '12px', padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                  Points Progress
                </span>
                <span style={{ fontSize: '11.5px', color: '#8c7b6f', fontWeight: 600 }}>
                  {pointsToNext > 0 ? `${pointsToNext} points to next reward` : 'Reward unlocked!'}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#ebe4d8', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #c47d2e, #8c4a23)',
                    borderRadius: '6px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#6d5b4f', marginTop: 6, fontWeight: 600 }}>
                <span>{currentPoints} / {targetPoints} points</span>
                <span>Next Reward: ₹100 OFF</span>
              </div>
            </div>

            {/* Available Rewards */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                  Available Rewards
                </h4>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#8c4a23', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => onOpenRedeemModal && onOpenRedeemModal(customer)}
                >
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rewards.filter((r) => r.status === 'Active').slice(0, 3).map((reward) => {
                  const canRedeem = isLoyaltyProgramEnabled && currentPoints >= reward.pointsRequired

                  return (
                    <div key={reward.id} className="owner-customer-reward-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="owner-customer-reward-icon">
                          <Gift size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                            {reward.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#8c7b6f', marginTop: 1 }}>
                            {reward.pointsRequired} points · {reward.minimumSpend > 0 ? `Min. spend: ₹${reward.minimumSpend}` : 'Min. spend: ₹0'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={{
                          background: canRedeem ? '#8c4a23' : '#e0d8cc',
                          color: canRedeem ? '#ffffff' : '#8c7b6f',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: canRedeem ? 'pointer' : 'not-allowed',
                        }}
                        disabled={!canRedeem}
                        onClick={() => onOpenRedeemModal && onOpenRedeemModal(customer, reward)}
                      >
                        Redeem
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Loyalty History (Customer Specific) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                  Loyalty History
                </h4>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#8c4a23', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  onClick={onViewAllHistory}
                >
                  View All
                </button>
              </div>

              <div style={{ border: '1px solid #f0eae1', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                  <thead>
                    <tr style={{ background: '#faf8f5', color: '#8c7b6f', textAlign: 'left', borderBottom: '1px solid #f0eae1' }}>
                      <th style={{ padding: '8px 10px' }}>Date & Time</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>Type</th>
                      <th style={{ padding: '8px 10px' }}>Details</th>
                      <th style={{ padding: '8px 6px', textAlign: 'center' }}>Points</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Order #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerLoyaltyHistory.slice(0, 5).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f5efe8' }}>
                        <td style={{ padding: '8px 10px', color: '#6d5b4f', whiteSpace: 'nowrap' }}>
                          {item.dateTime?.split(',')[0] || item.date}
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                          <span className={item.type === 'Earned' ? 'owner-badge-earned' : 'owner-badge-redeemed'}>
                            {item.type}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', color: '#4a3f35', fontWeight: 500 }}>
                          {item.details}
                        </td>
                        <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                          <span className={item.points > 0 ? 'owner-points-val-positive' : 'owner-points-val-negative'}>
                            {item.points > 0 ? `+${item.points}` : item.points}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <span className="owner-order-link">{item.orderNumber}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* OVERVIEW TAB                                                   */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#faf8f5', padding: '14px', borderRadius: '10px', border: '1px solid #eee8df' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Phone</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911' }}>{customer.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Total Spent</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#8c4a23' }}>{customer.formattedSpent || '₹8,450'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Visits</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911' }}>{customer.visits || 12} times</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>Avg. Order</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2a1911' }}>{customer.formattedAvgSpend || '₹704'}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 800 }}>Recent Orders</h4>
              {customer.recentOrders?.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #ede6dc',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#2a1911' }}>{ord.id}</div>
                    <div style={{ fontSize: '11px', color: '#8c7b6f' }}>{ord.date} · {ord.itemsCount} items</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#8c4a23' }}>{ord.amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ORDERS TAB                                                     */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800 }}>Complete Orders History</h4>
            {customer.recentOrders?.map((ord) => (
              <div key={ord.id} style={{ background: '#faf8f5', border: '1px solid #eee8df', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 800 }}>{ord.id}</span>
                  <span style={{ fontWeight: 800, color: '#8c4a23' }}>{ord.amount}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#7a6a5e', marginBottom: 6 }}>{ord.date}</div>
                <div style={{ borderTop: '1px dashed #e8e0d5', paddingTop: 6, fontSize: '12px' }}>
                  {ord.items?.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#5a4b41' }}>
                      <span>{it.qty} × {it.name}</span>
                      <span>₹{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================== */}
        {/* PROMOTIONS TAB                                                 */}
        {activeTab === 'promotions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800 }}>Promotions Applied by Customer</h4>
            {customer.usedPromotions && customer.usedPromotions.length > 0 ? (
              customer.usedPromotions.map((promo, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#faf8f5',
                    border: '1px solid #ede6dc',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f5ede4', color: '#8c4a23', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Tag size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#2a1911' }}>{promo.title}</div>
                      <div style={{ fontSize: '11px', color: '#8c7b6f' }}>{promo.date}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>
                    {promo.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: '#8c7b6f', textAlign: 'center', padding: '20px' }}>
                No promotions used by this customer yet.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
