import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIMEZONE_OPTIONS,
  DECIMAL_PLACES_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../../data/restaurantProfileMockData'

export default function LocaleSection({ data, onSave, onDataChange, onPrev, onNext }) {
  const [formData, setFormData] = useState(data)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onDataChange) onDataChange('locale', updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave('locale', formData)
  }

  return (
    <form className="rp-section-form" onSubmit={handleSubmit}>
      {/* Section Header */}
      <div className="rp-section-head">
        <h2 className="rp-section-title">Locale Settings</h2>
        <p className="rp-section-subtitle">
          Configure your restaurant's currency, date/time format and language preferences.
        </p>
      </div>

      <div className="rp-form-card">
        {/* Row 1: 3 Columns - Currency, Date Format, Timezone */}
        <div className="rp-grid rp-grid--3col">
          {/* Currency */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-currency">
              Currency <span className="rp-required">*</span>
            </label>
            <select
              id="rp-currency"
              className="rp-select"
              value={formData.currency || 'INR — Indian Rupee (₹)'}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="rp-helper-text">This currency will be used across the system.</span>
          </div>

          {/* Date Format */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-date-format">
              Date Format <span className="rp-required">*</span>
            </label>
            <select
              id="rp-date-format"
              className="rp-select"
              value={formData.dateFormat || 'DD-MM-YYYY (26-10-2026)'}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
            >
              {DATE_FORMAT_OPTIONS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
            <span className="rp-helper-text">Choose how dates are displayed.</span>
          </div>

          {/* Timezone */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-timezone">
              Timezone <span className="rp-required">*</span>
            </label>
            <select
              id="rp-timezone"
              className="rp-select"
              value={formData.timezone || 'Asia/Kolkata (GMT+5:30)'}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <span className="rp-helper-text">Used for orders, reports and system time.</span>
          </div>
        </div>

        {/* Row 2: 2 Columns - Decimal Places, Primary Language */}
        <div className="rp-grid rp-grid--2col" style={{ marginTop: '4px' }}>
          {/* Decimal Places */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-decimal-places">
              Decimal Places <span className="rp-required">*</span>
            </label>
            <select
              id="rp-decimal-places"
              className="rp-select"
              value={formData.decimalPlaces || '2 (₹23.00)'}
              onChange={(e) => handleChange('decimalPlaces', e.target.value)}
            >
              {DECIMAL_PLACES_OPTIONS.map((dp) => (
                <option key={dp} value={dp}>
                  {dp}
                </option>
              ))}
            </select>
            <span className="rp-helper-text">Number of digits to show after decimal.</span>
          </div>

          {/* Primary Language */}
          <div className="rp-form-group">
            <label className="rp-label" htmlFor="rp-primary-language">
              Primary Language <span className="rp-required">*</span>
            </label>
            <select
              id="rp-primary-language"
              className="rp-select"
              value={formData.primaryLanguage || 'English'}
              onChange={(e) => handleChange('primaryLanguage', e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <span className="rp-helper-text">Default language for your dashboard and storefront.</span>
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
              <span>Back: Hours</span>
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
              <span>Next: Legal</span>
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
