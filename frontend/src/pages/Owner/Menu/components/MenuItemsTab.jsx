import { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  LayoutGrid,
  List,
  MoreVertical,
  Edit2,
  Check,
  X,
  Eye,
  Flame,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
  Trash2,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react'
import { OWNER_MENU_ADDONS } from '../../data/ownerMockData'
import '../../Owner.css'

export default function MenuItemsTab({
  categories,
  setCategories,
  items,
  setItems,
  onOpenAddItem,
  showToast,
  addons = [],
  variations = [],
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAvailability, setFilterAvailability] = useState('all')
  const [filterDietary, setFilterDietary] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const itemsPerPage = 12

  // Quick Filters & Sort state for Blinkit-style mobile drawers & desktop integration
  const [sortBy, setSortBy] = useState('relevance') // 'relevance', 'price-asc', 'price-desc', 'popular'
  const [selectedTypes, setSelectedTypes] = useState([]) // e.g. ['veg', 'non-veg', 'burgers']
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]) // e.g. ['under-150', '150-300', 'above-300']
  const [selectedTags, setSelectedTags] = useState([]) // e.g. ['Bestseller', 'Popular']
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)
  const [activeFilterModalTab, setActiveFilterModalTab] = useState('type') // 'type', 'price', 'availability', 'tags'
  const [filterModalSearch, setFilterModalSearch] = useState('')

  // Selected item for detail modal (default to null - NO auto-select!)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [detailTab, setDetailTab] = useState('general') // 'general', 'variants', 'addons', 'nutrition'
  const [isEditing, setIsEditing] = useState(false)
  const [activeHeroImg, setActiveHeroImg] = useState(null)
  const [customAddonInput, setCustomAddonInput] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)

  const availableAddonList = useMemo(() => {
    return addons && addons.length > 0 ? addons : OWNER_MENU_ADDONS
  }, [addons])

  // Handlers for editing variants
  const handleAddVariant = () => {
    setEditForm((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants || []),
        {
          id: `var-${Date.now()}`,
          name: '',
          price: prev.price || 0,
          stock: 30,
          active: true,
        },
      ],
    }))
  }

  const handleUpdateVariant = (index, field, value) => {
    setEditForm((prev) => {
      const updated = [...(prev.variants || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, variants: updated }
    })
  }

  const handleDeleteVariant = (index) => {
    setEditForm((prev) => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index),
    }))
  }

  // Handlers for editing add-ons
  const handleToggleAddon = (addonName) => {
    setEditForm((prev) => {
      const current = prev.selectedAddons || []
      const exists = current.includes(addonName)
      return {
        ...prev,
        selectedAddons: exists
          ? current.filter((a) => a !== addonName)
          : [...current, addonName],
      }
    })
  }

  const handleAddCustomAddon = () => {
    if (!customAddonInput.trim()) return
    const name = customAddonInput.trim()
    setEditForm((prev) => {
      const current = prev.selectedAddons || []
      if (current.includes(name)) return prev
      return {
        ...prev,
        selectedAddons: [...current, name],
      }
    })
    setCustomAddonInput('')
    showToast?.(`Added "${name}" to add-ons`)
  }

  // Edit draft for the selected item
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null
    return items.find((i) => i.id === selectedItemId) || null
  }, [items, selectedItemId])

  const [editForm, setEditForm] = useState(null)

  // Sync edit form when selected item changes (Defaults to READ-ONLY View Mode)
  const handleSelectItem = (item) => {
    setSelectedItemId(item.id)
    setEditForm({
      ...item,
      variants: item.variants ? item.variants.map((v) => ({ ...v })) : [],
      selectedAddons: item.selectedAddons ? [...item.selectedAddons] : [],
      nutrition: item.nutrition
        ? { ...item.nutrition }
        : { calories: '', protein: '', carbs: '', fat: '' },
    })
    setIsEditing(false)
    setDetailTab('general')
    setActiveHeroImg(item.image)
    setCustomAddonInput('')
  }

  // Close detail modal
  const handleCloseDetail = () => {
    setSelectedItemId(null)
    setEditForm(null)
    setIsEditing(false)
    setActiveHeroImg(null)
  }

  // Background Scroll Lock when modal is open
  useEffect(() => {
    if (selectedItemId) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [selectedItemId])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedItemId(null)
        setEditForm(null)
        setIsEditing(false)
        setActiveHeroImg(null)
      }
    }
    if (selectedItemId) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItemId])

  // Multi-filter toggle helpers
  const handleToggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    )
    setCurrentPage(1)
  }

  const handleTogglePriceRange = (rangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
    )
    setCurrentPage(1)
  }

  const handleToggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedTypes([])
    setSelectedPriceRanges([])
    setSelectedTags([])
    setFilterAvailability('all')
    setFilterDietary('all')
    setFilterModalSearch('')
    setCurrentPage(1)
  }

  const openFiltersModal = (tab = 'type') => {
    setActiveFilterModalTab(tab)
    setFilterModalSearch('')
    setIsFiltersModalOpen(true)
  }

  // Ensure all categories have images (fallback to high quality appetizing food photography)
  const categoryListWithImages = useMemo(() => {
    return categories.map((cat) => {
      let img = cat.image
      if (!img) {
        if (cat.slug === 'all') {
          img = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80'
        } else {
          img = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80'
        }
      }
      return { ...cat, displayImage: img }
    })
  }, [categories])

  // Filter Drawer Type options with counts and icons
  const filterTypeOptions = useMemo(() => {
    return [
      { id: 'veg', label: 'Pure Veg', count: items.filter((i) => i.itemType === 'veg').length, icon: '🥬' },
      { id: 'non-veg', label: 'Non-Veg', count: items.filter((i) => i.itemType === 'non-veg').length, icon: '🍗' },
      { id: 'egg', label: 'Contains Egg', count: items.filter((i) => i.itemType === 'egg').length, icon: '🥚' },
      { id: 'beverages', label: 'Beverages', count: items.filter((i) => i.category?.toLowerCase() === 'beverages').length, icon: '☕' },
      { id: 'burgers', label: 'Burgers', count: items.filter((i) => i.category?.toLowerCase() === 'burgers').length, icon: '🍔' },
      { id: 'pizzas', label: 'Pizzas', count: items.filter((i) => i.category?.toLowerCase() === 'pizzas').length, icon: '🍕' },
      { id: 'pasta', label: 'Pasta', count: items.filter((i) => i.category?.toLowerCase() === 'pasta').length, icon: '🍝' },
      { id: 'sandwiches', label: 'Sandwiches', count: items.filter((i) => i.category?.toLowerCase() === 'sandwiches').length, icon: '🥪' },
      { id: 'desserts', label: 'Desserts', count: items.filter((i) => i.category?.toLowerCase() === 'desserts').length, icon: '🍰' },
      { id: 'starters', label: 'Starters', count: items.filter((i) => i.category?.toLowerCase() === 'starters').length, icon: '🥗' },
    ]
  }, [items])

  // Filter Drawer Price options with counts
  const filterPriceOptions = useMemo(() => {
    return [
      { id: 'under-150', label: 'Below ₹150', count: items.filter((i) => Number(i.price) < 150).length },
      { id: '150-300', label: '₹150 – ₹300', count: items.filter((i) => Number(i.price) >= 150 && Number(i.price) <= 300).length },
      { id: 'above-300', label: 'Above ₹300', count: items.filter((i) => Number(i.price) > 300).length },
    ]
  }, [items])

  // Filter Drawer Availability options with counts
  const filterAvailabilityOptions = useMemo(() => {
    return [
      { id: 'active', label: 'Active (In Stock)', count: items.filter((i) => i.active).length },
      { id: 'inactive', label: 'Inactive (Out of Stock)', count: items.filter((i) => !i.active).length },
    ]
  }, [items])

  // Filter Drawer Tags options with counts
  const filterTagOptions = useMemo(() => {
    return [
      { id: 'Bestseller', label: 'Bestseller', count: items.filter((i) => i.tag === 'Bestseller').length },
      { id: 'Popular', label: 'Popular', count: items.filter((i) => i.tag === 'Popular').length },
      { id: 'Spicy', label: 'Spicy', count: items.filter((i) => i.tag === 'Spicy').length },
      { id: 'New', label: 'New Arrival', count: items.filter((i) => i.tag === 'New').length },
    ]
  }, [items])

  // Count active filter pills
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterAvailability !== 'all') count++
    if (filterDietary !== 'all') count++
    count += selectedTypes.length
    count += selectedPriceRanges.length
    count += selectedTags.length
    return count
  }, [filterAvailability, filterDietary, selectedTypes, selectedPriceRanges, selectedTags])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterAvailability !== 'all' ||
    filterDietary !== 'all' ||
    selectedCategory !== 'all' ||
    selectedTypes.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedTags.length > 0 ||
    sortBy !== 'relevance'

  // Toggle active status of an item
  const handleToggleItemStatus = (e, itemId) => {
    e.stopPropagation()
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, active: !it.active } : it))
    )
    if (editForm && editForm.id === itemId) {
      setEditForm((prev) => ({ ...prev, active: !prev.active }))
    }
    showToast('Menu item status updated!')
  }

  // Save changes to selected item
  const handleSaveChanges = (e) => {
    e.preventDefault()
    if (!editForm) return
    setItems((prev) =>
      prev.map((it) => (it.id === editForm.id ? { ...editForm } : it))
    )
    showToast(`Saved changes for ${editForm.name}!`)
  }

  // Filtered and Sorted items
  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find((c) => c.slug === selectedCategory)
        if (catObj && item.category.toLowerCase() !== catObj.name.toLowerCase()) {
          return false
        }
      }

      // Availability filter
      if (filterAvailability === 'active' && !item.active) return false
      if (filterAvailability === 'inactive' && item.active) return false

      // Dietary filter
      if (filterDietary !== 'all' && item.itemType !== filterDietary) return false

      // Multi-select Type filter
      if (selectedTypes.length > 0) {
        const matchesType = selectedTypes.some((t) => {
          if (t === 'veg' || t === 'non-veg' || t === 'egg') {
            return item.itemType === t
          }
          return item.category?.toLowerCase() === t.toLowerCase()
        })
        if (!matchesType) return false
      }

      // Price filter
      if (selectedPriceRanges.length > 0) {
        const p = Number(item.price) || 0
        const matchesPrice = selectedPriceRanges.some((range) => {
          if (range === 'under-150') return p < 150
          if (range === '150-300') return p >= 150 && p <= 300
          if (range === 'above-300') return p > 300
          return true
        })
        if (!matchesPrice) return false
      }

      // Tags filter
      if (selectedTags.length > 0) {
        if (!selectedTags.includes(item.tag)) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        const matchCat = item.category?.toLowerCase().includes(q)
        if (!matchName && !matchDesc && !matchCat) return false
      }

      return true
    })

    // Sort order
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    } else if (sortBy === 'popular') {
      result = [...result].sort((a, b) => {
        const scoreA = a.tag === 'Bestseller' ? 2 : a.tag === 'Popular' ? 1 : 0
        const scoreB = b.tag === 'Bestseller' ? 2 : b.tag === 'Popular' ? 1 : 0
        return scoreB - scoreA
      })
    }

    return result
  }, [
    items,
    categories,
    selectedCategory,
    filterAvailability,
    filterDietary,
    selectedTypes,
    selectedPriceRanges,
    selectedTags,
    searchQuery,
    sortBy,
  ])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(start, start + itemsPerPage)
  }, [filteredItems, currentPage, itemsPerPage])

  // Import/Export Modal state
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)

  // Smooth drag-to-scroll support for mobile filter chips
  const filterStripRef = useRef(null)
  useEffect(() => {
    const el = filterStripRef.current
    if (!el) return
    let isDown = false
    let startX = 0
    let scrollLeft = 0

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
    }
    const onMouseLeave = () => { isDown = false }
    const onMouseUp = () => { isDown = false }
    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.5
      el.scrollLeft = scrollLeft - walk
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  // Smooth drag-to-scroll support for mobile category rail
  const catRailRef = useRef(null)
  useEffect(() => {
    const el = catRailRef.current
    if (!el) return
    let isDown = false
    let startY = 0
    let scrollTop = 0

    const onMouseDown = (e) => {
      isDown = true
      startY = e.pageY - el.offsetTop
      scrollTop = el.scrollTop
    }
    const onMouseLeave = () => { isDown = false }
    const onMouseUp = () => { isDown = false }
    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const y = e.pageY - el.offsetTop
      const walk = (y - startY) * 1.5
      el.scrollTop = scrollTop - walk
    }

    el.addEventListener('mousedown', onMouseDown)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mousemove', onMouseMove)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '100%', minWidth: 0 }}>

      {/* 2-Part Layout: Left Sticky Categories Panel | Right Items Grid */}
      <div className="owner-menu-workspace">
        {/* LEFT: Categories Panel (Desktop full panel + Mobile vertical rail matching Image 1) */}
        <div ref={catRailRef} className="owner-categories-panel">
          {/* Desktop Categories Panel View */}
          <div className="owner-categories-desktop-view">
            <div className="owner-categories-panel-header">
              <h3 className="owner-categories-panel-title">Categories</h3>
              <button
                type="button"
                className="owner-categories-add-btn"
                title="Add Category"
                onClick={() => showToast('Open Categories tab to add new category')}
              >
                <Plus size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`owner-category-item-btn ${
                    selectedCategory === cat.slug ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.slug)
                    setCurrentPage(1)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="owner-cat-mini-thumb"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.parentElement?.querySelector('.owner-cat-mini-placeholder')
                          if (fallback) fallback.style.display = 'inline-flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="owner-cat-mini-placeholder"
                      style={{ display: cat.image ? 'none' : 'inline-flex' }}
                    >
                      <LayoutGrid size={13} />
                    </div>
                    <span className="owner-cat-name-truncate">{cat.name}</span>
                  </div>
                  <span className="owner-category-count-badge">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Categories Vertical Rail View (Blinkit style matching Image 1) */}
          <div className="owner-categories-mobile-rail">
            {categoryListWithImages.map((cat) => {
              const isActive = selectedCategory === cat.slug
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`owner-cat-rail-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.slug)
                    setCurrentPage(1)
                  }}
                >
                  <div className="owner-cat-rail-avatar-box">
                    <img
                      src={cat.displayImage}
                      alt={cat.name}
                      className="owner-cat-rail-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80'
                      }}
                    />
                  </div>
                  <span className="owner-cat-rail-label">
                    {cat.slug === 'all' ? 'All' : cat.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* CENTER: Menu Items Workspace */}
        <div className="owner-menu-items-area">
          {/* Mobile Compact Items Top Bar (Menu title + Search Box in 1 single line to eliminate empty space) */}
          <div className="owner-mobile-items-top-bar">
            <span className="owner-mobile-items-title">Menu</span>
            <div className="owner-mobile-menu-search-wrap">
              <Search size={13} />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="owner-search-clear-btn"
                  onClick={() => {
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  title="Clear"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Quick Filter Strip (Filters, Sort, Type, Price - horizontally scrollable with touch & mouse drag) */}
          <div
            ref={filterStripRef}
            className="owner-mobile-quick-filter-strip"
            role="region"
            aria-label="Filter chips"
          >
            <button
              type="button"
              className={`owner-mobile-qf-chip ${activeFilterCount > 0 ? 'active' : ''}`}
              onClick={() => openFiltersModal('type')}
            >
              <SlidersHorizontal size={11} />
              <span>Filters</span>
              <ChevronDown size={11} />
              {activeFilterCount > 0 && (
                <span className="owner-qf-badge">{activeFilterCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`owner-mobile-qf-chip ${sortBy !== 'relevance' ? 'active' : ''}`}
              onClick={() => setIsSortModalOpen(true)}
            >
              <ArrowUpDown size={11} />
              <span>
                {sortBy === 'price-asc'
                  ? 'Price: Low'
                  : sortBy === 'price-desc'
                  ? 'Price: High'
                  : sortBy === 'popular'
                  ? 'Popular'
                  : 'Sort'}
              </span>
              <ChevronDown size={11} />
            </button>

            <button
              type="button"
              className={`owner-mobile-qf-chip ${selectedTypes.length > 0 ? 'active' : ''}`}
              onClick={() => openFiltersModal('type')}
            >
              <span>{selectedTypes.length > 0 ? `Type (${selectedTypes.length})` : 'Type'}</span>
              <ChevronDown size={11} />
            </button>

            <button
              type="button"
              className={`owner-mobile-qf-chip ${selectedPriceRanges.length > 0 ? 'active' : ''}`}
              onClick={() => openFiltersModal('price')}
            >
              <span>{selectedPriceRanges.length > 0 ? `Price (${selectedPriceRanges.length})` : 'Price'}</span>
              <ChevronDown size={11} />
            </button>
          </div>
          {/* Filters Bar */}
          <div className="owner-menu-filter-bar">
            {/* Primary Row: Search input + Mobile Filter Toggle Button + View Mode Toggles */}
            <div className="owner-menu-filter-primary-row">
              <div className="owner-menu-search-input-wrap">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  aria-label="Search menu items"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="owner-search-clear-btn"
                    onClick={() => {
                      setSearchQuery('')
                      setCurrentPage(1)
                    }}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                className={`owner-filter-toggle-btn ${showMobileFilters ? 'active' : ''}`}
                onClick={() => setShowMobileFilters((prev) => !prev)}
                title="Toggle filter options"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="owner-filter-count-badge">{activeFilterCount}</span>
                )}
              </button>

              {/* Grid / List View Toggles */}
              <div className="owner-menu-view-toggles">
                <button
                  type="button"
                  className={`owner-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`owner-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>

            {/* Secondary Filters: Always visible on Desktop, collapsible on Mobile */}
            <div className={`owner-menu-filter-secondary-row ${showMobileFilters ? 'is-open' : ''}`}>
              <select
                className="owner-menu-select"
                value={filterAvailability}
                onChange={(e) => {
                  setFilterAvailability(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by availability"
              >
                <option value="all">Availability: All</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                className="owner-menu-select"
                value={filterDietary}
                onChange={(e) => {
                  setFilterDietary(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Filter by dietary type"
              >
                <option value="all">Veg/Non-Veg: All</option>
                <option value="veg">Pure Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="egg">Contains Egg</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="owner-btn-secondary owner-filter-reset-btn"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterAvailability('all')
                    setFilterDietary('all')
                    setSelectedCategory('all')
                    setCurrentPage(1)
                  }}
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>



          {/* Items Display: Grid or List */}
          {viewMode === 'grid' ? (
            <div className="owner-menu-cards-grid">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`owner-item-card ${
                    selectedItemId === item.id ? 'selected' : ''
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="owner-item-card-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="owner-item-card-image"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
                      }}
                    />
                    <button
                      type="button"
                      className="owner-item-card-more-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectItem(item)
                      }}
                      title="Item options"
                      aria-label="Item options"
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  <div className="owner-item-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className="owner-item-card-title">{item.name}</h4>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="owner-item-card-price">₹ {item.price}</span>
                      <span className="owner-item-card-cat">{item.category}</span>
                    </div>

                    <div className="owner-item-card-footer">
                      <div className="owner-item-badges-wrap">
                        {/* Dietary Badge */}
                        <span
                          className={`owner-dietary-badge ${
                            item.itemType === 'veg'
                              ? 'owner-dietary-badge--veg'
                              : item.itemType === 'non-veg'
                              ? 'owner-dietary-badge--non-veg'
                              : 'owner-dietary-badge--egg'
                          }`}
                        >
                          {item.itemType === 'veg' ? 'Veg' : item.itemType === 'non-veg' ? 'Non-Veg' : 'Egg'}
                        </span>

                        {/* Tag Badge */}
                        {item.tag && (
                          <span
                            className={`owner-tag-badge ${
                              item.tag === 'Bestseller'
                                ? 'owner-tag-badge--bestseller'
                                : item.tag === 'Popular'
                                ? 'owner-tag-badge--popular'
                                : item.tag === 'Spicy'
                                ? 'owner-tag-badge--spicy'
                                : 'owner-tag-badge--new'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Active Status Switch */}
                      <label
                        className="owner-switch"
                        onClick={(e) => e.stopPropagation()}
                        title={item.active ? 'Active' : 'Inactive'}
                      >
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(e) => handleToggleItemStatus(e, item.id)}
                        />
                        <span className="owner-switch-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="owner-menu-cards-list-view">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className={`owner-item-card ${
                    selectedItemId === item.id ? 'selected' : ''
                  }`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '8px 14px',
                    gap: '12px',
                  }}
                  onClick={() => handleSelectItem(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--owner-espresso)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#7a6a5e' }}>{item.category}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--owner-espresso)' }}>
                    ₹ {item.price}
                  </span>
                  <span
                    className={`owner-dietary-badge ${
                      item.itemType === 'veg'
                        ? 'owner-dietary-badge--veg'
                        : item.itemType === 'non-veg'
                        ? 'owner-dietary-badge--non-veg'
                        : 'owner-dietary-badge--egg'
                    }`}
                  >
                    {item.itemType}
                  </span>
                  <label className="owner-switch" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleToggleItemStatus(e, item.id)}
                    />
                    <span className="owner-switch-slider" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 16px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid var(--owner-card-border)',
                color: '#8c7b6f',
              }}
            >
              No menu items match your search or filters.
            </div>
          )}

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--owner-card-border)',
              fontSize: '12.5px',
              color: '#7a6a5e',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–
              {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}{' '}
              items
            </div>

            <div className="owner-pagination-controls">
              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`owner-pagination-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                className="owner-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div>12 per page</div>
          </div>
        </div>
      </div>

      {/* Centered Item Details Modal with Blurred Background (Read-only by default, editable on 'Edit' click) */}
      {selectedItem && editForm && (
        <div
          className="owner-modal-overlay"
          onClick={handleCloseDetail}
          aria-label="Item details modal backdrop"
        >
          <aside
            className="owner-item-detail-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Item Details Modal"
          >
            {/* Header: Changes title and controls based on isEditing */}
            <div className="owner-detail-panel-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 className="owner-detail-panel-title">
                  {isEditing ? 'Edit Item' : 'Item Details'}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#8c7b6f',
                    background: '#f0eae1',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  ID: {editForm.id}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isEditing ? (
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => setIsEditing(false)}
                  >
                    <Eye size={13} /> View Mode
                  </button>
                ) : (
                  <button
                    type="button"
                    className="owner-btn-primary"
                    style={{ padding: '4px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="owner-modal-close-btn"
                  title="Close dialog"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 1. READ-ONLY VIEW MODE (Opened until user clicks 'Edit')       */}
            {/* ============================================================== */}
            {!isEditing ? (
              <div className="owner-item-view-container">
                {/* Hero Showcase with Badges Overlay */}
                <div className="owner-item-view-hero-wrap">
                  <img
                    src={activeHeroImg || editForm.image}
                    alt={editForm.name}
                    className="owner-item-view-hero-img"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
                    }}
                  />
                  <div className="owner-item-view-badges-overlay">
                    <span
                      className={`owner-item-view-diet-badge ${
                        editForm.itemType === 'veg'
                          ? 'owner-item-view-diet-badge--veg'
                          : editForm.itemType === 'non-veg'
                          ? 'owner-item-view-diet-badge--non-veg'
                          : 'owner-item-view-diet-badge--egg'
                      }`}
                    >
                      {editForm.itemType === 'veg'
                        ? '🌱 Veg'
                        : editForm.itemType === 'non-veg'
                        ? '🍗 Non-Veg'
                        : '🥚 Egg'}
                    </span>
                    <span
                      className={`owner-item-view-status-pill ${
                        editForm.active
                          ? 'owner-item-view-status-pill--active'
                          : 'owner-item-view-status-pill--inactive'
                      }`}
                    >
                      {editForm.active ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                </div>

                {/* Identity & Price Summary */}
                <div className="owner-item-view-title-row">
                  <div>
                    <h2 className="owner-item-view-name">{editForm.name}</h2>
                    <div className="owner-item-view-meta-pills">
                      <span className="owner-item-view-pill">{editForm.category}</span>
                      {editForm.tag === 'Bestseller' && (
                        <span className="owner-item-view-pill owner-item-view-pill--bestseller">
                          ★ Bestseller
                        </span>
                      )}
                      {editForm.tag === 'Spicy' && (
                        <span className="owner-item-view-pill owner-item-view-pill--spicy">
                          🌶 Spicy
                        </span>
                      )}
                      {editForm.tag === 'New' && (
                        <span className="owner-item-view-pill owner-item-view-pill--new">
                          ✨ New
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="owner-item-view-price">₹ {editForm.price}</div>
                </div>

                {/* Segmented Detail Tabs */}
                <div className="owner-detail-tabs-nav">
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'general' ? 'active' : ''}`}
                    onClick={() => setDetailTab('general')}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'variants' ? 'active' : ''}`}
                    onClick={() => setDetailTab('variants')}
                  >
                    Variants ({editForm.variants?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'addons' ? 'active' : ''}`}
                    onClick={() => setDetailTab('addons')}
                  >
                    Add-ons ({editForm.selectedAddons?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setDetailTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </div>

                {/* Read-Only Details Body */}
                <div className="owner-detail-body">
                  {detailTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7b6f', marginBottom: '6px' }}>
                          DESCRIPTION
                        </div>
                        <p className="owner-item-view-desc">
                          {editForm.description || 'No description provided for this item.'}
                        </p>
                      </div>

                      {/* Image Gallery Thumbnails */}
                      {editForm.gallery && editForm.gallery.length > 0 && (
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7b6f', marginBottom: '8px' }}>
                            PHOTO GALLERY (Click to preview)
                          </div>
                          <div className="owner-gallery-preview-strip">
                            {/* Main photo thumbnail */}
                            <img
                              src={editForm.image}
                              alt={editForm.name}
                              className={`owner-gallery-preview-thumb ${
                                (activeHeroImg || editForm.image) === editForm.image ? 'active' : ''
                              }`}
                              onClick={() => setActiveHeroImg(editForm.image)}
                            />
                            {/* Additional gallery thumbnails */}
                            {editForm.gallery.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Gallery ${idx + 1}`}
                                className={`owner-gallery-preview-thumb ${
                                  activeHeroImg === img ? 'active' : ''
                                }`}
                                onClick={() => setActiveHeroImg(img)}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'variants' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Configured Variations ({editForm.variants?.length || 0})
                      </div>
                      {editForm.variants && editForm.variants.length > 0 ? (
                        editForm.variants.map((v) => (
                          <div
                            key={v.id}
                            style={{
                              background: '#faf8f5',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid #ede7dc',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--owner-espresso)' }}>
                                {v.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#8c7b6f', marginTop: 2 }}>
                                Stock: {v.stock} pcs available
                              </div>
                            </div>
                            <div style={{ fontWeight: 800, color: '#8c4a23', fontSize: '14.5px' }}>
                              ₹ {v.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12.5px', color: '#8c7b6f', textAlign: 'center', padding: '24px', background: '#faf8f5', borderRadius: '8px' }}>
                          No variants configured for this item.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'addons' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Linked Add-ons ({editForm.selectedAddons?.length || 0})
                      </div>
                      {editForm.selectedAddons && editForm.selectedAddons.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                          {editForm.selectedAddons.map((addonName, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: '#faf8f5',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #ede7dc',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: 'var(--owner-espresso)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span style={{ color: '#16a34a' }}>✓</span> {addonName}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '12.5px', color: '#8c7b6f', textAlign: 'center', padding: '24px', background: '#faf8f5', borderRadius: '8px' }}>
                          No add-ons linked to this item.
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'nutrition' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#7a6a5e', fontWeight: 600 }}>
                        Nutritional Facts
                      </div>
                      <div className="owner-nutrition-grid-view">
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.carbs || '—'}</div>
                          <div className="owner-nutrition-lbl">Carbs</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.protein || '—'}</div>
                          <div className="owner-nutrition-lbl">Protein</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.calories || '—'}</div>
                          <div className="owner-nutrition-lbl">Calories</div>
                        </div>
                        <div className="owner-nutrition-card">
                          <div className="owner-nutrition-val">{editForm.nutrition?.fat || '—'}</div>
                          <div className="owner-nutrition-lbl">Fat</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Read-Only Mode Footer */}
                <div className="owner-detail-footer">
                  <button
                    type="button"
                    style={{
                      marginRight: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => setItemToDelete(editForm)}
                  >
                    <Trash2 size={13} /> Delete Item
                  </button>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    onClick={handleCloseDetail}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="owner-btn-primary"
                    onClick={() => setIsEditing(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Edit2 size={14} /> Edit Item
                  </button>
                </div>
              </div>
            ) : (
              /* ============================================================== */
              /* 2. EDIT MODE (Active only when user clicks 'Edit')              */
              /* ============================================================== */
              <form onSubmit={(e) => {
                handleSaveChanges(e)
                setIsEditing(false)
              }}>
                <div className="owner-detail-hero-wrap">
                  <img src={editForm.image} alt={editForm.name} className="owner-detail-hero-img" />
                  <button
                    type="button"
                    className="owner-detail-hero-edit-btn"
                    onClick={() => showToast('Image picker opened (frontend demonstration)')}
                  >
                    <Edit2 size={12} /> Edit Photo
                  </button>
                </div>

                <div
                  style={{
                    padding: '12px 16px 6px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--owner-espresso)' }}>
                    Item Settings
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: editForm.active ? '#047857' : '#b91c1c',
                      }}
                    >
                      {editForm.active ? 'Active' : 'Inactive'}
                    </span>
                    <label className="owner-switch">
                      <input
                        type="checkbox"
                        checked={editForm.active}
                        onChange={(e) =>
                          setEditForm((prev) => ({ ...prev, active: e.target.checked }))
                        }
                      />
                      <span className="owner-switch-slider" />
                    </label>
                  </div>
                </div>

                {/* Details Tabs */}
                <div className="owner-detail-tabs-nav">
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'general' ? 'active' : ''}`}
                    onClick={() => setDetailTab('general')}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'variants' ? 'active' : ''}`}
                    onClick={() => setDetailTab('variants')}
                  >
                    Variants
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'addons' ? 'active' : ''}`}
                    onClick={() => setDetailTab('addons')}
                  >
                    Add-ons
                  </button>
                  <button
                    type="button"
                    className={`owner-detail-tab-btn ${detailTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setDetailTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </div>

                {/* Details Form Body */}
                <div className="owner-detail-body">
                  {detailTab === 'general' && (
                    <>
                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Name</label>
                        <input
                          type="text"
                          className="owner-detail-input"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Description</label>
                        <textarea
                          rows={3}
                          className="owner-detail-textarea"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.2fr 1fr',
                          gap: '10px',
                        }}
                      >
                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Category</label>
                          <select
                            className="owner-detail-select"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                          >
                            {categories
                              .filter((c) => c.slug !== 'all')
                              .map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Price (₹)</label>
                          <input
                            type="number"
                            className="owner-detail-input"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({ ...editForm, price: Number(e.target.value) })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Item Type</label>
                        <div className="owner-dietary-selector">
                          {['veg', 'non-veg', 'egg'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              className={`owner-dietary-choice-btn ${
                                editForm.itemType === type ? 'selected' : ''
                              }`}
                              onClick={() => setEditForm({ ...editForm, itemType: type })}
                            >
                              {type === 'veg' ? '🌱 Veg' : type === 'non-veg' ? '🍗 Non-Veg' : '🥚 Egg'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Badges & Highlights</label>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'Bestseller'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'Bestseller' : null,
                                })
                              }
                            />
                            Bestseller
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'Spicy'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'Spicy' : null,
                                })
                              }
                            />
                            Spicy
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="checkbox"
                              checked={editForm.tag === 'New'}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  tag: e.target.checked ? 'New' : null,
                                })
                              }
                            />
                            New Item
                          </label>
                        </div>
                      </div>

                      <div className="owner-detail-field">
                        <label className="owner-detail-label">Image Gallery</label>
                        <div className="owner-gallery-strip">
                          {editForm.gallery?.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Thumbnail"
                              className="owner-gallery-thumb"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ))}
                          <button
                            type="button"
                            className="owner-gallery-add-btn"
                            onClick={() => showToast('Image upload demo')}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {detailTab === 'variants' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso)' }}>
                          Item Variants ({(editForm.variants || []).length})
                        </div>
                        <button
                          type="button"
                          className="owner-btn-secondary"
                          style={{
                            fontSize: '11.5px',
                            padding: '4px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            borderColor: '#d5c8b5',
                            color: '#8c4a23',
                          }}
                          onClick={handleAddVariant}
                        >
                          <Plus size={13} />
                          <span>Add Variant</span>
                        </button>
                      </div>

                      {(editForm.variants || []).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {editForm.variants.map((v, idx) => (
                            <div
                              key={v.id || idx}
                              style={{
                                background: '#faf8f5',
                                padding: '10px 12px',
                                borderRadius: '10px',
                                border: '1px solid #ebdccb',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#7a6a5e', display: 'block', marginBottom: '2px' }}>
                                    Variant Name
                                  </label>
                                  <input
                                    type="text"
                                    className="owner-detail-input"
                                    placeholder="e.g. Regular, Large"
                                    value={v.name}
                                    onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                                    required
                                  />
                                </div>
                                <div style={{ width: '85px' }}>
                                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#7a6a5e', display: 'block', marginBottom: '2px' }}>
                                    Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    className="owner-detail-input"
                                    placeholder="200"
                                    value={v.price}
                                    onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                                    required
                                  />
                                </div>
                                <div style={{ width: '75px' }}>
                                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#7a6a5e', display: 'block', marginBottom: '2px' }}>
                                    Stock
                                  </label>
                                  <input
                                    type="number"
                                    className="owner-detail-input"
                                    placeholder="25"
                                    value={v.stock}
                                    onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                                  />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '14px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteVariant(idx)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#dc2626',
                                      cursor: 'pointer',
                                      padding: '6px',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                    title="Delete variant"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#8c7b6f',
                            textAlign: 'center',
                            padding: '24px 16px',
                            background: '#faf8f5',
                            borderRadius: '8px',
                            border: '1px dashed #e2dad0',
                          }}
                        >
                          <p style={{ margin: '0 0 8px 0' }}>No variants configured for this item.</p>
                          <button
                            type="button"
                            className="owner-btn-secondary"
                            style={{ fontSize: '12px', padding: '5px 12px' }}
                            onClick={handleAddVariant}
                          >
                            <Plus size={13} /> Add First Variant
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {detailTab === 'addons' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso)' }}>
                          Linked Add-ons ({(editForm.selectedAddons || []).length})
                        </div>
                        <span style={{ fontSize: '11px', color: '#8c7b6f' }}>
                          Check to link add-on
                        </span>
                      </div>

                      {/* Selected Chips */}
                      {(editForm.selectedAddons || []).length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {editForm.selectedAddons.map((addonName, idx) => (
                            <span
                              key={idx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#8c4a23',
                                color: '#ffffff',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                padding: '3px 8px 3px 10px',
                                borderRadius: '14px',
                              }}
                            >
                              <span>{addonName}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleAddon(addonName)}
                                style={{
                                  background: 'rgba(255,255,255,0.25)',
                                  border: 'none',
                                  color: '#fff',
                                  borderRadius: '50%',
                                  width: '15px',
                                  height: '15px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                                title="Remove add-on"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Available Add-ons Selector */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                          gap: '8px',
                          maxHeight: '180px',
                          overflowY: 'auto',
                          padding: '6px',
                          background: '#faf8f5',
                          borderRadius: '8px',
                          border: '1px solid #ebdccb',
                        }}
                      >
                        {availableAddonList.map((addon) => {
                          const isSelected = (editForm.selectedAddons || []).includes(addon.name)
                          return (
                            <label
                              key={addon.id || addon.name}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                background: isSelected ? '#ffffff' : '#fdfbf7',
                                border: isSelected ? '1px solid #8c4a23' : '1px solid #eee5d9',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleAddon(addon.name)}
                                  style={{ accentColor: '#8c4a23', width: '14px', height: '14px' }}
                                />
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--owner-espresso)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {addon.name}
                                </span>
                              </div>
                              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c4a23', flexShrink: 0, marginLeft: '6px' }}>
                                +₹{addon.price}
                              </span>
                            </label>
                          )
                        })}
                      </div>

                      {/* Add Custom Add-on Input */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="owner-detail-input"
                          placeholder="Add custom add-on (e.g. Garlic Mayo)"
                          value={customAddonInput}
                          onChange={(e) => setCustomAddonInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddCustomAddon()
                            }
                          }}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="owner-btn-secondary"
                          onClick={handleAddCustomAddon}
                          style={{ fontSize: '11.5px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                        >
                          <Plus size={13} /> Add
                        </button>
                      </div>
                    </div>
                  )}

                  {detailTab === 'nutrition' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--owner-espresso)' }}>
                          Nutrition Information (Optional)
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: '#8c7b6f' }}>
                          Edit nutritional values per serving.
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '10px',
                        }}
                      >
                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Carbohydrates</label>
                          <input
                            type="text"
                            className="owner-detail-input"
                            placeholder="e.g. 45g"
                            value={editForm.nutrition?.carbs || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                nutrition: { ...(prev.nutrition || {}), carbs: e.target.value },
                              }))
                            }
                          />
                        </div>

                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Protein</label>
                          <input
                            type="text"
                            className="owner-detail-input"
                            placeholder="e.g. 28g"
                            value={editForm.nutrition?.protein || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                nutrition: { ...(prev.nutrition || {}), protein: e.target.value },
                              }))
                            }
                          />
                        </div>

                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Calories</label>
                          <input
                            type="text"
                            className="owner-detail-input"
                            placeholder="e.g. 580 kcal"
                            value={editForm.nutrition?.calories || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                nutrition: { ...(prev.nutrition || {}), calories: e.target.value },
                              }))
                            }
                          />
                        </div>

                        <div className="owner-detail-field">
                          <label className="owner-detail-label">Fat</label>
                          <input
                            type="text"
                            className="owner-detail-input"
                            placeholder="e.g. 22g"
                            value={editForm.nutrition?.fat || ''}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                nutrition: { ...(prev.nutrition || {}), fat: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="owner-detail-footer">
                  <button
                    type="button"
                    style={{
                      marginRight: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      color: '#dc2626',
                      borderColor: '#fecaca',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                    onClick={() => setItemToDelete(editForm)}
                  >
                    <Trash2 size={13} /> Delete Item
                  </button>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    onClick={() => {
                      setEditForm({ ...selectedItem })
                      setIsEditing(false)
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="owner-btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div
          className="owner-modal-overlay"
          style={{ zIndex: 1200 }}
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="owner-modal-card"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="owner-modal-header"
              style={{ borderBottom: '1px solid #fee2e2', background: '#fff5f5' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626' }}>
                <Trash2 size={18} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Delete Menu Item?</h3>
              </div>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setItemToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="owner-modal-body"
              style={{ padding: '18px 20px', fontSize: '13.5px', color: '#4a3f35', lineHeight: 1.5 }}
            >
              Are you sure you want to permanently delete <strong>"{itemToDelete.name}"</strong>? This will remove the item from your cafe menu.
            </div>
            <div
              className="owner-modal-footer"
              style={{ padding: '12px 18px', background: '#faf8f5', display: 'flex', justifyContent: 'flex-end', gap: 10 }}
            >
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                style={{ background: '#dc2626', borderColor: '#dc2626', color: '#fff' }}
                onClick={() => {
                  setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id))
                  setCategories?.((prev) =>
                    prev.map((c) => {
                      if (c.slug === 'all') return { ...c, count: Math.max(0, c.count - 1) }
                      if (c.name.toLowerCase() === itemToDelete.category.toLowerCase()) {
                        return { ...c, count: Math.max(0, c.count - 1) }
                      }
                      return c
                    })
                  )
                  showToast?.(`"${itemToDelete.name}" deleted successfully!`, 'success')
                  handleCloseDetail()
                  setItemToDelete(null)
                }}
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Menu CSV Dialog */}
      {isImportExportOpen && (
        <div className="owner-modal-overlay" onClick={() => setIsImportExportOpen(false)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2 className="owner-modal-title">Export Menu Data</h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsImportExportOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px', borderRadius: '8px', background: '#faf8f5', border: '1px solid #eee8df' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: 800 }}>Export Menu (CSV)</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#7a6a5e' }}>
                    Download current catalogue items with price, category, status, and variants.
                  </p>
                  <button
                    type="button"
                    className="owner-btn-secondary"
                    style={{ marginTop: '10px', fontSize: '12.5px' }}
                    onClick={() => {
                      showToast('Menu items exported to CSV successfully!')
                      setIsImportExportOpen(false)
                    }}
                  >
                    <Download size={14} /> Download CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort by Bottom Sheet Drawer (Matching Blinkit Image 3) */}
      {isSortModalOpen && (
        <div className="owner-quick-modal-backdrop" onClick={() => setIsSortModalOpen(false)}>
          <div className="owner-sort-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="owner-sheet-close-circle"
              onClick={() => setIsSortModalOpen(false)}
              aria-label="Close sort menu"
            >
              <X size={16} />
            </button>

            <h3 className="owner-sort-sheet-title">Sort by</h3>

            <div className="owner-sort-options-list">
              {[
                { id: 'relevance', label: 'Relevance (default)' },
                { id: 'price-asc', label: 'Price (low to high)' },
                { id: 'price-desc', label: 'Price (high to low)' },
                { id: 'popular', label: 'Discount / Popularity (Bestsellers first)' },
              ].map((opt) => {
                const isSelected = sortBy === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`owner-sort-option-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSortBy(opt.id)
                      setCurrentPage(1)
                      setIsSortModalOpen(false)
                    }}
                  >
                    <div className={`owner-sort-radio-outer ${isSelected ? 'selected' : ''}`}>
                      {isSelected && <div className="owner-sort-radio-inner" />}
                    </div>
                    <span className="owner-sort-option-label">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filters 2-Column Bottom Sheet Drawer (Matching Blinkit Images 2 & 4) */}
      {isFiltersModalOpen && (
        <div className="owner-quick-modal-backdrop" onClick={() => setIsFiltersModalOpen(false)}>
          <div className="owner-filters-sheet" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="owner-sheet-close-circle"
              onClick={() => setIsFiltersModalOpen(false)}
              aria-label="Close filters menu"
            >
              <X size={16} />
            </button>

            <div className="owner-filters-sheet-header">
              <h3 className="owner-filters-sheet-title">Filters</h3>
              <div className="owner-filters-search-wrap">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search across filters..."
                  value={filterModalSearch}
                  onChange={(e) => setFilterModalSearch(e.target.value)}
                />
                {filterModalSearch && (
                  <button
                    type="button"
                    className="owner-search-clear-btn"
                    onClick={() => setFilterModalSearch('')}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            <div className="owner-filters-split-body">
              {/* Left Column: Filter categories list */}
              <div className="owner-filters-tabs-col">
                {[
                  { id: 'type', label: 'Type' },
                  { id: 'price', label: 'Price' },
                  { id: 'availability', label: 'Availability' },
                  { id: 'tags', label: 'Dietary & Tags' },
                ].map((tab) => {
                  const isTabActive = activeFilterModalTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`owner-filters-tab-btn ${isTabActive ? 'active' : ''}`}
                      onClick={() => setActiveFilterModalTab(tab.id)}
                    >
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right Column: Filter options with checkboxes and counts */}
              <div className="owner-filters-options-col">
                {activeFilterModalTab === 'type' && (
                  <div className="owner-filters-options-list">
                    {filterTypeOptions
                      .filter((opt) =>
                        filterModalSearch
                          ? opt.label.toLowerCase().includes(filterModalSearch.toLowerCase())
                          : true
                      )
                      .map((opt) => {
                        const isChecked = selectedTypes.includes(opt.id)
                        return (
                          <div
                            key={opt.id}
                            className="owner-filter-option-row"
                            onClick={() => handleToggleType(opt.id)}
                          >
                            <div className="owner-filter-option-left">
                              <span className="owner-filter-type-emoji">{opt.icon}</span>
                              <span className="owner-filter-option-text">
                                {opt.label} <span className="owner-filter-count">({opt.count})</span>
                              </span>
                            </div>
                            <div className={`owner-filter-checkbox ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

                {activeFilterModalTab === 'price' && (
                  <div className="owner-filters-options-list">
                    {filterPriceOptions
                      .filter((opt) =>
                        filterModalSearch
                          ? opt.label.toLowerCase().includes(filterModalSearch.toLowerCase())
                          : true
                      )
                      .map((opt) => {
                        const isChecked = selectedPriceRanges.includes(opt.id)
                        return (
                          <div
                            key={opt.id}
                            className="owner-filter-option-row"
                            onClick={() => handleTogglePriceRange(opt.id)}
                          >
                            <div className="owner-filter-option-left">
                              <span className="owner-filter-option-text">
                                {opt.label} <span className="owner-filter-count">({opt.count})</span>
                              </span>
                            </div>
                            <div className={`owner-filter-checkbox ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

                {activeFilterModalTab === 'availability' && (
                  <div className="owner-filters-options-list">
                    {filterAvailabilityOptions
                      .filter((opt) =>
                        filterModalSearch
                          ? opt.label.toLowerCase().includes(filterModalSearch.toLowerCase())
                          : true
                      )
                      .map((opt) => {
                        const isChecked = filterAvailability === opt.id
                        return (
                          <div
                            key={opt.id}
                            className="owner-filter-option-row"
                            onClick={() => {
                              setFilterAvailability((prev) => (prev === opt.id ? 'all' : opt.id))
                              setCurrentPage(1)
                            }}
                          >
                            <div className="owner-filter-option-left">
                              <span className="owner-filter-option-text">
                                {opt.label} <span className="owner-filter-count">({opt.count})</span>
                              </span>
                            </div>
                            <div className={`owner-filter-checkbox ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}

                {activeFilterModalTab === 'tags' && (
                  <div className="owner-filters-options-list">
                    {filterTagOptions
                      .filter((opt) =>
                        filterModalSearch
                          ? opt.label.toLowerCase().includes(filterModalSearch.toLowerCase())
                          : true
                      )
                      .map((opt) => {
                        const isChecked = selectedTags.includes(opt.id)
                        return (
                          <div
                            key={opt.id}
                            className="owner-filter-option-row"
                            onClick={() => handleToggleTag(opt.id)}
                          >
                            <div className="owner-filter-option-left">
                              <span className="owner-filter-option-text">
                                {opt.label} <span className="owner-filter-count">({opt.count})</span>
                              </span>
                            </div>
                            <div className={`owner-filter-checkbox ${isChecked ? 'checked' : ''}`}>
                              {isChecked && <Check size={13} strokeWidth={3} />}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>

            <div className="owner-filters-sheet-footer">
              <button
                type="button"
                className="owner-filters-clear-btn"
                onClick={handleClearFilters}
              >
                Clear Filter
              </button>
              <button
                type="button"
                className="owner-filters-apply-btn"
                onClick={() => setIsFiltersModalOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
