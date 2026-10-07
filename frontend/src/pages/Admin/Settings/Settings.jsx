import { useState } from 'react';
import {
  User,
  Building,
  Store,
  Palette,
  Receipt,
  CreditCard,
  Bell,
  MessageCircle,
  Sliders,
  Camera,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Globe,
  Check,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  X,
  Upload,
  Sparkles,
} from 'lucide-react';
import { ADMIN_SETTINGS_DATA } from '../../../data/adminMockData';
import './Settings.css';

export default function AdminSettings() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('account');
  const [mobileSubPage, setMobileSubPage] = useState(null); // null = menu list, or section id

  // Form State initialized from mock data
  const [settings, setSettings] = useState(ADMIN_SETTINGS_DATA);
  const [toastMessage, setToastMessage] = useState(null);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('admin123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Modals state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [otp2FA, setOtp2FA] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save changes handler
  const handleSaveChanges = (sectionName) => {
    triggerToast(`${sectionName || 'Settings'} saved successfully!`);
  };

  // Nav Items Definition (Matched to Image 3)
  const NAV_ITEMS = [
    {
      id: 'account',
      title: 'Admin Account',
      sub: 'Manage your account',
      icon: User,
    },
    {
      id: 'profile',
      title: 'Platform Profile',
      sub: 'Platform name, contact info',
      icon: Building,
    },
    {
      id: 'cafe-defaults',
      title: 'Default Café Settings',
      sub: 'Default configuration for new cafés',
      icon: Store,
    },
    {
      id: 'branding',
      title: 'Default Branding',
      sub: 'Logo, colors and theme',
      icon: Palette,
    },
    {
      id: 'tax',
      title: 'Default Tax Settings',
      sub: 'Tax configuration for new cafés',
      icon: Receipt,
    },
    {
      id: 'payments',
      title: 'Default Payment Options',
      sub: 'Payment methods for new cafés',
      icon: CreditCard,
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      sub: 'Platform notification preferences',
      icon: Bell,
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Configuration',
      sub: 'WhatsApp API settings',
      icon: MessageCircle,
      isGreen: true,
    },
    {
      id: 'system',
      title: 'System Settings',
      sub: 'General platform settings',
      icon: Sliders,
    },
  ];

  // Logout session simulation
  const handleLogoutSession = (sessionId) => {
    setSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        activeSessions: prev.account.activeSessions.filter((s) => s.id !== sessionId),
      },
    }));
    triggerToast('Session terminated successfully.');
  };

  // 2FA Enable simulation
  const handleEnable2FA = () => {
    if (!otp2FA || otp2FA.length < 6) {
      triggerToast('Please enter a valid 6-digit verification code.');
      return;
    }
    setSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        twoFactorEnabled: true,
      },
    }));
    setShow2FAModal(false);
    setOtp2FA('');
    triggerToast('Two-Factor Authentication enabled successfully!');
  };

  // Render Sub-Content by Section
  const renderContent = (tabId) => {
    switch (tabId) {
      case 'account':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Admin Account</h2>
                <p className="admin-settings-sub">
                  Manage your profile, email and security settings.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Admin Account')}
              >
                Save Changes
              </button>
            </div>

            {/* Profile Info Card */}
            <div className="admin-settings-card">
              <div className="admin-settings-profile-row">
                {/* Avatar with camera button */}
                <div className="admin-settings-avatar-wrap">
                  <div className="admin-settings-avatar">
                    {settings.account.avatar}
                  </div>
                  <button
                    className="admin-settings-avatar-cam"
                    title="Upload/change photo"
                    onClick={() => triggerToast('Photo upload selector opened.')}
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="admin-settings-fields-grid">
                  <div className="admin-settings-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="admin-settings-input"
                      value={settings.account.fullName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          account: { ...prev.account, fullName: e.target.value },
                        }))
                      }
                    />
                  </div>

                  <div className="admin-settings-field">
                    <label>Role</label>
                    <div>
                      <span className="admin-settings-role-badge">
                        {settings.account.role}
                      </span>
                    </div>
                  </div>

                  <div className="admin-settings-field admin-settings-field--full">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="admin-settings-input"
                      value={settings.account.email}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          account: { ...prev.account, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Change Password</h3>
              <div className="admin-settings-pw-grid">
                <div className="admin-settings-field">
                  <label>Current Password</label>
                  <div className="admin-pw-wrap">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      className="admin-settings-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="admin-pw-eye"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="admin-settings-field">
                  <label>New Password</label>
                  <div className="admin-pw-wrap">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      className="admin-settings-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="admin-pw-eye"
                      onClick={() => setShowNewPw(!showNewPw)}
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="admin-settings-field">
                  <label>Confirm New Password</label>
                  <div className="admin-pw-wrap">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      className="admin-settings-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="admin-pw-eye"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                    >
                      {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication Card */}
            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Two-Factor Authentication</h3>
              <p className="admin-settings-card-sub">
                Add an extra layer of security to your account.
              </p>

              <div className="admin-settings-2fa-banner">
                <div className="admin-settings-2fa-left">
                  <div className="admin-settings-2fa-icon">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="admin-settings-2fa-heading">
                      {settings.account.twoFactorEnabled
                        ? 'Two-Factor Authentication is enabled'
                        : 'Two-Factor Authentication is disabled'}
                    </h4>
                    <p className="admin-settings-2fa-text">
                      {settings.account.twoFactorEnabled
                        ? 'Your account is secured with authenticator app 2FA.'
                        : 'Protect your account with 2FA using an authenticator app.'}
                    </p>
                  </div>
                </div>

                <button
                  className="admin-btn-outline"
                  onClick={() => setShow2FAModal(true)}
                >
                  {settings.account.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            {/* Active Sessions Card */}
            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Active Sessions</h3>
              <p className="admin-settings-card-sub">
                Manage your active login sessions.
              </p>

              <div className="admin-settings-sessions-list">
                {settings.account.activeSessions.map((sess) => (
                  <div key={sess.id} className="admin-session-item">
                    <div className="admin-session-left">
                      <div className="admin-session-icon">
                        {sess.icon === 'chrome' ? (
                          <Globe size={20} color="#2563eb" />
                        ) : (
                          <Smartphone size={20} color="#059669" />
                        )}
                      </div>
                      <div>
                        <div className="admin-session-device-row">
                          <span className="admin-session-device">{sess.device}</span>
                          {sess.isCurrent && (
                            <span className="admin-session-current-pill">
                              Current Session
                            </span>
                          )}
                        </div>
                        <div className="admin-session-meta">
                          <span>{sess.location}</span> • <span>Last active: {sess.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        className="admin-btn-outline admin-session-logout-btn"
                        onClick={() => handleLogoutSession(sess.id)}
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Platform Profile</h2>
                <p className="admin-settings-sub">
                  Configure platform name, branding information and contact channels.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Platform Profile')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <div className="admin-settings-form-grid">
                <div className="admin-settings-field">
                  <label>Platform Name</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.platformProfile.platformName}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, platformName: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field">
                  <label>Website URL</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.platformProfile.website}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, website: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field admin-settings-field--full">
                  <label>Platform Description</label>
                  <textarea
                    className="admin-settings-textarea"
                    rows={3}
                    value={settings.platformProfile.description}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, description: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field">
                  <label>Support Email</label>
                  <input
                    type="email"
                    className="admin-settings-input"
                    value={settings.platformProfile.supportEmail}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, supportEmail: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field">
                  <label>Support Phone</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.platformProfile.supportPhone}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, supportPhone: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field admin-settings-field--full">
                  <label>Headquarters Business Address</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.platformProfile.businessAddress}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, businessAddress: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field admin-settings-field--full">
                  <label>Support Business Hours</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.platformProfile.businessHours}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        platformProfile: { ...p.platformProfile, businessHours: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'cafe-defaults':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Default Café Settings</h2>
                <p className="admin-settings-sub">
                  Define baseline configuration automatically applied when new cafés register.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Default Café Settings')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Localization & Operations</h3>
              <div className="admin-settings-form-grid">
                <div className="admin-settings-field">
                  <label>Default Currency</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.defaultCafe.currency}
                    readOnly
                  />
                </div>
                <div className="admin-settings-field">
                  <label>Default Timezone</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.defaultCafe.timezone}
                    readOnly
                  />
                </div>
                <div className="admin-settings-field">
                  <label>Standard Business Hours</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.defaultCafe.businessHours}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        defaultCafe: { ...p.defaultCafe, businessHours: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="admin-settings-field">
                  <label>Default Tables Count</label>
                  <input
                    type="number"
                    className="admin-settings-input"
                    value={settings.defaultCafe.defaultTables}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        defaultCafe: { ...p.defaultCafe, defaultTables: Number(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Digital Ordering & Features</h3>
              <div className="admin-settings-toggles-list">
                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Table QR Ordering</div>
                    <div className="admin-toggle-sub">Enable QR code contactless ordering at tables by default</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.defaultCafe.qrOrdering}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        defaultCafe: { ...p.defaultCafe, qrOrdering: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Auto-Enroll in Loyalty</div>
                    <div className="admin-toggle-sub">Automatically create customer loyalty membership on first order</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.defaultCafe.autoEnrollLoyalty}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        defaultCafe: { ...p.defaultCafe, autoEnrollLoyalty: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Audible Order Alerts</div>
                    <div className="admin-toggle-sub">Play chime sound in staff dashboard on new incoming orders</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.defaultCafe.soundAlerts}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        defaultCafe: { ...p.defaultCafe, soundAlerts: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'branding':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Default Branding</h2>
                <p className="admin-settings-sub">
                  Configure default theme colors, logos and storefront appearance.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Default Branding')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-split-preview">
              <div className="admin-settings-card" style={{ flex: 1 }}>
                <h3 className="admin-settings-card-title">Color Palette & Theme</h3>
                <div className="admin-settings-form-grid">
                  <div className="admin-settings-field">
                    <label>Brand Primary Color</label>
                    <div className="admin-color-picker-wrap">
                      <input
                        type="color"
                        value={settings.defaultBranding.brandColor}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            defaultBranding: { ...p.defaultBranding, brandColor: e.target.value },
                          }))
                        }
                      />
                      <span className="font-mono">{settings.defaultBranding.brandColor}</span>
                    </div>
                  </div>

                  <div className="admin-settings-field">
                    <label>Active Accent Color</label>
                    <div className="admin-color-picker-wrap">
                      <input
                        type="color"
                        value={settings.defaultBranding.activeAccent}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            defaultBranding: { ...p.defaultBranding, activeAccent: e.target.value },
                          }))
                        }
                      />
                      <span className="font-mono">{settings.defaultBranding.activeAccent}</span>
                    </div>
                  </div>

                  <div className="admin-settings-field">
                    <label>Sidebar Background</label>
                    <div className="admin-color-picker-wrap">
                      <input
                        type="color"
                        value={settings.defaultBranding.sidebarBg}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            defaultBranding: { ...p.defaultBranding, sidebarBg: e.target.value },
                          }))
                        }
                      />
                      <span className="font-mono">{settings.defaultBranding.sidebarBg}</span>
                    </div>
                  </div>

                  <div className="admin-settings-field">
                    <label>Sidebar Text Color</label>
                    <div className="admin-color-picker-wrap">
                      <input
                        type="color"
                        value={settings.defaultBranding.sidebarText}
                        onChange={(e) =>
                          setSettings((p) => ({
                            ...p,
                            defaultBranding: { ...p.defaultBranding, sidebarText: e.target.value },
                          }))
                        }
                      />
                      <span className="font-mono">{settings.defaultBranding.sidebarText}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Interactive Preview Card */}
              <div className="admin-settings-card admin-live-preview-box" style={{ width: 280 }}>
                <span className="admin-preview-pill">
                  <Sparkles size={13} /> Live Preview
                </span>
                <div
                  className="admin-live-mock-card"
                  style={{ backgroundColor: settings.defaultBranding.sidebarBg }}
                >
                  <div className="admin-live-mock-header">
                    <div
                      className="admin-live-mock-badge"
                      style={{ backgroundColor: settings.defaultBranding.brandColor }}
                    >
                      ☕
                    </div>
                    <span style={{ color: settings.defaultBranding.sidebarText, fontWeight: 700 }}>
                      Café Demo
                    </span>
                  </div>
                  <div
                    className="admin-live-mock-item"
                    style={{
                      backgroundColor: settings.defaultBranding.activeAccent,
                      color: '#1a0e0a',
                    }}
                  >
                    Active Navigation Item
                  </div>
                  <div
                    className="admin-live-mock-item admin-live-mock-item--inactive"
                    style={{ color: settings.defaultBranding.sidebarText }}
                  >
                    Inactive Menu Item
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tax':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Default Tax Settings</h2>
                <p className="admin-settings-sub">
                  Configure default tax percentage and behavior for all platform dining orders.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Default Tax Settings')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <div className="admin-settings-form-grid">
                <div className="admin-settings-field">
                  <label>Tax Name</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.tax.name}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        tax: { ...p.tax, name: e.target.value },
                      }))
                    }
                  />
                </div>

                <div className="admin-settings-field">
                  <label>Tax Percentage (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="admin-settings-input"
                    value={settings.tax.percentage}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        tax: { ...p.tax, percentage: Number(e.target.value) },
                      }))
                    }
                  />
                </div>
              </div>

              <div className="admin-settings-toggles-list" style={{ marginTop: 20 }}>
                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Enable Platform Tax</div>
                    <div className="admin-toggle-sub">Calculate GST tax on food and beverage bills</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.tax.enabled}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        tax: { ...p.tax, enabled: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Tax Inclusive Menu Pricing</div>
                    <div className="admin-toggle-sub">Menu prices already include taxes (exclusive if unchecked)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.tax.inclusive}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        tax: { ...p.tax, inclusive: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Default Payment Options</h2>
                <p className="admin-settings-sub">
                  Enable or disable default payment methods for newly onboarded cafés.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Default Payment Options')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <div className="admin-settings-toggles-list">
                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Cash on Counter</div>
                    <div className="admin-toggle-sub">Physical cash payment accepted at cashier register</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment.cash}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        payment: { ...p.payment, cash: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Credit & Debit Cards</div>
                    <div className="admin-toggle-sub">Swipe, chip and tap contactless POS terminal payments</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment.card}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        payment: { ...p.payment, card: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">UPI / QR Code / GPay / PhonePe</div>
                    <div className="admin-toggle-sub">Instant zero-fee direct bank UPI transfers via dynamic QR</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment.upi}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        payment: { ...p.payment, upi: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">Notification Settings</h2>
                <p className="admin-settings-sub">
                  Configure platform-level event notifications and delivery channels.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('Notification Settings')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Platform Event Triggers</h3>
              <div className="admin-settings-toggles-list">
                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">New Café Created</div>
                    <div className="admin-toggle-sub">Notify admin when a new café registers on the platform</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newCafeCreated}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        notifications: { ...p.notifications, newCafeCreated: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Café Status Changes (Activate/Deactivate)</div>
                    <div className="admin-toggle-sub">Notify when a café goes live or is deactivated</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.cafeActivated}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        notifications: { ...p.notifications, cafeActivated: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>

                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">System & Security Alerts</div>
                    <div className="admin-toggle-sub">High server latency, database backup or error notices</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        notifications: { ...p.notifications, systemAlerts: e.target.checked },
                      }))
                    }
                    className="admin-toggle-switch"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'whatsapp':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">WhatsApp Configuration</h2>
                <p className="admin-settings-sub">
                  Configure WhatsApp Cloud API integration for automated order receipts and alerts.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('WhatsApp Configuration')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <div className="admin-settings-status-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MessageCircle size={22} color="#16a34a" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1a0e0a' }}>
                      Status: Connected & Operational
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716c' }}>
                      Official WhatsApp Business Account linked and verified.
                    </p>
                  </div>
                </div>
                <span className="admin-status-pill admin-status-pill--active">
                  <span className="admin-status-dot" /> Connected
                </span>
              </div>

              <div className="admin-settings-form-grid" style={{ marginTop: 20 }}>
                <div className="admin-settings-field">
                  <label>Business Account Name</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.whatsapp.accountName}
                    readOnly
                  />
                </div>

                <div className="admin-settings-field">
                  <label>WhatsApp Phone Number</label>
                  <input
                    type="text"
                    className="admin-settings-input"
                    value={settings.whatsapp.phone}
                    readOnly
                  />
                </div>

                <div className="admin-settings-field admin-settings-field--full">
                  <label>Meta Cloud API Key</label>
                  <input
                    type="password"
                    className="admin-settings-input"
                    value={settings.whatsapp.apiKey}
                    readOnly
                  />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <button
                  className="admin-btn-outline"
                  onClick={() => triggerToast('Test WhatsApp template message sent to +91 98765 00099!')}
                >
                  Send Test WhatsApp Message
                </button>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="admin-settings-section">
            <div className="admin-settings-section__header">
              <div>
                <h2 className="admin-settings-title">System Settings</h2>
                <p className="admin-settings-sub">
                  General platform controls, session security and maintenance options.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                onClick={() => handleSaveChanges('System Settings')}
              >
                Save Changes
              </button>
            </div>

            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Platform Health & Maintenance</h3>
              <div className="admin-settings-toggles-list">
                <label className="admin-toggle-row">
                  <div>
                    <div className="admin-toggle-title">Scheduled Maintenance Mode</div>
                    <div className="admin-toggle-sub">Shows a friendly maintenance notice to customers and staff</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={() => setShowMaintenanceModal(true)}
                    className="admin-toggle-switch"
                  />
                </label>
              </div>
            </div>

            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">Session & Data Retention</h3>
              <div className="admin-settings-form-grid">
                <div className="admin-settings-field">
                  <label>Session Timeout</label>
                  <select
                    className="admin-filter-select"
                    style={{ width: '100%' }}
                    value={settings.system.sessionTimeout}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        system: { ...p.system, sessionTimeout: e.target.value },
                      }))
                    }
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="4 hours">4 hours</option>
                    <option value="12 hours">12 hours</option>
                    <option value="24 hours">24 hours</option>
                  </select>
                </div>

                <div className="admin-settings-field">
                  <label>Audit Log Retention</label>
                  <select
                    className="admin-filter-select"
                    style={{ width: '100%' }}
                    value={settings.system.dataRetention}
                    onChange={(e) =>
                      setSettings((p) => ({
                        ...p,
                        system: { ...p.system, dataRetention: e.target.value },
                      }))
                    }
                  >
                    <option value="90 days">90 days</option>
                    <option value="180 days">180 days</option>
                    <option value="1 year">1 year</option>
                    <option value="Indefinite">Indefinite</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page admin-settings-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Page Header (Desktop) */}
      <div className="admin-page-header admin-settings-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">
            Manage platform configuration, defaults and system settings.
          </p>
        </div>
      </div>

      {/* Desktop Layout: Left Nav + Right Content */}
      <div className="admin-settings-layout">
        {/* Left Settings Navigation Menu */}
        <div className="admin-settings-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`admin-settings-nav-item ${isActive ? 'admin-settings-nav-item--active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div
                  className={`admin-settings-nav-icon ${item.isGreen ? 'admin-settings-nav-icon--green' : ''}`}
                >
                  <Icon size={18} />
                </div>
                <div className="admin-settings-nav-text">
                  <div className="admin-settings-nav-title">{item.title}</div>
                  <div className="admin-settings-nav-sub">{item.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Settings Content */}
        <div className="admin-settings-content">
          {renderContent(activeTab)}
        </div>
      </div>

      {/* Mobile Settings Composition (Matched to Image 3 Mobile) */}
      <div className="admin-settings-mobile-container">
        {mobileSubPage === null ? (
          // Mobile Settings Menu List
          <div className="admin-settings-mobile-list">
            <div className="admin-settings-mobile-intro">
              <h2 className="admin-page-title" style={{ fontSize: '1.4rem' }}>
                Settings
              </h2>
              <p className="admin-page-subtitle">
                Manage platform configuration.
              </p>
            </div>

            <div className="admin-settings-mobile-cards-stack">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="admin-settings-mobile-card-row"
                    onClick={() => setMobileSubPage(item.id)}
                  >
                    <div className="admin-settings-mobile-card-left">
                      <div
                        className={`admin-settings-nav-icon ${item.isGreen ? 'admin-settings-nav-icon--green' : ''}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="admin-settings-nav-title">
                          {item.title}
                        </div>
                        <div className="admin-settings-nav-sub">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="admin-settings-mobile-chevron" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Dedicated Mobile Sub-Setting Screen
          <div className="admin-settings-mobile-subpage">
            <div className="admin-settings-mobile-subpage-header">
              <button
                className="admin-mobile-back-btn"
                onClick={() => setMobileSubPage(null)}
              >
                <ArrowLeft size={18} />
              </button>
              <h3>
                {NAV_ITEMS.find((n) => n.id === mobileSubPage)?.title || 'Settings'}
              </h3>
              <div style={{ width: 28 }} />
            </div>

            <div className="admin-settings-mobile-subpage-body">
              {renderContent(mobileSubPage)}
            </div>
          </div>
        )}
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: 440 }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Enable Two-Factor Authentication</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShow2FAModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.86rem', color: '#57534e', marginTop: 0 }}>
                Scan this QR code with Google Authenticator or 1Password, then enter the 6-digit code.
              </p>

              {/* Mock QR Code Display */}
              <div className="admin-2fa-qr-box">
                <div className="admin-2fa-qr-graphic">
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <rect width="100" height="100" fill="#fff" />
                    <rect x="10" y="10" width="25" height="25" fill="#1a0e0a" />
                    <rect x="15" y="15" width="15" height="15" fill="#fff" />
                    <rect x="65" y="10" width="25" height="25" fill="#1a0e0a" />
                    <rect x="70" y="15" width="15" height="15" fill="#fff" />
                    <rect x="10" y="65" width="25" height="25" fill="#1a0e0a" />
                    <rect x="15" y="70" width="15" height="15" fill="#fff" />
                    <rect x="45" y="45" width="10" height="10" fill="#c95b28" />
                    <rect x="40" y="15" width="10" height="20" fill="#1a0e0a" />
                    <rect x="65" y="45" width="20" height="10" fill="#1a0e0a" />
                    <rect x="45" y="70" width="15" height="15" fill="#1a0e0a" />
                  </svg>
                </div>
                <span className="admin-2fa-secret">KEY: CAFE-FLOW-ADMIN-AUTH</span>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#44403c' }}>
                  6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="admin-settings-input"
                  style={{ textAlign: 'center', letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: 700 }}
                  value={otp2FA}
                  onChange={(e) => setOtp2FA(e.target.value)}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn-outline"
                onClick={() => setShow2FAModal(false)}
              >
                Cancel
              </button>
              <button className="admin-btn-primary" onClick={handleEnable2FA}>
                Verify & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Mode Confirmation Modal */}
      {showMaintenanceModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card" style={{ maxWidth: 420 }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626' }}>
                <AlertTriangle size={20} />
                <h3 className="admin-modal-title" style={{ color: '#dc2626' }}>
                  Toggle Maintenance Mode?
                </h3>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setShowMaintenanceModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.86rem', color: '#44403c', margin: 0, lineHeight: 1.5 }}>
                Enabling maintenance mode will temporarily pause customer order placement across all active cafés on CaféFlow. Admins will retain access.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn-outline"
                onClick={() => setShowMaintenanceModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn-primary"
                style={{ background: '#dc2626' }}
                onClick={() => {
                  setSettings((p) => ({
                    ...p,
                    system: {
                      ...p.system,
                      maintenanceMode: !p.system.maintenanceMode,
                    },
                  }));
                  setShowMaintenanceModal(false);
                  triggerToast('Maintenance mode status updated.');
                }}
              >
                Confirm Toggle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
