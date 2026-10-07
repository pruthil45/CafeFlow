import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Play,
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  BookOpen,
  LayoutGrid,
  Users,
  Heart,
  Megaphone,
  FileSpreadsheet,
  BarChart3,
  UserCheck,
  Settings,
  QrCode,
  UtensilsCrossed,
  Receipt,
  TrendingUp,
  Sliders,
  Sparkles,
  CheckCircle2
} from 'lucide-react'
import HeaderNav from '../../components/HeaderNav'
import roleOwnerImg from '../Home/assets/role-owner.jpg'
import './OwnerLearnMore.css'

export default function OwnerLearnMore() {
  const navigate = useNavigate()

  const featureCards = [
    { icon: LayoutDashboard, title: 'Dashboard', desc: 'Get a complete overview of your café business.', color: '#ea580c' },
    { icon: ShoppingCart, title: 'Orders', desc: 'View and manage all customer orders.', color: '#ea580c' },
    { icon: ChefHat, title: 'Kitchen Display', desc: 'Real-time order status and kitchen workflow.', color: '#3b82f6' },
    { icon: BookOpen, title: 'Menu Management', desc: 'Create categories, items, variants, add-ons and combos.', color: '#10b981' },
    { icon: LayoutGrid, title: 'Tables & QR', desc: 'Manage tables and generate QR codes.', color: '#f59e0b' },
    { icon: Users, title: 'Customers', desc: 'View customer profiles, orders and history.', color: '#3b82f6' },
    { icon: Heart, title: 'Loyalty', desc: 'Set up points, rewards and loyalty programs.', color: '#10b981' },
    { icon: Megaphone, title: 'Promotions', desc: 'Create offers, discounts and special campaigns.', color: '#ef4444' },
    { icon: FileSpreadsheet, title: 'Reports', desc: 'Detailed sales, orders and customer reports.', color: '#ec4899' },
    { icon: BarChart3, title: 'Analytics', desc: 'Insights to grow your business.', color: '#3b82f6' },
    { icon: UserCheck, title: 'Staff Management', desc: 'Add and manage your staff team.', color: '#3b82f6' },
    { icon: Settings, title: 'Settings', desc: 'Café profile, payments, tax, notifications and more.', color: '#3b82f6' },
  ]

  const workflowSteps = [
    { icon: LayoutGrid, label: 'Tables', desc: 'Manage tables and QR codes', color: '#10b981' },
    { icon: Users, label: 'Customers', desc: 'Customers scan QR and order', color: '#3b82f6' },
    { icon: ShoppingCart, label: 'Orders', desc: 'Real-time order management', color: '#ea580c' },
    { icon: ChefHat, label: 'Kitchen', desc: 'Track order status (Queued → Done)', color: '#8b5cf6' },
    { icon: UtensilsCrossed, label: 'Food Served', desc: 'Delicious food to customers', color: '#ef4444' },
    { icon: Receipt, label: 'Individual Bills', desc: 'Each customer has their bill', color: '#10b981' },
    { icon: BarChart3, label: 'Analytics', desc: 'Track metrics & grow revenue', color: '#3b82f6' },
  ]

  return (
    <div className="owner-page">
      {/* Shared Transparent HeaderNav */}
      <HeaderNav />

      {/* ==========================================================================
          HERO SECTION — Cinematic Café Owner Experience
          ========================================================================== */}
      <section className="owner-hero">
        <div className="owner-hero__bg">
          <img src={roleOwnerImg} alt="Smiling café owner managing business operations with tablet in modern café" />
        </div>
        <div className="owner-hero__overlay" />

        <div className="owner-hero__container">
          {/* Left Text */}
          <div className="owner-hero__text">
            <span className="owner-hero__eyebrow">FOR OWNERS</span>
            <h1 className="owner-hero__title">
              Your Café.<br />
              <span className="gold">Your Control.</span>
            </h1>
            <p className="owner-hero__desc">
              Manage every aspect of your café with powerful and easy-to-use tools.
              From menu and tables to staff, customers, promotions and analytics —
              everything you need in one platform.
            </p>

            <div className="owner-hero__actions">
              <button
                type="button"
                className="owner-hero__btn-primary"
                onClick={() => navigate('/login')}
              >
                Get Started <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="owner-hero__btn-demo"
                onClick={() => navigate('/login')}
              >
                <span className="owner-hero__play-icon">▶</span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual: Realistic Laptop with CaféFlow Owner Dashboard */}
          <div className="owner-hero__visual">
            <div className="owner-hero__doodle">
              Grow Manage<br />Delight Repeat ♡
            </div>

            <div className="owner-laptop">
              <div className="owner-laptop__screen">
                <div className="owner-laptop__inner">
                  {/* Dashboard Sidebar */}
                  <div className="dash-sidebar">
                    <div className="dash-sidebar__brand">CaféFlow</div>
                    <div className="dash-nav-item dash-nav-item--active">
                      <LayoutDashboard size={12} />
                      <span>Dashboard</span>
                    </div>
                    <div className="dash-nav-item">
                      <ShoppingCart size={12} />
                      <span>Orders</span>
                    </div>
                    <div className="dash-nav-item">
                      <ChefHat size={12} />
                      <span>Kitchen</span>
                    </div>
                    <div className="dash-nav-item">
                      <BookOpen size={12} />
                      <span>Menu</span>
                    </div>
                    <div className="dash-nav-item">
                      <LayoutGrid size={12} />
                      <span>Tables</span>
                    </div>
                    <div className="dash-nav-item">
                      <Users size={12} />
                      <span>Customers</span>
                    </div>
                    <div className="dash-nav-item">
                      <Heart size={12} />
                      <span>Loyalty</span>
                    </div>
                    <div className="dash-nav-item">
                      <Megaphone size={12} />
                      <span>Promotions</span>
                    </div>
                    <div className="dash-nav-item">
                      <BarChart3 size={12} />
                      <span>Analytics</span>
                    </div>
                    <div className="dash-nav-item">
                      <Settings size={12} />
                      <span>Settings</span>
                    </div>
                  </div>

                  {/* Dashboard Main Content Area */}
                  <div className="dash-main">
                    {/* Top Bar */}
                    <div className="dash-topbar">
                      <span className="dash-topbar__title">Dashboard</span>
                      <div className="dash-topbar__user">
                        <span>Today ▾</span>
                        <span>|</span>
                        <span>☕ Café Aroma (Owner)</span>
                      </div>
                    </div>

                    {/* Stat Cards Row */}
                    <div className="dash-stats-row">
                      <div className="dash-stat-box">
                        <span className="dash-stat-box__label">Total Orders</span>
                        <span className="dash-stat-box__val">48</span>
                        <span className="dash-stat-box__change">↑ 12% vs yesterday</span>
                      </div>
                      <div className="dash-stat-box">
                        <span className="dash-stat-box__label">Total Revenue</span>
                        <span className="dash-stat-box__val">₹12,430</span>
                        <span className="dash-stat-box__change">↑ 8% vs yesterday</span>
                      </div>
                      <div className="dash-stat-box">
                        <span className="dash-stat-box__label">Active Customers</span>
                        <span className="dash-stat-box__val">28</span>
                        <span className="dash-stat-box__change">↑ 16% vs yesterday</span>
                      </div>
                      <div className="dash-stat-box">
                        <span className="dash-stat-box__label">Active Tables</span>
                        <span className="dash-stat-box__val">9/15</span>
                        <span className="dash-stat-box__change">↑ 3% vs yesterday</span>
                      </div>
                    </div>

                    {/* Charts Row */}
                    <div className="dash-charts-row">
                      {/* Sales Line Graph */}
                      <div className="dash-chart-card">
                        <div className="dash-card-header">Sales Overview · ₹4,320 at 2 PM</div>
                        <svg className="dash-sales-svg" viewBox="0 0 200 65" fill="none">
                          <path
                            d="M0 50 Q 25 45, 50 35 T 100 20 T 150 15 T 200 8"
                            stroke="#ea580c"
                            strokeWidth="2.5"
                            fill="none"
                          />
                          <path
                            d="M0 50 Q 25 45, 50 35 T 100 20 T 150 15 T 200 8 L 200 65 L 0 65 Z"
                            fill="url(#salesGrad)"
                            opacity="0.3"
                          />
                          <circle cx="100" cy="20" r="4" fill="#ea580c" />
                          <defs>
                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="65" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#ea580c" />
                              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Donut Chart: Order Status */}
                      <div className="dash-chart-card">
                        <div className="dash-card-header">Order Status (48 Orders)</div>
                        <div className="dash-donut-wrap">
                          <div className="dash-donut-circle">
                            <div className="dash-donut-center">48</div>
                          </div>
                          <div style={{ fontSize: '0.58rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ color: '#ef4444' }}>● New: 6</span>
                            <span style={{ color: '#3b82f6' }}>● In Progress: 12</span>
                            <span style={{ color: '#f59e0b' }}>● Ready: 8</span>
                            <span style={{ color: '#10b981' }}>● Served: 22</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="owner-laptop__base">
                <div className="owner-laptop__notch" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Strip: 5 Features */}
        <div className="owner-hero__strip">
          <div className="owner-strip-item">
            <div className="owner-strip-icon">
              <Sliders size={20} />
            </div>
            <div className="owner-strip-content">
              <span className="owner-strip-title">Complete Café Control</span>
              <span className="owner-strip-sub">Manage your café, your way</span>
            </div>
          </div>

          <div className="owner-strip-item">
            <div className="owner-strip-icon">
              <TrendingUp size={20} />
            </div>
            <div className="owner-strip-content">
              <span className="owner-strip-title">Improve Operations</span>
              <span className="owner-strip-sub">Save time and work smarter</span>
            </div>
          </div>

          <div className="owner-strip-item">
            <div className="owner-strip-icon">
              <Users size={20} />
            </div>
            <div className="owner-strip-content">
              <span className="owner-strip-title">Delight Customers</span>
              <span className="owner-strip-sub">Build loyalty and repeat visits</span>
            </div>
          </div>

          <div className="owner-strip-item">
            <div className="owner-strip-icon">
              <BarChart3 size={20} />
            </div>
            <div className="owner-strip-content">
              <span className="owner-strip-title">Increase Revenue</span>
              <span className="owner-strip-sub">Promotions, analytics and more</span>
            </div>
          </div>

          <div className="owner-strip-item">
            <div className="owner-strip-icon">
              <LayoutDashboard size={20} />
            </div>
            <div className="owner-strip-content">
              <span className="owner-strip-title">All in One Platform</span>
              <span className="owner-strip-sub">Everything you need</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 2 — OVERLAPPING WHITE / CREAM CARD
          ========================================================================== */}
      <section className="owner-overlap-section" id="features">
        <div className="owner-overlap-card">
          {/* Left Column: 12 Feature Cards Grid */}
          <div className="owner-features-col">
            <div className="owner-col-header">
              <h2 className="owner-col-title">
                Powerful Features for <span className="orange">Café Owners</span>
              </h2>
              <p className="owner-col-sub">
                Everything you need to run, manage and grow your café.
              </p>
            </div>

            <div className="owner-features-grid">
              {featureCards.map((feat) => (
                <div className="owner-feature-card" key={feat.title}>
                  <div
                    className="owner-feat-icon-box"
                    style={{ backgroundColor: `${feat.color}15`, color: feat.color }}
                  >
                    <feat.icon size={18} />
                  </div>
                  <div className="owner-feat-text">
                    <span className="owner-feat-title">{feat.title}</span>
                    <span className="owner-feat-desc">{feat.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Workflow Steps + Table 5 Multi-Customer Billing Demo */}
          <div className="owner-workflow-col">
            <div className="owner-col-header">
              <h2 className="owner-col-title">How It Works in Your Café</h2>
              <p className="owner-col-sub">
                A simple and powerful flow from table to revenue.
              </p>
            </div>

            {/* 7 Workflow Steps Horizontal */}
            <div className="owner-flow-steps">
              {workflowSteps.map((step) => (
                <div className="owner-flow-step" key={step.label}>
                  <div
                    className="owner-flow-icon"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <step.icon size={16} />
                  </div>
                  <span className="owner-flow-label">{step.label}</span>
                  <span className="owner-flow-desc">{step.desc}</span>
                </div>
              ))}
            </div>

            {/* Example Table 5 Multi-Customer Box */}
            <div className="owner-example-box">
              <div className="owner-example-header">
                <h3 className="owner-example-title">Example: Table 5</h3>
                <p className="owner-example-sub">
                  Multiple customers, separate orders and separate bills.
                </p>
              </div>

              <div className="owner-example-content">
                {/* Table Stand Mini Card */}
                <div className="owner-example-qr-card">
                  <span className="owner-example-table-tag">Table 5</span>
                  <div className="owner-example-qr-mini">
                    <QrCode size={62} color="#1a1410" />
                  </div>
                  <span style={{ fontSize: '0.62rem', marginTop: '6px', color: '#e5dacf' }}>
                    Scan to Order
                  </span>
                </div>

                {/* Customer Orders Breakdown */}
                <div className="owner-customers-list">
                  {/* Customer 1: Rahul */}
                  <div className="owner-customer-row">
                    <div className="owner-cust-person">
                      <div className="owner-cust-avatar">👨</div>
                      <div>
                        <div>Rahul</div>
                        <div className="owner-cust-order">Order #101 · Burger + Coffee</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="owner-cust-bill">₹ 250</div>
                      <span className="owner-cust-badge owner-cust-badge--paid">Paid</span>
                    </div>
                  </div>

                  {/* Customer 2: Priya */}
                  <div className="owner-customer-row">
                    <div className="owner-cust-person">
                      <div className="owner-cust-avatar">👩</div>
                      <div>
                        <div>Priya</div>
                        <div className="owner-cust-order">Order #102 · Pizza</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="owner-cust-bill">₹ 300</div>
                      <span className="owner-cust-badge owner-cust-badge--active">Active</span>
                    </div>
                  </div>

                  {/* Customer 3: Amit */}
                  <div className="owner-customer-row">
                    <div className="owner-cust-person">
                      <div className="owner-cust-avatar">🧑</div>
                      <div>
                        <div>Amit</div>
                        <div className="owner-cust-order">Order #103 · Pasta</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="owner-cust-bill">₹ 250</div>
                      <span className="owner-cust-badge owner-cust-badge--active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
