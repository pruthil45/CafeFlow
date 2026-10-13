import { useNavigate, useParams } from 'react-router-dom'
import {
  Store,
  Sliders,
  Printer,
  Bell,
  Database,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react'

const SECTION_METADATA = {
  profile: {
    title: 'Restaurant Profile',
    subtitle: 'Manage your café name, cuisine types, contact numbers, address and legal registration info.',
    icon: Store,
    category: 'RESTAURANT',
  },
  operations: {
    title: 'Operations',
    subtitle: 'Configure order workflow, default preparation times, kitchen alerts, and sound preferences.',
    icon: Sliders,
    category: 'OPERATIONS',
  },
  printers: {
    title: 'Printers & Templates',
    subtitle: 'Manage thermal receipt printers, kitchen display KOT templates, and print routing rules.',
    icon: Printer,
    category: 'OPERATIONS',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Set up SMS alerts, WhatsApp receipts, daily sales digest emails, and low-stock reminders.',
    icon: Bell,
    category: 'NOTIFICATIONS',
  },
  'data-management': {
    title: 'Data Management',
    subtitle: 'Export audit logs, download CSV reports, schedule automatic cloud backups, and manage records.',
    icon: Database,
    category: 'DATA MANAGEMENT',
  },
}

export default function SettingsPlaceholderTab({ onShowToast }) {
  const { section } = useParams()
  const navigate = useNavigate()

  const currentMeta = SECTION_METADATA[section] || {
    title: section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Settings',
    subtitle: 'Configure and customize your restaurant settings.',
    icon: Store,
    category: 'SETTINGS',
  }

  const IconComp = currentMeta.icon

  return (
    <div className="owner-placeholder-page">
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
          <span className="owner-breadcrumb-sep">/</span>
          <span className="owner-breadcrumb-current">{currentMeta.title}</span>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="owner-settings-main-title">{currentMeta.title}</h1>
            <p className="owner-settings-main-subtitle">{currentMeta.subtitle}</p>
          </div>

          <button
            type="button"
            className="owner-btn-secondary"
            onClick={() => navigate('/owner/settings')}
          >
            <ArrowLeft size={16} /> Back to Settings
          </button>
        </div>
      </div>

      {/* Configuration Status Card */}
      <div className="owner-settings-card-group" style={{ maxWidth: 840 }}>
        <div className="owner-settings-placeholder-box">
          <div className="owner-settings-placeholder-icon">
            <IconComp size={32} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#2a1911', margin: '0 0 6px 0' }}>
            {currentMeta.title} Configuration
          </h2>

          <p style={{ fontSize: '13.5px', color: '#6d5b4f', margin: '0 0 20px 0', maxWidth: 540 }}>
            {currentMeta.subtitle} All primary controls for this module have been configured with default active café settings.
          </p>

          <div className="owner-settings-placeholder-status">
            <CheckCircle2 size={16} color="#16a34a" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>
              Service Status: Active & Operational
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="owner-btn-primary"
              onClick={() => {
                if (onShowToast) onShowToast(`${currentMeta.title} preferences updated.`)
              }}
            >
              <Save size={15} /> Save Default Preferences
            </button>
            <button
              type="button"
              className="owner-btn-secondary"
              onClick={() => navigate('/owner/settings')}
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
