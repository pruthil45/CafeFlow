import { useState, useRef, useEffect } from 'react'
import { Gift, Plus, Edit2, MoreVertical, Trash2, Power } from 'lucide-react'

export default function RewardsTableCard({
  rewards = [],
  onCreateReward,
  onEditReward,
  onToggleStatus,
  onDeleteReward,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="owner-loyalty-card">
      <div className="owner-loyalty-card-header">
        <div className="owner-loyalty-card-header-left">
          <div className="owner-loyalty-card-icon" style={{ background: '#fff7ed', color: '#ea580c', borderColor: '#fed7aa' }}>
            <Gift size={20} />
          </div>
          <div>
            <h3 className="owner-loyalty-card-title">Rewards</h3>
            <p className="owner-loyalty-card-desc">
              Create and manage rewards that customers can redeem using their loyalty points.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="owner-btn-primary"
          style={{
            background: '#8c4a23',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
          }}
          onClick={onCreateReward}
        >
          <Plus size={16} /> Create Reward
        </button>
      </div>

      <div className="owner-loyalty-table-wrap">
        <table className="owner-loyalty-table">
          <thead>
            <tr>
              <th style={{ width: '48px', textAlign: 'center' }}>#</th>
              <th>Reward Name</th>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>Points Required</th>
              <th style={{ textAlign: 'center' }}>Minimum Spend</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward, index) => {
              const isActive = reward.status === 'Active'
              const isMenuOpen = activeMenuId === reward.id

              return (
                <tr key={reward.id || index}>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: '#8c7b6f' }}>
                    {index + 1}
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--owner-espresso, #2a1911)' }}>
                    {reward.name}
                  </td>
                  <td style={{ color: '#6d5b4f' }}>
                    {reward.description}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 800, color: '#8c4a23' }}>
                    {reward.pointsRequired}
                  </td>
                  <td style={{ textAlign: 'center', color: '#5a4b41', fontWeight: 600 }}>
                    {reward.minimumSpend > 0 ? `₹${reward.minimumSpend}` : '₹0'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isActive ? '#dcfce7' : '#fee2e2',
                        color: isActive ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {reward.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        position: 'relative',
                      }}
                    >
                      <button
                        type="button"
                        className="owner-btn-outline-warm"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => onEditReward(reward)}
                      >
                        <Edit2 size={12} /> Edit
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="owner-table-action-btn"
                          style={{
                            padding: '4px 6px',
                            background: '#faf8f5',
                            border: '1px solid #ede5da',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setActiveMenuId(isMenuOpen ? null : reward.id)}
                          aria-label="More actions"
                        >
                          <MoreVertical size={14} color="#7a6a5e" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              marginTop: 4,
                              background: '#ffffff',
                              border: '1px solid #ede8e1',
                              borderRadius: '8px',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                              padding: '4px',
                              zIndex: 50,
                              minWidth: '150px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                            }}
                          >
                            <button
                              type="button"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 10px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#4a3f35',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left',
                                width: '100%',
                              }}
                              onClick={() => {
                                onToggleStatus(reward.id)
                                setActiveMenuId(null)
                              }}
                            >
                              <Power size={13} color={isActive ? '#dc2626' : '#16a34a'} />
                              {isActive ? 'Deactivate' : 'Activate'}
                            </button>

                            <button
                              type="button"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '6px 10px',
                                border: 'none',
                                background: 'transparent',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#dc2626',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                textAlign: 'left',
                                width: '100%',
                              }}
                              onClick={() => {
                                onDeleteReward(reward)
                                setActiveMenuId(null)
                              }}
                            >
                              <Trash2 size={13} /> Delete Reward
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
