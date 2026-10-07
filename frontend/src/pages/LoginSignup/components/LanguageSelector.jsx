import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('en')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const currentLabel = languages.find((l) => l.code === selected)?.label.split(' ')[0] || 'English'

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        type="button"
        className="language-selector__btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Select Language"
      >
        <Globe size={15} />
        <span>{currentLabel}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="language-selector__dropdown" role="menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-selector__item ${selected === lang.code ? 'language-selector__item--active' : ''}`}
              onClick={() => {
                setSelected(lang.code)
                setOpen(false)
              }}
              role="menuitem"
            >
              <span>{lang.label}</span>
              {selected === lang.code && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
