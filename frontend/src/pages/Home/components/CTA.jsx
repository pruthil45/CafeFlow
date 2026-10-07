import { useNavigate } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import ctaBg from '../assets/cta-bg.jpg'

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section className="cta-section" aria-label="Call to Action">
      <div className="cta-section__bg">
        <img src={ctaBg} alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div className="cta-section__overlay" />

      <div className="cta-section__content scroll-reveal">
        <h2 className="cta-section__title">
          Ready to Run Your Café <span className="gold">Smarter?</span>
        </h2>
        <p className="cta-section__desc">
          Bring your café operations, customers and growth into one powerful platform.
        </p>
        <div className="cta-section__buttons">
          <button
            className="cta-section__primary-btn"
            onClick={() => navigate('/login')}
            aria-label="Get Started"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button
            className="cta-section__secondary-btn"
            onClick={() => navigate('/contact')}
            aria-label="Talk to Us"
          >
            <MessageCircle size={18} /> Talk to Us
          </button>
        </div>
      </div>
    </section>
  )
}
