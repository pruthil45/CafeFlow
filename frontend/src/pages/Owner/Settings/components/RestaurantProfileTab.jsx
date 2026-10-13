import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Store,
  MapPin,
  Clock,
  Globe,
  FileText,
} from 'lucide-react'
import BasicInformationSection from './RestaurantProfile/BasicInformationSection'
import AddressSection from './RestaurantProfile/AddressSection'
import OpeningHoursSection from './RestaurantProfile/OpeningHoursSection'
import LocaleSection from './RestaurantProfile/LocaleSection'
import LegalSection from './RestaurantProfile/LegalSection'
import { DEFAULT_RESTAURANT_PROFILE } from '../data/restaurantProfileMockData'
import './RestaurantProfile.css'

const TABS = [
  { id: 'basic', label: 'Basic Information', icon: Store },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'hours', label: 'Opening Hours', icon: Clock },
  { id: 'locale', label: 'Locale', icon: Globe },
  { id: 'legal', label: 'Legal', icon: FileText },
]

export default function RestaurantProfileTab({ onShowToast }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'basic'
  const [activeTab, setActiveTab] = useState(initialTab)
  const tabsStripRef = useRef(null)

  // Central profile data with LocalStorage persistence
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('cafeflow_restaurant_profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_RESTAURANT_PROFILE,
          ...parsed,
          basic: { ...DEFAULT_RESTAURANT_PROFILE.basic, ...(parsed.basic || {}) },
          address: { ...DEFAULT_RESTAURANT_PROFILE.address, ...(parsed.address || {}) },
          hours: { ...DEFAULT_RESTAURANT_PROFILE.hours, ...(parsed.hours || {}) },
          locale: { ...DEFAULT_RESTAURANT_PROFILE.locale, ...(parsed.locale || {}) },
          legal: { ...DEFAULT_RESTAURANT_PROFILE.legal, ...(parsed.legal || {}) },
        }
      } catch (e) {
        /* fallback to defaults */
      }
    }
    return DEFAULT_RESTAURANT_PROFILE
  })

  // Sync tab with URL search parameter if present
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && TABS.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  // Automatically scroll active tab into view when active tab changes on mobile
  useEffect(() => {
    if (tabsStripRef.current) {
      const activeBtn = tabsStripRef.current.querySelector('.rp-tab-btn.active')
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    }
  }, [activeTab])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId }, { replace: true })
  }

  // Live in-memory change when typing (prevents loss on tab switch)
  const handleDataChange = (sectionKey, sectionData) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionKey]: sectionData,
    }))
  }

  // Persistent save to LocalStorage
  const handleSaveSection = (sectionKey, sectionData) => {
    const updated = {
      ...profileData,
      [sectionKey]: sectionData,
    }
    setProfileData(updated)
    localStorage.setItem('cafeflow_restaurant_profile', JSON.stringify(updated))

    const sectionLabels = {
      basic: 'Basic information',
      address: 'Restaurant address',
      hours: 'Operating hours',
      locale: 'Locale settings',
      legal: 'Legal information',
    }
    const label = sectionLabels[sectionKey] || 'Settings'
    if (onShowToast) {
      onShowToast(`${label} saved successfully!`)
    }
  }

  return (
    <div className="owner-restaurant-profile-page">
      {/* Header with Breadcrumb, Title & Subtitle */}
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
          <span className="owner-breadcrumb-current">Restaurant Profile</span>
        </nav>

        <h1 className="owner-settings-main-title">Restaurant Profile</h1>
        <p className="owner-settings-main-subtitle">
          Manage your restaurant's details, hours and legal information.
        </p>
      </div>

      {/* 5-Tab Navigation Strip */}
      <div className="rp-tabs-container" role="tablist" aria-label="Restaurant Profile Tabs">
        <div className="rp-tabs-strip" ref={tabsStripRef}>
          {TABS.map((tab) => {
            const IconComp = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`rp-panel-${tab.id}`}
                id={`rp-tab-${tab.id}`}
                className={`rp-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <IconComp size={18} className="rp-tab-icon" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="rp-panel-content" id={`rp-panel-${activeTab}`} role="tabpanel">
        {activeTab === 'basic' && (
          <BasicInformationSection
            data={profileData.basic}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
          />
        )}

        {activeTab === 'address' && (
          <AddressSection
            data={profileData.address}
            restaurantName={profileData.basic?.restaurantName}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
          />
        )}

        {activeTab === 'hours' && (
          <OpeningHoursSection
            data={profileData.hours}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onShowToast={onShowToast}
          />
        )}

        {activeTab === 'locale' && (
          <LocaleSection
            data={profileData.locale}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
          />
        )}

        {activeTab === 'legal' && (
          <LegalSection
            data={profileData.legal}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
          />
        )}
      </div>
    </div>
  )
}
