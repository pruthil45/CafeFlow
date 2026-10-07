// ============================================
// CaféFlow Admin — Centralized Mock Data
// ============================================
// All data is structured for easy API replacement.
// Relationships: Café → Owner → Staff → Customer → Orders

export const CAFES = [
  {
    id: 'CAF-001',
    name: 'Café Aroma',
    logo: null,
    location: 'Vadodara, Gujarat',
    city: 'Vadodara',
    state: 'Gujarat',
    address: 'Shop 14, Alkapuri Arcade, Vadodara, Gujarat 390007',
    cuisine: 'Café & Restaurant',
    description: 'A cozy café serving delicious artisan coffee and freshly baked goods.',
    phone: '+91 98765 43210',
    email: 'cafe.aroma@gmail.com',
    website: 'https://cafearoma.in',
    tables: 12,
    status: 'active',
    orders: 1284,
    revenue: 412320,
    staff: 8,
    createdAt: 'Sep 12, 2026',
    createdDate: '2026-09-12',
    color: '#D4A04A',
    ownerId: 'OWN-001',
    rating: 4.8,
  },
  {
    id: 'CAF-002',
    name: 'Brew & Bites',
    logo: null,
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'Ground Floor, Sindhu Bhavan Road, Bodakdev, Ahmedabad 380054',
    cuisine: 'Bistro & Specialty Coffee',
    description: 'Specialty coffee lounge with gourmet continental bites and desserts.',
    phone: '+91 98765 12340',
    email: 'brewandbites@gmail.com',
    website: 'https://brewandbites.in',
    tables: 18,
    status: 'active',
    orders: 2143,
    revenue: 682410,
    staff: 12,
    createdAt: 'Aug 28, 2026',
    createdDate: '2026-08-28',
    color: '#8B5E3C',
    ownerId: 'OWN-002',
    rating: 4.9,
  },
  {
    id: 'CAF-003',
    name: 'The Daily Grind',
    logo: null,
    location: 'Surat, Gujarat',
    city: 'Surat',
    state: 'Gujarat',
    address: 'Opp. VR Mall, Dumas Road, Magdalla, Surat 395007',
    cuisine: 'Roastery & Bakery',
    description: 'Handcrafted cold brews, pour-overs and artisanal sourdough bakes.',
    phone: '+91 98760 99871',
    email: 'dailygrind@gmail.com',
    website: 'https://dailygrind.in',
    tables: 10,
    status: 'active',
    orders: 982,
    revenue: 298450,
    staff: 6,
    createdAt: 'Aug 10, 2026',
    createdDate: '2026-08-10',
    color: '#5C8A4A',
    ownerId: 'OWN-003',
    rating: 4.7,
  },
  {
    id: 'CAF-004',
    name: 'Café Nova',
    logo: null,
    location: 'Vadodara, Gujarat',
    city: 'Vadodara',
    state: 'Gujarat',
    address: 'Near Inorbit Mall, Gorwa Road, Vadodara 390023',
    cuisine: 'Modern Italian Café',
    description: 'Authentic stone baked pizzas and specialty espresso drinks.',
    phone: '+91 98761 11223',
    email: 'cafenova@gmail.com',
    website: 'https://cafenova.in',
    tables: 16,
    status: 'inactive',
    orders: 1431,
    revenue: 374180,
    staff: 9,
    createdAt: 'Jul 25, 2026',
    createdDate: '2026-07-25',
    color: '#6A4FA0',
    ownerId: 'OWN-004',
    rating: 4.5,
  },
  {
    id: 'CAF-005',
    name: 'Urban Beans',
    logo: null,
    location: 'Rajkot, Gujarat',
    city: 'Rajkot',
    state: 'Gujarat',
    address: 'Kalawad Road, Near Crystal Mall, Rajkot 360005',
    cuisine: 'Urban Café & Desserts',
    description: 'Vibrant youth hangout serving thick shakes, loaded fries and coffees.',
    phone: '+91 98762 44556',
    email: 'urbanbeans@gmail.com',
    website: 'https://urbanbeans.in',
    tables: 14,
    status: 'active',
    orders: 894,
    revenue: 248920,
    staff: 7,
    createdAt: 'Jul 18, 2026',
    createdDate: '2026-07-18',
    color: '#C75B2A',
    ownerId: 'OWN-005',
    rating: 4.6,
  },
  {
    id: 'CAF-006',
    name: 'Bean Street',
    logo: null,
    location: 'Surat, Gujarat',
    city: 'Surat',
    state: 'Gujarat',
    address: 'City Light Road, Athwa, Surat 395007',
    cuisine: 'Fast Casual Café',
    description: 'Quick-service coffee bar and gourmet sandwich deli.',
    phone: '+91 98763 77654',
    email: 'beanstreet@gmail.com',
    website: 'https://beanstreet.in',
    tables: 8,
    status: 'active',
    orders: 721,
    revenue: 182360,
    staff: 5,
    createdAt: 'Jul 02, 2026',
    createdDate: '2026-07-02',
    color: '#2B8A8A',
    ownerId: 'OWN-006',
    rating: 4.4,
  },
  {
    id: 'CAF-007',
    name: 'The Coffee House',
    logo: null,
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    address: 'CG Road, Navrangpura, Ahmedabad 380009',
    cuisine: 'Classic Café & Brunch',
    description: 'Heritage ambience with hearty English breakfasts and filter coffees.',
    phone: '+91 98764 88771',
    email: 'coffeehouse@gmail.com',
    website: 'https://thecoffeehouse.in',
    tables: 20,
    status: 'active',
    orders: 1920,
    revenue: 510670,
    staff: 11,
    createdAt: 'Jun 21, 2026',
    createdDate: '2026-06-21',
    color: '#B04B74',
    ownerId: 'OWN-001',
    rating: 4.8,
  },
  {
    id: 'CAF-008',
    name: 'Mocha & More',
    logo: null,
    location: 'Vadodara, Gujarat',
    city: 'Vadodara',
    state: 'Gujarat',
    address: 'Old Padra Road, Vadodara 390020',
    cuisine: 'Dessert & Coffee Parlor',
    description: 'Decadent chocolate fondues, cheesecakes and single-origin mochas.',
    phone: '+91 98765 33421',
    email: 'mochamore@gmail.com',
    website: 'https://mochamore.in',
    tables: 14,
    status: 'active',
    orders: 643,
    revenue: 196210,
    staff: 6,
    createdAt: 'Jun 05, 2026',
    createdDate: '2026-06-05',
    color: '#8A6240',
    ownerId: 'OWN-002',
    rating: 4.6,
  },
];

