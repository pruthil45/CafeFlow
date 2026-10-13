import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Users,
  BookOpen,
  Star,
  Tag,
  Upload,
  Calendar,
  Download,
  BarChart2,
  Database,
  Trash2,
  Clock,
  AlertTriangle,
  ChevronDown,
  X,
  Settings as SettingsIcon,
} from 'lucide-react'
import {
  INITIAL_DATA_KPIS,
  DATA_OVERVIEW_CHART_DATA,
  STORAGE_USAGE_DATA,
  EXPORT_ROWS,
  generateCsvContent,
  downloadCsvFile,
} from '../data/dataManagementMockData'

const ICON_COMPONENTS = {
  FileText,
  Users,
  BookOpen,
  Star,
  Tag,
  BarChart2,
}

export default function DataManagementTab({ onShowToast }) {
  const navigate = useNavigate()

  // KPI stats state (can be updated by cleanup simulation)
  const [kpis, setKpis] = useState(INITIAL_DATA_KPIS)

  // Export Date Range state
  const [selectedRange, setSelectedRange] = useState('Last 30 Days')
  const [customStartDate, setCustomStartDate] = useState('2026-09-13')
  const [customEndDate, setCustomEndDate] = useState('2026-10-13')

  // Export loading state per row
  const [downloadingType, setDownloadingType] = useState(null)

  // Chart tooltip state
  const [hoveredBar, setHoveredBar] = useState(null)

  // Data Cleanup state
  const [cleanupAge, setCleanupAge] = useState('Older than 1 year')
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isCleaningUp, setIsCleaningUp] = useState(false)

  // Trigger CSV export for a specific data type
  const handleExportCsv = (row) => {
    setDownloadingType(row.id)
    try {
      const csvData = generateCsvContent(row.id, selectedRange)
      downloadCsvFile(row.filename, csvData)

      if (onShowToast) {
        onShowToast(`Exported ${row.filename} (${selectedRange}) successfully!`)
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(`Failed to export ${row.title}.`, 'error')
      }
    } finally {
      setTimeout(() => setDownloadingType(null), 400)
    }
  }

  // Handle Confirmed Cleanup Action
  const handleConfirmCleanup = () => {
    setIsCleaningUp(true)

    // Simulate cleanup execution
    setTimeout(() => {
      // Calculate simulated records removed based on age
      let recordsRemoved = 240
      if (cleanupAge.includes('30 days')) recordsRemoved = 1840
      else if (cleanupAge.includes('90 days')) recordsRemoved = 1120
      else if (cleanupAge.includes('6 months')) recordsRemoved = 650
      else if (cleanupAge.includes('1 year')) recordsRemoved = 310

      // Slightly adjust mock order KPI to reflect cleanup
      setKpis((prev) =>
        prev.map((kpi) => {
          if (kpi.id === 'orders') {
            const nextVal = Math.max(8000, kpi.value - recordsRemoved)
            return {
              ...kpi,
              value: nextVal,
              formatted: nextVal.toLocaleString(),
            }
          }
          return kpi
        })
      )

      setIsCleaningUp(false)
      setIsConfirmDialogOpen(false)

      if (onShowToast) {
        onShowToast(
          `Cleanup completed: ${recordsRemoved} eligible records (${cleanupAge.toLowerCase()}) successfully archived/removed.`
        )
      }
    }, 700)
  }

  return (
    <div className="owner-data-management-page">
      {/* Header Block: Breadcrumb & Title */}
      <div className="owner-settings-header-block">
        <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
          <button
            type="button"
            className="owner-breadcrumb-link"
            onClick={() => navigate('/owner/settings')}
          >
            <SettingsIcon size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Settings
          </button>
          <span className="owner-breadcrumb-sep">&gt;</span>
          <span className="owner-breadcrumb-current">Data Management</span>
        </nav>

        <h1 className="owner-settings-main-title">Data Management</h1>
        <p className="owner-settings-main-subtitle">
          View, export and manage your café data.
        </p>
      </div>

      {/* SECTION 1: 5 SUMMARY KPI CARDS (Matching Screenshot 2) */}
      <div className="owner-dm-kpi-grid">
        {kpis.map((kpi) => {
          const IconComp = ICON_COMPONENTS[kpi.icon] || FileText
          return (
            <div key={kpi.id} className="owner-dm-kpi-card">
              <div className="owner-dm-kpi-icon-box">
                <IconComp size={20} />
              </div>
              <div className="owner-dm-kpi-content">
                <div className="owner-dm-kpi-title">{kpi.title}</div>
                <div className="owner-dm-kpi-value-row">
                  <span className="owner-dm-kpi-value">{kpi.formatted}</span>
                  {kpi.trend && (
                    <span className="owner-dm-kpi-trend">{kpi.trend}</span>
                  )}
                </div>
                <div className="owner-dm-kpi-sub">{kpi.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MAIN 2-COLUMN RESPONSIVE WORKSPACE (Matching Screenshot 2) */}
      <div className="owner-dm-main-workspace">
        {/* LEFT COLUMN: EXPORT DATA CARD */}
        <div className="owner-card owner-dm-export-card">
          <div className="owner-card-header-row owner-dm-export-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="owner-card-icon-box">
                <Upload size={20} />
              </div>
              <div>
                <h2 className="owner-card-title">Export Data</h2>
                <p className="owner-card-subtitle">
                  Download your café data in CSV format.
                </p>
              </div>
            </div>

            {/* Date Range Selector Dropdown */}
            <div className="owner-dm-date-range-wrap">
              <div className="owner-dm-date-picker-box">
                <Calendar size={15} className="owner-dm-cal-icon" />
                <select
                  className="owner-dm-date-select"
                  value={selectedRange}
                  onChange={(e) => setSelectedRange(e.target.value)}
                  aria-label="Filter export date range"
                >
                  <option value="Today">Today</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="This Year">This Year</option>
                  <option value="All Time">All Time</option>
                  <option value="Custom Range">Custom Range</option>
                </select>
                <ChevronDown size={14} className="owner-dm-select-chevron" />
              </div>
            </div>
          </div>

          {/* Optional Custom Range Date Inputs */}
          {selectedRange === 'Custom Range' && (
            <div className="owner-dm-custom-range-row animate-fade-in">
              <label>
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </label>
              <label>
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </label>
            </div>
          )}

          {/* Export Items Table */}
          <div className="owner-dm-table-wrap">
            <table className="owner-dm-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Data Type</th>
                  <th style={{ width: '50%' }}>Description</th>
                  <th style={{ width: '13%' }}>File Format</th>
                  <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {EXPORT_ROWS.map((row) => {
                  const RowIcon = ICON_COMPONENTS[row.icon] || FileText
                  const isExporting = downloadingType === row.id

                  return (
                    <tr key={row.id}>
                      {/* Data Type */}
                      <td>
                        <div className="owner-dm-row-type">
                          <div className="owner-dm-type-icon-box">
                            <RowIcon size={16} />
                          </div>
                          <span className="owner-dm-type-name">{row.title}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="owner-dm-row-desc">
                        {row.description}
                      </td>

                      {/* File Format Badge */}
                      <td>
                        <span className="owner-dm-badge-csv">{row.format}</span>
                      </td>

                      {/* Action Button */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className={`owner-btn-export-csv ${isExporting ? 'downloading' : ''}`}
                          onClick={() => handleExportCsv(row)}
                          aria-label={`Export ${row.title} as CSV`}
                        >
                          <Download size={14} />
                          <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Export Cards List (Hidden on desktop, shown on narrow screens) */}
          <div className="owner-dm-mobile-cards-list">
            {EXPORT_ROWS.map((row) => {
              const RowIcon = ICON_COMPONENTS[row.icon] || FileText
              const isExporting = downloadingType === row.id

              return (
                <div key={row.id} className="owner-dm-mobile-card">
                  <div className="owner-dm-mobile-card-top">
                    <div className="owner-dm-row-type">
                      <div className="owner-dm-type-icon-box">
                        <RowIcon size={16} />
                      </div>
                      <span className="owner-dm-type-name">{row.title}</span>
                    </div>
                    <span className="owner-dm-badge-csv">{row.format}</span>
                  </div>

                  <p className="owner-dm-mobile-desc">{row.description}</p>

                  <button
                    type="button"
                    className={`owner-btn-export-csv ${isExporting ? 'downloading' : ''}`}
                    onClick={() => handleExportCsv(row)}
                  >
                    <Download size={14} />
                    <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DATA OVERVIEW & STORAGE USAGE */}
        <div className="owner-dm-side-col">
          {/* CARD 1: DATA OVERVIEW (Bar Chart) */}
          <div className="owner-card owner-dm-side-card">
            <div className="owner-card-header-row">
              <div className="owner-card-icon-box">
                <BarChart2 size={20} />
              </div>
              <div>
                <h3 className="owner-card-title">Data Overview</h3>
                <p className="owner-card-subtitle">
                  Quick overview of your café data.
                </p>
              </div>
            </div>

            {/* Responsive Bar Chart (Matching Screenshot 2) */}
            <div className="owner-dm-chart-container">
              {/* Y-Axis Labels & Gridlines */}
              <div className="owner-dm-chart-grid">
                <div className="owner-dm-grid-line">
                  <span className="owner-dm-grid-label">400</span>
                  <div className="owner-dm-grid-stroke" />
                </div>
                <div className="owner-dm-grid-line">
                  <span className="owner-dm-grid-label">300</span>
                  <div className="owner-dm-grid-stroke" />
                </div>
                <div className="owner-dm-grid-line">
                  <span className="owner-dm-grid-label">200</span>
                  <div className="owner-dm-grid-stroke" />
                </div>
                <div className="owner-dm-grid-line">
                  <span className="owner-dm-grid-label">100</span>
                  <div className="owner-dm-grid-stroke" />
                </div>
                <div className="owner-dm-grid-line">
                  <span className="owner-dm-grid-label">0</span>
                  <div className="owner-dm-grid-stroke" />
                </div>
              </div>

              {/* Bars Columns */}
              <div className="owner-dm-chart-bars-wrap">
                {DATA_OVERVIEW_CHART_DATA.map((item, idx) => {
                  const isHovered = hoveredBar === idx
                  return (
                    <div
                      key={item.date}
                      className="owner-dm-bar-column"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="owner-dm-bar-tooltip animate-fade-in">
                          <strong>{item.date}</strong>: {item.orders} records
                        </div>
                      )}

                      <div className="owner-dm-bar-track">
                        <div
                          className={`owner-dm-bar-fill ${isHovered ? 'hover' : ''}`}
                          style={{ height: `${item.heightPercent}%` }}
                        />
                      </div>
                      <span className="owner-dm-bar-label">{item.date}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* CARD 2: STORAGE USAGE (Matching Screenshot 2) */}
          <div className="owner-card owner-dm-side-card">
            <div className="owner-card-header-row">
              <div className="owner-card-icon-box">
                <Database size={20} />
              </div>
              <div>
                <h3 className="owner-card-title">Storage Usage</h3>
                <p className="owner-card-subtitle">
                  Overview of stored data in your account.
                </p>
              </div>
            </div>

            {/* Storage Progress Header */}
            <div className="owner-dm-storage-metrics-row">
              <div className="owner-dm-storage-left">
                <strong>{STORAGE_USAGE_DATA.usedGb} GB</strong>
                <span> / {STORAGE_USAGE_DATA.totalGb} GB</span>
              </div>
              <div className="owner-dm-storage-percent">
                {STORAGE_USAGE_DATA.usedPercent}%
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="owner-dm-storage-progress-track">
              <div
                className="owner-dm-storage-progress-bar"
                style={{ width: `${STORAGE_USAGE_DATA.usedPercent}%` }}
              />
            </div>

            {/* Category Breakdown with Colored Dots */}
            <div className="owner-dm-storage-breakdown-list">
              {STORAGE_USAGE_DATA.breakdown.map((item) => (
                <div key={item.label} className="owner-dm-storage-item">
                  <div className="owner-dm-storage-item-left">
                    <span
                      className="owner-dm-storage-dot"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="owner-dm-storage-item-label">{item.label}</span>
                  </div>
                  <span className="owner-dm-storage-item-size">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: DATA CLEANUP (Matching Screenshot 2) */}
      <div className="owner-dm-cleanup-section">
        <div className="owner-card-header-row" style={{ marginBottom: 14 }}>
          <div className="owner-card-icon-box owner-cleanup-icon-box">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="owner-card-title">Data Cleanup</h2>
            <p className="owner-card-subtitle">
              Remove old records to keep your data organized.
            </p>
          </div>
        </div>

        {/* Inner White Cleanup Card */}
        <div className="owner-dm-cleanup-inner-card">
          <div className="owner-dm-cleanup-info">
            <div className="owner-dm-clock-icon-circle">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="owner-dm-cleanup-title">Delete Old Records</h3>
              <p className="owner-dm-cleanup-desc">
                Permanently delete orders, customers or other records older than a specific date.
              </p>
            </div>
          </div>

          <div className="owner-dm-cleanup-controls">
            {/* Age Dropdown */}
            <div className="owner-dm-cleanup-select-wrap">
              <select
                className="owner-dm-cleanup-select"
                value={cleanupAge}
                onChange={(e) => setCleanupAge(e.target.value)}
                aria-label="Records cleanup age threshold"
              >
                <option value="Older than 30 days">Older than 30 days</option>
                <option value="Older than 90 days">Older than 90 days</option>
                <option value="Older than 6 months">Older than 6 months</option>
                <option value="Older than 1 year">Older than 1 year</option>
              </select>
              <ChevronDown size={14} className="owner-dm-cleanup-chevron" />
            </div>

            {/* Red Delete Records Button */}
            <button
              type="button"
              className="owner-btn-delete-records"
              onClick={() => setIsConfirmDialogOpen(true)}
              aria-label="Delete old records"
            >
              <Trash2 size={16} />
              <span>Delete Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION SAFETY DIALOG */}
      {isConfirmDialogOpen && (
        <div className="owner-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
          <div className="owner-modal-card animate-scale-up" style={{ maxWidth: 480 }}>
            <div className="owner-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#fef2f2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <h3 className="owner-modal-title">Confirm Data Cleanup</h3>
              </div>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsConfirmDialogOpen(false)}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="owner-modal-body" style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: '13.5px', color: '#3e2f24', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                Are you sure you want to permanently delete café records{' '}
                <strong>{cleanupAge.toLowerCase()}</strong>?
              </p>

              <div
                style={{
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  color: '#9a3412',
                  lineHeight: 1.45,
                }}
              >
                <strong>Important Notice:</strong> In this frontend demonstration, this action will simulate
                purging eligible older orders and archiving statistics. No external database or operational café
                credentials will be harmed.
              </div>
            </div>

            <div
              className="owner-modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                padding: '14px 20px',
                borderTop: '1px solid #ede8e1',
                background: '#faf7f2',
              }}
            >
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isCleaningUp}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-danger"
                onClick={handleConfirmCleanup}
                disabled={isCleaningUp}
              >
                {isCleaningUp ? 'Cleaning up...' : 'Confirm Cleanup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
