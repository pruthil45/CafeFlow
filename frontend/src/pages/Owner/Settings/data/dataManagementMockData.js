// ==========================================================================
// CAFÉFLOW OWNER PORTAL — DATA MANAGEMENT MOCK DATA & CSV GENERATORS
// ==========================================================================

export const INITIAL_DATA_KPIS = [
  {
    id: 'orders',
    title: 'Total Orders',
    value: 12482,
    formatted: '12,482',
    trend: '↑ 12%',
    sub: 'All time orders',
    icon: 'FileText',
  },
  {
    id: 'customers',
    title: 'Customers',
    value: 3240,
    formatted: '3,240',
    trend: '↑ 8%',
    sub: 'Registered customers',
    icon: 'Users',
  },
  {
    id: 'menu',
    title: 'Menu Items',
    value: 126,
    formatted: '126',
    trend: '↑ 5%',
    sub: 'Active menu items',
    icon: 'BookOpen',
  },
  {
    id: 'loyalty',
    title: 'Loyalty Members',
    value: 1180,
    formatted: '1,180',
    trend: '↑ 15%',
    sub: 'Total loyalty members',
    icon: 'Star',
  },
  {
    id: 'promotions',
    title: 'Promotions',
    value: 24,
    formatted: '24',
    sub: 'Created promotions',
    icon: 'Tag',
  },
]

export const DATA_OVERVIEW_CHART_DATA = [
  { date: '26 Sep', orders: 130, heightPercent: 32.5 },
  { date: '27 Sep', orders: 155, heightPercent: 38.75 },
  { date: '28 Sep', orders: 210, heightPercent: 52.5 },
  { date: '29 Sep', orders: 195, heightPercent: 48.75 },
  { date: '30 Sep', orders: 270, heightPercent: 67.5 },
  { date: '01 Oct', orders: 290, heightPercent: 72.5 },
  { date: '02 Oct', orders: 370, heightPercent: 92.5 },
  { date: '03 Oct', orders: 340, heightPercent: 85.0 },
]

export const STORAGE_USAGE_DATA = {
  totalGb: 10,
  usedGb: 2.4,
  usedPercent: 24,
  breakdown: [
    { label: 'Orders', size: '1.2 GB', color: '#3b1f14' },
    { label: 'Customer Data', size: '600 MB', color: '#b84513' },
    { label: 'Menu & Media', size: '400 MB', color: '#d97736' },
    { label: 'Other Data', size: '200 MB', color: '#e0a96d' },
  ],
}

export const EXPORT_ROWS = [
  {
    id: 'orders',
    title: 'Orders',
    description: 'Export all orders with items, payment details and date.',
    format: 'CSV',
    icon: 'FileText',
    filename: 'cafeflow-orders.csv',
  },
  {
    id: 'customers',
    title: 'Customers',
    description: 'Export customer list with contact details and visit history.',
    format: 'CSV',
    icon: 'Users',
    filename: 'cafeflow-customers.csv',
  },
  {
    id: 'menu',
    title: 'Menu Items',
    description: 'Export menu items with categories, prices and availability.',
    format: 'CSV',
    icon: 'BookOpen',
    filename: 'cafeflow-menu-items.csv',
  },
  {
    id: 'loyalty',
    title: 'Loyalty Records',
    description: 'Export loyalty members and their points history.',
    format: 'CSV',
    icon: 'Star',
    filename: 'cafeflow-loyalty-records.csv',
  },
  {
    id: 'promotions',
    title: 'Promotions',
    description: 'Export all created promotions and usage details.',
    format: 'CSV',
    icon: 'Tag',
    filename: 'cafeflow-promotions.csv',
  },
  {
    id: 'sales',
    title: 'Sales Summary',
    description: 'Export daily/monthly sales summary with tax details.',
    format: 'CSV',
    icon: 'BarChart2',
    filename: 'cafeflow-sales-summary.csv',
  },
]

