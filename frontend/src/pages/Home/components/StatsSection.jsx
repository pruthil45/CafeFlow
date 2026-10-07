import { useEffect, useRef, useState } from 'react'
import { Building2, Users, ShoppingCart, IndianRupee, Star } from 'lucide-react'
import heroBg from '../assets/hero-bg.jpg'

const stats = [
  { icon: Building2, value: '500+', label: 'Cafés Onboarded' },
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
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="stats-section" ref={ref} aria-label="Platform Statistics">
      <div className="stats-section__bg">
        <img src={heroBg} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="stats-section__overlay" />

      <div className="stats-section__container">
        <div className="stats-section__header">
          <div className="stats-section__eyebrow">Powering Cafés Across India</div>
          <h2 className="stats-section__title">Numbers That Speak</h2>
        </div>

        <div className="stats-section__grid">
          {stats.map((s, i) => (
            <div
              className="stat-card"
              key={s.label}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease ${i * 0.1}s`,
              }}
            >
              <div className="stat-card__icon">
                <s.icon size={24} />
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
