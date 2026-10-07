import { Link } from 'react-router-dom'
import { Store, Users, User, ArrowRight } from 'lucide-react'
import roleOwnerImg from '../assets/role-owner.jpg'
import roleStaffImg from '../assets/role-staff.jpg'
import roleCustomerImg from '../assets/role-customer.jpg'

const roles = [
  {
    key: 'owner',
    icon: Store,
    title: 'For Owners',
    desc: 'Run and customize your café with complete control over menu, tables, staff, promotions and more.',
    image: roleOwnerImg,
    imageAlt: 'Café owner standing in their coffee shop',
    path: '/for-businesses/owners',
  },
  {
    key: 'staff',
    icon: Users,
    title: 'For Staff',
    desc: 'Handle daily operations, manage orders, tables, customers and payments easily.',
    image: roleStaffImg,
    imageAlt: 'Barista preparing coffee at the counter',
    path: '/for-businesses/staff',
  },
  {
    key: 'customer',
    icon: User,
    title: 'For Customers',
    desc: 'Scan, order, track your food, call for assistance and enjoy a seamless dining experience.',
    image: roleCustomerImg,
    imageAlt: 'Customer browsing menu on phone in café',
    path: '/for-customers',
  },
]

export default function RoleShowcase() {
  return (
    <section className="role-showcase" id="roles" aria-label="Platform Roles">
      <div className="role-showcase__container">
        <div className="role-showcase__header scroll-reveal">
          <div className="role-showcase__eyebrow">Built For Everyone</div>
          <h2 className="role-showcase__title">
            One Platform. <span className="gold">Three Experiences.</span>
          </h2>
        </div>

        <div className="role-showcase__grid">
          {roles.map(role => (
            <article
              className={`role-card role-card--${role.key} scroll-reveal`}
              key={role.key}
            >
              <div className="role-card__image">
                <img src={role.image} alt={role.imageAlt} loading="lazy" />
              </div>
              <div className="role-card__body">
                <div className={`role-card__icon role-card__icon--${role.key}`}>
                  <role.icon size={20} />
                </div>
                <h3 className={`role-card__heading role-card__heading--${role.key}`}>
                  {role.title}
                </h3>
                <p className="role-card__desc">{role.desc}</p>
                <Link to={role.path} className={`role-card__link role-card__link--${role.key}`}>
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