// Mock datasets for rich, authentic CSV export generation
export const MOCK_ORDERS_DATA = [
  { id: 'ORD-101', customer: 'Aarav Sharma', table: 'Table 4', type: 'Dine In', items: '2x Cappuccino, 1x Croissant', subtotal: 480, tax: 24, discount: 0, total: 504, payment: 'UPI', status: 'Served', date: '2026-10-13 10:15' },
  { id: 'ORD-102', customer: 'Priya Mehta', table: 'Table 2', type: 'Dine In', items: '1x Cold Brew, 1x Classic Burger', subtotal: 390, tax: 19.5, discount: 40, total: 369.5, payment: 'Credit Card', status: 'Served', date: '2026-10-13 10:30' },
  { id: 'ORD-103', customer: 'Rohan Patel', table: 'Takeaway', type: 'Takeaway', items: '3x Espresso, 2x Muffin', subtotal: 580, tax: 29, discount: 0, total: 609, payment: 'Cash', status: 'Completed', date: '2026-10-13 11:05' },
  { id: 'ORD-104', customer: 'Ananya Verma', table: 'Table 6', type: 'Dine In', items: '1x Caramel Latte, 1x Cheesecake', subtotal: 440, tax: 22, discount: 50, total: 412, payment: 'UPI', status: 'Served', date: '2026-10-13 11:40' },
  { id: 'ORD-105', customer: 'Karan Desai', table: 'Table 1', type: 'Dine In', items: '2x Flat White, 1x Sourdough Toast', subtotal: 490, tax: 24.5, discount: 0, total: 514.5, payment: 'UPI', status: 'Served', date: '2026-10-13 12:15' },
  { id: 'ORD-106', customer: 'Sneha Joshi', table: 'Takeaway', type: 'Takeaway', items: '1x Iced Mocha, 1x Chocolate Brownie', subtotal: 360, tax: 18, discount: 0, total: 378, payment: 'Debit Card', status: 'Completed', date: '2026-10-13 12:50' },
  { id: 'ORD-107', customer: 'Vikram Singh', table: 'Table 8', type: 'Dine In', items: '1x Margherita Pizza, 2x Peach Ice Tea', subtotal: 620, tax: 31, discount: 60, total: 591, payment: 'Credit Card', status: 'Served', date: '2026-10-13 13:20' },
  { id: 'ORD-108', customer: 'Neha Nair', table: 'Table 3', type: 'Dine In', items: '2x Cappuccino, 1x Pasta Alfredo', subtotal: 580, tax: 29, discount: 0, total: 609, payment: 'UPI', status: 'Served', date: '2026-10-13 13:45' },
]

export const MOCK_CUSTOMERS_DATA = [
  { id: 'CUST-001', name: 'Aarav Sharma', phone: '+91 98765 43210', email: 'aarav.sharma@gmail.com', visits: 24, totalSpent: 9680, lastVisit: '2026-10-13', tier: 'Gold', points: 420 },
  { id: 'CUST-002', name: 'Priya Mehta', phone: '+91 87654 32109', email: 'priya.mehta@yahoo.com', visits: 18, totalSpent: 7240, lastVisit: '2026-10-13', tier: 'Silver', points: 280 },
  { id: 'CUST-003', name: 'Rohan Patel', phone: '+91 76543 21098', email: 'rohan.patel@outlook.com', visits: 31, totalSpent: 14850, lastVisit: '2026-10-12', tier: 'Platinum', points: 890 },
  { id: 'CUST-004', name: 'Ananya Verma', phone: '+91 99887 66554', email: 'ananya.v@gmail.com', visits: 12, totalSpent: 4920, lastVisit: '2026-10-11', tier: 'Bronze', points: 150 },
  { id: 'CUST-005', name: 'Karan Desai', phone: '+91 98112 33445', email: 'karan.desai@gmail.com', visits: 9, totalSpent: 3820, lastVisit: '2026-10-13', tier: 'Bronze', points: 90 },
  { id: 'CUST-006', name: 'Sneha Joshi', phone: '+91 97223 44556', email: 'sneha.j@hotmail.com', visits: 22, totalSpent: 8750, lastVisit: '2026-10-10', tier: 'Gold', points: 340 },
]

