import { useState, useMemo } from 'react'
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
  Flame,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
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
  const itemsPerPage = 12

  // Selected item for detail panel (default to null - NO auto-select!)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [detailTab, setDetailTab] = useState('general') // 'general', 'variants', 'addons', 'nutrition'

  // Edit draft for the selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null
    return items.find((i) => i.id === selectedItemId) || null
  }, [items, selectedItemId])

  const [editForm, setEditForm] = useState(null)

  // Sync edit form when selected item changes
  const handleSelectItem = (item) => {
    setSelectedItemId(item.id)
    setEditForm({ ...item })
    setDetailTab('general')
  }

  // Close detail panel
  const handleCloseDetail = () => {
    setSelectedItemId(null)
    setEditForm(null)
  }

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
            className={`owner-category-item-btn ${
              selectedCategory === cat.slug ? 'active' : ''
            }`}
            style={{ width: 'auto', padding: '6px 14px' }}
            onClick={() => {
              setSelectedCategory(cat.slug)
              setCurrentPage(1)
            }}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 3-Part Layout: Left Categories | Center Items Grid | Right Item Details */}
      <div className="owner-menu-workspace">
        {/* LEFT: Categories Panel */}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                <span>{cat.name}</span>
                <span className="owner-category-count-badge">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Menu Items Workspace */}
        <div className="owner-menu-items-area">
          {/* Filters Bar */}
          <div className="owner-menu-filter-bar">
            <div className="owner-menu-filter-inputs">
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
              </div>

              <select
                className="owner-menu-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

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

              <button
                type="button"
                className="owner-btn-secondary"
                style={{ padding: '6px 10px', fontSize: '12px' }}
                onClick={() => {
                  setSearchQuery('')
                  setFilterAvailability('all')
                  setFilterDietary('all')
                  setSelectedCategory('all')
                }}
              >
                Reset
              </button>
            </div>

            {/* Grid / List View Toggles */}
            <div className="owner-menu-view-toggles">
              <button
                type="button"
                className={`owner-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`owner-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
                aria-label="List view"
              >
                <List size={15} />
              </button>
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

        {/* RIGHT: Empty Placeholder when nothing selected (Desktop only) */}
        {!selectedItem && (
          <aside className="owner-item-detail-panel owner-detail-empty-placeholder" aria-label="Item Details Placeholder">
            <div className="owner-detail-empty-icon">
              <LayoutGrid size={24} />
            </div>
            <h4 className="owner-detail-empty-title">No Item Selected</h4>
            <p className="owner-detail-empty-text">
              Click on any menu item card or row to preview details, adjust pricing, or edit variants and add-ons.
            </p>
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={onOpenAddItem}
              style={{ marginTop: 8, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> Add New Item
            </button>
          </aside>
        )}

        {/* Backdrop for mobile drawer */}
        {selectedItem && editForm && (
          <div
            className="owner-detail-drawer-backdrop"
            onClick={handleCloseDetail}
            aria-hidden="true"
          />
        )}

        {/* RIGHT: Item Details Panel / Mobile Drawer */}
        {selectedItem && editForm && (
        <aside className="owner-item-detail-panel owner-detail-panel-drawer" aria-label="Item Details Panel">
          <div className="owner-detail-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 className="owner-detail-panel-title">Item Details</h3>
              <span style={{ fontSize: '11px', color: '#8c7b6f' }}>ID: {editForm.id}</span>
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

          <div className="owner-detail-hero-wrap">
            <img src={editForm.image} alt={editForm.name} className="owner-detail-hero-img" />
            <button
              type="button"
              className="owner-detail-hero-edit-btn"
              onClick={() => showToast('Image picker opened (frontend demonstration)')}
            >
              <Edit2 size={12} /> Edit
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
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--owner-espresso)' }}>
              {editForm.name}
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

          {/* Details Body */}
          <form onSubmit={handleSaveChanges}>
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
                onClick={handleCloseDetail}
              >
                Close
              </button>
              <button type="submit" className="owner-btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </aside>
        )}
      </div>

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
