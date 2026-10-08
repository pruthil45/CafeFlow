import { useEffect, useRef, useState } from 'react'
import { Coffee, Users, ShoppingCart, IndianRupee, Star } from 'lucide-react'
import heroBg from '../assets/hero-bg.jpg'

const stats = [
  { icon: Coffee, value: '500+', label: 'Cafés Onboarded' },
  { icon: Users, value: '1M+', label: 'Happy Customers' },
  { icon: ShoppingCart, value: '10M+', label: 'Orders Processed' },
  { icon: IndianRupee, value: '₹100Cr+', label: 'Total Revenue' },
  { icon: Star, value: '4.8/5', label: 'Customer Satisfaction' },
]

export default function StatsSection() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats-section" ref={ref} aria-label="Platform Statistics">
      <div className="stats-section__bg" aria-hidden="true">
        <img src={heroBg} alt="" loading="lazy" />
      </div>
      <div className="stats-section__overlay" aria-hidden="true" />

      <div className="stats-section__container">
        <div className="stats-section__grid">
          {stats.map((s, i) => (
            <div
              className="stat-card"
              key={s.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
              }}
            >
              <div className="stat-card__icon" aria-hidden="true">
                <s.icon size={26} />
              </div>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