export const MOCK_MENU_ITEMS_DATA = [
  { id: 'MENU-01', name: 'Espresso', category: 'Coffee', price: 140, taxRate: '5%', inStock: 'Yes', prepTime: '3 mins', isVeg: 'Yes' },
  { id: 'MENU-02', name: 'Cappuccino', category: 'Coffee', price: 180, taxRate: '5%', inStock: 'Yes', prepTime: '4 mins', isVeg: 'Yes' },
  { id: 'MENU-03', name: 'Flat White', category: 'Coffee', price: 210, taxRate: '5%', inStock: 'Yes', prepTime: '4 mins', isVeg: 'Yes' },
  { id: 'MENU-04', name: 'Cold Brew Reserve', category: 'Coffee', price: 230, taxRate: '5%', inStock: 'Yes', prepTime: '2 mins', isVeg: 'Yes' },
  { id: 'MENU-05', name: 'Classic Burger', category: 'Food', price: 220, taxRate: '5%', inStock: 'Yes', prepTime: '12 mins', isVeg: 'Yes' },
  { id: 'MENU-06', name: 'Pasta Alfredo', category: 'Food', price: 260, taxRate: '5%', inStock: 'Yes', prepTime: '15 mins', isVeg: 'Yes' },
  { id: 'MENU-07', name: 'Margherita Pizza', category: 'Food', price: 320, taxRate: '5%', inStock: 'Yes', prepTime: '18 mins', isVeg: 'Yes' },
  { id: 'MENU-08', name: 'Chocolate Croissant', category: 'Bakery', price: 160, taxRate: '5%', inStock: 'Yes', prepTime: '2 mins', isVeg: 'Yes' },
  { id: 'MENU-09', name: 'New York Cheesecake', category: 'Desserts', price: 240, taxRate: '5%', inStock: 'Yes', prepTime: '2 mins', isVeg: 'Yes' },
]

export const MOCK_LOYALTY_DATA = [
  { memberId: 'LOY-1001', name: 'Aarav Sharma', phone: '+91 98765 43210', tier: 'Gold', totalEarned: 840, redeemed: 420, balance: 420, since: '2026-02-15' },
  { memberId: 'LOY-1002', name: 'Priya Mehta', phone: '+91 87654 32109', tier: 'Silver', totalEarned: 480, redeemed: 200, balance: 280, since: '2026-03-20' },
  { memberId: 'LOY-1003', name: 'Rohan Patel', phone: '+91 76543 21098', tier: 'Platinum', totalEarned: 1450, redeemed: 560, balance: 890, since: '2025-11-10' },
  { memberId: 'LOY-1004', name: 'Sneha Joshi', phone: '+91 97223 44556', tier: 'Gold', totalEarned: 620, redeemed: 280, balance: 340, since: '2026-04-05' },
  { memberId: 'LOY-1005', name: 'Vikram Singh', phone: '+91 98112 99887', tier: 'Silver', totalEarned: 380, redeemed: 150, balance: 230, since: '2026-05-18' },
]

export const MOCK_PROMOTIONS_DATA = [
  { code: 'WELCOME50', title: 'Welcome 50 Off', type: 'Flat Amount', value: '₹50', minOrder: '₹200', redemptions: 412, validFrom: '2026-01-01', validUntil: '2026-12-31', status: 'Active' },
  { code: 'COFFEE20', title: '20% Off Beverages', type: 'Percentage', value: '20%', minOrder: '₹150', redemptions: 685, validFrom: '2026-08-01', validUntil: '2026-10-31', status: 'Active' },
  { code: 'WEEKENDTREAT', title: 'Weekend Combo Deal', type: 'Flat Amount', value: '₹100', minOrder: '₹500', redemptions: 215, validFrom: '2026-09-01', validUntil: '2026-11-30', status: 'Active' },
  { code: 'MONSOON10', title: 'Monsoon Special', type: 'Percentage', value: '10%', minOrder: '₹250', redemptions: 148, validFrom: '2026-06-01', validUntil: '2026-08-31', status: 'Expired' },
]

