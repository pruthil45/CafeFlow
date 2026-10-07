import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Play,
  LayoutGrid,
  Users,
  ShoppingCart,
  Clock,
  ChefHat,
  Bell,
  Receipt,
  CreditCard,
  Zap,
  Smile,
  CheckCircle,
  QrCode,
  UtensilsCrossed,
  Sparkles
} from 'lucide-react'
import HeaderNav from '../../components/HeaderNav'
import roleStaffImg from '../Home/assets/role-staff.jpg'
import './StaffLearnMore.css'

export default function StaffLearnMore() {
  const navigate = useNavigate()

  const staffFeatures = [
    { icon: LayoutGrid, title: 'View Tables', desc: 'See active tables and customers', color: '#ea580c' },
    { icon: Users, title: 'Customer Details', desc: 'View customer info & order history', color: '#3b82f6' },
    { icon: ShoppingCart, title: 'Order Management', desc: 'View, edit, add or remove items', color: '#10b981' },
    { icon: Clock, title: 'Order Status', desc: 'Update status (Queued, In Progress, Completed)', color: '#f59e0b' },
    { icon: ChefHat, title: 'Kitchen Integration', desc: 'Real-time order updates', color: '#8b5cf6' },
    { icon: Bell, title: 'Call Waiter', desc: 'Separate notification with different sound', color: '#06b6d4' },
    { icon: Receipt, title: 'Individual Billing', desc: 'Generate customer bill', color: '#ec4899' },
    { icon: CreditCard, title: 'Payment Confirmation', desc: 'Cash, UPI or Card (record payment)', color: '#10b981' },
  ]

  const workflowSteps = [
    { num: '1', title: 'View Tables', desc: 'See active tables & customers', icon: LayoutGrid, color: '#ea580c' },
    { num: '2', title: 'Manage Orders', desc: 'View, edit or add items', icon: ShoppingCart, color: '#3b82f6' },
    { num: '3', title: 'Kitchen', desc: 'Update order status (Queued → Done)', icon: ChefHat, color: '#8b5cf6' },
    { num: '4', title: 'Serve Food', desc: 'Mark as served to table', icon: UtensilsCrossed, color: '#10b981' },
    { num: '5', title: 'Individual Bill', desc: 'Generate bill for each guest', icon: Receipt, color: '#ec4899' },
    { num: '6', title: 'Payment', desc: 'Confirm Cash / UPI / Card', icon: CreditCard, color: '#f59e0b' },
  ]

  return (
    <div className="staff-page">
      {/* Shared Transparent HeaderNav */}
      <HeaderNav />

      {/* ==========================================================================
          HERO SECTION — Cinematic Café Staff Experience
          ========================================================================== */}
      <section className="staff-hero">
        <div className="staff-hero__bg">
          <img src={roleStaffImg} alt="Smiling barista and staff in café using digital tablet" />
        </div>
        <div className="staff-hero__overlay" />

        <div className="staff-hero__container">
          {/* Left Text */}
          <div className="staff-hero__text">
            <span className="staff-hero__eyebrow">FOR STAFF</span>
            <h1 className="staff-hero__title">
              Everything You Need<br />
              to <span className="gold">Serve Better</span>
            </h1>
            <p className="staff-hero__desc">
              Manage tables, customers, orders, kitchen status and payments —
              all in one simple interface.
            </p>

            <div className="staff-hero__actions">
              <button
                type="button"
                className="staff-hero__btn-primary"
                onClick={() => navigate('/login')}
              >
                Get Started <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="staff-hero__btn-demo"
                onClick={() => navigate('/login')}
              >
                <span className="staff-hero__play-icon">▶</span>
                See How It Works
              </button>
            </div>
          </div>

          {/* Right Visual: Realistic Staff Management Tablet */}
          <div className="staff-tablet">
            <div className="staff-tablet__screen">
              {/* Sidebar */}
              <div className="staff-tab-sidebar">
                <div className="staff-tab-brand">CaféFlow</div>
                <div className="staff-tab-nav-btn staff-tab-nav-btn--active">
                  <LayoutGrid size={11} />
                  <span>Tables</span>
                </div>
                <div className="staff-tab-nav-btn">
                  <ShoppingCart size={11} />
                  <span>Orders</span>
                </div>
                <div className="staff-tab-nav-btn">
                  <Users size={11} />
                  <span>Customers</span>
                </div>
                <div className="staff-tab-nav-btn">
                  <ChefHat size={11} />
                  <span>Kitchen</span>
                </div>
                <div className="staff-tab-nav-btn">
                  <CreditCard size={11} />
                  <span>Payments</span>
                </div>
                <div className="staff-tab-nav-btn">
                  <Bell size={11} />
                  <span>Alerts</span>
                </div>
              </div>

              {/* Middle: Active Tables Grid */}
              <div className="staff-tab-tables-col">
                <div className="staff-tables-status-bar">
                  <span>Active Tables</span>
                  <span style={{ color: '#16a34a' }}>Occupied (8)</span>
                </div>
                <div className="staff-tables-grid">
                  <div className="staff-table-box staff-table-box--occupied">
                    <span className="staff-table-name">T1</span>
                    <span>2 cust</span>
                    <span style={{ fontWeight: 700, color: '#983b16' }}>₹540</span>
                  </div>
                  <div className="staff-table-box staff-table-box--occupied">
                    <span className="staff-table-name">T2</span>
                    <span>4 cust</span>
                    <span style={{ fontWeight: 700, color: '#983b16' }}>₹1,230</span>
                  </div>
                  <div className="staff-table-box staff-table-box--available">
                    <span className="staff-table-name">T3</span>
                    <span style={{ color: '#16a34a' }}>Avail</span>
                  </div>
                  <div className="staff-table-box staff-table-box--occupied">
                    <span className="staff-table-name">T4</span>
                    <span>3 cust</span>
                    <span style={{ fontWeight: 700, color: '#983b16' }}>₹760</span>
                  </div>
                  {/* Selected Table 5 */}
                  <div className="staff-table-box staff-table-box--selected">
                    <span className="staff-table-name" style={{ color: '#983b16' }}>T5 ★</span>
                    <span>3 cust</span>
                    <span style={{ fontWeight: 800, color: '#983b16' }}>₹800</span>
                  </div>
                  <div className="staff-table-box staff-table-box--available">
                    <span className="staff-table-name">T6</span>
                    <span style={{ color: '#16a34a' }}>Avail</span>
                  </div>
                  <div className="staff-table-box staff-table-box--occupied">
                    <span className="staff-table-name">T7</span>
                    <span>2 cust</span>
                    <span style={{ fontWeight: 700, color: '#983b16' }}>₹420</span>
                  </div>
                  <div className="staff-table-box staff-table-box--available">
                    <span className="staff-table-name">T8</span>
                    <span style={{ color: '#16a34a' }}>Avail</span>
                  </div>
                  <div className="staff-table-box staff-table-box--available">
                    <span className="staff-table-name">T9</span>
                    <span style={{ color: '#16a34a' }}>Avail</span>
                  </div>
                </div>
              </div>

              {/* Center: Selected Table 5 Panel */}
              <div className="staff-tab-orders-col">
                <div className="staff-order-header">
                  <span style={{ fontWeight: 800 }}>Table 5 (3 Guests)</span>
                  <button style={{ background: '#1a1410', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.55rem', padding: '2px 6px', cursor: 'pointer' }}>
                    + Customer
                  </button>
                </div>

                <div className="staff-cust-pills">
                  <span className="staff-cust-pill staff-cust-pill--active">Rahul · ₹300</span>
                  <span className="staff-cust-pill">Priya · ₹250</span>
                  <span className="staff-cust-pill">Amit · ₹250</span>
                </div>

                <div className="staff-order-items-box">
                  <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                    <span>#101 · 2:15 PM</span>
                    <span style={{ color: '#16a34a', fontWeight: 800 }}>Served</span>
                  </div>
                  <div>1 x Burger · ₹200</div>
                  <div>1 x Coffee · ₹100</div>
                </div>

                <div className="staff-order-items-box">
                  <div style={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                    <span>#105 · 2:45 PM</span>
                    <span style={{ color: '#d97706', fontWeight: 800 }}>In Progress</span>
                  </div>
                  <div>1 x French Fries · ₹100</div>
                </div>
              </div>

              {/* Right: Notifications & Kitchen Box */}
              <div className="staff-tab-notifs-col">
                <div className="staff-notif-title">
                  <span>Notifications</span>
                  <span style={{ color: '#3b82f6', fontSize: '0.55rem', cursor: 'pointer' }}>View All</span>
                </div>

                <div className="staff-notif-card">
                  <div className="staff-notif-dot staff-notif-dot--red">●</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>New Order · T3</div>
                    <div style={{ color: '#7a6e64' }}>2 x Pizza, 1 x Coke (2m)</div>
                  </div>
                </div>

                <div className="staff-notif-card">
                  <div className="staff-notif-dot staff-notif-dot--blue">🔔</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>Call Waiter · T5</div>
                    <div style={{ color: '#7a6e64' }}>Needs assistance (3m)</div>
                  </div>
                </div>

                {/* Kitchen Status Summary */}
                <div className="staff-kitchen-summary-box">
                  <div style={{ fontWeight: 800, fontSize: '0.62rem' }}>Kitchen Status</div>
                  <div className="staff-kitchen-stats">
                    <div>
                      <div style={{ color: '#ef4444' }}>6</div>
                      <div style={{ color: '#7a6e64', fontSize: '0.52rem' }}>Queued</div>
                    </div>
                    <div>
                      <div style={{ color: '#d97706' }}>4</div>
                      <div style={{ color: '#7a6e64', fontSize: '0.52rem' }}>In Prog</div>
                    </div>
                    <div>
                      <div style={{ color: '#16a34a' }}>8</div>
                      <div style={{ color: '#7a6e64', fontSize: '0.52rem' }}>Done</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Strip: 4 Features */}
        <div className="staff-hero__strip">
          <div className="staff-strip-item">
            <div className="staff-strip-icon">
              <Zap size={20} />
            </div>
            <div>
              <div className="staff-strip-title">Faster Service</div>
              <div className="staff-strip-sub">Handle orders quickly</div>
            </div>
          </div>

          <div className="staff-strip-item">
            <div className="staff-strip-icon">
              <Smile size={20} />
            </div>
            <div>
              <div className="staff-strip-title">Happy Customers</div>
              <div className="staff-strip-sub">Better dining experience</div>
            </div>
          </div>

          <div className="staff-strip-item">
            <div className="staff-strip-icon">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="staff-strip-title">Easy to Use</div>
              <div className="staff-strip-sub">Simple and clean interface</div>
            </div>
          </div>

          <div className="staff-strip-item">
            <div className="staff-strip-icon">
              <LayoutGrid size={20} />
            </div>
            <div>
              <div className="staff-strip-title">All in One</div>
              <div className="staff-strip-sub">Tables, orders, billing and more</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 2 — OVERLAPPING WHITE / CREAM CARD
          ========================================================================== */}
      <section className="staff-overlap-section" id="features">
        <div className="staff-overlap-card">
          {/* Top Split: 8 Key Features + 6 Workflow Steps */}
          <div className="staff-top-split">
            {/* Left: 8 Key Features for Staff */}
            <div>
              <div className="staff-header-block">
                <h2 className="staff-title">
                  Key Features for <span className="orange">Staff</span>
                </h2>
                <p className="staff-sub">
                  Simple tools to manage your daily café operations.
                </p>
              </div>

              <div className="staff-features-grid">
                {staffFeatures.map((feat) => (
                  <div className="staff-feature-card" key={feat.title}>
                    <div
                      className="staff-feat-icon"
                      style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
                    >
                      <feat.icon size={18} />
                    </div>
                    <div>
                      <div className="staff-feat-name">{feat.title}</div>
                      <div className="staff-feat-desc">{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: How It Works for Staff (6 Steps) */}
            <div>
              <div className="staff-header-block">
                <h2 className="staff-title">How It Works for Staff</h2>
                <p className="staff-sub">
                  A simple workflow from order to payment.
                </p>
              </div>

              <div className="staff-workflow-steps">
                {workflowSteps.map((step) => (
                  <div className="staff-flow-step" key={step.title}>
                    <div
                      className="staff-flow-icon"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      <step.icon size={18} />
                    </div>
                    <div className="staff-flow-title">{step.title}</div>
                    <div className="staff-flow-desc">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================================================
              Bottom Product Showcase: 4 Visual Product Cards
              1. Table Management
              2. Kitchen Display
              3. Smart Notifications
              4. Individual Billing & Payments
              ========================================================================== */}
          <div className="staff-showcase-grid">
            {/* Card 1: Table Management */}
            <div className="staff-showcase-card">
              <div className="staff-showcase-card__visual">
                <div style={{ fontWeight: 800, borderBottom: '1px solid #33261e', paddingBottom: '4px', marginBottom: '6px' }}>
                  Table Management · T5 (Active)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ background: '#251c16', padding: '4px 6px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rahul (2 orders)</span>
                    <span style={{ color: '#4ade80' }}>₹300 Active</span>
                  </div>
                  <div style={{ background: '#251c16', padding: '4px 6px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Priya (1 order)</span>
                    <span style={{ color: '#4ade80' }}>₹250 Active</span>
                  </div>
                  <div style={{ background: '#251c16', padding: '4px 6px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Amit (1 order)</span>
                    <span style={{ color: '#4ade80' }}>₹250 Active</span>
                  </div>
                  <button style={{ marginTop: 'auto', background: '#d4a04a', color: '#1a0e0a', border: 'none', borderRadius: '4px', padding: '4px', fontWeight: 800, fontSize: '0.62rem' }}>
                    Generate Table Bill
                  </button>
                </div>
              </div>
              <h4 className="staff-showcase-card__title">Table Management</h4>
              <p className="staff-showcase-card__sub">View tables and active customers</p>
            </div>

            {/* Card 2: Kitchen Display */}
            <div className="staff-showcase-card">
              <div className="staff-showcase-card__visual">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', fontWeight: 800, fontSize: '0.58rem', borderBottom: '1px solid #33261e', paddingBottom: '4px', marginBottom: '6px' }}>
                  <span style={{ color: '#ef4444' }}>Queued (6)</span>
                  <span style={{ color: '#f59e0b' }}>In Prog (4)</span>
                  <span style={{ color: '#10b981' }}>Done (8)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ background: '#251c16', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 700 }}>#106 Table 3</div>
                    <div style={{ color: '#a8988b' }}>2 x Pizza, 1 x Coke</div>
                  </div>
                  <div style={{ background: '#251c16', padding: '4px 6px', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 700 }}>#105 Table 5</div>
                    <div style={{ color: '#a8988b' }}>1 x French Fries</div>
                  </div>
                  <button style={{ marginTop: 'auto', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px', fontWeight: 700, fontSize: '0.6rem' }}>
                    Mark Order #101 Served ✓
                  </button>
                </div>
              </div>
              <h4 className="staff-showcase-card__title">Kitchen Display</h4>
              <p className="staff-showcase-card__sub">Real-time order updates</p>
            </div>

            {/* Card 3: Smart Notifications */}
            <div className="staff-showcase-card">
              <div className="staff-showcase-card__visual">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', justifyContent: 'center' }}>
                  <div style={{ background: '#3b1c1c', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🔔</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fca5a5' }}>New Order · T3</div>
                      <div style={{ color: '#e5e7eb', fontSize: '0.62rem' }}>2 x Pizza, 1 x Coke (2m ago)</div>
                    </div>
                  </div>
                  <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🛎️</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#93c5fd' }}>Call Waiter · T5</div>
                      <div style={{ color: '#e5e7eb', fontSize: '0.62rem' }}>Customer needs assistance (3m ago)</div>
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="staff-showcase-card__title">Smart Notifications</h4>
              <p className="staff-showcase-card__sub">New orders and waiter requests with distinct sounds</p>
            </div>

            {/* Card 4: Individual Billing & Payments */}
            <div className="staff-showcase-card">
              <div className="staff-showcase-card__visual">
                <div style={{ fontWeight: 800, textAlign: 'center', marginBottom: '4px' }}>
                  Payment Confirmation
                </div>
                <div style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#4ade80', margin: '4px 0' }}>
                  ₹ 530
                </div>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', margin: '6px 0' }}>
                  <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.6rem', fontWeight: 700 }}>Cash</button>
                  <button style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.6rem', fontWeight: 700 }}>UPI</button>
                  <button style={{ background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '0.6rem', fontWeight: 700 }}>Card</button>
                </div>
                <button style={{ marginTop: 'auto', background: '#d4a04a', color: '#1a0e0a', border: 'none', borderRadius: '6px', padding: '6px', fontWeight: 800, fontSize: '0.68rem', cursor: 'pointer' }}>
                  Confirm Payment →
                </button>
              </div>
              <h4 className="staff-showcase-card__title">Individual Billing & Payments</h4>
              <p className="staff-showcase-card__sub">Generate customer bills and record physical payments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
