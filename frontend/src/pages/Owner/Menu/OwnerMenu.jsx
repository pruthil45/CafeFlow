import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  LayoutGrid,
  Layers,
  Sliders,
  Sparkles,
  ListPlus,
  Package,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react'
import {
  OWNER_MENU_CATEGORIES,
  OWNER_MENU_ITEMS,
  OWNER_MENU_ADDONS,
  OWNER_MENU_CHOICES,
  OWNER_MENU_COMBOS,
} from '../data/ownerMockData'
import MenuItemsTab from './components/MenuItemsTab'
import AddMenuItem from './components/AddMenuItem'
import MenuCategoriesTab from './components/MenuCategoriesTab'
import MenuVariationsTab from './components/MenuVariationsTab'
import MenuAddonsTab from './components/MenuAddonsTab'
import MenuCombosTab from './components/MenuCombosTab'
import '../Owner.css'

export default function OwnerMenu() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Master connected state across all sections
  const [categories, setCategories] = useState(OWNER_MENU_CATEGORIES)
  const [items, setItems] = useState(OWNER_MENU_ITEMS)
  const [addons, setAddons] = useState(OWNER_MENU_ADDONS)
  const [variations, setVariations] = useState(OWNER_MENU_CHOICES)
  const [combos, setCombos] = useState(OWNER_MENU_COMBOS)

  // Toast notification state
  const [toast, setToast] = useState(null)
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  // Active view: 'items', 'categories', 'variations', 'addons', 'combos', or 'add-item'
  const currentTabFromUrl = useMemo(() => {
    const path = location.pathname.toLowerCase().replace(/\/+$/, '')
    if (path.endsWith('/menu/add')) return 'add-item'
    if (path.includes('/menu/categories')) return 'categories'
    if (
      path.includes('/menu/variations') ||
      path.includes('/menu/choices') ||
      path.includes('/menu/variants')
    )
      return 'variations'
    if (path.includes('/menu/addons')) return 'addons'
    if (path.includes('/menu/combos')) return 'combos'
    return 'items'
  }, [location.pathname])

  const [activeTab, setActiveTab] = useState(currentTabFromUrl)

  useEffect(() => {
    setActiveTab(currentTabFromUrl)
  }, [currentTabFromUrl])

  // Handle Tab Switch
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    if (tabKey === 'items') {
      navigate('/owner/menu')
    } else {
      navigate(`/owner/menu/${tabKey}`)
    }
  }

  // Handle Open Add Item
  const handleOpenAddItem = () => {
    setActiveTab('add-item')
    navigate('/owner/menu/add')
  }

  // Handle Cancel Add Item
  const handleCancelAddItem = () => {
    setActiveTab('items')
    navigate('/owner/menu')
  }

  // Handle Save New Item
  const handleSaveNewItem = (newItem) => {
    setItems((prev) => [newItem, ...prev])

    // Update category count
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === 'all') {
          return { ...c, count: c.count + 1 }
        }
        if (c.name.toLowerCase() === newItem.category.toLowerCase()) {
          return { ...c, count: c.count + 1 }
        }
        return c
      })
    )

    showToast(`"${newItem.name}" added to menu successfully!`, 'success')
    setActiveTab('items')
    navigate('/owner/menu')
  }

  // Dynamic Page Header Info
  const headerInfo = useMemo(() => {
    switch (activeTab) {
      case 'categories':
        return {
          title: 'Categories',
          subtitle:
            'Manage menu categories, item counts, display order, and status.',
        }
      case 'variations':
        return {
          title: 'Variations',
          subtitle:
            'Manage variation groups and options that customers can select for menu items (e.g. Size, Crust, Milk Type, Sweetness, Spice Level).',
        }
      case 'addons':
        return {
          title: 'Add-ons',
          subtitle: 'Manage add-on items that can be added to menu items.',
        }
      case 'combos':
        return {
          title: 'Combos',
          subtitle: 'Create and manage combo meals for your café menu.',
        }
      case 'items':
      default:
        return {
          title: 'Menu',
          subtitle:
            'Manage your café menu items, categories, variations, add-ons, and combos.',
        }
    }
  }, [activeTab])

  // State for mobile footer 'More' sheet
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  // Direct Menu Data Download (CSV)
  const handleDownloadMenuData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Name,Category,Price,Type,Status\n' +
      items
        .map(
          (i) =>
            `"${i.id}","${i.name}","${i.category}",${i.price},"${i.itemType}","${
              i.active ? 'Active' : 'Inactive'
            }"`
        )
        .join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'cafeflow_menu_catalogue.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Menu data catalogue downloaded successfully', 'success')
  }

  return (
    <div className="owner-menu-container">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          className={`owner-toast owner-toast--${toast.type} animate-slide-down`}
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            bottom: 'auto',
            left: 'auto',
            height: 'auto',
            minHeight: 'unset',
            maxHeight: 'max-content',
            width: 'auto',
            maxWidth: 'min(440px, calc(100vw - 32px))',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 18px',
            borderRadius: 10,
            background:
              toast.type === 'error'
                ? '#fee2e2'
                : toast.type === 'info'
                ? '#e0f2fe'
                : '#dcfce7',
            color:
              toast.type === 'error'
                ? '#991b1b'
                : toast.type === 'info'
                ? '#075985'
                : '#166534',
            border: `1px solid ${
              toast.type === 'error'
                ? '#fca5a5'
                : toast.type === 'info'
                ? '#7dd3fc'
                : '#86efac'
            }`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            fontWeight: 600,
            fontSize: 13.5,
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : toast.type === 'info' ? (
            <Info size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: 0,
              marginLeft: 8,
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* When in Add Item subview, render the dedicated full Add New Item screen */}
      {activeTab === 'add-item' ? (
        <AddMenuItem
          categories={categories}
          addons={addons}
          variations={variations}
          choices={variations}
          onSave={handleSaveNewItem}
          onCancel={handleCancelAddItem}
          showToast={showToast}
        />
      ) : (
        <>
          {/* Main Top Bar with Title, Subtitle, and Top-Right Actions */}
          <div className="owner-page-top-bar owner-menu-header-bar">
            <div className="owner-page-top-bar__left">
              <h1 className="owner-menu-title">
                {headerInfo.title}
              </h1>
              <p className="owner-menu-subtitle">
                {headerInfo.subtitle}
              </p>
            </div>

            <div className="owner-page-top-bar__actions owner-menu-top-actions">
              {activeTab === 'items' && (
                <>
                  <button
                    type="button"
                    className="owner-btn-secondary owner-download-menu-btn"
                    onClick={handleDownloadMenuData}
                    title="Download Menu Catalogue CSV"
                  >
                    <Download size={15} />
                    <span className="owner-btn-text-desktop">Download Menu Data</span>
                  </button>
                  <button
                    type="button"
                    className="owner-btn-primary owner-add-item-btn-header"
                    onClick={handleOpenAddItem}
                  >
                    <Plus size={16} />
                    <span>Add Item</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Connected 5 Navigation Tabs Bar */}
          <div className="owner-menu-tabs-bar">
            <button
              type="button"
              className={`owner-menu-tab-btn ${
                activeTab === 'items' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('items')}
            >
              <LayoutGrid size={15} />
              <span>Items</span>
            </button>

            <button
              type="button"
              className={`owner-menu-tab-btn ${
                activeTab === 'categories' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('categories')}
            >
              <Layers size={15} />
              <span>Categories</span>
            </button>

            <button
              type="button"
              className={`owner-menu-tab-btn ${
                activeTab === 'variations' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('variations')}
            >
              <Sliders size={15} />
              <span>Variations</span>
            </button>

            <button
              type="button"
              className={`owner-menu-tab-btn ${
                activeTab === 'addons' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('addons')}
            >
              <ListPlus size={15} />
              <span>Add-ons</span>
            </button>

            <button
              type="button"
              className={`owner-menu-tab-btn ${
                activeTab === 'combos' ? 'active' : ''
              }`}
              onClick={() => handleTabChange('combos')}
            >
              <Package size={15} />
              <span>Combos</span>
            </button>
          </div>

          {/* Active Tab View Content */}
          <div style={{ marginTop: 16 }}>
            {activeTab === 'items' && (
              <MenuItemsTab
                categories={categories}
                setCategories={setCategories}
                items={items}
                setItems={setItems}
                onOpenAddItem={handleOpenAddItem}
                showToast={showToast}
                addons={addons}
                variations={variations}
              />
            )}

            {activeTab === 'categories' && (
              <MenuCategoriesTab
                categories={categories}
                setCategories={setCategories}
                items={items}
                showToast={showToast}
              />
            )}

            {activeTab === 'variations' && (
              <MenuVariationsTab
                variations={variations}
                setVariations={setVariations}
                showToast={showToast}
              />
            )}

            {activeTab === 'addons' && (
              <MenuAddonsTab
                addons={addons}
                setAddons={setAddons}
                showToast={showToast}
              />
            )}

            {activeTab === 'combos' && (
              <MenuCombosTab
                combos={combos}
                setCombos={setCombos}
                menuItems={items}
                showToast={showToast}
              />
            )}
          </div>
        </>
      )}

      {/* Mobile Sticky Footer Navigation Bar */}
      {activeTab !== 'add-item' && (
        <>
          <nav className="owner-menu-mobile-footer-bar" aria-label="Menu sections navigation">
            {/* 1. Items */}
            <button
              type="button"
              className={`owner-menu-mobile-footer-item ${activeTab === 'items' ? 'active' : ''}`}
              onClick={() => {
                setShowMoreMenu(false)
                handleTabChange('items')
              }}
            >
              <div className="owner-menu-mobile-footer-icon-wrap">
                <LayoutGrid size={18} />
              </div>
              <span>Items</span>
            </button>

            {/* 2. Categories */}
            <button
              type="button"
              className={`owner-menu-mobile-footer-item ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => {
                setShowMoreMenu(false)
                handleTabChange('categories')
              }}
            >
              <div className="owner-menu-mobile-footer-icon-wrap">
                <Layers size={18} />
              </div>
              <span>Categories</span>
            </button>

            {/* 3. Center Elevated Add Item with Plus Symbol */}
            <button
              type="button"
              className="owner-menu-mobile-footer-center-btn"
              onClick={() => {
                setShowMoreMenu(false)
                handleOpenAddItem()
              }}
              title="Add New Menu Item"
              aria-label="Add New Menu Item"
            >
              <div className="owner-menu-mobile-footer-center-icon">
                <Plus size={22} strokeWidth={2.6} />
              </div>
              <span className="owner-menu-mobile-footer-center-label">Add Item</span>
            </button>

            {/* 4. Variations */}
            <button
              type="button"
              className={`owner-menu-mobile-footer-item ${activeTab === 'variations' ? 'active' : ''}`}
              onClick={() => {
                setShowMoreMenu(false)
                handleTabChange('variations')
              }}
            >
              <div className="owner-menu-mobile-footer-icon-wrap">
                <Sliders size={18} />
              </div>
              <span>Variations</span>
            </button>

            {/* 5. More Option */}
            <button
              type="button"
              className={`owner-menu-mobile-footer-item ${showMoreMenu || ['addons', 'combos'].includes(activeTab) ? 'active' : ''}`}
              onClick={() => setShowMoreMenu((prev) => !prev)}
              aria-expanded={showMoreMenu}
              aria-label="More menu options"
            >
              <div className="owner-menu-mobile-footer-icon-wrap">
                <MoreHorizontal size={18} />
              </div>
              <span>More</span>
            </button>
          </nav>

          {/* More Options Bottom Sheet Drawer */}
          {showMoreMenu && (
            <div
              className="owner-menu-more-backdrop"
              onClick={() => setShowMoreMenu(false)}
            >
              <div
                className="owner-menu-more-sheet"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="More Menu Actions"
              >
                <div className="owner-menu-more-sheet-handle" />
                <div className="owner-menu-more-sheet-header">
                  <span className="owner-menu-more-sheet-title">More Options</span>
                  <button
                    type="button"
                    className="owner-menu-more-close"
                    onClick={() => setShowMoreMenu(false)}
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="owner-menu-more-sheet-items">
                  {/* Add-ons */}
                  <button
                    type="button"
                    className={`owner-menu-more-item ${activeTab === 'addons' ? 'active' : ''}`}
                    onClick={() => {
                      setShowMoreMenu(false)
                      handleTabChange('addons')
                    }}
                  >
                    <div className="owner-menu-more-item-icon">
                      <ListPlus size={18} />
                    </div>
                    <div className="owner-menu-more-item-text">
                      <span className="owner-menu-more-item-title">Add-ons</span>
                      <span className="owner-menu-more-item-sub">Extra toppings, sides & custom add-ons</span>
                    </div>
                    <ChevronRight size={16} className="owner-menu-more-chevron" />
                  </button>

                  {/* Combos */}
                  <button
                    type="button"
                    className={`owner-menu-more-item ${activeTab === 'combos' ? 'active' : ''}`}
                    onClick={() => {
                      setShowMoreMenu(false)
                      handleTabChange('combos')
                    }}
                  >
                    <div className="owner-menu-more-item-icon">
                      <Package size={18} />
                    </div>
                    <div className="owner-menu-more-item-text">
                      <span className="owner-menu-more-item-title">Combos</span>
                      <span className="owner-menu-more-item-sub">Value meals & bundled combos</span>
                    </div>
                    <ChevronRight size={16} className="owner-menu-more-chevron" />
                  </button>

                  <div className="owner-menu-more-divider" />

                  {/* Download Menu Data */}
                  <button
                    type="button"
                    className="owner-menu-more-item"
                    onClick={() => {
                      setShowMoreMenu(false)
                      handleDownloadMenuData()
                    }}
                  >
                    <div className="owner-menu-more-item-icon" style={{ background: '#f5efe6', color: '#8c4a23' }}>
                      <Download size={18} />
                    </div>
                    <div className="owner-menu-more-item-text">
                      <span className="owner-menu-more-item-title">Download Menu Data</span>
                      <span className="owner-menu-more-item-sub">Export catalogue items as CSV file</span>
                    </div>
                    <Download size={15} style={{ color: '#8c4a23' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
