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
  Link as LinkIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
} from 'lucide-react'
import '../../Owner.css'

// Helper getters for robust property support
const getIsActive = (a) =>
  a && (a.active !== undefined ? !!a.active : a.status === 'Active')
const getUsedCount = (a) =>
  a && (a.usedInCount !== undefined
    ? a.usedInCount
    : parseInt(a.usedIn, 10) || (a.usedIn?.includes('items') ? parseInt(a.usedIn) : 0))

export default function MenuAddonsTab({
  addons = [],
  setAddons,
  showToast,
}) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedUsage, setSelectedUsage] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([])

  // Right Detail Panel Selection (default to null - NO auto-select!)
  const [activeAddonId, setActiveAddonId] = useState(null)
  const activeAddon = useMemo(() => {
    if (!activeAddonId) return null
    return addons.find((a) => a.id === activeAddonId) || null
  }, [addons, activeAddonId])

  // Draft form for the right panel editor
  const [editForm, setEditForm] = useState(null)

  // When active addon changes, update editForm
  const handleSelectAddonRow = (addon) => {
    setActiveAddonId(addon.id)
    setEditForm({ ...addon })
  }

  // Close detail panel
  const handleCloseDetail = () => {
    setActiveAddonId(null)
    setEditForm(null)
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveAddonId(null)
        setEditForm(null)
      }
    }
    if (activeAddonId) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeAddonId])

  // Create Modal State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAddonForm, setNewAddonForm] = useState({
    name: '',
    description: '',
    category: 'Cheese',
    price: '',
    type: 'single',
    active: true,
    sku: '',
    displayOrder: 1,
  })

  // Delete Confirmation Modal
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  // Background scroll lock when addon modal or add modal is open
  useEffect(() => {
    if (activeAddonId || showAddModal || deleteCandidate) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [activeAddonId, showAddModal, deleteCandidate])

  // Statistics calculation
  const totalCount = addons.length
  const activeCount = addons.filter((a) => getIsActive(a)).length
  const inactiveCount = totalCount - activeCount
  const usedCount = addons.filter((a) => getUsedCount(a) > 0).length

  // Filtered List
  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      const matchSearch =
        addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addon.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (addon.sku && addon.sku.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchCategory =
        selectedCategory === 'all' ||
        addon.category.toLowerCase() === selectedCategory.toLowerCase()

      const isAct = getIsActive(addon)
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && isAct) ||
        (selectedStatus === 'inactive' && !isAct)

      const uCount = getUsedCount(addon)
      const matchUsage =
        selectedUsage === 'all' ||
        (selectedUsage === 'used' && uCount > 0) ||
        (selectedUsage === 'unused' && uCount === 0)

      return matchSearch && matchCategory && matchStatus && matchUsage
    })
  }, [addons, searchQuery, selectedCategory, selectedStatus, selectedUsage])

  // Pagination
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage) || 1
  const paginatedAddons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredAddons.slice(start, start + itemsPerPage)
  }, [filteredAddons, currentPage, itemsPerPage])

  // Toggle Single Row Active Status
  const handleToggleStatus = (e, addonId) => {
    e.stopPropagation()
    setAddons((prev) =>
      prev.map((a) => {
        if (a.id === addonId) {
          const currentlyActive = getIsActive(a)
          const nextActive = !currentlyActive
          const updated = {
            ...a,
            active: nextActive,
            status: nextActive ? 'Active' : 'Inactive',
          }
          if (activeAddonId === addonId) {
            setEditForm(updated)
          }
          return updated
        }
        return a
      })
    )
    showToast?.('Add-on status updated', 'success')
  }

  // Save changes from Right Detail Panel
  const handleSaveDetailChanges = () => {
    if (!editForm.name?.trim()) {
      showToast?.('Add-on name is required', 'error')
      return
    }
    if (!editForm.price || isNaN(editForm.price)) {
      showToast?.('Valid price is required', 'error')
      return
    }

    setAddons((prev) =>
      prev.map((a) =>
        a.id === editForm.id
          ? {
              ...editForm,
              price: parseFloat(editForm.price),
              displayOrder: parseInt(editForm.displayOrder, 10) || 1,
            }
          : a
      )
    )
    showToast?.(`Saved changes for ${editForm.name}`, 'success')
  }

  // Submit New Add-on from Modal
  const handleCreateAddon = (e) => {
    e.preventDefault()
    if (!newAddonForm.name.trim() || !newAddonForm.price) {
      showToast?.('Please fill required fields', 'error')
      return
    }

    const created = {
      id: `addon-${Date.now()}`,
      name: newAddonForm.name.trim(),
      description: newAddonForm.description.trim(),
      category: newAddonForm.category,
      price: parseFloat(newAddonForm.price),
      type: newAddonForm.type,
      usedInCount: 0,
      active: newAddonForm.active,
      sku: newAddonForm.sku || `ADD-${newAddonForm.category.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      displayOrder: parseInt(newAddonForm.displayOrder, 10) || 1,
      image: newAddonForm.image,
    }

    setAddons((prev) => [created, ...prev])
    setActiveAddonId(created.id)
    setEditForm(created)
    setShowAddModal(false)
    setNewAddonForm({
      name: '',
      description: '',
      category: 'Cheese',
      price: '',
      type: 'single',
      active: true,
      sku: '',
      displayOrder: 1,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=200&auto=format&fit=crop&q=80',
    })
    showToast?.(`Added "${created.name}" successfully`, 'success')
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return
    setAddons((prev) => prev.filter((a) => a.id !== deleteCandidate.id))
    if (activeAddonId === deleteCandidate.id) {
      handleCloseDetail()
    }
    showToast?.(`Deleted "${deleteCandidate.name}"`, 'success')
    setDeleteCandidate(null)
  }

  // Select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedAddons.map((a) => a.id))
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
    <div className="owner-addons-page animate-fade-in">
      {/* 4 Statistics KPI Cards */}
      <div className="owner-kpi-stats-grid" style={{ marginBottom: 18 }}>
        {/* Card 1: Total Add-ons */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#f3e8ff', color: '#9333ea' }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{totalCount}</div>
            <div className="owner-kpi-stat-lbl">Total Add-ons</div>
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

        {/* Card 4: Used in Items */}
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <LinkIcon size={20} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{usedCount}</div>
            <div className="owner-kpi-stat-lbl">Used in Items</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search add-ons..."
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
            <option value="Cheese">Cheese</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Meat">Meat</option>
            <option value="Egg">Egg</option>
            <option value="Sauces">Sauces</option>
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

        {/* Usage Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#7a6a5e', fontWeight: 600 }}>
            Usage:
          </span>
          <select
            className="owner-form-select"
            value={selectedUsage}
            onChange={(e) => {
              setSelectedUsage(e.target.value)
              setCurrentPage(1)
            }}
            style={{ minWidth: 110 }}
          >
            <option value="all">All Usage</option>
            <option value="used">Used in Items</option>
            <option value="unused">Unused</option>
          </select>
        </div>

        {/* More Filters button */}
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
            setSelectedUsage('all')
            setCurrentPage(1)
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Reset Filters</span>
        </button>

        {/* Add Add-on button */}
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
          <span>Add Add-on</span>
        </button>
      </div>

      {/* Main 2-Column Split: Table (Left) + Detail Panel (Right) */}
      <div className="owner-addons-workspace">
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
                        paginatedAddons.length > 0 &&
                        selectedIds.length === paginatedAddons.length
                      }
                      onChange={handleSelectAll}
                      style={{ accentColor: '#8c4a23' }}
                    />
                  </th>
                  <th style={{ width: 44 }}>#</th>
                  <th>Add-on Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Type</th>
                  <th>Used In</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: 14 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAddons.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 36, color: '#8c7b6f' }}>
                      No add-on items match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedAddons.map((addon, idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1
                    const isSelectedRow = activeAddonId === addon.id
                    const isChecked = selectedIds.includes(addon.id)

                    return (
                      <tr
                        key={addon.id}
                        className={isSelectedRow ? 'selected' : ''}
                        onClick={() => handleSelectAddonRow(addon)}
                      >
                        <td
                          style={{ paddingLeft: 12 }}
                          onClick={(e) => handleToggleRowSelect(e, addon.id)}
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
                          {addon.name}
                        </td>
                        <td style={{ color: '#6b5d52' }}>{addon.category}</td>
                        <td style={{ fontWeight: 700, color: '#8c4a23' }}>
                          ₹{addon.price}
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11.5,
                              fontWeight: 600,
                              background: '#e0f2fe',
                              color: '#0284c7',
                            }}
                          >
                            {addon.type?.toLowerCase() === 'single' ? 'Single' : 'Multi'}
                          </span>
                        </td>
                        <td style={{ color: '#7a6a5e', fontSize: 12 }}>
                          {addon.usedIn || (addon.usedInCount ? `${addon.usedInCount} items` : '0 items')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: getIsActive(addon) ? '#15803d' : '#9ca3af',
                                background: getIsActive(addon) ? '#dcfce7' : '#f3f4f6',
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              {getIsActive(addon) ? 'Active' : 'Inactive'}
                            </span>
                            <label
                              className="owner-toggle-switch"
                              style={{ transform: 'scale(0.85)' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={getIsActive(addon)}
                                onChange={(e) => handleToggleStatus(e, addon.id)}
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
                              gap: 6,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="owner-table-action-btn"
                              title="Edit Details"
                              onClick={() => handleSelectAddonRow(addon)}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="owner-table-action-btn delete"
                              title="Delete Add-on"
                              onClick={() => setDeleteCandidate(addon)}
                            >
                              <Trash2 size={13} />
                            </button>
                            <button
                              type="button"
                              className="owner-table-action-btn"
                              title="More"
                            >
                              <MoreVertical size={13} />
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
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredAddons.length)} of{' '}
              {filteredAddons.length} add-ons
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

      {/* Centered Add-on Details Modal with Blurred Background */}
      {activeAddon && editForm && (
        <div
          className="owner-modal-overlay"
          onClick={handleCloseDetail}
          aria-label="Add-on details modal backdrop"
        >
          <div
            className="owner-item-detail-modal"
            style={{ maxWidth: 580 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Add-on Details Modal"
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
                  Add-on Details
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
              {/* Name */}
              <div className="owner-field-group">
                <label className="owner-field-label">
                  Name <span style={{ color: '#dc2626' }}>*</span>
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

              {/* Category & Price Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: 10,
                }}
              >
                <div className="owner-field-group">
                  <label className="owner-field-label">
                    Category <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    className="owner-form-select"
                    value={editForm.category || 'Cheese'}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="Cheese">Cheese</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Meat">Meat</option>
                    <option value="Egg">Egg</option>
                    <option value="Sauces">Sauces</option>
                  </select>
                </div>

                <div className="owner-field-group">
                  <label className="owner-field-label">
                    Price (₹) <span style={{ color: '#dc2626' }}>*</span>
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
              </div>

              {/* Type Radio: Single vs Multi-Select */}
              <div className="owner-field-group">
                <label className="owner-field-label">Type</label>
                <div style={{ display: 'flex', gap: 16 }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="addonType"
                      checked={editForm.type === 'single'}
                      onChange={() =>
                        setEditForm((prev) => ({ ...prev, type: 'single' }))
                      }
                      style={{ accentColor: '#8c4a23' }}
                    />
                    <span>Single</span>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="addonType"
                      checked={editForm.type === 'multi'}
                      onChange={() =>
                        setEditForm((prev) => ({ ...prev, type: 'multi' }))
                      }
                      style={{ accentColor: '#8c4a23' }}
                    />
                    <span>Multi-Select</span>
                  </label>
                </div>
              </div>

              {/* Availability (Active toggle) */}
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
                  Availability
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: editForm.active ? '#10b981' : '#9ca3af',
                    }}
                  >
                    Active
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
              </div>

              {/* Used In with link */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12.5,
                  padding: '4px 0',
                }}
              >
                <span style={{ color: '#7a6a5e' }}>Used In</span>
                <div>
                  <span style={{ fontWeight: 700, marginRight: 6 }}>
                    {editForm.usedInCount || 0} menu items
                  </span>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8c4a23',
                      textDecoration: 'underline',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    onClick={() =>
                      showToast?.(
                        `Used in: Classic Burger, Cheese Burger, Double Patty, etc.`,
                        'info'
                      )
                    }
                  >
                    View items
                  </button>
                </div>
              </div>

              {/* SKU & Display Order */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr',
                  gap: 10,
                }}
              >
                <div className="owner-field-group">
                  <label className="owner-field-label">SKU (Optional)</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    value={editForm.sku || ''}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    placeholder="ADD-CH-001"
                  />
                </div>

                <div className="owner-field-group">
                  <label className="owner-field-label">Display Order</label>
                  <input
                    type="number"
                    className="owner-form-input"
                    value={editForm.displayOrder || 1}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        displayOrder: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Bottom Panel Actions */}
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

      {/* Modal: Add New Add-on */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add New Add-on
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAddon}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">
                    Add-on Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Garlic Mayo, Truffle Glaze"
                    value={newAddonForm.name}
                    onChange={(e) =>
                      setNewAddonForm((prev) => ({
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
                    placeholder="Taste notes, quantity..."
                    value={newAddonForm.description}
                    onChange={(e) =>
                      setNewAddonForm((prev) => ({
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
                    <label className="owner-field-label">
                      Category <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      className="owner-form-select"
                      value={newAddonForm.category}
                      onChange={(e) =>
                        setNewAddonForm((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="Cheese">Cheese</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Meat">Meat</option>
                      <option value="Egg">Egg</option>
                      <option value="Sauces">Sauces</option>
                    </select>
                  </div>
                  <div>
                    <label className="owner-field-label">
                      Price (₹) <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="number"
                      className="owner-form-input"
                      placeholder="30"
                      value={newAddonForm.price}
                      onChange={(e) =>
                        setNewAddonForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="owner-field-label">Type</label>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="newAddonType"
                        checked={newAddonForm.type === 'single'}
                        onChange={() =>
                          setNewAddonForm((prev) => ({
                            ...prev,
                            type: 'single',
                          }))
                        }
                        style={{ accentColor: '#8c4a23' }}
                      />
                      <span>Single Select</span>
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="newAddonType"
                        checked={newAddonForm.type === 'multi'}
                        onChange={() =>
                          setNewAddonForm((prev) => ({
                            ...prev,
                            type: 'multi',
                          }))
                        }
                        style={{ accentColor: '#8c4a23' }}
                      />
                      <span>Multi Select</span>
                    </label>
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
                  style={{ background: '#8c4a23' }}
                >
                  Create Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Add-on */}
      {deleteCandidate && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#dc2626' }}>
                Delete Add-on
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setDeleteCandidate(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <p style={{ margin: '0 0 10px 0', fontSize: 13.5, color: '#4a3f35' }}>
                Are you sure you want to delete <strong>{deleteCandidate.name}</strong>?
              </p>
              {deleteCandidate.usedInCount > 0 && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: '#dc2626',
                    background: '#fef2f2',
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  Warning: This add-on is currently attached to{' '}
                  {deleteCandidate.usedInCount} menu items.
                </p>
              )}
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
