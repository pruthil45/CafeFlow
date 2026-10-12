import { useState, useEffect } from 'react'
import {
  X,
  Percent,
  IndianRupee,
  Gift,
  Coffee,
  Calendar,
  AlertCircle,
} from 'lucide-react'

const PROMO_TYPES = [
  { id: 'Percentage Discount', label: 'Percentage\nDiscount', icon: 'percent' },
  { id: 'Fixed Amount Discount', label: 'Fixed Amount\nDiscount', icon: 'rupee' },
  { id: 'Buy X Get Y', label: 'Buy X Get Y', icon: 'gift' },
  { id: 'Free Item', label: 'Free Item', icon: 'coffee' },
]

const CATEGORIES = [
  'Pizzas',
  'Burgers',
  'Beverages',
  'Coffee & Espresso',
  'Bakery & Pastries',
  'Desserts',
  'Snacks & Sides',
]

const SAMPLE_MENU_ITEMS = [
  { id: 'item-001', name: 'Margherita Pizza', category: 'Pizzas' },
  { id: 'item-002', name: 'Farmhouse Pizza', category: 'Pizzas' },
  { id: 'item-003', name: 'Classic Burger', category: 'Burgers' },
  { id: 'item-004', name: 'Crispy Veg Burger', category: 'Burgers' },
  { id: 'item-005', name: 'Cappuccino', category: 'Coffee & Espresso' },
  { id: 'item-006', name: 'Iced Latte', category: 'Beverages' },
  { id: 'item-007', name: 'Cold Coffee', category: 'Beverages' },
  { id: 'item-008', name: 'French Fries', category: 'Snacks & Sides' },
  { id: 'item-009', name: 'Chocolate Brownie', category: 'Desserts' },
]

