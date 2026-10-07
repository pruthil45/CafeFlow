import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Search,
  MapPin,
  Plus,
  Minus,
  Crosshair,
  Globe,
  FileText,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Store,
  Copy,
  Edit2,
  X,
  Smartphone,
  Laptop,
  Info,
  CheckCircle2,
  AlertCircle,
  Home,
  Coffee,
  ShoppingBag,
  Heart,
  Star,
  Layers,
} from 'lucide-react';
import { saveNewCafe } from '../../../../data/adminMockData';
import './CreateCafeWizard.css';

// Default Coffee Logo SVG Data URI
const DEFAULT_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23FDF6EC'/%3E%3Cpath d='M30 42h40v20c0 8-6 14-14 14H44c-8 0-14-6-14-14V42z' fill='%238B4513'/%3E%3Cpath d='M70 48h6c4 0 7 3 7 7s-3 7-7 7h-6' stroke='%238B4513' stroke-width='4' fill='none'/%3E%3Cpath d='M40 32c1-4 3-7 6-7s4 3 4 7M50 32c1-4 3-7 6-7s4 3 4 7' stroke='%23D4A04A' stroke-width='3' stroke-linecap='round' fill='none'/%3E%3C/svg%3E";

// Default Warm Ambient Header Image Data URI
const DEFAULT_HEADER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232B1810'/%3E%3Cstop offset='50%25' stop-color='%234A2616'/%3E%3Cstop offset='100%25' stop-color='%231F0E07'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23grad)'/%3E%3Ccircle cx='200' cy='120' r='18' fill='%23F59E0B' opacity='0.3'/%3E%3Ccircle cx='600' cy='80' r='24' fill='%23FBBF24' opacity='0.35'/%3E%3Ccircle cx='950' cy='140' r='16' fill='%23F59E0B' opacity='0.3'/%3E%3Ctext x='600' y='210' fill='%23FDF6EC' font-family='serif' font-size='42' font-weight='bold' text-anchor='middle'%3EGood Food, Better Moments%3C/text%3E%3Ctext x='600' y='250' fill='%23D4A04A' font-family='sans-serif' font-size='18' letter-spacing='3' text-anchor='middle'%3EARTISANAL COFFEE &amp; GOURMET BAKES%3C/text%3E%3C/svg%3E";

const STEPS = [
  { id: 1, title: 'Basic Information', short: 'Basic Info' },
  { id: 2, title: 'Address', short: 'Address' },
  { id: 3, title: 'Opening Hours', short: 'Hours' },
  { id: 4, title: 'Locale', short: 'Locale' },
  { id: 5, title: 'Legal Information', short: 'Legal' },
  { id: 6, title: 'Appearance', short: 'Appearance' },
  { id: 7, title: 'Owner Information', short: 'Owner' },
  { id: 8, title: 'Review & Create', short: 'Review' },
];

const PRESET_BRAND_COLORS = [
  '#8B4513', // Saddle Brown
  '#C2410C', // Orange
  '#D97706', // Amber
  '#059669', // Emerald
  '#0D9488', // Teal
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#DB2777', // Pink
];

const PRESET_SIDEBAR_COLORS = [
  '#3B1F14', // Dark Coffee
  '#1C1917', // Charcoal Black
  '#0F172A', // Slate Deep
  '#1E293B', // Slate Dark
  '#18181B', // Zinc Dark
  '#2E1065', // Deep Plum
];

