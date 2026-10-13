// ==========================================================================
// CAFÉFLOW OWNER PORTAL — RESTAURANT PROFILE MOCK DATA & CONSTANTS
// ==========================================================================

export const DEFAULT_RESTAURANT_PROFILE = {
  basic: {
    restaurantName: 'CaféFlow',
    tagline: 'Good Food, Better Moments',
    cuisines: ['Cafe', 'Italian', 'Snacks', 'Beverages'],
    supportPhoneCode: '+91',
    supportPhone: '9876543210',
    supportEmail: 'support@cafeflow.co',
    website: 'https://www.cafeflow.co',
  },
  address: {
    searchLocation: 'New Sama Road, Vadodara',
    streetAddress: 'New Sama Road',
    addressLine2: 'Bandra West',
    country: 'India',
    state: 'Gujarat',
    city: 'Vadodara',
    postalCode: '390006',
    pinPosition: { x: 54, y: 50 },
    zoom: 15,
  },
  hours: {
    schedule: [
      { day: 'Monday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
      { day: 'Tuesday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
      { day: 'Wednesday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
      { day: 'Thursday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
      { day: 'Friday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '12:00 AM' },
      { day: 'Saturday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '12:00 AM' },
      { day: 'Sunday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
    ],
  },
  locale: {
    currency: 'INR — Indian Rupee (₹)',
    dateFormat: 'DD-MM-YYYY (26-10-2026)',
    timezone: 'Asia/Kolkata (GMT+5:30)',
    decimalPlaces: '2 (₹23.00)',
    primaryLanguage: 'English',
  },
  legal: {
    legalBusinessName: 'Spice Garden Hospitality Pvt. Ltd.',
    legalPhoneCode: '+91',
    legalPhone: '9876543210',
    taxNumberGst: '24ABCDE1234F1Z5',
    foodLicenceFssai: '10018021004567',
    addressLine1: '42, Hill Road',
    addressLine2: 'Bandra West',
    country: 'India',
    state: 'Gujarat',
    city: 'Vadodara',
    postalCode: '390006',
    businessType: 'Private Limited Company',
  },
}

export const CUISINE_OPTIONS = [
  'Cafe',
  'Italian',
  'Snacks',
  'Beverages',
  'Indian',
  'Chinese',
  'Bakery',
  'Fast Food',
  'Desserts',
  'Continental',
  'Mexican',
  'Healthy Food',
  'Street Food',
  'Thai',
]

export const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
]

export const STATE_CITY_MAP = {
  India: {
    Gujarat: ['Vadodara', 'Ahmedabad', 'Surat', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
    Delhi: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Rohini'],
    Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
    Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'],
  },
  'United States': {
    California: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers'],
    Texas: ['Houston', 'Austin', 'Dallas', 'San Antonio'],
  },
  'United Kingdom': {
    England: ['London', 'Manchester', 'Birmingham', 'Liverpool'],
    Scotland: ['Edinburgh', 'Glasgow', 'Aberdeen'],
  },
  'United Arab Emirates': {
    Dubai: ['Dubai Marina', 'Downtown Dubai', 'Deira', 'Jumeirah'],
    'Abu Dhabi': ['Abu Dhabi City', 'Al Ain'],
  },
}

export const PHONE_CODES = [
  { code: '+91', label: 'IN +91', country: 'India' },
  { code: '+1', label: 'US +1', country: 'USA' },
  { code: '+44', label: 'UK +44', country: 'UK' },
  { code: '+971', label: 'AE +971', country: 'UAE' },
  { code: '+65', label: 'SG +65', country: 'Singapore' },
  { code: '+61', label: 'AU +61', country: 'Australia' },
  { code: '+1-CA', label: 'CA +1', country: 'Canada' },
]

export const CURRENCY_OPTIONS = [
  { value: 'INR — Indian Rupee (₹)', label: 'INR — Indian Rupee (₹)', symbol: '₹' },
  { value: 'USD — US Dollar ($)', label: 'USD — US Dollar ($)', symbol: '$' },
  { value: 'EUR — Euro (€)', label: 'EUR — Euro (€)', symbol: '€' },
  { value: 'GBP — British Pound (£)', label: 'GBP — British Pound (£)', symbol: '£' },
  { value: 'AED — UAE Dirham (د.إ)', label: 'AED — UAE Dirham (د.إ)', symbol: 'د.إ' },
  { value: 'AUD — Australian Dollar (A$)', label: 'AUD — Australian Dollar (A$)', symbol: 'A$' },
]

export const DATE_FORMAT_OPTIONS = [
  'DD-MM-YYYY (26-10-2026)',
  'DD/MM/YYYY (26/10/2026)',
  'MM-DD-YYYY (10-26-2026)',
  'MM/DD/YYYY (10/26/2026)',
  'YYYY-MM-DD (2026-10-26)',
]

export const TIMEZONE_OPTIONS = [
  'Asia/Kolkata (GMT+5:30)',
  'Asia/Dubai (GMT+4:00)',
  'Europe/London (GMT+0:00)',
  'America/New_York (GMT-5:00)',
  'America/Los_Angeles (GMT-8:00)',
  'Asia/Singapore (GMT+8:00)',
  'Australia/Sydney (GMT+10:00)',
]

export const DECIMAL_PLACES_OPTIONS = [
  '0 (₹23)',
  '2 (₹23.00)',
  '3 (₹23.000)',
]

export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Gujarati',
  'Spanish',
  'French',
  'Arabic',
  'German',
]

export const BUSINESS_TYPES = [
  'Private Limited Company',
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Partnership (LLP)',
  'Public Limited Company',
  'Other',
]

export const MOCK_LOCATION_SUGGESTIONS = [
  {
    name: 'New Sama Road, Vadodara',
    street: 'New Sama Road',
    area: 'Bandra West',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    zip: '390006',
    pin: { x: 54, y: 50 },
  },
  {
    name: 'Alkapuri, Vadodara, Gujarat',
    street: 'R.C. Dutt Road, Alkapuri',
    area: 'Alkapuri',
    city: 'Vadodara',
    state: 'Gujarat',
    country: 'India',
    zip: '390007',
    pin: { x: 40, y: 45 },
  },
  {
    name: 'Hill Road, Bandra West, Mumbai',
    street: '42, Hill Road',
    area: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    zip: '400050',
    pin: { x: 62, y: 38 },
  },
  {
    name: 'Connaught Place, New Delhi',
    street: 'Block B, Inner Circle',
    area: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    zip: '110001',
    pin: { x: 50, y: 55 },
  },
  {
    name: '100ft Road, Indiranagar, Bengaluru',
    street: '100 Feet Road',
    area: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zip: '560038',
    pin: { x: 46, y: 58 },
  },
]

export const TIME_SLOTS = [
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
  '12:00 AM',
  '12:30 AM',
  '01:00 AM',
  '01:30 AM',
  '02:00 AM',
]