export const OWNERS = [
  {
    id: 'OWN-001',
    name: 'Rahul Patel',
    phone: '+91 98765 43210',
    email: 'rahul@gmail.com',
    location: 'Vadodara, Gujarat, India',
    cafeId: 'CAF-001',
    joinedOn: 'Sep 12, 2026',
    lastLogin: 'Sep 29, 2026, 10:24 AM',
    status: 'active',
    loginAccess: true,
    avatar: null,
  },
  {
    id: 'OWN-002',
    name: 'Priya Mehta',
    phone: '+91 98765 12340',
    email: 'priya@gmail.com',
    location: 'Ahmedabad, Gujarat, India',
    cafeId: 'CAF-002',
    joinedOn: 'Aug 28, 2026',
    lastLogin: 'Sep 28, 2026, 08:12 AM',
    status: 'active',
    loginAccess: true,
    avatar: null,
  },
  {
    id: 'OWN-003',
    name: 'Amit Shah',
    phone: '+91 98760 99871',
    email: 'amit@gmail.com',
    location: 'Surat, Gujarat, India',
    cafeId: 'CAF-003',
    joinedOn: 'Aug 10, 2026',
    lastLogin: 'Sep 25, 2026, 06:45 PM',
    status: 'active',
    loginAccess: true,
    avatar: null,
  },
  {
    id: 'OWN-004',
    name: 'Neha Patel',
    phone: '+91 98761 11223',
    email: 'neha@gmail.com',
    location: 'Vadodara, Gujarat, India',
    cafeId: 'CAF-004',
    joinedOn: 'Jul 25, 2026',
    lastLogin: 'Aug 12, 2026, 11:32 AM',
    status: 'inactive',
    loginAccess: false,
    avatar: null,
  },
  {
    id: 'OWN-005',
    name: 'Karan Verma',
    phone: '+91 98762 44556',
    email: 'karan@gmail.com',
    location: 'Rajkot, Gujarat, India',
    cafeId: 'CAF-005',
    joinedOn: 'Sep 20, 2026',
    lastLogin: 'Sep 26, 2026, 02:18 PM',
    status: 'active',
    loginAccess: true,
    avatar: null,
  },
  {
    id: 'OWN-006',
    name: 'Sneha Joshi',
    phone: '+91 98763 77854',
    email: 'sneha@gmail.com',
    location: 'Surat, Gujarat, India',
    cafeId: 'CAF-006',
    joinedOn: 'Jul 02, 2026',
    lastLogin: 'Sep 27, 2026, 08:15 AM',
    status: 'active',
    loginAccess: true,
    avatar: null,
  },
];

export const STAFF = [
  {
    id: 'ST-001',
    name: 'Rahul Verma',
    phone: '+91 98765 43210',
    email: 'rahulv@gmail.com',
    cafeId: 'CAF-001',
    role: 'Waiter',
    joinedOn: 'Aug 12, 2026',
    lastActive: 'Sep 30, 2026, 10:24 AM',
    status: 'active',
    loginAccess: true,
    location: 'Vadodara, Gujarat, India',
    avatar: null,
  },
  {
    id: 'ST-002',
    name: 'Priya Shah',
    phone: '+91 98765 12340',
    email: 'priyas@gmail.com',
    cafeId: 'CAF-001',
    role: 'Cashier',
    joinedOn: 'Jul 28, 2026',
    lastActive: 'Sep 30, 2026, 09:58 AM',
    status: 'active',
    loginAccess: true,
    location: 'Vadodara, Gujarat, India',
    avatar: null,
  },
  {
    id: 'ST-003',
    name: 'Amit Patel',
    phone: '+91 98760 99871',
    email: 'amitp@gmail.com',
    cafeId: 'CAF-002',
    role: 'Waiter',
    joinedOn: 'Aug 03, 2026',
    lastActive: 'Sep 30, 2026, 09:42 PM',
    status: 'active',
    loginAccess: true,
    location: 'Ahmedabad, Gujarat, India',
    avatar: null,
  },
  {
    id: 'ST-004',
    name: 'Neha Mehta',
    phone: '+91 98761 11223',
    email: 'neham@gmail.com',
    cafeId: 'CAF-003',
    role: 'Kitchen Staff',
    joinedOn: 'Jul 15, 2026',
    lastActive: 'Sep 30, 2026, 11:08 AM',
    status: 'active',
    loginAccess: true,
    location: 'Surat, Gujarat, India',
    avatar: null,
  },
  {
    id: 'ST-005',
    name: 'Karan Desai',
    phone: '+91 98762 44556',
    email: 'karand@gmail.com',
    cafeId: 'CAF-004',
    role: 'Manager',
    joinedOn: 'Jun 22, 2026',
    lastActive: 'Sep 28, 2026, 06:32 PM',
    status: 'inactive',
    loginAccess: false,
    location: 'Vadodara, Gujarat, India',
    avatar: null,
  },
];

