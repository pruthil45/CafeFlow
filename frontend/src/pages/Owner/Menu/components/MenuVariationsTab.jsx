import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Plus,
  Sliders,
  SlidersHorizontal,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
  Link as LinkIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  Upload,
  GripVertical,
  Sparkles,
} from 'lucide-react'
import '../../Owner.css'

// Helper getter for active status
const getIsActive = (v) =>
  v && (v.active !== undefined ? !!v.active : v.status === 'Active')

export default function MenuVariationsTab({
  variations = [],
  setVariations,
  choices, // fallback alias
  setChoices, // fallback alias
  showToast,
}) {
  const activeList = variations?.length > 0 ? variations : (choices || [])
  const updateList = setVariations || setChoices

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([])

  // Selected Variation Group for detail panel (default to null - NO auto-select!)
  const [activeVariationId, setActiveVariationId] = useState(null)
  const activeVariation = useMemo(() => {
    if (!activeVariationId) return null
    return activeList.find((v) => v.id === activeVariationId) || null
  }, [activeList, activeVariationId])

  // Draft form for editor
  const [editForm, setEditForm] = useState(null)

  // Select row handler
  const handleSelectVariationRow = (variation) => {
    setActiveVariationId(variation.id)
    setEditForm({ ...variation, options: [...(variation.options || [])] })
  }

  // Deselect / close detail panel
  const handleCloseDetail = () => {
    setActiveVariationId(null)
    setEditForm(null)
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveVariationId(null)
        setEditForm(null)
      }
    }
    if (activeVariationId) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVariationId])

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddOptionModal, setShowAddOptionModal] = useState(false)
  const [newOptionForm, setNewOptionForm] = useState({ name: '', price: 0 })
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  // Background scroll lock when variation modal or add modal is open
  useEffect(() => {
    if (activeVariationId || showAddModal || showAddOptionModal || deleteCandidate) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [activeVariationId, showAddModal, showAddOptionModal, deleteCandidate])

  // New Variation Group Form State
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    category: 'General',
    type: 'single',
    minSelect: 1,
    maxSelect: 1,
    active: true,
    options: [
      { id: 'opt-1', name: 'Regular', price: 0 },
      { id: 'opt-2', name: 'Premium', price: 20 },
    ],
  })

  // Statistics calculation
  const totalCount = activeList.length
  const activeCount = activeList.filter((v) => getIsActive(v)).length
  const inactiveCount = totalCount - activeCount
  const usedCount = 42

  // Filtered List
  const filteredVariations = useMemo(() => {
    return activeList.filter((variation) => {
      const matchSearch =
        variation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variation.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        selectedCategory === 'all' ||
        variation.category.toLowerCase() === selectedCategory.toLowerCase()

      const isAct = getIsActive(variation)
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && isAct) ||
        (selectedStatus === 'inactive' && !isAct)

      const variationType = variation.type?.toLowerCase().includes('single')
        ? 'single'
        : 'multi'
      const matchType =
        selectedType === 'all' || variationType === selectedType.toLowerCase()

      return matchSearch && matchCategory && matchStatus && matchType
    })
  }, [activeList, searchQuery, selectedCategory, selectedStatus, selectedType])

  // Pagination
  const totalPages = Math.ceil(filteredVariations.length / itemsPerPage) || 1
  const paginatedVariations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredVariations.slice(start, start + itemsPerPage)
  }, [filteredVariations, currentPage, itemsPerPage])

  // Toggle Single Row Active Status
  const handleToggleStatus = (e, variationId) => {
    e.stopPropagation()
    updateList?.((prev) =>
      prev.map((v) => {
        if (v.id === variationId) {
          const currentlyActive = getIsActive(v)
          const nextActive = !currentlyActive
          const updated = {
            ...v,
            active: nextActive,
            status: nextActive ? 'Active' : 'Inactive',
          }
          if (activeVariationId === variationId && editForm) {
            setEditForm((f) => ({ ...f, active: updated.active, status: updated.status }))
          }
          return updated
        }
        return v
      })
    )
    showToast?.('Variation status updated', 'success')
  }

  // Save changes from Detail Panel
  const handleSaveDetailChanges = () => {
    if (!editForm?.name?.trim()) {
      showToast?.('Variation group name is required', 'error')
      return
    }

    updateList?.((prev) =>
      prev.map((v) => (v.id === editForm.id ? { ...editForm } : v))
    )
    showToast?.(`Saved changes for "${editForm.name}"`, 'success')
  }

  // Delete option from active variation in editor
  const handleDeleteOption = (optId) => {
    setEditForm((prev) => ({
      ...prev,
      options: prev.options.filter((o) => o.id !== optId),
    }))
  }

  // Add Option to active variation
  const handleAddOptionSubmit = (e) => {
    e.preventDefault()
    if (!newOptionForm.name.trim()) return
    const newOpt = {
      id: `opt-${Date.now()}`,
      name: newOptionForm.name.trim(),
      price: parseFloat(newOptionForm.price) || 0,
      image: editForm?.image || newGroupForm.image,
    }
    setEditForm((prev) => ({
      ...prev,
      options: [...(prev.options || []), newOpt],
    }))
    setNewOptionForm({ name: '', price: 0 })
    setShowAddOptionModal(false)
    showToast?.(`Option "${newOpt.name}" added`, 'success')
  }

  // Submit New Variation Group
  const handleCreateVariationGroup = (e) => {
    e.preventDefault()
    if (!newGroupForm.name.trim()) {
      showToast?.('Please enter variation group name', 'error')
      return
    }

    const created = {
      id: `var-${Date.now()}`,
      name: newGroupForm.name.trim(),
      description: newGroupForm.description.trim(),
      category: newGroupForm.category,
      type: newGroupForm.type,
      minSelect: parseInt(newGroupForm.minSelect, 10) || 1,
      maxSelect: parseInt(newGroupForm.maxSelect, 10) || 1,
      active: newGroupForm.active,
      usedInCount: 0,
      image: newGroupForm.image,
      options: newGroupForm.options,
    }

    updateList?.((prev) => [created, ...prev])
    setActiveVariationId(created.id)
    setEditForm(created)
    setShowAddModal(false)
    setNewGroupForm({
      name: '',
      description: '',
      category: 'General',
      type: 'single',
      minSelect: 1,
      maxSelect: 1,
      active: true,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
      options: [
        { id: 'opt-1', name: 'Regular', price: 0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80' },
      ],
    })
    showToast?.(`Created variation group "${created.name}"`, 'success')
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return
    updateList?.((prev) => prev.filter((v) => v.id !== deleteCandidate.id))
    if (activeVariationId === deleteCandidate.id) {
      handleCloseDetail()
    }
    showToast?.(`Deleted variation group "${deleteCandidate.name}"`, 'success')
    setDeleteCandidate(null)
  }

  // Select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedVariations.map((v) => v.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleRowSelect = (e, id) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="owner-variations-page animate-fade-in">
      {/* 4 Statistics KPI Cards */}
      <div className="owner-kpi-stats-grid" style={{ marginBottom: 18 }}>
        {/* Card 1: Total Variation Groups */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#f3e8ff', color: '#9333ea' }}
          >
            <Sliders size={22} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{totalCount}</div>
            <div className="owner-kpi-stat-lbl">Total Variations</div>
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

        {/* Card 4: Used in Menu Items */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <LinkIcon size={20} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{usedCount}</div>
            <div className="owner-kpi-stat-lbl">Linked to Items</div>
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
        {/* Search */}
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
            placeholder="Search variations..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            style={{ paddingLeft: 32 }}
          />
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
            <option value="Breads">Breads</option>
            <option value="General">General</option>
            <option value="Sauces">Sauces</option>
            <option value="Cheese">Cheese</option>
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

        {/* Type Filter */}
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
            <option value="single">Single Select</option>
            <option value="multi">Multi Select</option>
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

        {/* Add Variation Group button */}
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
          <span>Add Variation</span>
        </button>
      </div>

      {/* Main 2-Column Split: Table (Left) + Detail Panel (Right) */}
      <div className="owner-variations-workspace">
        {/* Left Column: Data Table Card */}
        <div className="owner-table-wrapper-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="owner-module-data-table">
              <thead>
                <tr>
                  <th style={{ width: 32, paddingLeft: 12 }}>
                    <input
                      type="checkbox"
                      checked={
                        paginatedVariations.length > 0 &&
                        selectedIds.length === paginatedVariations.length
                      }
                      onChange={handleSelectAll}
                      style={{ accentColor: '#8c4a23' }}
                    />
                  </th>
                  <th style={{ width: 44 }}>#</th>
                  <th>Variation Group</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Options</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 14 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVariations.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 36, color: '#8c7b6f' }}>
                      No variations match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedVariations.map((variation, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1
                    const isSelectedRow = activeVariationId === variation.id
                    const isChecked = selectedIds.includes(variation.id)

                    return (
                      <tr
                        key={variation.id}
                        className={isSelectedRow ? 'selected' : ''}
                        onClick={() => handleSelectVariationRow(variation)}
                      >
                        <td
                          style={{ paddingLeft: 12 }}
                          onClick={(e) => handleToggleRowSelect(e, variation.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ accentColor: '#8c4a23' }}
                          />
                        </td>
                        <td style={{ color: '#9c8e82', fontWeight: 600 }}>
                          #{rowNumber}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--owner-espresso)' }}>
                          {variation.name}
                        </td>
                        <td style={{ color: '#6b5d52' }}>{variation.category}</td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background:
                                variation.type === 'single' ? '#e0f2fe' : '#ede9fe',
                              color:
                                variation.type?.toLowerCase().includes('single') ? '#0369a1' : '#7c3aed',
                            }}
                          >
                            {variation.type?.toLowerCase().includes('single')
                              ? 'Single Select'
                              : 'Multi Select'}
                          </span>
                        </td>
                        <td style={{ color: '#7a6a5e', fontSize: 12.5 }}>
                          {variation.optionsCount || (variation.options ? `${variation.options.length} options` : '0 options')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: getIsActive(variation) ? '#15803d' : '#9ca3af',
                                background: getIsActive(variation) ? '#dcfce7' : '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              {getIsActive(variation) ? 'Active' : 'Inactive'}
                            </span>
                            <label
                              className="owner-toggle-switch"
                              style={{ transform: 'scale(0.85)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={getIsActive(variation)}
                                onChange={(e) => handleToggleStatus(e, variation.id)}
                              />
                              <span className="owner-toggle-slider"></span>
                            </label>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: 14 }}>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="owner-table-action-btn"
                              title="Edit Variation"
                              onClick={() => handleSelectVariationRow(variation)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="owner-table-action-btn delete"
                              title="Delete Variation"
                              onClick={() => setDeleteCandidate(variation)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #f0eae1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#faf8f5',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12.5, color: '#7a6a5e' }}>
              Showing {filteredVariations.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredVariations.length)} of{' '}
              {filteredVariations.length} variations
            </div>

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

      {/* Centered Variation Details Modal with Blurred Background */}
      {activeVariation && editForm && (
        <div
          className="owner-modal-overlay"
          onClick={handleCloseDetail}
          aria-label="Variation details modal backdrop"
        >
          <div
            className="owner-item-detail-modal"
            style={{ maxWidth: 620 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Variation Details Modal"
          >
            <div
              style={{
                padding: '14px 16px',
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
                  Variation Details
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

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Group Name */}
              <div className="owner-field-group">
                <label className="owner-field-label">
                  Variation Group Name <span style={{ color: '#dc2626' }}>*</span>
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

              {/* Description */}
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

              {/* Category */}
              <div className="owner-field-group">
                <label className="owner-field-label">Category</label>
                <select
                  className="owner-form-select"
                  value={editForm.category || 'General'}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="Breads">Breads</option>
                  <option value="General">General</option>
                  <option value="Sauces">Sauces</option>
                  <option value="Cheese">Cheese</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>

              {/* Selection Type: Single Select / Multi Select */}
              <div className="owner-field-group">
                <label className="owner-field-label">Selection Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                      type="radio"
                      name="variationType"
                      checked={editForm.type === 'single'}
                      onChange={() =>
                        setEditForm((prev) => ({ ...prev, type: 'single' }))
                      }
                      style={{ accentColor: '#8c4a23' }}
                    />
                    <div>
                      <span style={{ fontWeight: 600 }}>Single Select</span>
                      <span style={{ fontSize: 11, color: '#8c7b6f', display: 'block' }}>
                        Customer can select only one option (e.g. Size, Crust)
                      </span>
                    </div>
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
                      type="radio"
                      name="variationType"
                      checked={editForm.type === 'multi'}
                      onChange={() =>
                        setEditForm((prev) => ({ ...prev, type: 'multi' }))
                      }
                      style={{ accentColor: '#8c4a23' }}
                    />
                    <div>
                      <span style={{ fontWeight: 600 }}>Multi Select</span>
                      <span style={{ fontSize: 11, color: '#8c7b6f', display: 'block' }}>
                        Customer can select multiple options (e.g. Sauces, Toppings)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Min & Max Selection (If Multi Select) */}
              {editForm.type === 'multi' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                  }}
                >
                  <div className="owner-field-group">
                    <label className="owner-field-label">Min Selection</label>
                    <input
                      type="number"
                      className="owner-form-input"
                      value={editForm.minSelect || 1}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          minSelect: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="owner-field-group">
                    <label className="owner-field-label">Max Selection</label>
                    <input
                      type="number"
                      className="owner-form-input"
                      value={editForm.maxSelect || 3}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          maxSelect: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* Active Toggle */}
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
                <span style={{ fontSize: 13, fontWeight: 600 }}>Active Status</span>
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

              {/* Options Section */}
              <div className="owner-field-group">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <label className="owner-field-label" style={{ margin: 0 }}>
                    Options ({editForm.options?.length || 0})
                  </label>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    maxHeight: 200,
                    overflowY: 'auto',
                  }}
                >
                  {editForm.options?.map((opt) => (
                    <div
                      key={opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid #ebdccb',
                        background: '#faf8f5',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <GripVertical size={13} color="#b5a798" />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#33271e' }}>
                            {opt.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#8c4a23', fontWeight: 600 }}>
                            {opt.price > 0 ? `+ ₹${opt.price}` : '₹ 0'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            cursor: 'pointer',
                            padding: 2,
                          }}
                          title="Delete option"
                          onClick={() => handleDeleteOption(opt.id)}
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
                    marginTop: 8,
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
                  onClick={() => setShowAddOptionModal(true)}
                >
                  <Plus size={14} />
                  <span>+ Add Option</span>
                </button>
              </div>
            </div>

            {/* Panel Footer */}
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
        </div>
      )}

      {/* Modal: Add New Variation Group */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add Variation Group
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateVariationGroup}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">
                    Variation Group Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Size, Milk Type, Spice Level"
                    value={newGroupForm.name}
                    onChange={(e) =>
                      setNewGroupForm((prev) => ({
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
                    placeholder="Helper instructions for customer..."
                    value={newGroupForm.description}
                    onChange={(e) =>
                      setNewGroupForm((prev) => ({
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
                      value={newGroupForm.category}
                      onChange={(e) =>
                        setNewGroupForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="Breads">Breads</option>
                      <option value="General">General</option>
                      <option value="Sauces">Sauces</option>
                      <option value="Cheese">Cheese</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="owner-field-label">Type</label>
                    <select
                      className="owner-form-select"
                      value={newGroupForm.type}
                      onChange={(e) =>
                        setNewGroupForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="single">Single Select</option>
                      <option value="multi">Multi Select</option>
                    </select>
                  </div>
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
                  style={{ background: '#8c4a23', color: '#fff', fontWeight: 700 }}
                >
                  Create Variation Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Option */}
      {showAddOptionModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add Option to {editForm?.name}
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddOptionModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddOptionSubmit}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">
                    Option Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Extra Shot, Almond Milk"
                    value={newOptionForm.name}
                    onChange={(e) =>
                      setNewOptionForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="owner-field-label">Upcharge Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="owner-form-input"
                    placeholder="0"
                    value={newOptionForm.price}
                    onChange={(e) =>
                      setNewOptionForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                  <span style={{ fontSize: 11, color: '#8c7b6f', marginTop: 4, display: 'block' }}>
                    Enter 0 for free option.
                  </span>
                </div>
              </div>
              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setShowAddOptionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="owner-btn-primary"
                  style={{ background: '#8c4a23', color: '#fff', fontWeight: 700 }}
                >
                  Add Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 380, textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px 20px' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                }}
              >
                <Trash2 size={24} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 17, fontWeight: 800 }}>
                Delete Variation Group?
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#7a6a5e' }}>
                Are you sure you want to delete <strong>{deleteCandidate.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="owner-modal-footer" style={{ justifyContent: 'center' }}>
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
                style={{ background: '#dc2626', color: '#fff', fontWeight: 700 }}
                onClick={handleConfirmDelete}
              >
                Delete Variation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
