import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  Check,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Upload,
  GripVertical,
  Package,
  Image as ImageIcon,
} from 'lucide-react'
import '../../Owner.css'

export default function MenuCategoriesTab({
  categories = [],
  setCategories,
  items = [],
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  // Background scroll lock when modals are open
  useEffect(() => {
    if (showAddModal || editingCategory || deleteCandidate) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [showAddModal, editingCategory, deleteCandidate])

  // New Category Form
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    description: '',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
    active: true,
  })

  // Filter out 'all' for managing real categories, but keep count accurate
  const manageableCategories = useMemo(() => {
    return categories.filter((c) => c.id !== 'all')
  }, [categories])

  const filteredCategories = useMemo(() => {
    return manageableCategories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [manageableCategories, searchQuery])

  // Toggle active status
  const handleToggleCategoryStatus = (catId) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, active: !c.active } : c))
    )
    showToast?.('Category status updated', 'success')
  }

  // Create Category
  const handleCreateCategory = (e) => {
    e.preventDefault()
    if (!newCatForm.name.trim()) return

    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatForm.name.trim(),
      count: 0,
      active: newCatForm.active,
      image: newCatForm.image,
    }

    setCategories((prev) => [...prev, newCat])
    setShowAddModal(false)
    setNewCatForm({
      name: '',
      description: '',
      image:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
      active: true,
    })
    showToast?.(`Category "${newCat.name}" added`, 'success')
  }

  // Save Category Edit
  const handleSaveCategoryEdit = (e) => {
    e.preventDefault()
    if (!editingCategory?.name.trim()) return

    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? { ...editingCategory } : c))
    )
    setEditingCategory(null)
    showToast?.(`Updated "${editingCategory.name}"`, 'success')
  }

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return
    setCategories((prev) => prev.filter((c) => c.id !== deleteCandidate.id))
    showToast?.(`Deleted "${deleteCandidate.name}"`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="owner-categories-page animate-fade-in">
      {/* 4 Quick Stat Cards */}
      <div className="owner-kpi-stats-grid" style={{ marginBottom: 18 }}>
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#f3e8ff', color: '#9333ea' }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">
              {manageableCategories.length}
            </div>
            <div className="owner-kpi-stat-lbl">Total Categories</div>
          </div>
        </div>

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
            <div className="owner-kpi-stat-val">
              {manageableCategories.filter((c) => c.active !== false).length}
            </div>
            <div className="owner-kpi-stat-lbl">Active Categories</div>
          </div>
        </div>

        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#ffedd5', color: '#ea580c' }}
          >
            <Package size={20} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{items.length}</div>
            <div className="owner-kpi-stat-lbl">Total Menu Items</div>
          </div>
        </div>

        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <span style={{ fontWeight: 800, fontSize: 18 }}>Ø</span>
          </div>
          <div>
            <div className="owner-kpi-stat-val">
              {manageableCategories.length > 0
                ? Math.round(items.length / manageableCategories.length)
                : 0}
            </div>
            <div className="owner-kpi-stat-lbl">Avg Items / Cat</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="owner-toolbar-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid var(--owner-card-border)',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ position: 'relative', width: 280 }}>
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
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

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
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {filteredCategories.map((cat, idx) => {
          const itemCount = items.filter(
            (i) => i.category.toLowerCase() === cat.name.toLowerCase()
          ).length

          return (
            <div
              key={cat.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--owner-card-border)',
                borderRadius: 12,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                position: 'relative',
              }}
            >
              <img
                src={
                  cat.image ||
                  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&auto=format&fit=crop&q=80'
                }
                alt={cat.name}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 10,
                  objectFit: 'cover',
                  border: '1px solid #ebdccb',
                  flexShrink: 0,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 800,
                      color: 'var(--owner-espresso)',
                    }}
                  >
                    {cat.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      type="button"
                      className="owner-table-action-btn"
                      onClick={() => setEditingCategory({ ...cat })}
                      title="Edit Category"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="owner-table-action-btn delete"
                      onClick={() => setDeleteCandidate(cat)}
                      title="Delete Category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#8c7b6f',
                    marginTop: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#8c4a23',
                      background: '#f8f2eb',
                      padding: '1px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {itemCount} items
                  </span>
                  <span>• Priority #{idx + 1}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid #f6f0e6',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: cat.active !== false ? '#15803d' : '#8c7b6f',
                    }}
                  >
                    {cat.active !== false ? 'Active' : 'Hidden'}
                  </span>
                  <label className="owner-toggle-switch" style={{ transform: 'scale(0.8)' }}>
                    <input
                      type="checkbox"
                      checked={cat.active !== false}
                      onChange={() => handleToggleCategoryStatus(cat.id)}
                    />
                    <span className="owner-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Add Category */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-card" style={{ maxWidth: 420 }}>
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add New Category
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">Category Name *</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Smoothies, Mocktails, Breakfast"
                    value={newCatForm.name}
                    onChange={(e) =>
                      setNewCatForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="owner-field-label">Category Photo</label>
                  <div
                    style={{
                      border: '1.5px dashed #ded6c9',
                      borderRadius: 10,
                      padding: '12px',
                      background: '#faf8f5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {newCatForm.image ? (
                      <img
                        src={newCatForm.image}
                        alt="Preview"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #e2dad0',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          background: '#eee5d8',
                          color: '#8c4a23',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon size={22} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label
                        className="owner-btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={13} />
                        <span>{newCatForm.image ? 'Change Photo' : 'Add Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (uploadEvt) => {
                                setNewCatForm((prev) => ({
                                  ...prev,
                                  image: uploadEvt.target.result,
                                }))
                                showToast?.('Photo selected for category')
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                      <div style={{ fontSize: '11px', color: '#8c7b6f', marginTop: 4 }}>
                        PNG, JPG or WebP up to 5MB
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Active</span>
                  <label className="owner-toggle-switch">
                    <input
                      type="checkbox"
                      checked={newCatForm.active}
                      onChange={(e) =>
                        setNewCatForm((prev) => ({
                          ...prev,
                          active: e.target.checked,
                        }))
                      }
                    />
                    <span className="owner-toggle-slider"></span>
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
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-card" style={{ maxWidth: 420 }}>
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Edit Category
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setEditingCategory(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCategoryEdit}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">Category Name *</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="owner-field-label">Category Photo</label>
                  <div
                    style={{
                      border: '1.5px dashed #ded6c9',
                      borderRadius: 10,
                      padding: '12px',
                      background: '#faf8f5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {editingCategory.image ? (
                      <img
                        src={editingCategory.image}
                        alt="Preview"
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #e2dad0',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          background: '#eee5d8',
                          color: '#8c4a23',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon size={22} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label
                        className="owner-btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '12px',
                          padding: '6px 12px',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={13} />
                        <span>{editingCategory.image ? 'Change Photo' : 'Add Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (uploadEvt) => {
                                setEditingCategory((prev) => ({
                                  ...prev,
                                  image: uploadEvt.target.result,
                                }))
                                showToast?.('Photo updated for category')
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </label>
                      <div style={{ fontSize: '11px', color: '#8c7b6f', marginTop: 4 }}>
                        PNG, JPG or WebP up to 5MB
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="owner-btn-primary"
                  style={{ background: '#8c4a23' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete */}
      {deleteCandidate && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-card" style={{ maxWidth: 380 }}>
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#dc2626' }}>
                Delete Category
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
                Are you sure you want to delete category{' '}
                <strong>{deleteCandidate.name}</strong>?
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
