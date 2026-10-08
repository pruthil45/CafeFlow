import { Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'

export default function OwnerPlaceholderView({ title, description, icon: Icon }) {
  return (
    <div className="owner-placeholder-container">
      <div className="owner-placeholder-card">
        <div className="owner-placeholder-icon-box">
          {Icon ? <Icon size={32} /> : <Clock size={32} />}
        </div>
        <h2 className="owner-placeholder-title">{title}</h2>
        <p className="owner-placeholder-desc">
          {description ||
            `The ${title} module for your café is connected to the CaféFlow platform. Full live operations will load here.`}
        </p>
        <Link to="/owner/dashboard" className="owner-placeholder-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
