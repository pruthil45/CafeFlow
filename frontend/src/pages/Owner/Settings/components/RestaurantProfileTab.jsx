import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Store,
  MapPin,
  Clock,
  Globe,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import BasicInformationSection from './RestaurantProfile/BasicInformationSection'
import AddressSection from './RestaurantProfile/AddressSection'
import OpeningHoursSection from './RestaurantProfile/OpeningHoursSection'
import LocaleSection from './RestaurantProfile/LocaleSection'
import LegalSection from './RestaurantProfile/LegalSection'
import { DEFAULT_RESTAURANT_PROFILE } from '../data/restaurantProfileMockData'
import './RestaurantProfile.css'

const TABS = [
  { id: 'basic', label: 'Basic Information', shortLabel: 'Basic Info', icon: Store, step: 1 },
  { id: 'address', label: 'Address', shortLabel: 'Address', icon: MapPin, step: 2 },
  { id: 'hours', label: 'Opening Hours', shortLabel: 'Hours', icon: Clock, step: 3 },
  { id: 'locale', label: 'Locale', shortLabel: 'Locale', icon: Globe, step: 4 },
  { id: 'legal', label: 'Legal', shortLabel: 'Legal', icon: FileText, step: 5 },
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

  // Automatically scroll active tab into view when active tab changes
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

  const handleScrollTabs = (offset) => {
    if (tabsStripRef.current) {
      tabsStripRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    }
  }

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab)
  const currentTab = TABS[currentTabIndex] || TABS[0]

  const goToNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      handleTabChange(TABS[currentTabIndex + 1].id)
    }
  }

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      handleTabChange(TABS[currentTabIndex - 1].id)
    }
  }

  // Live in-memory change when typing (prevents loss on tab switch)
  const handleDataChange = (sectionKey, sectionData) => {
    setProfileData((prev) => ({
      ...prev,
      [sectionKey]: sectionData,
    }))
  }

  // Persistent save to LocalStorage
  const handleSaveSection = (sectionKey, sectionData, navigateToNext = false) => {
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

    if (navigateToNext && currentTabIndex < TABS.length - 1) {
      goToNextTab()
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

        <div className="rp-header-title-row">
          <div>
            <h1 className="owner-settings-main-title">Restaurant Profile</h1>
            <p className="owner-settings-main-subtitle">
              Manage your restaurant's details, hours and legal information.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Step Progress Indicator (Displayed on smaller screens) */}
      <div className="rp-mobile-step-card" aria-label={`Step ${currentTab.step} of 5: ${currentTab.label}`}>
        <div className="rp-mobile-step-header">
          <div className="rp-mobile-step-info">
            <span className="rp-mobile-step-badge">Step {currentTab.step} of 5</span>
            <span className="rp-mobile-step-name">{currentTab.label}</span>
          </div>

          <div className="rp-mobile-step-arrows">
            <button
              type="button"
              className="rp-mobile-arrow-btn"
              onClick={goToPrevTab}
              disabled={currentTabIndex === 0}
              aria-label="Previous step"
              title="Previous step"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="rp-mobile-arrow-btn"
              onClick={goToNextTab}
              disabled={currentTabIndex === TABS.length - 1}
              aria-label="Next step"
              title="Next step"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="rp-step-dots-bar">
          {TABS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              className={`rp-step-dot ${idx === currentTabIndex ? 'active' : ''} ${idx < currentTabIndex ? 'completed' : ''}`}
              onClick={() => handleTabChange(t.id)}
              aria-label={`Jump to step ${t.step}: ${t.label}`}
              title={`${t.step}. ${t.label}`}
            />
          ))}
        </div>
      </div>

      {/* 5-Tab Navigation Strip with Scroll Arrows */}
      <div className="rp-tabs-container" role="tablist" aria-label="Restaurant Profile Tabs">
        <button
          type="button"
          className="rp-tabs-scroll-btn rp-tabs-scroll-btn--left"
          onClick={() => handleScrollTabs(-180)}
          aria-label="Scroll tabs left"
          title="Scroll tabs left"
        >
          <ChevronLeft size={18} />
        </button>

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

        <button
          type="button"
          className="rp-tabs-scroll-btn rp-tabs-scroll-btn--right"
          onClick={() => handleScrollTabs(180)}
          aria-label="Scroll tabs right"
          title="Scroll tabs right"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Tab Panels with Step Navigation */}
      <div className="rp-panel-content" id={`rp-panel-${activeTab}`} role="tabpanel">
        {activeTab === 'basic' && (
          <BasicInformationSection
            data={profileData.basic}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onNext={goToNextTab}
          />
        )}

        {activeTab === 'address' && (
          <AddressSection
            data={profileData.address}
            restaurantName={profileData.basic?.restaurantName}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onPrev={goToPrevTab}
            onNext={goToNextTab}
          />
        )}

        {activeTab === 'hours' && (
          <OpeningHoursSection
            data={profileData.hours}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onShowToast={onShowToast}
            onPrev={goToPrevTab}
            onNext={goToNextTab}
          />
        )}

        {activeTab === 'locale' && (
          <LocaleSection
            data={profileData.locale}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onPrev={goToPrevTab}
            onNext={goToNextTab}
          />
        )}

        {activeTab === 'legal' && (
          <LegalSection
            data={profileData.legal}
            onSave={handleSaveSection}
            onDataChange={handleDataChange}
            onPrev={goToPrevTab}
          />
        )}
      </div>
    </div>
  )
}
