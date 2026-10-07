import {
  ShoppingCart, LayoutGrid, ChefHat, BookOpen,
  Users, Heart, Megaphone, BarChart3
} from 'lucide-react'

const features = [
  {
    icon: ShoppingCart,
    title: 'Orders',
    desc: 'Real-time order management with status tracking, kitchen communication and customer notifications.',
  },
  {
    icon: LayoutGrid,
    title: 'Tables',
    desc: 'Visual table layout with live occupancy status, reservations and automatic assignment.',
  },
  {
    icon: ChefHat,
    title: 'Kitchen',
    desc: 'Kitchen display system with order queues, preparation timers and priority management.',
  },
  {
    icon: BookOpen,
    title: 'Menu',
    desc: 'Digital menu builder with categories, pricing, customizations and beautiful presentation.',
  },
  {
    icon: Users,
    title: 'Customers',
    desc: 'Complete customer profiles with order history, preferences and communication tools.',
  },
  {
    icon: Heart,
    title: 'Loyalty',
    desc: 'Points-based loyalty programs with rewards, tiers and automated engagement campaigns.',
  },
  {
    icon: Megaphone,
    title: 'Promotions',
    desc: 'Create and manage discounts, combo offers, happy hours and seasonal campaigns.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    desc: 'Comprehensive insights on sales, popular items, peak hours and business performance.',
  },
]

export default function FeatureShowcase() {
  return (
    <section className="feature-showcase" aria-label="Feature Details">
      <div className="feature-showcase__container">
        <div className="feature-showcase__header scroll-reveal">
          <div className="feature-showcase__eyebrow">Features</div>
          <h2 className="feature-showcase__title">
            Everything Your <span className="gold">Café Needs</span>
          </h2>
        </div>

        <div className="feature-showcase__grid">
          {features.map(f => (
            <article className="feature-card scroll-reveal" key={f.title}>
              <div className="feature-card__icon">
                <f.icon size={24} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__visual">
                <div className="feature-card__visual-bar" />
                <div className="feature-card__visual-bar" />
                <div className="feature-card__visual-bar" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
