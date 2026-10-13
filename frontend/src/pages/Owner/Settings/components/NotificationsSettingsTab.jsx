import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ShoppingCart,
  RefreshCw,
  Info,
  Settings as SettingsIcon,
  Save,
} from 'lucide-react'

const DEFAULT_NOTIFICATIONS_SETTINGS = {
  newOrderAlerts: true,
  orderStatusUpdates: true,
}

export default function NotificationsSettingsTab({ onShowToast }) {
  const navigate = useNavigate()

  // Load from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cafeflow_notifications_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_NOTIFICATIONS_SETTINGS,
          ...parsed,
        }
      } catch (e) {
        /* fallback to defaults */
      }
    }
    return DEFAULT_NOTIFICATIONS_SETTINGS
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem(
      'cafeflow_notifications_settings',
      JSON.stringify(settings)
    )
    setHasUnsavedChanges(false)
    if (onShowToast) {
      onShowToast('Notification settings saved successfully!')
    }
  }

  return (
    <div className="owner-notifications-page">
      {/* Header Block: Breadcrumb, Title & Save Changes */}
      <div className="owner-settings-header-block owner-header-with-action">
        <div>
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
            <span className="owner-breadcrumb-current">Notifications</span>
          </nav>

          <h1 className="owner-settings-main-title">Notifications</h1>
          <p className="owner-settings-main-subtitle">
            Manage alerts for customer orders.
          </p>
        </div>

        <button
          type="button"
          className={`owner-btn-save ${hasUnsavedChanges ? 'highlight' : ''}`}
          onClick={handleSave}
        >
          <Save size={16} />
          <span>Save Changes</span>
          {hasUnsavedChanges && <span className="owner-unsaved-dot" />}
        </button>
      </div>

      <div className="owner-notifications-cards-container">
        {/* CARD 1: ORDER NOTIFICATIONS (Matching Screenshot 1) */}
        <div className="owner-card owner-notifications-card">
          <div className="owner-card-header-row">
            <div className="owner-card-icon-box">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="owner-card-title">Order Notifications</h2>
              <p className="owner-card-subtitle">
                Control which order-related notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="owner-notifications-settings-list">
            {/* Setting 1: New Order Alerts */}
            <div className="owner-notification-setting-row">
              <div className="owner-notification-setting-left">
                <div className="owner-notification-icon-circle">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h3 className="owner-notification-title">New Order Alerts</h3>
                  <p className="owner-notification-desc">
                    Get notified whenever a customer places a new order.
                  </p>
                </div>
              </div>

              <label className="owner-switch-control" aria-label="Toggle New Order Alerts">
                <input
                  type="checkbox"
                  checked={settings.newOrderAlerts}
                  onChange={() => handleToggle('newOrderAlerts')}
                />
                <span className="owner-switch-slider" />
              </label>
            </div>

            <div className="owner-card-divider" />

            {/* Setting 2: Order Status Updates */}
            <div className="owner-notification-setting-row">
              <div className="owner-notification-setting-left">
                <div className="owner-notification-icon-circle">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h3 className="owner-notification-title">Order Status Updates</h3>
                  <p className="owner-notification-desc">
                    Get notified when an order status changes (e.g. preparing, ready, served).
                  </p>
                </div>
              </div>

              <label className="owner-switch-control" aria-label="Toggle Order Status Updates">
                <input
                  type="checkbox"
                  checked={settings.orderStatusUpdates}
                  onChange={() => handleToggle('orderStatusUpdates')}
                />
                <span className="owner-switch-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* CARD 2: NOTE / INFORMATION BANNER (Matching Screenshot 1) */}
        <div className="owner-notification-note-card">
          <div className="owner-note-left">
            <div className="owner-note-icon-circle">
              <Info size={18} />
            </div>
            <div className="owner-note-content">
              <h4 className="owner-note-title">Note</h4>
              <p className="owner-note-text">
                Notification sounds for new order alerts can be managed from the{' '}
                <strong>Operations settings</strong>.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="owner-btn-outline-action"
            onClick={() => navigate('/owner/settings/operations')}
            aria-label="Go to Operations settings"
          >
            <SettingsIcon size={15} />
            <span>Go to Operations</span>
          </button>
        </div>
      </div>
    </div>
  )
}
