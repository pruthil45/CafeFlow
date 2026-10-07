import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCircle2,
  Store,
  User,
  UserCheck,
  PauseCircle,
  AlertTriangle,
  AlertCircle,
  Megaphone,
  Database,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Mail,
  MailCheck,
  X,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ADMIN_NOTIFICATIONS } from '../../../data/adminMockData';
import './Notifications.css';

export default function AdminNotifications() {
  const navigate = useNavigate();

  // State
  const [notifications, setNotifications] = useState(ADMIN_NOTIFICATIONS);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedNotif, setSelectedNotif] = useState(ADMIN_NOTIFICATIONS[0]);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Icon mapping
  const renderIcon = (type, size = 18) => {
    switch (type) {
      case 'store':
        return <Store size={size} />;
      case 'user':
        return <User size={size} />;
      case 'check':
        return <CheckCircle2 size={size} />;
      case 'pause':
        return <PauseCircle size={size} />;
      case 'settings':
        return <Database size={size} />;
      case 'alert':
        return <AlertCircle size={size} />;
      case 'megaphone':
        return <Megaphone size={size} />;
      default:
        return <Bell size={size} />;
    }
  };

  // Counts for tabs
  const tabCounts = useMemo(() => {
    const unread = notifications.filter((n) => n.unread).length;
    const cafes = notifications.filter((n) => n.category === 'cafes').length;
    const owners = notifications.filter((n) => n.category === 'owners').length;
    const system = notifications.filter((n) => n.category === 'system').length;
    const important = notifications.filter((n) => n.category === 'important').length;
    return {
      all: notifications.length,
      unread,
      cafes,
      owners,
      system,
      important,
    };
  }, [notifications]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    if (selectedTab === 'unread') {
      return notifications.filter((n) => n.unread);
    }
    if (selectedTab !== 'all') {
      return notifications.filter((n) => n.category === selectedTab);
    }
    return notifications;
  }, [notifications, selectedTab]);

  // Mark single as read/unread toggle
  const handleToggleRead = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    if (selectedNotif?.id === id) {
      setSelectedNotif((prev) => (prev ? { ...prev, unread: !prev.unread } : null));
    }
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (selectedNotif) {
      setSelectedNotif((prev) => (prev ? { ...prev, unread: false } : null));
    }
    triggerToast('All notifications marked as read.');
  };

  // Delete notification
  const handleDeleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotif?.id === id) {
      const remaining = notifications.filter((n) => n.id !== id);
      setSelectedNotif(remaining.length > 0 ? remaining[0] : null);
    }
    setMobileDetailOpen(false);
    triggerToast('Notification deleted.');
  };

  // Select notification (and auto mark as read on click)
  const handleSelectNotif = (notif) => {
    setSelectedNotif(notif);
    if (notif.unread) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
      );
    }
    setMobileDetailOpen(true);
  };

  return (
    <div className="admin-page admin-notif-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Notifications</h1>
          <p className="admin-page-subtitle">
            Stay updated with important platform activity and alerts.
          </p>
        </div>
        <button
          className="admin-btn-outline admin-notif-mark-btn"
          onClick={handleMarkAllRead}
          id="btn-mark-all-read"
        >
          <Check size={16} />
          Mark all as read
        </button>
      </div>

      {/* Category Tabs */}
      <div className="admin-notif-tabs">
        <button
          className={`admin-notif-tab ${selectedTab === 'all' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          <span>All</span>
          <span className="admin-notif-badge">{tabCounts.all}</span>
        </button>
        <button
          className={`admin-notif-tab ${selectedTab === 'unread' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('unread')}
        >
          <span>Unread</span>
          {tabCounts.unread > 0 && (
            <span className="admin-notif-badge admin-notif-badge--accent">
              {tabCounts.unread}
            </span>
          )}
        </button>
        <button
          className={`admin-notif-tab ${selectedTab === 'cafes' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('cafes')}
        >
          <span>Cafés</span>
          <span className="admin-notif-badge">{tabCounts.cafes}</span>
        </button>
        <button
          className={`admin-notif-tab ${selectedTab === 'owners' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('owners')}
        >
          <span>Owners</span>
          <span className="admin-notif-badge">{tabCounts.owners}</span>
        </button>
        <button
          className={`admin-notif-tab ${selectedTab === 'system' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('system')}
        >
          <span>System</span>
          <span className="admin-notif-badge">{tabCounts.system}</span>
        </button>
        <button
          className={`admin-notif-tab ${selectedTab === 'important' ? 'admin-notif-tab--active' : ''}`}
          onClick={() => setSelectedTab('important')}
        >
          <span>Important</span>
          <span className="admin-notif-badge">{tabCounts.important}</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="admin-notif-layout">
        {/* Left: Notifications List */}
        <div className="admin-notif-list">
          {filteredNotifications.length === 0 ? (
            <div className="admin-notif-empty">
              <Bell size={40} className="admin-notif-empty-icon" />
              <h3>No notifications found</h3>
              <p>There are no notifications in this category right now.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isSelected = selectedNotif?.id === notif.id;
              return (
                <div
                  key={notif.id}
                  className={`admin-notif-card ${isSelected ? 'admin-notif-card--selected' : ''} ${notif.unread ? 'admin-notif-card--unread' : ''}`}
                  onClick={() => handleSelectNotif(notif)}
                >
                  <div
                    className="admin-notif-icon-box"
                    style={{ backgroundColor: notif.iconBg, color: notif.iconColor }}
                  >
                    {renderIcon(notif.iconType, 18)}
                  </div>

                  <div className="admin-notif-card__content">
                    <div className="admin-notif-card__top">
                      <h4 className="admin-notif-card__title">{notif.title}</h4>
                      <div className="admin-notif-card__meta">
                        <span className="admin-notif-time">{notif.time}</span>
                        {notif.unread && <span className="admin-notif-unread-dot" />}
                      </div>
                    </div>

                    <p className="admin-notif-card__desc">{notif.desc}</p>

                    <div className="admin-notif-card__tags">
                      {notif.cafeName && (
                        <span className="admin-notif-tag">
                          <Store size={12} /> {notif.cafeName}
                        </span>
                      )}
                      {notif.ownerName && (
                        <span className="admin-notif-tag">
                          <User size={12} /> Owner: {notif.ownerName}
                        </span>
                      )}
                      {notif.createdBy && (
                        <span className="admin-notif-tag">
                          Created by {notif.createdBy}
                        </span>
                      )}
                      {notif.systemComponent && (
                        <span className="admin-notif-tag admin-notif-tag--system">
                          System: {notif.systemComponent}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Desktop Notification Details Panel */}
        {selectedNotif && (
          <div className="admin-notif-detail-panel">
            <div className="admin-notif-detail-header">
              <div
                className="admin-notif-detail-hero-icon"
                style={{
                  backgroundColor: selectedNotif.iconBg,
                  color: selectedNotif.iconColor,
                }}
              >
                {renderIcon(selectedNotif.iconType, 24)}
              </div>
              <button
                className="admin-notif-close-btn"
                onClick={() => setSelectedNotif(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-notif-detail-body">
              <h2 className="admin-notif-detail-title">{selectedNotif.title}</h2>
              <div className="admin-notif-detail-time">
                <Clock size={13} /> {selectedNotif.time} ({selectedNotif.fullTime})
              </div>

              <p className="admin-notif-detail-desc">{selectedNotif.desc}</p>

              {/* Metadata Info Rows */}
              <div className="admin-notif-info-card">
                {selectedNotif.cafeName && (
                  <div className="admin-notif-info-row">
                    <span className="admin-notif-info-label">
                      <Store size={14} /> Café Name
                    </span>
                    <span className="admin-notif-info-val">
                      {selectedNotif.cafeName}
                    </span>
                  </div>
                )}
                {selectedNotif.ownerName && (
                  <div className="admin-notif-info-row">
                    <span className="admin-notif-info-label">
                      <User size={14} /> Owner
                    </span>
                    <span className="admin-notif-info-val">
                      {selectedNotif.ownerName}
                    </span>
                  </div>
                )}
                {selectedNotif.location && (
                  <div className="admin-notif-info-row">
                    <span className="admin-notif-info-label">
                      <MapPin size={14} /> Location
                    </span>
                    <span className="admin-notif-info-val">
                      {selectedNotif.location}
                    </span>
                  </div>
                )}
                <div className="admin-notif-info-row">
                  <span className="admin-notif-info-label">
                    <Calendar size={14} /> Created
                  </span>
                  <span className="admin-notif-info-val">
                    {selectedNotif.fullTime}
                  </span>
                </div>
                <div className="admin-notif-info-row">
                  <span className="admin-notif-info-label">
                    <UserCheck size={14} /> Created By
                  </span>
                  <span className="admin-notif-info-val">
                    {selectedNotif.createdBy || 'System'}
                  </span>
                </div>
              </div>

              {/* Café Branding Hero Card if applicable */}
              {selectedNotif.cafeName && (
                <div className="admin-notif-cafe-preview">
                  <div className="admin-notif-cafe-preview-overlay">
                    <div className="admin-notif-cafe-logo-badge">
                      {selectedNotif.cafeName.charAt(0)}
                    </div>
                    <div className="admin-notif-cafe-preview-title">
                      {selectedNotif.cafeName}
                    </div>
                    <div className="admin-notif-cafe-preview-sub">
                      {selectedNotif.location || 'Vadodara, Gujarat'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="admin-notif-detail-actions">
              {selectedNotif.cafeId && (
                <button
                  className="admin-btn-primary admin-notif-btn-view-cafe"
                  onClick={() => navigate('/admin/cafes')}
                >
                  <ExternalLink size={16} /> View Café
                </button>
              )}

              <div className="admin-notif-detail-btn-row">
                <button
                  className="admin-btn-outline"
                  onClick={(e) => handleToggleRead(selectedNotif.id, e)}
                >
                  {selectedNotif.unread ? (
                    <>
                      <MailCheck size={15} /> Mark as read
                    </>
                  ) : (
                    <>
                      <Mail size={15} /> Mark as unread
                    </>
                  )}
                </button>

                <button
                  className="admin-btn-outline admin-notif-btn-delete"
                  onClick={() => handleDeleteNotif(selectedNotif.id)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Mobile Notification Details Screen (Slide-over/View) */}
      {mobileDetailOpen && selectedNotif && (
        <div className="admin-mobile-notif-screen">
          <div className="admin-mobile-notif-screen__header">
            <button
              className="admin-mobile-back-btn"
              onClick={() => setMobileDetailOpen(false)}
            >
              <ArrowLeft size={18} />
            </button>
            <h3>Notification Details</h3>
            <button
              className="admin-mobile-close-btn"
              onClick={() => setMobileDetailOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-mobile-notif-screen__body">
            <div
              className="admin-notif-detail-hero-icon"
              style={{
                backgroundColor: selectedNotif.iconBg,
                color: selectedNotif.iconColor,
                margin: '0 auto 16px',
              }}
            >
              {renderIcon(selectedNotif.iconType, 28)}
            </div>

            <h2 className="admin-notif-detail-title" style={{ textAlign: 'center' }}>
              {selectedNotif.title}
            </h2>
            <div className="admin-notif-detail-time" style={{ justifyContent: 'center' }}>
              <Clock size={13} /> {selectedNotif.time}
            </div>

            <p className="admin-notif-detail-desc" style={{ textAlign: 'center' }}>
              {selectedNotif.desc}
            </p>

            <div className="admin-notif-info-card">
              {selectedNotif.cafeName && (
                <div className="admin-notif-info-row">
                  <span className="admin-notif-info-label">
                    <Store size={14} /> Café Name
                  </span>
                  <span className="admin-notif-info-val">
                    {selectedNotif.cafeName}
                  </span>
                </div>
              )}
              {selectedNotif.ownerName && (
                <div className="admin-notif-info-row">
                  <span className="admin-notif-info-label">
                    <User size={14} /> Owner
                  </span>
                  <span className="admin-notif-info-val">
                    {selectedNotif.ownerName}
                  </span>
                </div>
              )}
              {selectedNotif.location && (
                <div className="admin-notif-info-row">
                  <span className="admin-notif-info-label">
                    <MapPin size={14} /> Location
                  </span>
                  <span className="admin-notif-info-val">
                    {selectedNotif.location}
                  </span>
                </div>
              )}
              <div className="admin-notif-info-row">
                <span className="admin-notif-info-label">
                  <Calendar size={14} /> Created
                </span>
                <span className="admin-notif-info-val">
                  {selectedNotif.fullTime}
                </span>
              </div>
              <div className="admin-notif-info-row">
                <span className="admin-notif-info-label">
                  <UserCheck size={14} /> Created By
                </span>
                <span className="admin-notif-info-val">
                  {selectedNotif.createdBy || 'System'}
                </span>
              </div>
            </div>

            {selectedNotif.cafeName && (
              <div className="admin-notif-cafe-preview">
                <div className="admin-notif-cafe-preview-overlay">
                  <div className="admin-notif-cafe-logo-badge">
                    {selectedNotif.cafeName.charAt(0)}
                  </div>
                  <div className="admin-notif-cafe-preview-title">
                    {selectedNotif.cafeName}
                  </div>
                  <div className="admin-notif-cafe-preview-sub">
                    {selectedNotif.location}
                  </div>
                </div>
              </div>
            )}

            <div className="admin-mobile-notif-actions">
              {selectedNotif.cafeId && (
                <button
                  className="admin-btn-primary"
                  style={{ width: '100%', marginBottom: 10 }}
                  onClick={() => navigate('/admin/cafes')}
                >
                  <ExternalLink size={16} /> View Café
                </button>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="admin-btn-outline"
                  style={{ flex: 1 }}
                  onClick={(e) => handleToggleRead(selectedNotif.id, e)}
                >
                  {selectedNotif.unread ? 'Mark as read' : 'Mark as unread'}
                </button>

                <button
                  className="admin-btn-outline admin-notif-btn-delete"
                  style={{ flex: 1 }}
                  onClick={() => handleDeleteNotif(selectedNotif.id)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
