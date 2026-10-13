import { useNavigate } from 'react-router-dom'
import {
  Store,
  Palette,
  Sliders,
  Printer,
  Receipt,
  Users,
  Bell,
  Database,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { SETTINGS_SECTIONS } from '../data/settingsMockData'

const ICON_MAP = {
  Store: Store,
  Palette: Palette,
  Sliders: Sliders,
  Printer: Printer,
  Receipt: Receipt,
  Users: Users,
  Bell: Bell,
  Database: Database,
  Shield: Shield,
}

export default function SettingsOverviewTab() {
  const navigate = useNavigate()

  return (
    <div className="owner-settings-overview">
      {/* Page Heading */}
      <div className="owner-settings-header-block">
        <h1 className="owner-settings-main-title">Settings</h1>
        <p className="owner-settings-main-subtitle">
          Manage your restaurant configuration and preferences.
        </p>
      </div>

      {/* 4 Categorized Sections */}
      <div className="owner-settings-sections-list">
        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.id} className="owner-settings-section-group">
            {/* Section Header with Burnt-Orange Title & Divider Line */}
            <div className="owner-settings-section-head">
              <h2 className="owner-settings-section-title">{section.title}</h2>
              <div className="owner-settings-section-line" aria-hidden="true" />
            </div>

            {/* 2-Column Responsive Card Grid */}
            <div className="owner-settings-cards-grid">
              {section.cards.map((card) => {
                const IconComponent = ICON_MAP[card.icon] || Store

                return (
                  <button
                    key={card.id}
                    type="button"
                    className="owner-settings-card-btn"
                    onClick={() => navigate(card.path)}
                    aria-label={`Open ${card.title} settings`}
                  >
                    <div className="owner-settings-card-icon-box">
                      <IconComponent size={22} strokeWidth={2.2} />
                    </div>

                    <div className="owner-settings-card-content">
                      <h3 className="owner-settings-card-title">{card.title}</h3>
                      <p className="owner-settings-card-desc">{card.description}</p>
                    </div>

                    <ChevronRight size={18} className="owner-settings-card-chevron" />
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
