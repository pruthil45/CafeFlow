import {
  QrCode, LayoutGrid, ChefHat, HeartHandshake, Megaphone, BarChart3, Building2
} from 'lucide-react'

const features = [
  { icon: QrCode, title: 'QR Ordering', desc: 'In-café digital menu' },
  { icon: LayoutGrid, title: 'Table Management', desc: 'Real-time table status' },
  { icon: ChefHat, title: 'Order & Kitchen', desc: 'Seamless workflow' },
  { icon: HeartHandshake, title: 'Customer & Loyalty', desc: 'Build lasting relationships' },
  { icon: Megaphone, title: 'Promotions', desc: 'Boost your business' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Data-driven growth' },
  { icon: Building2, title: 'Multi-Café Platform', desc: 'Manage multiple locations' },
]

export default function FeatureStrip() {
  return (
    <section className="feature-strip" id="features" aria-label="Key Features">
      <div className="feature-strip__container">
        {features.map((f, index) => (
          <div className="feature-strip__item" key={f.title}>
            <div className="feature-strip__icon" aria-hidden="true">
              <f.icon size={22} />
            </div>
            <div className="feature-strip__title">{f.title}</div>
            <div className="feature-strip__desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
