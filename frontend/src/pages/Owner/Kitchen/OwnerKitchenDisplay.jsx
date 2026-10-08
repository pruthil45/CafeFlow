import { useState, useMemo } from 'react'
import {
  ChefHat,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  PlusCircle,
  Check,
  Printer,
  Flame,
  X,
} from 'lucide-react'
import { OWNER_KITCHEN_DATA } from '../data/ownerMockData'
import '../Owner.css'

export default function OwnerKitchenDisplay() {
  const [orders, setOrders] = useState(OWNER_KITCHEN_DATA.initialOrders)
  const [selectedTable, setSelectedTable] = useState('all') // 'all', 'T1', 'T2', etc.
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mobileStatusTab, setMobileStatusTab] = useState('queued') // 'queued', 'in-progress', 'completed'
  const [toastMessage, setToastMessage] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeMenuOrderId, setActiveMenuOrderId] = useState(null)

  // Show transient toast notification
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Filter orders by table
  const filteredOrders = useMemo(() => {
    if (selectedTable === 'all') return orders
    return orders.filter((o) => o.table.toLowerCase() === selectedTable.toLowerCase())
  }, [orders, selectedTable])

  // Split into columns
  const queuedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'queued'),
    [filteredOrders]
  )
  const inProgressOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'in-progress'),
    [filteredOrders]
  )
  const completedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'completed'),
    [filteredOrders]
  )

  // Move order from Queued to In Progress
  const handleStartPreparing = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'in-progress',
            elapsedTime: '1 min',
            elapsedMinutes: 1,
            progressPercent: 15,
          }
        }
        return o
      })
    )
    showToast(`Order #${orderId.replace('K-', '')} moved to In Progress!`)
  }

  // Move order from In Progress to Completed
  const handleMarkAsCompleted = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'completed',
            completedTimeAgo: 'Just now',
          }
        }
        return o
      })
    )
    showToast(`Order #${orderId.replace('K-', '')} marked as Completed!`)
  }

  // Prioritize / Rush order
  const handleRushOrder = (orderId) => {
    setOrders((prev) => {
      const target = prev.find((o) => o.id === orderId)
      if (!target) return prev
      const without = prev.filter((o) => o.id !== orderId)
      return [{ ...target, isRushed: true }, ...without]
    })
    setActiveMenuOrderId(null)
    showToast(`Order #${orderId.replace('K-', '')} flagged as Rush / Priority!`)
  }

  // Toggle fullscreen mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
      setIsFullscreen(false)
    }
  }

  // Add demo order to queued
  const handleAddDemoOrder = () => {
    const newNum = String(Math.floor(Math.random() * 80) + 130)
    const tablesList = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8']
    const assignedTable = tablesList[Math.floor(Math.random() * tablesList.length)]
    const newOrder = {
      id: `K-${newNum}`,
      orderNum: newNum,
      table: assignedTable,
      timeAgo: 'Just now',
      receivedTimestamp: Date.now(),
      status: 'queued',
      items: [
        {
          name: 'Classic Burger',
          qty: 1,
          modifier: 'Extra Cheese',
          image:
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=60&auto=format&fit=crop&q=80',
        },
        {
          name: 'Cold Coffee',
          qty: 1,
          modifier: 'Regular Ice',
          image:
            'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=60&auto=format&fit=crop&q=80',
        },
      ],
      note: 'Rush order for guest',
    }
    setOrders((prev) => [newOrder, ...prev])
    showToast(`New incoming order #${newNum} added to kitchen queue!`)
  }

  return (
    <div className="owner-module-container owner-kitchen-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="owner-toast" role="status">
          {toastMessage}
        </div>
      )}

      {/* Top Header & Operational Controls */}
      <div className="owner-kitchen-top-bar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ea580c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChefHat size={20} />
            </div>
            <h1 className="owner-module-title" style={{ margin: 0 }}>
              Kitchen Display
            </h1>
          </div>
          <p className="owner-module-subtitle" style={{ marginTop: '2px' }}>
            Live kitchen orders and preparation status.
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="owner-kitchen-controls">
          {/* Table filter dropdown */}
          <select
            className="owner-kitchen-table-select"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            aria-label="Filter by Table"
          >
            <option value="all">All Tables</option>
            <option value="T1">Table T1</option>
            <option value="T2">Table T2</option>
            <option value="T3">Table T3</option>
            <option value="T4">Table T4</option>
            <option value="T5">Table T5</option>
            <option value="T6">Table T6</option>
            <option value="T7">Table T7</option>
            <option value="T8">Table T8</option>
          </select>

          {/* Sound toggle */}
          <button
            type="button"
            className={`owner-kitchen-icon-btn ${isSoundEnabled ? 'active' : ''}`}
            onClick={() => {
              setIsSoundEnabled(!isSoundEnabled)
              showToast(isSoundEnabled ? 'Kitchen sound alert muted' : 'Kitchen sound alert enabled')
            }}
            title={isSoundEnabled ? 'Sound alert active' : 'Sound alert muted'}
            aria-label="Toggle kitchen alert sound"
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            className="owner-kitchen-icon-btn"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen KDS'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* KDS Settings */}
          <button
            type="button"
            className="owner-kitchen-icon-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Kitchen Display Settings"
            aria-label="Kitchen Display Settings"
          >
            <Settings size={18} />
          </button>

          {/* Quick Demo Order button */}
          <button
            type="button"
            className="owner-btn-secondary"
            style={{ padding: '7px 12px', fontSize: '12.5px' }}
            onClick={handleAddDemoOrder}
            title="Simulate incoming ticket"
          >
            <PlusCircle size={15} />
            + New Ticket
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="owner-kitchen-kpi-grid">
        <div className="owner-kitchen-kpi-card">
          <div className="owner-kitchen-kpi-icon-wrap owner-kitchen-kpi-icon-wrap--queued">
            <Clock size={22} />
          </div>
          <div>
            <div className="owner-kitchen-kpi-val">{queuedOrders.length}</div>
            <div className="owner-kitchen-kpi-lbl">Queued</div>
          </div>
        </div>

        <div className="owner-kitchen-kpi-card">
          <div className="owner-kitchen-kpi-icon-wrap owner-kitchen-kpi-icon-wrap--progress">
            <Play size={20} fill="#2563eb" />
          </div>
          <div>
            <div className="owner-kitchen-kpi-val">{inProgressOrders.length}</div>
            <div className="owner-kitchen-kpi-lbl">In Progress</div>
          </div>
        </div>

        <div className="owner-kitchen-kpi-card">
          <div className="owner-kitchen-kpi-icon-wrap owner-kitchen-kpi-icon-wrap--completed">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="owner-kitchen-kpi-val">{completedOrders.length}</div>
            <div className="owner-kitchen-kpi-lbl">Completed Today</div>
          </div>
        </div>

        <div className="owner-kitchen-kpi-card">
          <div className="owner-kitchen-kpi-icon-wrap owner-kitchen-kpi-icon-wrap--time">
            <Clock size={22} />
          </div>
          <div>
            <div className="owner-kitchen-kpi-val">18 min</div>
            <div className="owner-kitchen-kpi-lbl">Avg. Preparation Time</div>
          </div>
        </div>
      </div>

      {/* Mobile Kanban Tabs Bar (Visible on <= 768px screens) */}
      <div className="owner-kitchen-mobile-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mobileStatusTab === 'queued'}
          className={`owner-kitchen-mobile-tab-btn ${
            mobileStatusTab === 'queued' ? 'active' : ''
          }`}
          onClick={() => setMobileStatusTab('queued')}
        >
          <span>Queued</span>
          <span className="owner-kitchen-count-badge owner-kitchen-count-badge--queued">
            {queuedOrders.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileStatusTab === 'in-progress'}
          className={`owner-kitchen-mobile-tab-btn ${
            mobileStatusTab === 'in-progress' ? 'active' : ''
          }`}
          onClick={() => setMobileStatusTab('in-progress')}
        >
          <span>In Progress</span>
          <span className="owner-kitchen-count-badge owner-kitchen-count-badge--progress">
            {inProgressOrders.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileStatusTab === 'completed'}
          className={`owner-kitchen-mobile-tab-btn ${
            mobileStatusTab === 'completed' ? 'active' : ''
          }`}
          onClick={() => setMobileStatusTab('completed')}
        >
          <span>Completed</span>
          <span className="owner-kitchen-count-badge owner-kitchen-count-badge--completed">
            {completedOrders.length}
          </span>
        </button>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="owner-kitchen-board">
        {/* COLUMN 1: QUEUED ORDERS */}
        <div
          className="owner-kitchen-column"
          style={{
            display:
              window.innerWidth <= 768 && mobileStatusTab !== 'queued' ? 'none' : 'flex',
          }}
        >
          <div className="owner-kitchen-col-header">
            <div className="owner-kitchen-col-title-wrap">
              <span className="owner-kitchen-col-title">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ea580c',
                  }}
                />
                Queued Orders
              </span>
            </div>
            <span className="owner-kitchen-count-badge owner-kitchen-count-badge--queued">
              {queuedOrders.length}
            </span>
          </div>

          <div className="owner-kitchen-cards-list">
            {queuedOrders.map((order) => (
              <div key={order.id} className="owner-kitchen-card">
                {order.isRushed && (
                  <div
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      alignSelf: 'flex-start',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Flame size={12} /> RUSH ORDER
                  </div>
                )}

                <div className="owner-kitchen-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="owner-kitchen-card-id">#{order.orderNum}</span>
                    <span className="owner-kitchen-table-pill owner-kitchen-table-pill--queued">
                      Table {order.table}
                    </span>
                  </div>
                  <div className="owner-kitchen-card-time">
                    <Clock size={12} />
                    {order.timeAgo}
                  </div>
                </div>

                <div className="owner-kitchen-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="owner-kitchen-item-row">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="owner-kitchen-item-thumb"
                        />
                      )}
                      <div className="owner-kitchen-item-info">
                        <div className="owner-kitchen-item-name">
                          <span>{item.name}</span>
                          <span style={{ fontWeight: 800 }}>× {item.qty}</span>
                        </div>
                        {item.modifier && (
                          <div className="owner-kitchen-item-mod">{item.modifier}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div className="owner-kitchen-note-box">
                    <AlertCircle size={14} />
                    <span>Note: {order.note}</span>
                  </div>
                )}

                <div className="owner-kitchen-card-actions">
                  <button
                    type="button"
                    className="owner-kitchen-action-btn owner-kitchen-action-btn--start"
                    onClick={() => handleStartPreparing(order.id)}
                  >
                    Start Preparing
                  </button>
                  <button
                    type="button"
                    className="owner-kitchen-more-btn"
                    onClick={() =>
                      setActiveMenuOrderId(
                        activeMenuOrderId === order.id ? null : order.id
                      )
                    }
                    aria-label="Order actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Dropdown menu */}
                {activeMenuOrderId === order.id && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '12px',
                      bottom: '50px',
                      background: '#ffffff',
                      border: '1px solid #e8e2d7',
                      borderRadius: '8px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      zIndex: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '150px',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() => handleRushOrder(order.id)}
                    >
                      <Flame size={14} color="#ea580c" /> Rush Order
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      onClick={() => {
                        setActiveMenuOrderId(null)
                        showToast(`Printed Kitchen Slip (KOT) for #${order.orderNum}`)
                      }}
                    >
                      <Printer size={14} /> Print KOT
                    </button>
                  </div>
                )}
              </div>
            ))}

            {queuedOrders.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#8c7b6f',
                  fontSize: '13px',
                }}
              >
                No queued orders at this time.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div
          className="owner-kitchen-column"
          style={{
            display:
              window.innerWidth <= 768 && mobileStatusTab !== 'in-progress' ? 'none' : 'flex',
          }}
        >
          <div className="owner-kitchen-col-header">
            <div className="owner-kitchen-col-title-wrap">
              <span className="owner-kitchen-col-title">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2563eb',
                  }}
                />
                In Progress
              </span>
            </div>
            <span className="owner-kitchen-count-badge owner-kitchen-count-badge--progress">
              {inProgressOrders.length}
            </span>
          </div>

          <div className="owner-kitchen-cards-list">
            {inProgressOrders.map((order) => (
              <div key={order.id} className="owner-kitchen-card">
                <div className="owner-kitchen-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="owner-kitchen-card-id">#{order.orderNum}</span>
                    <span className="owner-kitchen-table-pill owner-kitchen-table-pill--progress">
                      Table {order.table}
                    </span>
                  </div>
                  <div
                    className="owner-kitchen-card-time"
                    style={{ color: '#2563eb', fontWeight: 700 }}
                  >
                    <Clock size={12} />
                    {order.elapsedTime}
                  </div>
                </div>

                {/* Elapsed Progress Bar */}
                <div className="owner-kitchen-progress-track">
                  <div
                    className="owner-kitchen-progress-fill"
                    style={{ width: `${order.progressPercent || 50}%` }}
                  />
                </div>

                <div className="owner-kitchen-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="owner-kitchen-item-row">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="owner-kitchen-item-thumb"
                        />
                      )}
                      <div className="owner-kitchen-item-info">
                        <div className="owner-kitchen-item-name">
                          <span>{item.name}</span>
                          <span style={{ fontWeight: 800 }}>× {item.qty}</span>
                        </div>
                        {item.modifier && (
                          <div className="owner-kitchen-item-mod">{item.modifier}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="owner-kitchen-card-actions">
                  <button
                    type="button"
                    className="owner-kitchen-action-btn owner-kitchen-action-btn--complete"
                    onClick={() => handleMarkAsCompleted(order.id)}
                  >
                    Mark as Completed
                  </button>
                  <button
                    type="button"
                    className="owner-kitchen-more-btn"
                    onClick={() =>
                      showToast(`Order #${order.orderNum} preparation alert updated.`)
                    }
                    aria-label="Order actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}

            {inProgressOrders.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#8c7b6f',
                  fontSize: '13px',
                }}
              >
                No orders currently in preparation.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED */}
        <div
          className="owner-kitchen-column"
          style={{
            display:
              window.innerWidth <= 768 && mobileStatusTab !== 'completed' ? 'none' : 'flex',
          }}
        >
          <div className="owner-kitchen-col-header">
            <div className="owner-kitchen-col-title-wrap">
              <span className="owner-kitchen-col-title">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
                Completed
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="owner-kitchen-count-badge owner-kitchen-count-badge--completed">
                {completedOrders.length}
              </span>
              <span
                style={{
                  fontSize: '11.5px',
                  color: '#7a6a5e',
                  fontWeight: 600,
                  background: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e0d8cc',
                }}
              >
                Today
              </span>
            </div>
          </div>

          <div className="owner-kitchen-cards-list">
            {completedOrders.map((order) => (
              <div key={order.id} className="owner-kitchen-card">
                <div className="owner-kitchen-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="owner-kitchen-card-id">#{order.orderNum}</span>
                    <span className="owner-kitchen-table-pill owner-kitchen-table-pill--completed">
                      Table {order.table}
                    </span>
                    <span
                      style={{
                        background: '#eafaf1',
                        color: '#047857',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Completed
                    </span>
                  </div>
                  <div className="owner-kitchen-card-time">
                    <Clock size={12} />
                    {order.completedTimeAgo || '10 min ago'}
                  </div>
                </div>

                <div className="owner-kitchen-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="owner-kitchen-item-row">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="owner-kitchen-item-thumb"
                        />
                      )}
                      <div className="owner-kitchen-item-info">
                        <div className="owner-kitchen-item-name">
                          <span>{item.name}</span>
                          <span style={{ fontWeight: 800 }}>× {item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="owner-kitchen-card-actions">
                  <div className="owner-kitchen-action-btn owner-kitchen-action-btn--done">
                    <Check size={14} /> Completed
                  </div>
                  <button
                    type="button"
                    className="owner-kitchen-more-btn"
                    onClick={() =>
                      showToast(`Order #${order.orderNum} archived in today's log.`)
                    }
                    aria-label="Order actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}

            {completedOrders.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#8c7b6f',
                  fontSize: '13px',
                }}
              >
                No completed orders yet today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="owner-modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2 className="owner-modal-title">Kitchen Display Settings</h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsSettingsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <div className="owner-modal-field">
                <label className="owner-modal-label">Audio Chime Volume</label>
                <input type="range" min="0" max="100" defaultValue="80" />
              </div>
              <div className="owner-modal-field">
                <label className="owner-modal-label">Auto-Refresh Interval</label>
                <select className="owner-modal-input" defaultValue="15s">
                  <option value="10s">Every 10 seconds</option>
                  <option value="15s">Every 15 seconds (Recommended)</option>
                  <option value="30s">Every 30 seconds</option>
                </select>
              </div>
              <div className="owner-modal-field">
                <label className="owner-modal-label">Warning Threshold for Delayed Tickets</label>
                <select className="owner-modal-input" defaultValue="15m">
                  <option value="10m">10 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="20m">20 minutes</option>
                </select>
              </div>
            </div>
            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                onClick={() => {
                  setIsSettingsOpen(false)
                  showToast('Kitchen display settings saved!')
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
