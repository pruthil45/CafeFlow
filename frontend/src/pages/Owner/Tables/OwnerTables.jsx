import { useState, useMemo } from 'react'
import {
  Plus,
  Users,
  CheckCircle2,
  AlertOctagon,
  Armchair,
  Receipt,
  X,
  CreditCard,
  Check,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { OWNER_TABLES_DATA } from '../data/ownerMockData'
import '../Owner.css'

export default function OwnerTables() {
  const [tables, setTables] = useState(OWNER_TABLES_DATA.tables)
  const [selectedTableId, setSelectedTableId] = useState(null)
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0)
  const [drawerTab, setDrawerTab] = useState('orders') // 'orders', 'customer'
  const [isAddTableOpen, setIsAddTableOpen] = useState(false)
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false)
  const [billingCustomer, setBillingCustomer] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('UPI') // 'UPI', 'Card', 'Cash'
  const [toastMessage, setToastMessage] = useState(null)

  // Add Table Form State
  const [newTableNum, setNewTableNum] = useState('16')
  const [newTableArea, setNewTableArea] = useState('Main floor')
  const [newTableCapacity, setNewTableCapacity] = useState('4')
  const [newTableStatus, setNewTableStatus] = useState('available')

  // Show toast notification
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3200)
  }

  // Active table selected for drawer
  const activeTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId),
    [tables, selectedTableId]
  )

  // Current active customer inside the selected table
  const activeCustomer = useMemo(() => {
    if (!activeTable || !activeTable.customers || activeTable.customers.length === 0) {
      return null
    }
    return (
      activeTable.customers[selectedCustomerIndex] ||
      activeTable.customers[0]
    )
  }, [activeTable, selectedCustomerIndex])

  // Dynamic KPI counts
  const totalTablesCount = tables.length
  const availableCount = tables.filter((t) => t.status === 'available').length
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length
  const outOfServiceCount = tables.filter((t) => t.status === 'out-of-service').length

  // Open Table Drawer
  const handleTableClick = (table) => {
    if (table.status === 'occupied') {
      setSelectedTableId(table.id)
      setSelectedCustomerIndex(0)
      setDrawerTab('orders')
    } else if (table.status === 'available') {
      // Allow seating or quick status change
      setSelectedTableId(table.id)
      setSelectedCustomerIndex(0)
    } else {
      setSelectedTableId(table.id)
    }
  }

  // Close Table Drawer
  const handleCloseDrawer = () => {
    setSelectedTableId(null)
  }

  // Start Generate Bill flow for current customer
  const handleInitiateBill = () => {
    if (!activeCustomer || !activeTable) return
    setBillingCustomer({
      customer: activeCustomer,
      table: activeTable,
    })
    setIsBillingModalOpen(true)
  }

  // Confirm Bill Generation and Settle Individual Customer
  const handleConfirmBillSettlement = () => {
    if (!billingCustomer) return

    const { customer, table } = billingCustomer

    setTables((prevTables) =>
      prevTables.map((t) => {
        if (t.id === table.id) {
          // Filter out ONLY this customer (individual billing rule!)
          const remainingCustomers = t.customers.filter((c) => c.id !== customer.id)
          const newStatus = remainingCustomers.length === 0 ? 'available' : 'occupied'
          const remainingOrdersCount = remainingCustomers.reduce(
            (sum, c) => sum + (c.orders?.length || 0),
            0
          )

          return {
            ...t,
            status: newStatus,
            customers: remainingCustomers,
            ordersCount: remainingOrdersCount,
            note: newStatus === 'available' ? 'No active guests' : '',
          }
        }
        return t
      })
    )

    setIsBillingModalOpen(false)
    setSelectedTableId(null)
    showToast(
      `Bill of ${customer.formattedTotalBill} generated for ${customer.name}. Payment settled via ${paymentMethod}!`
    )
  }

  // Add Table submission
  const handleAddTableSubmit = (e) => {
    e.preventDefault()
    if (!newTableNum.trim()) return

    const newId = `table-${String(newTableNum).padStart(2, '0')}`
    const newTable = {
      id: newId,
      number: String(newTableNum).padStart(2, '0'),
      displayNumber: String(newTableNum).padStart(2, '0'),
      status: newTableStatus,
      capacity: Number(newTableCapacity),
      floor: newTableArea,
      customers: [],
      ordersCount: 0,
      note: newTableStatus === 'available' ? 'No active guests' : 'Out of service',
    }

    setTables((prev) => [...prev, newTable])
    setIsAddTableOpen(false)
    showToast(`Table ${newTable.displayNumber} created successfully!`)
  }

  return (
    <div className="owner-module-container owner-tables-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="owner-toast" role="status">
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="owner-module-header">
        <div>
          <h1 className="owner-module-title">Tables</h1>
          <p className="owner-module-subtitle">
            Manage your café tables, view current status and handle table operations.
          </p>
        </div>

        <button
          type="button"
          className="owner-btn-primary"
          onClick={() => setIsAddTableOpen(true)}
        >
          <Plus size={18} />
          Add Table
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="owner-tables-kpi-grid">
        <div className="owner-tables-kpi-card">
          <div className="owner-tables-kpi-icon-wrap owner-tables-kpi-icon-wrap--total">
            <Armchair size={22} />
          </div>
          <div>
            <div className="owner-tables-kpi-val">{totalTablesCount}</div>
            <div className="owner-tables-kpi-lbl">Total Tables</div>
          </div>
        </div>

        <div className="owner-tables-kpi-card">
          <div className="owner-tables-kpi-icon-wrap owner-tables-kpi-icon-wrap--available">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="owner-tables-kpi-val">{availableCount}</div>
            <div className="owner-tables-kpi-lbl">Available</div>
          </div>
        </div>

        <div className="owner-tables-kpi-card">
          <div className="owner-tables-kpi-icon-wrap owner-tables-kpi-icon-wrap--occupied">
            <Users size={22} />
          </div>
          <div>
            <div className="owner-tables-kpi-val">{occupiedCount}</div>
            <div className="owner-tables-kpi-lbl">Occupied</div>
          </div>
        </div>

        <div className="owner-tables-kpi-card">
          <div className="owner-tables-kpi-icon-wrap owner-tables-kpi-icon-wrap--outofservice">
            <AlertOctagon size={22} />
          </div>
          <div>
            <div className="owner-tables-kpi-val">{outOfServiceCount}</div>
            <div className="owner-tables-kpi-lbl">Out of Service</div>
          </div>
        </div>
      </div>

      {/* Floor / Table Grid Section */}
      <div className="owner-tables-floor-section">
        <div className="owner-tables-floor-header">
          <h2 className="owner-tables-floor-title">Main floor</h2>
          <div className="owner-tables-floor-pill">
            {occupiedCount} occupied · {availableCount} available · {outOfServiceCount} out of
            service
          </div>
        </div>

        {/* 15 Tables Cards Grid */}
        <div className="owner-floor-grid">
          {tables.map((table) => {
            const isOccupied = table.status === 'occupied'
            const isAvailable = table.status === 'available'
            const isOutOfService = table.status === 'out-of-service'
            const isSelected = selectedTableId === table.id

            return (
              <div
                key={table.id}
                className={`owner-floor-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTableClick(table)}
                role="button"
                tabIndex={0}
                aria-label={`Table ${table.displayNumber}, status: ${table.status}`}
              >
                <div className="owner-floor-card-top">
                  <span className="owner-floor-card-num">{table.displayNumber}</span>
                  <span
                    className={`owner-floor-status-badge ${
                      isOccupied
                        ? 'owner-floor-status-badge--occupied'
                        : isAvailable
                        ? 'owner-floor-status-badge--available'
                        : 'owner-floor-status-badge--outofservice'
                    }`}
                  >
                    {isOccupied
                      ? 'Occupied'
                      : isAvailable
                      ? 'Available'
                      : 'Out of service'}
                  </span>
                </div>

                {isOccupied && (
                  <div>
                    <div className="owner-floor-card-guests">
                      {table.customers.map((c) => (
                        <span key={c.id} className="owner-floor-guest-tag">
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <div className="owner-floor-card-footer">
                      {table.customers.length}{' '}
                      {table.customers.length === 1 ? 'customer' : 'customers'} ·{' '}
                      {table.ordersCount || 3} orders
                    </div>
                  </div>
                )}

                {(isAvailable || isOutOfService) && (
                  <div className="owner-floor-card-empty-note">
                    {table.note || 'No active guests'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Slide-in Table Details Drawer */}
      <div
        className={`owner-table-drawer-overlay ${activeTable ? 'open' : ''}`}
        onClick={handleCloseDrawer}
        aria-hidden="true"
      />

      <aside
        className={`owner-table-drawer ${activeTable ? 'open' : ''}`}
        aria-label="Table Details Drawer"
      >
        {activeTable && (
          <>
            {/* Drawer Header */}
            <div className="owner-table-drawer-header">
              <div className="owner-table-drawer-user">
                <div className="owner-table-drawer-avatar">
                  {activeCustomer?.initial || activeTable.displayNumber}
                </div>
                <div>
                  <h2 className="owner-table-drawer-name">
                    {activeCustomer ? activeCustomer.name : `Table ${activeTable.displayNumber}`}
                  </h2>
                  <div className="owner-table-drawer-sub">
                    Table {activeTable.displayNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="owner-customer-drawer-close"
                onClick={handleCloseDrawer}
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* If table is occupied with customers: show customer switcher & tabs */}
            {activeTable.status === 'occupied' && activeTable.customers.length > 0 && (
              <>
                {/* Multi-Customer Switcher Pill Bar */}
                <div className="owner-table-guests-switcher">
                  {activeTable.customers.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`owner-table-guest-pill-btn ${
                        selectedCustomerIndex === idx ? 'active' : ''
                      }`}
                      onClick={() => setSelectedCustomerIndex(idx)}
                    >
                      <Users size={12} />
                      {c.name}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    padding: '8px 22px',
                    fontSize: '12px',
                    color: '#7a6a5e',
                    background: '#ffffff',
                    borderBottom: '1px solid #f0eae1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>
                    👥 {activeTable.customers.length} customers at this table
                  </span>
                  <span>·</span>
                  <span>
                    📋 {activeCustomer?.orders?.length || 0} total orders ({activeCustomer?.name?.split(' ')[0]})
                  </span>
                </div>

                {/* Drawer Tabs */}
                <div className="owner-table-drawer-nav">
                  <button
                    type="button"
                    className={`owner-table-drawer-tab ${drawerTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setDrawerTab('orders')}
                  >
                    Orders ({activeCustomer?.orders?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`owner-table-drawer-tab ${drawerTab === 'customer' ? 'active' : ''}`}
                    onClick={() => setDrawerTab('customer')}
                  >
                    Customer Details
                  </button>
                </div>

                {/* Drawer Body Content */}
                <div className="owner-table-drawer-body">
                  {drawerTab === 'orders' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {activeCustomer?.orders?.map((order) => (
                        <div key={order.id} className="owner-table-order-card">
                          <div className="owner-table-order-header">
                            <span className="owner-table-order-id">{order.id}</span>
                            <span className="owner-table-order-status">{order.status}</span>
                            <span className="owner-table-order-time">{order.time}</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="owner-table-order-item-line">
                                <span>
                                  {item.qty} {item.name}
                                </span>
                                <span>₹{item.price}</span>
                              </div>
                            ))}
                          </div>

                          <div className="owner-table-order-total-line">
                            <span>Total</span>
                            <span>{order.formattedTotal || `₹${order.total}`}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerTab === 'customer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="owner-customer-section-card">
                        <div className="owner-customer-section-title">
                          <span>Guest Information</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#8c7b6f' }}>Full Name</span>
                            <span style={{ fontWeight: 700 }}>{activeCustomer?.name}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#8c7b6f' }}>Phone</span>
                            <span style={{ fontWeight: 700 }}>{activeCustomer?.phone}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#8c7b6f' }}>Member Since</span>
                            <span style={{ fontWeight: 700 }}>{activeCustomer?.memberSince}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#8c7b6f' }}>Current Table Bill</span>
                            <span style={{ fontWeight: 800, color: '#8c4a23' }}>
                              {activeCustomer?.formattedTotalBill}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sticky Bottom Generate Bill Action */}
                <div className="owner-table-drawer-footer">
                  <button
                    type="button"
                    className="owner-generate-bill-btn"
                    onClick={handleInitiateBill}
                  >
                    <Receipt size={18} />
                    Generate Bill ({activeCustomer?.formattedTotalBill})
                  </button>
                  <p className="owner-generate-bill-note">
                    This will generate the final bill for {activeCustomer?.name}. Once billed,{' '}
                    {activeCustomer?.name?.split(' ')[0]} will be removed from this table and their
                    orders will no longer appear in the table.
                  </p>
                </div>
              </>
            )}

            {/* If table is Available or Out of Service: quick manage controls */}
            {activeTable.status !== 'occupied' && (
              <div className="owner-table-drawer-body">
                <div className="owner-customer-section-card">
                  <div className="owner-customer-section-title">
                    <span>Table Status: {activeTable.status}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#7a6a5e', lineHeight: 1.4 }}>
                    Table {activeTable.displayNumber} has capacity for {activeTable.capacity} guests
                    on the {activeTable.floor}.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button
                      type="button"
                      className="owner-btn-primary"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
                      onClick={() => {
                        // Quick seat guest demo
                        setTables((prev) =>
                          prev.map((t) => {
                            if (t.id === activeTable.id) {
                              return {
                                ...t,
                                status: 'occupied',
                                customers: [
                                  {
                                    id: `cust-guest-${Date.now()}`,
                                    name: 'New Seated Guest',
                                    initial: 'G',
                                    phone: '+91 98765 00000',
                                    memberSince: 'Today',
                                    ordersCount: 1,
                                    totalBill: 340,
                                    formattedTotalBill: '₹340',
                                    orders: [
                                      {
                                        id: '#135',
                                        status: 'In Progress',
                                        time: 'Just now',
                                        total: 340,
                                        formattedTotal: '₹340',
                                        items: [
                                          { name: 'Club Sandwich', qty: 1, price: 200 },
                                          { name: 'Cold Coffee', qty: 1, price: 140 },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                                ordersCount: 1,
                                note: '',
                              }
                            }
                            return t
                          })
                        )
                        showToast(`Guests seated at Table ${activeTable.displayNumber}!`)
                      }}
                    >
                      Seat Guests
                    </button>
                    <button
                      type="button"
                      className="owner-btn-secondary"
                      style={{ flex: 1, padding: '9px 12px', fontSize: '13px' }}
                      onClick={() => {
                        const newStatus =
                          activeTable.status === 'out-of-service'
                            ? 'available'
                            : 'out-of-service'
                        setTables((prev) =>
                          prev.map((t) =>
                            t.id === activeTable.id ? { ...t, status: newStatus } : t
                          )
                        )
                        showToast(`Table status changed to ${newStatus}`)
                      }}
                    >
                      {activeTable.status === 'out-of-service'
                        ? 'Mark Available'
                        : 'Mark Out of Service'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Bill Generation Confirmation Modal */}
      {isBillingModalOpen && billingCustomer && (
        <div className="owner-modal-overlay" onClick={() => setIsBillingModalOpen(false)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2 className="owner-modal-title">
                Settling Bill for {billingCustomer.customer.name}
              </h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsBillingModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="owner-modal-body">
              <div
                style={{
                  background: '#faf8f5',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #ede7dc',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13.5px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ color: '#8c7b6f' }}>Table</span>
                  <span style={{ fontWeight: 700 }}>
                    Table {billingCustomer.table.displayNumber}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13.5px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ color: '#8c7b6f' }}>Customer</span>
                  <span style={{ fontWeight: 700 }}>{billingCustomer.customer.name}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 800,
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #dcd4c6',
                    color: '#8c4a23',
                  }}
                >
                  <span>Grand Total</span>
                  <span>{billingCustomer.customer.formattedTotalBill}</span>
                </div>
              </div>

              <div className="owner-modal-field">
                <label className="owner-modal-label">Payment Method</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['UPI', 'Card', 'Cash'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border:
                          paymentMethod === m ? '2px solid #8c4a23' : '1px solid #ded6c9',
                        background: paymentMethod === m ? '#fbf8f5' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: paymentMethod === m ? '#8c4a23' : '#6d5b4f',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '11.5px', color: '#8c7b6f', margin: 0, lineHeight: 1.4 }}>
                ⚠️ Notice: Only {billingCustomer.customer.name}&apos;s bill is settled. Any other
                customers at Table {billingCustomer.table.displayNumber} will remain active.
              </p>
            </div>
            <div className="owner-modal-footer">
              <button
                type="button"
                className="owner-btn-secondary"
                onClick={() => setIsBillingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="owner-btn-primary"
                onClick={handleConfirmBillSettlement}
              >
                <Check size={16} />
                Confirm & Settle ({billingCustomer.customer.formattedTotalBill})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="owner-modal-overlay" onClick={() => setIsAddTableOpen(false)}>
          <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2 className="owner-modal-title">Add New Table</h2>
              <button
                type="button"
                className="owner-modal-close-btn"
                onClick={() => setIsAddTableOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddTableSubmit}>
              <div className="owner-modal-body">
                <div className="owner-modal-field">
                  <label className="owner-modal-label">Table Number / Label</label>
                  <input
                    type="text"
                    className="owner-modal-input"
                    value={newTableNum}
                    onChange={(e) => setNewTableNum(e.target.value)}
                    placeholder="e.g. 16"
                    required
                  />
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Floor / Area</label>
                  <select
                    className="owner-modal-input"
                    value={newTableArea}
                    onChange={(e) => setNewTableArea(e.target.value)}
                  >
                    <option value="Main floor">Main floor</option>
                    <option value="Outdoor Terrace">Outdoor Terrace</option>
                    <option value="Balcony Lounge">Balcony Lounge</option>
                  </select>
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Seating Capacity</label>
                  <select
                    className="owner-modal-input"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(e.target.value)}
                  >
                    <option value="2">2 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="6">6 Guests</option>
                    <option value="8">8 Guests</option>
                  </select>
                </div>

                <div className="owner-modal-field">
                  <label className="owner-modal-label">Initial Status</label>
                  <select
                    className="owner-modal-input"
                    value={newTableStatus}
                    onChange={(e) => setNewTableStatus(e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="out-of-service">Out of Service</option>
                  </select>
                </div>
              </div>
              <div className="owner-modal-footer">
                <button
                  type="button"
                  className="owner-btn-secondary"
                  onClick={() => setIsAddTableOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="owner-btn-primary">
                  <Plus size={16} />
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
