import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  LayoutGrid,
  List,
  MoreVertical,
  Edit2,
  Check,
  X,
  Eye,
  Flame,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'
import '../../Owner.css'

export default function MenuItemsTab({
  categories,
  items,
  setItems,
  onOpenAddItem,
  showToast,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [filterDietary, setFilterDietary] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const itemsPerPage = 12

  // Selected item for detail modal (default to null - NO auto-select!)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [detailTab, setDetailTab] = useState('general') // 'general', 'variants', 'addons', 'nutrition'
  const [isEditing, setIsEditing] = useState(false)
  const [activeHeroImg, setActiveHeroImg] = useState(null)

  // Edit draft for the selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null
    return items.find((i) => i.id === selectedItemId) || null
  }, [items, selectedItemId])

  const [editForm, setEditForm] = useState(null)

  // Sync edit form when selected item changes (Defaults to READ-ONLY View Mode)
  const handleSelectItem = (item) => {
    setSelectedItemId(item.id)
    setEditForm({ ...item })
    setIsEditing(false)
    setDetailTab('general')
    setActiveHeroImg(item.image)
  }

  // Close detail modal
  const handleCloseDetail = () => {
    setSelectedItemId(null)
    setEditForm(null)
    setIsEditing(false)
    setActiveHeroImg(null)
  }

  // Background Scroll Lock when modal is open
  useEffect(() => {
    if (selectedItemId) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [selectedItemId])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedItemId(null)
        setEditForm(null)
        setIsEditing(false)
        setActiveHeroImg(null)
      }
    }
    if (selectedItemId) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItemId])

  // Count active filter pills
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterAvailability !== 'all') count++
    if (filterDietary !== 'all') count++
    return count
  }, [filterAvailability, filterDietary])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterAvailability !== 'all' ||
    filterDietary !== 'all' ||
    selectedCategory !== 'all'

  // Toggle active status of an item
  const handleToggleItemStatus = (e, itemId) => {
    e.stopPropagation()
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, active: !it.active } : it))
    )
    if (editForm && editForm.id === itemId) {
      setEditForm((prev) => ({ ...prev, active: !prev.active }))
    }
    showToast('Menu item status updated!')
  }

  // Save changes to selected item
  const handleSaveChanges = (e) => {
    e.preventDefault()
    if (!editForm) return
    setItems((prev) =>
      prev.map((it) => (it.id === editForm.id ? { ...editForm } : it))
    )
    showToast(`Saved changes for ${editForm.name}!`)
  }

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find((c) => c.slug === selectedCategory)
        if (catObj && item.category.toLowerCase() !== catObj.name.toLowerCase()) {
          return false
        }
      }

      // Availability filter
      if (filterAvailability === 'active' && !item.active) return false
      if (filterAvailability === 'inactive' && item.active) return false

      // Dietary filter
      if (filterDietary !== 'all' && item.itemType !== filterDietary) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        const matchCat = item.category?.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchCat) return false
      }

      return true
    })
  }, [items, categories, selectedCategory, filterAvailability, filterDietary, searchQuery])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(start, start + itemsPerPage)
  }, [filteredItems, currentPage, itemsPerPage])

  // Import/Export Modal state
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Mobile Category Pills (Horizontal scroll on <= 768px screens) */}
      <div className="owner-mobile-cat-pills">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`owner-mobile-cat-pill ${
              selectedCategory === cat.slug ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedCategory(cat.slug)
              setCurrentPage(1)
            }}
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt=""
                style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }}
              />
            ) : (
              <LayoutGrid size={13} />
            )}
            <span>{cat.name}</span>
            <span className="owner-cat-pill-count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* 2-Part Layout: Left Sticky Categories Panel | Right Items Grid */}
      <div className="owner-menu-workspace">
        {/* LEFT: Categories Panel (Sticky & showing category images) */}
        <div className="owner-categories-panel">
          <div className="owner-categories-panel-header">
            <h3 className="owner-categories-panel-title">Categories</h3>
            <button
              type="button"
              className="owner-categories-add-btn"
              title="Add Category"
              onClick={() => showToast('Open Categories tab to add new category')}
            >
              <Plus size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`owner-category-item-btn ${
                  selectedCategory === cat.slug ? 'active' : ''
                }`}
                onClick={() => {
                  setSelectedCategory(cat.slug)
                  setCurrentPage(1)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="owner-cat-mini-thumb"
                    />
                  ) : (
                    <div className="owner-cat-mini-placeholder">
                      <LayoutGrid size={13} />
                    </div>
                  )}
                  <span className="owner-cat-name-truncate">{cat.name}</span>
                </div>
                <span className="owner-category-count-badge">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Menu Items Workspace */}
        <div className="owner-menu-items-area">
          {/* Filters Bar */}
          <div className="owner-menu-filter-bar">
            {/* Primary Row: Search input + Mobile Filter Toggle Button + View Mode Toggles */}
            <div className="owner-menu-filter-primary-row">
              <div className="owner-menu-search-input-wrap">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  aria-label="Search menu items"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="owner-search-clear-btn"
                    onClick={() => {
                      setSearchQuery('')
                      setCurrentPage(1)
                    }}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                className={`owner-filter-toggle-btn ${showMobileFilters ? 'active' : ''}`}
                onClick={() => setShowMobileFilters((prev) => !prev)}
                title="Toggle filter options"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="owner-filter-count-badge">{activeFilterCount}</span>
                )}
              </button>

              {/* Grid / List View Toggles */}
              <div className="owner-menu-view-toggles">
                <button
                  type="button"
                  className={`owner-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`owner-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Secondary Filters: Always visible on Desktop, collapsible on Mobile */}
            <div className={`owner-menu-filter-secondary-row ${showMobileFilters ? 'is-open' : ''}`}>
              <select
                className="owner-menu-select"
                value={filterAvailability}
                onChange={(e) => {
                  setFilterAvailability(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by availability"
              >
                <option value="all">Availability: All</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                className="owner-menu-select"
                value={filterDietary}
                onChange={(e) => {
                  setFilterDietary(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by dietary type"
              >
                <option value="all">Veg/Non-Veg: All</option>
                <option value="veg">Pure Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="egg">Contains Egg</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="owner-btn-secondary owner-filter-reset-btn"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterAvailability('all')
                    setFilterDietary('all')
                    setSelectedCategory('all')
                    setCurrentPage(1)
                  }}
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>



          {/* Items Display: Grid or List */}
          {viewMode === 'grid' ? (
            <div className="owner-menu-cards-grid">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`owner-item-card ${
                    selectedItemId === item.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="owner-item-card-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="owner-item-card-image"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="owner-item-card-more-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectItem(item)
                      }}
                      title="Item options"
                      aria-label="Item options"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  <div className="owner-item-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className="owner-item-card-title">{item.name}</h4>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="owner-item-card-price">₹ {item.price}</span>
                      <span className="owner-item-card-cat">{item.category}</span>
                    </div>

                    <div className="owner-item-card-footer">
                      <div className="owner-item-badges-wrap">
                        {/* Dietary Badge */}
                        <span
                          className={`owner-dietary-badge ${
                            item.itemType === 'veg'
                              ? 'owner-dietary-badge--veg'
                              : item.itemType === 'non-veg'
                              ? 'owner-dietary-badge--non-veg'
                              : 'owner-dietary-badge--egg'
                          }`}
                        >
                          {item.itemType === 'veg' ? 'Veg' : item.itemType === 'non-veg' ? 'Non-Veg' : 'Egg'}
                        </span>

                        {/* Tag Badge */}
                        {item.tag && (
                          <span
                            className={`owner-tag-badge ${
                              item.tag === 'Bestseller'
                                ? 'owner-tag-badge--bestseller'
                                : item.tag === 'Popular'
                                ? 'owner-tag-badge--popular'
                                : item.tag === 'Spicy'
                                ? 'owner-tag-badge--spicy'
                                : 'owner-tag-badge--new'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Active Status Switch */}
                      <label
                        className="owner-switch"
                        onClick={(e) => e.stopPropagation()}
                        title={item.active ? 'Active' : 'Inactive'}
                      >
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(e) => handleToggleItemStatus(e, item.id)}
                        />
                        <span className="owner-switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="owner-menu-cards-list-view">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`owner-item-card ${
                    selectedItemId === item.id ? 'selected' : ''
                  }`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '8px 14px',
                    gap: '12px',
                  }}
                  onClick={() => handleSelectItem(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--owner-espresso)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#7a6a5e' }}>{item.category}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--owner-espresso)' }}>
                    ₹ {item.price}
                  </span>
                  <span
                    className={`owner-dietary-badge ${
                      item.itemType === 'veg'
                        ? 'owner-dietary-badge--veg'
                        : item.itemType === 'non-veg'
                        ? 'owner-dietary-badge--non-veg'
                        : 'owner-dietary-badge--egg'
                    }`}
                  >
                    {item.itemType}
                  </span>
                  <label className="owner-switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleToggleItemStatus(e, item.id)}
                    />
                    <span className="owner-switch-slider" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 16px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid var(--owner-card-border)',
                color: '#8c7b6f',
              }}
            >
              No menu items match your search or filters.
            </div>
          )}

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--owner-card-border)',
              fontSize: '12.5px',
              color: '#7a6a5e',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}{' '}
              items
            </div>

            <div className="owner-pagination-controls">
              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`owner-pagination-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div>12 per page</div>
          </div>
        </div>
      </div>

      {/* Centered Item Details Modal with Blurred Background (Read-only by default, editable on 'Edit' click) */}
      {selectedItem && editForm && (
        <div
          className="owner-modal-overlay"
          onClick={handleCloseDetail}
          aria-label="Item details modal backdrop"
        >
          <aside
            className="owner-item-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Item Details Modal"
          >
            {/* Header: Changes title and controls based on isEditing */}
            <div className="owner-detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 className="owner-detail-panel-title">
                  {isEditing ? 'Edit Item' : 'Item Details'}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#8c7b6f',
                    background: '#f0eae1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
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
                    src={activeHeroImg || editForm.image}
                    alt={editForm.name}
                    className="owner-item-view-hero-img"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
                    }}
                  />
                  <div className="owner-item-view-badges-overlay">
                    <span
                      className={`owner-item-view-diet-badge ${
                        editForm.itemType === 'veg'
                          ? 'owner-item-view-diet-badge--veg'
                          : editForm.itemType === 'non-veg'
                          ? 'owner-item-view-diet-badge--non-veg'
                          : 'owner-item-view-diet-badge--egg'
                      }`}
                    >
                      {editForm.itemType === 'veg'
                        ? '🌱 Veg'
                        : editForm.itemType === 'non-veg'
                        ? '🍗 Non-Veg'
                        : '🥚 Egg'}
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
                      {editForm.tag === 'Bestseller' && (
                        <span className="owner-item-view-pill owner-item-view-pill--bestseller">
                          ★ Bestseller
                        </span>
                      )}
                      {editForm.tag === 'Spicy' && (
                        <span className="owner-item-view-pill owner-item-view-pill--spicy">
                          🌶 Spicy
                        </span>
                      )}
                      {editForm.tag === 'New' && (
                        <span className="owner-item-view-pill owner-item-view-pill--new">
                          ✨ New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="owner-item-view-price">₹ {editForm.price}</div>
                </div>

                {/* Segmented Detail Tabs */}
                <div className="owner-detail-tabs-nav">
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'general' ? 'active' : ''}`}
                    onClick={() => setDetailTab('general')}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'variants' ? 'active' : ''}`}
                    onClick={() => setDetailTab('variants')}
                  >
                    Variants ({editForm.variants?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'addons' ? 'active' : ''}`}
                    onClick={() => setDetailTab('addons')}
                  >
                    Add-ons ({editForm.selectedAddons?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setDetailTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </div>

                {/* Read-Only Details Body */}
                <div className="owner-detail-body">
                  {detailTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7b6f', marginBottom: '6px' }}>
                          DESCRIPTION
                        </div>
                        <p className="owner-item-view-desc">
                          {editForm.description || 'No description provided for this item.'}
                        </p>
                      </div>

                      {/* Image Gallery Thumbnails */}
                      {editForm.gallery && editForm.gallery.length > 0 && (
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7b6f', marginBottom: '8px' }}>
                            PHOTO GALLERY (Click to preview)
                          </div>
                          <div className="owner-gallery-preview-strip">
                            {/* Main photo thumbnail */}
                            <img
                              src={editForm.image}
                              alt={editForm.name}
                              className={`owner-gallery-preview-thumb ${
                                (activeHeroImg || editForm.image) === editForm.image ? 'active' : ''
                              }`}
                              onClick={() => setActiveHeroImg(editForm.image)}
                            />
                            {/* Additional gallery thumbnails */}
                            {editForm.gallery.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                className={`owner-gallery-preview-thumb ${
                                  activeHeroImg === img ? 'active' : ''
                                }`}
                                onClick={() => setActiveHeroImg(img)}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'variants' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Configured Variations ({editForm.variants?.length || 0})
                      </div>
                      {editForm.variants && editForm.variants.length > 0 ? (
                        editForm.variants.map((v) => (
                          <div
                            key={v.id}
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
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--owner-espresso)' }}>
                                {v.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2 }}>
                                Stock: {v.stock} pcs available
                              </div>
                            </div>
                            <div style={{ fontWeight: 800, color: '#8c4a23', fontSize: '14.5px' }}>
                              ₹ {v.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12.5px', color: '#8c7b6f', textAlign: 'center', padding: '24px', background: '#faf8f5', borderRadius: '8px' }}>
                          No variants configured for this item.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'addons' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Linked Add-ons ({editForm.selectedAddons?.length || 0})
                      </div>
                      {editForm.selectedAddons && editForm.selectedAddons.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                          {editForm.selectedAddons.map((addonName, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: '#faf8f5',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #ede7dc',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: 'var(--owner-espresso)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span style={{ color: '#16a34a' }}>✓</span> {addonName}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '12.5px', color: '#8c7b6f', textAlign: 'center', padding: '24px', background: '#faf8f5', borderRadius: '8px' }}>
                          No add-ons linked to this item.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'nutrition' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Nutritional Facts
                      </div>
                      <div className="owner-nutrition-grid-view">
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.calories || '520 kcal'}</div>
                          <div className="owner-nutrition-lbl">Calories</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.protein || '22g'}</div>
                          <div className="owner-nutrition-lbl">Protein</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.carbs || '48g'}</div>
                          <div className="owner-nutrition-lbl">Carbs</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.fat || '18g'}</div>
                          <div className="owner-nutrition-lbl">Fat</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Read-Only Mode Footer */}
                <div className="owner-detail-footer">
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
                    <Edit2 size={14} /> Edit Item
                  </button>
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* 2. EDIT MODE (Active only when user clicks 'Edit')              */
              /* ============================================================== */
              <form onSubmit={(e) => {
                handleSaveChanges(e)
                setIsEditing(false)
              }}>
                <div className="owner-detail-hero-wrap">
                  <img src={editForm.image} alt={editForm.name} className="owner-detail-hero-img" />
                  <button
                    type="button"
                    className="owner-detail-hero-edit-btn"
                    onClick={() => showToast('Image picker opened (frontend demonstration)')}
                  >
                    <Edit2 size={12} /> Edit Photo
                  </button>
                </div>

                <div
                  style={{
                    padding: '12px 16px 6px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--owner-espresso)' }}>
                    Item Settings
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: editForm.active ? '#047857' : '#b91c1c',
                      }}
                    >
                      {editForm.active ? 'Active' : 'Inactive'}
                    </span>
                    <label className="owner-switch">
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, active: e.target.checked }))
                        }
                      />
                      <span className="owner-switch-slider" />
                    </label>
                  </div>
                </div>

                {/* Details Tabs */}
                <div className="owner-detail-tabs-nav">
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'general' ? 'active' : ''}`}
                    onClick={() => setDetailTab('general')}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'variants' ? 'active' : ''}`}
                    onClick={() => setDetailTab('variants')}
                  >
                    Variants
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'addons' ? 'active' : ''}`}
                    onClick={() => setDetailTab('addons')}
                  >
                    Add-ons
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setDetailTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </div>

                {/* Details Form Body */}
                <div className="owner-detail-body">
                  {detailTab === 'general' && (
                    <>
                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Name</label>
                        <input
                          type="text"
                          className="owner-detail-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Description</label>
                        <textarea
                          rows={3}
                          className="owner-detail-textarea"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr',
                          gap: '10px',
                        }}
                      >
                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Category</label>
                          <select
                            className="owner-detail-select"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                          >
                            {categories
                              .filter((c) => c.slug !== 'all')
                              .map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Price (₹)</label>
                          <input
                            type="number"
                            className="owner-detail-input"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({ ...editForm, price: Number(e.target.value) })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Item Type</label>
                        <div className="owner-dietary-selector">
                          {['veg', 'non-veg', 'egg'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              className={`owner-dietary-choice-btn ${
                                editForm.itemType === type ? 'selected' : ''
                              }`}
                              onClick={() => setEditForm({ ...editForm, itemType: type })}
                            >
                              {type === 'veg' ? '🌱 Veg' : type === 'non-veg' ? '🍗 Non-Veg' : '🥚 Egg'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Badges & Highlights</label>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'Bestseller'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'Bestseller' : null,
                                })
                              }
                            />
                            Bestseller
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'Spicy'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'Spicy' : null,
                                })
                              }
                            />
                            Spicy
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'New'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'New' : null,
                                })
                              }
                            />
                            New Item
                          </label>
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Image Gallery</label>
                        <div className="owner-gallery-strip">
                          {editForm.gallery?.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Thumbnail"
                              className="owner-gallery-thumb"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ))}
                          <button
                            type="button"
                            className="owner-gallery-add-btn"
                            onClick={() => showToast('Image upload demo')}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {detailTab === 'variants' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12.5px', color: '#7a6a5e' }}>
                        Item Variants ({editForm.variants?.length || 0})
                      </div>
                      {editForm.variants && editForm.variants.length > 0 ? (
                        editForm.variants.map((v) => (
                          <div
                            key={v.id}
                            style={{
                              background: '#faf8f5',
                              padding: '10px',
                              borderRadius: '8px',
                              border: '1px solid #ede7dc',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>{v.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#8c7b6f' }}>
                                Stock: {v.stock} pcs
                              </div>
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--owner-espresso)' }}>
                              ₹ {v.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12px', color: '#8c7b6f', textAlign: 'center', padding: '16px' }}>
                          No variants configured for this item.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'addons' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12.5px', color: '#7a6a5e' }}>
                        Linked Add-ons ({editForm.selectedAddons?.length || 0})
                      </div>
                      {editForm.selectedAddons?.map((addonName, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: '#faf8f5',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #ede7dc',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: 'var(--owner-espresso)',
                          }}
                        >
                          ✓ {addonName}
                        </div>
                      ))}
                    </div>
                  )}

                  {detailTab === 'nutrition' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c7b6f' }}>Calories</span>
                        <span style={{ fontWeight: 700 }}>{editForm.nutrition?.calories || '520 kcal'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c7b6f' }}>Protein</span>
                        <span style={{ fontWeight: 700 }}>{editForm.nutrition?.protein || '22g'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c7b6f' }}>Carbohydrates</span>
                        <span style={{ fontWeight: 700 }}>{editForm.nutrition?.carbs || '48g'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#8c7b6f' }}>Fat</span>
                        <span style={{ fontWeight: 700 }}>{editForm.nutrition?.fat || '18g'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="owner-detail-footer">
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    onClick={() => {
                      setEditForm({ ...selectedItem })
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="owner-btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}

      {/* Import / Export Dialog */}
      {isImportExportOpen && (
        <div className="owner-modal-overlay" onClick={() => setIsImportExportOpen(false)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2 className="owner-modal-title">Import & Export Menu Items</h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsImportExportOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '8px', background: '#faf8f5', border: '1px solid #eee8df' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 800 }}>Export Menu (CSV)</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#7a6a5e' }}>
                    Download current 48 menu items with price, category, status, and variants.
                  </p>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    style={{ marginTop: '10px', fontSize: '12.5px' }}
                    onClick={() => {
                      showToast('Menu items exported to CSV successfully!')
                      setIsImportExportOpen(false)
                    }}
                  >
                    <Download size={14} /> Download CSV
                  </button>
                </div>

                <div style={{ padding: '14px', borderRadius: '8px', background: '#faf8f5', border: '1px solid #eee8df' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 800 }}>Import Menu (CSV / Excel)</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#7a6a5e' }}>
                    Upload updated menu spreadsheet to bulk update prices or create new items.
                  </p>
                  <div
                    style={{
                      border: '2px dashed #ded6c9',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      marginTop: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      showToast('Menu imported successfully!')
                      setIsImportExportOpen(false)
                    }}
                  >
                    <Upload size={20} color="#8c4a23" />
                    <div style={{ fontSize: '12.5px', fontWeight: 700, marginTop: '4px' }}>
                      Click to choose CSV file
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
