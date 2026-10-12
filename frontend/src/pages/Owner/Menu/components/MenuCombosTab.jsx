import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Plus,
  Filter,
  SlidersHorizontal,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
  Star,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight,
  Upload,
  Minus,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react'
import '../../Owner.css'

// Helper getters for robust property support
const getIsActive = (c) =>
  c && (c.active !== undefined ? !!c.active : c.status === 'Active')
const getIsBestseller = (c) => !!(c && (c.isBestseller ?? c.bestseller))
const getIsPopular = (c) => !!(c && (c.isPopular ?? c.popular))

export default function MenuCombosTab({
  combos = [],
  setCombos,
  menuItems = [],
  showToast,
}) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Active combo for editor panel (default to null - NO auto-select!)
  const [activeComboId, setActiveComboId] = useState(null)
  const activeCombo = useMemo(() => {
    if (!activeComboId) return null
    return combos.find((c) => c.id === activeComboId) || null
  }, [combos, activeComboId])

  // Sub-tabs in right panel
  const [comboDetailTab, setComboDetailTab] = useState('general') // 'general', 'items', 'pricing', 'availability'
  const [isEditing, setIsEditing] = useState(false)

  // Draft form for right panel editor
  const [editForm, setEditForm] = useState(null)

  // Sync draft form when selected combo changes (Default to READ-ONLY View Mode)
  const handleSelectCombo = (combo) => {
    setActiveComboId(combo.id)
    setEditForm({
      ...combo,
      active: getIsActive(combo),
      isBestseller: getIsBestseller(combo),
      isPopular: getIsPopular(combo),
      items: [...(combo.items || [])],
    })
    setIsEditing(false)
    setComboDetailTab('general')
  }

  // Close detail panel
  const handleCloseDetail = () => {
    setActiveComboId(null)
    setEditForm(null)
    setIsEditing(false)
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveComboId(null)
        setEditForm(null)
        setIsEditing(false)
      }
    }
    if (activeComboId) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeComboId])

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddItemToComboModal, setShowAddItemToComboModal] = useState(false)
  const [selectedItemToAdd, setSelectedItemToAdd] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  // Background scroll lock when modal is open
  useEffect(() => {
    if (activeComboId || showAddModal || showAddItemToComboModal || deleteCandidate) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [activeComboId, showAddModal, showAddItemToComboModal, deleteCandidate])

  // New Combo Form State
  const [newComboForm, setNewComboForm] = useState({
    name: '',
    description: '',
    category: 'Burgers',
    price: '',
    comparePrice: '',
    isBestseller: true,
    isPopular: false,
    active: true,
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80',
    items: [
      { itemId: 'item-001', name: 'Classic Burger', category: 'Burger', quantity: 1, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80' },
      { itemId: 'item-013', name: 'French Fries', category: 'Starters', quantity: 1, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=100&auto=format&fit=crop&q=80' },
    ],
  })

  // Statistics calculation
  const totalCount = combos.length
  const activeCount = combos.filter((c) => getIsActive(c)).length
  const inactiveCount = totalCount - activeCount
  const bestsellingCount = combos.filter((c) => getIsBestseller(c)).length

  // Filtered List
  const filteredCombos = useMemo(() => {
    return combos.filter((combo) => {
      const matchSearch =
        combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        combo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        combo.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        selectedCategory === 'all' ||
        combo.category.toLowerCase() === selectedCategory.toLowerCase()

      const isAct = getIsActive(combo)
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && isAct) ||
        (selectedStatus === 'inactive' && !isAct)

      const isBest = getIsBestseller(combo)
      const isPop = getIsPopular(combo)
      const matchType =
        selectedType === 'all' ||
        (selectedType === 'bestseller' && isBest) ||
        (selectedType === 'popular' && isPop)

      return matchSearch && matchCategory && matchStatus && matchType
    })
  }, [combos, searchQuery, selectedCategory, selectedStatus, selectedType])

  // Pagination
  const totalPages = Math.ceil(filteredCombos.length / itemsPerPage) || 1
  const paginatedCombos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCombos.slice(start, start + itemsPerPage)
  }, [filteredCombos, currentPage, itemsPerPage])

  // Toggle Combo Active Status
  const handleToggleStatus = (e, comboId) => {
    e.stopPropagation()
    setCombos((prev) =>
      prev.map((c) => {
        if (c.id === comboId) {
          const currentlyActive = getIsActive(c)
          const nextActive = !currentlyActive
          const updated = {
            ...c,
            active: nextActive,
            status: nextActive ? 'Active' : 'Inactive',
          }
          if (activeComboId === comboId) {
            setEditForm((f) => ({ ...f, active: updated.active, status: updated.status }))
          }
          return updated
        }
        return c
      })
    )
    showToast?.('Combo status updated', 'success')
  }

  // Stepper for quantity in combo editor
  const handleUpdateItemQty = (index, delta) => {
    setEditForm((prev) => {
      const newItems = [...(prev.items || [])]
      const currentQty = newItems[index].quantity || 1
      const updatedQty = Math.max(1, currentQty + delta)
      newItems[index] = { ...newItems[index], quantity: updatedQty }
      return { ...prev, items: newItems }
    })
  }

  // Remove item from combo in editor
  const handleRemoveItemFromCombo = (index) => {
    setEditForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  // Add Item to combo editor from modal
  const handleConfirmAddItem = () => {
    if (!selectedItemToAdd) return
    const found = menuItems.find((m) => m.id === selectedItemToAdd)
    if (!found) return

    const newItem = {
      itemId: found.id,
      name: found.name,
      category: found.category,
      quantity: 1,
      image: found.image,
    }

    setEditForm((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }))
    setShowAddItemToComboModal(false)
    setSelectedItemToAdd('')
    showToast?.(`Added "${found.name}" to combo`, 'success')
  }

  // Save changes from Right Detail Panel
  const handleSaveDetailChanges = () => {
    if (!editForm.name?.trim()) {
      showToast?.('Combo name is required', 'error')
      return
    }
    if (!editForm.price || isNaN(editForm.price)) {
      showToast?.('Valid price is required', 'error')
      return
    }

    const updated = {
      ...editForm,
      price: parseFloat(editForm.price),
      comparePrice: editForm.comparePrice
        ? parseFloat(editForm.comparePrice)
        : null,
    }

    setCombos((prev) =>
      prev.map((c) => (c.id === editForm.id ? updated : c))
    )
    setEditForm(updated)
    setIsEditing(false)
    showToast?.(`Saved changes for "${editForm.name}"`, 'success')
  }

  // Create new combo
  const handleCreateCombo = (e) => {
    e.preventDefault()
    if (!newComboForm.name.trim() || !newComboForm.price) {
      showToast?.('Please fill required fields', 'error')
      return
    }

    const created = {
      id: `combo-${Date.now()}`,
      name: newComboForm.name.trim(),
      description: newComboForm.description.trim(),
      category: newComboForm.category,
      price: parseFloat(newComboForm.price),
      comparePrice: newComboForm.comparePrice
        ? parseFloat(newComboForm.comparePrice)
        : null,
      isBestseller: newComboForm.isBestseller,
      isPopular: newComboForm.isPopular,
      active: newComboForm.active,
      image: newComboForm.image,
      items: newComboForm.items,
    }

    setCombos((prev) => [created, ...prev])
    setActiveComboId(created.id)
    setEditForm(created)
    setShowAddModal(false)
    setNewComboForm({
      name: '',
      description: '',
      category: 'Burgers',
      price: '',
      comparePrice: '',
      isBestseller: true,
      isPopular: false,
      active: true,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80',
      items: [],
    })
    showToast?.(`Combo "${created.name}" created`, 'success')
  }

  // Delete combo
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return
    setCombos((prev) => prev.filter((c) => c.id !== deleteCandidate.id))
    if (activeComboId === deleteCandidate.id) {
      handleCloseDetail()
    }
    showToast?.(`Deleted combo "${deleteCandidate.name}"`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="owner-combos-page animate-fade-in">
      {/* 4 Statistics KPI Cards */}
      <div className="owner-kpi-stats-grid" style={{ marginBottom: 18 }}>
        {/* Card 1: Total Combos */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#ffedd5', color: '#ea580c' }}
          >
            <Package size={22} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{totalCount}</div>
            <div className="owner-kpi-stat-lbl">Total Combos</div>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#dcfce7', color: '#16a34a' }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#16a34a',
              }}
            ></div>
          </div>
          <div>
            <div className="owner-kpi-stat-val">{activeCount}</div>
            <div className="owner-kpi-stat-lbl">Active</div>
          </div>
        </div>

        {/* Card 3: Inactive */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fee2e2', color: '#dc2626' }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#dc2626',
              }}
            ></div>
          </div>
          <div>
            <div className="owner-kpi-stat-val">{inactiveCount}</div>
            <div className="owner-kpi-stat-lbl">Inactive</div>
          </div>
        </div>

        {/* Card 4: Bestselling */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <Star size={20} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{bestsellingCount}</div>
            <div className="owner-kpi-stat-lbl">Bestselling</div>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div
        className="owner-toolbar-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 14px',
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid var(--owner-card-border)',
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Search with Ctrl K badge */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 200px',
            minWidth: 180,
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9c8e82',
            }}
          />
          <input
            type="text"
            className="owner-form-input"
            placeholder="Search combos..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            style={{ paddingLeft: 32, paddingRight: 60 }}
          />
          <div
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 10.5,
              fontWeight: 600,
              color: '#8c7b6f',
              background: '#f5efe6',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            Ctrl K
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#7a6a5e', fontWeight: 600 }}>
            Category:
          </span>
          <select
            className="owner-form-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            style={{ minWidth: 130 }}
          >
            <option value="all">All Categories</option>
            <option value="Burgers">Burgers</option>
            <option value="Pizzas">Pizzas</option>
            <option value="Pasta">Pasta</option>
            <option value="Sandwiches">Sandwiches</option>
            <option value="Starters">Starters</option>
            <option value="Beverages">Beverages</option>
            <option value="Desserts">Desserts</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#7a6a5e', fontWeight: 600 }}>
            Status:
          </span>
          <select
            className="owner-form-select"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
            style={{ minWidth: 110 }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Type / Badge Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#7a6a5e', fontWeight: 600 }}>
            Type:
          </span>
          <select
            className="owner-form-select"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value)
              setCurrentPage(1)
            }}
            style={{ minWidth: 120 }}
          >
            <option value="all">All Types</option>
            <option value="bestseller">Bestseller</option>
            <option value="popular">Popular</option>
          </select>
        </div>

        {/* Reset */}
        <button
          type="button"
          className="owner-btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto',
          }}
          onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
            setSelectedStatus('all')
            setSelectedType('all')
            setCurrentPage(1)
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Reset Filters</span>
        </button>

        {/* Add Combo Button */}
        <button
          type="button"
          className="owner-btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#8c4a23',
            color: '#fff',
            fontWeight: 700,
            padding: '7px 14px',
          }}
        >
          <Plus size={15} />
          <span>Add Combo</span>
        </button>
      </div>

      {/* Main 2-Column Split: Combos Grid (Left) + Detail Panel (Right) */}
      <div className="owner-combos-workspace">
        {/* Left Column: 3-Column Combo Grid */}
        <div>
          <div className="owner-combos-grid">
            {paginatedCombos.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: 40,
                  background: '#fff',
                  borderRadius: 12,
                  color: '#8c7b6f',
                  border: '1px solid var(--owner-card-border)',
                }}
              >
                No combo deals match the selected criteria.
              </div>
            ) : (
              paginatedCombos.map((combo) => {
                const isSelected = activeComboId === combo.id
                return (
                  <div
                    key={combo.id}
                    className={`owner-combo-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectCombo(combo)}
                  >
                    {/* Top Image + Badges */}
                    <div className="owner-combo-card-image-wrap">
                      <img
                        src={combo.image}
                        alt={combo.name}
                        className="owner-combo-card-image"
                      />
                      {getIsBestseller(combo) && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#ea580c',
                            color: '#fff',
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 4,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          Bestseller
                        </div>
                      )}
                      {!getIsBestseller(combo) && getIsPopular(combo) && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#2563eb',
                            color: '#fff',
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 4,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div
                      style={{
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 6,
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 14.5,
                            fontWeight: 800,
                            color: 'var(--owner-espresso)',
                          }}
                        >
                          {combo.name}
                        </h3>
                        <button
                          type="button"
                          className="owner-table-action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteCandidate(combo)
                          }}
                          title="Delete combo"
                          style={{ padding: 2 }}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: '#8c4a23',
                        }}
                      >
                        ₹ {combo.price}
                      </div>

                      <p
                        style={{
                          fontSize: 11.5,
                          color: '#7a6a5e',
                          margin: 0,
                          lineHeight: 1.35,
                          flex: 1,
                        }}
                      >
                        {combo.description}
                      </p>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 8,
                          borderTop: '1px solid #f2ede6',
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 7px',
                            borderRadius: 4,
                            fontSize: 10.5,
                            fontWeight: 600,
                            background: '#f4ece0',
                            color: '#6b5d52',
                          }}
                        >
                          {combo.category}
                        </span>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: getIsActive(combo) ? '#15803d' : '#8c7b6f',
                            }}
                          >
                            {getIsActive(combo) ? 'Active' : 'Inactive'}
                          </span>
                          <label
                            className="owner-toggle-switch"
                            style={{ transform: 'scale(0.8)' }}
                          >
                            <input
                              type="checkbox"
                              checked={getIsActive(combo)}
                              onChange={(e) =>
                                handleToggleStatus(e, combo.id)
                              }
                            />
                            <span className="owner-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination Controls */}
          <div
            style={{
              marginTop: 16,
              padding: '10px 14px',
              background: '#ffffff',
              borderRadius: 10,
              border: '1px solid var(--owner-card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 12.5, color: '#7a6a5e' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredCombos.length)} of{' '}
              {filteredCombos.length} combos
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`owner-pagination-btn ${
                      currentPage === pageNum ? 'active' : ''
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Combo Details Modal with Blurred Background */}
      {activeCombo && editForm && (
        <div
          className="owner-modal-overlay"
          onClick={handleCloseDetail}
          aria-label="Combo details modal backdrop"
        >
          <div
            className="owner-item-detail-modal"
            style={{ maxWidth: 640 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Combo Details Modal"
          >
            <div className="owner-detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="owner-detail-panel-title">
                  {isEditing ? 'Edit Combo' : 'Combo Details'}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#8c7b6f',
                    background: '#f0eae1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  ID: {editForm.id}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isEditing ? (
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => setIsEditing(false)}
                  >
                    <Eye size={13} /> View Mode
                  </button>
                ) : (
                  <button
                    type="button"
                    className="owner-btn-primary"
                    style={{ padding: '4px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="owner-modal-close-btn"
                  title="Close dialog"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 1. READ-ONLY VIEW MODE (Opened until user clicks 'Edit')       */}
            {/* ============================================================== */}
            {!isEditing ? (
              <div className="owner-item-view-container">
                {/* Hero Showcase with Badges Overlay */}
                <div className="owner-item-view-hero-wrap">
                  <img
                    src={editForm.image}
                    alt={editForm.name}
                    className="owner-item-view-hero-img"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&auto=format&fit=crop&q=80'
                    }}
                  />
                  <div className="owner-item-view-badges-overlay">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: 'rgba(255, 247, 237, 0.92)',
                        color: '#c2410c',
                        border: '1px solid #fdba74',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {editForm.category} Combo
                    </span>
                    <span
                      className={`owner-item-view-status-pill ${
                        editForm.active
                          ? 'owner-item-view-status-pill--active'
                          : 'owner-item-view-status-pill--inactive'
                      }`}
                    >
                      {editForm.active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                </div>

                {/* Identity & Price Summary */}
                <div className="owner-item-view-title-row">
                  <div>
                    <h2 className="owner-item-view-name">{editForm.name}</h2>
                    <div className="owner-item-view-meta-pills">
                      <span className="owner-item-view-pill">{editForm.category}</span>
                      <span className="owner-item-view-pill">
                        {editForm.items?.length || 0} Items Included
                      </span>
                      {editForm.isBestseller && (
                        <span className="owner-item-view-pill owner-item-view-pill--bestseller">
                          ★ Bestseller
                        </span>
                      )}
                      {editForm.isPopular && (
                        <span
                          className="owner-item-view-pill"
                          style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                          }}
                        >
                          🔥 Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="owner-item-view-price">
                    {editForm.comparePrice && editForm.comparePrice > editForm.price && (
                      <span
                        style={{
                          textDecoration: 'line-through',
                          color: '#9c8e82',
                          fontSize: '13px',
                          marginRight: 6,
                          fontWeight: 500,
                        }}
                      >
                        ₹{editForm.comparePrice}
                      </span>
                    )}
                    ₹ {editForm.price}
                  </div>
                </div>

                {/* Segmented Detail Tabs */}
                <div className="owner-detail-tabs-nav">
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${comboDetailTab === 'general' ? 'active' : ''}`}
                    onClick={() => setComboDetailTab('general')}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${comboDetailTab === 'items' ? 'active' : ''}`}
                    onClick={() => setComboDetailTab('items')}
                  >
                    Items ({editForm.items?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${comboDetailTab === 'pricing' ? 'active' : ''}`}
                    onClick={() => setComboDetailTab('pricing')}
                  >
                    Pricing
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${comboDetailTab === 'availability' ? 'active' : ''}`}
                    onClick={() => setComboDetailTab('availability')}
                  >
                    Availability
                  </button>
                </div>

                {/* Read-Only Details Body */}
                <div className="owner-detail-body">
                  {comboDetailTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7b6f', marginBottom: '6px' }}>
                          DESCRIPTION
                        </div>
                        <p className="owner-item-view-desc">
                          {editForm.description || 'No description provided for this combo.'}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ede7dc' }}>
                          <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>CATEGORY</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso)', marginTop: 2 }}>
                            {editForm.category}
                          </div>
                        </div>
                        <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ede7dc' }}>
                          <div style={{ fontSize: '11px', color: '#8c7b6f', fontWeight: 600 }}>TOTAL UNITS</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso)', marginTop: 2 }}>
                            {editForm.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 0} Total Units
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {comboDetailTab === 'items' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Items Included in Combo ({editForm.items?.length || 0})
                      </div>
                      {editForm.items && editForm.items.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {editForm.items.map((it, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: '#faf8f5',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #ede7dc',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img
                                  src={
                                    it.image ||
                                    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&auto=format&fit=crop&q=80'
                                  }
                                  alt={it.name}
                                  style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--owner-espresso)' }}>
                                    {it.name}
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2 }}>
                                    {it.category || 'Menu Item'}
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span
                                  style={{
                                    background: '#f0eae1',
                                    color: '#5c4d41',
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                  }}
                                >
                                  Qty: {it.quantity || 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '12.5px',
                            color: '#8c7b6f',
                            textAlign: 'center',
                            padding: '24px',
                            background: '#faf8f5',
                            borderRadius: '8px',
                          }}
                        >
                          No items configured in this combo.
                        </div>
                      )}
                    </div>
                  )}

                  {comboDetailTab === 'pricing' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Pricing & Discount Structure
                      </div>
                      <div className="owner-nutrition-grid-view">
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">₹{editForm.price}</div>
                          <div className="owner-nutrition-lbl">Combo Price</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">
                            {editForm.comparePrice ? `₹${editForm.comparePrice}` : '—'}
                          </div>
                          <div className="owner-nutrition-lbl">Original Price</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val" style={{ color: '#15803d' }}>
                            {editForm.comparePrice && editForm.comparePrice > editForm.price
                              ? `₹${Math.round(editForm.comparePrice - editForm.price)}`
                              : '₹0'}
                          </div>
                          <div className="owner-nutrition-lbl">Customer Savings</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val" style={{ color: '#ea580c' }}>
                            {editForm.comparePrice && editForm.comparePrice > editForm.price
                              ? `${Math.round(((editForm.comparePrice - editForm.price) / editForm.comparePrice) * 100)}%`
                              : 'Special'}
                          </div>
                          <div className="owner-nutrition-lbl">Discount</div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: '#8c7b6f',
                          background: '#faf8f5',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #f0eae1',
                        }}
                      >
                        All combo prices are inclusive of applicable goods & service taxes (GST).
                      </div>
                    </div>
                  )}

                  {comboDetailTab === 'availability' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Ordering Availability
                      </div>
                      <div
                        style={{
                          background: '#faf8f5',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid #ede7dc',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--owner-espresso)' }}>
                            Status for Customer Orders
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2 }}>
                            {editForm.active ? 'Accepting orders across all channels' : 'Currently paused and hidden'}
                          </div>
                        </div>
                        <span
                          className={`owner-item-view-status-pill ${
                            editForm.active
                              ? 'owner-item-view-status-pill--active'
                              : 'owner-item-view-status-pill--inactive'
                          }`}
                        >
                          {editForm.active ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', lineHeight: 1.5 }}>
                        <strong>Available Schedule:</strong> Everyday during standard cafe hours (11:00 AM – 11:00 PM).
                      </div>
                    </div>
                  )}
                </div>

                {/* Read-Only Mode Footer */}
                <div className="owner-detail-footer">
                  <button
                    type="button"
                    style={{
                      marginRight: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => setDeleteCandidate(editForm)}
                  >
                    <Trash2 size={13} /> Delete Combo
                  </button>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    onClick={handleCloseDetail}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="owner-btn-primary"
                    onClick={() => setIsEditing(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Edit2 size={14} /> Edit Combo
                  </button>
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* 2. EDIT MODE (Active when user clicks 'Edit')                   */
              /* ============================================================== */
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Combo Hero Image with Change Image */}
                  <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                    <img
                      src={editForm.image}
                      alt={editForm.name}
                      style={{
                        width: '100%',
                        height: 140,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <label
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        background: 'rgba(26,24,22,0.85)',
                        color: '#fff',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Upload size={12} />
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (uploadEvt) => {
                              setEditForm((prev) => ({
                                ...prev,
                                image: uploadEvt.target.result,
                              }))
                              showToast?.('Image updated preview', 'info')
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Sub-tabs: General | Items | Pricing | Availability */}
                  <div className="owner-detail-tabs-nav">
                    {['general', 'items', 'pricing', 'availability'].map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`owner-detail-tab-btn ${comboDetailTab === tab ? 'active' : ''}`}
                        onClick={() => setComboDetailTab(tab)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {tab === 'items' ? `Items (${editForm.items?.length || 0})` : tab}
                      </button>
                    ))}
                  </div>

                  {/* GENERAL TAB (EDIT) */}
                  {comboDetailTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="owner-field-group">
                        <label className="owner-field-label">
                          Combo Name <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="owner-form-input"
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                      </div>

                      <div className="owner-field-group">
                        <label className="owner-field-label">Description</label>
                        <textarea
                          className="owner-form-textarea"
                          rows={2}
                          value={editForm.description || ''}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr',
                          gap: 10,
                          alignItems: 'center',
                        }}
                      >
                        <div className="owner-field-group">
                          <label className="owner-field-label">
                            Category <span style={{ color: '#dc2626' }}>*</span>
                          </label>
                          <select
                            className="owner-form-select"
                            value={editForm.category || 'Burgers'}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                          >
                            <option value="Burgers">Burgers</option>
                            <option value="Pizzas">Pizzas</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Sandwiches">Sandwiches</option>
                            <option value="Starters">Starters</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Desserts">Desserts</option>
                          </select>
                        </div>

                        <div className="owner-field-group">
                          <label className="owner-field-label">Status *</label>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              height: 38,
                            }}
                          >
                            <label className="owner-toggle-switch">
                              <input
                                type="checkbox"
                                checked={!!editForm.active}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    active: e.target.checked,
                                  }))
                                }
                              />
                              <span className="owner-toggle-slider"></span>
                            </label>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: editForm.active ? '#10b981' : '#8c7b6f',
                              }}
                            >
                              {editForm.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ITEMS TAB (EDIT) */}
                  {comboDetailTab === 'items' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--owner-espresso)' }}>
                          Included Menu Items ({editForm.items?.length || 0})
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                          maxHeight: 220,
                          overflowY: 'auto',
                        }}
                      >
                        {editForm.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              borderRadius: 8,
                              border: '1px solid #ebdccb',
                              background: '#faf8f5',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <img
                                src={
                                  item.image ||
                                  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&auto=format&fit=crop&q=80'
                                }
                                alt={item.name}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 4,
                                  objectFit: 'cover',
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    color: '#33271e',
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div style={{ fontSize: 10.5, color: '#8c7b6f' }}>
                                  {item.category}
                                </div>
                              </div>
                            </div>

                            {/* Quantity Stepper & Delete */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  background: '#fff',
                                  border: '1px solid #e0d5c5',
                                  borderRadius: 6,
                                  padding: '2px 4px',
                                }}
                              >
                                <button
                                  type="button"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 2,
                                    color: '#7a6a5e',
                                  }}
                                  onClick={() => handleUpdateItemQty(idx, -1)}
                                >
                                  <Minus size={11} />
                                </button>
                                <span
                                  style={{
                                    padding: '0 6px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    minWidth: 16,
                                    textAlign: 'center',
                                  }}
                                >
                                  {item.quantity || 1}
                                </span>
                                <button
                                  type="button"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 2,
                                    color: '#7a6a5e',
                                  }}
                                  onClick={() => handleUpdateItemQty(idx, 1)}
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  padding: 3,
                                }}
                                title="Remove from combo"
                                onClick={() => handleRemoveItemFromCombo(idx)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        style={{
                          width: '100%',
                          padding: '7px',
                          borderRadius: 8,
                          border: '1px dashed #d5c8b5',
                          background: '#ffffff',
                          color: '#8c4a23',
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                        onClick={() => setShowAddItemToComboModal(true)}
                      >
                        <Plus size={14} />
                        <span>+ Add Item</span>
                      </button>
                    </div>
                  )}

                  {/* PRICING TAB (EDIT) */}
                  {comboDetailTab === 'pricing' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 10,
                        }}
                      >
                        <div className="owner-field-group">
                          <label className="owner-field-label">
                            Combo Price (₹) <span style={{ color: '#dc2626' }}>*</span>
                          </label>
                          <input
                            type="number"
                            className="owner-form-input"
                            value={editForm.price || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                price: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="owner-field-group">
                          <label className="owner-field-label">
                            Compare Price (Optional)
                          </label>
                          <input
                            type="number"
                            className="owner-form-input"
                            value={editForm.comparePrice || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                comparePrice: e.target.value,
                              }))
                            }
                            placeholder="e.g. 350"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!editForm.isBestseller}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                isBestseller: e.target.checked,
                              }))
                            }
                            style={{ accentColor: '#ea580c' }}
                          />
                          <span>Show as Bestseller</span>
                          {editForm.isBestseller && (
                            <span
                              style={{
                                fontSize: 10,
                                background: '#ea580c',
                                color: '#fff',
                                padding: '1px 5px',
                                borderRadius: 3,
                                fontWeight: 700,
                              }}
                            >
                              Bestseller
                            </span>
                          )}
                        </label>

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!editForm.isPopular}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                isPopular: e.target.checked,
                              }))
                            }
                            style={{ accentColor: '#2563eb' }}
                          />
                          <span>Show as Popular</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* AVAILABILITY TAB (EDIT) */}
                  {comboDetailTab === 'availability' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: '#faf8f5',
                          borderRadius: 8,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          Active for Ordering
                        </span>
                        <label className="owner-toggle-switch">
                          <input
                            type="checkbox"
                            checked={!!editForm.active}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                active: e.target.checked,
                              }))
                            }
                          />
                          <span className="owner-toggle-slider"></span>
                        </label>
                      </div>

                      <p style={{ fontSize: 12, color: '#7a6a5e', margin: 0 }}>
                        Availability Schedule: Everyday during operating hours (11:00 AM – 11:00 PM).
                      </p>
                    </div>
                  )}
                </div>

                {/* Edit Mode Footer */}
                <div className="owner-detail-footer">
                  <button
                    type="button"
                    style={{
                      marginRight: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => setDeleteCandidate(editForm)}
                  >
                    <Trash2 size={13} /> Delete Combo
                  </button>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '6px 14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="owner-btn-primary"
                    onClick={handleSaveDetailChanges}
                    style={{
                      background: '#8c4a23',
                      color: '#fff',
                      fontWeight: 700,
                      padding: '6px 18px',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Combo */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add New Combo Deal
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCombo}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">
                    Combo Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Mega Feast Combo"
                    value={newComboForm.name}
                    onChange={(e) =>
                      setNewComboForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="owner-field-label">Description</label>
                  <textarea
                    className="owner-form-textarea"
                    rows={2}
                    placeholder="Included items summary (e.g. Pizza + Drink)..."
                    value={newComboForm.description}
                    onChange={(e) =>
                      setNewComboForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: 10,
                  }}
                >
                  <div>
                    <label className="owner-field-label">Category</label>
                    <select
                      className="owner-form-select"
                      value={newComboForm.category}
                      onChange={(e) =>
                        setNewComboForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="Burgers">Burgers</option>
                      <option value="Pizzas">Pizzas</option>
                      <option value="Pasta">Pasta</option>
                      <option value="Sandwiches">Sandwiches</option>
                      <option value="Starters">Starters</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="owner-field-label">
                      Price (₹) <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="owner-form-input"
                      placeholder="399"
                      value={newComboForm.price}
                      onChange={(e) =>
                        setNewComboForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newComboForm.isBestseller}
                      onChange={(e) =>
                        setNewComboForm((prev) => ({
                          ...prev,
                          isBestseller: e.target.checked,
                        }))
                      }
                      style={{ accentColor: '#ea580c' }}
                    />
                    <span>Bestseller</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newComboForm.isPopular}
                      onChange={(e) =>
                        setNewComboForm((prev) => ({
                          ...prev,
                          isPopular: e.target.checked,
                        }))
                      }
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Popular</span>
                  </label>
                </div>
              </div>
              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="owner-btn-primary"
                  style={{ background: '#8c4a23' }}
                >
                  Create Combo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Menu Item into Combo */}
      {showAddItemToComboModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                Select Item to Include
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddItemToComboModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <label className="owner-field-label">Choose Menu Item</label>
              <select
                className="owner-form-select"
                value={selectedItemToAdd}
                onChange={(e) => setSelectedItemToAdd(e.target.value)}
              >
                <option value="">-- Choose Item --</option>
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.category}) - ₹{item.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setShowAddItemToComboModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                style={{ background: '#8c4a23' }}
                onClick={handleConfirmAddItem}
                disabled={!selectedItemToAdd}
              >
                Add to Combo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Combo */}
      {deleteCandidate && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#dc2626' }}>
                Delete Combo
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setDeleteCandidate(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <p style={{ margin: 0, fontSize: 13.5, color: '#4a3f35' }}>
                Are you sure you want to delete combo <strong>{deleteCandidate.name}</strong>?
              </p>
            </div>
            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setDeleteCandidate(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                style={{ background: '#dc2626', color: '#fff' }}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
