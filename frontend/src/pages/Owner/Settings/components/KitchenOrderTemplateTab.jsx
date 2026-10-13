import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Printer,
  ChefHat,
  Receipt,
  Settings,
  RotateCcw,
} from 'lucide-react'
import KitchenTicketPreview from './KitchenTicketPreview'
import {
  loadKitchenTemplate,
  saveKitchenTemplate,
  DEFAULT_KITCHEN_TEMPLATE,
} from '../data/printerTemplatesMockData'

export default function KitchenOrderTemplateTab({ onShowToast }) {
  const navigate = useNavigate()

  // Load saved template or fallback to defaults
  const [template, setTemplate] = useState(() => loadKitchenTemplate())
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

  // Reset to default
  const handleResetToDefault = () => {
    setTemplate(JSON.parse(JSON.stringify(DEFAULT_KITCHEN_TEMPLATE)))
    setHasUnsavedChanges(true)
    if (onShowToast) {
      onShowToast('Kitchen ticket configuration reset to defaults. Click Save Changes to keep.')
    }
  }

  // Save changes handler
  const handleSave = () => {
    saveKitchenTemplate(template)
    setHasUnsavedChanges(false)
    if (onShowToast) {
      onShowToast('Kitchen order ticket template saved successfully!')
    }
  }

  // Print handler
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
          <span className="owner-breadcrumb-current">Kitchen Order Ticket</span>
        </nav>

        <div className="owner-header-with-actions">
          <div>
            <h1 className="owner-settings-main-title">
              Kitchen Order Ticket Template
            </h1>
            <p className="owner-settings-main-subtitle">
              Customize the layout and content for kitchen order tickets.
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

      {/* Sub-Header Navigation: Back Button */}
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

      {/* Top Banner Card: Kitchen Order Ticket intro + Reset */}
      <div className="owner-card owner-kitchen-banner-card">
        <div className="owner-card__title-group">
          <div className="owner-icon-square">
            <ChefHat size={20} />
          </div>
          <div>
            <h2 className="owner-card__title">Kitchen Order Ticket</h2>
            <p className="owner-card__desc">
              Printed when a new order is received in the kitchen.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="owner-btn-secondary owner-btn-reset"
          onClick={handleResetToDefault}
        >
          <RotateCcw size={15} />
          <span>Reset to Default</span>
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
                  Choose what information to show on the kitchen order ticket.
                </p>
              </div>
            </div>

            <div className="owner-checkbox-single-grid">
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
                  checked={!!template.content.orderNumber}
                  onChange={() => handleContentToggle('orderNumber')}
                />
                <span className="owner-checkbox-label">Order Number</span>
              </label>

              <label className="owner-checkbox-item">
                <input
                  type="checkbox"
                  checked={!!template.content.dateTime}
                  onChange={() => handleContentToggle('dateTime')}
                />
                <span className="owner-checkbox-label">Date &amp; Time</span>
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

              <label className="owner-checkbox-item">
                <input
                  type="checkbox"
                  checked={!!template.content.preparedBy}
                  onChange={() => handleContentToggle('preparedBy')}
                />
                <span className="owner-checkbox-label">Prepared By (Staff)</span>
              </label>

              <label className="owner-checkbox-item">
                <input
                  type="checkbox"
                  checked={!!template.content.orderType}
                  onChange={() => handleContentToggle('orderType')}
                />
                <span className="owner-checkbox-label">Order Type</span>
              </label>

              <label className="owner-checkbox-item">
                <input
                  type="checkbox"
                  checked={!!template.content.dividerLine}
                  onChange={() => handleContentToggle('dividerLine')}
                />
                <span className="owner-checkbox-label">Divider Line</span>
              </label>
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
                  Customize header titles, typography and ticket footer.
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
                  placeholder="KITCHEN ORDER"
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

              {/* Header Information Checkboxes (Synchronized with content) */}
              <div className="owner-form-group">
                <div className="owner-options-subcard">
                  <label className="owner-form-label" style={{ marginBottom: 10 }}>
                    Header Information
                  </label>
                  <div className="owner-checkbox-list">
                    <label className="owner-checkbox-item">
                      <input
                        type="checkbox"
                        checked={!!template.content.cafeLogo}
                        onChange={() => handleContentToggle('cafeLogo')}
                      />
                      <span className="owner-checkbox-label">Show Logo</span>
                    </label>

                    <label className="owner-checkbox-item">
                      <input
                        type="checkbox"
                        checked={!!template.content.cafeName}
                        onChange={() => handleContentToggle('cafeName')}
                      />
                      <span className="owner-checkbox-label">Show Café Name</span>
                    </label>

                    <label className="owner-checkbox-item">
                      <input
                        type="checkbox"
                        checked={!!template.content.dateTime}
                        onChange={() => handleContentToggle('dateTime')}
                      />
                      <span className="owner-checkbox-label">Show Date &amp; Time</span>
                    </label>
                  </div>
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
                  placeholder="Thank you!"
                />
                <span className="owner-form-hint">
                  This message will appear at the bottom of the ticket.
                </span>
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
                  This is how your kitchen order ticket will look.
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

            {/* Live Kitchen Ticket Paper */}
            <div className="owner-editor-live-stage">
              <KitchenTicketPreview
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
