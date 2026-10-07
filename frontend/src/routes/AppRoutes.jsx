import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import LoginSignup from '../pages/LoginSignup/LoginSignup'
import CustomerLearnMore from '../pages/CustomerLearnMore/CustomerLearnMore'
import OwnerLearnMore from '../pages/OwnerLearnMore/OwnerLearnMore'
import StaffLearnMore from '../pages/StaffLearnMore/StaffLearnMore'
import Contact from '../pages/Contact/Contact'
import Pricing from '../pages/Pricing/Pricing'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/for-customers" element={<CustomerLearnMore />} />
      <Route path="/for-businesses/owners" element={<OwnerLearnMore />} />
      <Route path="/for-businesses/staff" element={<StaffLearnMore />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  )
}