// ============================================
// CUSTOMERS DATASET (Matched to Screenshot 1)
// ============================================
export const CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Rahul Sharma',
    avatar: null,
    phone: '+91 98765 43210',
    email: 'rahul@gmail.com',
    location: 'Vadodara, Gujarat, India',
    cafeId: 'CAF-001',
    cafeName: 'Café Aroma',
    orders: 12,
    totalSpending: 8450,
    totalVisits: 7,
    avgOrderValue: 704,
    lastVisit: 'Sep 29, 2026 02:14 PM',
    status: 'active',
    type: 'Regular',
    since: 'Aug 12, 2026',
    loyaltyTier: 'Gold Member',
    loyaltyPoints: 2340,
    loyaltyTarget: 5000,
    nextTier: 'Platinum',
    cafeActivity: [
      { cafeName: 'Café Aroma', orders: 8, spending: 4120, percent: 67 },
      { cafeName: 'Brew & Bites', orders: 3, spending: 2230, percent: 18 },
      { cafeName: 'The Daily Grind', orders: 1, spending: 680, percent: 8 },
      { cafeName: 'Café Nova', orders: 0, spending: 0, percent: 0 },
    ],
    recentOrders: [
      { id: '#ORD-1042', date: 'Sep 29, 2026, 02:14 PM', amount: 680, status: 'Completed', item: 'Cold Coffee + Margherita Pizza' },
      { id: '#ORD-1018', date: 'Sep 25, 2026, 12:18 PM', amount: 920, status: 'Completed', item: 'Classic Burger + French Fries' },
      { id: '#ORD-0984', date: 'Sep 21, 2026, 07:32 PM', amount: 450, status: 'Completed', item: 'Cappuccino + Brownie' },
      { id: '#ORD-0762', date: 'Sep 15, 2026, 01:22 PM', amount: 1240, status: 'Completed', item: 'Pasta Alfredo + Mocktail' },
      { id: '#ORD-0651', date: 'Sep 10, 2026, 06:14 PM', amount: 780, status: 'Cancelled', item: 'Club Sandwich combo' },
    ],
    activityTimeline: [
      { id: 1, title: 'Order Served', desc: 'Order #ORD-1042 delivered at Table 4', time: 'Sep 29, 2026, 02:28 PM', icon: 'coffee' },
      { id: 2, title: 'Order Placed', desc: 'Placed dine-in order for ₹680', time: 'Sep 29, 2026, 02:14 PM', icon: 'shopping-bag' },
      { id: 3, title: 'Login Access', desc: 'Logged in via QR scan at Café Aroma', time: 'Sep 29, 2026, 02:05 PM', icon: 'log-in' },
      { id: 4, title: 'Reward Redeemed', desc: 'Used 200 points for Free Cold Coffee', time: 'Sep 25, 2026, 12:20 PM', icon: 'gift' },
      { id: 5, title: 'Profile Updated', desc: 'Changed email preferences', time: 'Sep 18, 2026, 11:30 AM', icon: 'user' },
    ],
  },
  {
    id: 'CUST-002',
    name: 'Priya Shah',
    avatar: null,
    phone: '+91 98765 12340',
    email: 'priya@gmail.com',
    location: 'Ahmedabad, Gujarat, India',
    cafeId: 'CAF-002',
    cafeName: 'Brew & Bites',
    orders: 8,
    totalSpending: 5280,
    totalVisits: 5,
    avgOrderValue: 660,
    lastVisit: 'Sep 28, 2026 07:32 PM',
    status: 'active',
    type: 'Regular',
    since: 'Aug 20, 2026',
    loyaltyTier: 'Silver Member',
    loyaltyPoints: 1250,
    loyaltyTarget: 2500,
    nextTier: 'Gold',
    cafeActivity: [
      { cafeName: 'Brew & Bites', orders: 6, spending: 3950, percent: 75 },
      { cafeName: 'The Coffee House', orders: 2, spending: 1330, percent: 25 },
    ],
    recentOrders: [
      { id: '#ORD-1025', date: 'Sep 28, 2026, 07:32 PM', amount: 890, status: 'Completed', item: 'Iced Latte + Avocado Toast' },
      { id: '#ORD-0960', date: 'Sep 20, 2026, 04:15 PM', amount: 540, status: 'Completed', item: 'Blueberry Cheesecake' },
    ],
    activityTimeline: [
      { id: 1, title: 'Order Completed', desc: 'Order #ORD-1025 paid via UPI', time: 'Sep 28, 2026, 07:55 PM', icon: 'check-circle' },
      { id: 2, title: 'Order Placed', desc: 'Placed order at Brew & Bites Table 7', time: 'Sep 28, 2026, 07:32 PM', icon: 'shopping-bag' },
    ],
  },
  {
    id: 'CUST-003',
    name: 'Amit Patel',
    avatar: null,
    phone: '+91 98760 99871',
    email: 'amit@gmail.com',
    location: 'Surat, Gujarat, India',
    cafeId: 'CAF-003',
    cafeName: 'The Daily Grind',
    orders: 21,
    totalSpending: 14920,
    totalVisits: 14,
    avgOrderValue: 710,
    lastVisit: 'Sep 25, 2026 12:18 PM',
    status: 'active',
    type: 'VIP',
    since: 'Jul 15, 2026',
    loyaltyTier: 'Platinum Member',
    loyaltyPoints: 4620,
    loyaltyTarget: 5000,
    nextTier: 'Diamond',
    cafeActivity: [
      { cafeName: 'The Daily Grind', orders: 17, spending: 12450, percent: 83 },
      { cafeName: 'Bean Street', orders: 4, spending: 2470, percent: 17 },
    ],
    recentOrders: [
      { id: '#ORD-0995', date: 'Sep 25, 2026, 12:18 PM', amount: 1150, status: 'Completed', item: 'Pour Over V60 + Sourdough Sandwich' },
      { id: '#ORD-0912', date: 'Sep 19, 2026, 01:40 PM', amount: 980, status: 'Completed', item: 'Cold Brew Flight + Muffin' },
    ],
    activityTimeline: [
      { id: 1, title: 'VIP Reward Credited', desc: 'Earned 2x reward multiplier points', time: 'Sep 25, 2026, 12:45 PM', icon: 'award' },
    ],
  },
  {
    id: 'CUST-004',
    name: 'Neha Mehta',
    avatar: null,
    phone: '+91 98761 11223',
    email: 'neha@gmail.com',
    location: 'Vadodara, Gujarat, India',
    cafeId: 'CAF-004',
    cafeName: 'Café Nova',
    orders: 5,
    totalSpending: 2840,
    totalVisits: 4,
    avgOrderValue: 568,
    lastVisit: 'Sep 24, 2026 09:45 PM',
    status: 'inactive',
    type: 'Regular',
    since: 'Jun 30, 2026',
    loyaltyTier: 'Bronze Member',
    loyaltyPoints: 520,
    loyaltyTarget: 1000,
    nextTier: 'Silver',
    cafeActivity: [
      { cafeName: 'Café Nova', orders: 5, spending: 2840, percent: 100 },
    ],
    recentOrders: [
      { id: '#ORD-0870', date: 'Sep 24, 2026, 09:45 PM', amount: 620, status: 'Completed', item: 'Spaghetti Aglio Olio' },
    ],
    activityTimeline: [
      { id: 1, title: 'Inactivity Notice', desc: 'No orders logged in 14 days', time: 'Oct 02, 2026, 10:00 AM', icon: 'alert-circle' },
    ],
  },
  {
    id: 'CUST-005',
    name: 'Karan Desai',
    avatar: null,
    phone: '+91 98762 44556',
    email: 'karan@gmail.com',
    location: 'Rajkot, Gujarat, India',
    cafeId: 'CAF-005',
    cafeName: 'Urban Beans',
    orders: 16,
    totalSpending: 11320,
    totalVisits: 11,
    avgOrderValue: 708,
    lastVisit: 'Sep 22, 2026 06:12 PM',
    status: 'active',
    type: 'Regular',
    since: 'Aug 05, 2026',
    loyaltyTier: 'Gold Member',
    loyaltyPoints: 3180,
    loyaltyTarget: 5000,
    nextTier: 'Platinum',
    cafeActivity: [
      { cafeName: 'Urban Beans', orders: 16, spending: 11320, percent: 100 },
    ],
    recentOrders: [
      { id: '#ORD-0845', date: 'Sep 22, 2026, 06:12 PM', amount: 840, status: 'Completed', item: 'Loaded Peri-Peri Fries + Hazelnut Frappe' },
    ],
    activityTimeline: [
      { id: 1, title: 'Order Served', desc: 'Dine-in Order Served Table 2', time: 'Sep 22, 2026, 06:30 PM', icon: 'coffee' },
    ],
  },
  {
    id: 'CUST-006',
    name: 'Pooja Sharma',
    avatar: null,
    phone: '+91 98763 77854',
    email: 'poojas@gmail.com',
    location: 'Vadodara, Gujarat, India',
    cafeId: 'CAF-001',
    cafeName: 'Café Aroma',
    orders: 14,
    totalSpending: 9680,
    totalVisits: 9,
    avgOrderValue: 691,
    lastVisit: 'Sep 27, 2026 04:30 PM',
    status: 'active',
    type: 'VIP',
    since: 'Jul 20, 2026',
    loyaltyTier: 'Gold Member',
    loyaltyPoints: 2840,
    loyaltyTarget: 5000,
    nextTier: 'Platinum',
    cafeActivity: [
      { cafeName: 'Café Aroma', orders: 11, spending: 7540, percent: 78 },
      { cafeName: 'Mocha & More', orders: 3, spending: 2140, percent: 22 },
    ],
    recentOrders: [
      { id: '#ORD-1010', date: 'Sep 27, 2026, 04:30 PM', amount: 720, status: 'Completed', item: 'Mocha Frappe + Red Velvet' },
    ],
    activityTimeline: [
      { id: 1, title: 'Feedback Provided', desc: 'Rated 5 stars for Café Aroma', time: 'Sep 27, 2026, 05:00 PM', icon: 'star' },
    ],
  },
  {
    id: 'CUST-007',
    name: 'Vikram Singh',
    avatar: null,
    phone: '+91 98764 88901',
    email: 'vikram@gmail.com',
    location: 'Ahmedabad, Gujarat, India',
    cafeId: 'CAF-002',
    cafeName: 'Brew & Bites',
    orders: 19,
    totalSpending: 13450,
    totalVisits: 13,
    avgOrderValue: 707,
    lastVisit: 'Sep 26, 2026 08:20 PM',
    status: 'active',
    type: 'VIP',
    since: 'Jun 10, 2026',
    loyaltyTier: 'Platinum Member',
    loyaltyPoints: 4120,
    loyaltyTarget: 5000,
    nextTier: 'Diamond',
    cafeActivity: [
      { cafeName: 'Brew & Bites', orders: 15, spending: 10600, percent: 79 },
      { cafeName: 'The Coffee House', orders: 4, spending: 2850, percent: 21 },
    ],
    recentOrders: [
      { id: '#ORD-1002', date: 'Sep 26, 2026, 08:20 PM', amount: 1450, status: 'Completed', item: 'Truffle Pizza + Tiramisu' },
    ],
    activityTimeline: [
      { id: 1, title: 'Order Completed', desc: 'Order #ORD-1002 completed', time: 'Sep 26, 2026, 08:50 PM', icon: 'check-circle' },
    ],
  },
];

