import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Play,
  QrCode,
  Smartphone,
  BookOpen,
  Sliders,
  ShoppingBag,
  Clock,
  RotateCcw,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  Zap
} from 'lucide-react'
import HeaderNav from '../../components/HeaderNav'
import roleCustomerImg from '../Home/assets/role-customer.jpg'
import './CustomerLearnMore.css'

export default function CustomerLearnMore() {
  const navigate = useNavigate()
  const trackRef = useRef(null)

  // Interactive cart state inside the phone mockup
  const [quantities, setQuantities] = useState({
    cappuccino: 1,
    pizza: 1,
    burger: 0,
    fries: 0,
  })

  const updateQty = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }))
  }

  const totalPrice =
    quantities.cappuccino * 120 +
    quantities.pizza * 250 +
    quantities.burger * 220 +
    quantities.fries * 130

  const scrollTrack = (direction) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      })
    }
  }

  const workflowSteps = [
    { num: '1', title: 'Scan QR', desc: 'Scan the QR code at your table', color: '#8b5cf6', icon: QrCode },
    { num: '2', title: 'Enter Mobile + OTP', desc: 'Verify with your mobile number', color: '#3b82f6', icon: Smartphone },
    { num: '3', title: 'Browse Menu', desc: 'Explore food & beverages', color: '#10b981', icon: BookOpen },
    { num: '4', title: 'Customize', desc: 'Choose variants, add-ons and notes', color: '#f59e0b', icon: Sliders },
    { num: '5', title: 'Place Order', desc: 'Order instantly from your phone', color: '#ef4444', icon: ShoppingBag },
    { num: '6', title: 'Track Order', desc: 'See real-time status (Preparing → Served)', color: '#8b5cf6', icon: Clock },
    { num: '7', title: 'Order Again', desc: 'Reorder your favorites easily', color: '#f97316', icon: RotateCcw },
    { num: '8', title: 'Individual Bill', desc: 'Get your own bill separately', color: '#10b981', icon: Receipt },
  ]

  return (
    <div className="customer-page">
      {/* Shared Transparent HeaderNav */}
      <HeaderNav />

      {/* ==========================================================================
          HERO SECTION — Cinematic Café Customer Experience
          ========================================================================== */}
      <section className="customer-hero">
        <div className="customer-hero__bg">
          <img src={roleCustomerImg} alt="Café customer smiling and browsing digital menu on mobile" />
        </div>
        <div className="customer-hero__overlay" />

        <div className="customer-hero__container">
          {/* Left Text */}
          <div className="customer-hero__text">
            <span className="customer-hero__eyebrow">FOR CUSTOMERS</span>
            <h1 className="customer-hero__title">
              Scan. Order. <span className="gold">Enjoy.</span>
            </h1>
            <p className="customer-hero__desc">
              A simple and seamless in-café ordering experience. Browse the menu,
              place your order, track it in real time — all from your phone.
            </p>

            <div className="customer-hero__actions">
              <a href="#how-it-works" className="customer-hero__btn-primary">
                See How It Works <ArrowRight size={17} />
              </a>
              <button
                type="button"
                className="customer-hero__btn-demo"
                onClick={() => navigate('/login')}
              >
                <span className="customer-hero__play-icon">▶</span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Visual: Realistic Large Smartphone + QR Acrylic Stand */}
          <div className="customer-hero__visual">
            <div className="customer-hero__doodle">
              Great Food<br />Better Moments ♡
            </div>

            {/* Large Customer Phone Mockup */}
            <div className="customer-phone-hero">
              <div className="customer-phone-hero__screen">
                {/* Screen Top Bar */}
                <div className="cph-topbar">
                  <span className="cph-topbar__brand">CaféFlow</span>
                  <div className="cph-topbar__cart-btn" onClick={() => navigate('/login')}>
                    <ShoppingBag size={18} />
                    <span className="cph-topbar__cart-count">
                      {quantities.cappuccino + quantities.pizza + quantities.burger + quantities.fries}
                    </span>
                  </div>
                </div>

                {/* Categories */}
                <div className="cph-categories">
                  <span className="cph-pill cph-pill--active">All</span>
                  <span className="cph-pill">Coffee</span>
                  <span className="cph-pill">Pizza</span>
                  <span className="cph-pill">Burgers</span>
                </div>

                {/* Menu Items List */}
                <div className="cph-items-list">
                  {/* Cappuccino */}
                  <div className="cph-item">
                    <div className="cph-item__thumb">☕</div>
                    <div className="cph-item__info">
                      <span className="cph-item__name">Cappuccino</span>
                      <span className="cph-item__price">₹120</span>
                    </div>
                    <div className="cph-item__qty">
                      <button className="cph-item__btn" onClick={() => updateQty('cappuccino', -1)}><Minus size={12} /></button>
                      <span>{quantities.cappuccino}</span>
                      <button className="cph-item__btn" onClick={() => updateQty('cappuccino', 1)}><Plus size={12} /></button>
                    </div>
                  </div>

                  {/* Margherita Pizza */}
                  <div className="cph-item">
                    <div className="cph-item__thumb">🍕</div>
                    <div className="cph-item__info">
                      <span className="cph-item__name">Margherita Pizza</span>
                      <span className="cph-item__price">₹250</span>
                    </div>
                    <div className="cph-item__qty">
                      <button className="cph-item__btn" onClick={() => updateQty('pizza', -1)}><Minus size={12} /></button>
                      <span>{quantities.pizza}</span>
                      <button className="cph-item__btn" onClick={() => updateQty('pizza', 1)}><Plus size={12} /></button>
                    </div>
                  </div>

                  {/* Chicken Burger */}
                  <div className="cph-item">
                    <div className="cph-item__thumb">🍔</div>
                    <div className="cph-item__info">
                      <span className="cph-item__name">Chicken Burger</span>
                      <span className="cph-item__price">₹220</span>
                    </div>
                    <div className="cph-item__qty">
                      <button className="cph-item__btn" onClick={() => updateQty('burger', -1)}><Minus size={12} /></button>
                      <span>{quantities.burger}</span>
                      <button className="cph-item__btn" onClick={() => updateQty('burger', 1)}><Plus size={12} /></button>
                    </div>
                  </div>

                  {/* French Fries */}
                  <div className="cph-item">
                    <div className="cph-item__thumb">🍟</div>
                    <div className="cph-item__info">
                      <span className="cph-item__name">French Fries</span>
                      <span className="cph-item__price">₹130</span>
                    </div>
                    <div className="cph-item__qty">
                      <button className="cph-item__btn" onClick={() => updateQty('fries', -1)}><Minus size={12} /></button>
                      <span>{quantities.fries}</span>
                      <button className="cph-item__btn" onClick={() => updateQty('fries', 1)}><Plus size={12} /></button>
                    </div>
                  </div>
                </div>

                {/* Bottom Cart Bar */}
                <div className="cph-bottom-bar" onClick={() => navigate('/login')}>
                  <span>View Cart</span>
                  <span>₹ {totalPrice} →</span>
                </div>
              </div>
            </div>

            {/* Acrylic Table 5 QR Stand */}
            <div>
              <div className="customer-qr-stand">
                <div className="customer-qr-stand__logo">
                  Café<span>Flow</span>
                </div>
                <div className="customer-qr-stand__code-box">
                  <svg viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Corner 1 */}
                    <rect x="6" y="6" width="28" height="28" fill="#1a1410" />
                    <rect x="10" y="10" width="20" height="20" fill="#ffffff" />
                    <rect x="14" y="14" width="12" height="12" fill="#1a1410" />
                    {/* Corner 2 */}
                    <rect x="66" y="6" width="28" height="28" fill="#1a1410" />
                    <rect x="70" y="10" width="20" height="20" fill="#ffffff" />
                    <rect x="74" y="14" width="12" height="12" fill="#1a1410" />
                    {/* Corner 3 */}
                    <rect x="6" y="66" width="28" height="28" fill="#1a1410" />
                    <rect x="10" y="70" width="20" height="20" fill="#ffffff" />
                    <rect x="14" y="74" width="12" height="12" fill="#1a1410" />
                    {/* Random QR bits */}
                    <rect x="40" y="10" width="6" height="6" fill="#1a1410" />
                    <rect x="52" y="16" width="6" height="6" fill="#1a1410" />
                    <rect x="42" y="42" width="16" height="16" fill="#1a1410" />
                    <rect x="66" y="44" width="8" height="8" fill="#1a1410" />
                    <rect x="80" y="58" width="8" height="8" fill="#1a1410" />
                    <rect x="40" y="72" width="8" height="8" fill="#1a1410" />
                    <rect x="56" y="68" width="12" height="6" fill="#1a1410" />
                    <rect x="72" y="80" width="14" height="6" fill="#1a1410" />
                  </svg>
                </div>
                <div className="customer-qr-stand__table">Table 5</div>
                <div className="customer-qr-stand__subtext">
                  <Smartphone size={12} />
                  <span>Scan to Order</span>
                </div>
              </div>
              <div className="customer-qr-stand__base" />
            </div>
          </div>
        </div>

        {/* Hero Bottom Strip: Dark translucent pill with 4 features */}
        <div className="customer-hero__strip">
          <div className="customer-strip-item">
            <div className="customer-strip-icon customer-strip-icon--green">
              <Smartphone size={20} />
            </div>
            <span className="customer-strip-title">No App Download</span>
          </div>
          <div className="customer-strip-item">
            <div className="customer-strip-icon customer-strip-icon--purple">
              <Zap size={20} />
            </div>
            <span className="customer-strip-title">Quick and Easy</span>
          </div>
          <div className="customer-strip-item">
            <div className="customer-strip-icon customer-strip-icon--pink">
              <Users size={20} />
            </div>
            <span className="customer-strip-title">Individual Orders & Bills</span>
          </div>
          <div className="customer-strip-item">
            <div className="customer-strip-icon customer-strip-icon--blue">
              <Receipt size={20} />
            </div>
            <span className="customer-strip-title">Individual Bills</span>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          SECTION 2 — OVERLAPPING WHITE / CREAM CARD
          ========================================================================== */}
      <section className="customer-overlap-section" id="how-it-works">
        <div className="customer-overlap-card">
          {/* Section 2 Header */}
          <div className="workflow-header">
            <div>
              <h2 className="workflow-header__title">
                How It Works for <span className="orange">Customers</span>
              </h2>
              <p className="workflow-header__subtitle">
                A simple 8-step process to order, enjoy and repeat.
              </p>
            </div>
            <div className="workflow-arrows">
              <button
                type="button"
                className="workflow-arrow-btn"
                onClick={() => scrollTrack('left')}
                aria-label="Previous step"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="workflow-arrow-btn"
                onClick={() => scrollTrack('right')}
                aria-label="Next step"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* 9 Steps Horizontal Workflow */}
          <div className="workflow-steps-track" ref={trackRef}>
            {workflowSteps.map((step, idx) => (
              <div className="workflow-step" key={step.num}>
                <div className="workflow-step-card">
                  <div
                    className="workflow-step-badge"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>
                  <div
                    className="workflow-step-icon"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <step.icon size={22} />
                  </div>
                  <span className="workflow-step-title">{step.title}</span>
                  <span className="workflow-step-desc">{step.desc}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="workflow-connector">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ==========================================================================
              Product Showcase Grid: Pitch + 4 Smartphone Screens + Why You'll Love It
              ========================================================================== */}
          <div className="customer-showcase-grid">
            {/* Left Pitch */}
            <div className="showcase-pitch">
              <h3 className="showcase-pitch__title">
                Delicious Food,<br />
                <span className="orange">Just a Scan Away</span> ☕
              </h3>
              <p className="showcase-pitch__desc">
                No app download. No password. Just scan, order and enjoy your time at the café.
              </p>
              <div className="showcase-pitch__badges">
                <div className="showcase-pitch__badge">
                  <Users size={18} />
                  <span>Multiple People Order at Same Table</span>
                </div>
                <div className="showcase-pitch__badge">
                  <FileText size={18} />
                  <span>Individual Bills for Everyone</span>
                </div>
              </div>
            </div>

            {/* Center: 4 Smartphones Side by Side */}
            <div className="showcase-phones-row">
              {/* Phone 1: Verification */}
              <div className="showcase-mini-phone">
                <div className="showcase-mini-screen">
                  <div className="mini-phone-header">Verification</div>
                  <div style={{ textAlign: 'center', margin: '14px 0 8px', fontSize: '0.62rem', color: '#6d5f54' }}>
                    Enter your mobile number to continue
                  </div>
                  <div style={{ background: '#f5eee6', borderRadius: '6px', padding: '6px', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>
                    🇮🇳 +91 98765 43210
                  </div>
                  <div style={{ background: '#983b16', color: '#fff', borderRadius: '6px', padding: '6px', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', marginBottom: '12px' }}>
                    Send OTP
                  </div>
                  {/* Mini keypad grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 700, color: '#33261d', fontSize: '0.75rem', marginTop: 'auto' }}>
                    <span>1</span><span>2</span><span>3</span>
                    <span>4</span><span>5</span><span>6</span>
                    <span>7</span><span>8</span><span>9</span>
                    <span>*</span><span>0</span><span>#</span>
                  </div>
                </div>
              </div>

              {/* Phone 2: Our Menu */}
              <div className="showcase-mini-phone">
                <div className="showcase-mini-screen">
                  <div className="mini-phone-header">Our Menu</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#faf6f2', padding: '4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>☕</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.65rem' }}>Cappuccino</div>
                        <div style={{ color: '#983b16', fontWeight: 700, fontSize: '0.6rem' }}>₹120</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#faf6f2', padding: '4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🍕</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.65rem' }}>Margherita Pizza</div>
                        <div style={{ color: '#983b16', fontWeight: 700, fontSize: '0.6rem' }}>₹250</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#faf6f2', padding: '4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🍔</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.65rem' }}>Chicken Burger</div>
                        <div style={{ color: '#983b16', fontWeight: 700, fontSize: '0.6rem' }}>₹220</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#faf6f2', padding: '4px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🍝</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.65rem' }}>Pasta Alfredo</div>
                        <div style={{ color: '#983b16', fontWeight: 700, fontSize: '0.6rem' }}>₹260</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone 3: Customise */}
              <div className="showcase-mini-phone">
                <div className="showcase-mini-screen">
                  <div className="mini-phone-header">Customise</div>
                  <div style={{ textAlign: 'center', fontSize: '1.4rem', margin: '4px 0' }}>🍔</div>
                  <div style={{ fontWeight: 700, textAlign: 'center', fontSize: '0.72rem' }}>Chicken Burger</div>
                  <div style={{ color: '#983b16', fontWeight: 800, textAlign: 'center', fontSize: '0.65rem', marginBottom: '8px' }}>₹220</div>
                  <div style={{ fontSize: '0.6rem', color: '#6d5f54', marginBottom: '2px' }}>Add Ons:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', padding: '2px 0' }}>
                    <span>Extra Cheese</span><span>+₹30</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', padding: '2px 0' }}>
                    <span>Extra Chicken</span><span>+₹40</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', padding: '2px 0' }}>
                    <span>Jalapeños</span><span>+₹20</span>
                  </div>
                  <div style={{ marginTop: 'auto', background: '#1a1410', color: '#fff', textAlign: 'center', padding: '5px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700 }}>
                    Add to Cart · ₹220
                  </div>
                </div>
              </div>

              {/* Phone 4: Order Tracking */}
              <div className="showcase-mini-phone">
                <div className="showcase-mini-screen">
                  <div className="mini-phone-header">Order Tracking</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '6px 0', fontSize: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#ea580c' }}>📦</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>Order Placed</div>
                        <div style={{ color: '#9b8b7e', fontSize: '0.55rem' }}>12:05 PM</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#f59e0b' }}>🍳</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>Preparing</div>
                        <div style={{ color: '#9b8b7e', fontSize: '0.55rem' }}>12:06 PM</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#10b981' }}>🔔</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>Ready</div>
                        <div style={{ color: '#9b8b7e', fontSize: '0.55rem' }}>12:15 PM</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#10b981' }}>🍽️</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>Served</div>
                        <div style={{ color: '#9b8b7e', fontSize: '0.55rem' }}>12:18 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Checklist: Why You'll Love It */}
            <div className="why-love-card">
              <h4 className="why-love-title">
                <span>❤️</span> Why You'll Love It
              </h4>
              <div className="why-love-item">
                <span className="why-love-icon">✨</span>
                <span>Simple and fast ordering</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">🥐</span>
                <span>Beautiful and easy-to-use menu</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">🎯</span>
                <span>Track your order in real time</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">🍽️</span>
                <span>Beautiful food photos on the menu</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">🧾</span>
                <span>No shared bills — get your own bill</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">💳</span>
                <span>No online payment needed (pay staff directly)</span>
              </div>
              <div className="why-love-item">
                <span className="why-love-icon">🔄</span>
                <span>Reorder your favorites anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
