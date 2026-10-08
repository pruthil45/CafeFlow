import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import OwnerSidebar from './components/OwnerSidebar'
import OwnerHeader from './components/OwnerHeader'
import { OWNER_CAFES } from './data/ownerMockData'
import './Owner.css'

export default function OwnerLayout() {
  const [selectedCafe, setSelectedCafe] = useState(OWNER_CAFES[0])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleSelectCafe = (cafe) => {
    setSelectedCafe(cafe)
  }

  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev)
  }

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="owner-layout">
      {/* Solid Dark Espresso Sidebar (NO Image inside) */}
      <OwnerSidebar
        selectedCafe={selectedCafe}
        onSelectCafe={handleSelectCafe}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={handleCloseMobileSidebar}
      />

      {/* Main Content Area: Large Café Image Header + Dashboard Content */}
      <div className="owner-main-wrapper">
        <OwnerHeader
          selectedCafe={selectedCafe}
          onToggleMobileSidebar={handleToggleMobileSidebar}
        />

        <main className="owner-portal-content" role="main">
          <Outlet context={{ selectedCafe, setSelectedCafe }} />
        </main>
      </div>
    </div>
  )
}
