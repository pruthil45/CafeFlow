import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Zap,
  Users,
  Bell,
  Volume2,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Save,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
} from 'lucide-react'

const DEFAULT_OPERATIONS_SETTINGS = {
  autoAcceptOrders: true,
  allowStaffEditOrders: true,
  sound: {
    name: 'New Order',
    filename: 'order-alert.mp3',
    badge: 'Default Sound',
    isCustom: false,
    fileSize: null,
  },
}

export default function OperationsSettingsTab({ onShowToast }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)
  const audioCtxRef = useRef(null)
  const customAudioUrlRef = useRef(null)

  // Load from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cafeflow_operations_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_OPERATIONS_SETTINGS,
          ...parsed,
          sound: {
            ...DEFAULT_OPERATIONS_SETTINGS.sound,
            ...(parsed.sound || {}),
          },
        }
      } catch (e) {
        /* fallback to defaults */
      }
    }
    return DEFAULT_OPERATIONS_SETTINGS
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  // Cleanup audio preview URLs on unmount
  useEffect(() => {
    return () => {
      if (customAudioUrlRef.current) {
        URL.revokeObjectURL(customAudioUrlRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  // Toggle order setting
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setHasUnsavedChanges(true)
  }

  // Synthesize pleasant café chime using Web Audio API
  const playSynthesizedChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) {
        setIsPlaying(false)
        return
      }
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime
      const notes = [
        { freq: 880, delay: 0, duration: 0.8 },    // A5
        { freq: 1108.73, delay: 0.12, duration: 0.9 }, // C#6
        { freq: 1318.51, delay: 0.24, duration: 1.2 }, // E6
        { freq: 1760, delay: 0.36, duration: 1.5 },   // A6
      ]

      notes.forEach(({ freq, delay, duration }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + delay)

        gain.gain.setValueAtTime(0, now + delay)
        gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + delay)
        osc.stop(now + delay + duration)
      })

      setIsPlaying(true)
      setTimeout(() => {
        setIsPlaying(false)
      }, 1900)
    } catch (e) {
      setIsPlaying(false)
    }
  }

  // Handle Preview Button
  const handleTogglePreview = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsPlaying(false)
      return
    }

    // If custom uploaded audio exists
    if (customAudioUrlRef.current) {
      if (!audioRef.current) {
        audioRef.current = new Audio(customAudioUrlRef.current)
      } else {
        audioRef.current.src = customAudioUrlRef.current
      }
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        setIsPlaying(false)
        playSynthesizedChime()
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        playSynthesizedChime()
      })
    } else {
      // Play high quality synthesized café order alert chime
      playSynthesizedChime()
    }
  }

  // Handle Audio File Selection (Upload / Replace)
  const handleAudioFile = (file) => {
    setUploadError(null)
    if (!file) return

    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-wav']
    const hasValidExt = /\.(mp3|wav|ogg)$/i.test(file.name)

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setUploadError('Please upload an MP3, WAV, or OGG audio file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Audio file must be smaller than 10MB.')
      return
    }

    // Clean up previous blob URL
    if (customAudioUrlRef.current) {
      URL.revokeObjectURL(customAudioUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    customAudioUrlRef.current = objectUrl

    const baseName = file.name.replace(/\.[^/.]+$/, '')
    const formattedName = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)

    setSettings((prev) => ({
      ...prev,
      sound: {
        name: formattedName || 'Custom Alert',
        filename: file.name,
        badge: 'Custom Sound',
        isCustom: true,
        fileSize: `${sizeMb} MB`,
      },
    }))
    setHasUnsavedChanges(true)

    if (onShowToast) {
      onShowToast(`Audio "${file.name}" loaded for preview!`)
    }
  }

  // Trigger hidden file picker
  const handleOpenPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  // Save Settings
  const handleSave = () => {
    localStorage.setItem(
      'cafeflow_operations_settings',
      JSON.stringify({
        autoAcceptOrders: settings.autoAcceptOrders,
        allowStaffEditOrders: settings.allowStaffEditOrders,
        sound: {
          name: settings.sound.name,
          filename: settings.sound.filename,
          badge: settings.sound.badge,
          isCustom: settings.sound.isCustom,
          fileSize: settings.sound.fileSize,
        },
      })
    )
    setHasUnsavedChanges(false)
    if (onShowToast) {
      onShowToast('Operations settings saved successfully!')
    }
  }

  return (
    <div className="owner-operations-page">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleAudioFile(e.target.files[0])
          }
        }}
      />

      {/* Header Block: Breadcrumb, Title & Save Changes */}
      <div className="owner-settings-header-block owner-header-with-action">
        <div>
          <nav className="owner-settings-breadcrumb" aria-label="Breadcrumb">
            <button
              type="button"
              className="owner-breadcrumb-link"
              onClick={() => navigate('/owner/settings')}
            >
              <SettingsIcon size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Settings
            </button>
            <span className="owner-breadcrumb-sep">&gt;</span>
            <span className="owner-breadcrumb-current">Operations</span>
          </nav>

          <h1 className="owner-settings-main-title">Operations</h1>
          <p className="owner-settings-main-subtitle">
            Manage how your café handles orders and notifications.
          </p>
        </div>

        <button
          type="button"
          className={`owner-btn-save ${hasUnsavedChanges ? 'highlight' : ''}`}
          onClick={handleSave}
        >
          <Save size={16} />
          <span>Save Changes</span>
          {hasUnsavedChanges && <span className="owner-unsaved-dot" />}
        </button>
      </div>

      <div className="owner-operations-cards-container">
        {/* CARD 1: ORDER SETTINGS */}
        <div className="owner-card owner-operations-card">
          <div className="owner-card-header-row">
            <div className="owner-card-icon-box">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="owner-card-title">Order Settings</h2>
              <p className="owner-card-subtitle">
                Control how orders are received and managed by your staff.
              </p>
            </div>
          </div>

          <div className="owner-operations-settings-list">
            {/* Setting 1: Auto-Accept Orders */}
            <div className="owner-operation-setting-row">
              <div className="owner-operation-setting-left">
                <div className="owner-operation-icon-circle">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="owner-operation-title">Auto-Accept Orders</h3>
                  <p className="owner-operation-desc">
                    Automatically accept new customer orders without manual confirmation.
                  </p>
                </div>
              </div>

              <label className="owner-switch-control" aria-label="Toggle Auto-Accept Orders">
                <input
                  type="checkbox"
                  checked={settings.autoAcceptOrders}
                  onChange={() => handleToggle('autoAcceptOrders')}
                />
                <span className="owner-switch-slider" />
              </label>
            </div>

            <div className="owner-card-divider" />

            {/* Setting 2: Allow Staff to Edit Orders */}
            <div className="owner-operation-setting-row">
              <div className="owner-operation-setting-left">
                <div className="owner-operation-icon-circle">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="owner-operation-title">Allow Staff to Edit Orders</h3>
                  <p className="owner-operation-desc">
                    Let staff make changes to orders when needed.
                  </p>
                </div>
              </div>

              <label className="owner-switch-control" aria-label="Toggle Allow Staff to Edit Orders">
                <input
                  type="checkbox"
                  checked={settings.allowStaffEditOrders}
                  onChange={() => handleToggle('allowStaffEditOrders')}
                />
                <span className="owner-switch-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* CARD 2: ORDER NOTIFICATION SOUND */}
        <div className="owner-card owner-operations-card">
          <div className="owner-card-header-row">
            <div className="owner-card-icon-box">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="owner-card-title">Order Notification Sound</h2>
              <p className="owner-card-subtitle">
                Choose or upload a sound for new order notifications.
              </p>
            </div>
          </div>

          {/* Active Sound Box (Matching Screenshot 3) */}
          <div className="owner-sound-preview-box">
            <div className="owner-sound-info-left">
              <div className="owner-sound-speaker-badge">
                <Volume2 size={20} />
              </div>
              <div>
                <h4 className="owner-sound-name">{settings.sound.name}</h4>
                <div className="owner-sound-filename-row">
                  <span className="owner-sound-filename">{settings.sound.filename}</span>
                  {settings.sound.fileSize && (
                    <span className="owner-sound-filesize">({settings.sound.fileSize})</span>
                  )}
                </div>
                <span className="owner-sound-badge">{settings.sound.badge}</span>
              </div>
            </div>

            <div className="owner-sound-divider-vertical" />

            <div className="owner-sound-controls-right">
              {/* Waveform Visual */}
              <div className={`owner-sound-waveform ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
                <span style={{ height: '35%' }} />
                <span style={{ height: '65%' }} />
                <span style={{ height: '45%' }} />
                <span style={{ height: '90%' }} />
                <span style={{ height: '60%' }} />
                <span style={{ height: '100%' }} />
                <span style={{ height: '70%' }} />
                <span style={{ height: '40%' }} />
                <span style={{ height: '80%' }} />
                <span style={{ height: '50%' }} />
                <span style={{ height: '25%' }} />
              </div>

              {/* Preview Button */}
              <button
                type="button"
                className={`owner-btn-outline-sound ${isPlaying ? 'active' : ''}`}
                onClick={handleTogglePreview}
                aria-label={isPlaying ? 'Pause preview sound' : 'Preview notification sound'}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
                <span>{isPlaying ? 'Pause' : 'Preview'}</span>
              </button>

              {/* Replace Button */}
              <button
                type="button"
                className="owner-btn-outline-sound"
                onClick={handleOpenPicker}
                aria-label="Replace notification sound"
              >
                <RefreshCw size={14} />
                <span>Replace</span>
              </button>
            </div>
          </div>

          {/* Dashed Upload Area (Matching Screenshot 3) */}
          <div
            className={`owner-sound-upload-area ${isDragOver ? 'drag-over' : ''}`}
            onClick={handleOpenPicker}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleAudioFile(e.dataTransfer.files[0])
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleOpenPicker()
              }
            }}
            aria-label="Upload custom notification sound"
          >
            <div className="owner-sound-upload-plus">
              <Plus size={18} strokeWidth={2.6} />
            </div>
            <div className="owner-sound-upload-title">Add Notification Sound</div>
            <div className="owner-sound-upload-sub">
              Upload a custom sound for order notifications (MP3, WAV, OGG).
            </div>
          </div>

          {uploadError && (
            <div className="owner-upload-error-msg animate-fade-in">
              <AlertCircle size={14} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
