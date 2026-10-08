import { Link } from 'react-router-dom'
import { Store, Users, User, ArrowRight } from 'lucide-react'
import roleOwnerImg from '../assets/role-owner.png'
import roleStaffImg from '../assets/role-staff.png'
import roleCustomerImg from '../assets/role-customer.png'

const roles = [
  {
    key: 'owner',
    icon: Store,
    title: 'For Owners',
    desc: 'Run and customize your café with complete control over menu, tables, staff, promotions and more.',
    image: roleOwnerImg,
    imageAlt: 'Café owner storefront with warm ambient lighting',
    path: '/for-businesses/owners',
  },
  {
    key: 'staff',
    icon: Users,
    title: 'For Staff',
    desc: 'Handle daily operations, manage orders, tables, customers and payments easily.',
    image: roleStaffImg,
    imageAlt: 'Barista in apron operating order management on tablet',
    path: '/for-businesses/staff',
  },
  {
    key: 'customer',
    icon: User,
    title: 'For Customer',
    desc: 'Scan, order, track your food, call waiter and enjoy a seamless dining experience.',
    image: roleCustomerImg,
    imageAlt: 'Customer scanning menu and placing order on smartphone',
    path: '/for-customers',
  },
]

export default function RoleShowcase() {
  return (
    <section className="role-showcase" id="roles" aria-label="Role Showcase">
      <div className="role-showcase__container">
        <div className="role-showcase__header scroll-reveal">
          <div className="role-showcase__eyebrow">Built For Everyone</div>
          <h2 className="role-showcase__title">
            One Platform. <span className="gold">Three Experiences.</span>
          </h2>
          <p className="role-showcase__subtitle">
            Tailored interfaces designed for owners, floor staff, and dining guests.
          </p>
        </div>

        <div className="role-showcase__grid">
          {roles.map(role => (
            <article
              className={`role-card role-card--${role.key} scroll-reveal`}
              key={role.key}
            >
              <div className="role-card__image-wrap">
                <img
                  src={role.image}
                  alt={role.imageAlt}
                  className="role-card__img"
                  loading="lazy"
                />
              </div>

              <div className="role-card__body">
                <div className={`role-card__icon role-card__icon--${role.key}`}>
                  <role.icon size={22} />
                </div>
                <h3 className={`role-card__heading role-card__heading--${role.key}`}>
                  {role.title}
                </h3>
                <p className="role-card__desc">{role.desc}</p>
                <Link to={role.path} className={`role-card__link role-card__link--${role.key}`}>
                  <span>Learn More</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