export const MOCK_SALES_SUMMARY_DATA = [
  { date: '2026-10-13', orders: 48, grossSales: 16840, taxes: 842, discounts: 620, netRevenue: 17062, avgOrderValue: 355 },
  { date: '2026-10-12', orders: 62, grossSales: 22150, taxes: 1107.5, discounts: 940, netRevenue: 22317.5, avgOrderValue: 360 },
  { date: '2026-10-11', orders: 55, grossSales: 19480, taxes: 974, discounts: 750, netRevenue: 19704, avgOrderValue: 358 },
  { date: '2026-10-10', orders: 74, grossSales: 28420, taxes: 1421, discounts: 1200, netRevenue: 28641, avgOrderValue: 387 },
  { date: '2026-10-09', orders: 58, grossSales: 20600, taxes: 1030, discounts: 810, netRevenue: 20820, avgOrderValue: 359 },
  { date: '2026-10-08', orders: 49, grossSales: 17200, taxes: 860, discounts: 640, netRevenue: 17420, avgOrderValue: 355 },
]

// Utility to properly format and escape CSV field
function escapeCsvField(val) {
  if (val === null || val === undefined) return '""'
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

// Convert dataset to authentic CSV string with headers
export function generateCsvContent(type, dateRange = 'Last 30 Days') {
  let headers = []
  let rows = []

  switch (type) {
    case 'orders':
      headers = ['Order ID', 'Customer Name', 'Table', 'Order Type', 'Items', 'Subtotal (INR)', 'Tax (INR)', 'Discount (INR)', 'Total (INR)', 'Payment Method', 'Status', 'Date & Time']
      rows = MOCK_ORDERS_DATA.map((o) => [
        o.id, o.customer, o.table, o.type, o.items, o.subtotal, o.tax, o.discount, o.total, o.payment, o.status, o.date
      ])
      break

    case 'customers':
      headers = ['Customer ID', 'Full Name', 'Phone Number', 'Email Address', 'Total Visits', 'Total Spent (INR)', 'Last Visit Date', 'Loyalty Tier', 'Points Balance']
      rows = MOCK_CUSTOMERS_DATA.map((c) => [
        c.id, c.name, c.phone, c.email, c.visits, c.totalSpent, c.lastVisit, c.tier, c.points
      ])
      break

    case 'menu':
      headers = ['Item ID', 'Item Name', 'Category', 'Price (INR)', 'Tax Rate', 'In Stock', 'Preparation Time', 'Vegetarian']
      rows = MOCK_MENU_ITEMS_DATA.map((m) => [
        m.id, m.name, m.category, m.price, m.taxRate, m.inStock, m.prepTime, m.isVeg
      ])
      break

    case 'loyalty':
      headers = ['Member ID', 'Customer Name', 'Phone Number', 'Loyalty Tier', 'Total Points Earned', 'Points Redeemed', 'Available Points Balance', 'Member Since']
      rows = MOCK_LOYALTY_DATA.map((l) => [
        l.memberId, l.name, l.phone, l.tier, l.totalEarned, l.redeemed, l.balance, l.since
      ])
      break

    case 'promotions':
      headers = ['Promo Code', 'Promotion Title', 'Discount Type', 'Discount Value', 'Minimum Order (INR)', 'Total Redemptions', 'Valid From', 'Valid Until', 'Status']
      rows = MOCK_PROMOTIONS_DATA.map((p) => [
        p.code, p.title, p.type, p.value, p.minOrder, p.redemptions, p.validFrom, p.validUntil, p.status
      ])
      break

    case 'sales':
      headers = ['Date', 'Orders Count', 'Gross Sales (INR)', 'Taxes Collected (INR)', 'Discounts Given (INR)', 'Net Revenue (INR)', 'Average Order Value (INR)']
      rows = MOCK_SALES_SUMMARY_DATA.map((s) => [
        s.date, s.orders, s.grossSales, s.taxes, s.discounts, s.netRevenue, s.avgOrderValue
      ])
      break

    default:
      headers = ['ID', 'Name', 'Date']
      rows = [['1', 'Generic Record', '2026-10-13']]
  }

  const csvRows = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((r) => r.map(escapeCsvField).join(',')),
  ]

  return csvRows.join('\r\n')
}

// Download CSV file as Blob
export function downloadCsvFile(filename, csvString) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
