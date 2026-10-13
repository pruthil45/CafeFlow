import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Printer,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Star,
  Play,
  FileText,
  ChefHat,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Wifi,
  Usb,
  RotateCw,
} from 'lucide-react'
import CustomerReceiptPreview from './CustomerReceiptPreview'
import KitchenTicketPreview from './KitchenTicketPreview'
import {
  loadPrinters,
  savePrinters,
  loadCustomerTemplate,
  loadKitchenTemplate,
} from '../data/printerTemplatesMockData'

export default function PrintersTemplatesTab({ onShowToast }) {
  const navigate = useNavigate()

  // Printers state
  const [printers, setPrinters] = useState(() => loadPrinters())

  // Saved templates for live preview in right column
  const [customerTemplate, setCustomerTemplate] = useState(() => loadCustomerTemplate())
  const [kitchenTemplate, setKitchenTemplate] = useState(() => loadKitchenTemplate())

  // Reload templates on mount in case updated in editors
  useEffect(() => {
    setCustomerTemplate(loadCustomerTemplate())
    setKitchenTemplate(loadKitchenTemplate())
  }, [])

  // Preview tab state: 'customer' | 'kitchen'
  const [activePreviewTab, setActivePreviewTab] = useState('customer')

  // Action dropdown menu state (track open printer id)
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrinter, setEditingPrinter] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Thermal Printer',
    connection: 'USB',
    ipAddress: '',
    description: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Delete Dialog state
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Test Print Feedback Modal
  const [testPrintModal, setTestPrintModal] = useState(null)

  // Close 3-dot menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save printers changes to state & localStorage
  const updatePrinters = (newPrinters) => {
    setPrinters(newPrinters)
    savePrinters(newPrinters)
  }

  // Open Add Printer Modal
  const handleOpenAdd = () => {
    setEditingPrinter(null)
    setFormData({
      name: '',
      type: 'Thermal Printer',
      connection: 'USB',
      ipAddress: '',
      description: '',
    })
    setFormErrors({})
    setIsModalOpen(true)
    setOpenMenuId(null)
  }

  // Open Edit Printer Modal
  const handleOpenEdit = (printer) => {
    setEditingPrinter(printer)
    setFormData({
      name: printer.name || '',
      type: printer.type || 'Thermal Printer',
      connection: printer.connection || 'USB',
      ipAddress: printer.ipAddress || '',
      description: printer.description || '',
    })
    setFormErrors({})
    setIsModalOpen(true)
    setOpenMenuId(null)
  }

  // Validate form
  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) {
      errors.name = 'Printer Name is required'
    }
    if (formData.connection === 'Network (IP)') {
      if (!formData.ipAddress.trim()) {
        errors.ipAddress = 'IP Address is required for network printers'
      } else {
        // Basic IP format check (e.g. 192.168.1.100 or with port :9100)
        const ipRegex =
          /^(\d{1,3}\.){3}\d{1,3}(:\d{1,5})?$/
        if (!ipRegex.test(formData.ipAddress.trim())) {
          errors.ipAddress = 'Enter a valid IP address (e.g. 192.168.1.100:9100)'
        }
      }
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit Add / Edit
  const handleSubmitForm = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (editingPrinter) {
      // Edit existing
      const updated = printers.map((p) =>
        p.id === editingPrinter.id
          ? {
              ...p,
              name: formData.name.trim(),
              type: formData.type,
              connection: formData.connection,
              ipAddress:
                formData.connection === 'Network (IP)'
                  ? formData.ipAddress.trim()
                  : '',
              description: formData.description.trim(),
            }
          : p
      )
      updatePrinters(updated)
      if (onShowToast) {
        onShowToast(`Printer "${formData.name.trim()}" updated successfully.`)
      }
    } else {
      // Add new printer (starts as Connected for demo realism)
      const newPrinter = {
        id: `printer-${Date.now()}`,
        name: formData.name.trim(),
        type: formData.type,
        connection: formData.connection,
        ipAddress:
          formData.connection === 'Network (IP)'
            ? formData.ipAddress.trim()
            : '',
        description: formData.description.trim() || 'Custom café printer',
        status: formData.connection === 'USB' ? 'Connected' : 'Connected',
        isDefault: printers.length === 0,
      }
      updatePrinters([...printers, newPrinter])
      if (onShowToast) {
        onShowToast(`Printer "${formData.name.trim()}" added successfully.`)
      }
    }

    setIsModalOpen(false)
  }

  // Set Default Printer
  const handleSetDefault = (printer) => {
    const updated = printers.map((p) => ({
      ...p,
      isDefault: p.id === printer.id,
    }))
    updatePrinters(updated)
    setOpenMenuId(null)
    if (onShowToast) {
      onShowToast(`"${printer.name}" is now set as the default printer.`)
    }
  }

  // Toggle Printer Connection Status (simulated connectivity toggle)
  const handleToggleStatus = (printer) => {
    const newStatus = printer.status === 'Connected' ? 'Offline' : 'Connected'
    const updated = printers.map((p) =>
      p.id === printer.id ? { ...p, status: newStatus } : p
    )
    updatePrinters(updated)
    setOpenMenuId(null)
    if (onShowToast) {
      onShowToast(
        `"${printer.name}" is now marked as ${newStatus}.`,
        newStatus === 'Connected' ? 'success' : 'info'
      )
    }
  }

  // Delete printer
  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    const updated = printers.filter((p) => p.id !== deleteTarget.id)
    updatePrinters(updated)
    if (onShowToast) {
      onShowToast(`Printer "${deleteTarget.name}" deleted.`, 'info')
    }
    setDeleteTarget(null)
  }

  // Test Print execution
  const handleTestPrint = (printer) => {
    setOpenMenuId(null)
    if (printer.status === 'Connected') {
      setTestPrintModal({
        success: true,
        printer,
        message: `Simulated test print sent successfully to "${printer.name}" (${printer.connection}). Paper feed and character alignment verified.`,
      })
      if (onShowToast) {
        onShowToast(`Test print sent to ${printer.name}!`)
      }
    } else {
      setTestPrintModal({
        success: false,
        printer,
        message: `Cannot send test print: "${printer.name}" is currently Offline. Check ${
          printer.connection === 'Network (IP)' ? 'network / IP' : 'USB cable'
        } connection and ensure printer power is on.`,
      })
      if (onShowToast) {
        onShowToast(`Printer ${printer.name} is offline.`, 'error')
      }
    }
  }

  return (
    <div className="owner-printers-page animate-fade-in">
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
          <span className="owner-breadcrumb-current">Printer &amp; Templates</span>
        </nav>

        <h1 className="owner-settings-main-title">Printer &amp; Templates</h1>
        <p className="owner-settings-main-subtitle">
          Manage café printers and customize print templates.
        </p>
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="owner-printers-layout">
        {/* Left Column: Printers + Print Templates + Important */}
        <div className="owner-printers-main-col">
          {/* 1. Printers Card */}
          <div className="owner-card owner-printers-card">
            <div className="owner-card__header-row">
              <div className="owner-card__title-group">
                <div className="owner-icon-square">
                  <Printer size={20} />
                </div>
                <div>
                  <h2 className="owner-card__title">Printers</h2>
                  <p className="owner-card__desc">
                    Add and manage printers used in your café.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="owner-btn-primary owner-add-printer-btn"
                onClick={handleOpenAdd}
              >
                <Plus size={16} />
                <span>Add Printer</span>
              </button>
            </div>

            {/* Desktop Printers Table */}
            <div className="owner-table-responsive owner-printers-desktop-table">
              <table className="owner-printers-table">
                <thead>
                  <tr>
                    <th>Printer Name</th>
                    <th>Type</th>
                    <th>Connection</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {printers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="owner-table-empty">
                        No printers configured. Click "Add Printer" above to configure your counter or kitchen printer.
                      </td>
                    </tr>
                  ) : (
                    printers.map((printer) => {
                      const isConnected = printer.status === 'Connected'

                      return (
                        <tr key={printer.id}>
                          {/* Printer Name & Subtitle */}
                          <td>
                            <div className="owner-printer-name-cell">
                              <div className="owner-printer-icon-avatar">
                                <Printer size={17} />
                              </div>
                              <div>
                                <div className="owner-printer-name-text">
                                  {printer.name}
                                  {printer.isDefault && (
                                    <span className="owner-badge owner-badge--default">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="owner-printer-desc-text">
                                  {printer.description}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="owner-printer-type-cell">
                            {printer.type}
                          </td>

                          {/* Connection */}
                          <td className="owner-printer-conn-cell">
                            <span className="owner-conn-badge">
                              {printer.connection === 'Network (IP)' ? (
                                <Wifi size={13} />
                              ) : (
                                <Usb size={13} />
                              )}
                              <span>{printer.connection}</span>
                            </span>
                            {printer.ipAddress && (
                              <div className="owner-printer-ip-sub">
                                {printer.ipAddress}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td>
                            <button
                              type="button"
                              className={`owner-status-pill ${
                                isConnected
                                  ? 'owner-status-pill--connected'
                                  : 'owner-status-pill--offline'
                              }`}
                              onClick={() => handleToggleStatus(printer)}
                              title="Click to toggle status (Demo)"
                            >
                              <span className="owner-status-dot" />
                              <span>{printer.status}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="text-right">
                            <div className="owner-printer-action-row">
                              <button
                                type="button"
                                className="owner-btn-test-print"
                                onClick={() => handleTestPrint(printer)}
                              >
                                Test Print
                              </button>

                              {/* 3-Dot Menu */}
                              <div className="owner-printer-menu-wrap" ref={menuRef}>
                                <button
                                  type="button"
                                  className="owner-btn-dots"
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === printer.id ? null : printer.id
                                    )
                                  }
                                  aria-label={`Actions for ${printer.name}`}
                                  aria-expanded={openMenuId === printer.id}
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {openMenuId === printer.id && (
                                  <div className="owner-action-dropdown">
                                    <button
                                      type="button"
                                      className="owner-dropdown-item"
                                      onClick={() => handleOpenEdit(printer)}
                                    >
                                      <Edit2 size={14} />
                                      <span>Edit Printer</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="owner-dropdown-item"
                                      onClick={() => handleTestPrint(printer)}
                                    >
                                      <Play size={14} />
                                      <span>Test Print</span>
                                    </button>

                                    {!printer.isDefault && (
                                      <button
                                        type="button"
                                        className="owner-dropdown-item"
                                        onClick={() => handleSetDefault(printer)}
                                      >
                                        <Star size={14} />
                                        <span>Set as Default</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className="owner-dropdown-item"
                                      onClick={() => handleToggleStatus(printer)}
                                    >
                                      <RotateCw size={14} />
                                      <span>
                                        Toggle {isConnected ? 'Offline' : 'Connected'}
                                      </span>
                                    </button>

                                    <div className="owner-dropdown-divider" />

                                    <button
                                      type="button"
                                      className="owner-dropdown-item owner-dropdown-item--danger"
                                      onClick={() => {
                                        setDeleteTarget(printer)
                                        setOpenMenuId(null)
                                      }}
                                    >
                                      <Trash2 size={14} />
                                      <span>Delete Printer</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Printers Cards (Clean, readable, no overflow) */}
            <div className="owner-printers-mobile-cards">
              {printers.length === 0 ? (
                <div className="owner-table-empty">
                  No printers configured. Tap "+ Add Printer" above.
                </div>
              ) : (
                printers.map((printer) => {
                  const isConnected = printer.status === 'Connected'

                  return (
                    <div key={printer.id} className="owner-printer-mobile-card">
                      <div className="owner-printer-mobile-top">
                        <div className="owner-printer-mobile-info">
                          <div className="owner-printer-icon-avatar">
                            <Printer size={18} />
                          </div>
                          <div>
                            <div className="owner-printer-name-text">
                              {printer.name}
                              {printer.isDefault && (
                                <span className="owner-badge owner-badge--default">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="owner-printer-desc-text">
                              {printer.description}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`owner-status-pill ${
                            isConnected
                              ? 'owner-status-pill--connected'
                              : 'owner-status-pill--offline'
                          }`}
                          onClick={() => handleToggleStatus(printer)}
                          title="Tap to toggle status"
                        >
                          <span className="owner-status-dot" />
                          <span>{printer.status}</span>
                        </button>
                      </div>

                      <div className="owner-printer-mobile-meta">
                        <div className="owner-printer-mobile-meta-item">
                          <span className="owner-meta-muted">Type:</span>
                          <span className="owner-meta-val">{printer.type}</span>
                        </div>
                        <div className="owner-printer-mobile-meta-item">
                          <span className="owner-meta-muted">Connection:</span>
                          <span className="owner-meta-val">
                            {printer.connection === 'Network (IP)' ? (
                              <span className="owner-conn-badge">
                                <Wifi size={12} /> {printer.ipAddress || 'Network (IP)'}
                              </span>
                            ) : (
                              <span className="owner-conn-badge">
                                <Usb size={12} /> USB
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="owner-printer-mobile-bottom">
                        <button
                          type="button"
                          className="owner-btn-test-print owner-btn-test-print--mobile"
                          onClick={() => handleTestPrint(printer)}
                        >
                          Test Print
                        </button>

                        <button
                          type="button"
                          className="owner-btn-edit-printer-mobile"
                          onClick={() => handleOpenEdit(printer)}
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <div className="owner-printer-menu-wrap" ref={menuRef}>
                          <button
                            type="button"
                            className="owner-btn-dots"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === printer.id ? null : printer.id
                              )
                            }
                            aria-label={`Actions for ${printer.name}`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {openMenuId === printer.id && (
                            <div className="owner-action-dropdown">
                              {!printer.isDefault && (
                                <button
                                  type="button"
                                  className="owner-dropdown-item"
                                  onClick={() => handleSetDefault(printer)}
                                >
                                  <Star size={14} />
                                  <span>Set as Default</span>
                                </button>
                              )}

                              <button
                                type="button"
                                className="owner-dropdown-item"
                                onClick={() => handleToggleStatus(printer)}
                              >
                                <RotateCw size={14} />
                                <span>
                                  Toggle {isConnected ? 'Offline' : 'Connected'}
                                </span>
                              </button>

                              <div className="owner-dropdown-divider" />

                              <button
                                type="button"
                                className="owner-dropdown-item owner-dropdown-item--danger"
                                onClick={() => {
                                  setDeleteTarget(printer)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Trash2 size={14} />
                                <span>Delete Printer</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* 2. Print Templates Card */}
          <div className="owner-card owner-templates-card">
            <div className="owner-card__title-group owner-templates-head">
              <div className="owner-icon-square">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="owner-card__title">Print Templates</h2>
                <p className="owner-card__desc">
                  Customize the content and layout of your print templates.
                </p>
              </div>
            </div>

            <div className="owner-templates-list">
              {/* Template 1: Customer Bill / Receipt */}
              <div className="owner-template-row">
                <div className="owner-template-info">
                  <div className="owner-icon-square owner-icon-square--sm">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="owner-template-name">
                      Customer Bill / Receipt
                    </h3>
                    <p className="owner-template-desc">
                      Used when a customer's bill is generated.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="owner-btn-edit-template"
                  onClick={() =>
                    navigate('/owner/settings/printers/customer-template')
                  }
                >
                  <Edit2 size={14} />
                  <span>Edit Template</span>
                </button>
              </div>

              {/* Template 2: Kitchen Order Ticket */}
              <div className="owner-template-row">
                <div className="owner-template-info">
                  <div className="owner-icon-square owner-icon-square--sm">
                    <ChefHat size={18} />
                  </div>
                  <div>
                    <h3 className="owner-template-name">
                      Kitchen Order Ticket
                    </h3>
                    <p className="owner-template-desc">
                      Printed when a new order is received.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="owner-btn-edit-template"
                  onClick={() =>
                    navigate('/owner/settings/printers/kitchen-template')
                  }
                >
                  <Edit2 size={14} />
                  <span>Edit Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Important Information Card */}
          <div className="owner-info-notice-box">
            <div className="owner-info-notice-icon" aria-hidden="true">
              <Info size={20} />
            </div>
            <div className="owner-info-notice-content">
              <h4 className="owner-info-notice-title">Important</h4>
              <ul className="owner-info-notice-list">
                <li>Make sure your printer is properly connected and installed on this device.</li>
                <li>Use Test Print to verify the printer is working correctly.</li>
                <li>You can customize what information appears in each template.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Template Preview */}
        <div className="owner-printers-preview-col">
          <div className="owner-card owner-preview-wrapper-card">
            <div className="owner-preview-header">
              <h2 className="owner-card__title">Template Preview</h2>
              <p className="owner-card__desc">
                See how your print template will look.
              </p>
            </div>

            {/* Segmented Tabs: Customer Bill | Kitchen Ticket */}
            <div className="owner-segmented-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activePreviewTab === 'customer'}
                className={`owner-segmented-tab ${
                  activePreviewTab === 'customer' ? 'active' : ''
                }`}
                onClick={() => setActivePreviewTab('customer')}
              >
                Customer Bill
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activePreviewTab === 'kitchen'}
                className={`owner-segmented-tab ${
                  activePreviewTab === 'kitchen' ? 'active' : ''
                }`}
                onClick={() => setActivePreviewTab('kitchen')}
              >
                Kitchen Ticket
              </button>
            </div>

            {/* Live Render Container */}
            <div className="owner-preview-live-stage">
              {activePreviewTab === 'customer' ? (
                <CustomerReceiptPreview
                  template={customerTemplate}
                  className="preview-shadow"
                />
              ) : (
                <KitchenTicketPreview
                  template={kitchenTemplate}
                  className="preview-shadow"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT PRINTER MODAL */}
      {isModalOpen && (
        <div className="owner-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="owner-modal-container owner-modal--printer animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="owner-modal-header">
              <div className="owner-modal-title-row">
                <div className="owner-icon-square owner-icon-square--sm">
                  <Printer size={18} />
                </div>
                <div>
                  <h3 className="owner-modal-title">
                    {editingPrinter ? 'Edit Printer' : 'Add Printer'}
                  </h3>
                  <p className="owner-modal-subtitle">
                    Configure thermal or standard printer connection parameters.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="owner-modal-body">
              {/* Printer Name */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Printer Name <span className="owner-required-mark">*</span>
                </label>
                <input
                  type="text"
                  className={`owner-form-input ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Counter Thermal Printer"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null })
                  }}
                />
                {formErrors.name && (
                  <span className="owner-form-error">{formErrors.name}</span>
                )}
              </div>

              {/* Printer Type */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Printer Type <span className="owner-required-mark">*</span>
                </label>
                <select
                  className="owner-form-select"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Thermal Printer">Thermal Printer (POS ESC/POS)</option>
                  <option value="Standard Printer">Standard Printer (A4 / Laser)</option>
                </select>
              </div>

              {/* Connection Type */}
              <div className="owner-form-group">
                <label className="owner-form-label">
                  Connection Type <span className="owner-required-mark">*</span>
                </label>
                <select
                  className="owner-form-select"
                  value={formData.connection}
                  onChange={(e) => {
                    setFormData({ ...formData, connection: e.target.value })
                    if (formErrors.ipAddress)
                      setFormErrors({ ...formErrors, ipAddress: null })
                  }}
                >
                  <option value="USB">USB Cable (Direct Plug)</option>
                  <option value="Network (IP)">Network (Ethernet / WiFi / IP)</option>
                </select>
              </div>

              {/* IP Address (if Network selected) */}
              {formData.connection === 'Network (IP)' && (
                <div className="owner-form-group">
                  <label className="owner-form-label">
                    Printer IP Address &amp; Port{' '}
                    <span className="owner-required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    className={`owner-form-input ${
                      formErrors.ipAddress ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g. 192.168.1.185:9100"
                    value={formData.ipAddress}
                    onChange={(e) => {
                      setFormData({ ...formData, ipAddress: e.target.value })
                      if (formErrors.ipAddress)
                        setFormErrors({ ...formErrors, ipAddress: null })
                    }}
                  />
                  {formErrors.ipAddress && (
                    <span className="owner-form-error">
                      {formErrors.ipAddress}
                    </span>
                  )}
                  <span className="owner-form-hint">
                    Standard raw printing port for thermal printers is 9100.
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="owner-form-group">
                <label className="owner-form-label">Description (Optional)</label>
                <input
                  type="text"
                  className="owner-form-input"
                  placeholder="e.g. Main counter printer or Chef station"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="owner-modal-actions">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="owner-btn-primary">
                  {editingPrinter ? 'Save Changes' : 'Add Printer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="owner-modal-container owner-modal--confirm animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="owner-confirm-icon-box owner-confirm-icon-box--danger">
              <Trash2 size={24} />
            </div>
            <h3 className="owner-confirm-title">Delete Printer?</h3>
            <p className="owner-confirm-text">
              Are you sure you want to delete{' '}
              <strong>"{deleteTarget.name}"</strong>? If this printer was set as
              default, another printer will need to be configured.
            </p>
            <div className="owner-confirm-actions">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete Printer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST PRINT SIMULATION MODAL */}
      {testPrintModal && (
        <div
          className="owner-modal-backdrop"
          onClick={() => setTestPrintModal(null)}
        >
          <div
            className="owner-modal-container owner-modal--confirm animate-scale-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`owner-confirm-icon-box ${
                testPrintModal.success
                  ? 'owner-confirm-icon-box--success'
                  : 'owner-confirm-icon-box--warning'
              }`}
            >
              {testPrintModal.success ? (
                <CheckCircle2 size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
            </div>
            <h3 className="owner-confirm-title">
              {testPrintModal.success
                ? 'Test Print Succeeded'
                : 'Test Print Failed'}
            </h3>
            <p className="owner-confirm-text">{testPrintModal.message}</p>
            <div className="owner-confirm-actions">
              <button
                type="button"
                className="owner-btn-primary"
                onClick={() => setTestPrintModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
