import { ArrowRight, Play, Smartphone, Zap, Users, Bell, Store, User } from 'lucide-react'
import heroBg from '../assets/hero-bg.jpg'

const roleCards = [
  { icon: Store, label: 'Owner', desc: 'Run your café', color: 'owner' },
  { icon: Users, label: 'Staff', desc: 'Daily operations', color: 'staff' },
  { icon: User, label: 'Customer', desc: 'Scan, order, enjoy', color: 'customer' },
]

const badges = [
  { icon: Smartphone, text: 'No App Download' },
  { icon: Zap, text: 'Quick and Easy' },
  { icon: Users, text: 'Individual Orders & Bills' },
  { icon: Bell, text: 'Call Waiter Anytime' },
]

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__bg">
        <img src={heroBg} alt="Modern café interior with warm lighting" loading="eager" />
      </div>
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__text">
          <span className="hero__eyebrow">All-in-One Café Management Platform</span>
          <h1 className="hero__title">
            Smarter <span className="gold">Cafés.</span><br />
            Happier Customers.<br />
            Higher <span className="gold">Growth.</span>
          </h1>
          <p className="hero__description">
            Manage orders, tables, menus, staff, customers, loyalty,
            promotions and analytics — all in one powerful platform.
          </p>

          <div className="hero__buttons">
            <button className="hero__primary-btn" aria-label="Get Started">
              Get Started <ArrowRight size={18} />
            </button>
            <button className="hero__secondary-btn" aria-label="Watch Demo">
              <span className="hero__play-icon">
                <Play size={16} fill="#fff" />
              </span>
              Watch Demo
            </button>
          </div>

          <div className="hero__badges">
            {badges.map(b => (
              <div className="hero__badge" key={b.text}>
                <div className="hero__badge-icon">
                  <b.icon size={18} />
                </div>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          {/* Role Cards above mockups */}
          <div className="hero__role-cards">
            {roleCards.map(r => (
              <div className="hero__role-card" key={r.label}>
                <div className={`hero__role-card-icon hero__role-card-icon--${r.color}`}>
                  <r.icon size={16} />
                </div>
                <div className="hero__role-card-text">
                  <span className="hero__role-card-title">{r.label}</span>
                  <span className="hero__role-card-desc">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Product Mockups */}
          <div className="hero__mockup-container">
            {/* LAPTOP */}
            <div className="mockup-laptop">
              <div className="mockup-laptop__frame">
                <div className="mockup-laptop__topbar">
                  <span className="mockup-laptop__dot mockup-laptop__dot--red" />
                  <span className="mockup-laptop__dot mockup-laptop__dot--yellow" />
                  <span className="mockup-laptop__dot mockup-laptop__dot--green" />
                </div>
                <div className="mockup-laptop__screen">
                  <div className="mockup-laptop__header">
                    <span className="mockup-laptop__logo">CaféFlow</span>
                    <div className="mockup-laptop__nav">
                      <span>Dashboard</span>
                      <span>Orders</span>
                      <span>Menu</span>
                    </div>
                  </div>
                  <div className="mockup-dashboard__title">Dashboard</div>
                  <div className="mockup-dashboard__stats">
                    <div className="mockup-stat-card">
                      <div className="mockup-stat-card__icon">📦</div>
                      <div className="mockup-stat-card__value">48</div>
                      <div className="mockup-stat-card__label">Orders</div>
                    </div>
                    <div className="mockup-stat-card">
                      <div className="mockup-stat-card__icon">💰</div>
                      <div className="mockup-stat-card__value">₹12,430</div>
                      <div className="mockup-stat-card__label">Revenue</div>
                    </div>
                    <div className="mockup-stat-card">
                      <div className="mockup-stat-card__icon">👥</div>
                      <div className="mockup-stat-card__value">156</div>
                      <div className="mockup-stat-card__label">Customers</div>
                    </div>
                    <div className="mockup-stat-card">
                      <div className="mockup-stat-card__icon">🪑</div>
                      <div className="mockup-stat-card__value">9/15</div>
                      <div className="mockup-stat-card__label">Tables</div>
                    </div>
                  </div>
                  <div className="mockup-dashboard__chart">
                    <div className="mockup-chart__title">Sales Overview</div>
                    <div className="mockup-chart__bars">
                      {[60, 45, 75, 55, 80, 65, 90, 50, 70, 85, 60, 95].map((h, i) => (
                        <div key={i} className="mockup-chart__bar" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="mockup-dashboard__recent">
                    <div className="mockup-recent__title">Recent Orders</div>
                    <div className="mockup-recent__row">
                      <span className="mockup-recent__order">#105 · Table 3 · Rahul</span>
                      <span className="mockup-recent__badge mockup-recent__badge--preparing">Preparing</span>
                    </div>
                    <div className="mockup-recent__row">
                      <span className="mockup-recent__order">#104 · Table 5 · Priya</span>
                      <span className="mockup-recent__badge mockup-recent__badge--served">Served</span>
                    </div>
                    <div className="mockup-recent__row">
                      <span className="mockup-recent__order">#103 · Table 2 · Amit</span>
                      <span className="mockup-recent__badge mockup-recent__badge--queued">Queued</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mockup-laptop__base" />
            </div>

            {/* TABLET */}
            <div className="mockup-tablet">
              <div className="mockup-tablet__frame">
                <div className="mockup-tablet__screen">
                  <div className="mockup-kitchen__title">Kitchen Orders</div>
                  {[
                    { id: '#105', table: 'Table 3', name: 'Rahul', items: '2 Items', status: 'Preparing', statusClass: 'preparing' },
                    { id: '#104', table: 'Table 5', name: 'Priya', items: '3 Items', status: 'Queued', statusClass: 'queued' },
                    { id: '#103', table: 'Table 2', name: 'Amit', items: '1 Item', status: 'Ready', statusClass: 'ready' },
                  ].map(order => (
                    <div className="mockup-kitchen__card" key={order.id}>
                      <div className="mockup-kitchen__card-header">
                        <span className="mockup-kitchen__order-id">{order.id}</span>
                        <span className="mockup-kitchen__table">{order.table}</span>
                      </div>
                      <div className="mockup-kitchen__name">{order.name}</div>
                      <div className="mockup-kitchen__meta">
                        <span className="mockup-kitchen__items">{order.items}</span>
                        <span className={`mockup-kitchen__status mockup-kitchen__status--${order.statusClass}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PHONE */}
            <div className="mockup-phone">
              <div className="mockup-phone__frame">
                <div className="mockup-phone__notch" />
                <div className="mockup-phone__screen">
                  <div className="mockup-menu__header">
                    <div className="mockup-menu__cafe-name">CaféFlow Café</div>
                  </div>
                  <div className="mockup-menu__search">Search for dishes...</div>
                  <div className="mockup-menu__categories">
                    <span className="mockup-menu__category mockup-menu__category--active">All</span>
                    <span className="mockup-menu__category mockup-menu__category--inactive">Coffee</span>
                    <span className="mockup-menu__category mockup-menu__category--inactive">Pizza</span>
                    <span className="mockup-menu__category mockup-menu__category--inactive">Burgers</span>
                  </div>
                  {[
                    { name: 'Cappuccino', price: '₹120' },
                    { name: 'Margherita Pizza', price: '₹250' },
                    { name: 'Chicken Burger', price: '₹220' },
                    { name: 'French Fries', price: '₹130' },
                  ].map(item => (
                    <div className="mockup-menu__item" key={item.name}>
                      <div>
                        <div className="mockup-menu__item-name">{item.name}</div>
                        <div className="mockup-menu__item-price">{item.price}</div>
                      </div>
                      <div className="mockup-menu__item-btn">+</div>
                    </div>
                  ))}
                  <div className="mockup-menu__cart">
                    <span className="mockup-menu__cart-text">View Cart</span>
                    <span className="mockup-menu__cart-total">₹370 →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