// ============================================
// CUSTOMERS KPI (Matched to Screenshot 1)
// ============================================
export const CUSTOMERS_KPI = {
  totalCustomers: { value: 12842, growth: 18, label: 'Total Customers' },
  activeCustomers: { value: 8421, growth: 12, label: 'Active Customers' },
  newCustomers: { value: 1284, growth: 28, label: 'New Customers' },
  returningCustomers: { value: 6937, growth: 9, label: 'Returning Customers' },
};

// Customer Growth chart series (Jan-Sep)
export const CUSTOMER_GROWTH_SERIES = [
  { month: 'Jan', value: 520 },
  { month: 'Feb', value: 740 },
  { month: 'Mar', value: 890 },
  { month: 'Apr', value: 1100 },
  { month: 'May', value: 1350 },
  { month: 'Jun', value: 1580 },
  { month: 'Jul', value: 1720 },
  { month: 'Aug', value: 1910 },
  { month: 'Sep', value: 2180 },
];

// Top Café by Customers (Horizontal Bar Chart)
export const TOP_CAFES_BY_CUSTOMERS = [
  { name: 'Café Aroma', count: 3842, percent: 30, color: '#983B16' },
  { name: 'Brew & Bites', count: 2981, percent: 23, color: '#C75B2A' },
  { name: 'The Daily Grind', count: 2410, percent: 19, color: '#D4A04A' },
  { name: 'Café Nova', count: 1982, percent: 15, color: '#E8A060' },
  { name: 'Urban Beans', count: 1627, percent: 13, color: '#7E2F0F' },
];

