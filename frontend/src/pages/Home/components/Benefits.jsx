import {
  Zap, Timer, Target, Smile, TrendingUp, RefreshCcw
} from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Less Manual Work',
    desc: 'Automate repetitive tasks like order taking, billing and inventory tracking.',
  },
  {
    icon: Timer,
    title: 'Faster Service',
    desc: 'Reduce wait times with instant digital ordering and real-time kitchen communication.',
  },
  {
    icon: Target,
    title: 'Better Order Accuracy',
    desc: 'Eliminate errors with direct customer-to-kitchen digital order flow.',
  },
  {
    icon: Smile,
    title: 'Happier Customers',
    desc: 'Deliver a seamless, modern dining experience that keeps customers coming back.',
  },
  {
    icon: TrendingUp,
    title: 'Smarter Business Decisions',
    desc: 'Use real-time analytics and reports to optimize menu, pricing and operations.',
  },
  {
    icon: RefreshCcw,
    title: 'Higher Customer Retention',
    desc: 'Build loyalty with rewards, personalized offers and memorable experiences.',
  },
]

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Benefits">
      <div className="benefits__container">
        <div className="benefits__header scroll-reveal">
          <div className="benefits__eyebrow">Why CaféFlow</div>
          <h2 className="benefits__title">
            Built to Make Café Operations <span className="gold">Simpler</span>
          </h2>
        </div>

        <div className="benefits__grid">
          {benefits.map(b => (
            <div className="benefit-card scroll-reveal" key={b.title}>
              <div className="benefit-card__icon">
                <b.icon size={26} />
              </div>
              <h3 className="benefit-card__title">{b.title}</h3>
              <p className="benefit-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