export default function CreateCafeWizard() {
  const navigate = useNavigate();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);
  const [validationError, setValidationError] = useState('');

  // Modals
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdCafeRecord, setCreatedCafeRecord] = useState(null);

  // File Upload Refs
  const logoInputRef = useRef(null);
  const headerInputRef = useRef(null);

  // --------------------------------------------------------------------------
  // STEP 1: Basic Information
  // --------------------------------------------------------------------------
  const [cafeName, setCafeName] = useState('Café Aroma');
  const [tagline, setTagline] = useState('A cozy café serving delicious coffee and fresh food');
  const [cuisineTags, setCuisineTags] = useState(['Café', 'Italian', 'Snacks', 'Beverages']);
  const [newCuisineInput, setNewCuisineInput] = useState('');
  const [supportPhoneCode, setSupportPhoneCode] = useState('+91');
  const [supportPhone, setSupportPhone] = useState('9876543210');
  const [supportEmail, setSupportEmail] = useState('support@cafearoma.com');
  const [website, setWebsite] = useState('https://www.cafearoma.com');

  // --------------------------------------------------------------------------
  // STEP 2: Address
  // --------------------------------------------------------------------------
  const [searchLocation, setSearchLocation] = useState('New Sama Road, Vadodara');
  const [addressLine1, setAddressLine1] = useState('New Sama Road');
  const [addressLine2, setAddressLine2] = useState('Bandra West');
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('Gujarat');
  const [cityName, setCityName] = useState('Vadodara');
  const [postalCode, setPostalCode] = useState('390006');
  const [mapZoom, setMapZoom] = useState(15);
  const [pinPosition, setPinPosition] = useState({ x: 58, y: 45 });

  // --------------------------------------------------------------------------
  // STEP 3: Opening Hours
  // --------------------------------------------------------------------------
  const [schedule, setSchedule] = useState([
    { day: 'Monday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
    { day: 'Tuesday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
    { day: 'Wednesday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
    { day: 'Thursday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
    { day: 'Friday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '12:00 AM' },
    { day: 'Saturday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '12:00 AM' },
    { day: 'Sunday', status: 'open', is24: false, openTime: '09:00 AM', closeTime: '11:00 PM' },
  ]);

  // --------------------------------------------------------------------------
  // STEP 4: Locale
  // --------------------------------------------------------------------------
  const [currency, setCurrency] = useState('INR — Indian Rupee (₹)');
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY (26-10-2026)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (GMT+5:30)');
  const [decimalPlaces, setDecimalPlaces] = useState('2 (₹23.00)');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');

  // --------------------------------------------------------------------------
  // STEP 5: Legal Information
  // --------------------------------------------------------------------------
  const [businessType, setBusinessType] = useState('Private Limited');
  const [businessName, setBusinessName] = useState('Café Aroma Pvt. Ltd.');
  const [gstNumber, setGstNumber] = useState('24ABCDE1234F1Z5');
  const [fssaiNumber, setFssaiNumber] = useState('10723999000123');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [billingEmail, setBillingEmail] = useState('billing@cafearoma.com');
  const [billingPhoneCode, setBillingPhoneCode] = useState('+91');
  const [billingPhone, setBillingPhone] = useState('9876543210');
  const [registeredAddress, setRegisteredAddress] = useState('12, New Sama Road, Vadodara, Gujarat - 390006');

  // --------------------------------------------------------------------------
  // STEP 6: Appearance
  // --------------------------------------------------------------------------
  const [logoImage, setLogoImage] = useState(DEFAULT_LOGO);
  const [headerImage, setHeaderImage] = useState(DEFAULT_HEADER);
  const [brandColor, setBrandColor] = useState('#8B4513');
  const [customHexInput, setCustomHexInput] = useState('#8B4513');
  const [sidebarBg, setSidebarBg] = useState('#3B1F14');
  const [customSidebarHex, setCustomSidebarHex] = useState('#3B1F14');
  const [sidebarTextColor, setSidebarTextColor] = useState('light'); // 'light' | 'dark'
  const [activeMenuChoice, setActiveMenuChoice] = useState('brand'); // 'brand' | 'custom'
  const [customActiveColor, setCustomActiveColor] = useState('#8B4513');
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile' | 'desktop'

  // --------------------------------------------------------------------------
  // STEP 7: Owner Information
  // --------------------------------------------------------------------------
  const [ownerName, setOwnerName] = useState('Rahul Mehta');
  const [ownerEmail, setOwnerEmail] = useState('rahul@cafearoma.com');
  const [ownerPhoneCode, setOwnerPhoneCode] = useState('+91');
  const [ownerPhone, setOwnerPhone] = useState('9876543210');
  const [ownerPassword, setOwnerPassword] = useState('CafeOwner@2026');
  const [confirmPassword, setConfirmPassword] = useState('CafeOwner@2026');
  const [sendCredentials, setSendCredentials] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Compute Active Menu Highlight Color for preview
  const resolvedActiveColor = activeMenuChoice === 'brand' ? brandColor : customActiveColor;
  const resolvedSidebarText = sidebarTextColor === 'light' ? '#f3f4f6' : '#111827';
  const resolvedSidebarMuted = sidebarTextColor === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';

  // --------------------------------------------------------------------------
  // Step Navigation & Validation
  // --------------------------------------------------------------------------
  const validateCurrentStep = (stepNumber) => {
    setValidationError('');
    if (stepNumber === 1) {
      if (!cafeName.trim()) return 'Café Name is required.';
      if (!supportPhone.trim()) return 'Support Phone is required.';
      if (!supportEmail.trim()) return 'Support Email is required.';
    }
    if (stepNumber === 2) {
      if (!addressLine1.trim()) return 'Street address is required.';
      if (!country.trim()) return 'Country is required.';
      if (!stateName.trim()) return 'State is required.';
      if (!cityName.trim()) return 'City is required.';
      if (!postalCode.trim()) return 'Postal Code is required.';
    }
    if (stepNumber === 5) {
      if (!businessName.trim()) return 'Business Name / Legal Entity is required.';
      if (!billingEmail.trim()) return 'Billing Email is required.';
      if (!billingPhone.trim()) return 'Billing Phone is required.';
    }
    if (stepNumber === 7) {
      if (!ownerName.trim()) return 'Owner Full Name is required.';
      if (!ownerEmail.trim()) return 'Owner Email is required.';
      if (!ownerPhone.trim()) return 'Owner Mobile Number is required.';
      if (!ownerPassword.trim()) return 'Password is required.';
      if (ownerPassword !== confirmPassword) return 'Passwords do not match.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateCurrentStep(currentStep);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    const nextStep = currentStep + 1;
    if (nextStep > maxCompletedStep) {
      setMaxCompletedStep(nextStep);
    }
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepJump = (stepNumber) => {
    // Only allow jumping if previous steps have been reached or is lower
    if (stepNumber <= maxCompletedStep) {
      setValidationError('');
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cuisine Tags helper
  const handleRemoveCuisine = (indexToRemove) => {
    setCuisineTags(cuisineTags.filter((_, i) => i !== indexToRemove));
  };

  const handleAddCuisine = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newCuisineInput.trim().replace(/^,+|,+$/g, '');
      if (val && !cuisineTags.includes(val)) {
        setCuisineTags([...cuisineTags, val]);
        setNewCuisineInput('');
      }
    }
  };

  // Opening hours helper
  const handleDayStatusChange = (index, newStatus) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, status: newStatus } : d))
    );
  };

  const handleDay24hToggle = (index) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, is24: !d.is24 } : d))
    );
  };

  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handleCopyDayToAll = (sourceIndex) => {
    const src = schedule[sourceIndex];
    setSchedule((prev) =>
      prev.map((d) => ({
        ...d,
        status: src.status,
        is24: src.is24,
        openTime: src.openTime,
        closeTime: src.closeTime,
      }))
    );
  };

  // Appearance Image Upload handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setHeaderImage(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Final Creation Handler
  const handleFinalCreateConfirm = () => {
    const newId = `CAF-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newOwnerId = `OWN-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newCafe = {
      id: newId,
      name: cafeName,
      logo: logoImage,
      location: `${cityName}, ${stateName}`,
      city: cityName,
      state: stateName,
      address: `${addressLine1}, ${addressLine2 ? addressLine2 + ', ' : ''}${cityName}, ${stateName} ${postalCode}`,
      cuisine: cuisineTags.join(', '),
      description: tagline,
      phone: `${supportPhoneCode} ${supportPhone}`,
      email: supportEmail,
      website: website,
      tables: 12,
      status: 'active',
      orders: 0,
      revenue: 0,
      staff: 1,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdDate: new Date().toISOString(),
      color: brandColor,
      ownerId: newOwnerId,
      ownerName: ownerName,
      ownerPhone: `${ownerPhoneCode} ${ownerPhone}`,
      ownerEmail: ownerEmail,
      rating: 5.0,
    };

    saveNewCafe(newCafe);
    setCreatedCafeRecord(newCafe);
    setShowConfirmModal(false);
    setIsCreated(true);
  };

  // --------------------------------------------------------------------------
  // SUCCESS STATE SCREEN
  // --------------------------------------------------------------------------
  if (isCreated && createdCafeRecord) {
    return (
      <div className="wizard-page">
        <div className="wizard-breadcrumb">
          <Link to="/admin/cafes" className="wizard-breadcrumb__link">
            <Home size={14} /> Cafés
          </Link>
          <span className="wizard-breadcrumb__sep">/</span>
          <span className="wizard-breadcrumb__current">Created</span>
        </div>

        <div className="wizard-content-card">
          <div className="wizard-success-view">
            <div className="wizard-success-icon-badge">
              <Check size={36} strokeWidth={3} />
            </div>
            <h1 className="wizard-success-title">Café Created Successfully</h1>
            <p className="wizard-success-desc">
              The café and owner account have been successfully created on the platform.
            </p>

            <div className="wizard-success-card">
              <div className="wizard-success-row">
                <span>Café Name</span>
                <strong>{createdCafeRecord.name}</strong>
              </div>
              <div className="wizard-success-row">
                <span>Owner</span>
                <strong>{createdCafeRecord.ownerName}</strong>
              </div>
              <div className="wizard-success-row">
                <span>Location</span>
                <strong>{createdCafeRecord.location}</strong>
              </div>
              <div className="wizard-success-row">
                <span>Status</span>
                <span className="admin-status-pill admin-status-pill--active">
                  <span className="admin-status-dot" /> Active
                </span>
              </div>
              <div className="wizard-success-row">
                <span>ID</span>
                <code>{createdCafeRecord.id}</code>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="wizard-btn-cancel"
                onClick={() => navigate('/admin/cafes')}
              >
                Back to Cafés
              </button>
              <button
                className="wizard-btn-create"
                onClick={() =>
                  navigate('/admin/cafes', {
                    state: { newCafe: createdCafeRecord },
                  })
                }
              >
                View Café in List →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN WIZARD VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="wizard-page">
      {/* Top Breadcrumbs */}
      <div className="wizard-breadcrumb">
        <Link to="/admin/cafes" className="wizard-breadcrumb__link">
          <Home size={14} /> Cafés
        </Link>
        <span className="wizard-breadcrumb__sep">/</span>
        <span className="wizard-breadcrumb__current">Create Café</span>
      </div>

      {/* Page Title & Subtitle */}
      <div className="wizard-header">
        <h1 className="wizard-header__title">Create New Café</h1>
        <p className="wizard-header__sub">Set up a new café on the platform.</p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="wizard-stepper" role="navigation" aria-label="Creation Progress">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isUpcoming = currentStep < step.id;
          const isClickable = step.id <= maxCompletedStep;

          let statusClass = 'wizard-step-item--upcoming';
          if (isActive) statusClass = 'wizard-step-item--active';
          else if (isCompleted) statusClass = 'wizard-step-item--completed';

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className={`wizard-step-item ${statusClass} ${!isClickable ? 'wizard-step-item--disabled' : ''}`}
                onClick={() => isClickable && handleStepJump(step.id)}
                title={isClickable ? `Jump to ${step.title}` : undefined}
              >
                <div className="wizard-step-item__circle">
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <span className="wizard-step-item__label">{step.title}</span>
              </div>
              {idx < STEPS.length - 1 && <div className="wizard-step-sep" />}
            </div>
          );
        })}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="wizard-error-banner">
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Form Content Card */}
      <div className="wizard-content-card">
        {/* ==================================================================
            STEP 1: BASIC INFORMATION
           ================================================================== */}
        {currentStep === 1 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">1. Basic Information</h2>
              <p className="wizard-section-sub">
                Enter the basic information and contact details for this café.
              </p>
            </div>

            <div className="wizard-form-grid">
              {/* Café Name */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Café Name <span className="wizard-label__req">*</span>
                </label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="e.g. Café Aroma"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Tagline / Description */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Tagline / Description
                  <span className="wizard-label__counter">{tagline.length}/200</span>
                </label>
                <textarea
                  className="wizard-textarea"
                  maxLength={200}
                  placeholder="A cozy café serving delicious coffee and fresh food"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              {/* Cuisine Types */}
              <div className="wizard-form-field wizard-form-field--full">
                <label className="wizard-label">
                  Cuisine Types <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-tags-container">
                  {cuisineTags.map((cuisine, idx) => (
                    <span key={idx} className="wizard-tag">
                      {cuisine}
                      <button
                        type="button"
                        className="wizard-tag__remove"
                        onClick={() => handleRemoveCuisine(idx)}
                        aria-label={`Remove ${cuisine}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="wizard-tag-input"
                    placeholder="Type cuisine & press Enter..."
                    value={newCuisineInput}
                    onChange={(e) => setNewCuisineInput(e.target.value)}
                    onKeyDown={handleAddCuisine}
                  />
                </div>
                <span className="wizard-helper-text">
                  Select the types of cuisines your café serves.
                </span>
              </div>

              {/* Support Phone */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Support Phone <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-phone-wrap">
                  <div className="wizard-country-selector">
                    <span>🇮🇳</span>
                    <span>{supportPhoneCode}</span>
                    <ChevronLeft size={12} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Support Email */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Support Email <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <Mail size={16} className="wizard-input-icon" />
                  <input
                    type="email"
                    className="wizard-input wizard-input--with-icon"
                    placeholder="support@cafearoma.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Website */}
              <div className="wizard-form-field wizard-form-field--full">
                <label className="wizard-label">Website (Optional)</label>
                <div className="wizard-input-wrap">
                  <Globe size={16} className="wizard-input-icon" />
                  <input
                    type="url"
                    className="wizard-input wizard-input--with-icon"
                    placeholder="https://www.cafearoma.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <span className="wizard-helper-text">
                  Your café's website (optional).
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 2: ADDRESS
           ================================================================== */}
        {currentStep === 2 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">2. Address</h2>
              <p className="wizard-section-sub">
                Set the café's location and address details.
              </p>
            </div>

            {/* Search Location Input */}
            <div className="wizard-form-field wizard-form-field--full" style={{ marginBottom: 14 }}>
              <label className="wizard-label">Search Location</label>
              <div className="wizard-input-wrap">
                <Search size={16} className="wizard-input-icon" />
                <input
                  type="text"
                  className="wizard-input wizard-input--with-icon"
                  placeholder="Search for your café location (e.g. New Sama Road, Vadodara)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Interactive Mock Map Area */}
            <div className="wizard-map-container">
              <svg className="wizard-map-svg" viewBox="0 0 1000 360" preserveAspectRatio="none">
                {/* Background base */}
                <rect width="1000" height="360" fill="#E8ECE9" />

                {/* Parks / Green Areas */}
                <path d="M780,20 L960,20 L960,180 L800,160 Z" fill="#C8E6C9" />
                <text x="880" y="80" fill="#2E7D32" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Ayyappa Ground
                </text>

                <path d="M830,220 L980,220 L980,340 L810,340 Z" fill="#C8E6C9" />
                <text x="900" y="290" fill="#2E7D32" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Veer Savarkar Udyan
                </text>

                {/* Blocks / Buildings */}
                <rect x="40" y="30" width="160" height="110" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
                <rect x="230" y="40" width="180" height="90" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
                <rect x="440" y="20" width="280" height="100" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />

                <rect x="30" y="220" width="180" height="110" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
                <rect x="240" y="210" width="260" height="120" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />
                <rect x="530" y="230" width="240" height="100" rx="4" fill="#F5F5F5" stroke="#E0E0E0" />

                {/* Road System */}
                {/* Main Arterial Road: New Sama Road */}
                <path d="M0,170 L1000,195" stroke="#FFFFFF" strokeWidth="32" />
                <path d="M0,170 L1000,195" stroke="#FFE082" strokeWidth="20" />
                <text x="600" y="215" fill="#5D4037" fontSize="13" fontWeight="bold" letterSpacing="1">
                  New Sama Road
                </text>

                {/* Cross Streets */}
                <path d="M210,0 L210,360" stroke="#FFFFFF" strokeWidth="20" />
                <path d="M210,0 L210,360" stroke="#FFF9C4" strokeWidth="12" />
                <text x="220" y="40" fill="#757575" fontSize="11" transform="rotate(90 220,40)">
                  Abhilasha Cross Road
                </text>

                <path d="M510,0 L510,360" stroke="#FFFFFF" strokeWidth="18" />
                <path d="M510,0 L510,360" stroke="#FFF9C4" strokeWidth="10" />

                <path d="M750,0 L750,360" stroke="#FFFFFF" strokeWidth="18" />
                <path d="M750,0 L750,360" stroke="#FFF9C4" strokeWidth="10" />

                {/* POI Markers on Map */}
                <circle cx="510" cy="270" r="7" fill="#2E7D32" />
                <text x="525" y="265" fill="#374151" fontSize="11" fontWeight="600">
                  Sama Indoor Sports Complex
                </text>

                <circle cx="750" cy="250" r="7" fill="#1565C0" />
                <text x="765" y="245" fill="#374151" fontSize="11" fontWeight="600">
                  Navyug English Medium School
                </text>

                <text x="310" y="145" fill="#757575" fontSize="11">
                  Kenya Nagar Society Rd
                </text>
              </svg>

              {/* Draggable Red Map Pin */}
              <div
                className="wizard-map-pin"
                style={{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }}
                onMouseDown={() => {
                  setPinPosition({ x: 57 + (Math.random() * 4 - 2), y: 46 + (Math.random() * 4 - 2) });
                }}
              >
                <span className="wizard-map-pin__label">{cafeName || 'Café Aroma'}</span>
                <svg width="34" height="42" viewBox="0 0 34 42" fill="none" className="wizard-map-pin__icon">
                  <path
                    d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z"
                    fill="#DC2626"
                  />
                  <circle cx="17" cy="17" r="7" fill="#7F1D1D" />
                </svg>
              </div>

              {/* Map Zoom Controls */}
              <div className="wizard-map-controls">
                <button
                  type="button"
                  className="wizard-map-control-btn"
                  onClick={() => setMapZoom((z) => Math.min(z + 1, 20))}
                  title="Zoom In"
                >
                  <Plus size={16} />
                </button>
                <button
                  type="button"
                  className="wizard-map-control-btn"
                  onClick={() => setMapZoom((z) => Math.max(z - 1, 10))}
                  title="Zoom Out"
                >
                  <Minus size={16} />
                </button>
              </div>

              {/* Locate My Location Button */}
              <button
                type="button"
                className="wizard-map-locate-btn"
                onClick={() => setPinPosition({ x: 58, y: 45 })}
                title="Reset to selected location"
              >
                <Crosshair size={18} />
              </button>

              {/* Google Watermark */}
              <div className="wizard-map-watermark">Google</div>
            </div>

            <div className="wizard-map-caption">
              <span>Drag the pin to fine-tune the location</span>
              <Info size={14} />
            </div>

            {/* Address Form Inputs */}
            <div className="wizard-form-grid">
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Address Line 1 (Street Address) <span className="wizard-label__req">*</span>
                </label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="New Sama Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
                <span className="wizard-helper-text">
                  House/Building name, street, area
                </span>
              </div>

              <div className="wizard-form-field">
                <label className="wizard-label">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="Bandra West"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Apartment, suite, floor, landmark (optional)
                </span>
              </div>

              <div className="wizard-form-field">
                <label className="wizard-label">
                  Country <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="India">India</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div className="wizard-form-field">
                <label className="wizard-label">
                  State <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>

              <div className="wizard-form-field">
                <label className="wizard-label">
                  City <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                >
                  <option value="Vadodara">Vadodara</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div className="wizard-form-field">
                <label className="wizard-label">
                  Postal Code <span className="wizard-label__req">*</span>
                </label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="390006"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Enter PIN code for this location
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 3: OPENING HOURS
           ================================================================== */}
        {currentStep === 3 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">3. Opening Hours</h2>
              <p className="wizard-section-sub">
                Set your café's operating hours. These hours apply to all services.
              </p>
            </div>

            <div className="wizard-hours-table-wrap">
              <table className="wizard-hours-table">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>Day</th>
                    <th style={{ width: '18%' }}>Status</th>
                    <th style={{ width: '16%' }}>24 Hours</th>
                    <th style={{ width: '22%' }}>Opening Time</th>
                    <th style={{ width: '22%' }}>Closing Time</th>
                    <th style={{ width: '6%', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, idx) => (
                    <tr key={item.day}>
                      <td className="wizard-hours-day">{item.day}</td>
                      <td>
                        <select
                          className={`wizard-status-select ${item.status === 'closed' ? 'wizard-status-select--closed' : ''}`}
                          value={item.status}
                          onChange={(e) => handleDayStatusChange(idx, e.target.value)}
                        >
                          <option value="open">● Open</option>
                          <option value="closed">● Closed</option>
                        </select>
                      </td>
                      <td>
                        <label className="wizard-switch">
                          <input
                            type="checkbox"
                            checked={item.is24}
                            onChange={() => handleDay24hToggle(idx)}
                            disabled={item.status === 'closed'}
                          />
                          <span className="wizard-slider" />
                        </label>
                      </td>
                      <td>
                        <select
                          className="wizard-time-select"
                          value={item.openTime}
                          onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                          disabled={item.status === 'closed' || item.is24}
                        >
                          <option value="07:00 AM">07:00 AM</option>
                          <option value="08:00 AM">08:00 AM</option>
                          <option value="08:30 AM">08:30 AM</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </td>
                      <td>
                        <select
                          className="wizard-time-select"
                          value={item.closeTime}
                          onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                          disabled={item.status === 'closed' || item.is24}
                        >
                          <option value="09:00 PM">09:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                          <option value="10:30 PM">10:30 PM</option>
                          <option value="11:00 PM">11:00 PM</option>
                          <option value="11:30 PM">11:30 PM</option>
                          <option value="12:00 AM">12:00 AM</option>
                          <option value="01:00 AM">01:00 AM</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="wizard-action-icon-btn"
                          title="Copy these hours to all other days"
                          onClick={() => handleCopyDayToAll(idx)}
                        >
                          <Copy size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note banner & Copy Monday button */}
            <div className="wizard-hours-note-bar">
              <div className="wizard-hours-note-text">
                <Info size={16} />
                <span>
                  <strong>Note:</strong> These hours will be used for receipts and internal reference only.
                </span>
              </div>
              <button
                type="button"
                className="wizard-copy-monday-btn"
                onClick={() => handleCopyDayToAll(0)}
              >
                <Copy size={15} /> Copy Monday to All
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 4: LOCALE SETTINGS
           ================================================================== */}
        {currentStep === 4 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">4. Locale Settings</h2>
              <p className="wizard-section-sub">
                Configure your café's currency, date/time format and language preferences.
              </p>
            </div>

            {/* Information Callout Banner */}
            <div className="wizard-info-callout">
              <div className="wizard-info-callout__icon">
                <Globe size={22} />
              </div>
              <div>
                <div className="wizard-info-callout__title">Locale Settings</div>
                <p className="wizard-info-callout__text">
                  These settings will be used across the café for orders, reports and system time.
                </p>
              </div>
            </div>

            <div className="wizard-form-grid wizard-form-grid--3col">
              {/* Currency */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Currency <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR — Indian Rupee (₹)">INR — Indian Rupee (₹)</option>
                  <option value="USD — US Dollar ($)">USD — US Dollar ($)</option>
                  <option value="AED — UAE Dirham (AED)">AED — UAE Dirham (AED)</option>
                  <option value="EUR — Euro (€)">EUR — Euro (€)</option>
                  <option value="GBP — British Pound (£)">GBP — British Pound (£)</option>
                </select>
                <span className="wizard-helper-text">
                  This currency will be used across the system.
                </span>
              </div>

              {/* Date Format */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Date Format <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="DD-MM-YYYY (26-10-2026)">DD-MM-YYYY (26-10-2026)</option>
                  <option value="MM-DD-YYYY (10-26-2026)">MM-DD-YYYY (10-26-2026)</option>
                  <option value="YYYY-MM-DD (2026-10-26)">YYYY-MM-DD (2026-10-26)</option>
                  <option value="DD/MM/YYYY (26/10/2026)">DD/MM/YYYY (26/10/2026)</option>
                </select>
                <span className="wizard-helper-text">
                  Choose how dates are displayed.
                </span>
              </div>

              {/* Timezone */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Timezone <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                  <option value="Asia/Dubai (GMT+4:00)">Asia/Dubai (GMT+4:00)</option>
                  <option value="Europe/London (GMT+0:00)">Europe/London (GMT+0:00)</option>
                  <option value="America/New_York (GMT-5:00)">America/New_York (GMT-5:00)</option>
                  <option value="Asia/Singapore (GMT+8:00)">Asia/Singapore (GMT+8:00)</option>
                </select>
                <span className="wizard-helper-text">
                  Used for orders, reports and system time.
                </span>
              </div>

              {/* Decimal Places */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Decimal Places <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={decimalPlaces}
                  onChange={(e) => setDecimalPlaces(e.target.value)}
                >
                  <option value="2 (₹23.00)">2 (₹23.00)</option>
                  <option value="0 (₹23)">0 (₹23)</option>
                  <option value="3 (₹23.000)">3 (₹23.000)</option>
                </select>
                <span className="wizard-helper-text">
                  Number of digits to show after decimal.
                </span>
              </div>

              {/* Primary Language */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Primary Language <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={primaryLanguage}
                  onChange={(e) => setPrimaryLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Spanish">Spanish (Español)</option>
                </select>
                <span className="wizard-helper-text">
                  Default language for your café dashboard and storefront.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 5: LEGAL INFORMATION
           ================================================================== */}
        {currentStep === 5 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">5. Legal Information</h2>
              <p className="wizard-section-sub">
                Enter the legal and registration details for this café.
              </p>
            </div>

            {/* Information Callout Banner */}
            <div className="wizard-info-callout">
              <div className="wizard-info-callout__icon">
                <FileText size={22} />
              </div>
              <div>
                <div className="wizard-info-callout__title">Legal Information</div>
                <p className="wizard-info-callout__text">
                  These details are used for official records, invoices and compliance purposes.
                </p>
              </div>
            </div>

            <div className="wizard-form-grid">
              {/* Business Type */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Business Type <span className="wizard-label__req">*</span>
                </label>
                <select
                  className="wizard-select"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="Private Limited">Private Limited</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Business Name / Legal Entity */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Business Name / Legal Entity <span className="wizard-label__req">*</span>
                </label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="Café Aroma Pvt. Ltd."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              {/* GST Number */}
              <div className="wizard-form-field">
                <label className="wizard-label">GST Number (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="24ABCDE1234F1Z5"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Leave empty if not applicable.
                </span>
              </div>

              {/* FSSAI License Number */}
              <div className="wizard-form-field">
                <label className="wizard-label">FSSAI License Number (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="10723999000123"
                  value={fssaiNumber}
                  onChange={(e) => setFssaiNumber(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Leave empty if not applicable.
                </span>
              </div>

              {/* PAN Number */}
              <div className="wizard-form-field">
                <label className="wizard-label">PAN Number (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Leave empty if not applicable.
                </span>
              </div>

              {/* Billing Email */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Billing Email <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <Mail size={16} className="wizard-input-icon" />
                  <input
                    type="email"
                    className="wizard-input wizard-input--with-icon"
                    placeholder="billing@cafearoma.com"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                  />
                </div>
                <span className="wizard-helper-text">
                  Used for invoices and official communication.
                </span>
              </div>

              {/* Billing Phone */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Billing Phone <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-phone-wrap">
                  <div className="wizard-country-selector">
                    <span>🇮🇳</span>
                    <span>{billingPhoneCode}</span>
                    <ChevronLeft size={12} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={billingPhone}
                    onChange={(e) => setBillingPhone(e.target.value)}
                  />
                </div>
                <span className="wizard-helper-text">
                  Used for invoices and official communication.
                </span>
              </div>

              {/* Registered Address */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Registered Address (Optional)
                  <span className="wizard-label__counter">{registeredAddress.length}/200</span>
                </label>
                <textarea
                  className="wizard-textarea"
                  maxLength={200}
                  placeholder="12, New Sama Road, Vadodara, Gujarat - 390006"
                  value={registeredAddress}
                  onChange={(e) => setRegisteredAddress(e.target.value)}
                />
                <span className="wizard-helper-text">
                  Official registered address for your business.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 6: APPEARANCE & LIVE PREVIEW
           ================================================================== */}
        {currentStep === 6 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">6. Appearance</h2>
              <p className="wizard-section-sub">
                Customize how this café looks across the platform.
              </p>
            </div>

            <div className="wizard-appearance-grid">
              {/* Left Column: Appearance Controls */}
              <div className="wizard-appearance-controls">
                {/* 1. Logo */}
                <div>
                  <div className="wizard-appearance-block__title">1. Logo</div>
                  <p className="wizard-appearance-block__sub">
                    Upload your restaurant logo. This will be used in the sidebar, menu and customer pages.
                  </p>

                  <div className="wizard-logo-preview-box">
                    <img src={logoImage} alt="Logo Preview" className="wizard-logo-img" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4b5563', marginTop: 4 }}>
                      {cafeName || 'CaféFlow'}
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <div className="wizard-logo-actions">
                    <button
                      type="button"
                      className="admin-btn-outline"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload size={14} /> Change Logo
                    </button>
                    <button
                      type="button"
                      className="admin-btn-outline"
                      style={{ color: '#ef4444', borderColor: '#fecaca' }}
                      onClick={() => setLogoImage(DEFAULT_LOGO)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                  <span className="wizard-helper-text">
                    Recommended: 200 × 200 px (1:1) PNG, JPG or SVG with transparent background.
                  </span>
                </div>

                {/* 2. Header Image */}
                <div>
                  <div className="wizard-appearance-block__title">2. Header Image</div>
                  <p className="wizard-appearance-block__sub">
                    Upload a header image for your restaurant. This will be shown on customer menu and profile page.
                  </p>

                  <div
                    className="wizard-header-preview-box"
                    style={{ backgroundImage: `url("${headerImage}")` }}
                  >
                    <button
                      type="button"
                      className="admin-btn-outline wizard-header-overlay-btn"
                      onClick={() => headerInputRef.current?.click()}
                    >
                      <Upload size={13} /> Change Image
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={headerInputRef}
                    onChange={handleHeaderUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  <span className="wizard-helper-text">
                    Recommended: 1920 × 600 px (16:5) JPG or PNG, Max 2MB.
                  </span>
                </div>

                {/* 3. Brand Color */}
                <div>
                  <div className="wizard-appearance-block__title">3. Brand Color</div>
                  <p className="wizard-appearance-block__sub">
                    Choose your brand color. This color will be used for accents and highlights.
                  </p>

                  <div className="wizard-swatches-row">
                    {PRESET_BRAND_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        className={`wizard-color-swatch ${brandColor.toLowerCase() === hex.toLowerCase() ? 'wizard-color-swatch--selected' : ''}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => {
                          setBrandColor(hex);
                          setCustomHexInput(hex);
                        }}
                      />
                    ))}
                  </div>

                  <div className="wizard-custom-hex-row">
                    <span
                      className="wizard-hex-preview-dot"
                      style={{ backgroundColor: brandColor }}
                    />
                    <input
                      type="text"
                      className="wizard-hex-input"
                      value={customHexInput}
                      onChange={(e) => {
                        setCustomHexInput(e.target.value);
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          setBrandColor(e.target.value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      onClick={() => {
                        if (/^#[0-9A-Fa-f]{6}$/.test(customHexInput)) {
                          setBrandColor(customHexInput);
                        }
                      }}
                    >
                      Save Color
                    </button>
                  </div>
                </div>

                {/* 4. Sidebar Appearance */}
                <div>
                  <div className="wizard-appearance-block__title">4. Sidebar Appearance</div>
                  <p className="wizard-appearance-block__sub">
                    Customize the sidebar colors and text for the owner/staff panel.
                  </p>

                  {/* Sidebar Background */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="wizard-label" style={{ fontSize: '0.82rem' }}>
                      Sidebar Background Color
                    </label>
                    <div className="wizard-swatches-row">
                      {PRESET_SIDEBAR_COLORS.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          className={`wizard-color-swatch ${sidebarBg.toLowerCase() === hex.toLowerCase() ? 'wizard-color-swatch--selected' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => {
                            setSidebarBg(hex);
                            setCustomSidebarHex(hex);
                          }}
                        />
                      ))}
                    </div>
                    <div className="wizard-custom-hex-row">
                      <span
                        className="wizard-hex-preview-dot"
                        style={{ backgroundColor: sidebarBg }}
                      />
                      <input
                        type="text"
                        className="wizard-hex-input"
                        value={customSidebarHex}
                        onChange={(e) => {
                          setCustomSidebarHex(e.target.value);
                          if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                            setSidebarBg(e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Sidebar Text Color */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="wizard-label" style={{ fontSize: '0.82rem' }}>
                      Sidebar Text Color
                    </label>
                    <div className="wizard-radio-group">
                      <label className="wizard-radio-label">
                        <input
                          type="radio"
                          name="sidebarTextColor"
                          checked={sidebarTextColor === 'light'}
                          onChange={() => setSidebarTextColor('light')}
                        />
                        <span>Light (White)</span>
                      </label>
                      <label className="wizard-radio-label">
                        <input
                          type="radio"
                          name="sidebarTextColor"
                          checked={sidebarTextColor === 'dark'}
                          onChange={() => setSidebarTextColor('dark')}
                        />
                        <span>Dark (Black)</span>
                      </label>
                    </div>
                  </div>

                  {/* Active Menu Color */}
                  <div>
                    <label className="wizard-label" style={{ fontSize: '0.82rem' }}>
                      Active Menu Color
                    </label>
                    <div className="wizard-radio-group">
                      <label className="wizard-radio-label">
                        <input
                          type="radio"
                          name="activeMenuChoice"
                          checked={activeMenuChoice === 'brand'}
                          onChange={() => setActiveMenuChoice('brand')}
                        />
                        <span>Use Brand Color</span>
                      </label>
                      <label className="wizard-radio-label">
                        <input
                          type="radio"
                          name="activeMenuChoice"
                          checked={activeMenuChoice === 'custom'}
                          onChange={() => setActiveMenuChoice('custom')}
                        />
                        <span>Custom Color</span>
                      </label>
                    </div>

                    {activeMenuChoice === 'custom' && (
                      <div className="wizard-custom-hex-row" style={{ marginTop: 10 }}>
                        <span
                          className="wizard-hex-preview-dot"
                          style={{ backgroundColor: customActiveColor }}
                        />
                        <input
                          type="text"
                          className="wizard-hex-input"
                          value={customActiveColor}
                          onChange={(e) => setCustomActiveColor(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Preview */}
              <div className="wizard-live-preview-panel">
                <div className="wizard-live-preview-header">
                  <div>
                    <h3 className="wizard-live-preview-title">
                      <Eye size={18} color="#8B4513" /> Live Preview
                    </h3>
                    <p className="wizard-live-preview-sub">
                      See how your café will look for customers and staff across devices.
                    </p>
                  </div>

                  <div className="wizard-view-tabs">
                    <button
                      type="button"
                      className={`wizard-view-tab ${previewDevice === 'mobile' ? 'wizard-view-tab--active' : ''}`}
                      onClick={() => setPreviewDevice('mobile')}
                    >
                      <Smartphone size={13} /> Mobile View
                    </button>
                    <button
                      type="button"
                      className={`wizard-view-tab ${previewDevice === 'desktop' ? 'wizard-view-tab--active' : ''}`}
                      onClick={() => setPreviewDevice('desktop')}
                    >
                      <Laptop size={13} /> Desktop View
                    </button>
                  </div>
                </div>

                {/* Dual Previews Layout */}
                <div className="wizard-dual-previews">
                  {/* Preview 1: Customer View (Mobile Phone Mockup) */}
                  <div>
                    <div className="wizard-preview-col-title">Customer View (Mobile)</div>
                    <div className="wizard-phone-frame">
                      {/* Phone status bar */}
                      <div className="wizard-phone-status-bar">
                        <span>9:41</span>
                        <div className="wizard-phone-notch" />
                        <span>5G 100%</span>
                      </div>

                      {/* Phone Header Banner Image */}
                      <div
                        className="wizard-phone-header-img"
                        style={{ backgroundImage: `url("${headerImage}")` }}
                      >
                        <div className="wizard-phone-header-overlay">
                          <ChevronLeft size={14} />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Search size={12} />
                            <Heart size={12} />
                          </div>
                        </div>
                      </div>

                      {/* Store Card Overlay */}
                      <div className="wizard-phone-store-card">
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <img
                            src={logoImage}
                            alt="Logo"
                            style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain' }}
                          />
                          <div>
                            <div className="wizard-phone-store-name">{cafeName || 'CaféFlow'}</div>
                            <div className="wizard-phone-store-sub">
                              {cuisineTags.slice(0, 3).join(' • ')}
                            </div>
                          </div>
                        </div>

                        <div className="wizard-phone-meta-row">
                          <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Star size={10} fill="#d97706" /> 4.8 (1.2K+)
                          </span>
                          <span style={{ color: '#059669' }}>● Open</span>
                          <span style={{ color: '#6b7280' }}>09:00 AM - 11:00 PM</span>
                        </div>
                      </div>

                      {/* Categories filter pills */}
                      <div className="wizard-phone-cat-pills">
                        <span
                          className="wizard-phone-pill wizard-phone-pill--active"
                          style={{ backgroundColor: brandColor }}
                        >
                          All
                        </span>
                        <span className="wizard-phone-pill">Coffee</span>
                        <span className="wizard-phone-pill">Snacks</span>
                        <span className="wizard-phone-pill">Burgers</span>
                        <span className="wizard-phone-pill">Desserts</span>
                      </div>

                      {/* Popular Items section */}
                      <div className="wizard-phone-section-title">
                        <span>Popular Items</span>
                        <span style={{ color: brandColor, fontSize: '0.62rem', cursor: 'pointer' }}>
                          View All →
                        </span>
                      </div>

                      <div className="wizard-phone-items-grid">
                        <div className="wizard-phone-mini-item">
                          <div
                            className="wizard-phone-item-img"
                            style={{
                              backgroundColor: '#EFEBE9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Coffee size={18} color="#8B4513" />
                          </div>
                          <div className="wizard-phone-item-name">Cappuccino</div>
                          <div className="wizard-phone-item-price" style={{ color: brandColor }}>
                            ₹180
                          </div>
                        </div>

                        <div className="wizard-phone-mini-item">
                          <div
                            className="wizard-phone-item-img"
                            style={{
                              backgroundColor: '#FFF8E1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ShoppingBag size={18} color="#D97706" />
                          </div>
                          <div className="wizard-phone-item-name">Classic Burger</div>
                          <div className="wizard-phone-item-price" style={{ color: brandColor }}>
                            ₹220
                          </div>
                        </div>

                        <div className="wizard-phone-mini-item">
                          <div
                            className="wizard-phone-item-img"
                            style={{
                              backgroundColor: '#F3E5F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Layers size={18} color="#7C3AED" />
                          </div>
                          <div className="wizard-phone-item-name">Pasta Alfredo</div>
                          <div className="wizard-phone-item-price" style={{ color: brandColor }}>
                            ₹260
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview 2: Sidebar Preview (Owner/Staff) */}
                  <div>
                    <div className="wizard-preview-col-title">Sidebar Preview (Staff)</div>
                    <div
                      className="wizard-sidebar-preview-frame"
                      style={{ backgroundColor: sidebarBg, color: resolvedSidebarText }}
                    >
                      {/* Sidebar Header */}
                      <div className="wizard-sb-header">
                        <div className="wizard-sb-brand">
                          <img
                            src={logoImage}
                            alt="Logo"
                            style={{ width: 18, height: 18, borderRadius: 3, objectFit: 'contain' }}
                          />
                          <span>{cafeName || 'CaféFlow'}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>«</span>
                      </div>

                      {/* Active Dashboard item */}
                      <div
                        className="wizard-sb-item wizard-sb-item--active"
                        style={{ backgroundColor: resolvedActiveColor }}
                      >
                        <Home size={13} />
                        <span>Dashboard</span>
                      </div>

                      {/* Other nav items */}
                      {['Orders', 'Menu', 'Tables', 'Customers', 'Loyalty', 'Promotions', 'Reports', 'Settings'].map(
                        (item) => (
                          <div
                            key={item}
                            className="wizard-sb-item"
                            style={{ color: resolvedSidebarMuted }}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                            <span>{item}</span>
                          </div>
                        )
                      )}

                      {/* Sidebar Bottom Account */}
                      <div className="wizard-sb-bottom">
                        <div className="wizard-sb-user">
                          <div className="wizard-sb-avatar">C</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>Café Owner</div>
                            <div style={{ fontSize: '0.62rem', opacity: 0.6 }}>Owner</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 7: OWNER INFORMATION
           ================================================================== */}
        {currentStep === 7 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">7. Owner Information</h2>
              <p className="wizard-section-sub">
                Create the owner account for this café. The owner will manage staff, menu and daily operations.
              </p>
            </div>

            {/* Informational Card Explaining Owner's Role */}
            <div className="wizard-info-callout">
              <div className="wizard-info-callout__icon">
                <User size={22} />
              </div>
              <div>
                <div className="wizard-info-callout__title">Owner Account Provisioning</div>
                <p className="wizard-info-callout__text">
                  The Admin account already exists directly on the platform. This step creates the <strong>Owner</strong> account
                  responsible for menu, staff, and daily orders. Staff accounts will later be created by the Owner.
                </p>
              </div>
            </div>

            <div className="wizard-form-grid">
              {/* Owner Name */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Owner Name <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <User size={16} className="wizard-input-icon" />
                  <input
                    type="text"
                    className="wizard-input wizard-input--with-icon"
                    placeholder="Rahul Mehta"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Owner Email */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Email Address <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <Mail size={16} className="wizard-input-icon" />
                  <input
                    type="email"
                    className="wizard-input wizard-input--with-icon"
                    placeholder="rahul@cafearoma.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Mobile Number <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-phone-wrap">
                  <div className="wizard-country-selector">
                    <span>🇮🇳</span>
                    <span>{ownerPhoneCode}</span>
                    <ChevronLeft size={12} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Set Password */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Set Password <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <Lock size={16} className="wizard-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="wizard-input wizard-input--with-icon wizard-input--with-right-icon"
                    placeholder="••••••••••"
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="wizard-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="wizard-form-field">
                <label className="wizard-label">
                  Confirm Password <span className="wizard-label__req">*</span>
                </label>
                <div className="wizard-input-wrap">
                  <Lock size={16} className="wizard-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="wizard-input wizard-input--with-icon wizard-input--with-right-icon"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="wizard-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Send Credentials Option */}
              <div className="wizard-form-field wizard-form-field--full">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={sendCredentials}
                    onChange={(e) => setSendCredentials(e.target.checked)}
                  />
                  <span>Send login credentials and welcome instructions to Owner via Email and SMS</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 8: REVIEW & CREATE
           ================================================================== */}
        {currentStep === 8 && (
          <div>
            <div className="wizard-section-header">
              <h2 className="wizard-section-title">8. Review & Create</h2>
              <p className="wizard-section-sub">
                Please review all the information below. You can go back and edit any section if needed.
              </p>
            </div>

            <div className="wizard-review-list">
              {/* Card 1: Basic Information */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">1</div>
                  <div className="wizard-review-row-title">Basic Information</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Café Name: <strong>{cafeName}</strong>
                    </div>
                    <div>
                      Description: <span>{tagline || 'No description provided'}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(1)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 2: Address */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">2</div>
                  <div className="wizard-review-row-title">Address</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Address:{' '}
                      <strong>
                        {addressLine1}, {addressLine2 ? addressLine2 + ', ' : ''}{cityName}, {stateName}, {country} - {postalCode}
                      </strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(2)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 3: Opening Hours */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">3</div>
                  <div className="wizard-review-row-title">Opening Hours</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Mon - Sun: <strong>09:00 AM - 11:00 PM</strong> (Fri/Sat: 12:00 AM)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(3)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 4: Locale */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">4</div>
                  <div className="wizard-review-row-title">Locale</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Currency: <strong>{currency}</strong>
                    </div>
                    <div>
                      Time Zone: <span>{timezone}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(4)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 5: Legal Information */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">5</div>
                  <div className="wizard-review-row-title">Legal Information</div>
                  <div className="wizard-review-row-content">
                    <div>
                      FSSAI Number: <strong>{fssaiNumber || 'N/A'}</strong>
                    </div>
                    <div>
                      GST Number: <span>{gstNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(5)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 6: Appearance */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">6</div>
                  <div className="wizard-review-row-title">Appearance</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Logo: <strong>Uploaded</strong> • Header Image: <strong>Uploaded</strong>
                    </div>
                    <div>
                      Brand Color: <span style={{ color: brandColor, fontWeight: 700 }}>{brandColor}</span> • Sidebar:{' '}
                      <span>Custom Colors</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(6)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>

              {/* Card 7: Owner Information */}
              <div className="wizard-review-row-card">
                <div className="wizard-review-row-left">
                  <div className="wizard-review-row-num">7</div>
                  <div className="wizard-review-row-title">Owner Information</div>
                  <div className="wizard-review-row-content">
                    <div>
                      Owner Name: <strong>{ownerName}</strong>
                    </div>
                    <div>
                      Email: <span>{ownerEmail}</span> • Mobile: <span>{ownerPhoneCode} {ownerPhone}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="wizard-edit-btn"
                  onClick={() => setCurrentStep(7)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="wizard-footer-actions">
          {currentStep === 1 ? (
            <button
              type="button"
              className="wizard-btn-cancel"
              onClick={() => setShowDiscardModal(true)}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              className="wizard-btn-back"
              onClick={handleBack}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              className="wizard-btn-next"
              onClick={handleNext}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="wizard-btn-create"
              onClick={() => setShowConfirmModal(true)}
            >
              <Check size={16} strokeWidth={3} /> Create Café
            </button>
          )}
        </div>
      </div>

      {/* ====================================================================
          CONFIRMATION MODAL: Create Café?
         ==================================================================== */}
      {showConfirmModal && (
        <div className="wizard-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="wizard-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="wizard-modal-title">Create Café?</h3>
            <p className="wizard-modal-desc">
              You are about to create this café and its owner account on CaféFlow.
            </p>

            <div className="wizard-modal-detail-box">
              <div className="wizard-modal-detail-row">
                <span>Café:</span>
                <strong>{cafeName}</strong>
              </div>
              <div className="wizard-modal-detail-row">
                <span>Owner:</span>
                <strong>{ownerName}</strong>
              </div>
              <div className="wizard-modal-detail-row">
                <span>Location:</span>
                <strong>{cityName}, {stateName}</strong>
              </div>
            </div>

            <div className="wizard-modal-actions">
              <button
                type="button"
                className="admin-btn-outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="wizard-btn-create"
                onClick={handleFinalCreateConfirm}
              >
                Create Café
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DISCARD MODAL: Discard Café Creation?
         ==================================================================== */}
      {showDiscardModal && (
        <div className="wizard-modal-overlay" onClick={() => setShowDiscardModal(false)}>
          <div className="wizard-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="wizard-modal-title">Discard Café Creation?</h3>
            <p className="wizard-modal-desc">
              Your entered information will be lost and you will be returned to the Cafés management page.
            </p>

            <div className="wizard-modal-actions">
              <button
                type="button"
                className="admin-btn-outline"
                onClick={() => setShowDiscardModal(false)}
              >
                Continue Editing
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={() => navigate('/admin/cafes')}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