// Customer Distribution Donut
export const CUSTOMER_DISTRIBUTION_DONUT = [
  { name: 'Café Aroma', value: 3842, percent: 30, color: '#983B16' },
  { name: 'Brew & Bites', value: 2981, percent: 23, color: '#D4A04A' },
  { name: 'The Daily Grind', value: 2410, percent: 19, color: '#8B5E3C' },
  { name: 'Café Nova', value: 1982, percent: 15, color: '#5C8A4A' },
  { name: 'Urban Beans', value: 1627, percent: 13, color: '#4A6FA5' },
];

// ============================================
// CAFÉS KPI (Matched to Screenshot 4)
// ============================================
export const CAFES_KPI = {
  totalCafes: { value: 24, growth: 9, label: 'Total Cafés', subtext: 'vs last month' },
  activeCafes: { value: 21, percent: 87.5, label: 'Active Cafés', subtext: 'of total cafés' },
  inactiveCafes: { value: 3, percent: 12.5, label: 'Inactive Cafés', subtext: 'of total cafés' },
  newThisMonth: { value: 4, growth: 2, label: 'New This Month', subtext: 'vs last month' },
};

// ============================================
// PLATFORM ANALYTICS DATA (Matched to Screenshot 3)
// ============================================
export const PLATFORM_KPI = {
  totalRevenue: { value: 3245280, growth: 28, label: 'Total Revenue', subtext: 'vs last month' },
  totalOrders: { value: 48261, growth: 22, label: 'Total Orders', subtext: 'vs last month' },
  totalCustomers: { value: 12842, growth: 18, label: 'Total Customers', subtext: 'vs last month' },
  avgOrderValue: { value: 674, growth: 6, label: 'Avg. Order Value', subtext: 'vs last month' },
};

// Platform Growth Curves (Revenue, Orders, Customers)
export const PLATFORM_GROWTH_SERIES = [
  { month: 'Apr', revenue: 14.2, orders: 18.5, customers: 5.2 },
  { month: 'May', revenue: 18.6, orders: 24.1, customers: 6.8 },
  { month: 'Jun', revenue: 23.4, orders: 30.5, customers: 8.4 },
  { month: 'Jul', revenue: 27.8, orders: 36.2, customers: 10.1 },
  { month: 'Aug', revenue: 30.5, orders: 42.0, customers: 11.5 },
  { month: 'Sep', revenue: 32.4, orders: 48.2, customers: 12.8 },
];

// Revenue Overview (Time series curve)
export const PLATFORM_REVENUE_CURVE = [
  { date: 'Sep 1', value: 85000 },
  { date: 'Sep 4', value: 110000 },
  { date: 'Sep 7', value: 145000 },
  { date: 'Sep 10', value: 130000 },
  { date: 'Sep 14', value: 195000 },
  { date: 'Sep 17', value: 175000 },
  { date: 'Sep 21', value: 248320 },
  { date: 'Sep 24', value: 210000 },
  { date: 'Sep 28', value: 235000 },
];

// Orders Overview (Bar chart: Dine-in, Takeaway, Delivery)
export const PLATFORM_ORDERS_BARS = [
  { date: 'Sep 1', dineIn: 420, takeaway: 280, delivery: 150 },
  { date: 'Sep 7', dineIn: 580, takeaway: 390, delivery: 240 },
  { date: 'Sep 14', dineIn: 710, takeaway: 460, delivery: 310 },
  { date: 'Sep 21', dineIn: 1480, takeaway: 890, delivery: 580 },
  { date: 'Sep 28', dineIn: 1250, takeaway: 760, delivery: 490 },
];

