import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sliders,
  Infinity as InfinityIcon,
  Cloud,
  Headphones,
  Check,
  ArrowRight,
  Store,
  Users,
  Coins,
  ShieldCheck,
  MessageSquare,
  Lock,
  Sparkles,
  Coffee,
  X
} from 'lucide-react'
import HeaderNav from '../../components/HeaderNav'
import Footer from '../../components/Footer'
import pricingCtaImg from '../../assets/pricing_cta_qr.jpg'
import cafeDarkBg from '../../assets/cafe_dark_bg.jpg'
import './Pricing.css'

const plans = [
  {
    id: '1-month',
    name: '1 Month',
    subtitle: 'Perfect for trying out CaféFlow',
    price: '₹999',
    unit: '/ month',
    badge: null,
    discountBadge: null,
    subPrice: null,
    accent: 'neutral',
    btnClass: 'pricing-btn--neutral',
    btnLabel: 'Get Started',
  },
  {
    id: '6-months',
    name: '6 Months',
    subtitle: 'Great for growing cafés',
    price: '₹4,999',
    originalPrice: '₹5,994',
    discountBadge: 'Save 17%',
    subPrice: '₹833 / month',
    badge: null,
    accent: 'green',
    btnClass: 'pricing-btn--green',
    btnLabel: 'Get Started',
  },
  {
    id: '12-months',
    name: '12 Months',
    subtitle: 'Best value for most cafés',
    price: '₹8,999',
    originalPrice: '₹11,988',
    discountBadge: 'Save 25%',
    subPrice: '₹750 / month',
    badge: '👑 Most Popular',
    accent: 'orange',
    isPopular: true,
    btnClass: 'pricing-btn--orange',
    btnLabel: 'Get Started',
  },
  {
    id: '24-months',
    name: '24 Months',
    subtitle: 'Maximum savings for long-term growth',
    price: '₹15,999',
    originalPrice: '₹23,976',
    discountBadge: 'Save 33%',
    subPrice: '₹667 / month',
    badge: null,
    accent: 'purple',
    btnClass: 'pricing-btn--purple',
    btnLabel: 'Get Started',
  },
]

const features = [
  'Full access to all features',
  'Unlimited tables & orders',
  'Customer ordering (QR)',
  'Staff management',
  'Menu & kitchen management',
  'Reports & analytics',
  'Mobile responsive',
  'Email & in-app support',
]

