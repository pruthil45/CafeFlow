import {
  QrCode, BookOpen, ShoppingBag, ChefHat,
  UtensilsCrossed, Receipt, Bell, ArrowRight
} from 'lucide-react'

const steps = [
  { icon: QrCode, title: 'Customer Scans QR', desc: 'Scan the QR code at your table' },
  { icon: BookOpen, title: 'Browses Menu', desc: 'Explore food & beverages' },
  { icon: ShoppingBag, title: 'Places Order', desc: 'Order instantly from your phone' },
  { icon: Bell, title: 'Staff Receives Order', desc: 'Notification sent to staff' },
  { icon: ChefHat, title: 'Kitchen Prepares', desc: 'Kitchen starts cooking' },
  { icon: UtensilsCrossed, title: 'Food Served', desc: 'Staff serves at table' },
  { icon: Receipt, title: 'Bill & Payment', desc: 'Individual bill generated' },
  { icon: ArrowRight, title: 'Customer History', desc: 'Track past orders easily' },
]

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works" aria-label="How CaféFlow Works">
      <div className="how-it-works__container">
        <div className="how-it-works__header scroll-reveal">
          <div className="how-it-works__eyebrow">How It Works</div>
          <h2 className="how-it-works__title">
            Everything <span className="gold">Flows Together</span>
          </h2>
          <p className="how-it-works__subtitle">
            CaféFlow connects your café's operations from the first customer scan
            to the final bill.
          </p>
        </div>

        <div className="how-it-works__steps scroll-reveal">
          {steps.map((step, idx) => (
            <div key={step.title} style={{ display: 'contents' }}>
              <div className="how-it-works__step">
                <div className="how-it-works__step-number">{idx + 1}</div>
                <div className="how-it-works__step-icon">
                  <step.icon size={24} />
                </div>
                <div className="how-it-works__step-title">{step.title}</div>
                <div className="how-it-works__step-desc">{step.desc}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="how-it-works__arrow">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
