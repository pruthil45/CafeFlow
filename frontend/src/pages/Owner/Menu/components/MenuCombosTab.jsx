import { useState, useMemo } from 'react'
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

  // Draft form for right panel editor
  const [editForm, setEditForm] = useState(null)

  // Sync draft form when selected combo changes
  const handleSelectCombo = (combo) => {
    setActiveComboId(combo.id)
    setEditForm({
      ...combo,
      active: getIsActive(combo),
      isBestseller: getIsBestseller(combo),
      isPopular: getIsPopular(combo),
      items: [...(combo.items || [])],
    })
    setComboDetailTab('general')
  }

  // Close detail panel
  const handleCloseDetail = () => {
    setActiveComboId(null)
    setEditForm(null)
  }

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddItemToComboModal, setShowAddItemToComboModal] = useState(false)
  const [selectedItemToAdd, setSelectedItemToAdd] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)

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

    setCombos((prev) =>
      prev.map((c) =>
        c.id === editForm.id
          ? {
              ...editForm,
              price: parseFloat(editForm.price),
              comparePrice: editForm.comparePrice
                ? parseFloat(editForm.comparePrice)
                : null,
            }
          : c
      )
    )
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

        {/* Right Column: Empty Placeholder when nothing selected (Desktop only) */}
        {!activeCombo && (
          <div className="owner-detail-empty-placeholder">
            <div className="owner-detail-empty-icon">
              <Package size={24} />
            </div>
            <h4 className="owner-detail-empty-title">No Combo Selected</h4>
            <p className="owner-detail-empty-text">
              Click any combo card to preview bundled items, edit pricing and savings, or manage availability.
            </p>
          </div>
        )}

        {/* Backdrop for mobile drawer */}
        {activeCombo && editForm && (
          <div
            className="owner-detail-drawer-backdrop"
            onClick={handleCloseDetail}
            aria-hidden="true"
          />
        )}

        {/* Right Column / Mobile Drawer: Combo Detail Panel */}
        {activeCombo && editForm && (
          <div
            className="owner-detail-panel-card owner-detail-panel-drawer"
            style={{
              background: '#ffffff',
              border: '1px solid var(--owner-card-border)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid #f0eae1',
                background: '#faf8f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: 'var(--owner-espresso)',
                    margin: 0,
                  }}
                >
                  {editForm.name || 'Combo Details'}
                </h2>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: editForm.active ? '#15803d' : '#8c7b6f',
                    background: editForm.active ? '#dcfce7' : '#f0eae1',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {editForm.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCloseDetail}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7a6a5e',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 6,
                }}
                title="Close panel"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Combo Hero Image */}
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
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  borderBottom: '1px solid #f0eae1',
                  paddingBottom: 4,
                }}
              >
                {['general', 'items', 'pricing', 'availability'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: comboDetailTab === tab ? 700 : 500,
                      color:
                        comboDetailTab === tab ? '#8c4a23' : '#7a6a5e',
                      borderBottom:
                        comboDetailTab === tab
                          ? '2px solid #8c4a23'
                          : '2px solid transparent',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                    onClick={() => setComboDetailTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* GENERAL TAB */}
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

              {/* ITEMS TAB */}
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

              {/* PRICING TAB */}
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

              {/* AVAILABILITY TAB */}
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

            {/* Detail Footer */}
            <div className="owner-detail-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={handleCloseDetail}
                style={{ padding: '6px 14px' }}
              >
                Close
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