export default function CreateEditPromotionPanel({
  isOpen,
  onClose,
  promotionToEdit,
  onSavePromotion,
}) {
  const isEditing = Boolean(promotionToEdit)

  // Form State
  const [name, setName] = useState('')
  const [promoType, setPromoType] = useState('Percentage Discount')
  const [discountValue, setDiscountValue] = useState('')
  const [discountUnit, setDiscountUnit] = useState('%')
  const [buyQty, setBuyQty] = useState(2)
  const [rewardQty, setRewardQty] = useState(1)
  const [freeItemName, setFreeItemName] = useState('Cappuccino')
  const [applyTo, setApplyTo] = useState('Category') // 'All Menu Items', 'Category', 'Selected Items'
  const [category, setCategory] = useState('Pizzas')
  const [selectedItems, setSelectedItems] = useState(['item-001', 'item-002'])
  const [minOrderAmount, setMinOrderAmount] = useState('')
  const [startDate, setStartDate] = useState('2026-10-05')
  const [endDate, setEndDate] = useState('2026-10-10')
  const [usageLimit, setUsageLimit] = useState('')
  const [customerEligibility, setCustomerEligibility] = useState('All Customers')
  const [terms, setTerms] = useState('• One use per order\n• Cannot be combined with another offer')

  // Validation errors
  const [errors, setErrors] = useState({})

  // Initialize or reset form when promotionToEdit changes
  useEffect(() => {
    if (promotionToEdit) {
      setName(promotionToEdit.name || '')
      setPromoType(promotionToEdit.typeTag || 'Percentage Discount')
      setDiscountValue(promotionToEdit.discountValue?.toString() || '')
      setDiscountUnit(promotionToEdit.discountUnit || '%')
      setBuyQty(promotionToEdit.buyQty || 2)
      setRewardQty(promotionToEdit.rewardQty || 1)
      setFreeItemName(promotionToEdit.freeItemName || 'Cappuccino')
      setApplyTo(promotionToEdit.applyTo || 'All Menu Items')
      setCategory(promotionToEdit.category || 'Pizzas')
      setSelectedItems(promotionToEdit.selectedItems || [])
      setMinOrderAmount(promotionToEdit.minOrderAmount ? promotionToEdit.minOrderAmount.toString() : '')
      setStartDate(promotionToEdit.startDate || '2026-10-05')
      setEndDate(promotionToEdit.endDate || '2026-10-10')
      setUsageLimit(promotionToEdit.usageLimit ? promotionToEdit.usageLimit.toString() : '')
      setCustomerEligibility(promotionToEdit.customerEligibility || 'All Customers')
      setTerms(promotionToEdit.terms || '')
    } else {
      // Defaults matching the screenshot
      setName('20% OFF on Pizzas')
      setPromoType('Percentage Discount')
      setDiscountValue('20')
      setDiscountUnit('%')
      setBuyQty(2)
      setRewardQty(1)
      setFreeItemName('Cappuccino')
      setApplyTo('Category')
      setCategory('Pizzas')
      setSelectedItems([])
      setMinOrderAmount('500')
      setStartDate('2026-10-05')
      setEndDate('2026-10-10')
      setUsageLimit('100')
      setCustomerEligibility('All Customers')
      setTerms('• One use per order\n• Cannot be combined with another offer')
    }
    setErrors({})
  }, [promotionToEdit, isOpen])

  if (!isOpen) return null

  // Validate form before submission
  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Promotion name is required.'

    if (promoType === 'Percentage Discount') {
      const val = parseFloat(discountValue)
      if (isNaN(val) || val <= 0 || val > 100) {
        errs.discountValue = 'Please enter a valid percentage between 1 and 100.'
      }
    } else if (promoType === 'Fixed Amount Discount') {
      const val = parseFloat(discountValue)
      if (isNaN(val) || val <= 0) {
        errs.discountValue = 'Please enter a valid discount amount greater than 0.'
      }
    } else if (promoType === 'Buy X Get Y') {
      if (buyQty < 1) errs.buyQty = 'Buy quantity must be at least 1.'
      if (rewardQty < 1) errs.rewardQty = 'Reward quantity must be at least 1.'
    } else if (promoType === 'Free Item') {
      if (!freeItemName.trim()) errs.freeItemName = 'Free item name is required.'
    }

    if (applyTo === 'Category' && !category) {
      errs.category = 'Please select a menu category.'
    }
    if (applyTo === 'Selected Items' && selectedItems.length === 0) {
      errs.selectedItems = 'Please select at least one menu item.'
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errs.dates = 'End date cannot be earlier than start date.'
    }

    if (usageLimit && parseInt(usageLimit, 10) <= 0) {
      errs.usageLimit = 'Usage limit must be a positive number.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Format Validity string
    let validityString = ''
    try {
      const s = new Date(startDate)
      const eDate = new Date(endDate)
      const sFormatted = s.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      const eFormatted = eDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      validityString = `${sFormatted} – ${eFormatted}`
    } catch {
      validityString = '05 Oct – 10 Oct'
    }

    // Determine broad type for badge
    let mainType = 'Discount'
    if (promoType === 'Buy X Get Y') mainType = 'Buy X Get Y'
    else if (promoType === 'Free Item') mainType = 'Free Item'

    // Build Details string
    let detailsString = ''
    const minSpendNum = parseFloat(minOrderAmount) || 0
    if (promoType === 'Percentage Discount') {
      detailsString = `${discountValue}% off on ${applyTo === 'Category' ? `all ${category.toLowerCase()}` : applyTo === 'All Menu Items' ? 'all items' : 'selected items'}${minSpendNum > 0 ? `; Min. order: ₹${minSpendNum}` : ''}`
    } else if (promoType === 'Fixed Amount Discount') {
      detailsString = `₹${discountValue} off on ${applyTo === 'All Menu Items' ? 'orders' : applyTo === 'Category' ? category.toLowerCase() : 'selected items'}${minSpendNum > 0 ? ` above ₹${minSpendNum}` : ''}`
    } else if (promoType === 'Buy X Get Y') {
      detailsString = `Buy ${buyQty} ${category.toLowerCase()}, Get ${rewardQty} free`
    } else if (promoType === 'Free Item') {
      detailsString = `Free ${freeItemName} with any ${category ? category.toLowerCase().slice(0, -1) : 'item'}`
    }

    // Determine initial status based on dates
    const today = new Date().toISOString().split('T')[0]
    let initialStatus = promotionToEdit?.status || 'Active'
    if (!promotionToEdit) {
      if (startDate > today) {
        initialStatus = 'Scheduled'
      } else {
        initialStatus = 'Active'
      }
    }

    const payload = {
      id: promotionToEdit?.id || `promo-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      type: mainType,
      typeTag: promoType,
      discountValue: parseFloat(discountValue) || 0,
      discountUnit: promoType === 'Percentage Discount' ? '%' : '₹',
      buyQty: parseInt(buyQty, 10) || 1,
      rewardQty: parseInt(rewardQty, 10) || 1,
      freeItemName,
      applyTo,
      category: applyTo === 'Category' ? category : '',
      selectedItems: applyTo === 'Selected Items' ? selectedItems : [],
      details: detailsString,
      minOrderAmount: minSpendNum,
      validity: validityString,
      startDate,
      endDate,
      status: initialStatus,
      usage: promotionToEdit?.usage ?? 0,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      customerEligibility,
      terms,
    }

    onSavePromotion(payload)
  }

  const toggleSelectedItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <aside className="owner-promotion-side-panel animate-fade-in" aria-label="Promotion Form">
      {/* Header */}
      <div className="owner-promotion-panel-header">
        <h2 className="owner-promotion-panel-title">
          {isEditing ? 'Edit Promotion' : 'Create Promotion'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#8c7b6f', cursor: 'pointer', padding: 4 }}
          aria-label="Close promotion side panel"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Scrollable Form Body */}
        <div className="owner-promotion-panel-body">
          {/* A. Promotion Name * */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">
              Promotion Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              className="owner-promo-input"
              placeholder="e.g. 20% OFF on Pizzas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>{errors.name}</span>
            )}
          </div>

          {/* B. Promotion Type * (4 Selectable Cards) */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">
              Promotion Type <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div className="owner-promo-type-cards-grid">
              {PROMO_TYPES.map((t) => {
                const isSelected = promoType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`owner-promo-type-card-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setPromoType(t.id)
                      if (t.id === 'Percentage Discount') setDiscountUnit('%')
                      if (t.id === 'Fixed Amount Discount') setDiscountUnit('₹')
                    }}
                  >
                    <div className="owner-promo-type-card-icon">
                      {t.icon === 'percent' && <Percent size={18} />}
                      {t.icon === 'rupee' && <IndianRupee size={18} />}
                      {t.icon === 'gift' && <Gift size={18} />}
                      {t.icon === 'coffee' && <Coffee size={18} />}
                    </div>
                    <div className="owner-promo-type-card-lbl" style={{ whiteSpace: 'pre-line' }}>
                      {t.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* C. Discount Value * (Dynamic based on selected Type) */}
          {promoType === 'Percentage Discount' && (
            <div className="owner-promo-field-group">
              <label className="owner-promo-label">
                Discount Value <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="owner-promo-input"
                  placeholder="20"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <select
                  className="owner-promo-input"
                  style={{ width: 70, fontWeight: 700 }}
                  value={discountUnit}
                  onChange={(e) => setDiscountUnit(e.target.value)}
                >
                  <option value="%">%</option>
                </select>
              </div>
              {errors.discountValue && (
                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>{errors.discountValue}</span>
              )}
            </div>
          )}

          {promoType === 'Fixed Amount Discount' && (
            <div className="owner-promo-field-group">
              <label className="owner-promo-label">
                Discount Value <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontWeight: 700,
                    color: '#8c7b6f',
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  className="owner-promo-input"
                  placeholder="100"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  style={{ paddingLeft: 26 }}
                  required
                />
              </div>
              {errors.discountValue && (
                <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>{errors.discountValue}</span>
              )}
            </div>
          )}

          {promoType === 'Buy X Get Y' && (
            <div className="owner-promo-field-group">
              <label className="owner-promo-label">
                Buy & Reward Quantity <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#7a6a5e' }}>Buy Quantity</span>
                  <input
                    type="number"
                    min="1"
                    className="owner-promo-input"
                    value={buyQty}
                    onChange={(e) => setBuyQty(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: '#7a6a5e' }}>Get Free Quantity</span>
                  <input
                    type="number"
                    min="1"
                    className="owner-promo-input"
                    value={rewardQty}
                    onChange={(e) => setRewardQty(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {promoType === 'Free Item' && (
            <div className="owner-promo-field-group">
              <label className="owner-promo-label">
                Select Free Menu Item <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="owner-promo-input"
                value={freeItemName}
                onChange={(e) => setFreeItemName(e.target.value)}
                required
              >
                <option value="Cappuccino">Cappuccino</option>
                <option value="Cold Coffee">Cold Coffee</option>
                <option value="French Fries">French Fries</option>
                <option value="Garlic Bread">Garlic Bread</option>
                <option value="Chocolate Brownie">Chocolate Brownie</option>
              </select>
            </div>
          )}

          {/* D. Apply To * */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">
              Apply To <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#3b2d24', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="applyTo"
                  value="All Menu Items"
                  checked={applyTo === 'All Menu Items'}
                  onChange={() => setApplyTo('All Menu Items')}
                  style={{ accentColor: '#8c4a23' }}
                />
                All Menu Items
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#3b2d24', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="applyTo"
                  value="Category"
                  checked={applyTo === 'Category'}
                  onChange={() => setApplyTo('Category')}
                  style={{ accentColor: '#8c4a23' }}
                />
                Category
              </label>

              {applyTo === 'Category' && (
                <div style={{ paddingLeft: 22, marginTop: -2 }}>
                  <select
                    className="owner-promo-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#3b2d24', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="applyTo"
                  value="Selected Items"
                  checked={applyTo === 'Selected Items'}
                  onChange={() => setApplyTo('Selected Items')}
                  style={{ accentColor: '#8c4a23' }}
                />
                Selected Items
              </label>

              {applyTo === 'Selected Items' && (
                <div
                  style={{
                    paddingLeft: 22,
                    maxHeight: 120,
                    overflowY: 'auto',
                    border: '1px solid #ede5da',
                    borderRadius: 8,
                    padding: 8,
                    background: '#faf8f5',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {SAMPLE_MENU_ITEMS.map((item) => (
                    <label
                      key={item.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#4a3f35', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectedItem(item.id)}
                        style={{ accentColor: '#8c4a23' }}
                      />
                      {item.name} <span style={{ color: '#8c7b6f', fontSize: '11px' }}>({item.category})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.category && <span style={{ fontSize: '11px', color: '#dc2626' }}>{errors.category}</span>}
            {errors.selectedItems && <span style={{ fontSize: '11px', color: '#dc2626' }}>{errors.selectedItems}</span>}
          </div>

          {/* E. Minimum Order Amount (Optional) */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">Minimum Order Amount (Optional)</label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 700,
                  color: '#8c7b6f',
                }}
              >
                ₹
              </span>
              <input
                type="number"
                min="0"
                className="owner-promo-input"
                placeholder="500"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                style={{ paddingLeft: 26 }}
              />
            </div>
          </div>

          {/* F. Validity Period * */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">
              Validity Period <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="date"
                  className="owner-promo-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <span style={{ fontSize: '12.5px', color: '#8c7b6f', fontWeight: 600 }}>to</span>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="date"
                  className="owner-promo-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            {errors.dates && (
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>{errors.dates}</span>
            )}
          </div>

          {/* G. Usage Limit (Optional) */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">Usage Limit (Optional)</label>
            <input
              type="number"
              min="1"
              className="owner-promo-input"
              placeholder="100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
            />
            <span style={{ fontSize: '11.5px', color: '#8c7b6f' }}>
              Leave blank for unlimited usage.
            </span>
          </div>

          {/* H. Customer Eligibility */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">Customer Eligibility</label>
            <select
              className="owner-promo-input"
              value={customerEligibility}
              onChange={(e) => setCustomerEligibility(e.target.value)}
            >
              <option value="All Customers">All Customers</option>
              <option value="New Customers">New Customers</option>
              <option value="Returning Customers">Returning Customers</option>
              <option value="Loyalty Members">Loyalty Members</option>
            </select>
          </div>

          {/* I. Terms & Conditions (Optional) */}
          <div className="owner-promo-field-group">
            <label className="owner-promo-label">Terms & Conditions (Optional)</label>
            <textarea
              className="owner-promo-input"
              rows={3}
              placeholder="• One use per order&#10;• Cannot be combined with another offer"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              style={{ resize: 'vertical', fontSize: '12.5px' }}
            />
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="owner-promo-panel-footer">
          <button type="button" className="owner-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="owner-btn-primary"
            style={{
              background: '#8c4a23',
              color: '#ffffff',
              padding: '8px 18px',
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            {isEditing ? 'Save Changes' : 'Create Promotion'}
          </button>
        </div>
      </form>
    </aside>
  )
}
