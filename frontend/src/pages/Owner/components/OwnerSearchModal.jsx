import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ShoppingCart, UtensilsCrossed, User, LayoutGrid, ArrowRight } from 'lucide-react'
import { SEARCH_ITEMS } from '../data/ownerMockData'

export default function OwnerSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredItems = query.trim()
    ? SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.sub.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS

  const getItemIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} color="#c47d2e" />
      case 'menu':
        return <UtensilsCrossed size={16} color="#10b981" />
      case 'customer':
        return <User size={16} color="#3b82f6" />
      case 'table':
        return <LayoutGrid size={16} color="#8c4a23" />
      default:
        return <Search size={16} />
    }
  }

  const handleSelect = (route) => {
    onClose()
    if (route) {
      navigate(route)
    }
  }

  return (
    <div
      className="owner-search-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Orders, Menu items and Customers"
    >
      <div
        className="owner-search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="owner-search-input-wrap">
          <Search size={18} color="#8c7b6f" />
          <input
            ref={inputRef}
            type="text"
            className="owner-search-input-field"
            placeholder="Search orders, menu items, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c7b6f', display: 'flex' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="owner-search-close-kbd" onClick={onClose}>
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="owner-search-results-list">
          {filteredItems.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#9c9186', fontSize: '13.5px' }}>
              No matches found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              <div className="owner-search-category-title">
                {query ? 'Search Results' : 'Suggested Searches'}
              </div>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="owner-search-result-row"
                  onClick={() => handleSelect(item.route)}
                >
                  <div className="owner-search-result-left">
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '7px',
                        background: '#fdf7f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getItemIcon(item.type)}
                    </div>
                    <div>
                      <div className="owner-search-result-title">{item.title}</div>
                      <div className="owner-search-result-sub">{item.sub}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="owner-search-result-badge">
                      {item.type.toUpperCase()}
                    </span>
                    <ArrowRight size={14} color="#8c7b6f" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
