import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Printer,
  Receipt,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import CustomerReceiptPreview from './CustomerReceiptPreview'
import {
  loadCustomerTemplate,
  saveCustomerTemplate,
  DEFAULT_CUSTOMER_TEMPLATE,
} from '../data/printerTemplatesMockData'

export default function CustomerReceiptTemplateTab({ onShowToast }) {
  const navigate = useNavigate()

  // Load saved template or fallback to defaults
  const [template, setTemplate] = useState(() => loadCustomerTemplate())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Sync state helpers
  const handleContentToggle = (key) => {
    setTemplate((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: !prev.content[key],
      },
    }))
    setHasUnsavedChanges(true)
  }

  const handleOptionChange = (key, value) => {
    setTemplate((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value,
      },
    }))
    setHasUnsavedChanges(true)
  }

  // Save changes handler
  const handleSave = () => {
    saveCustomerTemplate(template)
    setHasUnsavedChanges(false)
    if (onShowToast) {
      onShowToast('Customer receipt template settings saved successfully!')
    }
  }

  // Print receipt handler
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="owner-template-editor-page animate-fade-in">
      {/* Breadcrumb Navigation */}
      <div className="owner-settings-header-block">
        <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="owner-breadcrumb-link"
            onClick={() => navigate('/owner/settings')}
          >
            Settings
          </button>
          <span className="owner-breadcrumb-sep">&gt;</span>
          <button
            type="button"
            className="owner-breadcrumb-link"
            onClick={() => navigate('/owner/settings/printers')}
          >
            Printer &amp; Templates
          </button>
          <span className="owner-breadcrumb-sep">&gt;</span>
          <span className="owner-breadcrumb-current">Customer Bill Template</span>
        </nav>

        <div className="owner-header-with-actions">
          <div>
            <h1 className="owner-settings-main-title">
              Customer Bill / Receipt Template
            </h1>
            <p className="owner-settings-main-subtitle">
              Customize the layout and content of your customer bill.
            </p>
          </div>

          {/* Top-Right Save Changes Button */}
          <div className="owner-header-actions-right">
            <button
              type="button"
              className="owner-btn-primary owner-btn-save-header"
              onClick={handleSave}
            >
              <Save size={16} />
              <span>Save Changes</span>
              {hasUnsavedChanges && (
                <span className="owner-unsaved-dot" title="Unsaved changes" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar: Back Button */}
      <div className="owner-editor-subnav">
        <button
          type="button"
          className="owner-btn-secondary owner-btn-back"
          onClick={() => navigate('/owner/settings/printers')}
        >
          <ArrowLeft size={16} />
          <span>Back to Printer &amp; Templates</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="owner-editor-layout">
        {/* Left Column: Template Content + Template Options */}
        <div className="owner-editor-form-col">
          {/* Card 1: Template Content */}
          <div className="owner-card owner-editor-card">
            <div className="owner-card__title-group">
              <div className="owner-icon-square">
                <Receipt size={20} />
              </div>
              <div>
                <h2 className="owner-card__title">Template Content</h2>
                <p className="owner-card__desc">
                  Choose what information to show on the customer bill.
                </p>
              </div>
            </div>

            <div className="owner-checkbox-groups">
              {/* Group 1: Header Information */}
              <div className="owner-checkbox-group">
                <h3 className="owner-checkbox-group-title">Header Information</h3>
                <div className="owner-checkbox-list">
                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.cafeLogo}
                      onChange={() => handleContentToggle('cafeLogo')}
                    />
                    <span className="owner-checkbox-label">Café Logo</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.cafeName}
                      onChange={() => handleContentToggle('cafeName')}
                    />
                    <span className="owner-checkbox-label">Café Name</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.tagline}
                      onChange={() => handleContentToggle('tagline')}
                    />
                    <span className="owner-checkbox-label">Tagline</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.address}
                      onChange={() => handleContentToggle('address')}
                    />
                    <span className="owner-checkbox-label">Address</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.phoneNumber}
                      onChange={() => handleContentToggle('phoneNumber')}
                    />
                    <span className="owner-checkbox-label">Phone Number</span>
                  </label>
                </div>
              </div>

              {/* Group 2: Order Information */}
              <div className="owner-checkbox-group">
                <h3 className="owner-checkbox-group-title">Order Information</h3>
                <div className="owner-checkbox-list">
                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.orderNumber}
                      onChange={() => handleContentToggle('orderNumber')}
                    />
                    <span className="owner-checkbox-label">Order Number</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.tableNumber}
                      onChange={() => handleContentToggle('tableNumber')}
                    />
                    <span className="owner-checkbox-label">Table Number</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.customerName}
                      onChange={() => handleContentToggle('customerName')}
                    />
                    <span className="owner-checkbox-label">Customer Name</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.dateTime}
                      onChange={() => handleContentToggle('dateTime')}
                    />
                    <span className="owner-checkbox-label">Date &amp; Time</span>
                  </label>
                </div>
              </div>

              {/* Group 3: Order Details */}
              <div className="owner-checkbox-group">
                <h3 className="owner-checkbox-group-title">Order Details</h3>
                <div className="owner-checkbox-list">
                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.itemName}
                      onChange={() => handleContentToggle('itemName')}
                    />
                    <span className="owner-checkbox-label">Item Name</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.quantity}
                      onChange={() => handleContentToggle('quantity')}
                    />
                    <span className="owner-checkbox-label">Quantity</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.price}
                      onChange={() => handleContentToggle('price')}
                    />
                    <span className="owner-checkbox-label">Price</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.variantsChoices}
                      onChange={() => handleContentToggle('variantsChoices')}
                    />
                    <span className="owner-checkbox-label">Variants &amp; Choices</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.addOns}
                      onChange={() => handleContentToggle('addOns')}
                    />
                    <span className="owner-checkbox-label">Add-ons</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.specialInstructions}
                      onChange={() => handleContentToggle('specialInstructions')}
                    />
                    <span className="owner-checkbox-label">Special Instructions</span>
                  </label>
                </div>
              </div>

              {/* Group 4: Bill Summary */}
              <div className="owner-checkbox-group">
                <h3 className="owner-checkbox-group-title">Bill Summary</h3>
                <div className="owner-checkbox-list">
                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.subtotal}
                      onChange={() => handleContentToggle('subtotal')}
                    />
                    <span className="owner-checkbox-label">Subtotal</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.discount}
                      onChange={() => handleContentToggle('discount')}
                    />
                    <span className="owner-checkbox-label">Discount</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.taxGst}
                      onChange={() => handleContentToggle('taxGst')}
                    />
                    <span className="owner-checkbox-label">Tax (GST)</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.total}
                      onChange={() => handleContentToggle('total')}
                    />
                    <span className="owner-checkbox-label">Total</span>
                  </label>

                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.paymentMethod}
                      onChange={() => handleContentToggle('paymentMethod')}
                    />
                    <span className="owner-checkbox-label">Payment Method</span>
                  </label>
                </div>
              </div>

              {/* Group 5: Footer */}
              <div className="owner-checkbox-group">
                <h3 className="owner-checkbox-group-title">Footer</h3>
                <div className="owner-checkbox-list">
                  <label className="owner-checkbox-item">
                    <input
                      type="checkbox"
                      checked={!!template.content.footerMessage}
                      onChange={() => handleContentToggle('footerMessage')}
                    />
                    <span className="owner-checkbox-label">Footer Message</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Template Options */}
          <div className="owner-card owner-editor-card">
            <div className="owner-card__title-group">
              <div className="owner-icon-square">
                <Settings size={20} />
              </div>
              <div>
                <h2 className="owner-card__title">Template Options</h2>
                <p className="owner-card__desc">
                  Customize styling, typography and paper parameters.
                </p>
              </div>
            </div>

            <div className="owner-options-form">
              {/* Header Title */}
              <div className="owner-form-group">
                <label className="owner-form-label">Header Title</label>
                <input
                  type="text"
                  className="owner-form-input"
                  value={template.options.headerTitle}
                  onChange={(e) =>
                    handleOptionChange('headerTitle', e.target.value)
                  }
                  placeholder="CaféFlow"
                />
              </div>

              {/* Tagline */}
              <div className="owner-form-group">
                <label className="owner-form-label">Tagline</label>
                <input
                  type="text"
                  className="owner-form-input"
                  value={template.options.tagline}
                  onChange={(e) =>
                    handleOptionChange('tagline', e.target.value)
                  }
                  placeholder="Good Food, Better Moments"
                />
              </div>

              {/* Font Size */}
              <div className="owner-form-group">
                <label className="owner-form-label">Font Size</label>
                <select
                  className="owner-form-select"
                  value={template.options.fontSize}
                  onChange={(e) =>
                    handleOptionChange('fontSize', e.target.value)
                  }
                >
                  <option value="Small">Small (Compact POS)</option>
                  <option value="Normal">Normal (Standard POS)</option>
                  <option value="Large">Large (High Legibility)</option>
                </select>
              </div>

              {/* Paper Width */}
              <div className="owner-form-group">
                <label className="owner-form-label">Paper Width</label>
                <select
                  className="owner-form-select"
                  value={template.options.paperWidth}
                  onChange={(e) =>
                    handleOptionChange('paperWidth', e.target.value)
                  }
                >
                  <option value="58 mm (Thermal)">58 mm (Thermal - 2 Inch)</option>
                  <option value="80 mm (Thermal)">80 mm (Thermal - 3 Inch)</option>
                  <option value="A4">A4 (Standard Sheet)</option>
                </select>
              </div>

              {/* Divider Style */}
              <div className="owner-form-group">
                <label className="owner-form-label">Divider Style</label>
                <div className="owner-divider-selector">
                  {/* Dashed */}
                  <button
                    type="button"
                    className={`owner-divider-choice ${
                      template.options.dividerStyle === 'dashed' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('dividerStyle', 'dashed')}
                  >
                    <div className="owner-divider-sample owner-divider-sample--dashed" />
                    <span>Dashed</span>
                  </button>

                  {/* Solid */}
                  <button
                    type="button"
                    className={`owner-divider-choice ${
                      template.options.dividerStyle === 'solid' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('dividerStyle', 'solid')}
                  >
                    <div className="owner-divider-sample owner-divider-sample--solid" />
                    <span>Solid</span>
                  </button>

                  {/* Dotted */}
                  <button
                    type="button"
                    className={`owner-divider-choice ${
                      template.options.dividerStyle === 'dotted' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('dividerStyle', 'dotted')}
                  >
                    <div className="owner-divider-sample owner-divider-sample--dotted" />
                    <span>Dotted</span>
                  </button>
                </div>
              </div>

              {/* Footer Message */}
              <div className="owner-form-group">
                <div className="owner-form-label-with-counter">
                  <label className="owner-form-label">Footer Message</label>
                  <span className="owner-counter-text">
                    {(template.options.footerMessage || '').length}/100
                  </span>
                </div>
                <textarea
                  rows={3}
                  className="owner-form-textarea"
                  maxLength={100}
                  value={template.options.footerMessage}
                  onChange={(e) =>
                    handleOptionChange('footerMessage', e.target.value)
                  }
                  placeholder="Thank you for visiting! Visit Again ❤️"
                />
              </div>

              {/* Show QR Code Checkbox */}
              <div className="owner-form-group">
                <label className="owner-checkbox-item">
                  <input
                    type="checkbox"
                    checked={!!template.options.showQrCode}
                    onChange={(e) =>
                      handleOptionChange('showQrCode', e.target.checked)
                    }
                  />
                  <span className="owner-checkbox-label">
                    Show QR Code (Optional)
                  </span>
                </label>
              </div>

              {/* QR Code Text */}
              {template.options.showQrCode && (
                <div className="owner-form-group">
                  <label className="owner-form-label">QR Code Text</label>
                  <input
                    type="text"
                    className="owner-form-input"
                    value={template.options.qrCodeText}
                    onChange={(e) =>
                      handleOptionChange('qrCodeText', e.target.value)
                    }
                    placeholder="Scan to follow us!"
                  />
                </div>
              )}

              {/* Alignment */}
              <div className="owner-form-group">
                <label className="owner-form-label">Alignment</label>
                <div className="owner-alignment-selector">
                  <button
                    type="button"
                    className={`owner-align-btn ${
                      template.options.alignment === 'left' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('alignment', 'left')}
                    aria-label="Align Left"
                    title="Align Left"
                  >
                    <AlignLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className={`owner-align-btn ${
                      template.options.alignment === 'center' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('alignment', 'center')}
                    aria-label="Align Center"
                    title="Align Center"
                  >
                    <AlignCenter size={16} />
                  </button>
                  <button
                    type="button"
                    className={`owner-align-btn ${
                      template.options.alignment === 'right' ? 'active' : ''
                    }`}
                    onClick={() => handleOptionChange('alignment', 'right')}
                    aria-label="Align Right"
                    title="Align Right"
                  >
                    <AlignRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Template Preview */}
        <div className="owner-editor-preview-col">
          <div className="owner-card owner-editor-preview-card">
            <div className="owner-preview-header-bar">
              <div>
                <h2 className="owner-card__title">Template Preview</h2>
                <p className="owner-card__desc">
                  This is how your customer bill will look.
                </p>
              </div>

              <div className="owner-preview-controls-right">
                {/* Print button */}
                <button
                  type="button"
                  className="owner-preview-print-icon-btn"
                  onClick={handlePrint}
                  title="Print Preview (Browser Print)"
                  aria-label="Print Preview"
                >
                  <Printer size={16} />
                </button>

                {/* Paper width dropdown */}
                <select
                  className="owner-preview-width-select"
                  value={template.options.paperWidth}
                  onChange={(e) =>
                    handleOptionChange('paperWidth', e.target.value)
                  }
                  aria-label="Select Paper Width"
                >
                  <option value="58 mm (Thermal)">58 mm (Thermal)</option>
                  <option value="80 mm (Thermal)">80 mm (Thermal)</option>
                  <option value="A4">A4</option>
                </select>
              </div>
            </div>

            {/* Live Receipt Paper */}
            <div className="owner-editor-live-stage">
              <CustomerReceiptPreview
                template={template}
                className="preview-shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
