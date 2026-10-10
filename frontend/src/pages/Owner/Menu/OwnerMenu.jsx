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
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  FileSpreadsheet,
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

  // Import / Export state
  const [showImportExportModal, setShowImportExportModal] = useState(false)

  const handleExportCSV = () => {
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
    link.setAttribute('download', 'cafeflow_menu_items.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowImportExportModal(false)
    showToast('Menu items exported as CSV', 'success')
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
                    className="owner-btn-secondary owner-import-export-btn"
                    onClick={() => setShowImportExportModal(true)}
                    title="Import or Export Menu Items"
                  >
                    <Download size={15} />
                    <span className="owner-btn-text-desktop">Import/Export</span>
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
                items={items}
                setItems={setItems}
                onOpenAddItem={handleOpenAddItem}
                showToast={showToast}
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

      {/* Modal: Import / Export */}
      {showImportExportModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-card" style={{ maxWidth: 440 }}>
            <div className="owner-modal-header">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                Import / Export Menu Data
              </h3>
              <button
                className="owner-modal-close-btn"
                onClick={() => setShowImportExportModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="owner-modal-body"
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: '#faf8f5',
                  border: '1px solid #ebdccb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#33271e' }}>
                    Export All Items (.csv)
                  </div>
                  <div style={{ fontSize: 11.5, color: '#8c7b6f' }}>
                    Download current catalogue ({items.length} dishes & drinks)
                  </div>
                </div>
                <button
                  type="button"
                  className="owner-btn-primary"
                  style={{ background: '#8c4a23', fontSize: 12 }}
                  onClick={handleExportCSV}
                >
                  <Download size={13} style={{ marginRight: 4 }} />
                  Export
                </button>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: '#faf8f5',
                  border: '1px dashed #d5c8b5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'center',
                }}
              >
                <FileSpreadsheet size={28} color="#8c4a23" />
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  Import Items from CSV
                </div>
                <div style={{ fontSize: 11.5, color: '#8c7b6f' }}>
                  Select or drag a menu CSV file to batch upload items
                </div>
                <label
                  className="owner-btn-secondary"
                  style={{ cursor: 'pointer', fontSize: 12 }}
                >
                  <Upload size={13} style={{ marginRight: 4 }} />
                  Browse File
                  <input
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setShowImportExportModal(false)
                        showToast(
                          `Imported items from ${e.target.files[0].name}`,
                          'success'
                        )
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setShowImportExportModal(false)}
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
