import { useState } from 'react'
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  HelpCircle,
  Eye,
  GripVertical,
  Search,
  Sparkles,
} from 'lucide-react'
import '../../Owner.css'

export default function AddMenuItem({
  categories,
  addons = [],
  variations = [],
  choices = [], // backward compatibility fallback
  onSave,
  onCancel,
  showToast,
}) {
  const variationList = variations.length > 0 ? variations : (choices || [])

  // Form State - start clean without pre-filling
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[1]?.name || 'Burgers')
  const [itemType, setItemType] = useState('veg') // 'veg' | 'non-veg' | 'egg'
  const [isActive, setIsActive] = useState(true)
  const [basePrice, setBasePrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [taxRate, setTaxRate] = useState('GST 5%')
  const [displayOrder, setDisplayOrder] = useState('1')

  // Hero & Gallery Images
  const sampleImages = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=300&auto=format&fit=crop&q=80',
  ]
  const [galleryImages, setGalleryImages] = useState(sampleImages)
  const [heroImage, setHeroImage] = useState(sampleImages[0])

  // Variants State
  const [hasVariants, setHasVariants] = useState(false)
  const [variantsList, setVariantsList] = useState([])
  const [showAddVariantModal, setShowAddVariantModal] = useState(false)
  const [newVarName, setNewVarName] = useState('')
  const [newVarPrice, setNewVarPrice] = useState('')
  const [newVarStock, setNewVarStock] = useState('25')

  // Availability State
  const [hasAvailabilityRule, setHasAvailabilityRule] = useState(false)
  const [startTime, setStartTime] = useState('11:00')
  const [endTime, setEndTime] = useState('23:00')
  const [availableDays, setAvailableDays] = useState([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ])

  // Add-ons State
  const [allowAddons, setAllowAddons] = useState(false)
  const [addonSearch, setAddonSearch] = useState('')
  const [selectedAddonIds, setSelectedAddonIds] = useState([])

  // Variations State
  const [allowVariations, setAllowVariations] = useState(false)
  const [variationSearch, setVariationSearch] = useState('')
  const [selectedVariationIds, setSelectedVariationIds] = useState([])

  // Mobile Device Preview Toggle
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  // Handlers
  const handleToggleAddon = (id) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleVariation = (id) => {
    setSelectedVariationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleAddVariantSubmit = (e) => {
    e.preventDefault()
    if (!newVarName.trim() || !newVarPrice) return
    const newVar = {
      id: `v-${Date.now()}`,
      name: newVarName.trim(),
      price: parseFloat(newVarPrice) || 0,
      stock: parseInt(newVarStock, 10) || 0,
      active: true,
    }
    setVariantsList((prev) => [...prev, newVar])
    setNewVarName('')
    setNewVarPrice('')
    setNewVarStock('25')
    setShowAddVariantModal(false)
    showToast?.('Variant added successfully', 'success')
  }

  const handleDeleteVariant = (id) => {
    setVariantsList((prev) => prev.filter((v) => v.id !== id))
  }

  const handleToggleVariantStatus = (id) => {
    setVariantsList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    )
  }

  const handleSave = () => {
    if (!name.trim()) {
      showToast?.('Please enter an item name', 'error')
      return
    }
    if (!basePrice || isNaN(basePrice)) {
      showToast?.('Please enter a valid base price', 'error')
      return
    }

    const newItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category: category,
      price: parseFloat(basePrice),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      taxRate: taxRate,
      itemType: itemType,
      active: isActive,
      image: heroImage,
      gallery: galleryImages,
      displayOrder: parseInt(displayOrder, 10) || 1,
      variants: hasVariants ? variantsList : [],
      addons: allowAddons ? selectedAddonIds : [],
      variations: allowVariations ? selectedVariationIds : [],
      choices: allowVariations ? selectedVariationIds : [],
      availability: hasAvailabilityRule
        ? {
            enabled: true,
            hours: `${startTime} - ${endTime}`,
            days: availableDays,
          }
        : { enabled: false, hours: 'All day', days: ['All'] },
      bestseller: false,
      popular: true,
      spicy: itemType === 'non-veg',
      isNew: true,
      sku: `CF-${category.substring(0, 3).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      nutrition: {
        calories: 450,
        protein: '22g',
        carbs: '38g',
        fat: '19g',
      },
    }

    onSave?.(newItem)
  }

  // Filtered Addons for list
  const filteredAddons = addons.filter((a) =>
    a.name.toLowerCase().includes(addonSearch.toLowerCase())
  )

  // Filtered Variations for list
  const filteredVariations = variationList.filter((v) =>
    v.name.toLowerCase().includes(variationSearch.toLowerCase())
  )

  return (
    <div className="owner-menu-page animate-fade-in">
      {/* Top Breadcrumb & Heading Bar */}
      <div className="owner-page-top-bar" style={{ marginBottom: 18 }}>
        <div className="owner-page-top-bar__left">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12.5,
              color: '#8c7b6f',
              marginBottom: 4,
            }}
          >
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                color: '#8c4a23',
                cursor: 'pointer',
                fontWeight: 600,
                padding: 0,
              }}
            >
              Menu
            </button>
            <span>&gt;</span>
            <span style={{ color: '#4a3f35', fontWeight: 600 }}>
              Add New Item
            </span>
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--owner-espresso)',
              margin: '0 0 4px 0',
            }}
          >
            Add New Menu Item
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--owner-text-muted)',
              margin: 0,
            }}
          >
            Create a new item for your café menu. You can add variants,
            add-ons, choices and more.
          </p>
        </div>

        <div
          className="owner-page-top-bar__actions"
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          {/* Mobile Preview Toggle for responsiveness */}
          <button
            type="button"
            className="owner-btn-secondary"
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            title="Toggle interactive mobile preview mockup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: showMobilePreview ? '#f4ece0' : '#ffffff',
              borderColor: showMobilePreview ? '#8c4a23' : '#e2dad0',
              color: showMobilePreview ? '#8c4a23' : '#4a3f35',
            }}
          >
            <Eye size={15} />
            <span>{showMobilePreview ? 'Hide Mobile Mockup' : 'Mobile Mockup'}</span>
          </button>

          <button
            type="button"
            className="owner-btn-secondary"
            onClick={onCancel}
            style={{ padding: '8px 18px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="owner-btn-primary"
            onClick={handleSave}
            style={{
              padding: '8px 22px',
              backgroundColor: '#8c4a23',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(140, 74, 35, 0.3)',
            }}
          >
            Save Item
          </button>
        </div>
      </div>

      {/* Main 2-Column Form Layout with Optional Side Mobile Preview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: showMobilePreview ? '1fr 340px' : '1fr',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left Form Area (2-Column Grid) */}
        <div className="owner-add-item-layout">
          {/* LEFT COLUMN: Basic Info, Category & Type, Pricing, Variants, Availability */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Card 1: Basic Information */}
            <div className="owner-form-card">
              <h2 className="owner-form-card-title">Basic Information</h2>

              <div className="owner-field-group">
                <label className="owner-field-label">
                  Item Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  className="owner-form-input"
                  placeholder="e.g. Classic Burger"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={60}
                />
              </div>

              <div className="owner-field-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <label className="owner-field-label">Description</label>
                  <span style={{ fontSize: 11, color: '#9c8e82' }}>
                    {description.length}/300
                  </span>
                </div>
                <textarea
                  className="owner-form-textarea"
                  rows={3}
                  placeholder="Describe taste, ingredients, notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={300}
                />
              </div>

              {/* Item Images Grid */}
              <div className="owner-field-group">
                <label className="owner-field-label">Item Images</label>
                <div className="owner-images-upload-grid">
                  {/* Hero Image Box */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={heroImage}
                      alt={name}
                      className="owner-image-hero-preview"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 6,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      Primary Cover
                    </div>
                  </div>

                  {/* Dropzone / Upload Box */}
                  <label className="owner-image-dropzone">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (uploadEvt) => {
                            const newUrl = uploadEvt.target.result
                            setGalleryImages((prev) => [newUrl, ...prev])
                            setHeroImage(newUrl)
                            showToast?.('Image uploaded successfully', 'success')
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <Upload size={22} style={{ color: '#8c4a23' }} />
                    <span style={{ fontWeight: 700, color: '#8c4a23' }}>
                      + Upload Images
                    </span>
                    <span style={{ fontSize: 11, color: '#9c8e82' }}>
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>

                {/* Gallery Thumbnails Strip */}
                <div
                  className="owner-gallery-strip"
                  style={{ marginTop: 10 }}
                >
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: 6,
                        border:
                          heroImage === imgUrl
                            ? '2px solid #8c4a23'
                            : '1px solid #e2dad0',
                        overflow: 'hidden',
                      }}
                      onClick={() => setHeroImage(imgUrl)}
                      title="Click to set as primary image"
                    >
                      <img
                        src={imgUrl}
                        alt="thumb"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {heroImage === imgUrl && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: '#8c4a23',
                            color: '#fff',
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={9} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Category & Type */}
            <div className="owner-form-card">
              <h2 className="owner-form-card-title">Category & Type</h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.6fr 1fr',
                  gap: 14,
                  alignItems: 'center',
                }}
              >
                {/* Category Dropdown */}
                <div className="owner-field-group">
                  <label className="owner-field-label">
                    Category <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    className="owner-form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Item Type (Veg / Non-Veg / Egg) */}
                <div className="owner-field-group">
                  <label className="owner-field-label">
                    Item Type <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      className={`owner-type-btn ${
                        itemType === 'veg' ? 'owner-type-btn--active-veg' : ''
                      }`}
                      onClick={() => setItemType('veg')}
                    >
                      <span className="owner-type-dot veg"></span>
                      <span>Veg</span>
                    </button>
                    <button
                      type="button"
                      className={`owner-type-btn ${
                        itemType === 'non-veg'
                          ? 'owner-type-btn--active-nonveg'
                          : ''
                      }`}
                      onClick={() => setItemType('non-veg')}
                    >
                      <span className="owner-type-dot nonveg"></span>
                      <span>Non-Veg</span>
                    </button>
                    <button
                      type="button"
                      className={`owner-type-btn ${
                        itemType === 'egg' ? 'owner-type-btn--active-egg' : ''
                      }`}
                      onClick={() => setItemType('egg')}
                    >
                      <span className="owner-type-dot egg"></span>
                      <span>Egg</span>
                    </button>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="owner-field-group">
                  <label className="owner-field-label">Status</label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      height: 38,
                    }}
                  >
                    <label className="owner-toggle-switch">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <span className="owner-toggle-slider"></span>
                    </label>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isActive ? '#10b981' : '#8c7b6f',
                      }}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Pricing */}
            <div className="owner-form-card">
              <h2 className="owner-form-card-title">Pricing</h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 14,
                }}
              >
                <div className="owner-field-group">
                  <label className="owner-field-label">
                    Base Price (₹) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="owner-form-input"
                    placeholder="200"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </div>

                <div className="owner-field-group">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 5,
                    }}
                  >
                    <label className="owner-field-label" style={{ margin: 0 }}>
                      Compare Price (Optional)
                    </label>
                    <HelpCircle size={13} color="#9c8e82" title="Original price for strikethrough discount display" />
                  </div>
                  <input
                    type="number"
                    className="owner-form-input"
                    placeholder="240"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                  />
                </div>

                <div className="owner-field-group">
                  <label className="owner-field-label">Tax</label>
                  <select
                    className="owner-form-select"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  >
                    <option value="GST 5%">GST 5%</option>
                    <option value="GST 12%">GST 12%</option>
                    <option value="GST 18%">GST 18%</option>
                    <option value="Tax Exempt">Tax Exempt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 4: Variants (Optional) */}
            <div className="owner-form-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2 className="owner-form-card-title">Variants (Optional)</h2>
                {hasVariants && (
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    style={{
                      fontSize: 12,
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#8c4a23',
                      borderColor: '#d5c8b5',
                    }}
                    onClick={() => setShowAddVariantModal(true)}
                  >
                    <Plus size={13} />
                    <span>Add Variant</span>
                  </button>
                )}
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4a3f35',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  style={{ accentColor: '#8c4a23', width: 16, height: 16 }}
                />
                <span>This item has variants (e.g., size, flavor)</span>
              </label>

              {hasVariants && (
                <div style={{ marginTop: 10, overflowX: 'auto' }}>
                  <table className="owner-variants-table">
                    <thead>
                      <tr>
                        <th style={{ width: 30 }}></th>
                        <th>Variant Name</th>
                        <th>Price (₹)</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variantsList.map((variant) => (
                        <tr key={variant.id}>
                          <td style={{ color: '#b5a798' }}>
                            <GripVertical size={14} />
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--owner-espresso)' }}>
                            {variant.name}
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{variant.price}</td>
                          <td>
                            <span
                              style={{
                                background: '#f5efe6',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11.5,
                                fontWeight: 600,
                              }}
                            >
                              {variant.stock} in stock
                            </span>
                          </td>
                          <td>
                            <label className="owner-toggle-switch">
                              <input
                                type="checkbox"
                                checked={variant.active}
                                onChange={() =>
                                  handleToggleVariantStatus(variant.id)
                                }
                              />
                              <span className="owner-toggle-slider"></span>
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#7a6a5e',
                                  padding: 3,
                                }}
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: '#dc2626',
                                  padding: 3,
                                }}
                                title="Delete"
                                onClick={() => handleDeleteVariant(variant.id)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Card 5: Availability */}
            <div className="owner-form-card">
              <h2 className="owner-form-card-title">Availability</h2>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#4a3f35',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={hasAvailabilityRule}
                  onChange={(e) => setHasAvailabilityRule(e.target.checked)}
                  style={{ accentColor: '#8c4a23', width: 16, height: 16 }}
                />
                <span>Set availability for this item (e.g., specific time, days)</span>
              </label>

              {hasAvailabilityRule && (
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    background: '#fdfbf7',
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #ebdccb',
                  }}
                >
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <label className="owner-field-label">Available From</label>
                      <input
                        type="time"
                        className="owner-form-input"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="owner-field-label">Available Until</label>
                      <input
                        type="time"
                        className="owner-form-input"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="owner-field-label">Available Days</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                        (day) => {
                          const isSelected = availableDays.includes(day)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setAvailableDays((prev) =>
                                  prev.includes(day)
                                    ? prev.filter((d) => d !== day)
                                    : [...prev, day]
                                )
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 600,
                                border: isSelected
                                  ? '1px solid #8c4a23'
                                  : '1px solid #e2dad0',
                                background: isSelected ? '#8c4a23' : '#fff',
                                color: isSelected ? '#fff' : '#6b5d52',
                                cursor: 'pointer',
                              }}
                            >
                              {day}
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Add-ons, Choices, Display Order */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Right Card 1: Add-ons */}
            <div className="owner-form-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  id="allow-addons-chk"
                  checked={allowAddons}
                  onChange={(e) => setAllowAddons(e.target.checked)}
                  style={{
                    accentColor: '#8c4a23',
                    width: 16,
                    height: 16,
                    marginTop: 2,
                  }}
                />
                <div>
                  <label
                    htmlFor="allow-addons-chk"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--owner-espresso)',
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    Allow add-ons for this item
                  </label>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#8c7b6f',
                      margin: '2px 0 0 0',
                    }}
                  >
                    Customers can add extra items like cheese, fries, etc.
                  </p>
                </div>
              </div>

              {allowAddons && (
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      position: 'relative',
                      marginBottom: 10,
                    }}
                  >
                    <Search
                      size={14}
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
                      value={addonSearch}
                      onChange={(e) => setAddonSearch(e.target.value)}
                      style={{ paddingLeft: 30, fontSize: 12.5 }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      maxHeight: 220,
                      overflowY: 'auto',
                      paddingRight: 4,
                    }}
                  >
                    {filteredAddons.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id)
                      return (
                        <label
                          key={addon.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 6,
                            background: isChecked ? '#fbf7f0' : '#ffffff',
                            border: isChecked
                              ? '1px solid #ebdccb'
                              : '1px solid #f2ece4',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleAddon(addon.id)}
                              style={{
                                accentColor: '#8c4a23',
                                width: 15,
                                height: 15,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--owner-espresso)',
                              }}
                            >
                              {addon.name}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: '#8c4a23',
                            }}
                          >
                            ₹{addon.price}
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    style={{
                      marginTop: 10,
                      width: '100%',
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px dashed #d5c8b5',
                      background: '#faf8f5',
                      color: '#8c4a23',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                    onClick={() =>
                      showToast?.('Create add-ons directly in Add-ons tab', 'info')
                    }
                  >
                    <Plus size={14} />
                    <span>+ Add New Add-on</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Card 2: Variations (Optional) */}
            <div className="owner-form-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  id="allow-variations-chk"
                  checked={allowVariations}
                  onChange={(e) => setAllowVariations(e.target.checked)}
                  style={{
                    accentColor: '#8c4a23',
                    width: 16,
                    height: 16,
                    marginTop: 2,
                  }}
                />
                <div>
                  <label
                    htmlFor="allow-variations-chk"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--owner-espresso)',
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    Allow variations for this item
                  </label>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#8c7b6f',
                      margin: '2px 0 0 0',
                    }}
                  >
                    Customers can choose options like size, bread type, spice level, milk, etc.
                  </p>
                </div>
              </div>

              {allowVariations && (
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      position: 'relative',
                      marginBottom: 10,
                    }}
                  >
                    <Search
                      size={14}
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
                      value={variationSearch}
                      onChange={(e) => setVariationSearch(e.target.value)}
                      style={{ paddingLeft: 30, fontSize: 12.5 }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      maxHeight: 220,
                      overflowY: 'auto',
                      paddingRight: 4,
                    }}
                  >
                    {filteredVariations.map((variation) => {
                      const isChecked = selectedVariationIds.includes(variation.id)
                      return (
                        <label
                          key={variation.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: 6,
                            background: isChecked ? '#fbf7f0' : '#ffffff',
                            border: isChecked
                              ? '1px solid #ebdccb'
                              : '1px solid #f2ece4',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleVariation(variation.id)}
                              style={{
                                accentColor: '#8c4a23',
                                width: 15,
                                height: 15,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--owner-espresso)',
                              }}
                            >
                              {variation.name}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color:
                                variation.type === 'single' ? '#0369a1' : '#7c3aed',
                              background:
                                variation.type === 'single' ? '#e0f2fe' : '#ede9fe',
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {variation.type === 'single'
                              ? 'Single Select'
                              : 'Multi Select'}
                          </span>
                        </label>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    style={{
                      marginTop: 10,
                      width: '100%',
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px dashed #d5c8b5',
                      background: '#faf8f5',
                      color: '#8c4a23',
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                    onClick={() =>
                      showToast?.('Create variations in Variations tab', 'info')
                    }
                  >
                    <Plus size={14} />
                    <span>+ Add New Variation Group</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Card 3: Display Order */}
            <div className="owner-form-card">
              <h2 className="owner-form-card-title">Display Order</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  min="1"
                  className="owner-form-input"
                  style={{ width: 100 }}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
                <span style={{ fontSize: 12, color: '#8c7b6f' }}>
                  Determines position inside category (lower numbers appear first)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Right Column: Interactive Mobile Mockup Device as shown in screenshot */}
        {showMobilePreview && (
          <div
            className="owner-mobile-preview-device"
            style={{
              position: 'sticky',
              top: 20,
              background: '#1a1816',
              borderRadius: 36,
              padding: '12px 10px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              border: '4px solid #2e2a25',
              width: 320,
              margin: '0 auto',
            }}
          >
            {/* Phone Notch/Island */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '2px 14px 6px',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <span>9:41</span>
              <div
                style={{
                  width: 60,
                  height: 14,
                  background: '#000',
                  borderRadius: 10,
                }}
              ></div>
              <span>100%</span>
            </div>

            {/* Screen Inner */}
            <div
              style={{
                background: '#fdfbf7',
                borderRadius: 26,
                overflow: 'hidden',
                height: 580,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Mobile Header */}
              <div
                style={{
                  padding: '10px 12px',
                  background: '#fff',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={16} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Add Item</span>
                </div>
                <button
                  style={{
                    background: '#8c4a23',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>

              {/* Mobile Content Scroll */}
              <div
                style={{
                  padding: 10,
                  overflowY: 'auto',
                  flex: 1,
                  fontSize: 11.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div>
                  <img
                    src={heroImage}
                    alt={name}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 10,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      gap: 4,
                      marginTop: 6,
                      overflowX: 'auto',
                    }}
                  >
                    {galleryImages.slice(0, 4).map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="thumb"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          objectFit: 'cover',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#fff',
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #ebdccb',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#33271e' }}>
                    {name || 'Item Name'}
                  </div>
                  <div style={{ color: '#8c7b6f', fontSize: 10.5, marginTop: 2 }}>
                    {description || 'Item description...'}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 800, color: '#8c4a23', fontSize: 14 }}>
                      ₹{basePrice || '0'}
                    </span>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        background:
                          itemType === 'veg'
                            ? '#dcfce7'
                            : itemType === 'non-veg'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          itemType === 'veg'
                            ? '#15803d'
                            : itemType === 'non-veg'
                            ? '#b91c1c'
                            : '#b45309',
                        fontWeight: 700,
                      }}
                    >
                      {itemType.toUpperCase()}
                    </span>
                  </div>
                </div>

                {hasVariants && variantsList.length > 0 && (
                  <div
                    style={{
                      background: '#fff',
                      padding: 8,
                      borderRadius: 8,
                      border: '1px solid #ebdccb',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>
                      Variants ({variantsList.length})
                    </div>
                    {variantsList.map((v) => (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '3px 0',
                          borderBottom: '1px dashed #f0eae1',
                        }}
                      >
                        <span>{v.name}</span>
                        <span style={{ fontWeight: 700 }}>₹{v.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Variant */}
      {showAddVariantModal && (
        <div className="owner-modal-overlay">
          <div
            className="owner-modal-card"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Add New Variant
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowAddVariantModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddVariantSubmit}>
              <div className="owner-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="owner-field-label">Variant Name *</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    placeholder="e.g. Regular, Large, Double Patty"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="owner-field-label">Price (₹) *</label>
                  <input
                    type="number"
                    className="owner-form-input"
                    placeholder="220"
                    value={newVarPrice}
                    onChange={(e) => setNewVarPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="owner-field-label">Stock Quantity</label>
                  <input
                    type="number"
                    className="owner-form-input"
                    placeholder="50"
                    value={newVarStock}
                    onChange={(e) => setNewVarStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setShowAddVariantModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="owner-btn-primary"
                  style={{ background: '#8c4a23' }}
                >
                  Add Variant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
