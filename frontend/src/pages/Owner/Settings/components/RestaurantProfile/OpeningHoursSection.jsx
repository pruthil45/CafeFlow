import { useState, useEffect } from 'react'
import { Copy, Info, Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { TIME_SLOTS } from '../../data/restaurantProfileMockData'

export default function OpeningHoursSection({ data, onSave, onDataChange, onShowToast, onPrev, onNext }) {
  const [schedule, setSchedule] = useState(data.schedule || [])

  useEffect(() => {
    if (data.schedule) {
      setSchedule(data.schedule)
    }
  }, [data])

  const handleDayChange = (index, field, value) => {
    const updated = schedule.map((item, i) => {
      if (i === index) {
        const next = { ...item, [field]: value }
        // If turning 24h on, ensure status is open
        if (field === 'is24' && value) {
          next.status = 'open'
        }
        return next
      }
      return item
    })
    setSchedule(updated)
    if (onDataChange) onDataChange('hours', { schedule: updated })
  }

  const handleToggleStatus = (index) => {
    const current = schedule[index]
    const nextStatus = current.status === 'open' ? 'closed' : 'open'
    handleDayChange(index, 'status', nextStatus)
  }

  // Copy Monday settings to all days
  const handleCopyMondayToAll = () => {
    const monday = schedule[0]
    if (!monday) return

    const updated = schedule.map((item) => ({
      ...item,
      status: monday.status,
      is24: monday.is24,
      openTime: monday.openTime,
      closeTime: monday.closeTime,
    }))

    setSchedule(updated)
    if (onDataChange) onDataChange('hours', { schedule: updated })
    if (onShowToast) {
      onShowToast("Monday's schedule copied to all days!")
    }
  }

  // Copy individual day schedule to subsequent day or all
  const handleCopyDay = (index) => {
    const sourceDay = schedule[index]
    if (!sourceDay) return

    // Apply to all other days
    const updated = schedule.map((item, i) =>
      i === index
        ? item
        : {
            ...item,
            status: sourceDay.status,
            is24: sourceDay.is24,
            openTime: sourceDay.openTime,
            closeTime: sourceDay.closeTime,
          }
    )

    setSchedule(updated)
    if (onDataChange) onDataChange('hours', { schedule: updated })
    if (onShowToast) {
      onShowToast(`${sourceDay.day}'s schedule copied to all days!`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave('hours', { schedule })
  }

  return (
    <form className="rp-section-form" onSubmit={handleSubmit}>
      {/* Section Header */}
      <div className="rp-section-head">
        <h2 className="rp-section-title">Opening Hours</h2>
        <p className="rp-section-subtitle">
          Set your restaurant's operating hours. These hours apply to all services.
        </p>
      </div>

      <div className="rp-form-card rp-hours-card">
        {/* Desktop Schedule Table */}
        <div className="rp-hours-table-wrap">
          <table className="rp-hours-table" aria-label="Restaurant operating schedule">
            <thead>
              <tr>
                <th scope="col" style={{ width: '16%' }}>DAY</th>
                <th scope="col" style={{ width: '14%' }}>STATUS</th>
                <th scope="col" style={{ width: '15%' }}>24 HOURS</th>
                <th scope="col" style={{ width: '22%' }}>OPENING TIME</th>
                <th scope="col" style={{ width: '4%' }}></th>
                <th scope="col" style={{ width: '22%' }}>CLOSING TIME</th>
                <th scope="col" style={{ width: '7%', textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => {
                const isOpen = item.status === 'open'
                const is24 = item.is24
                const isTimeDisabled = !isOpen || is24

                return (
                  <tr key={item.day} className={!isOpen ? 'rp-row--closed' : ''}>
                    {/* Day Name */}
                    <td className="rp-day-cell">
                      <span className="rp-day-name">{item.day}</span>
                    </td>

                    {/* Status Pill Toggle */}
                    <td>
                      <button
                        type="button"
                        className={`rp-status-pill ${isOpen ? 'rp-status-pill--open' : 'rp-status-pill--closed'}`}
                        onClick={() => handleToggleStatus(index)}
                        title={`Click to ${isOpen ? 'close' : 'open'}`}
                        aria-label={`${item.day} is ${isOpen ? 'Open' : 'Closed'}. Click to toggle.`}
                      >
                        <span className="rp-status-dot" aria-hidden="true" />
                        <span>{isOpen ? 'Open' : 'Closed'}</span>
                      </button>
                    </td>

                    {/* 24 Hours Toggle */}
                    <td>
                      <label className="rp-switch" aria-label={`Toggle 24 hours for ${item.day}`}>
                        <input
                          type="checkbox"
                          checked={!!item.is24}
                          disabled={!isOpen}
                          onChange={(e) => handleDayChange(index, 'is24', e.target.checked)}
                        />
                        <span className="rp-switch-slider" />
                      </label>
                    </td>

                    {/* Opening Time */}
                    <td>
                      <select
                        className="rp-time-select"
                        value={item.openTime || '09:00 AM'}
                        disabled={isTimeDisabled}
                        onChange={(e) => handleDayChange(index, 'openTime', e.target.value)}
                        aria-label={`${item.day} opening time`}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 'to' separator */}
                    <td className="rp-to-cell">
                      <span className="rp-to-label">to</span>
                    </td>

                    {/* Closing Time */}
                    <td>
                      <select
                        className="rp-time-select"
                        value={item.closeTime || '11:00 PM'}
                        disabled={isTimeDisabled}
                        onChange={(e) => handleDayChange(index, 'closeTime', e.target.value)}
                        aria-label={`${item.day} closing time`}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Copy action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="rp-copy-day-btn"
                        onClick={() => handleCopyDay(index)}
                        title={`Copy ${item.day}'s schedule to all other days`}
                        aria-label={`Copy ${item.day}'s schedule to all other days`}
                      >
                        <Copy size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Schedule Cards (Stacked View for screens <= 768px) */}
        <div className="rp-hours-mobile-cards">
          {schedule.map((item, index) => {
            const isOpen = item.status === 'open'
            const is24 = item.is24
            const isTimeDisabled = !isOpen || is24

            return (
              <div key={item.day} className={`rp-hours-mobile-card ${!isOpen ? 'closed' : ''}`}>
                <div className="rp-hours-card-top">
                  <span className="rp-day-name">{item.day}</span>
                  <div className="rp-hours-card-controls">
                    <button
                      type="button"
                      className={`rp-status-pill ${isOpen ? 'rp-status-pill--open' : 'rp-status-pill--closed'}`}
                      onClick={() => handleToggleStatus(index)}
                    >
                      <span className="rp-status-dot" />
                      <span>{isOpen ? 'Open' : 'Closed'}</span>
                    </button>

                    <button
                      type="button"
                      className="rp-copy-day-btn"
                      onClick={() => handleCopyDay(index)}
                      title="Copy day"
                    >
                      <Copy size={15} />
                    </button>
                  </div>
                </div>

                <div className="rp-hours-card-middle">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label className="rp-switch">
                      <input
                        type="checkbox"
                        checked={!!item.is24}
                        disabled={!isOpen}
                        onChange={(e) => handleDayChange(index, 'is24', e.target.checked)}
                      />
                      <span className="rp-switch-slider" />
                    </label>
                    <span style={{ fontSize: '12px', color: '#6d5b4f' }}>24 Hours</span>
                  </div>

                  {!is24 && isOpen && (
                    <div className="rp-hours-time-row">
                      <select
                        className="rp-time-select"
                        value={item.openTime || '09:00 AM'}
                        disabled={isTimeDisabled}
                        onChange={(e) => handleDayChange(index, 'openTime', e.target.value)}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <span className="rp-to-label">to</span>
                      <select
                        className="rp-time-select"
                        value={item.closeTime || '11:00 PM'}
                        disabled={isTimeDisabled}
                        onChange={(e) => handleDayChange(index, 'closeTime', e.target.value)}
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {is24 && isOpen && (
                    <span style={{ fontSize: '12.5px', color: '#16a34a', fontWeight: 600 }}>
                      Open 24 Hours
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note Panel matching Screenshot 1 */}
        <div className="rp-note-banner">
          <div className="rp-note-icon-wrap" aria-hidden="true">
            <Info size={18} />
          </div>
          <div className="rp-note-content">
            <h4 className="rp-note-title">Note</h4>
            <p className="rp-note-text">
              These hours will be used for receipts and internal reference only.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="rp-hours-bottom-bar">
        <div className="rp-hours-actions-left">
          {onPrev && (
            <button
              type="button"
              className="rp-btn-step-nav"
              onClick={onPrev}
            >
              <ArrowLeft size={15} />
              <span>Back: Address</span>
            </button>
          )}

          <button
            type="button"
            className="rp-btn-outline"
            onClick={handleCopyMondayToAll}
          >
            <Copy size={15} />
            <span>Copy Monday to All</span>
          </button>
        </div>

        <div className="rp-hours-actions-right">
          {onNext && (
            <button
              type="button"
              className="rp-btn-step-nav"
              onClick={onNext}
            >
              <span>Next: Locale</span>
              <ArrowRight size={15} />
            </button>
          )}

          <button type="submit" className="rp-btn-save">
            Save Hours
          </button>
        </div>
      </div>
    </form>
  )
}
