import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Percent,
  Coins,
  Receipt,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  Save,
  ChevronDown,
  Info,
} from 'lucide-react'
import {
  INITIAL_TAXATION_CONFIG,
  AVAILABLE_TAX_CATEGORIES,
  AVAILABLE_TAX_ITEMS,
} from '../data/settingsMockData'

export default function TaxationSettingsTab({ onShowToast }) {
  const navigate = useNavigate()

  // Load from localStorage or defaults
  const [taxConfig, setTaxConfig] = useState(() => {
    const saved = localStorage.getItem('cafeflow_taxation_settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        /* fallback */
      }
    }
    return INITIAL_TAXATION_CONFIG
  })

  // Has unsaved changes indicator
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Drawer / Side panel state for Add / Edit Tax
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false)
  const [editingTax, setEditingTax] = useState(null)
  const formCardRef = useRef(null)

  // More menu per row
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    applyTo: 'All Menu Items',
    categories: ['Beverages', 'Snacks'],
    items: ['Cappuccino', 'Classic Burger'],
    status: 'Active',
  })
  const [formErrors, setFormErrors] = useState({})

  // Persist on save or auto-save
  const handleSaveTaxation = () => {
    localStorage.setItem('cafeflow_taxation_settings', JSON.stringify(taxConfig))
    setHasUnsavedChanges(false)
    if (onShowToast) onShowToast('Taxation settings saved successfully!')
  }

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toggle Global Taxation
  const handleToggleTaxation = () => {
    setTaxConfig((prev) => {
      const next = { ...prev, isEnabled: !prev.isEnabled }
      setHasUnsavedChanges(true)
      return next
    })
    if (onShowToast) {
      onShowToast(
        taxConfig.isEnabled ? 'Taxation disabled.' : 'Taxation enabled.',
        taxConfig.isEnabled ? 'info' : 'success'
      )
    }
  }

  // Open Add panel
  const handleOpenAddPanel = () => {
    setEditingTax(null)
    setFormData({
      name: '',
      rate: '',
      applyTo: 'All Menu Items',
      categories: ['Beverages', 'Snacks'],
      items: ['Cappuccino', 'Classic Burger'],
      status: 'Active',
    })
    setFormErrors({})
    setIsAddPanelOpen(true)
    setTimeout(() => {
      if (formCardRef.current) {
        formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 50)
  }

  // Open Edit panel
  const handleOpenEditPanel = (tax) => {
    setEditingTax(tax)
    setFormData({
      name: tax.name,
      rate: tax.rate.toString(),
      applyTo: tax.applyTo || 'All Menu Items',
      categories: tax.categories && tax.categories.length > 0 ? tax.categories : ['Beverages'],
      items: tax.items && tax.items.length > 0 ? tax.items : ['Cappuccino'],
      status: tax.status || 'Active',
    })
    setFormErrors({})
    setIsAddPanelOpen(true)
    setOpenMenuId(null)
    setTimeout(() => {
      if (formCardRef.current) {
        formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 50)
  }

  // Cancel form
  const handleCancelForm = () => {
    setEditingTax(null)
    setFormData({
      name: '',
      rate: '',
      applyTo: 'All Menu Items',
      categories: ['Beverages', 'Snacks'],
      items: ['Cappuccino', 'Classic Burger'],
      status: 'Active',
    })
    setFormErrors({})
    setIsAddPanelOpen(false)
  }

  // Multi-select toggle for Categories in Tax Form
  const handleToggleFormCategory = (cat) => {
    setFormData((prev) => {
      const current = prev.categories || []
      const next = current.includes(cat)
        ? current.filter((c) => c !== cat)
        : [...current, cat]
      return { ...prev, categories: next }
    })
    if (formErrors.categories) {
      setFormErrors((prev) => ({ ...prev, categories: null }))
    }
  }

  // Multi-select toggle for Items in Tax Form
  const handleToggleFormItem = (itemName) => {
    setFormData((prev) => {
      const current = prev.items || []
      const next = current.includes(itemName)
        ? current.filter((i) => i !== itemName)
        : [...current, itemName]
      return { ...prev, items: next }
    })
    if (formErrors.items) {
      setFormErrors((prev) => ({ ...prev, items: null }))
    }
  }

  // Validate Tax Form
  const validateTaxForm = () => {
    const errors = {}
    if (!formData.name.trim()) {
      errors.name = 'Tax name is required'
    }

    const rateNum = parseFloat(formData.rate)
    if (isNaN(rateNum)) {
      errors.rate = 'Tax rate is required'
    } else if (rateNum < 0 || rateNum > 100) {
      errors.rate = 'Rate must be between 0% and 100%'
    }

    if (formData.applyTo === 'Selected Categories' && (!formData.categories || formData.categories.length === 0)) {
      errors.categories = 'Please select at least one category'
    }

    if (formData.applyTo === 'Selected Items' && (!formData.items || formData.items.length === 0)) {
      errors.items = 'Please select at least one menu item'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Save Tax Form
  const handleSaveTaxForm = (e) => {
    e.preventDefault()
    if (!validateTaxForm()) return

    const rateNum = parseFloat(formData.rate)

    if (editingTax) {
      // Update existing
      setTaxConfig((prev) => ({
        ...prev,
        taxRates: prev.taxRates.map((t) =>
          t.id === editingTax.id
            ? {
                ...t,
                name: formData.name.trim(),
                rate: rateNum,
                applyTo: formData.applyTo,
                categories: formData.applyTo === 'Selected Categories' ? formData.categories : undefined,
                items: formData.applyTo === 'Selected Items' ? formData.items : undefined,
                itemsCount: formData.applyTo === 'Selected Items' ? formData.items.length : undefined,
                status: formData.status,
              }
            : t
        ),
      }))
      if (onShowToast) onShowToast(`Tax "${formData.name}" updated successfully!`)
    } else {
      // Create new
      const newTax = {
        id: `tax-${Date.now()}`,
        name: formData.name.trim(),
        rate: rateNum,
        applyTo: formData.applyTo,
        categories: formData.applyTo === 'Selected Categories' ? formData.categories : undefined,
        items: formData.applyTo === 'Selected Items' ? formData.items : undefined,
        itemsCount: formData.applyTo === 'Selected Items' ? formData.items.length : undefined,
        status: formData.status,
      }
      setTaxConfig((prev) => ({
        ...prev,
        taxRates: [...prev.taxRates, newTax],
      }))
      if (onShowToast) onShowToast(`Tax "${formData.name}" added successfully!`)
    }

    setHasUnsavedChanges(true)
    setIsAddPanelOpen(false)
  }

  // Toggle status of a tax rate
  const handleToggleTaxStatus = (taxId) => {
    setTaxConfig((prev) => ({
      ...prev,
      taxRates: prev.taxRates.map((t) =>
        t.id === taxId ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active' } : t
      ),
    }))
    setHasUnsavedChanges(true)
    setOpenMenuId(null)
  }

  // Delete tax rate
  const handleDeleteTax = (taxId) => {
    setTaxConfig((prev) => ({
      ...prev,
      taxRates: prev.taxRates.filter((t) => t.id !== taxId),
    }))
    setHasUnsavedChanges(true)
    setOpenMenuId(null)
    if (onShowToast) onShowToast('Tax rate deleted.', 'info')
  }

  // Bill Calculation Simulation (₹500 subtotal)
  const billSimulation = useMemo(() => {
    const subtotal = 500
    if (!taxConfig.isEnabled) {
      return {
        subtotal,
        taxes: [],
        total: subtotal,
      }
    }

    // Active taxes applied
    const activeTaxes = (taxConfig.taxRates || [])
      .filter((t) => t.status === 'Active')
      .map((t) => {
        const amount = Math.round((subtotal * t.rate) / 100)
        return {
          id: t.id,
          name: t.name,
          rate: t.rate,
          amount,
        }
      })

    const totalTaxAmount = activeTaxes.reduce((sum, t) => sum + t.amount, 0)
    const total = subtotal + totalTaxAmount

    return {
      subtotal,
      taxes: activeTaxes,
      total,
    }
  }, [taxConfig.isEnabled, taxConfig.taxRates])

  return (
    <div className="owner-taxation-page">
      {/* Header with Breadcrumb & Save Changes */}
      <div className="owner-settings-header-block">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
              <button
                type="button"
                className="owner-breadcrumb-link"
                onClick={() => navigate('/owner/settings')}
              >
                Settings
              </button>
              <span className="owner-breadcrumb-sep">/</span>
              <span className="owner-breadcrumb-current">Taxation</span>
            </nav>

            <h1 className="owner-settings-main-title">Taxation</h1>
            <p className="owner-settings-main-subtitle">
              Configure taxes applied to customer orders and bills.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {hasUnsavedChanges && (
              <span style={{ fontSize: '12px', color: '#b84513', fontWeight: 600 }}>
                ● Unsaved changes
              </span>
            )}
            <button
              type="button"
              className="owner-btn-primary"
              onClick={handleSaveTaxation}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div className="owner-taxation-workspace">
        {/* ============================================================== */}
        {/* LEFT COLUMN: TAX SETTINGS, TAX RATES, TAX APPLICATION         */}
        {/* ============================================================== */}
        <div className="owner-taxation-main-col">
          {/* Card 1: Enable Taxation Switch Card */}
          <div className="owner-tax-card owner-tax-toggle-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="owner-tax-card-icon-box">
                  <Percent size={18} />
                </div>
                <div>
                  <h2 className="owner-tax-card-title">Enable Taxation</h2>
                  <p className="owner-tax-card-desc">
                    Automatically apply configured taxes to all bills.
                  </p>
                </div>
              </div>

              {/* Custom Switch Control */}
              <label className="owner-switch-wrap" style={{ flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={taxConfig.isEnabled}
                  onChange={handleToggleTaxation}
                />
                <span className="owner-switch-slider" />
              </label>
            </div>
          </div>

          {/* Card 2: Tax Rates Table */}
          <div className="owner-tax-card">
            <div className="owner-tax-card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="owner-tax-card-icon-box">
                  <Coins size={18} />
                </div>
                <div>
                  <h2 className="owner-tax-card-title">Tax Rates</h2>
                  <p className="owner-tax-card-desc">
                    Add and manage tax rates that will be applied to bills.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="owner-btn-primary"
                onClick={handleOpenAddPanel}
              >
                <Plus size={15} /> Add Tax
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="owner-tax-table-wrap">
              <table className="owner-tax-table">
                <thead>
                  <tr>
                    <th>Tax Name</th>
                    <th>Rate</th>
                    <th>Apply To</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center', width: 60 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxConfig.taxRates.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '32px 16px', color: '#8c7b6f' }}>
                        No tax rates configured. Click &quot;Add Tax&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    taxConfig.taxRates.map((tax) => (
                      <tr key={tax.id}>
                        {/* Tax Name */}
                        <td style={{ fontWeight: 700, color: '#2a1911' }}>{tax.name}</td>

                        {/* Rate */}
                        <td style={{ fontWeight: 600, color: '#4a3f35' }}>{tax.rate}%</td>

                        {/* Apply To */}
                        <td>
                          <div style={{ color: '#2a1911', fontWeight: 600, fontSize: '13px' }}>
                            {tax.applyTo}
                          </div>
                          {tax.applyTo === 'Selected Categories' && tax.categories && tax.categories.length > 0 && (
                            <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2, maxWidth: '240px', lineHeight: 1.35 }}>
                              {tax.categories.join(', ')}
                            </div>
                          )}
                          {tax.applyTo === 'Selected Items' && tax.items && tax.items.length > 0 && (
                            <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2, maxWidth: '240px', lineHeight: 1.35 }}>
                              <span style={{ fontWeight: 600 }}>{tax.items.length} {tax.items.length === 1 ? 'item' : 'items'}:</span> {tax.items.join(', ')}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`owner-status-pill ${
                              tax.status === 'Active' ? 'active' : 'inactive'
                            }`}
                          >
                            <span className="owner-status-dot" />
                            {tax.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ position: 'relative' }}>
                            <button
                              type="button"
                              className="owner-staff-more-btn"
                              onClick={() =>
                                setOpenMenuId(openMenuId === tax.id ? null : tax.id)
                              }
                              aria-label={`Actions for ${tax.name}`}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {openMenuId === tax.id && (
                              <div className="owner-staff-dropdown-menu" ref={menuRef}>
                                <button
                                  type="button"
                                  className="owner-staff-dropdown-item"
                                  onClick={() => handleOpenEditPanel(tax)}
                                >
                                  <Edit2 size={13} /> Edit Tax
                                </button>
                                <button
                                  type="button"
                                  className="owner-staff-dropdown-item"
                                  onClick={() => handleToggleTaxStatus(tax.id)}
                                >
                                  <Check size={13} />{' '}
                                  {tax.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  className="owner-staff-dropdown-item"
                                  style={{ color: '#dc2626' }}
                                  onClick={() => handleDeleteTax(tax.id)}
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Tax Cards List (screens <= 768px) */}
            <div className="owner-tax-mobile-list">
              {taxConfig.taxRates.map((tax) => (
                <div key={tax.id} className="owner-tax-mobile-card">
                  <div className="owner-tax-mobile-card-top">
                    <div>
                      <span className="owner-tax-mobile-name">{tax.name}</span>
                      <span className="owner-tax-mobile-rate">{tax.rate}%</span>
                    </div>
                    <span
                      className={`owner-status-pill ${
                        tax.status === 'Active' ? 'active' : 'inactive'
                      }`}
                    >
                      <span className="owner-status-dot" />
                      {tax.status}
                    </span>
                  </div>

                  <div className="owner-tax-mobile-scope">
                    <strong>Apply To:</strong> {tax.applyTo}
                    {tax.applyTo === 'Selected Categories' && tax.categories && tax.categories.length > 0 && (
                      <div style={{ fontSize: '11.5px', color: '#7a6a5e', marginTop: 3 }}>
                        {tax.categories.join(', ')}
                      </div>
                    )}
                    {tax.applyTo === 'Selected Items' && tax.items && tax.items.length > 0 && (
                      <div style={{ fontSize: '11.5px', color: '#7a6a5e', marginTop: 3 }}>
                        {tax.items.length} {tax.items.length === 1 ? 'item' : 'items'}: {tax.items.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="owner-tax-mobile-actions">
                    <button
                      type="button"
                      className="owner-btn-secondary"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleOpenEditPanel(tax)}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      className="owner-btn-secondary"
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleToggleTaxStatus(tax.id)}
                    >
                      {tax.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="owner-btn-outline-danger"
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleDeleteTax(tax.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: ADD TAX FORM & BILL CALCULATION EXAMPLE         */}
        {/* ============================================================== */}
        <div className="owner-taxation-side-col">
          {/* Add / Edit Tax Panel - Only appears when Add Tax or Edit is clicked */}
          {isAddPanelOpen && (
            <div className="owner-tax-side-card animate-fade-in" ref={formCardRef}>
              <div className="owner-tax-side-header">
                <div>
                  <h3 className="owner-tax-side-title">
                    {editingTax ? 'Edit Tax' : 'Add Tax'}
                  </h3>
                  <p className="owner-tax-side-desc">
                    {editingTax
                      ? 'Update tax rate parameters and applicable items.'
                      : 'Create a new tax rate for your restaurant.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="owner-modal-close-btn"
                  onClick={handleCancelForm}
                  title="Cancel and close"
                >
                  <X size={16} />
                </button>
              </div>

            <form onSubmit={handleSaveTaxForm} className="owner-tax-form">
              {/* Tax Name */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Tax Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`owner-form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="e.g. GST"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && (
                  <span className="owner-input-error-msg">{formErrors.name}</span>
                )}
              </div>

              {/* Tax Rate */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Tax Rate <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className={`owner-form-input ${formErrors.rate ? 'error' : ''}`}
                    placeholder="5"
                    style={{ paddingRight: 36 }}
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#8c7b6f',
                      fontWeight: 700,
                      fontSize: '13px',
                      pointerEvents: 'none',
                    }}
                  >
                    %
                  </span>
                </div>
                {formErrors.rate && (
                  <span className="owner-input-error-msg">{formErrors.rate}</span>
                )}
              </div>

              {/* Apply To */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Apply To <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div className="owner-staff-select-wrap" style={{ width: '100%' }}>
                  <select
                    className="owner-staff-role-select"
                    style={{ width: '100%' }}
                    value={formData.applyTo}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        applyTo: val,
                        categories:
                          val === 'Selected Categories' && (!prev.categories || prev.categories.length === 0)
                            ? ['Beverages', 'Snacks']
                            : (prev.categories || []),
                        items:
                          val === 'Selected Items' && (!prev.items || prev.items.length === 0)
                            ? ['Cappuccino', 'Classic Burger']
                            : (prev.items || []),
                      }))
                      if (formErrors.categories) setFormErrors((errs) => ({ ...errs, categories: null }))
                      if (formErrors.items) setFormErrors((errs) => ({ ...errs, items: null }))
                    }}
                  >
                    <option value="All Menu Items">All Menu Items</option>
                    <option value="Selected Categories">Selected Categories</option>
                    <option value="Selected Items">Selected Items</option>
                  </select>
                  <ChevronDown size={14} className="owner-staff-select-chevron" />
                </div>
              </div>

              {/* Multi-Select Categories Picker */}
              {formData.applyTo === 'Selected Categories' && (
                <div className="owner-form-group owner-tax-multiselect-group animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="owner-form-label" style={{ marginBottom: 0 }}>
                      Select Categories <span style={{ color: '#dc2626' }}>*</span>
                      <span style={{ fontSize: '11.5px', color: '#8c7b6f', fontWeight: 500, marginLeft: 6 }}>
                        ({formData.categories?.length || 0} selected)
                      </span>
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="owner-tax-mini-btn"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, categories: [...AVAILABLE_TAX_CATEGORIES] }))
                          setFormErrors((errs) => ({ ...errs, categories: null }))
                        }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="owner-tax-mini-btn"
                        onClick={() => setFormData((prev) => ({ ...prev, categories: [] }))}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="owner-tax-chips-container">
                    {AVAILABLE_TAX_CATEGORIES.map((cat) => {
                      const isSelected = formData.categories?.includes(cat)
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`owner-tax-chip-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleToggleFormCategory(cat)}
                        >
                          <span className={`owner-tax-chip-checkbox ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={11} />}
                          </span>
                          <span>{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                  {formErrors.categories && (
                    <span className="owner-input-error-msg">{formErrors.categories}</span>
                  )}
                </div>
              )}

              {/* Multi-Select Items Picker */}
              {formData.applyTo === 'Selected Items' && (
                <div className="owner-form-group owner-tax-multiselect-group animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="owner-form-label" style={{ marginBottom: 0 }}>
                      Select Items <span style={{ color: '#dc2626' }}>*</span>
                      <span style={{ fontSize: '11.5px', color: '#8c7b6f', fontWeight: 500, marginLeft: 6 }}>
                        ({formData.items?.length || 0} selected)
                      </span>
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        className="owner-tax-mini-btn"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            items: AVAILABLE_TAX_ITEMS.map((it) => it.name),
                          }))
                          setFormErrors((errs) => ({ ...errs, items: null }))
                        }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="owner-tax-mini-btn"
                        onClick={() => setFormData((prev) => ({ ...prev, items: [] }))}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="owner-tax-items-list-box">
                    {AVAILABLE_TAX_ITEMS.map((item) => {
                      const isSelected = formData.items?.includes(item.name)
                      return (
                        <div
                          key={item.id}
                          className={`owner-tax-item-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleFormItem(item.name)}
                        >
                          <div className={`owner-tax-item-checkbox ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={12} />}
                          </div>
                          <div className="owner-tax-item-info">
                            <span className="owner-tax-item-name">{item.name}</span>
                            <span className="owner-tax-item-meta">
                              {item.category} • ₹{item.price}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {formErrors.items && (
                    <span className="owner-input-error-msg">{formErrors.items}</span>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="owner-form-group">
                <label className="owner-form-label">Status</label>
                <div className="owner-radio-group">
                  <label className="owner-radio-item">
                    <input
                      type="radio"
                      name="taxStatus"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData({ ...formData, status: 'Active' })}
                    />
                    <span>Active</span>
                  </label>
                  <label className="owner-radio-item">
                    <input
                      type="radio"
                      name="taxStatus"
                      checked={formData.status === 'Inactive'}
                      onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  className="owner-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={handleCancelForm}
                >
                  Cancel
                </button>
                <button type="submit" className="owner-btn-primary" style={{ flex: 1 }}>
                  {editingTax ? 'Update Tax' : 'Add Tax'}
                </button>
              </div>
            </form>
          </div>
          )}

          {/* Bill Calculation Example Card (matching Screenshot 4) */}
          <div className="owner-bill-example-card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div className="owner-bill-example-icon-box">
                <Receipt size={20} />
              </div>
              <div>
                <h3 className="owner-bill-example-title">Bill Calculation Example</h3>
                <p className="owner-bill-example-sub">
                  This is how tax will be shown on a customer bill.
                </p>
              </div>
            </div>

            <div className="owner-bill-receipt-box">
              {/* Subtotal */}
              <div className="owner-bill-receipt-row">
                <span className="owner-bill-row-label">Subtotal</span>
                <span className="owner-bill-row-val">₹{billSimulation.subtotal}</span>
              </div>

              {/* Dynamic Taxes */}
              {!taxConfig.isEnabled ? (
                <div className="owner-bill-disabled-notice">
                  Taxation is currently disabled in settings (₹0 tax applied)
                </div>
              ) : billSimulation.taxes.length === 0 ? (
                <div className="owner-bill-disabled-notice">
                  No active tax rates configured
                </div>
              ) : (
                billSimulation.taxes.map((tax) => (
                  <div key={tax.id} className="owner-bill-receipt-row">
                    <span className="owner-bill-row-label">
                      {tax.name} ({tax.rate}%)
                    </span>
                    <span className="owner-bill-row-val">₹{tax.amount}</span>
                  </div>
                ))
              )}

              {/* Divider */}
              <div className="owner-bill-receipt-divider" />

              {/* Total */}
              <div className="owner-bill-receipt-row owner-bill-receipt-total">
                <span>Total</span>
                <span>₹{billSimulation.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
