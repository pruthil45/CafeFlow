import { useState, useMemo, useEffect } from 'react'
import {
  INITIAL_LOYALTY_PROGRAM,
  INITIAL_REWARDS,
  INITIAL_LOYALTY_ACTIVITIES,
} from './data/loyaltyMockData'
import { OWNER_CUSTOMERS_DATA } from '../data/ownerMockData'
import LoyaltySummaryCards from './components/LoyaltySummaryCards'
import LoyaltyStatusCard from './components/LoyaltyStatusCard'
import PointsRuleCard from './components/PointsRuleCard'
import RewardsTableCard from './components/RewardsTableCard'
import RecentLoyaltyActivityCard from './components/RecentLoyaltyActivityCard'
import CustomerLoyaltyDrawer from './components/CustomerLoyaltyDrawer'
import EditPointsRuleModal from './components/EditPointsRuleModal'
import CreateEditRewardModal from './components/CreateEditRewardModal'
import LoyaltyHistoryModal from './components/LoyaltyHistoryModal'
import { CheckCircle2, AlertTriangle, X, User } from 'lucide-react'
import './Loyalty.css'
import '../Owner.css'

export default function OwnerLoyalty() {
  const [loyaltyProgram, setLoyaltyProgram] = useState(() => {
    const saved = localStorage.getItem('cafeflow_loyalty_program')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.isEnabled === 'boolean') {
          return {
            isEnabled: parsed.isEnabled,
            spendAmount: parsed.spendAmount || parsed.rule?.spendAmount || 100,
            pointsEarned: parsed.pointsEarned || parsed.rule?.pointsEarned || 10,
          }
        }
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_LOYALTY_PROGRAM
  })

  // 2. Rewards State
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('cafeflow_loyalty_rewards')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_REWARDS
  })

  // 3. Activity State
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('cafeflow_loyalty_activities')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_LOYALTY_ACTIVITIES
  })

  // 4. Customers State
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('cafeflow_loyalty_customers')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        /* fallback */
      }
    }
    // Enrich with default loyalty values
    return (OWNER_CUSTOMERS_DATA?.customers || []).map((c, idx) => ({
      ...c,
      totalEarnedPoints: c.totalEarnedPoints ?? (c.loyaltyPoints ? c.loyaltyPoints + 200 : 520),
      totalRedeemedPoints: c.totalRedeemedPoints ?? 200,
      loyaltyPoints: c.loyaltyPoints ?? (idx === 0 ? 320 : 150),
      loyaltyTarget: c.loyaltyTarget || 500,
    }))
  })

  // 5. Selected Customer for Drawer (null by default; only opens when user clicks a customer)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false)

  // 6. Modals
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false)
  const [isCreateRewardModalOpen, setIsCreateRewardModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [rewardToDelete, setRewardToDelete] = useState(null)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // 7. Toast Notification
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3800)
  }

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('cafeflow_loyalty_program', JSON.stringify(loyaltyProgram))
  }, [loyaltyProgram])

  useEffect(() => {
    localStorage.setItem('cafeflow_loyalty_rewards', JSON.stringify(rewards))
  }, [rewards])

  useEffect(() => {
    localStorage.setItem('cafeflow_loyalty_activities', JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem('cafeflow_loyalty_customers', JSON.stringify(customers))
  }, [customers])

  // Get active selected customer object
  const currentSelectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null
    return customers.find((c) => c.id === selectedCustomerId) || null
  }, [customers, selectedCustomerId])

  // Customer-specific loyalty history
  const customerLoyaltyHistory = useMemo(() => {
    if (!currentSelectedCustomer) return []
    return activities.filter(
      (a) => a.customerId === currentSelectedCustomer.id || a.customerName === currentSelectedCustomer.name
    )
  }, [activities, currentSelectedCustomer])

  // Dynamic KPI counts
  const summaryMetrics = useMemo(() => {
    const totalMembers = customers.filter((c) => (c.loyaltyPoints || 0) > 0).length || 1248
    const earnedThisMonth = activities
      .filter((a) => a.type === 'Earned')
      .reduce((sum, a) => sum + (Math.abs(a.points) || 0), 0) + 8190
    const redeemedThisMonth = activities
      .filter((a) => a.type === 'Redeemed')
      .length * 40 + 320

    return {
      membersCount: totalMembers >= 1000 ? `${(totalMembers / 1000).toFixed(1)}k`.replace('.0k', 'k') : totalMembers,
      pointsEarned: earnedThisMonth.toLocaleString('en-IN'),
      rewardsRedeemed: redeemedThisMonth,
    }
  }, [customers, activities])

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  // Toggle Program Status
  const handleToggleProgramStatus = () => {
    const nextStatus = loyaltyProgram.isEnabled ? false : true
    setLoyaltyProgram((prev) => ({
      ...prev,
      isEnabled: nextStatus,
    }))
    showToast(
      nextStatus
        ? 'Loyalty program enabled. Customers can now earn and redeem points.'
        : 'Loyalty program disabled. New points accrual paused, existing balances preserved.',
      nextStatus ? 'success' : 'info'
    )
  }

  // Update Points Rule
  const handleSavePointsRule = (newRule) => {
    setLoyaltyProgram((prev) => ({
      ...prev,
      spendAmount: newRule.spendAmount,
      pointsEarned: newRule.pointsEarned,
    }))
    setIsEditRuleModalOpen(false)
    showToast(`Points rule updated: ₹${newRule.spendAmount} spent = ${newRule.pointsEarned} points.`)
  }

  // Create or Update Reward
  const handleSaveReward = (rewardData) => {
    if (editingReward) {
      setRewards((prev) =>
        prev.map((r) => (r.id === editingReward.id ? { ...rewardData, id: r.id } : r))
      )
      showToast(`Reward "${rewardData.name}" updated successfully.`)
    } else {
      const newReward = {
        ...rewardData,
        id: `REW-${Date.now().toString().slice(-4)}`,
      }
      setRewards((prev) => [...prev, newReward])
      showToast(`Reward "${rewardData.name}" created successfully.`)
    }
    setIsCreateRewardModalOpen(false)
    setEditingReward(null)
  }

  // Toggle Reward Active/Inactive
  const handleToggleRewardStatus = (rewardId) => {
    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === rewardId) {
          const nextStatus = r.status === 'Active' ? 'Inactive' : 'Active'
          showToast(`Reward "${r.name}" marked as ${nextStatus}.`)
          return { ...r, status: nextStatus }
        }
        return r
      })
    )
  }

  // Delete Reward
  const handleConfirmDeleteReward = () => {
    if (!rewardToDelete) return
    setRewards((prev) => prev.filter((r) => r.id !== rewardToDelete.id))
    showToast(`Reward "${rewardToDelete.name}" deleted.`, 'info')
    setRewardToDelete(null)
  }

  // Open Customer Drawer
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomerId(customerId)
    setIsCustomerDrawerOpen(true)
  }

  return (
    <div className="owner-loyalty-page">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`owner-toast ${toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'success'} animate-fade-in`}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: toast.type === 'error' ? '#fef2f2' : '#ffffff',
            border: `1px solid ${toast.type === 'error' ? '#f87171' : '#ede6dc'}`,
            color: toast.type === 'error' ? '#991b1b' : '#2a1911',
            padding: '12px 18px',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(42, 25, 17, 0.15)',
            fontWeight: 600,
            fontSize: '13px',
            maxWidth: 480,
          }}
        >
          {toast.type === 'error' ? (
            <AlertTriangle size={18} color="#dc2626" />
          ) : (
            <CheckCircle2 size={18} color="#16a34a" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#8c7b6f', cursor: 'pointer', padding: 2, marginLeft: 'auto' }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Page Layout Grid (Split screen with detail panel on right) */}
      <div className="owner-loyalty-workspace">
        {/* Left Column: Main Loyalty Workspace */}
        <div className="owner-loyalty-main-col">
          {/* Page Title & Subtitle */}
          <div className="owner-loyalty-header">
            <div>
              <h1 className="owner-loyalty-title">Loyalty</h1>
              <p className="owner-loyalty-subtitle">
                Reward your customers for every visit and keep them coming back.
              </p>
            </div>
          </div>

          {/* Mobile Customer Loyalty Quick-Access Trigger (only if a customer is selected) */}
          {currentSelectedCustomer && (
            <div className="owner-loyalty-mobile-customer-btn">
              <button
                type="button"
                className="owner-btn-secondary"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#ffffff',
                  border: '1px solid #ede5da',
                  borderRadius: 10,
                  fontWeight: 700,
                  color: '#2a1911',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                }}
                onClick={() => setIsCustomerDrawerOpen(true)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={16} color="#8c4a23" />
                  <span style={{ fontSize: '13px' }}>
                    Customer Loyalty: <strong style={{ color: '#8c4a23' }}>{currentSelectedCustomer.name}</strong>
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#8c4a23', fontWeight: 800 }}>
                  {currentSelectedCustomer.loyaltyPoints || 320} pts →
                </span>
              </button>
            </div>
          )}

          {/* 3.1 Loyalty Summary Cards */}
          <LoyaltySummaryCards
            membersCount={summaryMetrics.membersCount}
            pointsEarned={summaryMetrics.pointsEarned}
            rewardsRedeemed={summaryMetrics.rewardsRedeemed}
          />

          {/* 3.2 Loyalty Program Status Card */}
          <LoyaltyStatusCard
            isEnabled={loyaltyProgram.isEnabled}
            onToggleStatus={handleToggleProgramStatus}
          />

          {/* 3.3 Points Earning Rule Card */}
          <PointsRuleCard
            spendAmount={loyaltyProgram.spendAmount}
            pointsEarned={loyaltyProgram.pointsEarned}
            onEditRule={() => setIsEditRuleModalOpen(true)}
          />

          {/* 3.4 Rewards Management Table */}
          <RewardsTableCard
            rewards={rewards}
            onCreateReward={() => {
              setEditingReward(null)
              setIsCreateRewardModalOpen(true)
            }}
            onEditReward={(reward) => {
              setEditingReward(reward)
              setIsCreateRewardModalOpen(true)
            }}
            onToggleStatus={handleToggleRewardStatus}
            onDeleteReward={(reward) => setRewardToDelete(reward)}
          />

          {/* 3.5 Recent Loyalty Activity */}
          <RecentLoyaltyActivityCard
            activities={activities.slice(0, 4)}
            onViewAll={() => setIsHistoryModalOpen(true)}
            onSelectCustomer={(custId) => handleSelectCustomer(custId)}
          />
        </div>

        {/* Right Column: Customer Loyalty Detail Panel */}
        {isCustomerDrawerOpen && currentSelectedCustomer && (
          <CustomerLoyaltyDrawer
            customer={currentSelectedCustomer}
            customerLoyaltyHistory={customerLoyaltyHistory}
            isLoyaltyProgramEnabled={loyaltyProgram.isEnabled}
            onClose={() => {
              setIsCustomerDrawerOpen(false)
              setSelectedCustomerId(null)
            }}
            onViewAllHistory={() => setIsHistoryModalOpen(true)}
          />
        )}
      </div>

      {/* ============================================================== */}
      {/* MODALS & DIALOGS                                                */}
      {/* ============================================================== */}

      {/* Edit Points Rule Modal */}
      {isEditRuleModalOpen && (
        <EditPointsRuleModal
          rule={{ spendAmount: loyaltyProgram.spendAmount, pointsEarned: loyaltyProgram.pointsEarned }}
          onClose={() => setIsEditRuleModalOpen(false)}
          onSave={handleSavePointsRule}
        />
      )}

      {/* Create / Edit Reward Modal */}
      {isCreateRewardModalOpen && (
        <CreateEditRewardModal
          reward={editingReward}
          onClose={() => {
            setIsCreateRewardModalOpen(false)
            setEditingReward(null)
          }}
          onSave={handleSaveReward}
        />
      )}

      {/* Full Loyalty History Modal */}
      {isHistoryModalOpen && (
        <LoyaltyHistoryModal
          activities={activities}
          onClose={() => setIsHistoryModalOpen(false)}
          onSelectCustomer={handleSelectCustomer}
        />
      )}

      {/* Delete Reward Confirmation Modal */}
      {rewardToDelete && (
        <div className="owner-modal-overlay" onClick={() => setRewardToDelete(null)} role="dialog">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 420, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: 17, fontWeight: 800, color: '#2a1911' }}>
              Delete Reward?
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: '#6d5b4f', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>&quot;{rewardToDelete.name}&quot;</strong>? Customers will no longer be able to redeem this reward. Existing redemption history will not be lost.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setRewardToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
                onClick={handleConfirmDeleteReward}
              >
                Delete Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
