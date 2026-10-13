import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Minus, Crosshair, Info, MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import {
  COUNTRY_OPTIONS,
  STATE_CITY_MAP,
  MOCK_LOCATION_SUGGESTIONS,
} from '../../data/restaurantProfileMockData'

export default function AddressSection({ data, restaurantName, onSave, onDataChange, onPrev, onNext }) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})
  const [searchQuery, setSearchQuery] = useState(data.searchLocation || '')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const [zoomLevel, setZoomLevel] = useState(data.zoom || 15)
  const [pinPos, setPinPos] = useState(data.pinPosition || { x: 54, y: 50 })
  const searchBoxRef = useRef(null)

  useEffect(() => {
    setFormData(data)
    setSearchQuery(data.searchLocation || '')
    if (data.pinPosition) setPinPos(data.pinPosition)
  }, [data])

  // Filter suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase()
      const matches = MOCK_LOCATION_SUGGESTIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.street.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      )
      setFilteredSuggestions(matches.length > 0 ? matches : MOCK_LOCATION_SUGGESTIONS.slice(0, 3))
    } else {
      setFilteredSuggestions(MOCK_LOCATION_SUGGESTIONS)
    }
  }, [searchQuery])

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (field, value) => {
    let updated = { ...formData, [field]: value }

    // If country changes, adjust state and city
    if (field === 'country') {
      const availableStates = STATE_CITY_MAP[value] ? Object.keys(STATE_CITY_MAP[value]) : ['Gujarat']
      const newState = availableStates[0] || ''
      const availableCities = STATE_CITY_MAP[value]?.[newState] || ['Vadodara']
      updated = {
        ...updated,
        state: newState,
        city: availableCities[0] || '',
      }
    }

    // If state changes, adjust city
    if (field === 'state' && formData.country) {
      const cities = STATE_CITY_MAP[formData.country]?.[value] || []
      if (cities.length > 0 && !cities.includes(formData.city)) {
        updated = { ...updated, city: cities[0] }
      }
    }

    setFormData(updated)
    if (onDataChange) onDataChange('address', updated)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    const updated = {
      ...formData,
      searchLocation: suggestion.name,
      streetAddress: suggestion.street,
      addressLine2: suggestion.area,
      country: suggestion.country,
      state: suggestion.state,
      city: suggestion.city,
      postalCode: suggestion.zip,
      pinPosition: suggestion.pin,
    }
    setFormData(updated)
    setSearchQuery(suggestion.name)
    setPinPos(suggestion.pin)
    setIsSearchFocused(false)
    if (onDataChange) onDataChange('address', updated)
  }

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    const clamped = {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(85, y)),
    }
    setPinPos(clamped)
    handleChange('pinPosition', clamped)
  }

  const handleResetLocation = () => {
    const defaultPos = { x: 54, y: 50 }
    setPinPos(defaultPos)
    setZoomLevel(15)
    handleChange('pinPosition', defaultPos)
  }

  const validate = () => {
    const errs = {}
    if (!formData.streetAddress?.trim()) {
      errs.streetAddress = 'Street address is required.'
    }
    if (!formData.country?.trim()) {
      errs.country = 'Country is required.'
    }
    if (!formData.state?.trim()) {
      errs.state = 'State is required.'
    }
    if (!formData.city?.trim()) {
      errs.city = 'City is required.'
    }
    if (!formData.postalCode?.trim()) {
      errs.postalCode = 'Postal code is required.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave('address', { ...formData, pinPosition: pinPos, zoom: zoomLevel })
    }
  }

  // Derived state list based on selected country
  const currentStates = formData.country && STATE_CITY_MAP[formData.country]
    ? Object.keys(STATE_CITY_MAP[formData.country])
    : ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu']

  // Derived cities based on state
  const currentCities = formData.country && formData.state && STATE_CITY_MAP[formData.country]?.[formData.state]
    ? STATE_CITY_MAP[formData.country][formData.state]
    : ['Vadodara', 'Ahmedabad', 'Surat', 'Mumbai', 'Pune', 'New Delhi', 'Bengaluru']

  return (
    <form className="rp-section-form" onSubmit={handleSubmit}>
      {/* Section Header */}
      <div className="rp-section-head">
        <h2 className="rp-section-title">Address</h2>
        <p className="rp-section-subtitle">
          Set your restaurant's exact location. This will be used on receipts and for reference.
        </p>
      </div>

      <div className="rp-form-card">
        {/* Search Location Input */}
        <div className="rp-form-group" ref={searchBoxRef} style={{ position: 'relative' }}>
          <label className="rp-label" htmlFor="rp-search-location">
            Search location
          </label>
          <div className="rp-input-with-icon">
            <span className="rp-input-icon" aria-hidden="true">
              <Search size={16} />
            </span>
            <input
              id="rp-search-location"
              type="text"
              className="rp-input rp-input--icon-pad"
              placeholder="Search for your restaurant location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              autoComplete="off"
            />
          </div>

          {/* Location Suggestions Dropdown */}
          {isSearchFocused && (
            <div className="rp-location-suggestions">
              <div className="rp-suggestions-header">Suggested Locations</div>
              {filteredSuggestions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="rp-suggestion-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <MapPin size={15} className="rp-suggestion-icon" />
                  <div className="rp-suggestion-text">
                    <span className="rp-suggestion-title">{item.name}</span>
                    <span className="rp-suggestion-sub">
                      {item.street}, {item.city}, {item.state} - {item.zip}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Preview matching Screenshot 4 */}
        <div className="rp-map-wrapper">
          <div
            className="rp-map-container"
            onClick={handleMapClick}
            role="application"
            aria-label="Interactive restaurant location map"
          >
            {/* SVG Map Canvas */}
            <svg
              className="rp-map-svg"
              viewBox="0 0 1000 360"
              preserveAspectRatio="none"
              style={{
                transform: `scale(${zoomLevel / 15})`,
                transformOrigin: `${pinPos.x}% ${pinPos.y}%`,
                transition: 'transform 0.25s ease',
              }}
            >
              {/* Background base */}
              <rect width="1000" height="360" fill="#E8ECE9" />

              {/* Park: Ayyappa Ground */}
              <path d="M780,20 L960,20 L960,180 L800,160 Z" fill="#C8E6C9" />
              <text x="880" y="80" fill="#2E7D32" fontSize="13" fontWeight="bold" textAnchor="middle">
                Ayyappa Ground
              </text>

              {/* Park: Veer Savarkar Udyan */}
              <path d="M830,220 L980,220 L980,340 L810,340 Z" fill="#C8E6C9" />
              <text x="900" y="290" fill="#2E7D32" fontSize="13" fontWeight="bold" textAnchor="middle">
                Veer Savarkar Udyan
              </text>

              {/* Residential Blocks */}
              <rect x="40" y="30" width="160" height="110" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
              <rect x="230" y="40" width="180" height="90" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
              <rect x="440" y="20" width="280" height="100" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
              <rect x="30" y="220" width="180" height="110" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
              <rect x="240" y="210" width="260" height="120" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
              <rect x="530" y="230" width="240" height="100" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />

              {/* Road System: Arterial New Sama Road */}
              <path d="M0,170 L1000,195" stroke="#FFFFFF" strokeWidth="32" />
              <path d="M0,170 L1000,195" stroke="#FFE082" strokeWidth="20" />
              <text x="370" y="190" fill="#5D4037" fontSize="12" fontWeight="bold" letterSpacing="0.5">
                New Sama Road
              </text>
              <text x="780" y="215" fill="#5D4037" fontSize="12" fontWeight="bold" letterSpacing="0.5">
                New Sama Road
              </text>

              {/* Cross Streets */}
              <path d="M210,0 L210,360" stroke="#FFFFFF" strokeWidth="20" />
              <path d="M210,0 L210,360" stroke="#FFF9C4" strokeWidth="12" />
              <text x="235" y="45" fill="#757575" fontSize="11" fontWeight="500">
                Abhilasha Cross Road
              </text>

              <path d="M380,0 L380,360" stroke="#FFFFFF" strokeWidth="14" />
              <path d="M380,0 L380,360" stroke="#FFF9C4" strokeWidth="8" />

              <path d="M510,0 L510,360" stroke="#FFFFFF" strokeWidth="18" />
              <path d="M510,0 L510,360" stroke="#FFF9C4" strokeWidth="10" />

              <path d="M650,0 L650,360" stroke="#FFFFFF" strokeWidth="14" />
              <path d="M650,0 L650,360" stroke="#FFF9C4" strokeWidth="8" />

              <path d="M780,0 L780,360" stroke="#FFFFFF" strokeWidth="18" />
              <path d="M780,0 L780,360" stroke="#FFF9C4" strokeWidth="10" />

              {/* POIs */}
              <circle cx="475" cy="270" r="7" fill="#2E7D32" />
              <text x="488" y="268" fill="#374151" fontSize="11" fontWeight="600">
                Sama Indoor Sports Complex
              </text>

              <circle cx="730" cy="230" r="7" fill="#1565C0" />
              <circle cx="730" cy="230" r="3" fill="#ffffff" />
              <circle cx="782" cy="285" r="7" fill="#6B7280" />
              <text x="715" y="258" fill="#374151" fontSize="10.5" fontWeight="600">
                Navyug English
              </text>
              <text x="715" y="270" fill="#374151" fontSize="10.5" fontWeight="600">
                Medium School
              </text>

              <text x="265" y="150" fill="#757575" fontSize="10">
                Kenya Nagar Society Rd
              </text>
            </svg>

            {/* Draggable Red Map Pin Marker with Label */}
            <div
              className="rp-map-pin"
              style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
              title="Drag or click to reposition"
            >
              <span className="rp-map-pin-label">
                {formData.restaurantName || restaurantName || 'CaféFlow'}
              </span>
              <svg
                width="34"
                height="42"
                viewBox="0 0 34 42"
                fill="none"
                className="rp-map-pin-icon"
              >
                <path
                  d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z"
                  fill="#DC2626"
                />
                <circle cx="17" cy="17" r="7" fill="#7F1D1D" />
              </svg>
            </div>

            {/* Map Controls */}
            <div className="rp-map-controls">
              <button
                type="button"
                className="rp-map-control-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomLevel((z) => Math.min(z + 1, 20))
                }}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                className="rp-map-control-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setZoomLevel((z) => Math.max(z - 1, 10))
                }}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <Minus size={16} />
              </button>
            </div>

            {/* Locate / Reset Button */}
            <button
              type="button"
              className="rp-map-locate-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleResetLocation()
              }}
              title="Reset location"
              aria-label="Reset location to center"
            >
              <Crosshair size={18} />
            </button>

            {/* Google Maps Attribution Watermark */}
            <div className="rp-map-google-badge" aria-hidden="true">
              <span style={{ color: '#4285F4', fontWeight: 700 }}>G</span>
              <span style={{ color: '#EA4335', fontWeight: 700 }}>o</span>
              <span style={{ color: '#FBBC05', fontWeight: 700 }}>o</span>
              <span style={{ color: '#4285F4', fontWeight: 700 }}>g</span>
              <span style={{ color: '#34A853', fontWeight: 700 }}>l</span>
              <span style={{ color: '#EA4335', fontWeight: 700 }}>e</span>
            </div>
          </div>

          {/* Drag instruction notice beneath map */}
          <div className="rp-map-helper-row">
            <span>Drag the pin to fine-tune the location.</span>
            <Info size={14} className="rp-map-info-icon" />
          </div>
        </div>

        {/* Street Address */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-street-address">
            Street Address <span className="rp-required">*</span>
          </label>
          <input
            id="rp-street-address"
            type="text"
            className={`rp-input ${errors.streetAddress ? 'rp-input--error' : ''}`}
            placeholder="e.g. New Sama Road"
            value={formData.streetAddress || ''}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
          />
          {errors.streetAddress && (
            <span className="rp-field-error">{errors.streetAddress}</span>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-address-line2">
            Address Line 2
          </label>
          <input
            id="rp-address-line2"
            type="text"
            className="rp-input"
            placeholder="e.g. Bandra West, Near Sama Indoor Stadium"
            value={formData.addressLine2 || ''}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
          />
        </div>

        {/* 3-Column: Country, State, City */}
        <div className="rp-grid rp-grid--3col">
          {/* Country */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-country">
              Country <span className="rp-required">*</span>
            </label>
            <select
              id="rp-country"
              className="rp-select"
              value={formData.country || 'India'}
              onChange={(e) => handleChange('country', e.target.value)}
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-state">
              State <span className="rp-required">*</span>
            </label>
            <select
              id="rp-state"
              className="rp-select"
              value={formData.state || 'Gujarat'}
              onChange={(e) => handleChange('state', e.target.value)}
            >
              {currentStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-city">
              City <span className="rp-required">*</span>
            </label>
            <input
              id="rp-city"
              type="text"
              list="rp-city-datalist"
              className={`rp-input ${errors.city ? 'rp-input--error' : ''}`}
              placeholder="e.g. Vadodara"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
            <datalist id="rp-city-datalist">
              {currentCities.map((cty) => (
                <option key={cty} value={cty} />
              ))}
            </datalist>
            {errors.city && <span className="rp-field-error">{errors.city}</span>}
          </div>
        </div>

        {/* Postal Code */}
        <div className="rp-grid rp-grid--3col">
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-postal-code">
              Postal Code <span className="rp-required">*</span>
            </label>
            <input
              id="rp-postal-code"
              type="text"
              className={`rp-input ${errors.postalCode ? 'rp-input--error' : ''}`}
              placeholder="e.g. 390006"
              value={formData.postalCode || ''}
              onChange={(e) => handleChange('postalCode', e.target.value)}
            />
            {errors.postalCode && (
              <span className="rp-field-error">{errors.postalCode}</span>
            )}
          </div>
        </div>
      </div>

      {/* Save & Step Navigation Action Bar */}
      <div className="rp-form-actions rp-form-actions--between">
        <div className="rp-form-actions-left">
          {onPrev && (
            <button
              type="button"
              className="rp-btn-step-nav"
              onClick={onPrev}
            >
              <ArrowLeft size={15} />
              <span>Back: Basic Info</span>
            </button>
          )}
        </div>
        <div className="rp-form-actions-right">
          {onNext && (
            <button
              type="button"
              className="rp-btn-step-nav"
              onClick={onNext}
            >
              <span>Next: Hours</span>
              <ArrowRight size={15} />
            </button>
          )}
          <button type="submit" className="rp-btn-save">
            Save Changes
          </button>
        </div>
      </div>
    </form>
  )
}
