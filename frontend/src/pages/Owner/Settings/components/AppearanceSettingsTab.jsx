import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  Trash2,
  Eye,
  Smartphone,
  Laptop,
  ChevronLeft,
  Search,
  Heart,
  Star,
  Coffee,
  ShoppingBag,
  Layers,
  Home,
  Check,
} from 'lucide-react'
import {
  DEFAULT_APPEARANCE_SETTINGS,
  PRESET_BRAND_COLORS,
  PRESET_SIDEBAR_COLORS,
} from '../data/settingsMockData'

export default function AppearanceSettingsTab({ onShowToast }) {
  const navigate = useNavigate()

  // Load from localStorage or defaults
  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem('cafeflow_appearance_settings')
    if (saved) {
      try {
        return { ...DEFAULT_APPEARANCE_SETTINGS, ...JSON.parse(saved) }
      } catch (e) {
        /* fallback */
      }
    }
    return DEFAULT_APPEARANCE_SETTINGS
  })

  const [customHexInput, setCustomHexInput] = useState(appearance.brandColor)
  const [customSidebarHex, setCustomSidebarHex] = useState(appearance.sidebarBg)
  const [hexError, setHexError] = useState('')
  const [previewDevice, setPreviewDevice] = useState(appearance.previewDevice || 'mobile')

  const logoInputRef = useRef(null)
  const headerInputRef = useRef(null)

  // Sync custom hex inputs if appearance changes
  useEffect(() => {
    setCustomHexInput(appearance.brandColor)
    setCustomSidebarHex(appearance.sidebarBg)
  }, [appearance.brandColor, appearance.sidebarBg])

  // Handlers for logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file (PNG, JPG, SVG).', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      if (onShowToast) onShowToast('Logo image must be smaller than 2MB.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAppearance((prev) => ({ ...prev, logoImage: event.target.result }))
      if (onShowToast) onShowToast('Logo updated successfully!')
    }
    reader.readAsDataURL(file)
  }

  // Handlers for header image upload
  const handleHeaderUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file.', 'error')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      if (onShowToast) onShowToast('Header image must be smaller than 3MB.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAppearance((prev) => ({ ...prev, headerImage: event.target.result }))
      if (onShowToast) onShowToast('Header image updated successfully!')
    }
    reader.readAsDataURL(file)
  }

  // Save brand color validation
  const handleSaveBrandColor = () => {
    const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/
    if (!hexRegex.test(customHexInput)) {
      setHexError('Invalid hex color format (e.g. #B84513)')
      return
    }
    setHexError('')
    setAppearance((prev) => ({ ...prev, brandColor: customHexInput }))
    if (onShowToast) onShowToast(`Brand color set to ${customHexInput}`)
  }

  // Save all settings to localStorage
  const handleSaveAll = () => {
    localStorage.setItem('cafeflow_appearance_settings', JSON.stringify(appearance))
    if (onShowToast) onShowToast('Appearance settings saved successfully!')
  }

  // Resolved colors for preview
  const resolvedActiveColor =
    appearance.activeMenuChoice === 'brand'
      ? appearance.brandColor
      : appearance.customActiveColor || appearance.brandColor

  const resolvedSidebarText =
    appearance.sidebarTextColor === 'light' ? '#FFFFFF' : '#111827'

  const resolvedSidebarMuted =
    appearance.sidebarTextColor === 'light'
      ? 'rgba(255, 255, 255, 0.65)'
      : 'rgba(0, 0, 0, 0.65)'

  return (
    <div className="owner-appearance-page">
      {/* Header with Breadcrumbs & Title */}
      <div className="owner-settings-header-block">
        <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="owner-breadcrumb-link"
            onClick={() => navigate('/owner/settings')}
          >
            Settings
          </button>
          <span className="owner-breadcrumb-sep">/</span>
          <span className="owner-breadcrumb-current">Appearance</span>
        </nav>

        <h1 className="owner-settings-main-title">6. Appearance</h1>
        <p className="owner-settings-main-subtitle">
          Customize how this café looks across the platform.
        </p>
      </div>

      {/* Main 2-Column Layout: Controls on Left, Live Preview on Right */}
      <div className="owner-appearance-grid">
        {/* ============================================================== */}
        {/* LEFT COLUMN: APPEARANCE CONFIGURATION CONTROLS                */}
        {/* ============================================================== */}
        <div className="owner-appearance-controls-col">
          {/* 1. Logo */}
          <div className="owner-appearance-card">
            <h2 className="owner-appearance-card-title">1. Logo</h2>
            <p className="owner-appearance-card-sub">
              Upload your restaurant logo. This will be used in the sidebar, menu and customer pages.
            </p>

            <div className="owner-logo-box">
              <img
                src={appearance.logoImage}
                alt="Logo Preview"
                className="owner-logo-thumb"
              />
              <span className="owner-logo-name">{appearance.cafeName || 'Café Aroma'}</span>
            </div>

            <input
              type="file"
              ref={logoInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <div className="owner-appearance-btn-row">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload size={14} /> Change Logo
              </button>
              <button
                type="button"
                className="owner-btn-outline-danger"
                onClick={() => {
                  setAppearance((prev) => ({
                    ...prev,
                    logoImage: DEFAULT_APPEARANCE_SETTINGS.logoImage,
                  }))
                  if (onShowToast) onShowToast('Logo reset to default')
                }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>

            <span className="owner-appearance-helper">
              Recommended: 200 × 200 px (1:1) PNG, JPG or SVG with transparent background.
            </span>
          </div>

          {/* 2. Header Image */}
          <div className="owner-appearance-card">
            <h2 className="owner-appearance-card-title">2. Header Image</h2>
            <p className="owner-appearance-card-sub">
              Upload a header image for your restaurant. This will be shown on customer menu and profile page.
            </p>

            <div
              className="owner-header-preview-box"
              style={{ backgroundImage: `url("${appearance.headerImage}")` }}
            >
              <button
                type="button"
                className="owner-header-overlay-btn"
                onClick={() => headerInputRef.current?.click()}
              >
                <Upload size={13} /> Change Image
              </button>
            </div>

            <input
              type="file"
              ref={headerInputRef}
              onChange={handleHeaderUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <span className="owner-appearance-helper">
              Recommended: 1920 × 600 px (16:5) JPG or PNG, Max 2MB.
            </span>
          </div>

          {/* 3. Brand Color */}
          <div className="owner-appearance-card">
            <h2 className="owner-appearance-card-title">3. Brand Color</h2>
            <p className="owner-appearance-card-sub">
              Choose your brand color. This color will be used for accents and highlights.
            </p>

            <div className="owner-color-swatches-row">
              {PRESET_BRAND_COLORS.map((hex) => {
                const isSelected = appearance.brandColor.toLowerCase() === hex.toLowerCase()
                return (
                  <button
                    key={hex}
                    type="button"
                    className={`owner-color-swatch-circle ${isSelected ? 'active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => {
                      setAppearance((prev) => ({ ...prev, brandColor: hex }))
                      setCustomHexInput(hex)
                      setHexError('')
                    }}
                    aria-label={`Select brand color ${hex}`}
                  >
                    {isSelected && <Check size={14} color="#ffffff" />}
                  </button>
                )
              })}
            </div>

            <div className="owner-hex-input-row">
              <span
                className="owner-hex-preview-dot"
                style={{ backgroundColor: appearance.brandColor }}
              />
              <input
                type="text"
                className={`owner-hex-input ${hexError ? 'error' : ''}`}
                value={customHexInput}
                onChange={(e) => {
                  setCustomHexInput(e.target.value)
                  if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(e.target.value)) {
                    setHexError('')
                    setAppearance((prev) => ({ ...prev, brandColor: e.target.value }))
                  }
                }}
                placeholder="#B84513"
              />
              <button
                type="button"
                className="owner-btn-primary"
                style={{ padding: '7px 16px', fontSize: '13px' }}
                onClick={handleSaveBrandColor}
              >
                Save Color
              </button>
            </div>
            {hexError && <span className="owner-input-error-msg">{hexError}</span>}
          </div>

          {/* 4. Sidebar Appearance */}
          <div className="owner-appearance-card">
            <h2 className="owner-appearance-card-title">4. Sidebar Appearance</h2>
            <p className="owner-appearance-card-sub">
              Customize the sidebar colors and text for the owner/staff panel.
            </p>

            {/* Sidebar Background Color */}
            <div className="owner-appearance-subblock">
              <label className="owner-appearance-label">Sidebar Background Color</label>
              <div className="owner-color-swatches-row">
                {PRESET_SIDEBAR_COLORS.map((hex) => {
                  const isSelected = appearance.sidebarBg.toLowerCase() === hex.toLowerCase()
                  return (
                    <button
                      key={hex}
                      type="button"
                      className={`owner-color-swatch-circle ${isSelected ? 'active' : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        setAppearance((prev) => ({ ...prev, sidebarBg: hex }))
                        setCustomSidebarHex(hex)
                      }}
                      aria-label={`Select sidebar color ${hex}`}
                    >
                      {isSelected && <Check size={14} color="#ffffff" />}
                    </button>
                  )
                })}
              </div>

              <div className="owner-hex-input-row">
                <span
                  className="owner-hex-preview-dot"
                  style={{ backgroundColor: appearance.sidebarBg }}
                />
                <input
                  type="text"
                  className="owner-hex-input"
                  value={customSidebarHex}
                  onChange={(e) => {
                    setCustomSidebarHex(e.target.value)
                    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(e.target.value)) {
                      setAppearance((prev) => ({ ...prev, sidebarBg: e.target.value }))
                    }
                  }}
                  placeholder="#3B1F14"
                />
              </div>
            </div>

            {/* Sidebar Text Color */}
            <div className="owner-appearance-subblock">
              <label className="owner-appearance-label">Sidebar Text Color</label>
              <div className="owner-radio-group">
                <label className="owner-radio-item">
                  <input
                    type="radio"
                    name="sidebarTextColor"
                    checked={appearance.sidebarTextColor === 'light'}
                    onChange={() =>
                      setAppearance((prev) => ({ ...prev, sidebarTextColor: 'light' }))
                    }
                  />
                  <span>Light (White)</span>
                </label>
                <label className="owner-radio-item">
                  <input
                    type="radio"
                    name="sidebarTextColor"
                    checked={appearance.sidebarTextColor === 'dark'}
                    onChange={() =>
                      setAppearance((prev) => ({ ...prev, sidebarTextColor: 'dark' }))
                    }
                  />
                  <span>Dark (Black)</span>
                </label>
              </div>
            </div>

            {/* Active Menu Color */}
            <div className="owner-appearance-subblock">
              <label className="owner-appearance-label">Active Menu Color</label>
              <div className="owner-radio-group">
                <label className="owner-radio-item">
                  <input
                    type="radio"
                    name="activeMenuChoice"
                    checked={appearance.activeMenuChoice === 'brand'}
                    onChange={() =>
                      setAppearance((prev) => ({ ...prev, activeMenuChoice: 'brand' }))
                    }
                  />
                  <span>Use Brand Color</span>
                </label>
                <label className="owner-radio-item">
                  <input
                    type="radio"
                    name="activeMenuChoice"
                    checked={appearance.activeMenuChoice === 'custom'}
                    onChange={() =>
                      setAppearance((prev) => ({ ...prev, activeMenuChoice: 'custom' }))
                    }
                  />
                  <span>Custom Color</span>
                </label>
              </div>

              {appearance.activeMenuChoice === 'custom' && (
                <div className="owner-hex-input-row" style={{ marginTop: 10 }}>
                  <span
                    className="owner-hex-preview-dot"
                    style={{ backgroundColor: appearance.customActiveColor || '#8C4A23' }}
                  />
                  <input
                    type="text"
                    className="owner-hex-input"
                    value={appearance.customActiveColor || '#8C4A23'}
                    onChange={(e) =>
                      setAppearance((prev) => ({
                        ...prev,
                        customActiveColor: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="owner-appearance-bottom-nav">
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={() => navigate('/owner/settings')}
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="button"
              className="owner-btn-primary"
              onClick={handleSaveAll}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW PANEL                  */}
        {/* ============================================================== */}
        <div className="owner-appearance-preview-col">
          <div className="owner-live-preview-panel">
            {/* Live Preview Header */}
            <div className="owner-live-preview-header">
              <div>
                <h3 className="owner-live-preview-title">
                  <Eye size={18} color="#8B4513" /> Live Preview
                </h3>
                <p className="owner-live-preview-sub">
                  See how your café will look for customers and staff across devices.
                </p>
              </div>

              <div className="owner-preview-tabs">
                <button
                  type="button"
                  className={`owner-preview-tab ${previewDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone size={13} /> Mobile View
                </button>
                <button
                  type="button"
                  className={`owner-preview-tab ${previewDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Laptop size={13} /> Desktop View
                </button>
              </div>
            </div>

            {/* Previews Layout matching Screenshot 1 */}
            <div className={`owner-dual-previews-wrap ${previewDevice === 'desktop' ? 'desktop-mode' : ''}`}>
              {/* Preview 1: Customer View (Mobile Phone Frame) */}
              <div className="owner-preview-subcol">
                <div className="owner-preview-col-title">Customer View (Mobile)</div>
                <div className="owner-phone-frame">
                  {/* Phone Status Bar */}
                  <div className="owner-phone-status-bar">
                    <span>9:41</span>
                    <div className="owner-phone-notch" />
                    <span>5G 100%</span>
                  </div>

                  {/* Header Image Banner */}
                  <div
                    className="owner-phone-header-img"
                    style={{ backgroundImage: `url("${appearance.headerImage}")` }}
                  >
                    <div className="owner-phone-header-overlay">
                      <ChevronLeft size={14} />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Search size={12} />
                        <Heart size={12} />
                      </div>
                    </div>
                  </div>

                  {/* Store Info Card */}
                  <div className="owner-phone-store-card">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <img
                        src={appearance.logoImage}
                        alt="Logo"
                        className="owner-phone-store-logo"
                      />
                      <div>
                        <div className="owner-phone-store-name">
                          {appearance.cafeName || 'Café Aroma'}
                        </div>
                        <div className="owner-phone-store-sub">
                          Café • Italian • Bakery
                        </div>
                      </div>
                    </div>

                    <div className="owner-phone-meta-row">
                      <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Star size={10} fill="#d97706" /> 4.8 (1.2K+)
                      </span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>● Open</span>
                      <span style={{ color: '#6b7280' }}>09:00 AM - 11:00 PM</span>
                    </div>
                  </div>

                  {/* Categories Pills */}
                  <div className="owner-phone-cat-pills">
                    <span
                      className="owner-phone-pill active"
                      style={{ backgroundColor: appearance.brandColor }}
                    >
                      All
                    </span>
                    <span className="owner-phone-pill">Coffee</span>
                    <span className="owner-phone-pill">Snacks</span>
                    <span className="owner-phone-pill">Burgers</span>
                    <span className="owner-phone-pill">Desserts</span>
                  </div>

                  {/* Popular Items */}
                  <div className="owner-phone-section-title">
                    <span>Popular Items</span>
                    <span style={{ color: appearance.brandColor, fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>
                      View All →
                    </span>
                  </div>

                  <div className="owner-phone-items-grid">
                    <div className="owner-phone-item-card">
                      <div className="owner-phone-item-icon-box" style={{ background: '#EFEBE9' }}>
                        <Coffee size={18} color="#8B4513" />
                      </div>
                      <div className="owner-phone-item-name">Cappuccino</div>
                      <div className="owner-phone-item-price" style={{ color: appearance.brandColor }}>
                        ₹180
                      </div>
                    </div>

                    <div className="owner-phone-item-card">
                      <div className="owner-phone-item-icon-box" style={{ background: '#FFF8E1' }}>
                        <ShoppingBag size={18} color="#D97706" />
                      </div>
                      <div className="owner-phone-item-name">Classic Burger</div>
                      <div className="owner-phone-item-price" style={{ color: appearance.brandColor }}>
                        ₹220
                      </div>
                    </div>

                    <div className="owner-phone-item-card">
                      <div className="owner-phone-item-icon-box" style={{ background: '#F3E5F5' }}>
                        <Layers size={18} color="#7C3AED" />
                      </div>
                      <div className="owner-phone-item-name">Pasta Alfredo</div>
                      <div className="owner-phone-item-price" style={{ color: appearance.brandColor }}>
                        ₹260
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview 2: Sidebar Preview (Staff) */}
              <div className="owner-preview-subcol">
                <div className="owner-preview-col-title">Sidebar Preview (Staff)</div>
                <div
                  className="owner-sidebar-preview-frame"
                  style={{
                    backgroundColor: appearance.sidebarBg,
                    color: resolvedSidebarText,
                  }}
                >
                  {/* Sidebar Header */}
                  <div className="owner-sb-header">
                    <div className="owner-sb-brand">
                      <img
                        src={appearance.logoImage}
                        alt="Logo"
                        className="owner-sb-logo"
                      />
                      <span>{appearance.cafeName || 'Café Aroma'}</span>
                    </div>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>«</span>
                  </div>

                  {/* Active Dashboard item */}
                  <div
                    className="owner-sb-item active"
                    style={{ backgroundColor: resolvedActiveColor }}
                  >
                    <Home size={13} />
                    <span>Dashboard</span>
                  </div>

                  {/* Other navigation items */}
                  {['Orders', 'Menu', 'Tables', 'Customers', 'Loyalty', 'Promotions', 'Reports', 'Settings'].map(
                    (item) => (
                      <div
                        key={item}
                        className="owner-sb-item"
                        style={{ color: resolvedSidebarMuted }}
                      >
                        <span className="owner-sb-dot" />
                        <span>{item}</span>
                      </div>
                    )
                  )}

                  {/* Sidebar Bottom Account */}
                  <div className="owner-sb-bottom">
                    <div className="owner-sb-user">
                      <div className="owner-sb-avatar">C</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '11px' }}>Café Owner</div>
                        <div style={{ fontSize: '9px', opacity: 0.6 }}>Owner</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