// New vs Returning Donut
export const PLATFORM_NEW_RETURNING_DONUT = [
  { name: 'New Customers', value: 4108, percent: 32, color: '#3B82F6' },
  { name: 'Returning Customers', value: 8734, percent: 68, color: '#D4A04A' },
];

// Order Distribution Donut
export const PLATFORM_ORDER_DISTRIBUTION_DONUT = [
  { name: 'Dine-in', value: 22208, percent: 46, color: '#3B82F6' },
  { name: 'Takeaway', value: 15428, percent: 32, color: '#D4A04A' },
  { name: 'Delivery', value: 10625, percent: 22, color: '#E87A30' },
];

// Top Performing Cafés List
export const TOP_PERFORMING_CAFES = [
  { rank: 1, id: 'CAF-001', name: 'Café Aroma', revenue: 812320, orders: 12842, growth: 24, status: 'active', location: 'Vadodara' },
  { rank: 2, id: 'CAF-002', name: 'Brew & Bites', revenue: 682410, orders: 10521, growth: 18, status: 'active', location: 'Ahmedabad' },
  { rank: 3, id: 'CAF-003', name: 'The Daily Grind', revenue: 498450, orders: 7982, growth: 32, status: 'active', location: 'Surat' },
  { rank: 4, id: 'CAF-004', name: 'Café Nova', revenue: 374180, orders: 6431, growth: 12, status: 'inactive', location: 'Vadodara' },
  { rank: 5, id: 'CAF-005', name: 'Urban Beans', revenue: 248920, orders: 4850, growth: 8, status: 'active', location: 'Rajkot' },
];

// Café Performance Table
export const CAFE_PERFORMANCE_TABLE = [
  { rank: 1, id: 'CAF-001', name: 'Café Aroma', location: 'Vadodara', revenue: 812320, orders: 12842, customers: 6920, avgOrderValue: 632, growth: 24, status: 'active' },
  { rank: 2, id: 'CAF-002', name: 'Brew & Bites', location: 'Ahmedabad', revenue: 682410, orders: 10521, customers: 5431, avgOrderValue: 648, growth: 18, status: 'active' },
  { rank: 3, id: 'CAF-003', name: 'The Daily Grind', location: 'Surat', revenue: 498450, orders: 7982, customers: 4210, avgOrderValue: 624, growth: 32, status: 'active' },
  { rank: 4, id: 'CAF-004', name: 'Café Nova', location: 'Vadodara', revenue: 374180, orders: 6431, customers: 3842, avgOrderValue: 582, growth: 12, status: 'inactive' },
  { rank: 5, id: 'CAF-005', name: 'Urban Beans', location: 'Rajkot', revenue: 248920, orders: 4850, customers: 2981, avgOrderValue: 514, growth: 8, status: 'active' },
];

// Top Cities Breakdown
export const TOP_CITIES_BREAKDOWN = [
  { city: 'Vadodara', percent: 28 },
  { city: 'Ahmedabad', percent: 22 },
  { city: 'Surat', percent: 18 },
  { city: 'Rajkot', percent: 12 },
];

