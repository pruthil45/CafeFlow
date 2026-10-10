import { useState } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sliders,
  GripVertical,
} from 'lucide-react'
import '../../Owner.css'

export default function MenuVariantsTab({
  variantSets = [],
  setVariantSets,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSetForm, setNewSetForm] = useState({
    name: '',
    category: 'Beverages',
    options: [
      { name: 'Regular', priceDelta: 0, stock: 50 },
      { name: 'Large', priceDelta: 40, stock: 30 },
    ],
  })
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  const filteredSets = variantSets.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleSetStatus = (id) => {
    setVariantSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    )
    showToast?.('Variant set status updated', 'success')
  }

  const handleCreateSet = (e) => {
    e.preventDefault()
    if (!newSetForm.name.trim()) return

    const newSet = {
      id: `vs-${Date.now()}`,
      name: newSetForm.name.trim(),
      category: newSetForm.category,
      active: true,
      options: newSetForm.options,
    }

    setVariantSets((prev) => [...prev, newSet])
    setShowAddModal(false)
    setNewSetForm({
      name: '',
      category: 'Beverages',
      options: [
        { name: 'Regular', priceDelta: 0, stock: 50 },
        { name: 'Large', priceDelta: 40, stock: 30 },
      ],
    })
    showToast?.(`Created variant set "${newSet.name}"`, 'success')
  }

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return
    setVariantSets((prev) => prev.filter((s) => s.id !== deleteCandidate.id))
    showToast?.(`Deleted "${deleteCandidate.name}"`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="owner-variants-page animate-fade-in">
      {/* 4 Stats Cards */}
      <div className="owner-kpi-stats-grid" style={{ marginBottom: 18 }}>
        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#f3e8ff', color: '#9333ea' }}
          >
            <Sliders size={22} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">{variantSets.length}</div>
            <div className="owner-kpi-stat-lbl">Variant Templates</div>
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
              {variantSets.filter((s) => s.active !== false).length}
            </div>
            <div className="owner-kpi-stat-lbl">Active Sets</div>
          </div>
        </div>

        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#ffedd5', color: '#ea580c' }}
          >
            <span style={{ fontWeight: 800, fontSize: 16 }}>Σ</span>
          </div>
          <div>
            <div className="owner-kpi-stat-val">
              {variantSets.reduce((acc, s) => acc + (s.options?.length || 0), 0)}
            </div>
            <div className="owner-kpi-stat-lbl">Total Sizing Options</div>
          </div>
        </div>

        <div className="owner-kpi-stat-card">
          <div
            className="owner-kpi-stat-icon-wrap"
            style={{ background: '#fef3c7', color: '#d97706' }}
          >
            <Check size={20} />
          </div>
          <div>
            <div className="owner-kpi-stat-val">100%</div>
            <div className="owner-kpi-stat-lbl">Menu Synchronized</div>
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
            placeholder="Search variant sets..."
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
          <span>Add Variant Set</span>
        </button>
      </div>

      {/* Variants List Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 16,
        }}
      >
        {filteredSets.map((vSet) => (
          <div
            key={vSet.id}
            style={{
              background: '#ffffff',
              border: '1px solid var(--owner-card-border)',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 800,
                    color: 'var(--owner-espresso)',
                  }}
                >
                  {vSet.name}
                </h3>
                <span style={{ fontSize: 11.5, color: '#8c7b6f' }}>
                  Category: {vSet.category}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <label className="owner-toggle-switch" style={{ transform: 'scale(0.8)' }}>
                  <input
                    type="checkbox"
                    checked={vSet.active !== false}
                    onChange={() => handleToggleSetStatus(vSet.id)}
                  />
                  <span className="owner-toggle-slider"></span>
                </label>
                <button
                  type="button"
                  className="owner-table-action-btn delete"
                  onClick={() => setDeleteCandidate(vSet)}
                  title="Delete Set"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Options Table */}
            <div style={{ background: '#faf8f5', borderRadius: 8, padding: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#7a6a5e',
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: 4,
                  borderBottom: '1px solid #ebdccb',
                  marginBottom: 6,
                }}
              >
                <span>Variant Name</span>
                <span>Price Delta / Stock</span>
              </div>

              {vSet.options?.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#33271e' }}>
                    {opt.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#8c4a23' }}>
                      {opt.priceDelta > 0
                        ? `+₹${opt.priceDelta}`
                        : opt.priceDelta === 0
                        ? 'Base Price'
                        : `₹${opt.price}`}
                    </span>
                    {opt.stock !== undefined && (
                      <span
                        style={{
                          background: '#fff',
                          border: '1px solid #e0d5c5',
                          borderRadius: 4,
                          padding: '1px 5px',
                          fontSize: 11,
                          color: '#6b5d52',
                        }}
                      >
                        {opt.stock} in stock
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Variant Set */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-card" style={{ maxWidth: 420 }}>
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                + Add Variant Template
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSet}>
              <div
                className="owner-modal-body"
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div>
                  <label className="owner-field-label">Template Name *</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Sizing, Milk Option, Crust"
                    value={newSetForm.name}
                    onChange={(e) =>
                      setNewSetForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="owner-field-label">Category</label>
                  <select
                    className="owner-form-select"
                    value={newSetForm.category}
                    onChange={(e) =>
                      setNewSetForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    <option value="Beverages">Beverages</option>
                    <option value="Burgers">Burgers</option>
                    <option value="Pizzas">Pizzas</option>
                    <option value="Pasta">Pasta</option>
                    <option value="General">General</option>
                  </select>
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
                  Create Set
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
                Delete Variant Set
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
                Are you sure you want to delete{' '}
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