export default function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
  }

  const handleProceedToSetup = () => {
    navigate('/contact')
  }

  return (
    <div className="pricing-page">
      <HeaderNav activePage="pricing" />

      {/* Main Pricing Hero & Cards Container */}
      <section
        className="pricing-hero"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(14, 9, 7, 0.94) 0%, rgba(16, 10, 8, 0.96) 60%, rgba(14, 9, 7, 0.98) 100%), url(${cafeDarkBg})`,
        }}
      >
        <div className="pricing-hero__container">
          {/* Centered Hero Header */}
          <div className="pricing-hero__header">
            <div className="pricing-pill">
              <span className="pricing-pill__diamond">💎</span> Simple &amp; Transparent Pricing
            </div>

            <h1 className="pricing-hero__title">
              Choose the Plan That Fits <span className="pricing-hero__title--accent">Your Café</span>
            </h1>

            <p className="pricing-hero__desc">
              All the features you need to manage tables, orders, staff, menu, customers and more — at one simple price.
            </p>

            {/* 4 Benefit Highlights */}
            <div className="pricing-benefits-strip-top">
              <div className="pricing-top-benefit">
                <Sliders size={20} className="pricing-top-benefit__icon" />
                <div className="pricing-top-benefit__text">
                  <span className="pricing-top-benefit__title">All Features Included</span>
                  <span className="pricing-top-benefit__sub">No hidden charges</span>
                </div>
              </div>

              <div className="pricing-top-benefit__divider" />

              <div className="pricing-top-benefit">
                <InfinityIcon size={20} className="pricing-top-benefit__icon" />
                <div className="pricing-top-benefit__text">
                  <span className="pricing-top-benefit__title">Unlimited Usage</span>
                  <span className="pricing-top-benefit__sub">Orders, tables, customers</span>
                </div>
              </div>

              <div className="pricing-top-benefit__divider" />

              <div className="pricing-top-benefit">
                <Cloud size={20} className="pricing-top-benefit__icon" />
                <div className="pricing-top-benefit__text">
                  <span className="pricing-top-benefit__title">Free Updates</span>
                  <span className="pricing-top-benefit__sub">Always the latest features</span>
                </div>
              </div>

              <div className="pricing-top-benefit__divider" />

              <div className="pricing-top-benefit">
                <Headphones size={20} className="pricing-top-benefit__icon" />
                <div className="pricing-top-benefit__text">
                  <span className="pricing-top-benefit__title">Dedicated Support</span>
                  <span className="pricing-top-benefit__sub">We're here to help</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pricing Cards Grid */}
          <div className="pricing-cards-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card pricing-card--${plan.accent} ${plan.isPopular ? 'pricing-card--popular' : ''}`}
              >
                {plan.isPopular && (
                  <div className="pricing-card__popular-badge">
                    <span>👑 Most Popular</span>
                  </div>
                )}

                {/* Card Header: Icon, Title, Subtitle */}
                <div className="pricing-card__header">
                  <div className={`pricing-card__icon-circle pricing-card__icon-circle--${plan.accent}`}>
                    <Coffee size={20} />
                  </div>
                  <h3 className="pricing-card__plan-name">{plan.name}</h3>
                  <p className="pricing-card__plan-subtitle">{plan.subtitle}</p>
                </div>

                {/* Card Pricing Block */}
                <div className="pricing-card__pricing-block">
                  <div className="pricing-card__price-row">
                    <span className="pricing-card__price">{plan.price}</span>
                    {plan.unit && <span className="pricing-card__unit">{plan.unit}</span>}
                    {plan.originalPrice && (
                      <span className="pricing-card__original-price">{plan.originalPrice}</span>
                    )}
                    {plan.discountBadge && (
                      <span className="pricing-card__discount-badge">{plan.discountBadge}</span>
                    )}
                  </div>
                  {plan.subPrice && (
                    <div className="pricing-card__subprice">{plan.subPrice}</div>
                  )}
                </div>

                {/* Card CTA Button */}
                <button
                  type="button"
                  className={`pricing-card__cta-btn ${plan.btnClass}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.btnLabel} <ArrowRight size={15} />
                </button>

                {/* Card Features List */}
                <div className="pricing-card__features-list">
                  {features.map((feat) => (
                    <div key={feat} className="pricing-card__feature-item">
                      <div className="pricing-card__check-icon-wrap">
                        <Check size={14} className="pricing-card__check-icon" />
                      </div>
                      <span className="pricing-card__feature-text">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Benefits Strip (Dark Horizontal Bar) */}
          <div className="pricing-bottom-strip">
            <div className="pricing-strip-item">
              <div className="pricing-strip-item__icon-wrap">
                <Store size={22} />
              </div>
              <div className="pricing-strip-item__content">
                <h4 className="pricing-strip-item__title">One Simple Price</h4>
                <p className="pricing-strip-item__sub">All features included</p>
              </div>
            </div>

            <div className="pricing-strip-item">
              <div className="pricing-strip-item__icon-wrap">
                <Users size={22} />
              </div>
              <div className="pricing-strip-item__content">
                <h4 className="pricing-strip-item__title">No User Limits</h4>
                <p className="pricing-strip-item__sub">Add unlimited staff</p>
              </div>
            </div>

            <div className="pricing-strip-item">
              <div className="pricing-strip-item__icon-wrap">
                <Coins size={22} />
              </div>
              <div className="pricing-strip-item__content">
                <h4 className="pricing-strip-item__title">No Order Limits</h4>
                <p className="pricing-strip-item__sub">Handle as many orders as you want</p>
              </div>
            </div>

            <div className="pricing-strip-item">
              <div className="pricing-strip-item__icon-wrap">
                <ShieldCheck size={22} />
              </div>
              <div className="pricing-strip-item__content">
                <h4 className="pricing-strip-item__title">Secure &amp; Reliable</h4>
                <p className="pricing-strip-item__sub">99.9% uptime</p>
              </div>
            </div>

            <div className="pricing-strip-item">
              <div className="pricing-strip-item__icon-wrap">
                <Headphones size={22} />
              </div>
              <div className="pricing-strip-item__content">
                <h4 className="pricing-strip-item__title">Dedicated Support</h4>
                <p className="pricing-strip-item__sub">Quick and friendly help</p>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="pricing-final-cta">
            <div className="pricing-final-cta__image-col">
              <img
                src={pricingCtaImg}
                alt="CaféFlow QR setup at a cozy café table"
                className="pricing-final-cta__image"
              />
            </div>

            <div className="pricing-final-cta__content-col">
              <h2 className="pricing-final-cta__title">
                Ready to Streamline <br />
                <span className="pricing-final-cta__title--accent">Your Café Operations?</span>
              </h2>

              <p className="pricing-final-cta__desc">
                Join hundreds of café owners who trust CaféFlow to run their business smoothly.
              </p>

              <div className="pricing-final-cta__actions">
                <button
                  type="button"
                  className="pricing-cta-primary-btn"
                  onClick={() => navigate('/login')}
                >
                  Get Started Now <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  className="pricing-cta-secondary-btn"
                  onClick={() => navigate('/contact')}
                >
                  <MessageSquare size={16} /> Contact Sales
                </button>
              </div>

              <div className="pricing-final-cta__security">
                <span className="pricing-security-item">
                  <Lock size={14} /> Secure checkout
                </span>
                <span className="pricing-security-divider">|</span>
                <span className="pricing-security-item">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Plan Selected Modal */}
      {selectedPlan && (
        <div className="pricing-modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="pricing-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pricing-modal-close"
              onClick={() => setSelectedPlan(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="pricing-modal-badge">
              <Sparkles size={16} /> Selected Plan
            </div>

            <h3 className="pricing-modal-title">{selectedPlan.name} Plan</h3>
            <p className="pricing-modal-sub">{selectedPlan.subtitle}</p>

            <div className="pricing-modal-price-box">
              <span className="pricing-modal-price">{selectedPlan.price}</span>
              {selectedPlan.subPrice && (
                <span className="pricing-modal-subprice">({selectedPlan.subPrice})</span>
              )}
            </div>

            <p className="pricing-modal-note">
              Complete your café setup request to activate this plan with our concierge onboarding team.
            </p>

            <div className="pricing-modal-actions">
              <button
                type="button"
                className="pricing-modal-confirm-btn"
                onClick={handleProceedToSetup}
              >
                Request Setup for this Plan <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="pricing-modal-cancel-btn"
                onClick={() => setSelectedPlan(null)}
              >
                Back to Plans
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