// ============================================
// CAFÉ ANALYTICS SPECIFIC DATA (Matched to Screenshot 2)
// ============================================
export const CAFE_ANALYTICS_DATA = {
  'CAF-001': {
    id: 'CAF-001',
    name: 'Café Aroma',
    location: 'Vadodara, Gujarat',
    status: 'active',
    tables: 12,
    staff: 8,
    joinedDate: 'Sep 12, 2026',
    kpis: {
      totalRevenue: { value: 812320, growth: 18, label: 'Total Revenue', subtext: 'vs last month' },
      totalOrders: { value: 12842, growth: 12, label: 'Total Orders', subtext: 'vs last month' },
      totalCustomers: { value: 6920, growth: 14, label: 'Total Customers', subtext: 'vs last month' },
      avgOrderValue: { value: 632, growth: 4, label: 'Avg. Order Value', subtext: 'vs last month' },
    },
    revenueTrend: [
      { date: 'Sep 1', value: 24000 },
      { date: 'Sep 5', value: 31000 },
      { date: 'Sep 10', value: 45000 },
      { date: 'Sep 15', value: 38000 },
      { date: 'Sep 20', value: 52000 },
      { date: 'Sep 25', value: 49000 },
      { date: 'Sep 30', value: 64000 },
    ],
    ordersTrend: [
      { date: 'Sep 1', count: 340 },
      { date: 'Sep 5', count: 420 },
      { date: 'Sep 10', count: 580 },
      { date: 'Sep 15', count: 490 },
      { date: 'Sep 20', count: 680 },
      { date: 'Sep 25', count: 620 },
      { date: 'Sep 30', count: 790 },
    ],
    customerGrowth: [
      { date: 'Sep 1', new: 180, returning: 320 },
      { date: 'Sep 7', new: 240, returning: 410 },
      { date: 'Sep 14', new: 290, returning: 530 },
      { date: 'Sep 21', new: 360, returning: 670 },
      { date: 'Sep 28', new: 420, returning: 780 },
    ],
    popularItems: [
      { rank: 1, name: 'Cold Coffee', orders: 1284, revenue: 256800 },
      { rank: 2, name: 'Margherita Pizza', orders: 982, revenue: 196400 },
      { rank: 3, name: 'Classic Burger', orders: 841, revenue: 168200 },
      { rank: 4, name: 'French Fries', orders: 720, revenue: 108000 },
      { rank: 5, name: 'Paneer Wrap', orders: 642, revenue: 96300 },
    ],
    ordersByCategory: [
      { name: 'Beverages', value: 4108, percent: 32, color: '#8B5E3C' },
      { name: 'Main Course', value: 3597, percent: 28, color: '#D4A04A' },
      { name: 'Snacks', value: 2311, percent: 18, color: '#C75B2A' },
      { name: 'Desserts', value: 1540, percent: 12, color: '#E87A30' },
      { name: 'Others', value: 1286, percent: 10, color: '#5C8A4A' },
    ],
    peakHours: [
      { hour: '9 AM', orders: 124 },
      { hour: '10 AM', orders: 286 },
      { hour: '11 AM', orders: 482 },
      { hour: '12 PM', orders: 662 },
      { hour: '1 PM', orders: 754 },
      { hour: '2 PM', orders: 621 },
      { hour: '3 PM', orders: 498 },
      { hour: '4 PM', orders: 312 },
      { hour: '5 PM', orders: 412 },
      { hour: '6 PM', orders: 648 },
      { hour: '7 PM', orders: 720 },
      { hour: '8 PM', orders: 681 },
    ],
    growthComparison: {
      revenue: { growth: 18, trend: [20, 24, 28, 32, 38, 45, 52] },
      orders: { growth: 12, trend: [30, 35, 38, 41, 46, 50, 56] },
      customers: { growth: 14, trend: [15, 18, 22, 25, 29, 34, 39] },
      avgOrderValue: { growth: 4, trend: [12, 13, 13, 14, 15, 15, 16] },
    },
  },
  'CAF-002': {
    id: 'CAF-002',
    name: 'Brew & Bites',
    location: 'Ahmedabad, Gujarat',
    status: 'active',
    tables: 18,
    staff: 12,
    joinedDate: 'Aug 28, 2026',
    kpis: {
      totalRevenue: { value: 682410, growth: 16, label: 'Total Revenue', subtext: 'vs last month' },
      totalOrders: { value: 10521, growth: 14, label: 'Total Orders', subtext: 'vs last month' },
      totalCustomers: { value: 5431, growth: 15, label: 'Total Customers', subtext: 'vs last month' },
      avgOrderValue: { value: 648, growth: 5, label: 'Avg. Order Value', subtext: 'vs last month' },
    },
    revenueTrend: [
      { date: 'Sep 1', value: 20000 },
      { date: 'Sep 5', value: 26000 },
      { date: 'Sep 10', value: 38000 },
      { date: 'Sep 15', value: 34000 },
      { date: 'Sep 20', value: 44000 },
      { date: 'Sep 25', value: 41000 },
      { date: 'Sep 30', value: 55000 },
    ],
    ordersTrend: [
      { date: 'Sep 1', count: 280 },
      { date: 'Sep 5', count: 350 },
      { date: 'Sep 10', count: 480 },
      { date: 'Sep 15', count: 410 },
      { date: 'Sep 20', count: 560 },
      { date: 'Sep 25', count: 520 },
      { date: 'Sep 30', count: 660 },
    ],
    customerGrowth: [
      { date: 'Sep 1', new: 140, returning: 260 },
      { date: 'Sep 7', new: 190, returning: 340 },
      { date: 'Sep 14', new: 240, returning: 430 },
      { date: 'Sep 21', new: 290, returning: 550 },
      { date: 'Sep 28', new: 350, returning: 640 },
    ],
    popularItems: [
      { rank: 1, name: 'Iced Caramel Macchiato', orders: 1040, revenue: 208000 },
      { rank: 2, name: 'Truffle Mushroom Pasta', orders: 810, revenue: 194400 },
      { rank: 3, name: 'Avocado Sourdough Toast', orders: 740, revenue: 148000 },
      { rank: 4, name: 'Matcha Green Tea Latte', orders: 620, revenue: 111600 },
      { rank: 5, name: 'New York Cheesecake', orders: 580, revenue: 98600 },
    ],
    ordersByCategory: [
      { name: 'Beverages', value: 3680, percent: 35, color: '#8B5E3C' },
      { name: 'Main Course', value: 2940, percent: 28, color: '#D4A04A' },
      { name: 'Snacks', value: 1890, percent: 18, color: '#C75B2A' },
      { name: 'Desserts', value: 1260, percent: 12, color: '#E87A30' },
      { name: 'Others', value: 751, percent: 7, color: '#5C8A4A' },
    ],
    peakHours: [
      { hour: '9 AM', orders: 98 },
      { hour: '10 AM', orders: 230 },
      { hour: '11 AM', orders: 390 },
      { hour: '12 PM', orders: 540 },
      { hour: '1 PM', orders: 680 },
      { hour: '2 PM', orders: 510 },
      { hour: '3 PM', orders: 380 },
      { hour: '4 PM', orders: 290 },
      { hour: '5 PM', orders: 420 },
      { hour: '6 PM', orders: 590 },
      { hour: '7 PM', orders: 680 },
      { hour: '8 PM', orders: 620 },
    ],
    growthComparison: {
      revenue: { growth: 16, trend: [18, 22, 25, 29, 34, 40, 48] },
      orders: { growth: 14, trend: [25, 29, 33, 37, 42, 47, 52] },
      customers: { growth: 15, trend: [14, 16, 20, 23, 27, 31, 36] },
      avgOrderValue: { growth: 5, trend: [10, 11, 12, 13, 14, 14, 15] },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCafeById(id) {
  return CAFES.find((c) => c.id === id) || CAFES[0];
}

export function getOwnerById(id) {
  return OWNERS.find((o) => o.id === id) || null;
}

export function getOwnerByCafeId(cafeId) {
  return OWNERS.find((o) => o.cafeId === cafeId) || null;
}

export function getStaffByCafeId(cafeId) {
  return STAFF.filter((s) => s.cafeId === cafeId);
}

export function getCustomerById(id) {
  return CUSTOMERS.find((c) => c.id === id) || CUSTOMERS[0];
}

export function getCafeAnalyticsData(cafeId) {
  return CAFE_ANALYTICS_DATA[cafeId] || CAFE_ANALYTICS_DATA['CAF-001'];
}

// Format Indian currency
export function formatINR(amount) {
  if (amount == null) return '₹0';
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(2) + ' L';
  return '₹' + amount.toLocaleString('en-IN');
}

// Format number with commas
export function formatNumber(num) {
  if (num == null) return '0';
  return num.toLocaleString('en-IN');
}

// Backward-compatible exports for Dashboard & Staff Overview
export const DASHBOARD_KPI = {
  totalCafes: { value: 24, growth: 9, label: 'Total Cafés' },
  activeCafes: { value: 21, growth: 5, label: 'Active Cafés' },
  totalOwners: { value: 24, growth: 14, label: 'Total Owners' },
  totalStaff: { value: 86, growth: 12, label: 'Total Staff' },
  totalCustomers: { value: 12842, growth: 18, label: 'Total Customers' },
  totalOrders: { value: 48261, growth: 22, label: 'Total Orders' },
  totalRevenue: { value: 3245280, growth: 28, label: 'Total Revenue' },
  avgOrderValue: { value: 674, growth: 6, label: 'Avg. Order Value' },
};

export const REVENUE_CHART_DATA = [
  { date: 'Sep 1', value: 85000 },
  { date: 'Sep 4', value: 92000 },
  { date: 'Sep 7', value: 115000 },
  { date: 'Sep 10', value: 108000 },
  { date: 'Sep 14', value: 135000 },
  { date: 'Sep 17', value: 142000 },
  { date: 'Sep 21', value: 248320 },
  { date: 'Sep 24', value: 195000 },
  { date: 'Sep 28', value: 220000 },
];

export const ORDERS_CHART_DATA = [
  { date: 'Sep 1', dineIn: 420, takeaway: 280, delivery: 150 },
  { date: 'Sep 7', dineIn: 510, takeaway: 350, delivery: 220 },
  { date: 'Sep 14', dineIn: 680, takeaway: 420, delivery: 310 },
  { date: 'Sep 21', dineIn: 1450, takeaway: 890, delivery: 560 },
  { date: 'Sep 28', dineIn: 1200, takeaway: 750, delivery: 480 },
];

export const CUSTOMER_GROWTH_DATA = [
  { month: 'Aug', value: 8200 },
  { month: 'Sep', value: 8800 },
  { month: 'Oct', value: 9500 },
  { month: 'Nov', value: 10200 },
  { month: 'Dec', value: 11400 },
  { month: 'Jan', value: 12842 },
];

export const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'cafe_created',
    description: 'New café "Brew & Bites" created',
    timestamp: '2 minutes ago',
    icon: 'store',
    color: '#D4A04A',
  },
  {
    id: 2,
    type: 'owner_created',
    description: 'Owner account created - Rohan Mehta',
    timestamp: '15 minutes ago',
    icon: 'user',
    color: '#4a8fd4',
  },
  {
    id: 3,
    type: 'cafe_activated',
    description: 'Café "Café Nova" activated',
    timestamp: '32 minutes ago',
    icon: 'check',
    color: '#4aaa6a',
  },
  {
    id: 4,
    type: 'staff_added',
    description: 'Staff member added - Priya Sharma',
    timestamp: '1 hour ago',
    icon: 'users',
    color: '#9a6ad4',
  },
  {
    id: 5,
    type: 'menu_updated',
    description: 'Menu updated - The Daily Grind',
    timestamp: '2 hours ago',
    icon: 'edit',
    color: '#e87a30',
  },
  {
    id: 6,
    type: 'customer_registered',
    description: 'New customer registered',
    timestamp: '3 hours ago',
    icon: 'user-plus',
    color: '#4aaa6a',
  },
];

export const SYSTEM_ALERTS = [
  {
    id: 1,
    type: 'error',
    title: 'Pending Café Verification',
    description: '3 new café registrations pending review',
    color: '#ef4444',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Inactive Café Detected',
    description: '2 cafés have been inactive for 7+ days',
    color: '#f59e0b',
  },
  {
    id: 3,
    type: 'info',
    title: 'High Order Volume',
    description: 'Café Aroma has 40% higher orders today',
    color: '#3b82f6',
  },
  {
    id: 4,
    type: 'success',
    title: 'System Healthy',
    description: 'All systems are running smoothly',
    color: '#22c55e',
  },
];

export const STAFF_ACTIVITIES = [
  { id: 1, type: 'login', description: 'Login', timestamp: 'Sep 30, 2026, 10:24 AM', icon: 'log-in' },
  { id: 2, type: 'order', description: 'Order Served', timestamp: 'Sep 30, 2026, 09:58 AM', icon: 'coffee' },
  { id: 3, type: 'order', description: 'Order Served', timestamp: 'Sep 30, 2026, 09:32 AM', icon: 'coffee' },
  { id: 4, type: 'login', description: 'Login', timestamp: 'Sep 30, 2026, 09:10 AM', icon: 'log-in' },
  { id: 5, type: 'order', description: 'Order Served', timestamp: 'Sep 29, 2026, 08:45 PM', icon: 'coffee' },
  { id: 6, type: 'logout', description: 'Logout', timestamp: 'Sep 29, 2026, 08:18 PM', icon: 'log-out' },
];

