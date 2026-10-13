import { useState, useMemo, useEffect } from 'react'
import { Plus, CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { INITIAL_PROMOTIONS } from './data/promotionsMockData'
import PromotionSummaryCards from './components/PromotionSummaryCards'
import PromotionTable from './components/PromotionTable'
import CreateEditPromotionPanel from './components/CreateEditPromotionPanel'
import PromotionDetailsModal from './components/PromotionDetailsModal'
import './Promotions.css'
import '../Owner.css'

export default function OwnerPromotions() {
  // 1. Promotions State (with LocalStorage persistence)
  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('cafeflow_promotions_data')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_PROMOTIONS
  })

  // 2. Filters & Search State
  const [activeTab, setActiveTab] = useState('All') // 'All', 'Active', 'Scheduled', 'Inactive'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL') // 'ALL', 'Discount', 'Buy X Get Y', 'Free Item', 'Combo Offer', 'Time Based'

  // 3. Side Panel State (defaults to open on desktop matching screenshot, closed on mobile)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1200
    }
    return true
  })
  const [promotionToEdit, setPromotionToEdit] = useState(null)

  // 4. Modals State
  const [viewingPromotion, setViewingPromotion] = useState(null)
  const [promoToDelete, setPromoToDelete] = useState(null)

  // 5. Toast Feedback
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3800)
  }

  // Persist promotions
  useEffect(() => {
    localStorage.setItem('cafeflow_promotions_data', JSON.stringify(promotions))
  }, [promotions])

  // Summary counts calculated from state
  const counts = useMemo(() => {
    const total = promotions.length
    const active = promotions.filter((p) => p.status === 'Active').length
    const scheduled = promotions.filter((p) => p.status === 'Scheduled').length
    const inactive = promotions.filter((p) => p.status === 'Inactive').length
    return { total, active, scheduled, inactive }
  }, [promotions])

  // Filtered promotions for table
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      // 1. Status Tab Filter
      if (activeTab !== 'All' && p.status !== activeTab) {
        return false
      }

      // 2. Promotion Type Filter
      if (selectedType !== 'ALL' && p.type !== selectedType) {
        return false
      }

      // 3. Search Term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchName = p.name?.toLowerCase().includes(query)
        const matchDetails = p.details?.toLowerCase().includes(query)
        const matchCategory = p.category?.toLowerCase().includes(query)
        if (!matchName && !matchDetails && !matchCategory) return false
      }

      return true
    })
  }, [promotions, activeTab, selectedType, searchTerm])

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleOpenCreatePanel = () => {
    setPromotionToEdit(null)
    setIsSidePanelOpen(true)
  }

  const handleEditPromotion = (promo) => {
    setPromotionToEdit(promo)
    setIsSidePanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsSidePanelOpen(false)
    setPromotionToEdit(null)
  }

  const handleSavePromotion = (promoData) => {
    if (promotionToEdit) {
      // Update existing
      setPromotions((prev) =>
        prev.map((p) => (p.id === promoData.id ? { ...promoData } : p))
      )
      showToast(`Promotion "${promoData.name}" updated successfully.`)
    } else {
      // Create new
      setPromotions((prev) => [promoData, ...prev])
      showToast(`Promotion "${promoData.name}" created successfully.`)
    }
    setIsSidePanelOpen(false)
    setPromotionToEdit(null)
  }

  // Toggle Active / Inactive
  const handleToggleStatus = (promoId) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === promoId) {
          const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active'
          showToast(`Promotion "${p.name}" marked as ${nextStatus}.`)
          return { ...p, status: nextStatus }
        }
        return p
      })
    )
  }

  // Duplicate Promotion
  const handleDuplicatePromotion = (promo) => {
    const duplicated = {
      ...promo,
      id: `promo-${Date.now().toString().slice(-4)}`,
      name: `${promo.name} (Copy)`,
      usage: 0,
    }
    setPromotions((prev) => [duplicated, ...prev])
    showToast(`Promotion duplicated as "${duplicated.name}".`)
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!promoToDelete) return
    setPromotions((prev) => prev.filter((p) => p.id !== promoToDelete.id))
    showToast(`Promotion "${promoToDelete.name}" deleted.`, 'info')
    setPromoToDelete(null)
  }

  return (
    <div className="owner-promotions-page">
      {/* Toast Notification */}
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

      {/* Top Header: Title, Subtitle, and + Create Promotion button */}
      <div className="owner-promotions-header">
        <div>
          <h1 className="owner-promotions-title">Promotions</h1>
          <p className="owner-promotions-subtitle">
            Create and manage special offers to attract more customers and boost sales.
          </p>
        </div>

        <button
          type="button"
          className="owner-btn-primary"
          style={{
            background: '#8c4a23',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(140, 74, 35, 0.25)',
          }}
          onClick={handleOpenCreatePanel}
        >
          <Plus size={16} />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* 4.1 Promotion Summary Cards */}
      <PromotionSummaryCards counts={counts} />

      {/* 4.2 - 4.5 Workspace: Left Column Table, Right Column Side Panel */}
      <div className="owner-promotions-workspace">
        {/* Table & Filters Column */}
        <PromotionTable
          promotions={filteredPromotions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onEditPromotion={handleEditPromotion}
          onViewDetails={(promo) => setViewingPromotion(promo)}
          onToggleStatus={handleToggleStatus}
          onDuplicatePromotion={handleDuplicatePromotion}
          onDeletePromotion={(promo) => setPromoToDelete(promo)}
        />

        {/* 4.5 Create / Edit Promotion Side Panel */}
        <CreateEditPromotionPanel
          isOpen={isSidePanelOpen}
          onClose={handleClosePanel}
          promotionToEdit={promotionToEdit}
          onSavePromotion={handleSavePromotion}
        />
      </div>

      {/* Promotion Details Modal */}
      {viewingPromotion && (
        <PromotionDetailsModal
          promotion={viewingPromotion}
          onClose={() => setViewingPromotion(null)}
          onEdit={(promo) => {
            setViewingPromotion(null)
            handleEditPromotion(promo)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {promoToDelete && (
        <div className="owner-modal-overlay" onClick={() => setPromoToDelete(null)} role="dialog">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 420, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: 17, fontWeight: 800, color: '#2a1911' }}>
              Delete Promotion?
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: '#6d5b4f', lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>&quot;{promoToDelete.name}&quot;</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setPromoToDelete(null)}
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
                onClick={handleConfirmDelete}
              >
                Delete Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
