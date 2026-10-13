// ==========================================================================
// CAFÉFLOW OWNER PORTAL — PRINTER & TEMPLATES MOCK DATA & CONFIG
// ==========================================================================

export const INITIAL_PRINTERS = [
  {
    id: 'printer-1',
    name: 'Café Printer',
    description: 'Main counter printer',
    type: 'Thermal Printer',
    connection: 'USB',
    ipAddress: '',
    status: 'Connected',
    isDefault: true,
  },
  {
    id: 'printer-2',
    name: 'Kitchen Printer',
    description: 'For kitchen orders',
    type: 'Thermal Printer',
    connection: 'USB',
    ipAddress: '',
    status: 'Connected',
    isDefault: false,
  },
  {
    id: 'printer-3',
    name: 'Backup Printer',
    description: 'Spare printer',
    type: 'Thermal Printer',
    connection: 'Network (IP)',
    ipAddress: '192.168.1.185:9100',
    status: 'Offline',
    isDefault: false,
  },
]

// Default settings for Customer Bill / Receipt Template (matching Screenshot 2)
export const DEFAULT_CUSTOMER_TEMPLATE = {
  // Content Checkboxes
  content: {
    // Header Information
    cafeLogo: true,
    cafeName: true,
    tagline: true,
    address: true,
    phoneNumber: true,

    // Order Information
    orderNumber: true,
    tableNumber: true,
    customerName: true,
    dateTime: true,

    // Order Details
    itemName: true,
    quantity: true,
    price: true,
    variantsChoices: true,
    addOns: true,
    specialInstructions: false,

    // Bill Summary
    subtotal: true,
    discount: true,
    taxGst: true,
    total: true,
    paymentMethod: true,

    // Footer
    footerMessage: true,
  },

  // Options
  options: {
    headerTitle: 'CaféFlow',
    tagline: 'Good Food, Better Moments',
    fontSize: 'Normal', // 'Small' | 'Normal' | 'Large'
    paperWidth: '80 mm (Thermal)', // '58 mm (Thermal)' | '80 mm (Thermal)' | 'A4'
    dividerStyle: 'dashed', // 'dashed' | 'solid' | 'dotted'
    footerMessage: 'Thank you for visiting!\nVisit Again ❤️',
    showQrCode: false,
    qrCodeText: 'Scan to follow us!',
    alignment: 'center', // 'left' | 'center' | 'right'
  },
}

// Default settings for Kitchen Order Ticket Template (matching Screenshot 3)
export const DEFAULT_KITCHEN_TEMPLATE = {
  // Content Checkboxes
  content: {
    cafeLogo: false,
    cafeName: true,
    orderNumber: true,
    dateTime: true,
    tableNumber: true,
    customerName: true,
    itemName: true,
    quantity: true,
    variantsChoices: true,
    addOns: true,
    specialInstructions: true,
    preparedBy: false,
    orderType: false,
    dividerLine: true,
  },

  // Options
  options: {
    headerTitle: 'KITCHEN ORDER',
    fontSize: 'Normal', // 'Small' | 'Normal' | 'Large'
    paperWidth: '80 mm (Thermal)', // '58 mm (Thermal)' | '80 mm (Thermal)' | 'A4'
    footerMessage: 'Thank you!',
  },
}

// Sample order data for live receipt & kitchen ticket previews
export const SAMPLE_ORDER_DATA = {
  cafeName: 'CaféFlow',
  tagline: 'Good Food, Better Moments',
  address: '123 Main Street, Vadodara',
  phoneNumber: '+91 98765 43210',
  orderNumber: '#1023',
  dateTime: '02 Oct 2026 01:45 PM',
  tableNumber: 'T-05',
  customerName: 'Rahul Mehta',
  preparedBy: 'Rahul (Waiter)',
  orderType: 'Dine-In',
  paymentMethod: 'UPI',

  items: [
    {
      id: 'item-1',
      name: 'Margherita Pizza',
      quantity: 1,
      price: 220,
      total: 220,
      variants: ['Large Size', 'Extra Cheese', 'No Onion', 'Spicy'],
      addOns: [],
      specialInstructions: 'Make it well cooked',
    },
    {
      id: 'item-2',
      name: 'Cold Coffee',
      quantity: 2,
      price: 120,
      total: 240,
      variants: ['Regular', 'Chocolate Syrup', 'With Ice'],
      addOns: [],
      specialInstructions: '',
    },
    {
      id: 'item-3',
      name: 'French Fries',
      quantity: 1,
      price: 80,
      total: 80,
      variants: [],
      addOns: ['Cheese Dip'],
      specialInstructions: 'Less Salt',
    },
  ],

  subtotal: 540,
  discount: 54, // 10%
  discountPercent: 10,
  taxGst: 24, // 5%
  taxPercent: 5,
  total: 510,
}

// LocalStorage Keys
export const STORAGE_KEYS = {
  PRINTERS: 'cafeflow_printers_list',
  CUSTOMER_TEMPLATE: 'cafeflow_customer_receipt_template',
  KITCHEN_TEMPLATE: 'cafeflow_kitchen_order_template',
}

// Helper to load Printers
export function loadPrinters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRINTERS)
    if (!raw) return INITIAL_PRINTERS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PRINTERS
  } catch (e) {
    console.error('Error loading printers:', e)
    return INITIAL_PRINTERS
  }
}

// Helper to save Printers
export function savePrinters(printers) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRINTERS, JSON.stringify(printers))
  } catch (e) {
    console.error('Error saving printers:', e)
  }
}

// Helper to load Customer Template
export function loadCustomerTemplate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_TEMPLATE)
    if (!raw) return DEFAULT_CUSTOMER_TEMPLATE
    const parsed = JSON.parse(raw)
    return {
      content: { ...DEFAULT_CUSTOMER_TEMPLATE.content, ...(parsed.content || {}) },
      options: { ...DEFAULT_CUSTOMER_TEMPLATE.options, ...(parsed.options || {}) },
    }
  } catch (e) {
    console.error('Error loading customer template:', e)
    return DEFAULT_CUSTOMER_TEMPLATE
  }
}

// Helper to save Customer Template
export function saveCustomerTemplate(template) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_TEMPLATE, JSON.stringify(template))
  } catch (e) {
    console.error('Error saving customer template:', e)
  }
}

// Helper to load Kitchen Template
export function loadKitchenTemplate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KITCHEN_TEMPLATE)
    if (!raw) return DEFAULT_KITCHEN_TEMPLATE
    const parsed = JSON.parse(raw)
    return {
      content: { ...DEFAULT_KITCHEN_TEMPLATE.content, ...(parsed.content || {}) },
      options: { ...DEFAULT_KITCHEN_TEMPLATE.options, ...(parsed.options || {}) },
    }
  } catch (e) {
    console.error('Error loading kitchen template:', e)
    return DEFAULT_KITCHEN_TEMPLATE
  }
}

// Helper to save Kitchen Template
export function saveKitchenTemplate(template) {
  try {
    localStorage.setItem(STORAGE_KEYS.KITCHEN_TEMPLATE, JSON.stringify(template))
  } catch (e) {
    console.error('Error saving kitchen template:', e)
  }
}
