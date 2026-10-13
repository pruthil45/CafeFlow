// ==========================================================================
// CAFÉFLOW OWNER PORTAL — SETTINGS MODULE MOCK DATA
// ==========================================================================

// 1. Settings Overview Section Cards (matching Screenshot 2)
export const SETTINGS_SECTIONS = [
  {
    id: 'restaurant',
    title: 'RESTAURANT',
    cards: [
      {
        id: 'profile',
        title: 'Restaurant Profile',
        description: 'Name, cuisine type, contact details, address and legal info',
        icon: 'Store',
        path: '/owner/settings/profile',
      },
      {
        id: 'appearance',
        title: 'Appearance',
        description: 'Logo, colors, theme and storefront look & feel',
        icon: 'Palette',
        path: '/owner/settings/appearance',
      },
    ],
  },
  {
    id: 'operations',
    title: 'OPERATIONS',
    cards: [
      {
        id: 'operations-cfg',
        title: 'Operations',
        description: 'Order flow, preparation time, sounds and general settings',
        icon: 'Sliders',
        path: '/owner/settings/operations',
      },
      {
        id: 'printers',
        title: 'Printers & Templates',
        description: 'Kitchen printers, receipt templates and print settings',
        icon: 'Printer',
        path: '/owner/settings/printers',
      },
      {
        id: 'taxation',
        title: 'Taxation',
        description: 'Configure tax rates and service charges',
        icon: 'Receipt',
        path: '/owner/settings/taxation',
      },
      {
        id: 'staff',
        title: 'Staff',
        description: 'Manage staff, roles and access permissions',
        icon: 'Users',
        path: '/owner/settings/staff',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'NOTIFICATIONS',
    cards: [
      {
        id: 'notifications-cfg',
        title: 'Notifications',
        description: 'Email/SMS templates and alert preferences',
        icon: 'Bell',
        path: '/owner/settings/notifications',
      },
    ],
  },
  {
    id: 'data-management',
    title: 'DATA MANAGEMENT',
    cards: [
      {
        id: 'data-management',
        title: 'Data Management',
        description: 'Export and backup your café data',
        icon: 'Database',
        path: '/owner/settings/data-management',
      },
    ],
  },
]

// 2. Initial Appearance Settings (matching Screenshot 1)
export const DEFAULT_APPEARANCE_SETTINGS = {
  cafeName: 'Café Aroma',
  logoImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=120&auto=format&fit=crop&q=80',
  headerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&auto=format&fit=crop&q=80',
  brandColor: '#B84513',
  sidebarBg: '#3B1F14',
  sidebarTextColor: 'light', // 'light' | 'dark'
  activeMenuChoice: 'brand', // 'brand' | 'custom'
  customActiveColor: '#8C4A23',
  previewDevice: 'mobile', // 'mobile' | 'desktop'
}

export const PRESET_BRAND_COLORS = [
  '#B84513', // Burnt Orange
  '#D9381E', // Red-Orange
  '#EA580C', // Orange
  '#16A34A', // Green
  '#0D9488', // Teal
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#DB2777', // Pink
]

export const PRESET_SIDEBAR_COLORS = [
  '#3B1F14', // Rich Coffee
  '#2A1911', // Dark Espresso
  '#1E120C', // Deep Roasted
  '#18181B', // Zinc Dark
  '#0F172A', // Slate Midnight
  '#1E1B4B', // Indigo Dark
]

// 3. Initial Staff Members (matching Screenshot 3)
export const INITIAL_STAFF_MEMBERS = [
  {
    id: 'staff-1',
    name: 'Rahul Mehta',
    mobile: '+91 98765 43210',
    email: 'rahul.mehta@example.com',
    role: 'Waiter',
    status: 'Active',
    joined: '12 Sep 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    initials: 'RM',
    activitySummary: {
      ordersHandled: 248,
      ordersEdited: 32,
      billsGenerated: 198,
      lastActive: 'Today, 11:24 AM',
    },
    roleDescription: 'Can manage orders, update status and handle tables.',
    recentActivities: [
      { id: 'act-1', text: 'Handled Table 4 order #108 (2 items)', time: 'Today, 11:24 AM' },
      { id: 'act-2', text: 'Generated bill for Table 2 (₹1,460)', time: 'Today, 10:50 AM' },
      { id: 'act-3', text: 'Updated order #105 to Served', time: 'Today, 09:35 AM' },
    ],
  },
  {
    id: 'staff-2',
    name: 'Priya Shah',
    mobile: '+91 87654 32109',
    email: 'priya.shah@example.com',
    role: 'Cashier',
    status: 'Active',
    joined: '18 Sep 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    initials: 'PS',
    activitySummary: {
      ordersHandled: 184,
      ordersEdited: 15,
      billsGenerated: 342,
      lastActive: 'Today, 12:05 PM',
    },
    roleDescription: 'Can process bills, apply discounts and manage checkout payments.',
    recentActivities: [
      { id: 'act-4', text: 'Collected payment of ₹850 via UPI for order #112', time: 'Today, 12:05 PM' },
      { id: 'act-5', text: 'Applied 10% loyalty discount for customer Neha', time: 'Today, 11:15 AM' },
    ],
  },
  {
    id: 'staff-3',
    name: 'Amit Patel',
    mobile: '+91 76543 21098',
    email: 'amit.patel@example.com',
    role: 'Staff',
    status: 'Inactive',
    joined: '22 Aug 2026',
    avatar: null,
    initials: 'A',
    activitySummary: {
      ordersHandled: 92,
      ordersEdited: 4,
      billsGenerated: 60,
      lastActive: '22 Aug 2026, 06:15 PM',
    },
    roleDescription: 'General café floor assistance and table setup.',
    recentActivities: [
      { id: 'act-6', text: 'Shift concluded and account temporarily paused', time: '22 Aug 2026' },
    ],
  },
  {
    id: 'staff-4',
    name: 'Karan Desai',
    mobile: '+91 98760 12345',
    email: 'karan.desai@example.com',
    role: 'Waiter',
    status: 'Active',
    joined: '05 Sep 2026',
    avatar: null,
    initials: 'K',
    activitySummary: {
      ordersHandled: 210,
      ordersEdited: 28,
      billsGenerated: 165,
      lastActive: 'Today, 10:45 AM',
    },
    roleDescription: 'Can manage orders, update status and handle tables.',
    recentActivities: [
      { id: 'act-7', text: 'Assigned customer to Table 6 and placed order #109', time: 'Today, 10:45 AM' },
    ],
  },
  {
    id: 'staff-5',
    name: 'Neha Verma',
    mobile: '+91 99887 77665',
    email: 'neha.verma@example.com',
    role: 'Staff',
    status: 'Active',
    joined: '01 Sep 2026',
    avatar: null,
    initials: 'N',
    activitySummary: {
      ordersHandled: 156,
      ordersEdited: 12,
      billsGenerated: 110,
      lastActive: 'Today, 01:10 PM',
    },
    roleDescription: 'General café floor assistance and customer support.',
    recentActivities: [
      { id: 'act-8', text: 'Assisted table turnover and order confirmation', time: 'Today, 01:10 PM' },
    ],
  },
]

// 4. Initial Taxation Settings (matching Screenshot 4)
export const INITIAL_TAXATION_CONFIG = {
  isEnabled: true,
  applicationScope: 'all', // 'all', 'selected_items', 'selected_categories'
  selectedCategories: ['Beverages', 'Snacks'],
  selectedItems: ['Cappuccino', 'Classic Burger', 'Pasta Alfredo'],
  taxRates: [
    {
      id: 'tax-1',
      name: 'GST',
      rate: 5,
      applyTo: 'All Menu Items',
      status: 'Active',
    },
    {
      id: 'tax-2',
      name: 'Service Tax',
      rate: 2,
      applyTo: 'Selected Categories',
      categories: ['Beverages', 'Snacks'],
      status: 'Active',
    },
    {
      id: 'tax-3',
      name: 'VAT',
      rate: 1.5,
      applyTo: 'Selected Items',
      itemsCount: 3,
      items: ['Cappuccino', 'Classic Burger', 'Pasta Alfredo'],
      status: 'Inactive',
    },
  ],
}

// Available mock categories and items for tax scope selection
export const AVAILABLE_TAX_CATEGORIES = [
  'Beverages',
  'Snacks',
  'Burgers',
  'Pizzas',
  'Main Course',
  'Desserts',
]

export const AVAILABLE_TAX_ITEMS = [
  { id: 'item-1', name: 'Cappuccino', category: 'Beverages', price: 180 },
  { id: 'item-2', name: 'Classic Burger', category: 'Burgers', price: 220 },
  { id: 'item-3', name: 'Pasta Alfredo', category: 'Main Course', price: 260 },
  { id: 'item-4', name: 'French Fries', category: 'Snacks', price: 140 },
  { id: 'item-5', name: 'Chocolate Brownie', category: 'Desserts', price: 160 },
  { id: 'item-6', name: 'Margherita Pizza', category: 'Pizzas', price: 320 },
]
