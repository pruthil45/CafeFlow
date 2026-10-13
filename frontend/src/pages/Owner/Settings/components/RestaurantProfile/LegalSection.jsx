import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import {
  PHONE_CODES,
  COUNTRY_OPTIONS,
  STATE_CITY_MAP,
  BUSINESS_TYPES,
} from '../../data/restaurantProfileMockData'

export default function LegalSection({ data, onSave, onDataChange, onPrev }) {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (field, value) => {
    let updated = { ...formData, [field]: value }

    // If registered country changes
    if (field === 'country') {
      const states = STATE_CITY_MAP[value] ? Object.keys(STATE_CITY_MAP[value]) : ['Gujarat']
      const newState = states[0] || ''
      const cities = STATE_CITY_MAP[value]?.[newState] || ['Vadodara']
      updated = {
        ...updated,
        state: newState,
        city: cities[0] || '',
      }
    }

    setFormData(updated)
    if (onDataChange) onDataChange('legal', updated)
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.legalBusinessName?.trim()) {
      errs.legalBusinessName = 'Legal business name is required.'
    }
    if (!formData.legalPhone?.trim()) {
      errs.legalPhone = 'Legal phone number is required.'
    }
    if (!formData.taxNumberGst?.trim()) {
      errs.taxNumberGst = 'GST number is required.'
    }
    if (!formData.foodLicenceFssai?.trim()) {
      errs.foodLicenceFssai = 'FSSAI licence number is required.'
    }
    if (!formData.addressLine1?.trim()) {
      errs.addressLine1 = 'Registered address line 1 is required.'
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
      onSave('legal', formData)
    }
  }

  const currentStates = formData.country && STATE_CITY_MAP[formData.country]
    ? Object.keys(STATE_CITY_MAP[formData.country])
    : ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu']

  return (
    <form className="rp-section-form" onSubmit={handleSubmit}>
      {/* Section Header */}
      <div className="rp-section-head">
        <h2 className="rp-section-title">Legal Information</h2>
        <p className="rp-section-subtitle">
          This information is used for invoices, tax compliance and regulatory purposes. Not shown to customers.
        </p>
      </div>

      <div className="rp-form-card">
        {/* Row 1: Legal Business Name & Legal Phone */}
        <div className="rp-grid rp-grid--2col">
          {/* Legal Business Name */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-legal-business-name">
              Legal Business Name <span className="rp-required">*</span>
            </label>
            <input
              id="rp-legal-business-name"
              type="text"
              className={`rp-input ${errors.legalBusinessName ? 'rp-input--error' : ''}`}
              placeholder="e.g. Spice Garden Hospitality Pvt. Ltd."
              value={formData.legalBusinessName || ''}
              onChange={(e) => handleChange('legalBusinessName', e.target.value)}
            />
            {errors.legalBusinessName && (
              <span className="rp-field-error">{errors.legalBusinessName}</span>
            )}
          </div>

          {/* Legal Phone */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-legal-phone">
              Legal Phone <span className="rp-required">*</span>
            </label>
            <div className="rp-phone-input-wrap">
              <select
                className="rp-phone-code-select"
                value={formData.legalPhoneCode || '+91'}
                onChange={(e) => handleChange('legalPhoneCode', e.target.value)}
                aria-label="Country calling code"
              >
                {PHONE_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                id="rp-legal-phone"
                type="tel"
                className={`rp-input rp-phone-number-input ${errors.legalPhone ? 'rp-input--error' : ''}`}
                placeholder="9876543210"
                value={formData.legalPhone || ''}
                onChange={(e) => handleChange('legalPhone', e.target.value)}
              />
            </div>
            {errors.legalPhone && (
              <span className="rp-field-error">{errors.legalPhone}</span>
            )}
          </div>
        </div>

        {/* Row 2: Tax Number (GST) & Food Licence Number (FSSAI) */}
        <div className="rp-grid rp-grid--2col">
          {/* Tax Number (GST) */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-gst-number">
              Tax Number (GST) <span className="rp-required">*</span>
            </label>
            <input
              id="rp-gst-number"
              type="text"
              className={`rp-input ${errors.taxNumberGst ? 'rp-input--error' : ''}`}
              placeholder="e.g. 24ABCDE1234F1Z5"
              value={formData.taxNumberGst || ''}
              onChange={(e) => handleChange('taxNumberGst', e.target.value.toUpperCase())}
            />
            {errors.taxNumberGst && (
              <span className="rp-field-error">{errors.taxNumberGst}</span>
            )}
            <span className="rp-helper-text">Enter your GST number, VAT or applicable tax ID.</span>
          </div>

          {/* Food Licence Number (FSSAI) */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-fssai-number">
              Food Licence Number (FSSAI) <span className="rp-required">*</span>
            </label>
            <input
              id="rp-fssai-number"
              type="text"
              className={`rp-input ${errors.foodLicenceFssai ? 'rp-input--error' : ''}`}
              placeholder="e.g. 10018021004567"
              value={formData.foodLicenceFssai || ''}
              onChange={(e) => handleChange('foodLicenceFssai', e.target.value)}
            />
            {errors.foodLicenceFssai && (
              <span className="rp-field-error">{errors.foodLicenceFssai}</span>
            )}
            <span className="rp-helper-text">Enter your FSSAI or food safety registration number.</span>
          </div>
        </div>

        {/* Section: Registered Address */}
        <div className="rp-subheading-wrap">
          <h3 className="rp-subheading">Registered Address</h3>
        </div>

        {/* Address Line 1 */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-reg-address-line1">
            Address Line 1 <span className="rp-required">*</span>
          </label>
          <input
            id="rp-reg-address-line1"
            type="text"
            className={`rp-input ${errors.addressLine1 ? 'rp-input--error' : ''}`}
            placeholder="e.g. 42, Hill Road"
            value={formData.addressLine1 || ''}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
          />
          {errors.addressLine1 && (
            <span className="rp-field-error">{errors.addressLine1}</span>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="rp-form-group">
          <label className="rp-label" htmlFor="rp-reg-address-line2">
            Address Line 2
          </label>
          <input
            id="rp-reg-address-line2"
            type="text"
            className="rp-input"
            placeholder="e.g. Bandra West"
            value={formData.addressLine2 || ''}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
          />
        </div>

        {/* 4-Column: Country, State, City, Zipcode / Postal Code */}
        <div className="rp-grid rp-grid--4col">
          {/* Country */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-reg-country">
              Country <span className="rp-required">*</span>
            </label>
            <select
              id="rp-reg-country"
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
            <label className="rp-label" htmlFor="rp-reg-state">
              State <span className="rp-required">*</span>
            </label>
            <select
              id="rp-reg-state"
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
            <label className="rp-label" htmlFor="rp-reg-city">
              City <span className="rp-required">*</span>
            </label>
            <input
              id="rp-reg-city"
              type="text"
              className="rp-input"
              placeholder="e.g. Vadodara"
              value={formData.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>

          {/* Zipcode / Postal Code */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-reg-postal-code">
              Zipcode / Postal Code <span className="rp-required">*</span>
            </label>
            <input
              id="rp-reg-postal-code"
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

        {/* Business Type */}
        <div className="rp-form-group" style={{ maxWidth: '480px' }}>
          <label className="rp-label" htmlFor="rp-business-type">
            Business Type <span className="rp-required">*</span>
          </label>
          <select
            id="rp-business-type"
            className="rp-select"
            value={formData.businessType || 'Private Limited Company'}
            onChange={(e) => handleChange('businessType', e.target.value)}
          >
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
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
              <span>Back: Locale</span>
            </button>
          )}
        </div>
        <div className="rp-form-actions-right">
          <button type="submit" className="rp-btn-save">
            Save Changes
          </button>
        </div>
      </div>
    </form>
  )
}
