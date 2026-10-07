import { useState } from 'react'
import {
  MessageSquare,
  Settings,
  Users,
  CheckCircle2,
  User,
  Phone,
  Store,
  MapPin,
  LayoutGrid,
  Calendar,
  Megaphone,
  FileText,
  Lock,
  ArrowRight,
  Mail,
  PhoneCall,
  Rocket,
  Star,
  Headphones,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import HeaderNav from '../../components/HeaderNav'
import Footer from '../../components/Footer'
import contactHeroImg from '../../assets/contact_hero_qr.jpg'
import cafeDarkBg from '../../assets/cafe_dark_bg.jpg'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    cafeName: '',
    city: '',
    tables: '',
    startDate: '',
    source: '',
    notes: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required'
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }
    if (!formData.cafeName.trim()) {
      newErrors.cafeName = 'Café / Business name is required'
    }
    if (!formData.city) {
      newErrors.city = 'Please select your city'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1200)
  }

  const handleReset = () => {
    setFormData({
      name: '',
      mobile: '',
      cafeName: '',
      city: '',
      tables: '',
      startDate: '',
      source: '',
      notes: '',
    })
    setErrors({})
    setIsSubmitted(false)
  }

  return (
    <div className="contact-page">
      <HeaderNav activePage="contact" />

      {/* Hero Section */}
      <section
        className="contact-hero"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(14, 9, 7, 0.96) 35%, rgba(14, 9, 7, 0.8) 70%, rgba(14, 9, 7, 0.9) 100%), url(${cafeDarkBg})`,
        }}
      >
        <div className="contact-hero__container">
          {/* Left Content */}
          <div className="contact-hero__left">
            <span className="contact-hero__eyebrow">CONTACT US</span>
            <h1 className="contact-hero__title">
              Let’s Set Up <span className="contact-hero__title--accent">Your Café</span>
            </h1>
            <p className="contact-hero__desc">
              Ready to simplify your café operations? Request a setup and our team will get in touch to help you get started with CaféFlow.
            </p>

            {/* 4 Benefit Items */}
            <div className="contact-hero__benefits">
              <div className="contact-benefit-item">
                <div className="contact-benefit-item__icon-wrap">
                  <MessageSquare size={20} className="contact-benefit-item__icon" />
                </div>
                <div className="contact-benefit-item__content">
                  <h4 className="contact-benefit-item__title">Quick Response</h4>
                  <p className="contact-benefit-item__desc">We usually reply within 24 hours</p>
                </div>
              </div>

              <div className="contact-benefit-item__divider" />

              <div className="contact-benefit-item">
                <div className="contact-benefit-item__icon-wrap">
                  <Settings size={20} className="contact-benefit-item__icon" />
                </div>
                <div className="contact-benefit-item__content">
                  <h4 className="contact-benefit-item__title">Personalized Setup</h4>
                  <p className="contact-benefit-item__desc">We understand your café needs</p>
                </div>
              </div>

              <div className="contact-benefit-item__divider" />

              <div className="contact-benefit-item">
                <div className="contact-benefit-item__icon-wrap">
                  <Users size={20} className="contact-benefit-item__icon" />
                </div>
                <div className="contact-benefit-item__content">
                  <h4 className="contact-benefit-item__title">Expert Guidance</h4>
                  <p className="contact-benefit-item__desc">Get help from our team</p>
                </div>
              </div>

              <div className="contact-benefit-item__divider" />

              <div className="contact-benefit-item">
                <div className="contact-benefit-item__icon-wrap">
                  <CheckCircle2 size={20} className="contact-benefit-item__icon" />
                </div>
                <div className="contact-benefit-item__content">
                  <h4 className="contact-benefit-item__title">Smooth Onboarding</h4>
                  <p className="contact-benefit-item__desc">We'll help you every step of the way</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="contact-hero__right">
            <div className="contact-hero__image-card">
              <img
                src={contactHeroImg}
                alt="Café table setting with CaféFlow QR stand"
                className="contact-hero__image"
              />
              <div className="contact-hero__script-badge">
                <span>Good Food</span>
                <span>Better Moments</span>
                <span className="contact-hero__script-heart">♡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Request Form & Info Section */}
      <section className="contact-main-section">
        <div className="contact-main__container">
          <div className="contact-main__grid">
            {/* Left Column: Request a Café Setup Form */}
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h2 className="contact-form-title">
                  Request a <span className="contact-form-title--accent">Café Setup</span>
                </h2>
                <p className="contact-form-subtitle">
                  Share a few details about your café and we'll contact you with the best plan and next steps.
                </p>
              </div>

              {isSubmitted ? (
                <div className="contact-success-state">
                  <div className="contact-success-icon-wrap">
                    <Check size={36} />
                  </div>
                  <h3 className="contact-success-title">Request Received!</h3>
                  <p className="contact-success-desc">
                    Thank you, <strong>{formData.name}</strong>! Our onboarding specialists will reach out to you within 24 hours at <strong>+91 {formData.mobile}</strong> to tailor the setup for <strong>{formData.cafeName}</strong>.
                  </p>
                  <div className="contact-success-summary">
                    <div className="contact-success-item">
                      <span className="contact-success-item__label">City</span>
                      <span className="contact-success-item__val">{formData.city}</span>
                    </div>
                    {formData.tables && (
                      <div className="contact-success-item">
                        <span className="contact-success-item__label">Tables</span>
                        <span className="contact-success-item__val">{formData.tables}</span>
                      </div>
                    )}
                    {formData.startDate && (
                      <div className="contact-success-item">
                        <span className="contact-success-item__label">Expected Start</span>
                        <span className="contact-success-item__val">{formData.startDate}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="contact-reset-btn"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Row 1: Name and Mobile */}
                  <div className="contact-form-row">
                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="name">
                        Your Name <span className="contact-required">*</span>
                      </label>
                      <div className={`contact-input-wrapper ${errors.name ? 'contact-input-wrapper--error' : ''}`}>
                        <User size={18} className="contact-field-icon" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="contact-input"
                        />
                      </div>
                      {errors.name && <span className="contact-error-msg"><AlertCircle size={13} /> {errors.name}</span>}
                    </div>

                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="mobile">
                        Mobile Number <span className="contact-required">*</span>
                      </label>
                      <div className={`contact-input-wrapper ${errors.mobile ? 'contact-input-wrapper--error' : ''}`}>
                        <Phone size={18} className="contact-field-icon" />
                        <span className="contact-phone-prefix">+91</span>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          className="contact-input"
                        />
                      </div>
                      {errors.mobile && <span className="contact-error-msg"><AlertCircle size={13} /> {errors.mobile}</span>}
                    </div>
                  </div>

                  {/* Row 2: Café Name and City */}
                  <div className="contact-form-row">
                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="cafeName">
                        Café / Business Name <span className="contact-required">*</span>
                      </label>
                      <div className={`contact-input-wrapper ${errors.cafeName ? 'contact-input-wrapper--error' : ''}`}>
                        <Store size={18} className="contact-field-icon" />
                        <input
                          id="cafeName"
                          name="cafeName"
                          type="text"
                          value={formData.cafeName}
                          onChange={handleChange}
                          placeholder="Enter your café name"
                          className="contact-input"
                        />
                      </div>
                      {errors.cafeName && <span className="contact-error-msg"><AlertCircle size={13} /> {errors.cafeName}</span>}
                    </div>

                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="city">
                        City <span className="contact-required">*</span>
                      </label>
                      <div className={`contact-input-wrapper ${errors.city ? 'contact-input-wrapper--error' : ''}`}>
                        <MapPin size={18} className="contact-field-icon" />
                        <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="contact-select"
                        >
                          <option value="">Select your city</option>
                          <option value="Vadodara">Vadodara</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Surat">Surat</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Pune">Pune</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Jaipur">Jaipur</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Indore">Indore</option>
                          <option value="Lucknow">Lucknow</option>
                          <option value="Kochi">Kochi</option>
                          <option value="Other">Other City</option>
                        </select>
                      </div>
                      {errors.city && <span className="contact-error-msg"><AlertCircle size={13} /> {errors.city}</span>}
                    </div>
                  </div>

                  {/* Row 3: Expected Tables and Start Date */}
                  <div className="contact-form-row">
                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="tables">
                        Expected Number of Tables
                      </label>
                      <div className="contact-input-wrapper">
                        <LayoutGrid size={18} className="contact-field-icon" />
                        <select
                          id="tables"
                          name="tables"
                          value={formData.tables}
                          onChange={handleChange}
                          className="contact-select"
                        >
                          <option value="">Select range</option>
                          <option value="1 - 5 tables">1 - 5 tables</option>
                          <option value="6 - 15 tables">6 - 15 tables</option>
                          <option value="16 - 30 tables">16 - 30 tables</option>
                          <option value="31 - 50 tables">31 - 50 tables</option>
                          <option value="50+ tables">50+ tables</option>
                        </select>
                      </div>
                    </div>

                    <div className="contact-field-group">
                      <label className="contact-field-label" htmlFor="startDate">
                        Expected Start Date
                      </label>
                      <div className="contact-input-wrapper">
                        <Calendar size={18} className="contact-field-icon" />
                        <input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="contact-input contact-date-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 4: How did you hear about us */}
                  <div className="contact-field-group">
                    <label className="contact-field-label" htmlFor="source">
                      How did you hear about us?
                    </label>
                    <div className="contact-input-wrapper">
                      <Megaphone size={18} className="contact-field-icon" />
                      <select
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        className="contact-select"
                      >
                        <option value="">Select option</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Instagram / Social Media">Instagram / Social Media</option>
                        <option value="Friend or Colleague">Friend or Colleague</option>
                        <option value="Existing Café using CaféFlow">Existing Café using CaféFlow</option>
                        <option value="Exhibition / Event">Exhibition / Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Textarea */}
                  <div className="contact-field-group">
                    <label className="contact-field-label" htmlFor="notes">
                      Tell us more about your café (Optional)
                    </label>
                    <div className="contact-textarea-wrapper">
                      <FileText size={18} className="contact-field-icon contact-field-icon--textarea" />
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Share any specific requirements, questions or details..."
                        className="contact-textarea"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="contact-spinner" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        Submit Request <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="contact-privacy-note">
                    <Lock size={14} className="contact-privacy-icon" />
                    <span>We respect your privacy. Your information is safe with us.</span>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Process & Contact Info */}
            <div className="contact-info-column">
              {/* Process Card: What Happens Next? */}
              <div className="contact-process-card">
                <h3 className="contact-process-title">What Happens Next?</h3>
                <div className="contact-process-list">
                  <div className="contact-process-item">
                    <div className="contact-process-marker">
                      <span className="contact-process-step-num">1</span>
                      <div className="contact-process-connector" />
                    </div>
                    <div className="contact-process-content">
                      <div className="contact-process-step-header">
                        <Mail size={16} className="contact-process-step-icon" />
                        <h4 className="contact-process-step-title">We Receive Your Request</h4>
                      </div>
                      <p className="contact-process-step-desc">Our team reviews your requirements.</p>
                    </div>
                  </div>

                  <div className="contact-process-item">
                    <div className="contact-process-marker">
                      <span className="contact-process-step-num">2</span>
                      <div className="contact-process-connector" />
                    </div>
                    <div className="contact-process-content">
                      <div className="contact-process-step-header">
                        <PhoneCall size={16} className="contact-process-step-icon" />
                        <h4 className="contact-process-step-title">We Get In Touch</h4>
                      </div>
                      <p className="contact-process-step-desc">We'll call or email you within 24 hours.</p>
                    </div>
                  </div>

                  <div className="contact-process-item">
                    <div className="contact-process-marker">
                      <span className="contact-process-step-num">3</span>
                      <div className="contact-process-connector" />
                    </div>
                    <div className="contact-process-content">
                      <div className="contact-process-step-header">
                        <MessageSquare size={16} className="contact-process-step-icon" />
                        <h4 className="contact-process-step-title">Discuss Your Requirements</h4>
                      </div>
                      <p className="contact-process-step-desc">Understand your café, tables, menu and workflow.</p>
                    </div>
                  </div>

                  <div className="contact-process-item">
                    <div className="contact-process-marker">
                      <span className="contact-process-step-num">4</span>
                      <div className="contact-process-connector" />
                    </div>
                    <div className="contact-process-content">
                      <div className="contact-process-step-header">
                        <FileText size={16} className="contact-process-step-icon" />
                        <h4 className="contact-process-step-title">Recommend the Best Plan</h4>
                      </div>
                      <p className="contact-process-step-desc">We suggest the right plan for your needs.</p>
                    </div>
                  </div>

                  <div className="contact-process-item">
                    <div className="contact-process-marker">
                      <span className="contact-process-step-num">5</span>
                    </div>
                    <div className="contact-process-content">
                      <div className="contact-process-step-header">
                        <Rocket size={16} className="contact-process-step-icon" />
                        <h4 className="contact-process-step-title">Setup & Onboarding</h4>
                      </div>
                      <p className="contact-process-step-desc">Our team helps you get started smoothly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Have Questions? Card */}
              <div className="contact-support-card">
                <h3 className="contact-support-title">Have Questions?</h3>
                <p className="contact-support-subtitle">We're here to help. Reach out to us anytime.</p>

                <div className="contact-cards-group">
                  <a href="tel:+919876543210" className="contact-channel-card">
                    <div className="contact-channel-card__icon-wrap">
                      <PhoneCall size={20} />
                    </div>
                    <div className="contact-channel-card__content">
                      <span className="contact-channel-card__label">Call Us</span>
                      <span className="contact-channel-card__value">+91 98765 43210</span>
                      <span className="contact-channel-card__sub">Mon - Sat, 9:00 AM - 7:00 PM</span>
                    </div>
                  </a>

                  <a href="mailto:support@cafeflow.in" className="contact-channel-card">
                    <div className="contact-channel-card__icon-wrap">
                      <Mail size={20} />
                    </div>
                    <div className="contact-channel-card__content">
                      <span className="contact-channel-card__label">Email Us</span>
                      <span className="contact-channel-card__value">support@cafeflow.in</span>
                      <span className="contact-channel-card__sub">We usually reply within 24 hours</span>
                    </div>
                  </a>

                  <div className="contact-channel-card">
                    <div className="contact-channel-card__icon-wrap">
                      <MapPin size={20} />
                    </div>
                    <div className="contact-channel-card__content">
                      <span className="contact-channel-card__label">Our Office</span>
                      <span className="contact-channel-card__value">Vadodara, Gujarat, India</span>
                      <span className="contact-channel-card__sub">(Remote setup available pan India)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Statistics Section: Powering Cafés Across India */}
      <section className="contact-stats-section">
        <div className="contact-stats__container">
          <div className="contact-stats-card">
            <div className="contact-stats-content">
              <h2 className="contact-stats-heading">Powering Cafés Across India</h2>
              <p className="contact-stats-subheading">
                From small cafés to large restaurants, CaféFlow helps businesses run smoother every day.
              </p>

              {/* Stats Row */}
              <div className="contact-stats-row">
                <div className="contact-stat-box">
                  <div className="contact-stat-box__icon-wrap">
                    <Store size={22} />
                  </div>
                  <div className="contact-stat-box__num">500+</div>
                  <div className="contact-stat-box__label">Cafés Onboarded</div>
                </div>

                <div className="contact-stat-box">
                  <div className="contact-stat-box__icon-wrap">
                    <Users size={22} />
                  </div>
                  <div className="contact-stat-box__num">200+</div>
                  <div className="contact-stat-box__label">Happy Owners</div>
                </div>

                <div className="contact-stat-box">
                  <div className="contact-stat-box__icon-wrap">
                    <Star size={22} />
                  </div>
                  <div className="contact-stat-box__num">99.9%</div>
                  <div className="contact-stat-box__label">Uptime</div>
                </div>

                <div className="contact-stat-box">
                  <div className="contact-stat-box__icon-wrap">
                    <Headphones size={22} />
                  </div>
                  <div className="contact-stat-box__num">24/7</div>
                  <div className="contact-stat-box__label">Support</div>
                </div>
              </div>
            </div>

            {/* India Map Visual */}
            <div className="contact-map-visual">
              <div className="contact-map-badge">
                <span>Cafés</span>
                <span>Across</span>
                <span>India</span>
                <svg className="contact-map-arrow" width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <path d="M5 10 C 15 8, 25 15, 28 26" stroke="#d4a04a" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                  <path d="M22 26 L 28 27 L 27 21" stroke="#d4a04a" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Stylized vector map */}
              <svg
                className="contact-india-svg"
                viewBox="0 0 320 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Dotted grid / abstract India territory silhouette */}
                <path
                  d="M150 20 L165 45 L155 70 L185 85 L210 90 L245 105 L260 125 L245 140 L220 135 L200 150 L195 180 L205 210 L185 240 L160 280 L140 320 L130 300 L120 260 L115 220 L100 190 L85 160 L75 140 L85 115 L110 100 L125 70 L140 35 Z"
                  fill="rgba(212, 160, 74, 0.04)"
                  stroke="rgba(212, 160, 74, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Sub-geometric connector meshes */}
                <path
                  d="M150 70 L185 85 M150 70 L110 100 M110 100 L100 190 M185 85 L200 150 M100 190 L160 280 M200 150 L185 240 M185 240 L140 320"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />

                {/* Pin 1: Vadodara / Gujarat (Home) */}
                <g className="map-pin-pulse" transform="translate(95, 175)">
                  <circle r="14" fill="rgba(249, 115, 22, 0.2)" className="pulse-circle" />
                  <circle r="7" fill="#f97316" />
                  <circle r="3" fill="#fff" />
                </g>

                {/* Pin 2: Mumbai / Pune */}
                <g className="map-pin-pulse" transform="translate(108, 220)">
                  <circle r="12" fill="rgba(249, 115, 22, 0.2)" className="pulse-circle" />
                  <circle r="6" fill="#f97316" />
                  <circle r="2.5" fill="#fff" />
                </g>

                {/* Pin 3: Delhi NCR */}
                <g className="map-pin-pulse" transform="translate(142, 95)">
                  <circle r="13" fill="rgba(249, 115, 22, 0.2)" className="pulse-circle" />
                  <circle r="6" fill="#f97316" />
                  <circle r="2.5" fill="#fff" />
                </g>

                {/* Pin 4: Bengaluru */}
                <g className="map-pin-pulse" transform="translate(138, 275)">
                  <circle r="12" fill="rgba(249, 115, 22, 0.2)" className="pulse-circle" />
                  <circle r="6" fill="#f97316" />
                  <circle r="2.5" fill="#fff" />
                </g>

                {/* Pin 5: Kolkata */}
                <g className="map-pin-pulse" transform="translate(215, 155)">
                  <circle r="11" fill="rgba(249, 115, 22, 0.18)" className="pulse-circle" />
                  <circle r="5" fill="#f97316" />
                  <circle r="2" fill="#fff" />
                </g>

                {/* Pin 6: Hyderabad */}
                <g className="map-pin-pulse" transform="translate(145, 225)">
                  <circle r="10" fill="rgba(249, 115, 22, 0.18)" className="pulse-circle" />
                  <circle r="5" fill="#f97316" />
                  <circle r="2" fill="#fff" />
                </g>

                {/* Pin 7: Jaipur */}
                <g className="map-pin-pulse" transform="translate(120, 120)">
                  <circle r="9" fill="rgba(249, 115, 22, 0.16)" />
                  <circle r="4.5" fill="#f97316" />
                  <circle r="2" fill="#fff" />
                </g>

                {/* Pin 8: Chennai */}
                <g className="map-pin-pulse" transform="translate(155, 290)">
                  <circle r="9" fill="rgba(249, 115, 22, 0.16)" />
                  <circle r="4.5" fill="#f97316" />
                  <circle r="2" fill="#fff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
