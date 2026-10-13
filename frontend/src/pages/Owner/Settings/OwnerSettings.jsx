import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import SettingsOverviewTab from './components/SettingsOverviewTab'
import RestaurantProfileTab from './components/RestaurantProfileTab'
import AppearanceSettingsTab from './components/AppearanceSettingsTab'
import StaffManagementTab from './components/StaffManagementTab'
import TaxationSettingsTab from './components/TaxationSettingsTab'
import SettingsPlaceholderTab from './components/SettingsPlaceholderTab'
import './Settings.css'
import '../Owner.css'

export default function OwnerSettings() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3800)
  }

  return (
    <div className="owner-settings-page">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`owner-toast animate-slide-in ${
            toast.type === 'error'
              ? 'owner-toast--error'
              : toast.type === 'info'
              ? 'owner-toast--info'
              : 'owner-toast--success'
          }`}
          role="status"
          aria-live="polite"
        >
          <span>{toast.message}</span>
          <button
            type="button"
            className="owner-toast__close"
            onClick={() => setToast(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Sub-Routes for Settings */}
      <Routes>
        <Route index element={<SettingsOverviewTab />} />
        <Route
          path="profile"
          element={<RestaurantProfileTab onShowToast={showToast} />}
        />
        <Route
          path="restaurant-profile"
          element={<RestaurantProfileTab onShowToast={showToast} />}
        />
        <Route
          path="appearance"
          element={<AppearanceSettingsTab onShowToast={showToast} />}
        />
        <Route
          path="staff"
          element={<StaffManagementTab onShowToast={showToast} />}
        />
        <Route
          path="taxation"
          element={<TaxationSettingsTab onShowToast={showToast} />}
        />
        <Route
          path=":section"
          element={<SettingsPlaceholderTab onShowToast={showToast} />}
        />
      </Routes>
    </div>
  )
}
