import { ChevronDown } from 'lucide-react'

export default function PhoneInput({
  id = 'phone-input',
  value = '',
  onChange = () => {},
  placeholder = 'Enter your mobile number',
  autoFocus = false,
}) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    onChange(raw)
  }

  return (
    <div className="phone-input-container">
      <button
        type="button"
        className="phone-input__country-btn"
        aria-label="Country Code Selection"
      >
        <span className="phone-input__flag" role="img" aria-label="India flag">🇮🇳</span>
        <span>+91</span>
        <ChevronDown size={13} />
      </button>

      <input
        id={id}
        type="tel"
        className="phone-input__text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={10}
        autoFocus={autoFocus}
        autoComplete="tel"
      />
    </div>
  )
}
