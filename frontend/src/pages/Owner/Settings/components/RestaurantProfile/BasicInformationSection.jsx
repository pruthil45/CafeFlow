import { useState, useRef, useEffect } from 'react'
import { Link2, ChevronDown, X, Check } from 'lucide-react'
import { CUISINE_OPTIONS, PHONE_CODES } from '../../data/restaurantProfileMockData'

export default function BasicInformationSection({ data, onSave, onDataChange }) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})
  const [isCuisineDropdownOpen, setIsCuisineDropdownOpen] = useState(false)
  const cuisineDropdownRef = useRef(null)

  // Keep in sync if parent data updates
  useEffect(() => {
    setFormData(data)
  }, [data])

  // Close cuisine dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (cuisineDropdownRef.current && !cuisineDropdownRef.current.contains(e.target)) {
        setIsCuisineDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onDataChange) onDataChange('basic', updated)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleToggleCuisine = (cuisine) => {
    const current = formData.cuisines || []
    let next
    if (current.includes(cuisine)) {
      next = current.filter((c) => c !== cuisine)
    } else {
      next = [...current, cuisine]
    }
    handleChange('cuisines', next)
  }

  const handleRemoveCuisine = (cuisine, e) => {
    e.stopPropagation()
    const next = (formData.cuisines || []).filter((c) => c !== cuisine)
    handleChange('cuisines', next)
  }

  const validate = () => {
    const errs = {}
    if (!formData.restaurantName?.trim()) {
      errs.restaurantName = 'Restaurant name is required.'
    }
    if (formData.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
      errs.supportEmail = 'Please enter a valid email address.'
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errs.website = 'Website must start with http:// or https://'
    }
    if (formData.supportPhone && !/^\d{7,15}$/.test(formData.supportPhone.replace(/\D/g, ''))) {
      errs.supportPhone = 'Please enter a valid phone number.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave('basic', formData)
    }
  }

  const taglineLength = formData.tagline ? formData.tagline.length : 0

  return (
    <form className="rp-section-form" onSubmit={handleSubmit}>
      {/* Section Header */}
      <div className="rp-section-head">
        <h2 className="rp-section-title">Basic Information</h2>
        <p className="rp-section-subtitle">General details about your restaurant.</p>
      </div>

      <div className="rp-form-card">
        {/* Restaurant Name */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-restaurant-name">
            Restaurant Name <span className="rp-required">*</span>
          </label>
          <input
            id="rp-restaurant-name"
            type="text"
            className={`rp-input ${errors.restaurantName ? 'rp-input--error' : ''}`}
            placeholder="e.g. CaféFlow"
            value={formData.restaurantName || ''}
            onChange={(e) => handleChange('restaurantName', e.target.value)}
          />
          {errors.restaurantName && (
            <span className="rp-field-error">{errors.restaurantName}</span>
          )}
        </div>

        {/* Tagline / Description */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-tagline">
            Tagline / Description
          </label>
          <textarea
            id="rp-tagline"
            className="rp-textarea"
            rows={3}
            maxLength={200}
            placeholder="A cozy café serving delicious coffee and fresh food"
            value={formData.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
          />
          <div className="rp-textarea-counter">{taglineLength}/200</div>
        </div>

        {/* Cuisine Types */}
        <div className="rp-form-group" ref={cuisineDropdownRef}>
          <label className="rp-label">Cuisine Types</label>
          <div
            className="rp-cuisine-selector"
            onClick={() => setIsCuisineDropdownOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-expanded={isCuisineDropdownOpen}
            aria-label="Select cuisine types"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsCuisineDropdownOpen((prev) => !prev)
              }
            }}
          >
            <div className="rp-cuisine-chips">
              {(formData.cuisines || []).map((cuisine) => (
                <span key={cuisine} className="rp-cuisine-chip">
                  {cuisine}
                  <button
                    type="button"
                    className="rp-cuisine-chip-remove"
                    onClick={(e) => handleRemoveCuisine(cuisine, e)}
                    aria-label={`Remove ${cuisine}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {(formData.cuisines || []).length === 0 && (
                <span className="rp-placeholder-text">Select cuisines...</span>
              )}
            </div>
            <ChevronDown size={18} className="rp-dropdown-chevron" />
          </div>

          {/* Cuisine Multi-select Popover */}
          {isCuisineDropdownOpen && (
            <div className="rp-cuisine-dropdown">
              <div className="rp-cuisine-dropdown-header">Available Cuisines</div>
              <div className="rp-cuisine-dropdown-list">
                {CUISINE_OPTIONS.map((cuisine) => {
                  const isSelected = (formData.cuisines || []).includes(cuisine)
                  return (
                    <button
                      key={cuisine}
                      type="button"
                      className={`rp-cuisine-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleCuisine(cuisine)}
                    >
                      <span>{cuisine}</span>
                      {isSelected && <Check size={14} className="rp-check-icon" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <span className="rp-helper-text">Select the types of cuisines your restaurant serves.</span>
        </div>

        {/* 2-Column: Support Phone & Support Email */}
        <div className="rp-grid rp-grid--2col">
          {/* Support Phone */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-support-phone">
              Support Phone
            </label>
            <div className="rp-phone-input-wrap">
              <select
                className="rp-phone-code-select"
                value={formData.supportPhoneCode || '+91'}
                onChange={(e) => handleChange('supportPhoneCode', e.target.value)}
                aria-label="Country calling code"
              >
                {PHONE_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                id="rp-support-phone"
                type="tel"
                className={`rp-input rp-phone-number-input ${errors.supportPhone ? 'rp-input--error' : ''}`}
                placeholder="9876543210"
                value={formData.supportPhone || ''}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
              />
            </div>
            {errors.supportPhone && (
              <span className="rp-field-error">{errors.supportPhone}</span>
            )}
          </div>

          {/* Support Email */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-support-email">
              Support Email
            </label>
            <input
              id="rp-support-email"
              type="email"
              className={`rp-input ${errors.supportEmail ? 'rp-input--error' : ''}`}
              placeholder="support@cafeflow.co"
              value={formData.supportEmail || ''}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
            />
            {errors.supportEmail && (
              <span className="rp-field-error">{errors.supportEmail}</span>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-website">
            Website
          </label>
          <div className="rp-input-with-icon">
            <span className="rp-input-icon" aria-hidden="true">
              <Link2 size={16} />
            </span>
            <input
              id="rp-website"
              type="url"
              className={`rp-input rp-input--icon-pad ${errors.website ? 'rp-input--error' : ''}`}
              placeholder="https://www.cafeflow.co"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
          {errors.website && (
            <span className="rp-field-error">{errors.website}</span>
          )}
          <span className="rp-helper-text">Your restaurant's website (optional).</span>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="rp-form-actions">
        <button type="submit" className="rp-btn-save">
          Save Changes
        </button>
      </div>
    </form>
  )
}
